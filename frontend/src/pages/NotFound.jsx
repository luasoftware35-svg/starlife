import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Mail } from 'lucide-react';
import Seo from '../components/seo/Seo';
import HoldingHeader from '../components/holding/HoldingHeader';
import HoldingFooter from '../components/holding/HoldingFooter';
import SubsiteHeader from '../components/shared/SubsiteHeader';
import SubsiteFooter from '../components/shared/SubsiteFooter';
import { detectSiteContext, policyPaths } from '../lib/policyPaths';
import { COMPANY, STARLIFE_NAV, INVEST_NAV, ERD_NAV } from '../mock/mock';

const SUBSITE_CONFIG = {
  '/starlife-insaat': {
    navItems: STARLIFE_NAV,
    brandPrefix: 'STAR',
    brandSuffix: 'LİFE',
    basePath: '/starlife-insaat',
    description: 'Güvenli ve modern yaşam alanları.',
  },
  '/invest-insaat': {
    navItems: INVEST_NAV,
    brandPrefix: 'İNVEST',
    brandSuffix: '',
    basePath: '/invest-insaat',
    description: 'Geleceğe değer katan yapılar.',
  },
  '/erd-insaat': {
    navItems: ERD_NAV,
    brandPrefix: 'ERD',
    brandSuffix: ' İNŞAAT',
    basePath: '/erd-insaat',
    description: 'İnsan odaklı tasarım, yüksek kalite.',
  },
};

export default function NotFound() {
  const { pathname } = useLocation();
  const { basePath } = detectSiteContext(pathname);
  const subsite = SUBSITE_CONFIG[basePath];
  const homeHref = basePath || '/';
  const contactHref = basePath ? `${basePath}/iletisim` : '/iletisim';
  const blogHref = basePath ? `${basePath}/blog` : '/blog';
  const paths = policyPaths(basePath);

  const page = (
    <section className="min-h-[60vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-xl text-center">
        <p className="text-gold text-[11px] tracking-[0.4em] uppercase font-semibold">404</p>
        <h1 className="text-ink text-4xl md:text-5xl font-black mt-4">Sayfa Bulunamadı</h1>
        <p className="text-ink/65 mt-5 leading-relaxed">
          Aradığınız sayfa taşınmış, kaldırılmış veya hiç var olmamış olabilir. Ana sayfaya dönebilir
          veya aşağıdaki bağlantılardan devam edebilirsiniz.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={homeHref}
            className="inline-flex items-center gap-2 bg-pomegranate text-white px-8 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:bg-ink transition-colors"
          >
            <Home size={14} /> Ana Sayfa
          </Link>
          <Link
            to={contactHref}
            className="inline-flex items-center gap-2 border border-ink/15 text-ink px-8 py-3.5 text-[11px] tracking-[0.3em] uppercase hover:border-pomegranate hover:text-pomegranate transition-colors"
          >
            <Mail size={14} /> İletişim
          </Link>
        </div>
        <div className="mt-10 pt-8 border-t border-ink/10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link to={blogHref} className="text-ink/60 hover:text-pomegranate transition-colors">
            Bizden Haberler
          </Link>
          <Link to={paths.kvkk} className="text-ink/60 hover:text-pomegranate transition-colors">
            KVKK Metni
          </Link>
          <Link to={paths.cookies} className="text-ink/60 hover:text-pomegranate transition-colors">
            Çerez Politikası
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-ink/60 hover:text-pomegranate transition-colors"
          >
            <ArrowLeft size={14} /> Geri Dön
          </button>
        </div>
        <p className="text-ink/45 text-xs mt-8">
          Yardım için {COMPANY.email} · {COMPANY.phone} · {COMPANY.phoneProjects}
        </p>
      </div>
    </section>
  );

  if (subsite) {
    return (
      <div className="bg-white text-ink min-h-screen">
        <Seo title="Sayfa Bulunamadı" description="Aradığınız sayfa bulunamadı." pathname={pathname} noindex />
        <SubsiteHeader
          navItems={subsite.navItems}
          brandPrefix={subsite.brandPrefix}
          brandSuffix={subsite.brandSuffix}
          contactHref={`${subsite.basePath}/iletisim`}
        />
        {page}
        <SubsiteFooter
          brandPrefix={subsite.brandPrefix}
          brandSuffix={subsite.brandSuffix}
          basePath={subsite.basePath}
          description={subsite.description}
        />
      </div>
    );
  }

  return (
    <div className="bg-white text-ink min-h-screen">
      <Seo title="Sayfa Bulunamadı" description="Aradığınız sayfa bulunamadı." pathname={pathname} noindex />
      <HoldingHeader />
      {page}
      <HoldingFooter />
    </div>
  );
}
