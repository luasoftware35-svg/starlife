import React, { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import GoogleAnalytics from './components/analytics/GoogleAnalytics';
import RouteSeo from './components/seo/RouteSeo';
import CookieBanner from './components/shared/CookieBanner';
import PageLoader from './components/shared/PageLoader';
import { SiteSettingsProvider } from './lib/siteSettings';
import LandingPage from './pages/LandingPage';

import { STARLIFE_NAV, INVEST_NAV, ERD_NAV } from './mock/mock';

const KurumsalHakkimizda = lazy(() => import('./pages/KurumsalHakkimizda'));
const KurumsalYonetim = lazy(() => import('./pages/KurumsalYonetim'));
const OperasyonHaritasi = lazy(() => import('./pages/OperasyonHaritasi'));
const KurumsalReferanslar = lazy(() => import('./pages/KurumsalReferanslar'));
const KurumsalKaliteGuvenlik = lazy(() => import('./pages/KurumsalKaliteGuvenlik'));
const KurumsalYatirimciIliskileri = lazy(() => import('./pages/KurumsalYatirimciIliskileri'));
const Iletisim = lazy(() => import('./pages/Iletisim'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Kvkk = lazy(() => import('./pages/Kvkk'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

const StarlifeHome = lazy(() => import('./pages/starlife/StarlifeHome'));
const StarlifeHakkimizda = lazy(() => import('./pages/starlife/StarlifeHakkimizda'));
const StarlifeInsanKaynaklari = lazy(() => import('./pages/starlife/StarlifeInsanKaynaklari'));
const StarlifeTaahhutIsleri = lazy(() => import('./pages/starlife/StarlifeTaahhutIsleri'));
const StarlifeTaahhutListe = lazy(() => import('./pages/starlife/StarlifeTaahhutListe'));
const StarlifeTaahhutDetail = lazy(() => import('./pages/starlife/StarlifeTaahhutDetail'));
const StarlifeProjectDetail = lazy(() => import('./pages/starlife/StarlifeProjectDetail'));
const StarlifeProjects = lazy(() => import('./pages/starlife/StarlifeProjects'));
const YapiGuvenligiPage = lazy(() => import('./pages/starlife/YapiGuvenligiPage'));

const InvestHome = lazy(() => import('./pages/invest/InvestHome'));
const ErdHome = lazy(() => import('./pages/erd/ErdHome'));

const SubsiteBlog = lazy(() => import('./pages/SubsiteBlog'));
const SubsiteIletisim = lazy(() => import('./pages/SubsiteIletisim'));
const SubsiteAbout = lazy(() => import('./pages/SubsiteAbout'));
const SubsiteProjects = lazy(() => import('./pages/SubsiteProjects'));

const AdminRouteGuard = lazy(() => import('./components/admin/AdminRouteGuard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminResourceForm = lazy(() => import('./pages/admin/AdminResourceForm'));
const AdminResourceList = lazy(() => import('./pages/admin/AdminResourceList'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function SuspensePage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const investAboutProps = {
  navItems: INVEST_NAV, brandPrefix: 'İNVEST', brandSuffix: '', basePath: '/invest-insaat',
  label: 'İnvest İnşaat',
  title: 'Geleceğe değer katan yapılar oluşturuyoruz.',
  image: 'https://images.pexels.com/photos/34700467/pexels-photo-34700467.png?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600',
  paragraphs: [
    'İnvest İnşaat, modern şehircilik anlayışıyla yenilikçi, estetik ve sürdürülebilir projeler üreten bir inşaat firmasıdır. Her projede kalite, güvenlik ve konforu ön planda tutarak, yaşam alanlarını sadece inşa etmekle kalmıyor, aynı zamanda geleceğe değer katan yapılar oluşturuyoruz.',
    'Güçlü mühendislik altyapımız ve mimari vizyonumuzla, konut, ticari ve karma kullanımlı projeler geliştirerek, hem yatırımcılar hem de konut sahipleri için değerli ve kazançlı çözümler sunuyoruz.',
    'İnvest İnşaat olarak, geleceğin mimarisini bugünden inşa etme vizyonuyla hareket ediyor ve yaşam alanlarını daha modern, daha güvenli ve daha konforlu hale getirmek için çalışıyoruz.',
  ],
  vizyon: 'Yatırımcılar ve konut sahipleri için değerli, geleceğe miras kalacak modern yaşam alanları üretmek.',
  misyon: 'Yenilikçi, estetik ve sürdürülebilir projelerle şehirciliğe katkı sağlamak ve kazançlı yatırım alanları sunmak.',
};

const erdAboutProps = {
  navItems: ERD_NAV, brandPrefix: 'ERD', brandSuffix: ' İNŞAAT', basePath: '/erd-insaat',
  label: 'ERD İnşaat',
  title: 'İnsan odaklı tasarım, yüksek kalite.',
  image: 'https://images.pexels.com/photos/31197870/pexels-photo-31197870.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600',
  paragraphs: [
    'ERD İnşaat, yenilikçi mimari anlayışı, güçlü mühendislik altyapısı ve kalite odaklı yaklaşımı ile modern yaşam alanları inşa eden bir inşaat firmasıdır. Şehir dokusuna değer katan projeler geliştirerek, estetik, güvenli ve sürdürülebilir yapılar oluşturmayı hedefliyoruz.',
    'Konut, ticari ve karma kullanımlı projelerde fonksiyonelliği ve konforu bir araya getirerek, sadece yaşam alanları değil, geleceğe miras kalacak yapılar tasarlıyoruz.',
    'ERD İnşaat olarak, insan odaklı tasarım ve yüksek kalite standartlarıyla sektörde fark yaratmaya devam ediyoruz. Siz de ERD İnşaat ile geleceğin mimarisini keşfedin!',
  ],
  vizyon: 'İnsan odaklı tasarım anlayışı ile geleceğin mimarisine yön veren bir marka olmak.',
  misyon: 'Yüksek kalite ve güvenlik standartlarıyla, yaşam alanlarını daha değerli ve konforlu hale getirmek.',
};

const starlifePolicyProps = {
  layout: 'subsite',
  navItems: STARLIFE_NAV,
  brandPrefix: 'STAR',
  brandSuffix: 'LİFE',
  basePath: '/starlife-insaat',
  footerDescription: 'Güvenli ve modern yaşam alanları.',
};

const investPolicyProps = {
  layout: 'subsite',
  navItems: INVEST_NAV,
  brandPrefix: 'İNVEST',
  brandSuffix: '',
  basePath: '/invest-insaat',
  footerDescription: 'Geleceğe değer katan yapılar.',
};

const erdPolicyProps = {
  layout: 'subsite',
  navItems: ERD_NAV,
  brandPrefix: 'ERD',
  brandSuffix: ' İNŞAAT',
  basePath: '/erd-insaat',
  footerDescription: 'İnsan odaklı tasarım, yüksek kalite.',
};

function YapiGuvenligiRoute() {
  const params = useParams();
  return (
    <SuspensePage>
      <YapiGuvenligiPage key={params.slug} />
    </SuspensePage>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <GoogleAnalytics />
        <RouteSeo />
        <CookieBanner />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        <Routes>
          {/* Admin */}
          <Route path="/admin/login" element={<SuspensePage><AdminLogin /></SuspensePage>} />
          <Route path="/admin" element={<SuspensePage><AdminRouteGuard /></SuspensePage>}>
            <Route element={<SuspensePage><AdminLayout /></SuspensePage>}>
              <Route index element={<SuspensePage><AdminDashboard /></SuspensePage>} />
              <Route path="projeler" element={<SuspensePage><AdminResourceList resource="projects" /></SuspensePage>} />
              <Route path="projeler/yeni" element={<SuspensePage><AdminResourceForm resource="projects" /></SuspensePage>} />
              <Route path="projeler/duzenle/:id" element={<SuspensePage><AdminResourceForm resource="projects" /></SuspensePage>} />
              <Route path="harita" element={<SuspensePage><AdminResourceList resource="map" /></SuspensePage>} />
              <Route path="harita/yeni" element={<SuspensePage><AdminResourceForm resource="map" /></SuspensePage>} />
              <Route path="harita/duzenle/:id" element={<SuspensePage><AdminResourceForm resource="map" /></SuspensePage>} />
              <Route path="yonetim" element={<SuspensePage><AdminResourceList resource="team" /></SuspensePage>} />
              <Route path="yonetim/yeni" element={<SuspensePage><AdminResourceForm resource="team" /></SuspensePage>} />
              <Route path="yonetim/duzenle/:id" element={<SuspensePage><AdminResourceForm resource="team" /></SuspensePage>} />
              <Route path="hero" element={<SuspensePage><AdminResourceList resource="hero" /></SuspensePage>} />
              <Route path="hero/yeni" element={<SuspensePage><AdminResourceForm resource="hero" /></SuspensePage>} />
              <Route path="hero/duzenle/:id" element={<SuspensePage><AdminResourceForm resource="hero" /></SuspensePage>} />
              <Route path="blog" element={<SuspensePage><AdminResourceList resource="blog" /></SuspensePage>} />
              <Route path="blog/yeni" element={<SuspensePage><AdminResourceForm resource="blog" /></SuspensePage>} />
              <Route path="blog/duzenle/:id" element={<SuspensePage><AdminResourceForm resource="blog" /></SuspensePage>} />
              <Route path="ayarlar" element={<SuspensePage><AdminSettings /></SuspensePage>} />
              <Route path="ayarlar/yeni" element={<SuspensePage><AdminResourceForm resource="settings" /></SuspensePage>} />
              <Route path="ayarlar/duzenle/:id" element={<SuspensePage><AdminResourceForm resource="settings" /></SuspensePage>} />
              <Route path="taahhut" element={<SuspensePage><AdminResourceList resource="taahhut" /></SuspensePage>} />
              <Route path="taahhut/yeni" element={<SuspensePage><AdminResourceForm resource="taahhut" /></SuspensePage>} />
              <Route path="taahhut/duzenle/:id" element={<SuspensePage><AdminResourceForm resource="taahhut" /></SuspensePage>} />
              <Route path="mesajlar" element={<SuspensePage><AdminResourceList resource="contactMessages" /></SuspensePage>} />
              <Route path="basvurular" element={<SuspensePage><AdminResourceList resource="jobApplications" /></SuspensePage>} />
              <Route path="projects" element={<SuspensePage><AdminResourceList resource="projects" /></SuspensePage>} />
              <Route path="projects/new" element={<SuspensePage><AdminResourceForm resource="projects" /></SuspensePage>} />
              <Route path="projects/edit/:id" element={<SuspensePage><AdminResourceForm resource="projects" /></SuspensePage>} />
              <Route path="map" element={<SuspensePage><AdminResourceList resource="map" /></SuspensePage>} />
              <Route path="map/new" element={<SuspensePage><AdminResourceForm resource="map" /></SuspensePage>} />
              <Route path="map/edit/:id" element={<SuspensePage><AdminResourceForm resource="map" /></SuspensePage>} />
              <Route path="team" element={<SuspensePage><AdminResourceList resource="team" /></SuspensePage>} />
              <Route path="team/new" element={<SuspensePage><AdminResourceForm resource="team" /></SuspensePage>} />
              <Route path="team/edit/:id" element={<SuspensePage><AdminResourceForm resource="team" /></SuspensePage>} />
              <Route path="settings" element={<SuspensePage><AdminSettings /></SuspensePage>} />
              <Route path="settings/new" element={<SuspensePage><AdminResourceForm resource="settings" /></SuspensePage>} />
              <Route path="settings/edit/:id" element={<SuspensePage><AdminResourceForm resource="settings" /></SuspensePage>} />
              <Route path="media" element={<SuspensePage><AdminMedia /></SuspensePage>} />
            </Route>
          </Route>

          {/* Holding */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/kurumsal/hakkimizda" element={<SuspensePage><KurumsalHakkimizda /></SuspensePage>} />
          <Route path="/kurumsal/yonetim" element={<SuspensePage><KurumsalYonetim /></SuspensePage>} />
          <Route path="/kurumsal/operasyon-haritasi" element={<SuspensePage><OperasyonHaritasi /></SuspensePage>} />
          <Route path="/kurumsal/referanslar-ve-sertifikalar" element={<SuspensePage><KurumsalReferanslar /></SuspensePage>} />
          <Route path="/kurumsal/kalite-ve-guvenlik" element={<SuspensePage><KurumsalKaliteGuvenlik /></SuspensePage>} />
          <Route path="/kurumsal/yatirimci-iliskileri" element={<SuspensePage><KurumsalYatirimciIliskileri /></SuspensePage>} />
          <Route path="/blog" element={<SuspensePage><Blog /></SuspensePage>} />
          <Route path="/blog/:slug" element={<SuspensePage><BlogDetail /></SuspensePage>} />
          <Route path="/iletisim" element={<SuspensePage><Iletisim /></SuspensePage>} />
          <Route path="/politika/kvkk-metni" element={<SuspensePage><Kvkk /></SuspensePage>} />
          <Route path="/politika/cerez-politikasi" element={<SuspensePage><CookiePolicy /></SuspensePage>} />

          {/* Starlife */}
          <Route path="/starlife-insaat" element={<SuspensePage><StarlifeHome /></SuspensePage>} />
          <Route path="/starlife-insaat/kurumsal/hakkimizda" element={<SuspensePage><StarlifeHakkimizda /></SuspensePage>} />
          <Route path="/starlife-insaat/insankaynaklari" element={<SuspensePage><StarlifeInsanKaynaklari /></SuspensePage>} />
          <Route path="/starlife-insaat/taahhutisleri" element={<SuspensePage><StarlifeTaahhutIsleri /></SuspensePage>} />
          <Route path="/starlife-insaat/taahhutisler/tamamlanan-isler" element={<SuspensePage><StarlifeTaahhutListe filter="Tamamlanan" title="Tamamlanan İşler" breadcrumbLabel="Tamamlanan İşler" /></SuspensePage>} />
          <Route path="/starlife-insaat/taahhutisler/devam-eden-isler" element={<SuspensePage><StarlifeTaahhutListe filter="Devam Eden" title="Devam Eden İşler" breadcrumbLabel="Devam Eden İşler" /></SuspensePage>} />
          <Route path="/starlife-insaat/taahhut/:slug" element={<SuspensePage><StarlifeTaahhutDetail /></SuspensePage>} />
          <Route path="/starlife-insaat/tumprojeler" element={<SuspensePage><StarlifeProjects title="Tüm Projeler" breadcrumbLabel="Tüm Projeler" /></SuspensePage>} />
          <Route path="/starlife-insaat/projeler/:slug" element={<SuspensePage><StarlifeProjectDetail /></SuspensePage>} />
          <Route path="/starlife-insaat/projeler/tamamlanan-projeler" element={<SuspensePage><StarlifeProjects filter="Tamamlanan" title="Tamamlanan Projeler" breadcrumbLabel="Tamamlanan" /></SuspensePage>} />
          <Route path="/starlife-insaat/projeler/devam-eden-projeler" element={<SuspensePage><StarlifeProjects filter="Devam Eden" title="Devam Eden Projeler" breadcrumbLabel="Devam Eden" /></SuspensePage>} />
          <Route path="/starlife-insaat/yapiguvenligi/:slug" element={<YapiGuvenligiRoute />} />
          <Route path="/starlife-insaat/blog" element={<SuspensePage><SubsiteBlog navItems={STARLIFE_NAV} brandPrefix="STAR" brandSuffix="LİFE" basePath="/starlife-insaat" /></SuspensePage>} />
          <Route path="/starlife-insaat/blog/:slug" element={<SuspensePage><BlogDetail navItems={STARLIFE_NAV} brandPrefix="STAR" brandSuffix="LİFE" basePath="/starlife-insaat" /></SuspensePage>} />
          <Route path="/starlife-insaat/iletisim" element={<SuspensePage><SubsiteIletisim navItems={STARLIFE_NAV} brandPrefix="STAR" brandSuffix="LİFE" basePath="/starlife-insaat" /></SuspensePage>} />
          <Route path="/starlife-insaat/politika/kvkk-metni" element={<SuspensePage><Kvkk {...starlifePolicyProps} /></SuspensePage>} />
          <Route path="/starlife-insaat/politika/cerez-politikasi" element={<SuspensePage><CookiePolicy {...starlifePolicyProps} /></SuspensePage>} />

          {/* Invest */}
          <Route path="/invest-insaat" element={<SuspensePage><InvestHome /></SuspensePage>} />
          <Route path="/invest-insaat/kurumsal/invest-insaat" element={<SuspensePage><SubsiteAbout {...investAboutProps} /></SuspensePage>} />
          <Route path="/invest-insaat/projeler" element={<SuspensePage><SubsiteProjects company="invest" navItems={INVEST_NAV} brandPrefix="İNVEST" brandSuffix="" basePath="/invest-insaat" title="İnvest Projeleri" footerDescription="Geleceğe değer katan yapılar." heroImage="https://images.pexels.com/photos/34700467/pexels-photo-34700467.png?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600" /></SuspensePage>} />
          <Route path="/invest-insaat/blog" element={<SuspensePage><SubsiteBlog navItems={INVEST_NAV} brandPrefix="İNVEST" brandSuffix="" basePath="/invest-insaat" /></SuspensePage>} />
          <Route path="/invest-insaat/blog/:slug" element={<SuspensePage><BlogDetail navItems={INVEST_NAV} brandPrefix="İNVEST" brandSuffix="" basePath="/invest-insaat" /></SuspensePage>} />
          <Route path="/invest-insaat/iletisim" element={<SuspensePage><SubsiteIletisim navItems={INVEST_NAV} brandPrefix="İNVEST" brandSuffix="" basePath="/invest-insaat" /></SuspensePage>} />
          <Route path="/invest-insaat/politika/kvkk-metni" element={<SuspensePage><Kvkk {...investPolicyProps} /></SuspensePage>} />
          <Route path="/invest-insaat/politika/cerez-politikasi" element={<SuspensePage><CookiePolicy {...investPolicyProps} /></SuspensePage>} />

          {/* ERD */}
          <Route path="/erd-insaat" element={<SuspensePage><ErdHome /></SuspensePage>} />
          <Route path="/erd-insaat/kurumsal/erd-insaat" element={<SuspensePage><SubsiteAbout {...erdAboutProps} /></SuspensePage>} />
          <Route path="/erd-insaat/projeler" element={<SuspensePage><SubsiteProjects company="erd" navItems={ERD_NAV} brandPrefix="ERD" brandSuffix=" İNŞAAT" basePath="/erd-insaat" title="ERD Projeleri" footerDescription="İnsan odaklı tasarım, yüksek kalite." heroImage="https://images.pexels.com/photos/31197870/pexels-photo-31197870.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600" /></SuspensePage>} />
          <Route path="/erd-insaat/blog" element={<SuspensePage><SubsiteBlog navItems={ERD_NAV} brandPrefix="ERD" brandSuffix=" İNŞAAT" basePath="/erd-insaat" /></SuspensePage>} />
          <Route path="/erd-insaat/blog/:slug" element={<SuspensePage><BlogDetail navItems={ERD_NAV} brandPrefix="ERD" brandSuffix=" İNŞAAT" basePath="/erd-insaat" /></SuspensePage>} />
          <Route path="/erd-insaat/iletisim" element={<SuspensePage><SubsiteIletisim navItems={ERD_NAV} brandPrefix="ERD" brandSuffix=" İNŞAAT" basePath="/erd-insaat" /></SuspensePage>} />
          <Route path="/erd-insaat/politika/kvkk-metni" element={<SuspensePage><Kvkk {...erdPolicyProps} /></SuspensePage>} />
          <Route path="/erd-insaat/politika/cerez-politikasi" element={<SuspensePage><CookiePolicy {...erdPolicyProps} /></SuspensePage>} />

          <Route path="*" element={<SuspensePage><NotFound /></SuspensePage>} />
        </Routes>
      </BrowserRouter>
    </div>
    </SiteSettingsProvider>
  );
}

export default App;
