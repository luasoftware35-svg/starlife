import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { listRows, upsertRow } from '@/lib/supabase/admin';

const CONTACT_FIELDS = [
  { key: 'contact.email', label: 'E-posta', group: 'contact' },
  { key: 'contact.phone', label: 'Sabit Hat', group: 'contact' },
  { key: 'contact.phone_projects', label: 'Özel Projeler Telefonu', group: 'contact' },
  { key: 'contact.address', label: 'Adres', group: 'contact' },
  { key: 'company.name', label: 'Şirket Adı', group: 'general' },
  { key: 'company.slogan', label: 'Slogan', group: 'general' },
];

const SOCIAL_FIELDS = [
  { key: 'social.facebook', label: 'Facebook URL', group: 'social' },
  { key: 'social.instagram', label: 'Instagram URL', group: 'social' },
  { key: 'social.twitter', label: 'X (Twitter) URL', group: 'social' },
  { key: 'social.linkedin', label: 'LinkedIn URL', group: 'social' },
  { key: 'social.youtube', label: 'YouTube URL', group: 'social' },
];

function SettingsGroup({ title, description, fields, values, onChange, onSave }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
      <div className="mt-5 space-y-4">
        {fields.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-2 block text-sm text-zinc-300">{field.label}</span>
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={(event) => onChange(field.key, event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-gold/50"
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={onSave}
        className="mt-5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-gold-light"
      >
        Kaydet
      </button>
    </section>
  );
}

export default function AdminSiteSettingsPanel() {
  const [values, setValues] = useState({});
  const [rowsByKey, setRowsByKey] = useState({});

  const load = useCallback(async () => {
    const rows = await listRows('site_settings', { orderBy: 'key', ascending: true, limit: 500 });
    const map = Object.fromEntries(rows.map((row) => [row.key, row]));
    const nextValues = {};
    [...CONTACT_FIELDS, ...SOCIAL_FIELDS].forEach((field) => {
      nextValues[field.key] = map[field.key]?.value || '';
    });
    setRowsByKey(map);
    setValues(nextValues);
  }, []);

  useEffect(() => {
    load().catch((error) => toast.error(error.message));
  }, [load]);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const saveFields = async (fields) => {
    try {
      await Promise.all(fields.map(async (field) => {
        const existing = rowsByKey[field.key];
        await upsertRow('site_settings', {
          id: existing?.id,
          key: field.key,
          value: values[field.key] || '',
          group_name: field.group,
        });
      }));
      toast.success('Ayarlar kaydedildi. Canlı site birkaç dakika içinde güncellenir.');
      await load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SettingsGroup
        title="İletişim & Kurumsal"
        description="Footer ve iletişim sayfalarında görünen bilgiler."
        fields={CONTACT_FIELDS}
        values={values}
        onChange={handleChange}
        onSave={() => saveFields(CONTACT_FIELDS)}
      />
      <SettingsGroup
        title="Sosyal Medya"
        description="Footer ve menüdeki sosyal medya linkleri."
        fields={SOCIAL_FIELDS}
        values={values}
        onChange={handleChange}
        onSave={() => saveFields(SOCIAL_FIELDS)}
      />
    </div>
  );
}
