// ============================================================
//  SAMARA — сайттын негизги жөндөөлөрү / основные настройки
//  Бул жерди гана өзгөртүңүз. Меняйте только здесь.
// ============================================================
window.SITE = {
  brand: "Samara",
  tagline: "Той чакыруу",

  // WhatsApp номери: + жана боштуксуз / без + и пробелов
  whatsapp: "996550481989",
  instagram: "https://www.instagram.com/priglasitelny.samara/",

  // Баалар (сом) / Цены (сом)
  prices: {
    site: 300,      // сайт-чакыруу / сайт-приглашение
    personal: 500   // жеке дизайн / индивидуальный дизайн
  },

  // Шаблондор / Шаблоны. id = css/invite.css ичиндеги тема
  templates: [
    { id: "ak-kuu",  name: "Ак куу",   types: ["uylonuu", "nikah", "kuda"],  bg: "#fbf7f0", ink: "#3b2f24", accent: "#b8945a" },
    { id: "shyrdak", name: "Шырдак",   types: ["uylonuu", "kyz-uzatuu", "kuda"], bg: "#f6efe6", ink: "#2b1a14", accent: "#a3262a" },
    { id: "bordo",   name: "Бордо",    types: ["uylonuu", "nikah", "yubiley"], bg: "#2a0f14", ink: "#f3e6d8", accent: "#d4a86a" },
    { id: "zumurut", name: "Зумурут",  types: ["uylonuu", "yubiley"],        bg: "#0f2a24", ink: "#eef3ea", accent: "#cfae6b" },
    { id: "asman",   name: "Асман",    types: ["sunnot", "tushoo", "yubiley"], bg: "#eef4fa", ink: "#1d3350", accent: "#3d6fa8" },
    { id: "beshik",  name: "Бешик",    types: ["beshik", "tushoo", "tuulgan-kun"], bg: "#fdf3f1", ink: "#4a3a3a", accent: "#c97b7b" }
  ]
};
