# Samara — той чакыруу

Online düğün/той davetiyesi sitesi. Sade HTML/CSS/JS — sunucu, veritabanı yok.

- `index.html` — müşterinin vitrin sitesi (RU / KG)
- `davet.html?id=...` — misafirin açtığı davetiye sayfası

## Ayarlar (WhatsApp, Instagram, fiyatlar)

Hepsi tek dosyada: **`js/config.js`**

## Yeni davetiye nasıl yapılır (her sipariş için ~5 dk)

1. `data/demo.json` dosyasını kopyala, yeni isim ver: `data/sanjar-nurayim.json`
2. İçini doldur:
   - `lang`: `"ky"` (Kırgızca) veya `"ru"` (Rusça)
   - `theme`: `ak-kuu`, `shyrdak`, `bordo`, `zumurut`, `asman`, `beshik`
   - `names`: `["Санжар", "Нурайым"]` (tek kişi için tek isim)
   - `date`: `"2026-12-19T17:00:00+06:00"` → saat Bişkek saatiyle aynen yazılır
   - `venue.map`: 2GIS'ten "Paylaş" linki
   - `rsvpWhatsapp`: misafir cevaplarının gideceği numara (çiftin numarası)
   - `music`: mp3 linki (ya da `music/` klasörüne koyup `"music/sarki.mp3"`)
   - `photos`: `["photos/1.jpg", "photos/2.jpg"]` (boş bırakılabilir)
   - `program`, `dresscode`, `dressColors`, `rsvpUntil` boş bırakılırsa o bölüm gizlenir
3. GitHub'a yükle. Link hazır:
   `https://SITE-ADRESI/davet.html?id=sanjar-nurayim`

### Misafire özel link
Sonuna `&g=` + isim ekle → davetiye "Урматтуу Асан байке!" diye açılır:
`davet.html?id=sanjar-nurayim&g=Асан байке`

### Misafir cevapları
"Келем / Келе албайм" formu doldurulunca cevap hazır mesaj olarak `rsvpWhatsapp` numarasına WhatsApp'tan gider.

## Yerelde deneme

```bash
python3 -m http.server 8000
```
Sonra tarayıcıda `http://localhost:8000` aç.
