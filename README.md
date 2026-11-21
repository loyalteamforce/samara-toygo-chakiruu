# Samara — той чакыруу

Online düğün/той davetiyesi sitesi. Sade HTML/CSS/JS — sunucu, veritabanı yok.

- `index.html` — müşterinin vitrin sitesi (RU / KG)
- `davet.html` — misafirin açtığı davetiye sayfası
- `admin.html` — davetiye oluşturucu panel (müşteri için)

## Ayarlar (WhatsApp, Instagram, fiyatlar)

Hepsi tek dosyada: **`js/config.js`**

## Yeni davetiye nasıl yapılır

### Yöntem 1 — Konstruktor paneli (önerilen, ~2 dk)

`https://SITE-ADRESI/admin.html` sayfasını aç (arama motorlarına kapalı, ana sitede linki yok).

1. Dil, той türü, isimler, tarih, mekân, program, tema seç.
2. Sağda canlı önizleme çıkar, altta **hazır link** oluşur → Kopyala / WhatsApp.
3. **Личные ссылки для гостей**: misafir isimlerini alt alta yaz → her biri için ayrı link + "WhatsApp'ta gönder" düğmesi.
4. Sonradan değişiklik: eski linki **"Изменить готовую ссылку"** kutusuna yapıştır, form dolar, düzelt, yeni link al.

Davetiye verisi linkin içinde saklanır → sunucu/veritabanı yok, dosya yüklemeye gerek yok.
Taslak tarayıcıda otomatik kaydedilir.

### Yöntem 2 — Kalıcı kısa link (JSON dosyası)

1. `data/demo.json` dosyasını kopyala → `data/sanjar-nurayim.json`
2. İçini doldur (alanlar paneldekiyle aynı; `date` biçimi `"2026-12-19T17:00:00+06:00"`)
3. GitHub'a yükle → `https://SITE-ADRESI/davet.html?id=sanjar-nurayim`

Temalar: `ak-kuu`, `altyn`, `gul`, `ayim`, `boz-uy`, `shyrdak`, `bordo`, `zumurut`, `minimal`, `asman`, `balalyk`, `beshik`.
Boş bırakılan alanların bölümü davetiyede görünmez. Müzik/foto için dosyaları `music/` ve `photos/` klasörüne koy.

### Misafire özel link
Linkin sonuna `&g=` + isim ekle → "Урматтуу Асан байке!" diye açılır. (Panel bunu otomatik yapar.)

### Misafir cevapları
"Келем / Келе албайм" formu hazır mesaj olarak `rsvpWhatsapp` numarasına WhatsApp'tan gider.

## Yerelde deneme

```bash
python3 -m http.server 8000
```
Sonra tarayıcıda `http://localhost:8000` aç.

## Fontlar hakkında not

Kırgız harflerini (Ө ө Ү ү Ң ң) gerçekten çizen fontlar kullanıldı. Yeni font eklerken mutlaka
"Өмүрбек Үмүтай Ң ң" yazıp kontrol et — Great Vibes, Unbounded, Playfair Display gibi fontlarda bu harfler YOK.
