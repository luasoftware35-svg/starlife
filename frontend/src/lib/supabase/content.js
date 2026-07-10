import { useEffect, useMemo, useState } from 'react';
import { supabase } from './client';
import { optimizeImageUrl } from '../imageUtils';
import { DEFAULT_PROJECT_IMAGE, mapFallbackImage, teamFallbackImage } from '../fallbackImages';

const PROJECT_STATUS_LABELS = {
  devam: 'Devam Eden',
  devam_eden: 'Devam Eden',
  'Devam Eden': 'Devam Eden',
  tamamlandi: 'Tamamlanan',
  tamamlanan: 'Tamamlanan',
  Tamamlanan: 'Tamamlanan',
};

const COMPANY_TAGS = {
  starlife: 'Konut',
  invest: 'Ticari',
  erd: 'Karma',
};

export function slugify(value = '') {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeImages(row) {
  const gallery = Array.isArray(row.images) ? row.images : [];
  const cover = row.cover_image || row.image || row.image_url;
  return [cover, ...gallery].filter(Boolean);
}

function toDateLabel(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const queryCache = new Map();

const BLOG_LIST_COLUMNS = 'id, title, slug, excerpt, cover_image, created_at, category';
const BLOG_DETAIL_COLUMNS = 'id, title, slug, excerpt, cover_image, content, created_at, category';

async function fetchRows(table, {
  orderBy = 'created_at',
  ascending = false,
  filters = [],
  columns = '*',
  limit,
} = {}) {
  if (!supabase) return [];

  const cacheKey = JSON.stringify({ table, orderBy, ascending, filters, columns, limit });
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  let query = supabase.from(table).select(columns);

  filters.forEach(({ column, operator = 'eq', value }) => {
    query = query[operator](column, value);
  });

  if (orderBy) {
    query = query.order(orderBy, { ascending });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data || [];
  queryCache.set(cacheKey, { data: rows, at: Date.now() });
  return rows;
}

export function useSupabaseRows(table, options = {}, fallbackRows = [], mapper = (row) => row) {
  const { allowEmpty = false, ...queryOptions } = options;
  const fallback = useMemo(() => fallbackRows.map(mapper), [fallbackRows, mapper]);
  const optionsKey = JSON.stringify(queryOptions || {});
  const stableOptions = useMemo(() => JSON.parse(optionsKey), [optionsKey]);
  const [rows, setRows] = useState(fallback);

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setRows(fallback);
      return () => {
        mounted = false;
      };
    }

    fetchRows(table, stableOptions)
      .then((data) => {
        if (!mounted) return;
        const mapped = (data || []).map(mapper);
        setRows(mapped.length > 0 || allowEmpty ? mapped : fallback);
      })
      .catch(() => {
        if (mounted) setRows(fallback);
      });

    return () => {
      mounted = false;
    };
  }, [allowEmpty, fallback, mapper, stableOptions, table]);

  return rows;
}

export function mapProject(row) {
  const images = normalizeImages(row);

  return {
    id: row.id,
    slug: slugify(row.slug || row.title || row.id),
    title: row.title,
    status: PROJECT_STATUS_LABELS[row.status] || row.status || 'Devam Eden',
    location: row.city || row.location || row.region || '',
    year: row.year || '',
    image: images[0] || 'https://images.pexels.com/photos/5403840/pexels-photo-5403840.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    images,
    tag: row.tag || COMPANY_TAGS[row.company] || 'Konut',
    featured: Boolean(row.featured),
    description: row.description || '',
    city: row.city || '',
    region: row.region || '',
    company: row.company || 'starlife',
    units: row.units || 0,
    sqm: row.sqm || 0,
  };
}

export function mapHeroSlide(row) {
  const image = row.image || row.image_url || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg';

  return {
    tag: row.tag || 'Starlife İnşaat',
    title: row.title || '',
    desc: row.description || row.desc || '',
    cta: row.cta_text || row.cta || 'Keşfet',
    href: row.cta_href || row.href || '/starlife-insaat',
    image: optimizeImageUrl(image, { width: 1600, quality: 75 }),
  };
}

export function mapTeamMember(row) {
  const hasPhoto = Boolean(row.image || row.image_url);
  const useFallback = row.name !== 'Ayetullah Yağmur';
  return {
    id: row.id || row.user_id || row.name,
    name: row.name,
    title: row.title || row.role || '',
    image: hasPhoto ? (row.image || row.image_url) : (useFallback ? teamFallbackImage(row.name) : ''),
    bio: row.bio || row.biography || row.description || '',
    order_index: Number(row.order_index ?? 0),
  };
}

export function mapBlogPost(row, { variant = 'detail' } = {}) {
  const imageWidth = variant === 'list' ? 640 : 1200;
  const image = row.cover_image || row.image || 'https://images.pexels.com/photos/4458205/pexels-photo-4458205.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

  return {
    id: row.id,
    slug: slugify(row.slug || row.title || row.id),
    title: row.title,
    excerpt: row.excerpt || '',
    content: variant === 'list' ? '' : (row.content || row.excerpt || ''),
    date: row.date || toDateLabel(row.created_at),
    author: row.author || 'Starlife İnşaat',
    image: optimizeImageUrl(image, { width: imageWidth, quality: 75 }),
    category: row.category || '',
  };
}

export const BLOG_POST_LIST_QUERY = {
  orderBy: 'created_at',
  ascending: false,
  columns: BLOG_LIST_COLUMNS,
};

export function findBlogPostBySlug(posts, slug) {
  return posts.find(
    (item) => item.slug === slug || String(item.id) === slug || slugify(item.title) === slug,
  );
}

export async function fetchBlogPostBySlug(slug, fallbackRows = []) {
  const fallbackPosts = fallbackRows.map((row) => mapBlogPost(row));
  const fallbackPost = findBlogPostBySlug(fallbackPosts, slug);

  if (!supabase) return fallbackPost || null;

  const cacheKey = `blog_post:${slug}`;
  const cached = queryCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(BLOG_DETAIL_COLUMNS)
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) {
      const post = mapBlogPost(data);
      queryCache.set(cacheKey, { data: post, at: Date.now() });
      return post;
    }
  } catch {
    // fall through to fallback
  }

  return fallbackPost || null;
}

export function useBlogPost(slug, fallbackRows = []) {
  const fallbackPost = useMemo(
    () => findBlogPostBySlug(fallbackRows.map((row) => mapBlogPost(row)), slug),
    [fallbackRows, slug],
  );
  const [state, setState] = useState({
    loading: Boolean(supabase) && !fallbackPost,
    post: fallbackPost || null,
  });

  useEffect(() => {
    let mounted = true;

    fetchBlogPostBySlug(slug, fallbackRows).then((post) => {
      if (mounted) {
        setState({ loading: false, post });
      }
    });

    return () => {
      mounted = false;
    };
  }, [fallbackRows, slug]);

  return state;
}

export function mapTaahhutProject(row, index = 0) {
  const gallery = Array.isArray(row.images) ? row.images.filter(Boolean) : [];
  const cover = row.cover_image || gallery[0] || DEFAULT_PROJECT_IMAGE;
  const resolvedGallery = gallery.length ? gallery : [cover];

  return {
    id: row.id || index + 1,
    slug: slugify(row.slug || row.title || row.id),
    title: row.title,
    status: row.status || 'Tamamlanan',
    description: row.description || '',
    year: row.year || '',
    tag: row.tag || 'Konut',
    units: Number(row.units || 0),
    institution: row.institution || 'TOKİ',
    sqm: Number(row.sqm || 0),
    sqmLabel: row.sqm_label || row.sqmLabel || (row.sqm ? `${Number(row.sqm).toLocaleString('tr-TR')} M²` : ''),
    location: row.location || '',
    image: optimizeImageUrl(cover, { width: 1600, quality: 75 }),
    images: resolvedGallery.map((src) => optimizeImageUrl(src, { width: 1400, quality: 75 })),
  };
}

export function useTaahhutProjects(fallbackRows = []) {
  return useSupabaseRows(
    'taahhut_projects',
    {
      orderBy: 'order_index',
      ascending: true,
      filters: [{ column: 'active', value: true }],
    },
    fallbackRows,
    mapTaahhutProject,
  );
}

export function mapLocation(row) {
  if (row.project) return row;

  const year = row.year || '';
  const units = Number(row.units || 0);
  const sqm = Number(row.sqm || 0);

  return {
    id: row.id,
    plate: row.plate || '',
    city: row.city,
    region: row.region || '',
    count: Number(row.count || 1),
    year,
    cx: row.cx || '50%',
    cy: row.cy || '50%',
    project: {
      name: row.title || row.city,
      desc: row.description || '',
      image: row.image || row.cover_image || mapFallbackImage(row.city),
      units,
      sqm,
      year,
      status: PROJECT_STATUS_LABELS[row.status]?.toUpperCase('tr-TR') || 'DEVAM EDİYOR',
    },
  };
}
