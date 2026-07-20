import React from 'react';
import { Phone } from 'lucide-react';

export function formatTel(phone = '') {
  return phone.replace(/\s/g, '');
}

export function getCompanyPhones(company = {}) {
  return [
    { label: 'Sabit Hat', value: company.phone },
    { label: 'Özel Projeler', value: company.phoneProjects },
  ].filter((item) => item.value);
}

export default function ContactPhones({
  company,
  layout = 'footer',
  className = '',
  linkClassName = 'hover:text-gold transition-colors',
}) {
  const phones = getCompanyPhones(company);
  if (!phones.length) return null;

  if (layout === 'inline') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {phones.map((item) => (
          <a
            key={item.label}
            href={`tel:${formatTel(item.value)}`}
            className={`flex items-center gap-2.5 ${linkClassName}`}
          >
            <Phone size={13} strokeWidth={1.5} className="shrink-0" />
            <span>
              <span className="text-white/30">{item.label}: </span>
              {item.value}
            </span>
          </a>
        ))}
      </div>
    );
  }

  if (layout === 'contact') {
    return (
      <div className={`space-y-8 ${className}`}>
        {phones.map((item) => (
          <div key={item.label} className="flex gap-4 sm:gap-5 items-start">
            <div className="w-12 h-12 bg-pomegranate/10 flex items-center justify-center text-pomegranate shrink-0">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-pomegranate text-[10px] tracking-[0.3em] uppercase font-semibold">{item.label}</p>
              <a
                href={`tel:${formatTel(item.value)}`}
                className={`text-ink text-base mt-1 block break-words hover:text-pomegranate transition-colors ${linkClassName}`}
              >
                {item.value}
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {phones.map((item) => (
        <li key={item.label} className="flex gap-3 text-white/60 text-sm font-light">
          <Phone size={15} strokeWidth={1.5} className="text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold/80">{item.label}</p>
            <a href={`tel:${formatTel(item.value)}`} className={`block mt-0.5 ${linkClassName}`}>
              {item.value}
            </a>
          </div>
        </li>
      ))}
    </>
  );
}
