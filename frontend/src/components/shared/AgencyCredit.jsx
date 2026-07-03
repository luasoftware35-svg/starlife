import React from 'react';

const AGENCY_URL = 'https://www.genuadigital.com';
const AGENCY_NAME = 'Genua digital';

export default function AgencyCredit() {
  return (
    <div className="max-w-[1400px] mx-auto mt-6 pt-5 border-t border-white/[0.05]">
      <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center text-[10px] font-light tracking-[0.24em] text-white/28">
        <span className="uppercase">Dijital partner</span>
        <span className="text-white/12" aria-hidden>
          ·
        </span>
        <a
          href={AGENCY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/42 transition-colors duration-500 hover:text-gold/90 normal-case tracking-[0.14em]"
        >
          {AGENCY_NAME}
        </a>
      </p>
    </div>
  );
}
