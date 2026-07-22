const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://starlifeinsaat.com';
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_PATHS = [
  '/',
  '/kurumsal/hakkimizda',
  '/kurumsal/yonetim',
  '/kurumsal/operasyon-haritasi',
  '/kurumsal/referanslar-ve-sertifikalar',
  '/kurumsal/kalite-ve-guvenlik',
  '/kurumsal/yatirimci-iliskileri',
  '/blog',
  '/iletisim',
  '/politika/kvkk-metni',
  '/politika/cerez-politikasi',
  '/starlife-insaat',
  '/starlife-insaat/kurumsal/hakkimizda',
  '/starlife-insaat/insankaynaklari',
  '/starlife-insaat/taahhutisleri',
  '/starlife-insaat/taahhutisler/tamamlanan-isler',
  '/starlife-insaat/taahhutisler/devam-eden-isler',
  '/starlife-insaat/tumprojeler',
  '/starlife-insaat/projeler/tamamlanan-projeler',
  '/starlife-insaat/projeler/devam-eden-projeler',
  '/starlife-insaat/blog',
  '/starlife-insaat/iletisim',
  '/starlife-insaat/politika/kvkk-metni',
  '/starlife-insaat/politika/cerez-politikasi',
  '/starlife-insaat/yapiguvenligi/deprem-dayanikliligi',
  '/starlife-insaat/yapiguvenligi/yangin-guvenligi',
  '/starlife-insaat/yapiguvenligi/muhendislik-cozumleri',
  '/starlife-insaat/yapiguvenligi/akilli-guvenlik-sistemleri',
  '/invest-insaat',
  '/invest-insaat/kurumsal/invest-insaat',
  '/invest-insaat/projeler',
  '/invest-insaat/blog',
  '/invest-insaat/iletisim',
  '/invest-insaat/politika/kvkk-metni',
  '/invest-insaat/politika/cerez-politikasi',
  '/erd-insaat',
  '/erd-insaat/kurumsal/erd-insaat',
  '/erd-insaat/projeler',
  '/erd-insaat/blog',
  '/erd-insaat/iletisim',
  '/erd-insaat/politika/kvkk-metni',
  '/erd-insaat/politika/cerez-politikasi',
];

const PROJECT_SLUGS = [
  'elit-life-villalari',
  'new-star-konutlari',
  'batisehir-konutlari',
  'kent-park-sitesi',
  'star-office',
  'goletli-park-2',
  'star-plus',
  'goletli-park-1',
  'star-life-sitesi',
  'yenikent-sitesi',
  'bilge-sitesi',
];

const TAAHHUT_SLUGS = [
  'antalya-serik-toki-konutlari',
  'malatya-battalgazi-sehit-feyzi-toki-projesi',
  'diyarbakir-cermik-toki-konutlari',
  'elazig-mustafa-pasa-konutlari',
  'sanliurfa-eyyubiye-toki-konutlari',
  'denizli-honaz-konutlari',
  'bilecik-osmaneli-toki-konutlari',
  'sirnak-okul-projesi',
  'elazig-defterdarlik',
  'kocaeli-kiz-yurdu',
  'mardin-1-etap-526-konut-insaati',
  'ankara-mamak-5-etap-bolge-konut-insaati',
  'mardin-3-etap-326-konut-insaati',
  'istanbul-arnavutkoy-sazlibosna-4-etap-11-bolge-konut-insaati',
];

const BLOG_SLUGS = require('./blog-slugs.cjs');

const HIGH_PRIORITY_PATTERNS = [
  /^\/$/,
  /^\/iletisim$/,
  /^\/blog$/,
  /^\/kurumsal\//,
  /^\/starlife-insaat\/?$/,
  /^\/invest-insaat\/?$/,
  /^\/erd-insaat\/?$/,
  /^\/starlife-insaat\/iletisim$/,
  /^\/invest-insaat\/iletisim$/,
  /^\/erd-insaat\/iletisim$/,
  /^\/starlife-insaat\/(taahhutisleri|tumprojeler|insankaynaklari|kurumsal)/,
  /^\/starlife-insaat\/taahhutisler\//,
  /^\/starlife-insaat\/projeler\/(tamamlanan-projeler|devam-eden-projeler)$/,
  /^\/invest-insaat\/(projeler|kurumsal)/,
  /^\/erd-insaat\/(projeler|kurumsal)/,
  /^\/starlife-insaat\/blog$/,
  /^\/invest-insaat\/blog$/,
  /^\/erd-insaat\/blog$/,
];

function getUrlMeta(pathname) {
  if (pathname === '/') {
    return { priority: '1.0', changefreq: 'weekly' };
  }

  if (HIGH_PRIORITY_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return { priority: '0.8', changefreq: 'monthly' };
  }

  return { priority: '0.5', changefreq: 'monthly' };
}

function toLoc(pathname) {
  return `${SITE_URL}${pathname === '/' ? '' : pathname}`;
}

const urls = [
  ...STATIC_PATHS.map((pathname) => ({ pathname, ...getUrlMeta(pathname) })),
  ...PROJECT_SLUGS.map((slug) => ({
    pathname: `/starlife-insaat/projeler/${slug}`,
    ...getUrlMeta(`/starlife-insaat/projeler/${slug}`),
  })),
  ...TAAHHUT_SLUGS.map((slug) => ({
    pathname: `/starlife-insaat/taahhut/${slug}`,
    ...getUrlMeta(`/starlife-insaat/taahhut/${slug}`),
  })),
  ...BLOG_SLUGS.map((slug) => ({
    pathname: `/blog/${slug}`,
    ...getUrlMeta(`/blog/${slug}`),
  })),
  ...BLOG_SLUGS.map((slug) => ({
    pathname: `/starlife-insaat/blog/${slug}`,
    ...getUrlMeta(`/starlife-insaat/blog/${slug}`),
  })),
  ...BLOG_SLUGS.map((slug) => ({
    pathname: `/invest-insaat/blog/${slug}`,
    ...getUrlMeta(`/invest-insaat/blog/${slug}`),
  })),
  ...BLOG_SLUGS.map((slug) => ({
    pathname: `/erd-insaat/blog/${slug}`,
    ...getUrlMeta(`/erd-insaat/blog/${slug}`),
  })),
];

const uniqueUrls = Array.from(
  new Map(urls.map((entry) => [entry.pathname, entry])).values(),
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(({ pathname, priority, changefreq }) => `  <url>
    <loc>${toLoc(pathname)}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
  .join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated with ${uniqueUrls.length} URLs at ${outputPath}`);
