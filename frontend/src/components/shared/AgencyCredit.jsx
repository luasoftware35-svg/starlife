import React from 'react';

const AGENCY_URL = 'https://www.genuadigital.com';
const AGENCY_NAME = 'Genua digital';

export default function AgencyCredit() {
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-light">
      <span className="uppercase tracking-[0.22em] text-white/50">Dijital partner</span>
      <span className="text-white/35" aria-hidden>
        ·
      </span>
      <a
        href={AGENCY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white/65 transition-colors duration-300 hover:text-gold tracking-[0.06em]"
      >
        {AGENCY_NAME}
      </a>
    </span>
  );
}
