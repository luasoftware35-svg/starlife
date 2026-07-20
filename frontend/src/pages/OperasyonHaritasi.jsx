import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cities from 'react-turkey-map/src/cities';
import HoldingHeader from '../components/holding/HoldingHeader';
import HoldingFooter from '../components/holding/HoldingFooter';
import PageHero from '../components/shared/PageHero';
import { mapLocation, useSupabaseRows } from '../lib/supabase/content';
import { mapFallbackImage } from '../lib/fallbackImages';

const EASE = [0.22, 1, 0.36, 1];

const locations = [
  {
    id: 1,
    plate: '34',
    city: 'İstanbul',
    region: 'MARMARA',
    count: 1,
    year: '2024-2026',
    cx: '14%',
    cy: '26%',
    project: { name: 'İstanbul Konut Projesi', desc: 'Modern şehir yaşamı için tasarlanmış premium konut projesi.', image: mapFallbackImage('İstanbul'), units: 120, sqm: 8500, year: '2024-2026', status: 'DEVAM EDİYOR' },
  },
  {
    id: 2,
    plate: '06',
    city: 'Ankara',
    region: 'İÇ ANADOLU',
    count: 1,
    year: '2025',
    cx: '38%',
    cy: '38%',
    project: { name: 'Ankara Karma Proje', desc: 'Ticari ve konut kullanımını bir arada sunan karma proje.', image: mapFallbackImage('Ankara'), units: 85, sqm: 12000, year: '2025', status: 'DEVAM EDİYOR' },
  },
  {
    id: 3,
    plate: '41',
    city: 'Kocaeli',
    region: 'MARMARA',
    count: 1,
    year: '2023',
    cx: '22%',
    cy: '22%',
    project: { name: 'Kocaeli Residence', desc: 'Sanayi şehrinin kalbinde huzurlu yaşam alanları.', image: mapFallbackImage('Kocaeli'), units: 60, sqm: 4200, year: '2023', status: 'TAMAMLANDI' },
  },
  {
    id: 4,
    plate: '11',
    city: 'Bilecik',
    region: 'MARMARA',
    count: 1,
    year: '2022',
    cx: '27%',
    cy: '30%',
    project: { name: 'Bilecik Konut', desc: 'Doğayla iç içe, modern yaşam standartlarında konutlar.', image: mapFallbackImage('Bilecik'), units: 40, sqm: 3100, year: '2022', status: 'TAMAMLANDI' },
  },
  {
    id: 5,
    plate: '20',
    city: 'Denizli',
    region: 'EGE',
    count: 1,
    year: '2024-2025',
    cx: '20%',
    cy: '56%',
    project: { name: 'Denizli Residence', desc: "Ege'nin sıcaklığında modern yaşam kompleksi.", image: mapFallbackImage('Denizli'), units: 72, sqm: 5800, year: '2024-2025', status: 'DEVAM EDİYOR' },
  },
  {
    id: 6,
    plate: '07',
    city: 'Antalya',
    region: 'AKDENİZ',
    count: 1,
    year: '2025-2026',
    cx: '30%',
    cy: '70%',
    project: { name: 'Lara Coastal Villas', desc: 'Akdeniz kıyısında, doğal taş ve travertenin ışıkla diyaloğunu kuran limitli sayıda villa serisi.', image: mapFallbackImage('Antalya'), units: 42, sqm: 16500, year: '2025-2026', status: 'DEVAM EDİYOR' },
  },
  {
    id: 7,
    plate: '63',
    city: 'Şanlıurfa',
    region: 'GÜNEYDOĞU',
    count: 1,
    year: '2024-2026',
    cx: '62%',
    cy: '68%',
    project: { name: 'Urfa Konut Projesi', desc: 'Tarihi dokunun modern yorumu ile şekillenen yaşam alanları.', image: mapFallbackImage('Şanlıurfa'), units: 95, sqm: 7200, year: '2024-2026', status: 'DEVAM EDİYOR' },
  },
  {
    id: 8,
    plate: '44',
    city: 'Malatya',
    region: 'DOĞU ANADOLU',
    count: 1,
    year: '2024-2026',
    cx: '65%',
    cy: '52%',
    project: { name: 'Malatya Residence', desc: "Doğu Anadolu'nun merkezinde kaliteli ve güvenli yaşam.", image: mapFallbackImage('Malatya'), units: 55, sqm: 4600, year: '2024-2026', status: 'DEVAM EDİYOR' },
  },
  {
    id: 9,
    plate: '23',
    city: 'Elazığ',
    region: 'DOĞU ANADOLU',
    count: 1,
    year: '2024-2026',
    cx: '70%',
    cy: '48%',
    project: { name: 'Elazığ Konut', desc: 'Depreme dayanıklı modern yapı teknolojisiyle inşa edilen konut projesi.', image: mapFallbackImage('Elazığ'), units: 48, sqm: 3800, year: '2024-2026', status: 'DEVAM EDİYOR' },
  },
  {
    id: 10,
    plate: '21',
    city: 'Diyarbakır',
    region: 'GÜNEYDOĞU',
    count: 1,
    year: '2024-2025',
    cx: '74%',
    cy: '60%',
    project: { name: 'Starlife Residence', desc: "Starlife İnşaat'ın Diyarbakır'daki amiral gemisi konut projesi.", image: mapFallbackImage('Diyarbakır'), units: 110, sqm: 9200, year: '2024-2025', status: 'DEVAM EDİYOR' },
  },
  {
    id: 11,
    plate: '73',
    city: 'Şırnak',
    region: 'GÜNEYDOĞU',
    count: 1,
    year: '2024-2025',
    cx: '82%',
    cy: '66%',
    project: { name: 'Şırnak Konut Projesi', desc: 'Sınır şehrinde modern ve güvenli yaşam alanları.', image: mapFallbackImage('Şırnak'), units: 35, sqm: 2900, year: '2024-2025', status: 'DEVAM EDİYOR' },
  },
];

function ProjectImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-[#202020] via-[#171717] to-[#0F0F0F]" />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full aspect-video object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function DetailPanel({ selected, onClose }) {
  return (
    <AnimatePresence mode="wait">
      {selected && (
        <motion.aside
          key={selected.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full lg:w-[400px] bg-[#151515] border border-stone-800 p-6 lg:p-8 shadow-2xl shadow-black/30"
        >
          <div className="flex items-start justify-between gap-6">
            <span className="text-[10px] tracking-[0.4em] text-stone-500 uppercase">
              {selected.region}
            </span>
          </div>

          <h3 className="font-serif italic text-white mt-4 leading-none" style={{ fontSize: 'clamp(3.5rem, 7vw, 5rem)' }}>
            {selected.city}
          </h3>

          <div className="relative mt-8 overflow-hidden border border-stone-800">
            <ProjectImage src={selected.project.image} alt={selected.project.name} />
            <span className="absolute top-4 left-4 text-[10px] text-gold tracking-[0.35em] uppercase bg-[#0F0F0F]/80 px-3 py-1">
              {selected.project.status}
            </span>
          </div>

          <h4 className="font-serif italic text-white text-2xl mt-6">
            {selected.project.name}
          </h4>
          <p className="font-light text-sm text-stone-400 leading-relaxed mt-3">
            {selected.project.desc}
          </p>

          <div className="grid grid-cols-3 border border-stone-800 mt-8">
            {[
              ['ÜNİTE', selected.project.units],
              ['M²', Number(selected.project.sqm || 0).toLocaleString('tr-TR')],
              ['YIL', selected.project.year],
            ].map(([label, value]) => (
              <div key={label} className="p-4 border-r border-stone-800 last:border-r-0">
                <div className="text-[10px] tracking-widest text-stone-500 uppercase">{label}</div>
                <div className="font-bold text-white text-lg mt-2">{value}</div>
              </div>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export default function OperasyonHaritasi() {
  const operationLocations = useSupabaseRows(
    'map_locations',
    { orderBy: 'order_index', ascending: true, filters: [{ column: 'active', value: true }] },
    locations,
    mapLocation,
  );
  const [selected, setSelected] = useState(operationLocations[5] || operationLocations[0] || null);
  const chipRefs = useRef({});
  const servedPlates = useMemo(
    () => new Set(operationLocations.map((location) => String(location.plate || '')).filter(Boolean)),
    [operationLocations],
  );
  const locationsByPlate = useMemo(
    () => new Map(operationLocations.map((location) => [String(location.plate || ''), location])),
    [operationLocations],
  );

  useEffect(() => {
    if (!selected && operationLocations.length) {
      setSelected(operationLocations[0]);
      return;
    }

    if (selected && !operationLocations.some((location) => location.id === selected.id)) {
      setSelected(operationLocations[0] || null);
    }
  }, [operationLocations, selected]);

  useEffect(() => {
    if (selected && chipRefs.current[selected.id]) {
      chipRefs.current[selected.id].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selected]);

  const selectLocation = (event, location) => {
    event.stopPropagation();
    setSelected(location);
  };

  return (
    <div className="bg-[#0F0F0F] min-h-screen text-white">
      <HoldingHeader />
      <PageHero
        title="Operasyon Haritası"
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Kurumsal', href: '/kurumsal/hakkimizda' },
          { label: 'Operasyon Haritası' },
        ]}
      />

      <section className="bg-[#0F0F0F] py-16 px-5 sm:px-6 md:px-12 md:py-20 lg:px-20">
        <style>
          {`
            @keyframes provinceFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .operation-map svg {
              display: block;
              width: 100%;
              height: auto;
              filter: drop-shadow(0 40px 80px rgba(0,0,0,0.35));
            }
            .operation-map svg path {
              fill: #1A1A1A;
              stroke: #2E2E2E;
              stroke-width: 0.6;
              opacity: 0;
              animation: provinceFade 1.2s ease forwards;
              transition: fill 0.35s ease, stroke 0.35s ease;
            }
            ${Array.from({ length: 81 }, (_, index) => `.operation-map svg > g > g:nth-child(${index + 1}) path { animation-delay: ${(index * 0.012).toFixed(3)}s; }`).join('\n')}
            .operation-map svg g:hover path,
            .operation-map svg path:hover {
              fill: #252525;
              stroke: #333333;
            }
          `}
        </style>

        <div className="max-w-[1500px] mx-auto">
          <div className="mb-14">
            <span className="text-gold text-[11px] font-medium tracking-[0.4em] uppercase block mb-4">
              OPERASYONLARIMIZ
            </span>
            <h2 className="text-3xl font-bold text-white tracking-[-0.01em] sm:text-4xl md:text-5xl">
              Türkiye Genelinde Faaliyet Alanlarımız
            </h2>
            <p className="text-stone-400 font-light text-base mt-4 max-w-xl leading-relaxed">
              Projelerimizi gerçekleştirdiğimiz şehirleri keşfedin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start mt-14">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, ease: EASE }}
              className="min-w-0"
            >
              <div
                className="relative w-full bg-[#0F0F0F] border border-[#202020] p-3 sm:p-4 md:p-8 overflow-hidden operation-map"
                onClick={() => setSelected(null)}
              >
                <svg viewBox="0 0 1007 443" xmlns="http://www.w3.org/2000/svg" aria-label="Türkiye operasyon haritası">
                  <g>
                    {cities.map((city) => {
                      const plate = String(city.plate);
                      const active = String(selected?.plate || '') === plate;
                      const location = locationsByPlate.get(plate);
                      const served = servedPlates.has(plate);
                      return (
                        <g
                          key={city.plate}
                          data-city={city.city}
                          data-plate={city.plate}
                          onClick={location ? (event) => selectLocation(event, location) : undefined}
                          className={location ? 'cursor-pointer' : undefined}
                        >
                          <path
                            d={city.draw}
                            style={
                              active
                                ? { fill: '#2B2415', stroke: '#D4AF37', strokeWidth: 1.1 }
                                : served
                                  ? { fill: '#211E18', stroke: 'rgba(212,175,55,0.35)', strokeWidth: 0.9 }
                                  : undefined
                            }
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>

                <div className="absolute inset-4 z-10 pointer-events-none md:inset-8">
                  {operationLocations.map((loc, index) => {
                    const active = selected?.id === loc.id;
                    const labelTransform = index % 2 === 0 ? 'translate(-50%, calc(-100% - 8px))' : 'translate(-50%, 8px)';
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={(event) => selectLocation(event, loc)}
                        className={`absolute pointer-events-auto whitespace-nowrap rounded-sm border px-2 py-1 text-left font-serif italic text-[10px] leading-none shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-colors sm:px-2.5 sm:text-sm md:text-base ${
                          active
                            ? 'border-gold/50 bg-[#0F0F0F]/80 text-white'
                            : 'border-gold/20 bg-[#0F0F0F]/55 text-stone-300 hover:border-gold/45 hover:text-white'
                        }`}
                        style={{ left: loc.cx, top: loc.cy, transform: labelTransform }}
                        aria-label={`${loc.city} projesini göster`}
                      >
                        {loc.city}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8">
                <div className="text-[10px] tracking-[0.4em] text-stone-500 uppercase mb-4">
                  YER İŞARETLERİ
                </div>
                <div className="flex gap-2 overflow-x-auto pb-3">
                  {operationLocations.map((loc) => {
                    const active = selected?.id === loc.id;
                    return (
                      <button
                        key={loc.id}
                        ref={(node) => { chipRefs.current[loc.id] = node; }}
                        onClick={() => setSelected(loc)}
                        className={`shrink-0 border px-4 py-2 text-[11px] transition-all duration-300 ${
                          active ? 'border-gold text-white bg-gold/5' : 'border-stone-700 text-stone-400 hover:border-gold/60 hover:text-white'
                        }`}
                      >
                        <span className="font-bold">{loc.city}</span>
                        <span className="text-stone-500 text-[9px] ml-1">{loc.region}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <div className="lg:sticky lg:top-24">
              <DetailPanel selected={selected} onClose={() => setSelected(null)} />
            </div>
          </div>
        </div>
      </section>

      <HoldingFooter />
    </div>
  );
}
