# Taahhüt görselleri

Eski sitedeki `/anaresim/` ve `/icerikresmi/` klasörlerini buraya kopyalayın:

- `frontend/public/anaresim/`
- `frontend/public/icerikresmi/`

Ardından:

```bash
cd frontend
npm run migrate:taahhut-images
```

Görseller Supabase Storage'a yüklenir ve taahhüt projeleri güncellenir.

Alternatif: Admin → Taahhüt → projeyi düzenle → kapak ve galeri görsellerini yükleyin.
