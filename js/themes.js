// Ар бир теманын Google шрифттери (кыргыз тамгаларын колдойт) — чакыруу жана видео үчүн бирдей
(function () {
  var F = {
    "shyrdak": ["Philosopher:wght@400;700"],
    "bordo":   ["Prata"],
    "zumurut": ["EB+Garamond:ital,wght@0,400;1,400"],
    "asman":   ["Lora:ital,wght@0,400;0,500;1,400"],
    "beshik":  ["Comfortaa:wght@400;600", "Bad+Script"],
    "altyn":   ["Forum"],
    "gul":     ["Lora:ital,wght@0,400;0,500;1,400", "Bad+Script"],
    "ayim":    ["Yeseva+One"],
    "boz-uy":  ["Philosopher:wght@400;700"],
    "minimal": ["Oswald:wght@400;600"],
    "balalyk": ["Comfortaa:wght@400;600", "Pacifico"],
    "zhibek":          ["Prata"],
    "zhibek-emerald":  ["Prata"],
    "zhibek-burgundy": ["Prata"],
    "zhibek-navy":     ["Prata"],
    "garden":          ["Bad+Script"],
    "garden-blush":    ["Bad+Script"],
    "garden-blue":     ["Bad+Script"]
  };
  window.THEME_UPPER = { "altyn": 1, "boz-uy": 1, "minimal": 1 };
  window.loadThemeFonts = function (theme) {
    var f = F[theme];
    if (!f) return Promise.resolve();
    // Стиль файлы жүктөлгөндө гана шрифт «белгилүү» болот — ошону күтөбүз (канвас үчүн керек)
    return new Promise(function (res) {
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=" + f.join("&family=") + "&display=swap";
      l.onload = l.onerror = function () { res(); };
      document.head.appendChild(l);
      setTimeout(res, 4000);
    });
  };
})();
