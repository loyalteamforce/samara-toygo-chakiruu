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

### Fotoğrafı galeriden seçme (Supabase Storage)
Panelde **"Выбрать из галереи / Добавить из галереи"** düğmeleri: müşteri telefonun galerisinden fotoğraf seçer, tarayıcı fotoğrafı **1600 px / ~700 KB**'a küçültür ve depoya yükler; link otomatik doldurulur. GitHub'a yükleme gerekmez.
- Ayarlar `js/config.js` → `storage` (url, anahtar, bucket, maxSide). `storage` boşaltılırsa seçici gizlenir, link yapıştırma kalır.
- Depo: Supabase projesi `mbyyuovlipbpioxtkjcp`, bucket **`samara-photos`** (herkese açık okuma). Anonim kullanıcı **sadece** `u/` klasörüne, **jpg/png/webp**, **en fazla 3 MB** dosya **ekleyebilir**; listeleyemez, değiştiremez, silemez. Diğer bucket ve tablolara dokunulmaz.
- ⚠️ Bu proje başka bir canlı uygulamayla paylaşılıyor (ücretsiz planda 2 proje sınırı). Müşteriye devrederken fotoğraflar için **ayrı bir Supabase projesi** açıp aynı bucket + kuralı oraya kurmak ve `config.js`'i güncellemek gerekir. Mevcut fotoğraf linkleri eski adreste çalışmaya devam eder.
- **Müzik:** panelde **"Выбрать музыку с телефона"** → mp3 / m4a / aac, **en fazla 8 MB**, ilerleme çubuğu ve çalar önizlemesiyle. Ayrı bucket: **`samara-music`** (aynı kurallar: sadece `u/` klasörüne ekleme, ses dosyaları, 8 MB). Tek müzik hem davetiyede (zarf açılınca) hem videoda (kayda girer) çalar.
- Telif: müşteri yalnızca hakkı olduğu müziği kullanmalı.

### "Бакча" davetiye temaları (çelenk + çiçek)
Temalar: `garden` (zeytin), `garden-blush` (pembe), `garden-blue` (okaliptüs). Yapraklı ve çiçekli çelenk **kodla çizilir** (`js/botanic.js`, her seferinde aynı sonuç), krem bulut zemin, el yazısı başlıklar, kartsız bölümler, zarf (renklere uyumlu). Hiçbir görsel dosya yok, fotoğraf kullanılmadı.

### "Жибек" davetiye temaları (ipek + altın)
Temalar: `zhibek` (krem), `zhibek-emerald`, `zhibek-burgundy`, `zhibek-navy`. İpek zemin tarayıcıda çizilir (`js/silk.js`, videoyla ortak), altın oyma çerçeve, **mühürlü ve püsküllü zarf**, altın gradyanlı isimler/tarih.
- `age` alanı doluysa (tüm temalarda) açılış ekranında büyük **yaş rakamı** çıkar (jübile için), "жаш/лет" ile.
- Videodaki "Жибек" stiliyle aynı görünümde olduğu için davetiye + video birlikte satılabilir.

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

## Sipariş sistemi (müşteriler kendi davetiyesini yapar)
Akış: **create.html** (herkese açık, ücretsiz önizleme) → "Оформить заказ" → **order.html?i=KOD** (QR ile ödeme) → yönetici **orders.html**'de "Оплачено ✓" der → müşterinin sayfasında linkler çıkar. Ödenene kadar `davet.html?i=KOD` ve `video.html?i=KOD` **filigranlı** (video indirilemez).
- Veri: Supabase projesi `mbyyuovlipbpioxtkjcp`, tablolar `samara_orders`, `samara_settings` (RLS açık, **doğrudan erişim yok**). Her şey `samara_*` fonksiyonlarıyla (SECURITY DEFINER); fiyatı **sunucu** belirler.
- **Yönetici kodu** sunucuda hash olarak durur (`samara_settings.admin_hash`), kod sitede yazmaz. `admin.html` ve `orders.html` girişi sunucuda doğrulanır. Kodu değiştirmek için: yeni kodu küçük harf ve tiresiz hâliyle SHA-256'ya çevirip `update samara_settings set value = to_jsonb('<hash>'::text) where key='admin_hash'` çalıştır.
- Fiyatlar: `orders.html` altındaki **"Цены"** kutusu (sunucudaki fiyat geçerli; `js/config.js` sadece yedek).
- Ödeme: ELQR QR (`img/elqr.jpg`), ad ve numara `js/config.js` → `payment`. Ödeme **elle** onaylanır (çek WhatsApp'a gelir, yönetici işaretler).
- Müşteri sipariş kodlarını tarayıcısında saklar (`order.html` → "Мои заказы"). Yöneticinin "Изменить" düğmesi siparişi `admin.html?order=KOD` ile açar ve kaydeder.
- ⚠️ Supabase projesi başka bir canlı uygulamayla paylaşılıyor. Devirde ayrı proje açıp aynı SQL'i orada çalıştırmak ve `config.js` → `storage`'ı güncellemek gerekir.

## Domain: samaratc.store (bağlandı)
Domain Namecheap'te. DNS: dört `A` kaydı (`@` → GitHub Pages) çalışıyor, HTTPS aktif. Site `https://samaratc.store/` adresinde. `www` için `CNAME www → loyalteamforce.github.io` kaydı da eklenmeli. Depoda `CNAME` dosyası (`samaratc.store`) **silinmemeli**. Adresleri `tools/set-domain.py` ile yeni adrese çevirdik.

## Domain bağlama ve Google (genel adımlar)

**Sıra önemli.** Domain DNS'e bağlanmadan GitHub'da özel domain yazarsan site açılmaz.

1. Domain alınır (müşterinin adına).
2. DNS kayıtları eklenir: dört `A` kaydı (`@` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) ve `www` için `CNAME` → `<github-kullanıcı>.github.io`.
3. GitHub → depo → **Settings → Pages → Custom domain** alanına domain yazılır, **Enforce HTTPS** açılır (sertifika birkaç dakika–1 saat sürebilir).
4. Depoda: `python3 tools/set-domain.py https://alanadi.kg` → og:image, canonical, JSON-LD, `sitemap.xml`, `robots.txt` yeni adrese göre güncellenir. Commit + push.
5. **Google Search Console** → "Domain" tipinde mülk ekle → DNS'e verdiği TXT kaydını ekle → doğrula → Sitemap olarak `https://alanadi.kg/sitemap.xml` gönder.
6. İsteğe bağlı: **Google İşletme Profili** (harita ve telefon aramaları için).

Gizli sayfalar (`admin.html`, `davet.html`, `video.html`) `noindex` ile Google'dan gizlidir.

## Sayfalar
- `index.html` — ana sayfa. `?type=sunnot` ile toy türüne göre filtrelenmiş açılır.
- `design.html?id=<tema>` / `design.html?k=video&id=<video>` — **şablon detay sayfası**: telefonda canlı önizleme (zarf, "mühre bas"), fiyat, özellikler, "Дагы дизайндар" şeridi, altta sabit **sipariş** butonu (WhatsApp, seçilen şablonun adıyla hazır mesaj). Şablon/video listeleri `js/config.js` (`templates`, `videos`).
- `texts.html` — toy türüne göre hazır davet metinleri, "Копировать" düğmesiyle.
- `terms.html`, `privacy.html` — Koşullar ve Gizlilik. İçerik `js/legal.js` içinde. **Taslaktır; yayından önce firma sahibi gözden geçirmeli, resmi unvan/iletişim bilgisi eklenmeli.**
- Ortak üst/alt bilgi: `js/shell.js` (alt bilgi sütunları ve linkler burada).

## Yerelde deneme

```bash
python3 -m http.server 8000
```
Sonra tarayıcıda `http://localhost:8000` aç.

## Fontlar hakkında not

Kırgız harflerini (Ө ө Ү ү Ң ң) gerçekten çizen fontlar kullanıldı. Yeni font eklerken mutlaka
"Өмүрбек Үмүтай Ң ң" yazıp kontrol et — Great Vibes, Unbounded, Playfair Display gibi fontlarda bu harfler YOK.

## «Сахна» темалары (scn-*)
`js/scenes.js` — 25 көркөм тема (көл террасасы+гүлдөр, тоолор, боз үй, жүрөк, жубайлар, гүл арка, сакура, мак/жоогазын талаасы, түнкү асман). Бардыгы SVG, сүрөт файлы жок: чакырууда, видеодо (классикалык стиль), каталогдо жана конверт сахнасында бирдей чыгат. Жаңы тема кошуу: `T` объектисине жазуу кошуңуз.

## Студия (studio.html) — өз шаблондор жана музыка
- `studio.html` (админ коду менен): 25 даяр шаблондун негизинде өз шаблон жасоо (түстөр, шрифт, конверт, той түрлөрү). Supabase `samara_templates` ичинде сакталат, сайтта дароо чыгат (`Scenes.ready`).
- Музыка китепканасы: `samara_songs`. Файл `samara-music` бакетине жүктөлөт; чакырууну жасоодо «Готовая музыка» баскычы аркылуу тандалат.
- Мөөр сынуу эффекти: чакыруунун конвертинде (`invite.js`, `.zshard`).

## Конверт (видеодогудай) жана «Свой стиль»
- Конверт: торчолуу рамка, 3D мөөр, жип менен эки чачыла, клапандын ичи — алтын торчо; ачылганда мөөр сынат, ипек (`js/silkfx.js`) өтүп чакыруу ачылат.
- «Свой стиль» (create.html / admin.html): ар бир чакыруу өз түстөрүн, шрифтин жана конверт түстөрүн өзгөртө алат (`d.cs`). Сайттын жалпы каталогуна кошулбайт, ошол чакырууга гана тиешелүү.

## Конвертти жасоочу (js/envedit.js)
Студияда жана «Свой стиль» бөлүмүндө: бумага/подкладка/мөөр/кисточка түстөрү, подкладка оюму (ромб, сызык, чекит), рамка, мөөр формасы (тегерек, тиш-тиш, ромб, жүрөк), мөөрдөгү тамга же логотип, бумагага өз сүрөтү, конверттин арткы фону, кисточкалар, ипек эффекти, конверттин астындагы жазуу. Жөндөөлөр `config.env` / `d.cs.env` ичинде; `Scenes.cleanEnv` текшерет (сүрөттөр өз Supabase сактагычынан гана).

## Стиль жасоочу (js/styleedit.js)
Студияда жана «Свой стиль» бөлүмүндө бирдей: арка фон — рисунок, бир түс/градиент же өз фото (затемнение менен); бардык түстөр кичине тегерек палитрада (фон, текст, акцент, конверт түстөрү, рисунок түстөрү); шрифт; конверт. Фото/түс чакырууда, видеодо, каталог карточкасында колдонулат (`Scenes.hero/card/image`).

## Өлчөм жана жайгашуу (d.lay)
Конструкторда «Размер и положение текста и фото»: аттардын жана датанын өлчөмү, тексттин жогору/төмөн жылышы, фото фонунун жакындашы, жылышы жана караңгылатуусу. Чакыруу (`layStyle` → CSS өзгөрмөлөр) жана видео (`video.js`) колдонот. WhatsApp номери `waNorm`/`waNum` менен 996… форматына келтирилет (0550…, 550…, +996…).

## Бренд: Toigo.kettik
Сайттын аты жана логотиби `Toigo.kettik` (logo/toigo-logo.png, фавикон, og.png). Instagram: https://www.instagram.com/toigo.kettik/ (`js/config.js` → `instagram`). Домен өзгөргөн жок (samaratc.store). Музыка: куруучуда 15 МБ, студиядагы китепканада 25 МБ чейин (бакет `samara-music` лимити 25 МБ), студияда бир нече файлды бир жолу жүктөөгө болот.

## Видео фон жана текст түстөрү
Стиль жасоочуда фон: рисунок / түс / фото / видео (mp4, mov, webm, 20 МБ чейин, бакет `samara-video`). Текст түстөрү өзүнчө: аттар, дата жана цифралар, жазуулар, текст көлөкөсү, тез баскычтар (ак, кара, алтын). Өз шаблондор кеч келсе да (`scenes:templates` окуясы) тизмелер жаңыртылат; студияда сакталбаган шаблонду (черновик) калыбына келтирүү бар.
