import { COMPANY, SOCIALS } from '../../mock/mock';

export const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://starlifeinsaat.com';

export const SITE_NAME = COMPANY.name;

export const SITE_TAGLINE = COMPANY.slogan;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/img/starlife.png`;

export const DEFAULT_KEYWORDS = [
  'Starlife İnşaat',
  'inşaat firması',
  'Diyarbakır inşaat',
  'konut projeleri',
  'taahhüt işleri',
  'TOKİ projeleri',
  'deprem dayanıklı bina',
  'güvenli yaşam alanları',
  'anahtar teslim inşaat',
  'kentsel dönüşüm',
  'yapı güvenliği',
  'inşaat şirketi',
  'gayrimenkul projeleri',
].join(', ');

export const DEFAULT_DESCRIPTION =
  'Starlife İnşaat; Diyarbakır merkezli inşaat firması olarak konut, ticari ve TOKİ taahhüt projelerinde deprem dayanıklı, güvenli ve modern yaşam alanları inşa eder. 2009\'dan bu yana Türkiye genelinde projeler.';

export function buildTitle(pageTitle) {
  if (!pageTitle) return `${SITE_NAME} | ${SITE_TAGLINE}`;
  return `${pageTitle} | ${SITE_NAME}`;
}

export function buildCanonical(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_URL}${path === '/' ? '' : path}`;
}

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'GeneralContractor'],
  '@id': `${SITE_URL}/#organization`,
  name: COMPANY.name,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  foundingDate: String(COMPANY.founded),
  founder: {
    '@type': 'Person',
    name: COMPANY.founder,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address,
    addressLocality: 'Diyarbakır',
    addressRegion: 'Diyarbakır',
    addressCountry: 'TR',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: COMPANY.phone,
      email: COMPANY.email,
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: ['Turkish'],
    },
    {
      '@type': 'ContactPoint',
      telephone: COMPANY.phoneProjects,
      contactType: 'sales',
      description: 'Özel projeler',
      areaServed: 'TR',
      availableLanguage: ['Turkish'],
    },
  ],
  sameAs: SOCIALS.map((social) => social.href),
  areaServed: {
    '@type': 'Country',
    name: 'Türkiye',
  },
  knowsAbout: [
    'Konut inşaatı',
    'Taahhüt işleri',
    'TOKİ projeleri',
    'Deprem dayanıklı yapılar',
    'Yapı güvenliği',
  ],
};

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'tr-TR',
};
