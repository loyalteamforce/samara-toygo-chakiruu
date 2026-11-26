// ============================================================
//  SAMARA — сайттын негизги жөндөөлөрү / основные настройки
//  Бул жерди гана өзгөртүңүз. Меняйте только здесь.
// ============================================================
window.SITE = {
  brand: "Toigo.kettik",
  tagline: "Той чакыруу",

  // WhatsApp номери: + жана боштуксуз / без + и пробелов
  whatsapp: "996550481989",
  instagram: "https://www.instagram.com/toigo.kettik/",


  // Сүрөт сактагыч (Supabase Storage). Бош калтырса — сүрөт жүктөө жашырылат.
  // Бул ачык (publishable) ачкыч — коопсуз, укуктары RLS менен чектелген.
  storage: {
    url: "https://mbyyuovlipbpioxtkjcp.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ieXl1b3ZsaXBicGlveHRramNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MjEzMjgsImV4cCI6MjEwNjI5NzMyOH0.3AVwWygymHYldwIhhYW-wfEm2XSxx4ChSCAazirofAg",
    bucket: "samara-photos",
    maxSide: 1600,
    musicBucket: "samara-music",   // музыка (mp3/m4a/aac)
    maxMusicMB: 15,
    maxLibMB: 25
  },

  // Төлөм (ELQR QR): заказ барагында көрсөтүлөт
  payment: { method: "ELQR", qr: "img/elqr.jpg", name: "Самара Н.", phone: "+996 550 974 008" },

  // Баалар (сом) / Цены (сом)
  prices: {
    site: 300,      // сайт-чакыруу  (чыныгы баа Supabase'те: админ → Заказлар → Баалар)
    video: 250,     // видео-чакыруу
    both: 450,      // сайт + видео
    personal: 500   // жеке дизайн (WhatsApp аркылуу макулдашылат)
  },

  // Видео дизайндар (Жибек стили). demo = data/ ичиндеги мисал, vp = палитра
  videos: [
    { id: "zhibek-yubiley",  demo: "demo-yubiley", vp: "cream",    type: "yubiley" },
    { id: "zhibek-uylonuu",  demo: "demo",         vp: "emerald",  type: "uylonuu" },
    { id: "zhibek-kyz",      demo: "demo-kyz",     vp: "burgundy", type: "kyz-uzatuu" },
    { id: "zhibek-sunnot",   demo: "demo-sunnot",  vp: "navy",     type: "sunnot" },
    { id: "zhibek-beshik",   demo: "demo-beshik",  vp: "cream",    type: "beshik" }
  ],

  // Шаблондор / Шаблоны. id = css/invite.css ичиндеги тема
  // demo = data/ ичиндеги мисал чакыруу, font = карточкадагы аттардын шрифти
  templates: [
    { id: "garden",        name: "Олива",     isNew: true, types: ["uylonuu", "nikah", "kuda", "yubiley"],        demo: "demo",     garland: "olive", font: "'Cormorant Garamond', serif", italic: true, bg: "#f6f0e3", ink: "#3e4630", accent: "#6b7f4e" },
    { id: "garden-blush",  name: "Назик гүл", isNew: true, types: ["kyz-uzatuu", "uylonuu", "tuulgan-kun", "beshik"], demo: "demo-kyz", garland: "blush", font: "'Cormorant Garamond', serif", italic: true, bg: "#fbf1ee", ink: "#4b3a3c", accent: "#b4727d" },
    { id: "garden-blue",   name: "Эвкалипт",  isNew: true, types: ["uylonuu", "nikah", "sunnot", "kuda"],         demo: "demo",     garland: "blue",  font: "'Cormorant Garamond', serif", italic: true, bg: "#f1f4f3", ink: "#2f3f44", accent: "#5d7f88" },
    { id: "zhibek",          name: "Жибек",          isNew: true, types: ["yubiley", "uylonuu", "kyz-uzatuu", "nikah"],  demo: "demo-yubiley", font: "'Cormorant Garamond', serif", italic: true, bg: "#f1e6cd", ink: "#3b2a15", accent: "#b8862b" },
    { id: "zhibek-emerald",  name: "Жибек · Изумруд", isNew: true, types: ["uylonuu", "nikah", "yubiley"],                demo: "demo",         font: "'Cormorant Garamond', serif", italic: true, bg: "#0d4a3c", ink: "#f7edd2", accent: "#e0b866" },
    { id: "zhibek-burgundy", name: "Жибек · Бордо",   isNew: true, types: ["kyz-uzatuu", "uylonuu", "yubiley"],           demo: "demo-kyz",     font: "'Cormorant Garamond', serif", italic: true, bg: "#6d1a2a", ink: "#f9ead3", accent: "#e8c273" },
    { id: "zhibek-navy",     name: "Жибек · Көк",     isNew: true, types: ["sunnot", "tuulgan-kun", "uylonuu", "yubiley"], demo: "demo-sunnot",  font: "'Cormorant Garamond', serif", italic: true, bg: "#1a3163", ink: "#f4eddb", accent: "#e7c77d" },
    { id: "ak-kuu",  name: "Ак куу",  isNew: false, types: ["uylonuu", "nikah", "kuda"],          demo: "demo",        font: "'Cormorant Garamond', serif", italic: true, bg: "#fbf7f0", ink: "#3b2f24", accent: "#b8945a" },
    { id: "altyn",   name: "Алтын",   isNew: true,  types: ["uylonuu", "nikah", "yubiley"],       demo: "demo",        font: "'Forum', serif", upper: true, small: true, bg: "#0e0c0a", ink: "#f1e6cf", accent: "#d6b06a" },
    { id: "gul",     name: "Гүл",     isNew: true,  types: ["uylonuu", "kyz-uzatuu", "kuda"],     demo: "demo",        font: "'Bad Script', cursive",        bg: "#fff7f3", ink: "#4d2f2c", accent: "#d0806f" },
    { id: "ayim",    name: "Айым",    isNew: true,  types: ["nikah", "uylonuu", "kyz-uzatuu"],    demo: "demo",        font: "'Cormorant Garamond', serif", italic: true, bg: "#0d1630", ink: "#eef0fa", accent: "#e7c77d" },
    { id: "boz-uy",  name: "Боз үй",  isNew: true,  types: ["uylonuu", "kyz-uzatuu", "sunnot", "yubiley"], demo: "demo", font: "'Philosopher', sans-serif", upper: true, bg: "#f4ead9", ink: "#3a2418", accent: "#b5502f" },
    { id: "shyrdak", name: "Шырдак",  isNew: false, types: ["uylonuu", "kyz-uzatuu", "kuda"],     demo: "demo",        font: "'Philosopher', sans-serif",    bg: "#f6efe6", ink: "#2b1a14", accent: "#a3262a" },
    { id: "bordo",   name: "Бордо",   isNew: false, types: ["uylonuu", "nikah", "yubiley"],       demo: "demo",        font: "'Prata', serif", small: true,  bg: "#2a0f14", ink: "#f3e6d8", accent: "#d4a86a" },
    { id: "zumurut", name: "Зумурут", isNew: false, types: ["uylonuu", "yubiley"],                demo: "demo",        font: "'EB Garamond', serif", italic: true, bg: "#0f2a24", ink: "#eef3ea", accent: "#cfae6b" },
    { id: "minimal", name: "Минимал", isNew: true,  types: ["uylonuu", "nikah", "tuulgan-kun", "yubiley"], demo: "demo", font: "'Oswald', sans-serif", upper: true, bg: "#ffffff", ink: "#111111", accent: "#111111" },
    { id: "asman",   name: "Асман",   isNew: false, types: ["sunnot", "tushoo", "yubiley"],       demo: "demo-sunnot", font: "'Lora', serif", italic: true,  bg: "#eef4fa", ink: "#1d3350", accent: "#3d6fa8" },
    { id: "beshik",  name: "Бешик",   isNew: false, types: ["beshik", "tushoo", "tuulgan-kun"],   demo: "demo-beshik", font: "'Bad Script', cursive",        bg: "#fdf3f1", ink: "#4a3a3a", accent: "#c97b7b" }
  ]
};
