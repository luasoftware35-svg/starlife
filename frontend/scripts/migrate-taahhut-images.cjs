#!/usr/bin/env node
/**
 * Migrate taahhüt project images to Supabase Storage.
 *
 * Tries, in order:
 * 1. Local file: public/anaresim/* or public/icerikresmi/*
 * 2. Remote URL from mock data (or SOURCE_BASE + path)
 *
 * Usage:
 *   npm run migrate:taahhut-images
 *   SOURCE_BASE=https://old-host.example.com npm run migrate:taahhut-images
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createClient } = require('@supabase/supabase-js');

const root = path.join(__dirname, '..');
const publicRoot = path.join(root, 'public');
const SOURCE_BASE = (process.env.SOURCE_BASE || '').replace(/\/$/, '');

function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    const envPath = path.join(root, file);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (process.env[key]) continue;
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

loadEnvFiles();

const url = process.env.REACT_APP_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing REACT_APP_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function loadTaahhutProjects() {
  const file = path.join(root, 'src/mock/taahhutProjects.js');
  const code = fs.readFileSync(file, 'utf8').replace('export const TAAHHUT_PROJECTS', 'const TAAHHUT_PROJECTS');
  return vm.runInNewContext(`${code}\nTAAHHUT_PROJECTS;`, {}, { filename: file });
}

function isImageBuffer(buffer) {
  if (!buffer || buffer.length < 12) return false;
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return true;
  if (buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP') return true;
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return true;
  return false;
}

function contentTypeFor(name) {
  const ext = path.extname(name).toLowerCase();
  if (ext === '.webp') return 'image/webp';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

function localCandidates(imageUrl) {
  try {
    const { pathname } = new URL(imageUrl);
    return [path.join(publicRoot, pathname)];
  } catch {
    return [];
  }
}

async function fetchRemote(imageUrl) {
  const candidates = [imageUrl];
  if (SOURCE_BASE) {
    try {
      const { pathname } = new URL(imageUrl);
      candidates.unshift(`${SOURCE_BASE}${pathname}`);
    } catch {
      // ignore
    }
  }

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate);
      if (!response.ok) continue;
      const type = response.headers.get('content-type') || '';
      if (type.includes('text/html')) continue;
      const buffer = Buffer.from(await response.arrayBuffer());
      if (!isImageBuffer(buffer)) continue;
      return { buffer, source: candidate };
    } catch {
      // try next
    }
  }
  return null;
}

async function loadImage(imageUrl) {
  for (const localPath of localCandidates(imageUrl)) {
    if (fs.existsSync(localPath)) {
      const buffer = fs.readFileSync(localPath);
      if (isImageBuffer(buffer)) {
        return { buffer, source: localPath };
      }
    }
  }
  return fetchRemote(imageUrl);
}

async function uploadImage(slug, imageUrl, cache) {
  if (cache.has(imageUrl)) return cache.get(imageUrl);

  const filename = path.basename(new URL(imageUrl).pathname);
  const storagePath = `taahhut-import/${slug}/${filename}`;
  const loaded = await loadImage(imageUrl);

  if (!loaded) {
    console.warn(`  ✗ Could not load: ${imageUrl}`);
    cache.set(imageUrl, null);
    return null;
  }

  const { error } = await supabase.storage.from('media').upload(storagePath, loaded.buffer, {
    upsert: true,
    contentType: contentTypeFor(filename),
  });

  if (error) {
    console.warn(`  ✗ Upload failed (${filename}): ${error.message}`);
    cache.set(imageUrl, null);
    return null;
  }

  const { data } = supabase.storage.from('media').getPublicUrl(storagePath);
  console.log(`  ✓ ${filename} ← ${loaded.source}`);
  cache.set(imageUrl, data.publicUrl);
  return data.publicUrl;
}

async function main() {
  const projects = loadTaahhutProjects();
  const cache = new Map();
  let migrated = 0;
  let failed = 0;

  for (const project of projects) {
    console.log(`\n${project.title} (${project.slug})`);
    const urls = [...new Set([project.image, ...(project.images || [])].filter(Boolean))];
    const mapped = [];

    for (const imageUrl of urls) {
      const nextUrl = await uploadImage(project.slug, imageUrl, cache);
      if (nextUrl) mapped.push(nextUrl);
      else failed += 1;
    }

    if (!mapped.length) {
      console.warn('  ! No images migrated for this project');
      continue;
    }

    const cover = mapped[0];
    const { error } = await supabase
      .from('taahhut_projects')
      .update({
        cover_image: cover,
        images: mapped,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', project.slug);

    if (error) {
      console.warn(`  ✗ DB update failed: ${error.message}`);
      continue;
    }

    migrated += 1;
    console.log(`  → Updated DB (${mapped.length} images)`);
  }

  console.log(`\nDone. Projects updated: ${migrated}/${projects.length}. Failed image loads: ${failed}.`);
  if (failed > 0) {
    console.log('\nIf images failed, copy old site folders to:');
    console.log('  frontend/public/anaresim/');
    console.log('  frontend/public/icerikresmi/');
    console.log('Then run: npm run migrate:taahhut-images');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
