// ============================================================
//  Чакыруу баракчасы. Маалымат data/<id>.json файлынан алынат.
//  URL: davet.html?id=sanjar-nurayim
//       &g=Асан байке   — коноктун аты (жеке шилтеме)
//       &t=bordo        — теманы алмаштыруу (көрсөтүү үчүн)
//       &preview=1      — конвертсиз (сайттагы көрсөтүү үчүн)
// ============================================================
(function () {
  "use strict";

  var L = {
    ky: {
      open: "Ачуу үчүн басыңыз",
      dear: "Урматтуу",
      dearGuests: "Кадырлуу коноктор!",
      calendar: "Той күнү",
      at: "саат",
      countdown: "Тойго чейин калды",
      days: "күн", hours: "саат", minutes: "мүнөт", seconds: "секунд",
      today: "Той бүгүн!", passed: "Той өтүп кетти. Келгениңиздерге рахмат!",
      program: "Кечтин программасы",
      venue: "Той өтүүчү жер",
      openMap: "Картадан ачуу",
      dress: "Дресс-код",
      gallery: "Сүрөттөр",
      rsvp: "Келесизби?",
      rsvpUntil: "Сураныч, жообуңузду {d} чейин бериңиз.",
      name: "Сиздин атыңыз",
      yes: "Келем", no: "Келе албайм",
      count: "Канча киши болосуздар?",
      person: "киши",
      wish: "Каалоо-тилек (милдеттүү эмес)",
      send: "Жооп жөнөтүү",
      needName: "Атыңызды жазыңыз",
      waitYou: "Сиздерди күтөбүз!",
      respect: "Урматтоо менен,",
      music: "Музыка",
      msgYes: "✅ Келем", msgNo: "❌ Келе албайм",
      msgCount: "Киши саны", msgWish: "Каалоо",
      notFound: "Чакыруу табылган жок.",
      weekdays: ["Дш", "Шш", "Шр", "Бш", "Жм", "Иш", "Жк"],
      months: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      wd: ["жекшемби", "дүйшөмбү", "шейшемби", "шаршемби", "бейшемби", "жума", "ишемби"]
    },
    ru: {
      open: "Нажмите, чтобы открыть",
      dear: "Уважаемый(ая)",
      dearGuests: "Дорогие гости!",
      calendar: "Дата торжества",
      at: "в",
      countdown: "До тоя осталось",
      days: "дней", hours: "часов", minutes: "минут", seconds: "секунд",
      today: "Той сегодня!", passed: "Той уже прошёл. Спасибо, что были с нами!",
      program: "Программа вечера",
      venue: "Место проведения",
      openMap: "Открыть на карте",
      dress: "Дресс-код",
      gallery: "Фотографии",
      rsvp: "Придёте?",
      rsvpUntil: "Пожалуйста, ответьте до {d}.",
      name: "Ваше имя",
      yes: "Приду", no: "Не смогу",
      count: "Сколько вас будет?",
      person: "чел.",
      wish: "Пожелание (необязательно)",
      send: "Отправить ответ",
      needName: "Впишите ваше имя",
      waitYou: "Ждём вас!",
      respect: "С уважением,",
      music: "Музыка",
      msgYes: "✅ Приду", msgNo: "❌ Не смогу",
      msgCount: "Количество", msgWish: "Пожелание",
      notFound: "Приглашение не найдено.",
      weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      monthsNom: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      wd: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
    }
  };

  // Ар бир теманын Google шрифттери (кыргыз тамгаларын колдойт)
  var THEME_FONTS = {
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
    "balalyk": ["Comfortaa:wght@400;600", "Pacifico"]
  };
  function loadFonts(theme) {
    var f = THEME_FONTS[theme];
    if (!f) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=" + f.join("&family=") + "&display=swap";
    document.head.appendChild(l);
  }

  var qs = new URLSearchParams(location.search);
  var app = document.getElementById("app");
  var O = window.ORNAMENT || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var id = (qs.get("id") || "demo").replace(/[^a-z0-9_-]/gi, "");

  fetch("data/" + id + ".json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(function () {
      app.innerHTML = '<p class="loading">' + L.ky.notFound + "<br>" + L.ru.notFound + "</p>";
    });

  function render(d) {
    var lang = (qs.get("lang") || d.lang) === "ru" ? "ru" : "ky";
    var t = L[lang];
    document.documentElement.lang = lang;

    var theme = (qs.get("t") || d.theme || "ak-kuu").replace(/[^a-z0-9-]/gi, "");
    document.body.setAttribute("data-theme", theme);
    loadFonts(theme);

    var names = d.names || [];
    var title = names.join(" & ");
    var initials = names.map(function (n) { return n.charAt(0); }).join("&");
    document.title = (d.heading || "") + " · " + title;

    // Күн/саат JSONдо кандай жазылса, ошондой көрсөтүлөт (Кыргызстан убактысы).
    var date = new Date(d.date); // эсептөө үчүн гана (обратный отсчёт)
    var m = String(d.date).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    var year = +m[1], mon = +m[2] - 1, day = +m[3];
    var timeStr = m[4] + ":" + m[5];
    var local = new Date(Date.UTC(year, mon, day)); // жуманын күнү / календарь үчүн
    local.getDay = local.getUTCDay;

    var guest = (qs.get("g") || "").trim().slice(0, 60);
    var greet = guest ? t.dear + " " + esc(guest) + "!" : t.dearGuests;

    var preview = qs.get("preview") === "1";
    var html = "";

    // ---------- Конверт ----------
    if (!preview) {
      html +=
        '<div class="envelope" id="envelope" role="button" tabindex="0" aria-label="' + t.open + '">' +
          '<div class="env-flap"></div>' +
          '<div class="env-body">' +
            '<p class="env-heading">' + esc(d.heading) + "</p>" +
            (guest ? '<p class="env-guest">' + esc(guest) + "</p>" : "") +
            '<div class="seal"><span>' + esc(initials) + "</span></div>" +
            '<p class="env-hint">' + t.open + "</p>" +
          "</div>" +
        "</div>";
    }

    // ---------- Башкы бөлүк ----------
    html +=
      '<article class="invite">' +
      '<section class="hero">' +
        '<span class="corner tl">' + O.corner + '</span><span class="corner tr">' + O.corner + "</span>" +
        '<p class="eyebrow reveal">' + esc(d.heading) + "</p>" +
        '<h1 class="names reveal" style="--nl:' + Math.max(8, Math.max.apply(null, names.map(function (n) { return n.length; }).concat([0]))) + '">' + names.map(esc).join('<span class="amp">&amp;</span>') + "</h1>" +
        '<div class="ornament reveal">' + O.divider + "</div>" +
        '<div class="hero-date reveal">' +
          '<span class="hd-side">' + t.wd[local.getDay()] + "</span>" +
          '<span class="hd-day">' + day + "</span>" +
          '<span class="hd-side">' + (lang === "ru" ? L.ru.months[mon] : L.ky.months[mon]) + "</span>" +
        "</div>" +
        '<p class="hero-sub reveal">' + year + " · " + t.at + " " + timeStr + "</p>" +
        (d.city ? '<p class="hero-city reveal">' + esc(d.city) + "</p>" : "") +
        '<span class="corner bl">' + O.corner + '</span><span class="corner br">' + O.corner + "</span>" +
      "</section>";

    // ---------- Чакыруу тексти ----------
    html +=
      '<section class="block text-block reveal">' +
        '<h2 class="greet">' + greet + "</h2>" +
        '<p class="body-text">' + esc(d.text).replace(/\n/g, "<br>") + "</p>" +
        (d.hosts ? '<p class="hosts">' + t.respect + "<br><strong>" + esc(d.hosts) + "</strong></p>" : "") +
      "</section>";

    // ---------- Календарь ----------
    html += '<section class="block reveal"><h2>' + t.calendar + "</h2>" + calendar(year, mon, day, lang, t) +
      '<p class="cal-caption">' + t.wd[local.getDay()] + ", " + day + " " + L[lang].months[mon] + " " + year + " · " + timeStr + "</p></section>";

    // ---------- Обратный отсчёт ----------
    html +=
      '<section class="block reveal"><h2>' + t.countdown + "</h2>" +
        '<div class="countdown" id="countdown">' +
          ["days", "hours", "minutes", "seconds"].map(function (k) {
            return '<div class="cd-cell"><span class="cd-num" data-k="' + k + '">0</span><span class="cd-label">' + t[k] + "</span></div>";
          }).join("") +
        "</div>" +
      "</section>";

    // ---------- Программа ----------
    if (d.program && d.program.length) {
      html += '<section class="block reveal"><h2>' + t.program + '</h2><ol class="program">' +
        d.program.map(function (p) {
          return '<li><span class="p-time">' + esc(p.time) + '</span><span class="p-dot"></span><span class="p-info"><strong>' +
            esc(p.title) + "</strong>" + (p.note ? "<small>" + esc(p.note) + "</small>" : "") + "</span></li>";
        }).join("") + "</ol></section>";
    }

    // ---------- Жер ----------
    if (d.venue) {
      html +=
        '<section class="block reveal"><h2>' + t.venue + "</h2>" +
          '<p class="venue-name">' + esc(d.venue.name) + "</p>" +
          '<p class="venue-addr">' + esc(d.venue.address) + "</p>" +
          (d.venue.map ? '<a class="btn" href="' + esc(d.venue.map) + '" target="_blank" rel="noopener">' + t.openMap + "</a>" : "") +
        "</section>";
    }

    // ---------- Сүрөттөр ----------
    if (d.photos && d.photos.length) {
      html += '<section class="block reveal"><h2>' + t.gallery + '</h2><div class="gallery">' +
        d.photos.map(function (src) { return '<img loading="lazy" src="' + esc(src) + '" alt="">'; }).join("") +
        "</div></section>";
    }

    // ---------- Дресс-код ----------
    if (d.dresscode) {
      html += '<section class="block reveal"><h2>' + t.dress + '</h2><p class="body-text">' + esc(d.dresscode) + "</p>" +
        (d.dressColors ? '<div class="swatches">' + d.dressColors.map(function (c) {
          return '<span style="background:' + esc(c) + '"></span>';
        }).join("") + "</div>" : "") + "</section>";
    }

    // ---------- RSVP ----------
    if (d.rsvpWhatsapp) {
      var opts = "";
      for (var i = 1; i <= 6; i++) opts += '<option value="' + i + '">' + i + " " + t.person + "</option>";
      html +=
        '<section class="block reveal" id="rsvp"><h2>' + t.rsvp + "</h2>" +
          (d.rsvpUntil ? '<p class="body-text">' + t.rsvpUntil.replace("{d}", esc(d.rsvpUntil)) + "</p>" : "") +
          '<form class="rsvp" id="rsvpForm" novalidate>' +
            '<label>' + t.name + '<input name="name" autocomplete="name" value="' + esc(guest) + '" required></label>' +
            '<div class="choice">' +
              '<label><input type="radio" name="come" value="yes" checked><span>' + t.yes + "</span></label>" +
              '<label><input type="radio" name="come" value="no"><span>' + t.no + "</span></label>" +
            "</div>" +
            '<label class="count-row">' + t.count + '<select name="count">' + opts + "</select></label>" +
            '<label>' + t.wish + '<textarea name="wish" rows="3"></textarea></label>' +
            '<p class="form-err" id="formErr" hidden>' + t.needName + "</p>" +
            '<button class="btn btn-solid" type="submit">' + t.send + "</button>" +
          "</form>" +
        "</section>";
    }

    // ---------- Аягы ----------
    html +=
      '<section class="finale reveal">' +
        '<div class="ornament">' + O.divider + "</div>" +
        '<p class="monogram">' + esc(initials) + "</p>" +
        "<h2>" + t.waitYou + "</h2>" +
        (d.hosts ? '<p class="hosts">' + t.respect + "<br>" + esc(d.hosts) + "</p>" : "") +
      "</section>" +
      '<footer class="made">Samara · той чакыруу</footer>' +
      "</article>";

    // ---------- Музыка ----------
    if (d.music) {
      html += '<button class="music-btn" id="musicBtn" aria-label="' + t.music + '" aria-pressed="false">♪</button>' +
        '<audio id="audio" src="' + esc(d.music) + '" loop preload="none"></audio>';
    }

    app.innerHTML = html;
    if (!preview) document.body.classList.add("locked");

    setupEnvelope();
    setupCountdown(date, t);
    setupRsvp(d, t, title);
    setupMusic();
    setupReveal();
  }

  function calendar(y, m, dd, lang, t) {
    var first = new Date(y, m, 1).getDay(); // 0=Жк
    var offset = (first + 6) % 7;
    var total = new Date(y, m + 1, 0).getDate();
    var monName = lang === "ru" ? L.ru.monthsNom[m] : L.ky.months[m];
    var h = '<div class="calendar"><p class="cal-month">' + monName + " " + y + '</p><div class="cal-grid">';
    t.weekdays.forEach(function (w) { h += '<span class="cal-wd">' + w + "</span>"; });
    for (var i = 0; i < offset; i++) h += "<span></span>";
    for (var d = 1; d <= total; d++) {
      h += d === dd ? '<span class="cal-day is-day"><b>' + d + "</b></span>" : '<span class="cal-day">' + d + "</span>";
    }
    return h + "</div></div>";
  }

  function setupEnvelope() {
    var env = document.getElementById("envelope");
    if (!env) return;
    function open() {
      env.classList.add("opened");
      document.body.classList.remove("locked");
      playMusic();
      setTimeout(function () { env.remove(); }, 1400);
    }
    env.addEventListener("click", open);
    env.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  }

  function setupCountdown(date, t) {
    var box = document.getElementById("countdown");
    if (!box) return;
    var cells = {};
    box.querySelectorAll("[data-k]").forEach(function (el) { cells[el.getAttribute("data-k")] = el; });
    function tick() {
      var diff = date - new Date();
      if (diff <= 0) {
        var sameDay = new Date().toDateString() === date.toDateString();
        box.outerHTML = '<p class="body-text cd-done">' + (sameDay ? t.today : t.passed) + "</p>";
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      cells.days.textContent = Math.floor(s / 86400);
      cells.hours.textContent = pad(Math.floor(s / 3600) % 24);
      cells.minutes.textContent = pad(Math.floor(s / 60) % 60);
      cells.seconds.textContent = pad(s % 60);
    }
    var timer = setInterval(tick, 1000);
    tick();
  }

  function setupRsvp(d, t, title) {
    var form = document.getElementById("rsvpForm");
    if (!form) return;
    var countRow = form.querySelector(".count-row");
    form.addEventListener("change", function () {
      countRow.hidden = form.come.value === "no";
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var err = document.getElementById("formErr");
      if (!name) { err.hidden = false; form.name.focus(); return; }
      err.hidden = true;
      var yes = form.come.value === "yes";
      var lines = [
        "💌 " + title,
        "👤 " + name,
        yes ? t.msgYes : t.msgNo
      ];
      if (yes) lines.push("👥 " + t.msgCount + ": " + form.count.value);
      var wish = form.wish.value.trim();
      if (wish) lines.push("💐 " + t.msgWish + ": " + wish);
      var url = "https://wa.me/" + String(d.rsvpWhatsapp).replace(/\D/g, "") + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  var audio, musicBtn;
  function setupMusic() {
    audio = document.getElementById("audio");
    musicBtn = document.getElementById("musicBtn");
    if (!audio || !musicBtn) return;
    musicBtn.addEventListener("click", function () {
      if (audio.paused) playMusic(); else { audio.pause(); musicBtn.classList.remove("on"); musicBtn.setAttribute("aria-pressed", "false"); }
    });
  }
  function playMusic() {
    if (!audio) return;
    var p = audio.play();
    if (p && p.then) p.then(function () { musicBtn.classList.add("on"); musicBtn.setAttribute("aria-pressed", "true"); }).catch(function () {});
  }

  function setupReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }
})();
