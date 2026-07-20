import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Mail, MapPin, ChevronRight } from 'lucide-react';
import { HOLDING_NAV, SOCIALS } from '../../mock/mock';
import BrandLogo from '../shared/BrandLogo';
import ContactPhones from '../shared/ContactPhones';
import { useCompany } from '../../lib/siteSettings';

const EASE = [0.76, 0, 0.24, 1];
const EASE_OUT = [0.22, 1, 0.36, 1];

// Featured image per menu item — premium hover preview
const MENU_IMAGES = {
  'Kurumsal': 'https://images.pexels.com/photos/5403840/pexels-photo-5403840.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'Grup Şirketlerimiz': 'https://images.pexels.com/photos/34700467/pexels-photo-34700467.png?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'Bizden Haberler': 'https://images.pexels.com/photos/4458205/pexels-photo-4458205.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
  'İletişim': 'https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900',
};

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/33230969/pexels-photo-33230969.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=900';

const FOOTNOTES = ['ESTABLISHED 2009', 'DIYARBAKIR', 'TÜRKİYE', 'STARLIFE INŞAAT', 'GROUP', 'KAYAPINAR'];

export default function MegaMenu({ open, onClose }) {
  const company = useCompany();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  // ESC key to close & scroll lock
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Reset internal state when the menu is closed
  const handleClose = useCallback(() => {
    setHoveredItem(null);
    setExpandedItem(null);
    onClose();
  }, [onClose]);

  const activeImage = (hoveredItem && MENU_IMAGES[hoveredItem]) || DEFAULT_IMAGE;

  const toggleExpand = (label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* === TOP CURTAIN (charcoal, slides from top) === */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="fixed inset-0 z-[80] bg-charcoal bg-noise overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.10] blur-3xl bg-gold" />
              <div className="absolute -bottom-60 -right-20 w-[500px] h-[500px] rounded-full opacity-[0.07] blur-3xl bg-gold-light" />
            </div>

            <div className="relative h-[100dvh] flex flex-col">
              {/* TOP BAR */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex justify-between items-center h-14 md:h-20 px-5 md:px-12 shrink-0 border-b border-white/5"
              >
                <Link to="/" onClick={handleClose} className="flex items-center">
                  <BrandLogo variant="light" width={140} height={40} />
                </Link>

                <button
                  type="button"
                  onClick={handleClose}
                  className="group flex items-center gap-3 text-white/85 hover:text-pomegranate-light transition-colors -mr-2"
                  aria-label="Close"
                >
                  <span className="hidden md:inline font-mono-ui text-[10px] tracking-[0.35em] uppercase">Kapat</span>
                  <span className="relative w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 group-hover:border-pomegranate-light group-hover:bg-pomegranate-light/10 flex items-center justify-center transition-all duration-500">
                    <X size={18} strokeWidth={1.5} />
                  </span>
                </button>
              </motion.div>

              {/* === BODY: split-panel === */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* LEFT — Menu items */}
                <div className="flex-1 lg:flex-[1.4] flex flex-col justify-center px-5 md:px-12 lg:px-20 py-8 lg:py-0 relative overflow-y-auto">
                  <motion.nav
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.55 } } }}
                    className="flex flex-col gap-1 md:gap-1.5"
                  >
                    {HOLDING_NAV.map((item, idx) => {
                      const isExpanded = expandedItem === item.label;
                      const hasChildren = !!item.children;
                      return (
                        <motion.div
                          key={item.label}
                          variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
                          }}
                          onMouseEnter={() => setHoveredItem(item.label)}
                          className="group"
                        >
                          <div className="flex items-baseline gap-4 md:gap-7 border-b border-white/8 py-3 md:py-4">
                            <span className="font-mono-ui text-pomegranate-light/50 text-[10px] tracking-widest shrink-0 mt-2">
                              {String(idx + 1).padStart(2, '0')}
                            </span>

                            {hasChildren ? (
                              <button
                                type="button"
                                onClick={() => toggleExpand(item.label)}
                                className="flex-1 text-left flex items-baseline gap-4 outline-none py-1"
                              >
                                <span className={`font-serif-display text-white leading-[1] transition-all duration-500 ${
                                  isExpanded || hoveredItem === item.label ? 'text-pomegranate-light italic' : 'group-hover:italic'
                                }`}
                                style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}
                                >
                                  {item.label}
                                </span>
                                <ChevronRight
                                  size={20}
                                  strokeWidth={1.5}
                                  className={`text-pomegranate-light/60 transition-transform duration-500 ml-auto md:ml-0 shrink-0 ${
                                    isExpanded ? 'rotate-90 text-pomegranate-light' : ''
                                  }`}
                                />
                              </button>
                            ) : (
                              <Link
                                to={item.href}
                                onClick={handleClose}
                                className="flex-1 flex items-baseline gap-4 group"
                              >
                                <span
                                  className="font-serif-display text-white leading-[1] group-hover:text-pomegranate-light group-hover:italic transition-all duration-500"
                                  style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}
                                >
                                  {item.label}
                                </span>
                                <ArrowUpRight
                                  size={18}
                                  strokeWidth={1.5}
                                  className="text-white/30 group-hover:text-pomegranate-light group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500 ml-auto md:ml-0 shrink-0"
                                />
                              </Link>
                            )}
                          </div>

                          {/* Expanded children */}
                          {hasChildren && (
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: EASE_OUT }}
                                  className="overflow-hidden"
                                >
                                  <div className="pl-12 md:pl-20 py-3 md:py-4 flex flex-col gap-1.5">
                                    {item.children.map((c, ci) => (
                                      <motion.div
                                        key={c.href}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{ delay: ci * 0.05, duration: 0.4 }}
                                      >
                                        <Link
                                          to={c.href}
                                          onClick={handleClose}
                                          className="group/sub inline-flex min-h-11 items-center gap-3 text-white/55 text-base md:text-lg font-light hover:text-pomegranate-light transition-colors py-1"
                                        >
                                          <span className="w-6 h-[1px] bg-white/15 group-hover/sub:w-10 group-hover/sub:bg-pomegranate-light transition-all duration-400" />
                                          {c.label}
                                          <ArrowUpRight size={12} strokeWidth={1.5} className="opacity-0 group-hover/sub:opacity-100 -translate-x-1 group-hover/sub:translate-x-0 transition-all" />
                                        </Link>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.nav>
                </div>

                {/* RIGHT — Image preview panel (hidden on mobile) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: '0%' }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
                  className="hidden lg:block w-[40%] relative overflow-hidden bg-charcoal-mid"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0, scale: 1.08 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.9, ease: EASE_OUT }}
                      className="absolute inset-0"
                    >
                      <img src={activeImage} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-charcoal/60 via-transparent to-charcoal/40" />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Image label overlay */}
                  <div className="absolute bottom-10 left-10 right-10 z-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={hoveredItem || 'default'}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                      >
                        <span className="font-mono-ui text-pomegranate-light text-[10px] tracking-[0.4em] uppercase">
                          {hoveredItem ? '— Önizleme' : '— Starlife İnşaat'}
                        </span>
                        <p className="font-serif-display text-white text-3xl mt-3 leading-tight">
                          {hoveredItem || 'Güvenli Yaşam Alanları'}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Decorative corner mark */}
                  <div className="absolute top-8 right-8 z-10 flex items-center gap-2 font-mono-ui text-white/40 text-[10px] tracking-[0.3em] uppercase">
                    <span className="w-8 h-[1px] bg-white/20" />
                    <span>©2025</span>
                  </div>
                </motion.div>
              </div>

              {/* BOTTOM BAR */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="border-t border-white/8 shrink-0"
              >
                {/* Marquee strip */}
                <div className="overflow-hidden border-b border-white/5 py-3">
                  <div className="flex gap-10 animate-[marquee_28s_linear_infinite] whitespace-nowrap will-change-transform">
                    {[...FOOTNOTES, ...FOOTNOTES, ...FOOTNOTES].map((t, i) => (
                      <span key={`${t}-${i}`} className="font-mono-ui text-white/25 text-[10px] tracking-[0.5em] uppercase flex items-center gap-10 shrink-0">
                        {t}
                        <span className="inline-block w-1 h-1 rounded-full bg-pomegranate-light/40" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact + Socials */}
                <div className="px-5 md:px-12 py-5 flex flex-col md:flex-row gap-4 md:gap-8 md:items-center justify-between">
                  <div className="flex flex-col md:flex-row gap-3 md:gap-8 font-mono-ui text-white/45 text-[11px] tracking-[0.12em]">
                    <ContactPhones
                      company={company}
                      layout="inline"
                      className="flex flex-col md:flex-row gap-3 md:gap-8"
                      linkClassName="flex items-center gap-2.5 hover:text-pomegranate-light transition-colors"
                    />
                    <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 break-all hover:text-pomegranate-light transition-colors">
                      <Mail size={13} strokeWidth={1.5} /> {company.email}
                    </a>
                    <span className="hidden lg:flex items-center gap-2.5 text-white/30">
                      <MapPin size={13} strokeWidth={1.5} /> Diyarbakır / Türkiye
                    </span>
                  </div>

                  <div className="flex items-center gap-5">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono-ui text-white/45 hover:text-pomegranate-light text-[10px] tracking-[0.25em] uppercase transition-colors"
                      >
                        {s.name.slice(0, 2)}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
