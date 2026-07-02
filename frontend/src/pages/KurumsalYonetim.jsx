import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User } from 'lucide-react';
import HoldingHeader from '../components/holding/HoldingHeader';
import HoldingFooter from '../components/holding/HoldingFooter';
import PageHero from '../components/shared/PageHero';
import { mapTeamMember, useSupabaseRows } from '../lib/supabase/content';
import { isSupabaseConfigured } from '../lib/supabase/client';

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function splitTeamMembers(members) {
  if (!members.length) return { leader: null, board: [] };
  const sorted = [...members].sort((a, b) => (a.order_index ?? 999) - (b.order_index ?? 999));
  return { leader: sorted[0], board: sorted.slice(1) };
}

function TeamCard({ member, onSelect, className = '' }) {
  return (
    <motion.article
      variants={card}
      className={`group overflow-hidden bg-surface border border-border hover:shadow-lg hover:shadow-stone-200/60 hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      <div className="aspect-[3/4] relative overflow-hidden bg-stone-100">
        <TeamImage src={member.image} alt={member.name} />
        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="pt-6 pb-8 px-6">
        <div className="w-10 h-[2px] bg-gold mb-5" />
        <h3 className="text-xl font-black text-ink">{member.name}</h3>
        <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mt-2">
          {member.title}
        </p>
        <button
          type="button"
          onClick={() => onSelect(member)}
          className="mt-6 inline-flex items-center justify-center border border-gold px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold transition-all hover:bg-gold hover:text-white"
        >
          Özgeçmiş
        </button>
      </div>
    </motion.article>
  );
}

function TeamImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100 text-stone-300">
        <User size={44} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
      onError={() => setFailed(true)}
    />
  );
}

export default function KurumsalYonetim() {
  const [selectedMember, setSelectedMember] = useState(null);
  const teamMembers = useSupabaseRows(
    'team_members',
    {
      orderBy: 'order_index',
      ascending: true,
      filters: [{ column: 'active', value: true }],
      allowEmpty: true,
    },
    [],
    mapTeamMember,
  );

  useEffect(() => {
    if (!selectedMember) return undefined;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  const { leader, board } = useMemo(() => splitTeamMembers(teamMembers), [teamMembers]);

  return (
    <div className="bg-mist min-h-screen text-ink">
      <HoldingHeader />
      <PageHero
        title="Yönetim Kurulu"
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Kurumsal', href: '/kurumsal/hakkimizda' },
          { label: 'Yönetim Kurulu' },
        ]}
      />

      <section className="bg-mist py-16 px-5 sm:px-6 md:px-12 md:py-24 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-14">
            <span className="text-gold text-[11px] font-medium tracking-[0.4em] uppercase block mb-4">
              EKİBİMİZ
            </span>
            <h2 className="text-3xl font-bold text-ink tracking-[-0.01em] sm:text-4xl md:text-5xl">
              Vizyonumuzu Şekillendiren İsimler
            </h2>
            <p className="text-stone-500 font-light text-base mt-4 max-w-xl leading-relaxed">
              Starlife İnşaat&apos;ı bugünlere taşıyan deneyimli liderlik kadromuz. Bu liste admin panelindeki
              {' '}<strong className="font-medium text-ink">Yönetim Kurulu</strong> kayıtlarından gelir.
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white px-6 py-12 text-center text-stone-500">
              {isSupabaseConfigured
                ? 'Henüz yönetim kurulu üyesi eklenmemiş. Admin panelinden Yönetim bölümüne kayıt ekleyin.'
                : 'Supabase yapılandırması bulunamadı.'}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="max-w-5xl mx-auto mt-12 md:mt-16"
            >
              {leader && (
                <div className="flex justify-center mb-10 md:mb-14">
                  <TeamCard
                    member={leader}
                    onSelect={setSelectedMember}
                    className="w-full max-w-sm"
                  />
                </div>
              )}

              {board.length > 0 && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:gap-12">
                  {board.map((member) => (
                    <TeamCard
                      key={member.id || member.name}
                      member={member}
                      onSelect={setSelectedMember}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/70 px-5 py-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto bg-surface p-6 shadow-2xl shadow-black/25 sm:p-8 md:p-10"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="absolute right-5 top-5 grid h-10 w-10 place-items-center border border-border text-stone-500 transition hover:border-gold hover:text-gold"
                aria-label="Özgeçmişi kapat"
              >
                <X size={18} />
              </button>

              <span className="text-gold text-[10px] font-medium tracking-[0.45em] uppercase">
                Özgeçmiş
              </span>
              <h3 className="mt-4 pr-12 text-3xl font-black tracking-[-0.02em] text-ink md:text-4xl">
                {selectedMember.name}
              </h3>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
                {selectedMember.title}
              </p>
              <div className="mt-7 h-[1px] w-14 bg-gold" />
              <div className="mt-7 whitespace-pre-line text-base font-light leading-8 text-stone-600">
                {selectedMember.bio || `${selectedMember.name} için özgeçmiş bilgisi yakında eklenecektir.`}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <HoldingFooter />
    </div>
  );
}
