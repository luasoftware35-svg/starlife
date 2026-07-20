import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail } from 'lucide-react';
import SubsiteHeader from '../components/shared/SubsiteHeader';
import SubsiteFooter from '../components/shared/SubsiteFooter';
import PageHero from '../components/shared/PageHero';
import ContactForm from '../components/shared/ContactForm';
import ContactPhones from '../components/shared/ContactPhones';
import MapEmbed from '../components/shared/MapEmbed';
import { useCompany } from '../lib/siteSettings';
import { fadeUp } from '../lib/animations';

function resolveSource(basePath = '') {
  if (basePath.includes('invest')) return 'invest';
  if (basePath.includes('erd')) return 'erd';
  if (basePath.includes('starlife')) return 'starlife';
  return 'holding';
}

export default function SubsiteIletisim({ navItems, brandPrefix, brandSuffix, basePath }) {
  const company = useCompany();
  const source = resolveSource(basePath);

  return (
    <div className="bg-white text-ink min-h-screen">
      <SubsiteHeader navItems={navItems} brandPrefix={brandPrefix} brandSuffix={brandSuffix} contactHref={`${basePath}/iletisim`} />
      <PageHero title="Bize Ulaşın" breadcrumb={[{ label: 'Anasayfa', href: basePath }, { label: 'İletişim' }]} image="https://images.pexels.com/photos/3818947/pexels-photo-3818947.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1600" />

      <section className="grid min-h-[600px] lg:grid-cols-2">
        <div className="bg-cream p-6 sm:p-10 md:p-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-pomegranate text-xs tracking-[0.4em] uppercase font-semibold">BİZE ULAŞIN</span>
            <h2 className="text-ink text-3xl md:text-4xl font-black mt-3">En kısa sürede sizinle irtibata geçeceğiz</h2>
            <div className="mt-10"><ContactForm darkMode={false} policyBasePath={basePath} source={source} /></div>
          </motion.div>
        </div>
        <div className="bg-white text-ink p-6 sm:p-10 md:p-16 border-l border-ink/5">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-pomegranate text-xs tracking-[0.4em] uppercase font-semibold">İletişim Bilgileri</span>
            <h3 className="font-black text-2xl md:text-3xl mt-3">Sizinle tanışmak isteriz</h3>
            <div className="mt-10 space-y-8">
              {[
                { icon: MapPin, label: 'ADRES', value: company.address },
                { icon: Mail, label: 'MAİL', value: company.email, href: `mailto:${company.email}` },
              ].map((i) => (
                <div key={i.label} className="flex gap-4 sm:gap-5 items-start">
                  <div className="w-12 h-12 bg-pomegranate/10 flex items-center justify-center text-pomegranate shrink-0"><i.icon size={20} /></div>
                  <div>
                    <p className="text-pomegranate text-[10px] tracking-[0.3em] uppercase font-semibold">{i.label}</p>
                    {i.href ? <a href={i.href} className="text-ink text-base mt-1 block break-words hover:text-pomegranate transition-colors">{i.value}</a> : <p className="text-ink text-base mt-1 break-words">{i.value}</p>}
                  </div>
                </div>
              ))}
              <ContactPhones company={company} layout="contact" linkClassName="" />
            </div>
            <div className="mt-10 overflow-hidden">
              <MapEmbed title="Starlife İnşaat Konum Haritası" />
            </div>
          </motion.div>
        </div>
      </section>

      <SubsiteFooter brandPrefix={brandPrefix} brandSuffix={brandSuffix} basePath={basePath} description="Güvenli ve modern yaşam alanları." />
    </div>
  );
}
