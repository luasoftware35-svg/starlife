import React, { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Building2, Calendar, MapPin, Ruler, X } from 'lucide-react';
import SubsiteHeader from '../../components/shared/SubsiteHeader';
import SubsiteFooter from '../../components/shared/SubsiteFooter';
import PageHero from '../../components/shared/PageHero';
import SafeImage from '../../components/shared/SafeImage';
import Seo from '../../components/seo/Seo';
import { STARLIFE_NAV } from '../../mock/mock';
import { TAAHHUT_PROJECTS } from '../../mock/taahhutProjects';
import { slugify, useTaahhutProjects } from '../../lib/supabase/content';
import { buildBreadcrumbSchema, buildProjectSchema } from '../../lib/seo/schema';
import { buildCanonical } from '../../lib/seo/siteConfig';

export default function StarlifeTaahhutDetail() {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const taahhutProjects = useTaahhutProjects(TAAHHUT_PROJECTS);

  const project = useMemo(
    () => taahhutProjects.find(
      (item) => item.slug === slug || slugify(item.title) === slug,
    ),
    [slug, taahhutProjects],
  );

  const gallery = useMemo(() => {
    if (!project) return [];
    return project.images?.length ? project.images : [project.image].filter(Boolean);
  }, [project]);

  const related = useMemo(() => {
    if (!project) return [];
    return taahhutProjects.filter((item) => item.id !== project.id).slice(0, 4);
  }, [project, taahhutProjects]);

  const lightboxImage = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-ink">
        <SubsiteHeader navItems={STARLIFE_NAV} brandPrefix="STAR" brandSuffix="LİFE" contactHref="/starlife-insaat/iletisim" />
        <PageHero
          title="Taahhüt İşi Detayı"
          breadcrumb={[
            { label: 'Anasayfa', href: '/starlife-insaat' },
            { label: 'Taahhüt İşleri', href: '/starlife-insaat/taahhutisleri' },
            { label: 'Detay' },
          ]}
        />
        <section className="px-6 py-24 text-center">
          <p className="text-ink/60">Taahhüt işi bulunamadı.</p>
          <Link
            to="/starlife-insaat/taahhutisleri"
            className="mt-6 inline-flex items-center gap-2 text-gold text-xs tracking-[0.3em] uppercase"
          >
            <ArrowLeft size={14} /> Taahhüt İşlerine Dön
          </Link>
        </section>
        <SubsiteFooter brandPrefix="STAR" brandSuffix="LİFE" basePath="/starlife-insaat" description="Güvenli ve modern yaşam alanları." />
      </div>
    );
  }

  const listHref = project.status === 'Tamamlanan'
    ? '/starlife-insaat/taahhutisler/tamamlanan-isler'
    : '/starlife-insaat/taahhutisler/devam-eden-isler';

  return (
    <div className="min-h-screen bg-white text-ink">
      <Seo
        title={project.title}
        description={project.description || `${project.title} — Starlife İnşaat ${project.status?.toLowerCase()} taahhüt işi. ${project.location || 'Türkiye'}.`}
        keywords={`${project.title}, taahhüt işleri, TOKİ, Starlife İnşaat, ${project.location}, inşaat firması`}
        pathname={pathname}
        image={project.image}
        type="article"
        jsonLd={[
          buildProjectSchema({
            title: project.title,
            description: project.description,
            image: project.image,
            url: buildCanonical(pathname),
            location: project.location,
            status: project.status,
            year: project.year,
          }),
          buildBreadcrumbSchema([
            { name: 'Anasayfa', href: '/starlife-insaat' },
            { name: 'Taahhüt İşleri', href: '/starlife-insaat/taahhutisleri' },
            { name: project.status, href: listHref },
            { name: project.title },
          ]),
        ].filter(Boolean)}
      />
      <SubsiteHeader navItems={STARLIFE_NAV} brandPrefix="STAR" brandSuffix="LİFE" contactHref="/starlife-insaat/iletisim" />
      <PageHero
        title={project.title}
        breadcrumb={[
          { label: 'Anasayfa', href: '/starlife-insaat' },
          { label: 'Taahhüt İşleri', href: '/starlife-insaat/taahhutisleri' },
          { label: project.status, href: listHref },
          { label: project.title },
        ]}
        image={project.image}
      />

      <section className="bg-white px-5 py-16 sm:px-6 md:px-16 md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <Link
              to={listHref}
              className="inline-flex items-center gap-2 text-gold text-[11px] font-medium tracking-[0.3em] uppercase"
            >
              <ArrowLeft size={14} /> {project.status} İşlere Dön
            </Link>

            <span className="mt-10 block text-gold text-[11px] font-medium tracking-[0.4em] uppercase">
              {project.tag} · {project.status}
            </span>
            <h1 className="mt-4 font-serif-display text-4xl font-medium leading-tight tracking-tight text-ink text-balance md:text-6xl">
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-7 max-w-3xl text-base font-light leading-8 text-ink/65">
                {project.description}
              </p>
            )}

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {project.status && (
                <div className="border border-ink/10 bg-mist p-5">
                  <Building2 className="text-gold" size={22} strokeWidth={1.5} />
                  <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-ink/40">Durum</div>
                  <div className="mt-2 text-lg font-bold text-ink">{project.status}</div>
                </div>
              )}
              {project.location && (
                <div className="border border-ink/10 bg-mist p-5">
                  <MapPin className="text-gold" size={22} strokeWidth={1.5} />
                  <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-ink/40">Proje Yeri</div>
                  <div className="mt-2 text-lg font-bold text-ink">{project.location}</div>
                </div>
              )}
              {project.year && (
                <div className="border border-ink/10 bg-mist p-5">
                  <Calendar className="text-gold" size={22} strokeWidth={1.5} />
                  <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-ink/40">Tarih</div>
                  <div className="mt-2 text-lg font-bold text-ink">{project.year}</div>
                </div>
              )}
              {(project.sqmLabel || project.sqm > 0) && (
                <div className="border border-ink/10 bg-mist p-5">
                  <Ruler className="text-gold" size={22} strokeWidth={1.5} />
                  <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-ink/40">İnşaat Alanı</div>
                  <div className="mt-2 text-lg font-bold text-ink">
                    {project.sqmLabel || `${project.sqm.toLocaleString('tr-TR')} M²`}
                  </div>
                </div>
              )}
              {project.units > 0 && (
                <div className="border border-ink/10 bg-mist p-5">
                  <Building2 className="text-gold" size={22} strokeWidth={1.5} />
                  <div className="mt-5 text-[10px] uppercase tracking-[0.3em] text-ink/40">Konut Sayısı</div>
                  <div className="mt-2 text-lg font-bold text-ink">{project.units}</div>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-ink/10 bg-ink p-6 text-white">
              <div className="text-[10px] uppercase tracking-[0.35em] text-gold">Proje Detayları</div>
              <div className="mt-6 space-y-4 text-sm text-white/65">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
                  <span>Proje Türü</span>
                  <span className="text-white text-right">{project.tag}</span>
                </div>
                {project.institution && (
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
                    <span>Kurum</span>
                    <span className="text-white">{project.institution}</span>
                  </div>
                )}
                {project.location && (
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-4">
                    <span>Proje Yeri</span>
                    <span className="text-white text-right">{project.location}</span>
                  </div>
                )}
                {project.year && (
                  <div className="flex justify-between gap-4">
                    <span>Tarih</span>
                    <span className="text-white">{project.year}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="bg-mist px-5 py-16 sm:px-6 md:px-16 md:py-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-10">
              <span className="text-gold text-[11px] font-medium tracking-[0.4em] uppercase">Galeri</span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Proje Görselleri</h2>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group aspect-[4/3] overflow-hidden bg-ink text-left"
                >
                  <SafeImage
                    src={image}
                    alt={`${project.title} ${index + 1}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-white px-5 py-16 sm:px-6 md:px-16 md:py-20">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-2xl font-bold text-ink">Diğer Taahhüt İşleri</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/starlife-insaat/taahhut/${item.slug}`}
                  className="group overflow-hidden border border-ink/10"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-ink group-hover:text-pomegranate transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 p-3 text-white"
              aria-label="Galeriyi kapat"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              src={lightboxImage}
              alt={project.title}
              className="max-h-[90vh] max-w-[92vw] object-contain"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <SubsiteFooter brandPrefix="STAR" brandSuffix="LİFE" basePath="/starlife-insaat" description="Güvenli ve modern yaşam alanları." />
    </div>
  );
}
