import React from 'react';

const AGENCY_URL = 'https://www.genuadigital.com';
const AGENCY_NAME = 'Genua Digital';

export default function AgencyCredit() {
  return (
    <div className="max-w-[1400px] mx-auto mt-5 pt-5 border-t border-white/[0.06]">
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
        <span className="hidden sm:block h-px w-8 bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden />
        <p className="text-center text-[10px] font-light uppercase tracking-[0.28em] text-white/30">
          Kurumsal web deneyimi
          <span className="mx-2 text-white/15" aria-hidden>
            ·
          </span>
          <a
            href={AGENCY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/45 transition-colors duration-300 hover:text-gold"
          >
            {AGENCY_NAME}
          </a>
        </p>
        <span className="hidden sm:block h-px w-8 bg-gradient-to-l from-transparent via-gold/40 to-transparent" aria-hidden />
      </div>
    </div>
  );
}
