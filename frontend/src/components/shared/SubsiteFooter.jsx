import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ArrowUpRight } from 'lucide-react';
import ContactPhones from './ContactPhones';
import SocialLinks from './SocialLinks';
import BrandLogo from './BrandLogo';
import { useCompany } from '../../lib/siteSettings';
import { policyPaths } from '../../lib/policyPaths';
import AgencyCredit from './AgencyCredit';

export default function SubsiteFooter({ brandPrefix, brandSuffix, basePath = '/', accentClass = 'text-pomegranate', description }) {
  const company = useCompany();
  const legalPaths = policyPaths(basePath);
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-ink border-t border-white/10 pt-20 pb-8 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to={basePath} className="inline-flex items-center">
            <BrandLogo variant="light" width={140} height={40} />
          </Link>
          <p className="text-white/55 text-base mt-5 max-w-xs leading-relaxed font-light">{description}</p>
          <div className="mt-7"><SocialLinks theme="dark" /></div>
        </div>

        <div>
          <h4 className="text-gold text-[11px] tracking-[0.35em] uppercase mb-6 font-medium">Hızlı Linkler</h4>
          <ul className="space-y-3.5">
            <li><Link to={basePath} className="text-white/60 text-sm font-light hover:text-gold hover:translate-x-1 transition-all inline-block">Anasayfa</Link></li>
            <li><Link to={`${basePath}/blog`} className="text-white/60 text-sm font-light hover:text-gold hover:translate-x-1 transition-all inline-block">Bizden Haberler</Link></li>
            <li><Link to={`${basePath}/iletisim`} className="text-white/60 text-sm font-light hover:text-gold hover:translate-x-1 transition-all inline-block">İletişim</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold text-[11px] tracking-[0.35em] uppercase mb-6 font-medium">Grup Şirketlerimiz</h4>
          <ul className="space-y-3.5">
            <li><Link to="/starlife-insaat" className="text-white/60 text-sm font-light hover:text-gold hover:translate-x-1 transition-all inline-flex items-center gap-1.5">Starlife İnşaat <ArrowUpRight size={12} className="opacity-60" /></Link></li>
            <li><Link to="/erd-insaat" className="text-white/60 text-sm font-light hover:text-gold hover:translate-x-1 transition-all inline-flex items-center gap-1.5">ERD İnşaat <ArrowUpRight size={12} className="opacity-60" /></Link></li>
            <li><Link to="/invest-insaat" className="text-white/60 text-sm font-light hover:text-gold hover:translate-x-1 transition-all inline-flex items-center gap-1.5">İnvest İnşaat <ArrowUpRight size={12} className="opacity-60" /></Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-gold text-[11px] tracking-[0.35em] uppercase mb-6 font-medium">İletişim</h4>
          <ul className="space-y-5">
            <li className="flex gap-3 text-white/60 text-sm font-light leading-relaxed"><MapPin size={15} strokeWidth={1.5} className="text-gold mt-0.5 shrink-0" /><span>{company.address}</span></li>
            <li className="flex gap-3 text-white/60 text-sm font-light"><Mail size={15} strokeWidth={1.5} className="text-gold mt-0.5 shrink-0" /><a href={`mailto:${company.email}`} className="break-all hover:text-gold transition-colors">{company.email}</a></li>
            <ContactPhones company={company} layout="footer" />
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-6 border-t border-white/10 flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-6">
        <p className="text-white/35 text-[11px] tracking-[0.1em] font-light text-center md:text-left">
          Tüm Hakları Saklıdır © {currentYear} Starlife İnşaat
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-end">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link to={legalPaths.kvkk} className="text-white/35 text-[11px] tracking-[0.1em] font-light hover:text-gold transition-colors">KVKK Metni</Link>
            <Link to={legalPaths.cookies} className="text-white/35 text-[11px] tracking-[0.1em] font-light hover:text-gold transition-colors">Çerez Politikası</Link>
          </div>
          <span className="hidden sm:block h-3 w-px bg-white/15" aria-hidden />
          <AgencyCredit />
        </div>
      </div>
    </footer>
  );
}
