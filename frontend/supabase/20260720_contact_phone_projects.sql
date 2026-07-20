-- Özel projeler telefon numarası
INSERT INTO site_settings (key, value, group_name)
VALUES ('contact.phone_projects', '0551 260 99 83', 'contact')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, group_name = EXCLUDED.group_name;

-- Sabit hat numarasını güncelle
INSERT INTO site_settings (key, value, group_name)
VALUES ('contact.phone', '0412 504 10 08', 'contact')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, group_name = EXCLUDED.group_name;
