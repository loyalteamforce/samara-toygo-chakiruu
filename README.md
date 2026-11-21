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

### Video davetiye (WhatsApp durumu için)
Panelde sağda **"Видео-приглашение"** kartında link çıkar → telefonda aç → **"Скачать видео"**. Aynı animasyon gerçek zamanlı kaydedilir ve **MP4 (9:16, 720×1280, ~20 sn)** olarak iner; "Поделиться" düğmesi varsa doğrudan WhatsApp'a gönderilir.
- Tema, isimler, tarih, mekân, müzik davetiyeyle aynı veriden gelir.
- En iyi sonuç güncel **Chrome / Android**. Eski tarayıcı WebM üretirse uyarı gösterir.
- Müzik için mp3 dosyası `music/` klasöründe olmalı (ya da CORS'a izin veren bir link).

### Video stilleri
Panelde **"Стиль видео"**:
- **Жибек (önerilen):** krem/zümrüt/bordo/lacivert **ipek kumaş** zemin, altın Kırgız oyma çerçeve, medalyon deseni, altın gradyanlı yazılar. Sahneler: başlık → büyük isim/yaş → dua (toy türüne göre hazır metin) → davet metni → tarih → mekân → kapanış.
- **Klasik:** davetiyenin teması (12 tema) ile aynı görünüm.

Alanlar: `vstyle` (`silk`/`classic`), `vpalette` (`cream`/`emerald`/`burgundy`/`navy`), `age` (jübile için büyük yaş rakamı), `poem` (isteğe bağlı: kendi dua metni), `type` (toy türü — dua ve etiketi belirler).
- Yaş rakamı sadece `type: yubiley` ve `age` doluysa çıkar; diğer türlerde isimler büyük altın el yazısıyla görünür.
- **Fotoğraf sahneleri:** `photos` listesindeki 1. fotoğraf mekân sahnesinin üstünde, 2. fotoğraf kapanış sahnesinin altında görünür (örnekteki çadır/sofra fotoğrafları gibi). Boşsa madalyon çıkar.
- `cover` (arka plan fotoğrafı) doluysa ipek yerine o fotoğraf, üstüne yarı saydam renk katmanıyla kullanılır.
- Süre ~38 sn. Uzun metinler otomatik küçülür.

### Kendi fotoğrafını arka plan yapma (`cover`)
Panelde **"Фото для фона"** kutusuna fotoğrafın yolunu yaz (örn. `photos/cover.jpg`). Fotoğraf hem **davetiyenin açılış ekranında** hem **videonun arka planında** görünür; yazılar otomatik beyaza döner, üstüne koyu bir katman biner.
- Dikey, yüksek kaliteli fotoğraf kullan (genişlik 1080 px ve üzeri iyi).
- Dosyayı GitHub'da `photos/` klasörüne yükle. Aynı siteden gelen dosyalar sorunsuz çalışır. Başka siteden link verirsen, o site izin vermiyorsa video kaydı çalışmaz (tarayıcı güvenliği).

### Davetiyeye ek alanlar
- **`video`**: YouTube linki → davetiyede video oynatıcı.
- **`album`**: Google Fotoğraflar (ortak albüm) veya Google Drive (düzenleyici) linki → "Тойдун сүрөттөрү / Фото с торжества" düğmesi. Misafirler fotoğrafları oraya yükler. Sunucu olmadığı için fotoğraf doğrudan sitede saklanmaz.
- Davetiyenin sonunda **"Чакырууну даярдаган Самара"** kartı (WhatsApp + Instagram) otomatik çıkar. WhatsApp ve Instagram `js/config.js` içindeki değerlerden gelir.

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
