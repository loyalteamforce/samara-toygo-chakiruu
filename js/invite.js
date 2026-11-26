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
      back: "Артка", orderBtn: "Заказ", age: "жаш",
      video: "Видео", album: "Тойдун сүрөттөрү", albumText: "Тойдо тарткан сүрөттөрүңүздү бул жерге жүктөңүз", albumBtn: "Сүрөттөрдү жүктөө",
      madeBy: "Чакырууну даярдаган", madeName: "Toigo.kettik", madeText: "Той, кыз узатуу, үйлөнүү үлпөтү жана башка өзгөчө күндөрүңүзгө кооз, заманбап электрондук чакырууларды жасап беребиз!",
      calendar: "Той күнү",
      addCal: "Күнтизбеге кошуу",
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
      rsvpOpen: "WhatsApp ачылган жок болсо, ушул жерди басыңыз", msgYes: "Келем", msgNo: "Келе албайм",
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
      back: "Назад", orderBtn: "Заказать", age: "лет",
      video: "Видео", album: "Фото с торжества", albumText: "Загрузите сюда фотографии, снятые на тое", albumBtn: "Загрузить фото",
      madeBy: "Приглашение подготовила", madeName: "Toigo.kettik", madeText: "Создаём красивые современные электронные приглашения на той, кыз узатуу, свадьбу и другие торжества!",
      calendar: "Дата торжества",
      addCal: "Добавить в календарь",
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
      rsvpOpen: "Если WhatsApp не открылся, нажмите здесь", msgYes: "Приду", msgNo: "Не смогу",
      msgCount: "Количество", msgWish: "Пожелание",
      notFound: "Приглашение не найдено.",
      weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      monthsNom: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
      wd: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
    }
  };

  function loadFonts(theme) { if (window.loadThemeFonts) window.loadThemeFonts(theme); }

  var qs = new URLSearchParams(location.search);
  var app = document.getElementById("app");
  var O = window.ORNAMENT || {};

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  // Шилтемелер: http(s) же салыштырмалуу жол гана (javascript: ж.б. жок)
  function safeUrl(u) {
    u = String(u || "").trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^https?:/i.test(u)) return "";
    return u;
  }
  function agencyCard(t) {
    var S = window.SITE;
    if (!S || !S.whatsapp) return '<footer class="made">Toigo.kettik · той чакыруу</footer>';
    return '<section class="agency reveal"><p class="ag-k">' + t.madeBy + "</p><h3>" + t.madeName + "</h3><p>" + t.madeText + "</p>" +
      '<a class="btn btn-solid" href="https://wa.me/' + esc(S.whatsapp) + '" target="_blank" rel="noopener">WhatsApp</a>' +
      (S.instagram ? '<a class="btn" href="' + esc(S.instagram) + '" target="_blank" rel="noopener">' + esc(igName(S.instagram)) + "</a>" : "") + "</section>";
  }
  function ytId(u) {
    var m = String(u || "").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : "";
  }
  function igName(u) { var m = String(u || "").match(/instagram\.com\/([^/?#]+)/i); return m ? "@" + m[1] : "Instagram"; }
  function icsEsc(x) { return String(x || "").replace(/[\\;,]/g, function (c) { return "\\" + c; }).replace(/\n/g, "\\n"); }

  var id = (qs.get("id") || "demo").replace(/[^a-z0-9_-]/gi, "");

  var dParam = qs.get("d"), iParam = qs.get("i"), orderStatus = null;
  var loading = iParam && window.Orders
    ? window.Orders.get(iParam).then(function (r) { if (!r || !r.data) throw new Error("not found"); orderStatus = r.status; return r.data; })
    : dParam
      ? window.CODEC.decode(dParam)
      : fetch("data/" + id + ".json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });

  Promise.all([loading, (window.Scenes && window.Scenes.ready) || Promise.resolve()])
    .then(function (r) { return render(r[0]); })
    .catch(function () {
      app.innerHTML = '<p class="loading">' + L.ky.notFound + "<br>" + L.ru.notFound + "</p>";
    });

  // «Жибек» темасынын конверти: алтын оюм, мөөр жана пуштактар (SVG менен чийилген)
  var ZORN = '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
    '<g transform="translate(10 10) scale(.5) translate(-4 -4)"><path d="M4 96 V30 C4 14 14 4 30 4 H96 M14 86 V36 C14 22 22 14 36 14 H86 M30 30 C30 46 46 52 54 44 C62 36 54 24 44 28 C38 30 40 38 45 37"/></g>' +
    '<g transform="translate(290 10) scale(-.5 .5) translate(-4 -4)"><path d="M4 96 V30 C4 14 14 4 30 4 H96 M14 86 V36 C14 22 22 14 36 14 H86 M30 30 C30 46 46 52 54 44 C62 36 54 24 44 28 C38 30 40 38 45 37"/></g>' +
    '<g transform="translate(10 190) scale(.5 -.5) translate(-4 -4)"><path d="M4 96 V30 C4 14 14 4 30 4 H96 M14 86 V36 C14 22 22 14 36 14 H86 M30 30 C30 46 46 52 54 44 C62 36 54 24 44 28 C38 30 40 38 45 37"/></g>' +
    '<g transform="translate(290 190) scale(-.5 -.5) translate(-4 -4)"><path d="M4 96 V30 C4 14 14 4 30 4 H96 M14 86 V36 C14 22 22 14 36 14 H86 M30 30 C30 46 46 52 54 44 C62 36 54 24 44 28 C38 30 40 38 45 37"/></g>' +
    '<g transform="translate(150 150) scale(.7) translate(-120 -30)"><path d="M120 30 C120 16 108 8 98 12 C88 16 90 30 100 28 C106 27 106 20 101 20 M120 30 C120 16 132 8 142 12 C152 16 150 30 140 28 C134 27 134 20 139 20"/></g>' +
    '<path d="M70 176 H120 M180 176 H230" opacity=".7"/></g>';
  var ZFLAP = '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M24 10 L276 10 L150 112 Z" stroke-width="1" opacity=".6"/>' +
    '<g transform="translate(150 40) scale(.5) translate(-120 -30)" stroke-width="2.6"><path d="M120 30 C120 16 108 8 98 12 C88 16 90 30 100 28 C106 27 106 20 101 20 M120 30 C120 16 132 8 142 12 C152 16 150 30 140 28 C134 27 134 20 139 20"/></g></g>';
  var ZTASSEL = '<g stroke-linecap="round" fill="none">' +
    '<path d="M40 2 C38 22 30 28 30 42" stroke="currentColor" stroke-width="2.4"/><path d="M80 2 C82 22 90 28 90 42" stroke="currentColor" stroke-width="2.4"/></g>' +
    '<g fill="currentColor"><rect x="24" y="40" width="12" height="14" rx="5"/><rect x="84" y="40" width="12" height="14" rx="5"/></g>' +
    '<g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M26 56 L24 96 M30 56 L29 98 M34 56 L34 98 M38 56 L39 96"/><path d="M86 56 L84 96 M90 56 L89 98 M94 56 L94 98 M98 56 L99 96"/></g>';
  function zEnvelope(t, guest, initials, heading) {
    var th = window.Scenes && window.Scenes.themes[document.body.getAttribute("data-theme")], E = (th && th.env) || {};
    var cls = "envelope zenv" + (E.frame === "none" ? " ef-none" : E.frame === "simple" ? " ef-simple" : "") + (E.tassels === false ? " nt" : "") + " es-" + (E.sealShape || "round") + (E.paperImg ? " has-pimg" : "") + (E.bgImg ? " has-bgimg" : "");
    var style = (E.bgImg ? ' style="--bgimg:url(&quot;' + esc(E.bgImg) + '&quot;)"' : "");
    var pimg = E.paperImg ? "background-image:url(&quot;" + esc(E.paperImg) + "&quot;)" : "";
    var sealIn = E.sealImg ? '<img src="' + esc(E.sealImg) + '" alt="">' : "<span>" + esc(E.sealText != null && E.sealText !== "" ? E.sealText : initials) + "</span>";
    var orn = (E.frame === "full" || !E.frame) ? '<svg class="zenv-orn" viewBox="0 0 300 200" aria-hidden="true">' + ZORN + "</svg>" : "";
    var flapOrn = E.frame === "none" ? "" : ZFLAP;
    return '<div class="' + cls + '" id="envelope" role="button" tabindex="0" aria-label="' + t.open + '"' + style + ">" +
      '<div class="zenv-stage">' +
        '<div class="zenv-card"' + (pimg ? ' style="' + pimg + '"' : "") + ">" + orn + "</div>" +
        '<div class="zenv-lining"></div>' +
        '<div class="zenv-flap"><div class="zf-front">' + (pimg ? '<div class="zf-img" style="' + pimg + '"></div>' : "") + '<svg viewBox="0 0 300 132" preserveAspectRatio="none" aria-hidden="true"><path class="zf-fill" d="M2 2 L298 2 L150 128 Z"/><path class="zf-edge" d="M2 2 L298 2 L150 128 Z" fill="none"/>' + flapOrn + '</svg></div><div class="zf-back"></div></div>' +
        '<svg class="zenv-tassels" viewBox="0 0 120 100" aria-hidden="true">' + ZTASSEL + "</svg>" +
        '<div class="zenv-seal">' + sealIn + "</div>" +
      "</div>" +
      '<div class="zenv-text"><p class="zenv-head">' + esc(heading) + "</p>" + (guest ? '<p class="zenv-guest">' + esc(guest) + "</p>" : "") + "</div>" +
      '<p class="env-hint">' + esc(E.hint || t.open) + "</p></div>";
  }

  function layStyle(L) {
    L = L || {}; function num(v, def, lo, hi) { v = +v; return isFinite(v) && v >= lo && v <= hi ? v : def; }
    var n = num(L.n, 100, 40, 160), dd = num(L.d, 100, 30, 160), y = num(L.y, 0, -50, 50), z = num(L.z, 100, 100, 300), fx = num(L.fx, 50, 0, 100), fy = num(L.fy, 50, 0, 100), dim = num(L.dim, 100, 0, 150);
    if (n === 100 && dd === 100 && y === 0 && z === 100 && fx === 50 && fy === 50 && dim === 100) return "";
    return ' style="--lay-n:' + n / 100 + ";--lay-d:" + dd / 100 + ";--lay-y:" + y + ";--czoom:" + z / 100 + ";--cpos:" + fx + "% " + fy + "%;--cdim:" + dim / 100 + '"';
  }

  function render(d) {
    var lang = (qs.get("lang") || d.lang) === "ru" ? "ru" : "ky";
    var t = L[lang];
    document.documentElement.lang = lang;

    var theme = (qs.get("t") || d.theme || "ak-kuu").replace(/[^a-z0-9-]/gi, "");
    if (d.cs && window.Scenes && /^[a-z0-9-]+$/i.test(String(d.cs.base || ""))) { try { window.Scenes.register({ id: "ct-inline", name: "x", config: d.cs }); if (window.Scenes.has("ct-inline") && window.Scenes.themes["ct-inline"]._base === d.cs.base) { window.Scenes.flush(); theme = "ct-inline"; } } catch (e) {} }
    document.body.setAttribute("data-theme", theme);
    loadFonts(theme);
    var isSilk = /^zhibek/.test(theme);
    var isGarden = /^garden/.test(theme) && !!window.Botanic;
    var isScn = !!(window.Scenes && window.Scenes.has(theme));
    if (isScn) document.body.setAttribute("data-scn", window.Scenes.dark(theme) ? "dark" : "light"); else document.body.removeAttribute("data-scn");
    var gpal = theme === "garden-blush" ? "blush" : theme === "garden-blue" ? "blue" : "olive";
    function garland(h, seed, flip) { return '<div class="garland' + (flip ? " bot" : "") + '">' + window.Botanic.garland(390, h, gpal, seed, flip) + "</div>"; }
    if (isScn && window.Silk && !isSilk) {
      try {
        var bgc = window.Scenes.themes[theme].bg, mixc = window.SilkFx ? window.SilkFx.mix : null;
        if (mixc) document.body.style.setProperty("--silk", 'url("' + window.Silk.make({ mid: bgc, hi: mixc(bgc, "#ffffff", 0.55), lo: mixc(bgc, "#000000", 0.28), ink: "#000", soft: "#000", wash: "rgba(0,0,0,0)", dark: false }, 360, 640).toDataURL("image/jpeg", 0.82) + '")');
      } catch (e) {}
    }
    if (isSilk && window.Silk) {
      var palName = theme.replace(/^zhibek-?/, "") || "cream";
      try { document.body.style.setProperty("--silk", 'url("' + window.Silk.make(window.Silk.PAL[palName] || window.Silk.PAL.cream, 360, 640).toDataURL("image/jpeg", 0.82) + '")'); } catch (e) {}
    }

    var names = (Array.isArray(d.names) ? d.names : []).map(String).filter(Boolean);
    var title = names.join(" & ");
    var initials = names.map(function (n) { return n.charAt(0); }).join("&");
    document.title = (d.heading || "") + " · " + title;

    // Күн/саат JSONдо кандай жазылса, ошондой көрсөтүлөт (Кыргызстан убактысы).
    var date = new Date(d.date); // эсептөө үчүн гана (обратный отсчёт)
    var m = String(d.date).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m || !names.length) { app.innerHTML = '<p class="loading">' + L.ky.notFound + "<br>" + L.ru.notFound + "</p>"; return; }
    var year = +m[1], mon = +m[2] - 1, day = +m[3];
    var timeStr = m[4] + ":" + m[5];
    var local = new Date(Date.UTC(year, mon, day)); // жуманын күнү / календарь үчүн
    local.getDay = local.getUTCDay;

    var guest = (qs.get("g") || "").trim().slice(0, 60);
    var greet = guest ? t.dear + " " + esc(guest) + "!" : t.dearGuests;

    var preview = qs.get("preview") === "1";
    var html = "";

    // ---------- Конверт ----------
    if (!preview && (isSilk || isGarden || isScn)) {
      html += zEnvelope(t, guest, initials, d.heading);
    } else if (!preview) {
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
      '<section class="hero' + (safeUrl(d.cover) ? " has-cover" : "") + '"' + layStyle(d.lay) + '>' + (safeUrl(d.cover) ? '<div class="hero-photo"></div>' : "") +
        (isScn && !safeUrl(d.cover) ? '<div class="scene-art">' + window.Scenes.hero(theme) + "</div>" : "") +
        (isGarden ? '<div class="garland top">' + window.Botanic.garland(390, 150, gpal, 7, false) + "</div>" : "") +
        '<span class="corner tl">' + O.corner + '</span><span class="corner tr">' + O.corner + "</span>" +
        '<div class="hero-body">' +
        '<p class="eyebrow reveal">' + esc(d.heading) + "</p>" +
        (/^\d{1,3}$/.test(String(d.age || "").trim()) ? '<div class="hero-age reveal"><b>' + String(d.age).trim() + "</b><span>" + t.age + "</span></div>" : "") +
        '<h1 class="names reveal" style="--nl:' + Math.max(8, Math.max.apply(null, names.map(function (n) { return n.length; }).concat([0]))) + '">' + names.map(esc).join('<span class="amp">&amp;</span>') + "</h1>" +
        '<div class="ornament reveal">' + O.divider + "</div>" +
        '<div class="hero-date reveal">' +
          '<span class="hd-side">' + t.wd[local.getDay()] + "</span>" +
          '<span class="hd-day">' + day + "</span>" +
          '<span class="hd-side">' + (lang === "ru" ? L.ru.months[mon] : L.ky.months[mon]) + "</span>" +
        "</div>" +
        '<p class="hero-sub reveal">' + year + " · " + t.at + " " + timeStr + "</p>" +
        (d.city ? '<p class="hero-city reveal">' + esc(d.city) + "</p>" : "") +
        '</div>' +
        '<span class="corner bl">' + O.corner + '</span><span class="corner br">' + O.corner + "</span>" +
        (isGarden ? '<div class="garland bot">' + window.Botanic.garland(390, 150, gpal, 19, true) + "</div>" : "") +
      "</section>";

    // ---------- Чакыруу тексти ----------
    html +=
      '<section class="block text-block reveal">' + (isGarden ? garland(120, 41, false) : "") +
        '<h2 class="greet">' + greet + "</h2>" +
        '<p class="body-text">' + esc(d.text).replace(/\n/g, "<br>") + "</p>" +
        (d.hosts ? '<p class="hosts">' + t.respect + "<br><strong>" + esc(d.hosts) + "</strong></p>" : "") +
      "</section>";

    // ---------- Календарь ----------
    html += '<section class="block reveal"><h2>' + t.calendar + "</h2>" + calendar(year, mon, day, lang, t) +
      '<p class="cal-caption">' + t.wd[local.getDay()] + ", " + day + " " + L[lang].months[mon] + " " + year + " · " + timeStr + "</p>" +
      '<button type="button" class="btn cal-add" id="addCal">' + t.addCal + "</button></section>";

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
          (safeUrl(d.venue.map) ? '<a class="btn" href="' + esc(safeUrl(d.venue.map)) + '" target="_blank" rel="noopener">' + t.openMap + "</a>" : "") +
        "</section>";
    }

    // ---------- Сүрөттөр ----------
    var photos = (Array.isArray(d.photos) ? d.photos : []).map(safeUrl).filter(Boolean);
    if (photos.length) {
      html += '<section class="block reveal"><h2>' + t.gallery + '</h2><div class="gallery">' +
        photos.map(function (src) { return '<img loading="lazy" src="' + esc(src) + '" alt="">'; }).join("") +
        "</div></section>";
    }

    // ---------- YouTube видео ----------
    var yt = ytId(d.video);
    if (yt) {
      html += '<section class="block reveal"><h2>' + t.video + '</h2><div class="video-wrap"><iframe src="https://www.youtube-nocookie.com/embed/' + yt +
        '?rel=0" title="' + t.video + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></section>';
    }

    // ---------- Дресс-код ----------
    if (d.dresscode) {
      html += '<section class="block reveal"><h2>' + t.dress + '</h2><p class="body-text">' + esc(d.dresscode) + "</p>" +
        (Array.isArray(d.dressColors) && d.dressColors.length ? '<div class="swatches">' + d.dressColors.filter(function (c) { return /^#[0-9a-f]{3,8}$/i.test(c); }).map(function (c) {
          return '<span style="background:' + c + '"></span>';
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
      ((d.album && /^https?:\/\//i.test(d.album)) ? '<section class="block album reveal"><h2>' + t.album + '</h2><p class="body-text">' + t.albumText +
        '</p><a class="btn btn-solid" href="' + esc(d.album) + '" target="_blank" rel="noopener">📷 ' + t.albumBtn + "</a></section>" : "") +
      '<section class="finale reveal">' +
        '<div class="ornament">' + O.divider + "</div>" +
        '<p class="monogram">' + esc(initials) + "</p>" +
        "<h2>" + t.waitYou + "</h2>" +
        (d.hosts ? '<p class="hosts">' + t.respect + "<br>" + esc(d.hosts) + "</p>" : "") +
      "</section>" +
      agencyCard(t) +
      "</article>";

    // ---------- Музыка ----------
    if (safeUrl(d.music)) {
      html += '<button class="music-btn" id="musicBtn" aria-label="' + t.music + '" aria-pressed="false">♪</button>' +
        '<audio id="audio" src="' + esc(safeUrl(d.music)) + '" loop preload="none"></audio>';
    }

    // Сайттан «Көрүү» басканда: артка кайтуу жана заказ берүү тилкеси
    if (qs.get("from") === "site") {
      var wa = window.SITE && window.SITE.whatsapp;
      var tname = (qs.get("n") || "").slice(0, 40);
      var msg = lang === "ru" ? "Здравствуйте! Хочу заказать приглашение с шаблоном «" + tname + "»." : "Саламатсызбы! «" + tname + "» шаблону менен чакыруу заказ кылгым келет.";
      html += '<div class="sitebar"><button type="button" id="sbBack">← ' + t.back + "</button>" +
        (wa ? '<a href="https://wa.me/' + esc(wa) + "?text=" + encodeURIComponent(msg) + '" target="_blank" rel="noopener">' + t.orderBtn + "</a>" : "") + "</div>";
      document.body.classList.add("has-sitebar");
    }
    if (orderStatus && orderStatus !== "paid") html += '<div class="wm" aria-hidden="true"></div>';
    app.innerHTML = html;
    var sb = document.getElementById("sbBack");
    if (sb) sb.addEventListener("click", function () {
      var same = document.referrer && document.referrer.indexOf(location.host) > -1;
      if (same && history.length > 1) history.back(); else location.href = "index.html#templates";
    });
    if (!preview) document.body.classList.add("locked");

    var coverUrl = safeUrl(d.cover), heroEl = document.querySelector(".hero.has-cover");
    if (coverUrl && heroEl) heroEl.style.setProperty("--cover", 'url("' + new URL(coverUrl, location.href).href.replace(/["\\\n]/g, encodeURIComponent) + '")');

    setupEnvelope();
    setupCountdown(date, t);
    setupRsvp(d, t, title);
    setupMusic();
    setupCal(date, d, title);
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
    var busy = false;
    function open() {
      if (busy) return; busy = true;
      playMusic();
      var seal = env.querySelector(".zenv-seal"), stage = env.querySelector(".zenv-stage"), delay = 0;
      if (seal && stage && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
        // мөөр сынат: сыныктар жана учкундар
        env.classList.add("crack"); delay = 520;
        var sh = "";
        for (var i = 0; i < 12; i++) {
          var a = (i / 12) * 6.283 + Math.random() * 0.5, d = 50 + Math.random() * 90, sp = 4 + Math.random() * 7, gold = i % 3 === 0;
          sh += '<i class="zshard' + (gold ? " g" : "") + '" style="--dx:' + Math.round(Math.cos(a) * d) + "px;--dy:" + Math.round(Math.sin(a) * d + 24) + "px;--r:" + Math.round(Math.random() * 540 - 270) + "deg;width:" + sp.toFixed(1) + "px;height:" + sp.toFixed(1) + 'px"></i>';
        }
        var box = document.createElement("div"); box.className = "zshards"; box.innerHTML = sh; stage.appendChild(box);
      }
      var Sc = window.Scenes, base = (Sc && Sc.themes[document.body.getAttribute("data-theme")] && Sc.themes[document.body.getAttribute("data-theme")].env && Sc.themes[document.body.getAttribute("data-theme")].env.lining) || getComputedStyle(document.body).getPropertyValue("--env2").trim() || "#115243";
      if (!/^#[0-9a-f]{6}$/i.test(base)) {
        var th = Sc && Sc.themes[document.body.getAttribute("data-theme")];
        base = th && window.SilkFx ? window.SilkFx.mix(th.bg, th.accent, th.dark ? 0.25 : 0.35) : "#115243";
      }
      setTimeout(function () {
        env.classList.add("opened");
        var noSweep = (Sc && Sc.themes[document.body.getAttribute("data-theme")] && Sc.themes[document.body.getAttribute("data-theme")].env && Sc.themes[document.body.getAttribute("data-theme")].env.sweep === false);
        if (window.SilkFx && !noSweep && !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
          setTimeout(function () { window.SilkFx.sweep(base, function () { document.body.classList.remove("locked"); env.remove(); }); }, 1100);
        } else {
          document.body.classList.remove("locked");
          setTimeout(function () { env.remove(); }, 1500);
        }
      }, delay);
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

  function waNum(v) { var d = String(v || "").replace(/\D/g, ""); if (d.length === 9) d = "996" + d; else if (d.length === 10 && d.charAt(0) === "0") d = "996" + d.slice(1); return d; }

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
        title,
        "👤 " + name,
        yes ? t.msgYes : t.msgNo
      ];
      if (yes) lines.push("👥 " + t.msgCount + ": " + form.count.value);
      var wish = form.wish.value.trim();
      if (wish) lines.push("💐 " + t.msgWish + ": " + wish);
      var url = "https://wa.me/" + waNum(d.rsvpWhatsapp) + "?text=" + encodeURIComponent(lines.join("\n"));
      var a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
      var note = document.getElementById("rsvpNote");
      if (!note) { note = document.createElement("p"); note.id = "rsvpNote"; note.className = "body-text"; form.appendChild(note); }
      note.innerHTML = '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(t.rsvpOpen || "WhatsApp") + "</a>";
    });
  }

  function setupCal(date, d, title) {
    var b = document.getElementById("addCal");
    if (!b || isNaN(date)) return;
    b.addEventListener("click", function () {
      function f(x) { return x.getUTCFullYear() + pad(x.getUTCMonth() + 1) + pad(x.getUTCDate()) + "T" + pad(x.getUTCHours()) + pad(x.getUTCMinutes()) + "00Z"; }
      var venue = d.venue ? (d.venue.name || "") + (d.venue.address ? ", " + d.venue.address : "") : "";
      var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Samara//KG", "BEGIN:VEVENT",
        "UID:" + date.getTime() + "@samara", "DTSTAMP:" + f(new Date()), "DTSTART:" + f(date), "DTEND:" + f(new Date(date.getTime() + 4 * 3600000)),
        "SUMMARY:" + icsEsc((d.heading || "Той") + " — " + title), "LOCATION:" + icsEsc(venue), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = "toy.ics"; document.body.appendChild(a); a.click(); a.remove();
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
