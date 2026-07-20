import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { COMPANY as DEFAULT_COMPANY, SOCIALS as DEFAULT_SOCIALS } from '../mock/mock';
import { supabase } from './supabase/client';

const SiteSettingsContext = createContext({
  company: DEFAULT_COMPANY,
  socials: DEFAULT_SOCIALS,
  settings: {},
  loading: false,
});

const SOCIAL_KEY_MAP = {
  'social.facebook': 'Facebook',
  'social.instagram': 'Instagram',
  'social.twitter': 'Twitter',
  'social.linkedin': 'Linkedin',
  'social.youtube': 'Youtube',
};

const SETTING_MAP = {
  'contact.email': 'email',
  'contact.phone': 'phone',
  'contact.phone_projects': 'phoneProjects',
  'contact.address': 'address',
  'company.name': 'name',
  'company.slogan': 'slogan',
  'company.founder': 'founder',
  'company.founded': 'founded',
};

function mergeCompany(defaults, settingsMap) {
  const merged = { ...defaults };
  Object.entries(SETTING_MAP).forEach(([key, field]) => {
    const value = settingsMap[key];
    if (value === undefined || value === null || value === '') return;
    merged[field] = field === 'founded' ? Number(value) || defaults.founded : value;
  });
  return merged;
}

function mergeSocials(defaults, settingsMap) {
  const fromSettings = Object.entries(SOCIAL_KEY_MAP)
    .map(([key, name]) => {
      const href = settingsMap[key];
      return href ? { name, href } : null;
    })
    .filter(Boolean);

  return fromSettings.length ? fromSettings : defaults;
}

async function fetchSettingsMap() {
  if (!supabase) return {};
  const { data, error } = await supabase.from('site_settings').select('key, value');
  if (error || !data?.length) return {};
  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    let mounted = true;
    fetchSettingsMap()
      .then((map) => {
        if (mounted) setSettings(map);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const company = useMemo(() => mergeCompany(DEFAULT_COMPANY, settings), [settings]);
  const socials = useMemo(() => mergeSocials(DEFAULT_SOCIALS, settings), [settings]);
  const value = useMemo(() => ({ company, socials, settings, loading }), [company, socials, settings, loading]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function useCompany() {
  return useContext(SiteSettingsContext).company;
}

export function useSocials() {
  return useContext(SiteSettingsContext).socials;
}

export { fetchSettingsMap, mergeCompany };
