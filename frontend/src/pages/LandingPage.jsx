import React, { useState, useEffect, useCallback, useRef, lazy, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Menu, Search, ArrowUpRight, Pause, Play } from 'lucide-react';
import { HERO_SLIDES } from '../mock/mock';
import { mapHeroSlide, useSupabaseRows } from '../lib/supabase/content';
import { optimizeImageUrl } from '../lib/imageUtils';
import BrandLogo from '../components/shared/BrandLogo';
import SkipToContent from '../components/shared/SkipToContent';
import SiteSearchOverlay, { useSiteSearchOverlay } from '../components/shared/SiteSearchOverlay';

const MegaMenu = lazy(() => import('../components/holding/MegaMenu'));

const SLIDE_INTERVAL_MS = 5000;
const EASE = [0.22, 1, 0.36, 1];
const SLIDE_TRANSITION = { duration: 0.8, ease: EASE };
const textMotion = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5, ease: EASE, delay },
});

export default function LandingPage() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pausedRef = useRef(false);
  const { open: siteSearchOpen, openSearch: showSiteSearch, closeSearch: hideSiteSearch } = useSiteSearchOverlay();
  const progressControls = useAnimationControls();
  const slides = useSupabaseRows(
    'hero_slides',
    { orderBy: 'order_index', ascending: true, filters: [{ column: 'active', value: true }] },
    HERO_SLIDES,
    mapHeroSlide,
  );
  const displaySlides = slides.length ? slides : HERO_SLIDES;
  const slideCount = displaySlides.length || 1;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const t = setInterval(() => setActive((p) => (p + 1) % slideCount), SLIDE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, reduceMotion, slideCount]);

  useEffect(() => {
    if (active >= slideCount) setActive(0);
  }, [active, slideCount]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    progressControls.set({ scaleX: 0 });
    if (!pausedRef.current && !reduceMotion) {
      progressControls.start({ scaleX: 1, transition: { duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' } });
    }
  }, [active, progressControls, reduceMotion]);

  useEffect(() => {
    if (paused || reduceMotion) {
      progressControls.stop();
      return;
    }
    progressControls.start({ scaleX: 1, transition: { duration: SLIDE_INTERVAL_MS / 1000, ease: 'linear' } });
  }, [paused, reduceMotion, progressControls]);

  const goToSlide = useCallback((i) => {
    setActive(i);
    setPaused(true);
  }, []);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const slide = displaySlides[active] || displaySlides[0];
  const lcpImage = useMemo(
    () => optimizeImageUrl(displaySlides[0]?.image, { width: 1600, quality: 75 }),
    [displaySlides],
  );
  const num = String(active + 1).padStart(2, '0');
  const total = String(slideCount).padStart(2, '0');

  return (
    <>
      <SkipToContent />
    <main
      id="main-content"
      tabIndex={-1}
      className="relative h-[100dvh] w-full overflow-hidden flex flex-col-reverse md:flex-row bg-mist outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {lcpImage && (
        <Helmet prioritizeSeoTags>
          <link rel="preload" as="image" href={lcpImage} fetchPriority="high" />
        </Helmet>
      )}
      {/* === LEFT PANEL === */}
      <aside className="relative w-full md:w-[42%] h-[55vh] md:h-full flex flex-col z-10 overflow-hidden shrink-0 bg-warm bg-noise">
        {/* Cinematic gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm via-mist to-surface" />

        {/* Subtle pomegranate glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-[0.18] blur-3xl bg-gold/30" />
          <div className="absolute -bottom-40 right-0 w-[400px] h-[400px] rounded-full opacity-[0.14] blur-3xl bg-gold-light/30" />
        </div>

        {/* Vertical pagination — desktop */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-5 z-20">
          {displaySlides.map((s, i) => (
            <button
              key={`dot-${s.tag}`}
              onClick={() => goToSlide(i)}
              aria-label={`slide-${i + 1}`}
              className="group flex items-center gap-4 outline-none"
            >
              <span className={`font-sans text-[11px] font-medium tracking-[0.12em] transition-all duration-500 ${i === active ? 'text-gold' : 'text-stone-400 group-hover:text-stone-600'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`relative block h-[2px] overflow-hidden transition-all duration-700 ease-out ${i === active ? 'w-12 bg-stone-300' : 'w-4 bg-stone-300 group-hover:w-6 group-hover:bg-stone-400'}`}>
                {i === active && (
                  <motion.span
                    key={`dot-fill-${active}`}
                    className="absolute inset-0 origin-left bg-gold"
                    initial={{ scaleX: 0 }}
                    animate={progressControls}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile horizontal pagination */}
        <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {displaySlides.map((s, i) => (
            <button key={`mdot-${s.tag}`} onClick={() => goToSlide(i)} aria-label={`slide-${i + 1}`}
              className={`relative h-[2px] overflow-hidden transition-all duration-500 ${i === active ? 'w-8 bg-stone-300' : 'w-4 bg-stone-300'}`}>
              {i === active && (
                <motion.span
                  key={`mobile-dot-fill-${active}`}
                  className="absolute inset-0 origin-left bg-gold"
                  initial={{ scaleX: 0 }}
                  animate={progressControls}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content wrapper */}
        <div className="relative h-full flex flex-col justify-end px-7 md:pl-24 md:pr-12 pb-10 md:pb-24 z-10">
          {/* Huge number — desktop only */}
          <div className="hidden md:block absolute right-8 top-24 pointer-events-none select-none overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`big-${active}`}
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 1, ease: EASE }}
                className="number-outline text-[clamp(8rem,14vw,16rem)] leading-none opacity-30"
              >
                {num}
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col relative"
            >
              {/* Eyebrow tag */}
              <motion.div
                key={`tag-${active}`}
                {...textMotion(0)}
                className="flex items-center gap-4 mb-7 md:mb-9"
              >
                <span className="w-9 h-[2px] bg-gold" />
                <span className="font-sans text-gold text-[11px] font-medium tracking-[0.4em] uppercase">
                  {slide.tag}
                </span>
              </motion.div>

              {/* Main heading — Instrument Serif */}
              <motion.h1
                key={`title-${active}`}
                {...textMotion(0.15)}
                className="font-sans text-ink font-black tracking-[-0.02em] leading-[0.95] mb-7 md:mb-9 whitespace-pre-line"
                style={{ fontSize: 'clamp(3rem, 5.2vw, 5.5rem)' }}
              >
                {slide.title}
              </motion.h1>

              {/* Body copy */}
              <motion.p
                key={`desc-${active}`}
                {...textMotion(0.3)}
                className="text-stone-500 text-base leading-relaxed mb-10 md:mb-14 max-w-[360px] font-light"
              >
                {slide.desc}
              </motion.p>

              {/* CTA */}
              <motion.div key={`cta-${active}`} {...textMotion(0.45)}>
                <Link
                  to={slide.href}
                  className="group inline-flex items-center gap-5 outline-none"
                >
                  <span className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-gold group-hover:border-gold group-hover:bg-gold transition-all duration-500">
                    <ArrowUpRight size={18} strokeWidth={1.5} className="text-gold group-hover:text-white transition-colors duration-300" />
                  </span>
                  <span className="font-sans text-ink text-[11px] font-medium tracking-[0.35em] uppercase">
                    {slide.cta}
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom info bar — desktop */}
        <div className="hidden md:flex absolute bottom-6 left-24 right-10 items-center justify-between font-sans text-stone-400 text-[11px] font-medium tracking-[0.25em] uppercase">
          <span>Diyarbakır <span className="mx-2 text-stone-300">/</span> Türkiye <span className="mx-2 text-stone-300">/</span> 2009</span>
          <span>
            <span className="text-gold">{num}</span>
            <span className="mx-2 text-stone-300">—</span>
            <span className="text-stone-500">{total}</span>
          </span>
        </div>
      </aside>

      {/* === RIGHT PANEL — Full bleed image === */}
      <div className="relative w-full md:w-[58%] h-[45vh] md:h-full overflow-hidden bg-ink">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={SLIDE_TRANSITION}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              fetchPriority={active === 0 ? 'high' : 'auto'}
              loading={active === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            {/* Cinematic blends */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-charcoal/70 via-charcoal/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-charcoal/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Editorial label — top right corner */}
        <div className="hidden md:flex absolute top-24 right-10 flex-col items-end gap-2 z-20">
          <span className="font-sans text-white/50 text-[11px] font-medium tracking-[0.3em] uppercase">{slide.tag}</span>
          <span className="w-12 h-[2px] bg-gold/70" />
        </div>

        {/* Mobile slide counter + pause */}
        <div className="absolute bottom-4 right-5 md:hidden flex items-center gap-3">
          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/20 text-white"
              aria-label={paused ? 'Slayt geçişini devam ettir' : 'Slayt geçişini duraklat'}
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          )}
          <div className="font-sans text-white/65 text-[11px] font-medium tracking-[0.3em]">
            <span className="text-gold-light">{num}</span> / {total}
          </div>
        </div>

        {/* Progress bar — visual interval indicator */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 overflow-hidden">
          <motion.div
            key={`bar-${active}`}
            initial={{ scaleX: 0 }}
            animate={progressControls}
            className="h-full bg-gold origin-left"
          />
        </div>
      </div>

      {/* === HEADER === */}
      <header className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-5 md:px-12 h-14 md:h-20 backdrop-blur-md bg-white/60 border-b border-white/40 transition-all duration-300">
        <button onClick={openMenu} className="flex items-center gap-3 text-stone-700 hover:text-gold transition-colors group" aria-label="menu">
          <Menu size={20} strokeWidth={1.5} />
          <span className="hidden md:inline font-sans text-[11px] font-medium tracking-[0.35em] uppercase">Menü</span>
        </button>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <BrandLogo variant="dark" width={140} height={40} />
        </Link>

        <div className="flex items-center gap-3 md:gap-7">
          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="hidden md:grid h-10 w-10 place-items-center text-stone-700 hover:text-gold transition-colors"
              aria-label={paused ? 'Slayt geçişini devam ettir' : 'Slayt geçişini duraklat'}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          )}
          <button onClick={showSiteSearch} className="text-stone-700 hover:text-gold transition-colors p-2 -mr-2" aria-label="Site araması">
            <Search size={17} strokeWidth={1.5} />
          </button>
          <a
            href="https://heyzine.com/flip-book/0f96dbe75c.html"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-stone-700 hover:text-gold text-[11px] tracking-[0.35em] uppercase font-sans font-medium group"
          >
            E-Katalog
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>
      </header>

      {/* Hamburger Menu Overlay — premium split-panel mega menu */}
      {menuOpen && (
        <Suspense fallback={null}>
          <MegaMenu open={menuOpen} onClose={closeMenu} />
        </Suspense>
      )}

      <SiteSearchOverlay open={siteSearchOpen} onClose={hideSiteSearch} basePath="" />
    </main>
    </>
  );
}
