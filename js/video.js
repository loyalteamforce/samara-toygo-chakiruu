// ============================================================
//  Видео чакыруу — 9:16 канвас-анимация (WhatsApp статусу үчүн).
//  Маалымат чакыруу менен бирдей: ?d=... же ?id=demo
//  Тема, түстөр жана шрифттер css/invite.css'тен алынат.
//  "Видеону жүктөп алуу" — ошол эле анимацияны MediaRecorder менен жазат.
// ============================================================
(function () {
  "use strict";
  var qs = new URLSearchParams(location.search);
  var $ = function (id) { return document.getElementById(id); };
  var W = 720, H = 1280;
  var cv = $("cv"), ctx = cv.getContext("2d");
  var preview = qs.get("preview") === "1";
  if (preview) document.body.classList.add("vprev");

  var UI = {
    ky: {
      replay: "Кайра көрүү", rec: "Видеону жүктөп алуу", save: "Видеону сактоо", share: "Бөлүшүү",
      hint: "Видеону жүктөп алып, WhatsApp статусуна же топторго салыңыз.",
      recording: "Видео жазылып жатат… экранды жаппаңыз ({s} сек).",
      saved: "Даяр! «Видеону сактоо» баскычын басыңыз.",
      webm: " Файл WebM форматында — WhatsApp кабыл албаса, Chrome'дун жаңы версиясында ачыңыз.",
      noRec: "Бул браузер видеону жазууну колдобойт. Chrome браузеринде ачыңыз.",
      unpaid: "Заказ төлөнө элек: видео жүктөлбөйт. Төлөгөндөн кийин даяр болот.", back: "Артка", wait: "Сиздерди күтөбүз!", venue: "Той өтүүчү жер", respect: "Урматтоо менен,", brand: "Самара · Той чакыруу",
      at: "саат", notFound: "Чакыруу табылган жок.",
      wd: ["жекшемби", "дүйшөмбү", "шейшемби", "шаршемби", "бейшемби", "жума", "ишемби"],
      mon: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
    },
    ru: {
      replay: "Смотреть снова", rec: "Скачать видео", save: "Сохранить видео", share: "Поделиться",
      hint: "Скачайте видео и отправьте его в статус WhatsApp или в группы.",
      recording: "Идёт запись видео… не закрывайте экран ({s} сек).",
      saved: "Готово! Нажмите «Сохранить видео».",
      webm: " Файл в формате WebM — если WhatsApp не принимает, откройте приглашение в новой версии Chrome.",
      noRec: "Этот браузер не умеет записывать видео. Откройте в Chrome.",
      unpaid: "Заказ ещё не оплачен: видео скачать нельзя. После оплаты оно станет доступно.", back: "Назад", wait: "Ждём вас!", venue: "Место проведения", respect: "С уважением,", brand: "Самара · Той чакыруу",
      at: "в", notFound: "Приглашение не найдено.",
      wd: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
      mon: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"]
    }
  };

  var id = (qs.get("id") || "demo").replace(/[^a-z0-9_-]/gi, "");
  var dParam = qs.get("d"), iParam = qs.get("i"), orderStatus = null;
  var loading = iParam && window.Orders
    ? window.Orders.get(iParam).then(function (r) { if (!r || !r.data) throw new Error("not found"); orderStatus = r.status; return r.data; })
    : dParam
      ? window.CODEC.decode(dParam)
      : fetch("data/" + id + ".json", { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  Promise.all([loading, (window.Scenes && window.Scenes.ready) || Promise.resolve()]).then(function (r) { return init(r[0]); }).catch(function () { document.body.innerHTML = '<p style="padding:40px;text-align:center;color:#9fb7aa">' + UI.ky.notFound + "<br>" + UI.ru.notFound + "</p>"; });

  function safeUrl(u) {
    u = String(u || "").trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) && !/^https?:/i.test(u)) return "";
    return u;
  }

  function init(d) {
    var lang = (qs.get("lang") || d.lang) === "ru" ? "ru" : "ky";
    var U = UI[lang];
    document.documentElement.lang = lang;
    var theme = (qs.get("t") || d.theme || "ak-kuu").replace(/[^a-z0-9-]/gi, "");
    if (d.cs && window.Scenes && /^[a-z0-9-]+$/i.test(String(d.cs.base || ""))) { try { window.Scenes.register({ id: "ct-inline", name: "x", config: d.cs }); if (window.Scenes.has("ct-inline") && window.Scenes.themes["ct-inline"]._base === d.cs.base) { window.Scenes.flush(); theme = "ct-inline"; } } catch (e) {} }
    document.body.setAttribute("data-theme", theme);
    var unpaid = !!(orderStatus && orderStatus !== "paid");
    var vstyle = qs.get("vs") || d.vstyle || "classic";
    var silkMode = vstyle === "silk" && !!window.VideoSilk;
    var vpal = qs.get("vp") || d.vpalette || "cream";
    var fontsReady = silkMode ? window.VideoSilk.loadFonts() : (window.loadThemeFonts ? window.loadThemeFonts(theme) : Promise.resolve());

    var names = (Array.isArray(d.names) ? d.names : []).map(String).filter(Boolean);
    var m = String(d.date).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m || !names.length) { document.body.innerHTML = '<p style="padding:40px;text-align:center;color:#9fb7aa">' + U.notFound + "</p>"; return; }
    var year = +m[1], mon = +m[2] - 1, day = +m[3], timeStr = m[4] + ":" + m[5];
    var weekday = new Date(Date.UTC(year, mon, day)).getUTCDay();

    var cs = getComputedStyle(document.body);
    function v(n) { return cs.getPropertyValue(n).trim(); }
    var T = {
      bg: v("--bg"), bg2: v("--bg2"), ink: v("--ink"), muted: v("--muted"), accent: v("--accent"),
      fn: v("--f-names"), fh: v("--f-head"), fb: v("--f-body"), ns: v("--names-style") || "normal", k: parseFloat(v("--names-k")) || 1
    };
    // Өз сүрөтүңүз фон болсо: тексттер ак түскө өтөт
    var coverUrl = safeUrl(d.cover), coverImg = null;
    if (coverUrl) { T.ink = "#ffffff"; T.muted = "rgba(255,255,255,.82)"; T.accent = "#f1dba6"; }
    function loadImg(url) {
      return new Promise(function (res) {
        if (!url) return res(null);
        var cross = false;
        try { cross = /^https?:/i.test(url) && new URL(url, location.href).origin !== location.origin; } catch (e) {}
        function go(useCors) {
          var im = new Image();
          if (useCors) im.crossOrigin = "anonymous";
          im.onload = function () { res(im); };
          im.onerror = function () { if (useCors) go(false); else res(null); };
          im.src = url;
        }
        go(cross);
        setTimeout(function () { res(null); }, 8000);
      });
    }
    var sceneBg = false;
    var coverReady = (!coverUrl && window.Scenes && window.Scenes.has(theme) && !silkMode)
      ? window.Scenes.image(theme, 540, 810).then(function (im) { if (im) { coverImg = im; sceneBg = true; } })
      : loadImg(coverUrl).then(function (im) { coverImg = im; });
    var UP = !!(window.THEME_UPPER && window.THEME_UPPER[theme]);
    function nm(s) { return UP ? s.toUpperCase() : s; }

    // ---------- Шрифтерди күтүү ----------
    var fontsDone = fontsReady.then(function () {
      var loads = [];
      (silkMode ? window.VideoSilk.families : [T.fn, T.fh, T.fb]).forEach(function (f) {
        ["400 40px ", "italic 400 40px ", "500 40px "].forEach(function (p) { try { loads.push(document.fonts.load(p + f, "АаӨөҮүҢңAa")); } catch (e) {} });
      });
      return Promise.all(loads);
    });
    var silkReady = Promise.resolve();

    // ---------- Сызуу жардамчылары ----------
    function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    function eo(x) { x = clamp(x); return 1 - Math.pow(1 - x, 3); }
    function rev(t, s, dur) { return eo((t - s) / dur); }
    function font(style, weight, size, fam) { ctx.font = style + " " + weight + " " + Math.round(size) + "px " + fam; }
    function spacing(px) { if ("letterSpacing" in ctx) ctx.letterSpacing = px + "px"; }
    function txt(s, x, y, color, alpha) { ctx.globalAlpha = clamp(alpha); ctx.fillStyle = color; ctx.fillText(s, x, y); }
    function wrap(s, maxW) {
      var words = String(s).split(" "), lines = [], cur = "";
      words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur);
      return lines;
    }
    function fitSize(s, style, weight, fam, size, maxW, minSize) {
      font(style, weight, size, fam);
      while (size > minSize && ctx.measureText(s).width > maxW) { size -= 2; font(style, weight, size, fam); }
      return size;
    }

    function sun(cx, cy, R, rot, alpha, lw) {
      ctx.save(); ctx.globalAlpha = clamp(alpha); ctx.strokeStyle = T.accent; ctx.lineCap = "round"; ctx.translate(cx, cy);
      ctx.save(); ctx.rotate(rot); ctx.lineWidth = lw; ctx.beginPath();
      var n = 32, i, a, L;
      for (i = 0; i < n; i++) { a = i / n * 2 * Math.PI; L = (i % 2 ? 0.8 : 0.95) * R; ctx.moveTo(Math.cos(a) * R * 0.68, Math.sin(a) * R * 0.68); ctx.lineTo(Math.cos(a) * L, Math.sin(a) * L); }
      ctx.stroke(); ctx.restore();
      ctx.lineWidth = lw * 0.7; ctx.beginPath(); ctx.arc(0, 0, R * 0.62, 0, 2 * Math.PI); ctx.stroke();
      var r = R * 0.54, k = r * 0.42, k2 = r * 0.24;
      ctx.lineWidth = lw * 1.8; ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * Math.PI); ctx.clip();
      ctx.lineWidth = lw * 1.4; ctx.beginPath();
      [-k, -k2, k2, k].forEach(function (x) { ctx.moveTo(x, -r); ctx.quadraticCurveTo(x * 1.7, 0, x, r); ctx.moveTo(-r, x); ctx.quadraticCurveTo(0, x * 1.7, r, x); });
      ctx.stroke(); ctx.restore();
    }

    var HORN_L = new Path2D("M120 30 C120 16 108 8 98 12 C88 16 90 30 100 28 C106 27 106 20 101 20");
    var HORN_R = new Path2D("M120 30 C120 16 132 8 142 12 C152 16 150 30 140 28 C134 27 134 20 139 20");
    function divider(cx, cy, w, p, alpha) {
      var s = w / 240;
      ctx.save(); ctx.globalAlpha = clamp(alpha); ctx.strokeStyle = T.accent; ctx.fillStyle = T.accent; ctx.lineCap = "round";
      ctx.translate(cx - 120 * s, cy - 22 * s); ctx.scale(s, s); ctx.lineWidth = 2.2;
      ctx.stroke(HORN_L); ctx.stroke(HORN_R);
      var e = 66 * clamp(p);
      ctx.beginPath(); ctx.moveTo(86, 22); ctx.lineTo(86 - e, 22); ctx.moveTo(154, 22); ctx.lineTo(154 + e, 22); ctx.stroke();
      if (p > 0.95) { ctx.beginPath(); ctx.arc(14, 22, 2.6, 0, 7); ctx.arc(226, 22, 2.6, 0, 7); ctx.fill(); }
      ctx.restore();
    }

    var CORNER = new Path2D("M4 96 V30 C4 14 14 4 30 4 H96 M14 86 V36 C14 22 22 14 36 14 H86 M30 30 C30 46 46 52 54 44 C62 36 54 24 44 28 C38 30 40 38 45 37");
    function corners() {
      ctx.strokeStyle = T.accent; ctx.globalAlpha = 0.7; ctx.lineWidth = 1.5;
      [[44, 44, 1, 1], [W - 44, 44, -1, 1], [44, H - 44, 1, -1], [W - 44, H - 44, -1, -1]].forEach(function (c) {
        ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(c[2] * 1.15, c[3] * 1.15); ctx.translate(-4, -4); ctx.stroke(CORNER); ctx.restore();
      });
    }

    function drawCover(t, wash) {
      var iw = coverImg.naturalWidth, ih = coverImg.naturalHeight;
      var z = 1.04 + 0.07 * Math.min(1, t / DUR);                     // жай жакындоо (Ken Burns)
      var sc = Math.max(W / iw, H / ih) * z, dw = iw * sc, dh = ih * sc;
      ctx.globalAlpha = 1; ctx.drawImage(coverImg, (W - dw) / 2, (H - dh) / 2 - 14 * Math.min(1, t / DUR), dw, dh);
      if (wash) { ctx.fillStyle = wash; ctx.fillRect(0, 0, W, H); return; }
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(0,0,0,.55)"); g.addColorStop(0.4, "rgba(0,0,0,.34)"); g.addColorStop(1, "rgba(0,0,0,.68)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    function background(t) {
      if (coverImg) {
        drawCover(t, sceneBg ? "rgba(0,0,0,0)" : undefined);
        ctx.strokeStyle = T.accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.6; ctx.strokeRect(24, 24, W - 48, H - 48);
        ctx.lineWidth = 1; ctx.globalAlpha = 0.3; ctx.strokeRect(34, 34, W - 68, H - 68);
        corners(); return;
      }
      var g = ctx.createRadialGradient(W * 0.5, H * 0.28, 40, W * 0.5, H * 0.42, H * 0.85);
      g.addColorStop(0, T.bg2); g.addColorStop(1, T.bg);
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      sun(W / 2, H * 0.52, 560, t * 0.03, 0.07, 3);
      ctx.strokeStyle = T.accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.55; ctx.strokeRect(24, 24, W - 48, H - 48);
      ctx.lineWidth = 1; ctx.globalAlpha = 0.28; ctx.strokeRect(34, 34, W - 68, H - 68);
      corners();
      ctx.fillStyle = T.accent;
      for (var i = 0; i < 26; i++) {
        var x = (i * 97 + 40) % W, y = H - ((t * (14 + i % 5 * 5) + i * 53) % H), r = 1.4 + (i % 3);
        ctx.globalAlpha = 0.18 + 0.22 * (0.5 + 0.5 * Math.sin(t * 2 + i));
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
    }

    // ---------- Сахналар ----------
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var heading = (d.heading || "").toUpperCase();

    function scene1(a, t) {
      sun(W / 2, H * 0.27, 96, t * 0.25, a * rev(t, 0.2, 1), 2.6);
      font("normal", 500, 30, T.fb); spacing(7);
      var lines = wrap(heading, 560), y0 = H * 0.43;
      lines.forEach(function (l, i) { var p = rev(t, 0.8 + i * 0.15, 0.9); txt(l, W / 2, y0 + i * 46 + (1 - p) * 18, T.accent, a * p); });
      var y = y0 + lines.length * 46 + 30;
      divider(W / 2, y + 28, 380, rev(t, 1.6, 1.1), a * rev(t, 1.4, 0.6));
      if (d.city) { font("normal", 500, 28, T.fb); spacing(12); txt(String(d.city).toUpperCase(), W / 2, y + 108, T.ink, a * rev(t, 2.2, 0.8)); }
      spacing(0);
    }

    function scene2(a, t) {
      font("normal", 500, 26, T.fb); spacing(8);
      var hl = wrap(heading, 560);
      hl.forEach(function (l, i) { txt(l, W / 2, H * 0.22 + i * 38, T.accent, a * rev(t, 0.2, 0.8)); });
      spacing(0);
      var base = 150 * T.k, n = names.length, sizes = [], i;
      for (i = 0; i < n; i++) sizes.push(fitSize(nm(names[i]), T.ns, 400, T.fn, base, W - 130, 34));
      var sz = Math.min.apply(null, sizes), step = sz * 1.12;
      var total = n === 1 ? 0 : (n - 1) * step * 2;
      var y = H * 0.5 - total / 2;
      for (i = 0; i < n; i++) {
        var p = rev(t, 0.5 + i * 0.7, 1.0), yy = y + i * step * 2 + (1 - p) * 40;
        font(T.ns, 400, sz, T.fn); ctx.save(); ctx.translate(W / 2, yy); var sc = 0.94 + 0.06 * p; ctx.scale(sc, sc);
        ctx.globalAlpha = clamp(a * p); ctx.fillStyle = T.ink; ctx.fillText(nm(names[i]), 0, 0); ctx.restore();
        if (i < n - 1) { font("normal", 400, sz * 0.5, T.fn); txt("&", W / 2, yy + step, T.accent, a * rev(t, 0.9 + i * 0.7, 0.8)); }
      }
      divider(W / 2, H * 0.5 + total / 2 + sz * 0.95, 360, rev(t, 2.6, 1.1), a * rev(t, 2.4, 0.6));
    }

    function scene3(a, t) {
      font("normal", 500, 32, T.fb); spacing(10);
      txt(U.wd[weekday].toUpperCase(), W / 2, H * 0.31, T.ink, a * rev(t, 0.2, 0.8));
      spacing(0);
      var p = rev(t, 0.5, 1.1), sz = 330 * (T.fh.indexOf("Pacifico") > -1 ? 0.8 : 1);
      ctx.save(); ctx.translate(W / 2, H * 0.47); var sc = 1.12 - 0.12 * p; ctx.scale(sc, sc);
      font("normal", 500, sz, T.fh); ctx.globalAlpha = clamp(a * p); ctx.fillStyle = T.accent; ctx.fillText(String(day), 0, 0); ctx.restore();
      font("normal", 500, 54, T.fb); spacing(14);
      txt(U.mon[mon].toUpperCase(), W / 2, H * 0.63, T.ink, a * rev(t, 1.0, 0.8));
      divider(W / 2, H * 0.69, 300, rev(t, 1.4, 1), a * rev(t, 1.2, 0.6));
      font("normal", 500, 34, T.fb); spacing(6);
      txt(year + "  ·  " + U.at + " " + timeStr, W / 2, H * 0.75, T.muted, a * rev(t, 1.6, 0.8));
      spacing(0);
    }

    function scene4(a, t) {
      var vn = d.venue || {};
      font("normal", 500, 26, T.fb); spacing(8);
      txt(U.venue.toUpperCase(), W / 2, H * 0.33, T.accent, a * rev(t, 0.2, 0.8));
      spacing(0);
      // белги
      ctx.save(); ctx.globalAlpha = clamp(a * rev(t, 0.1, 0.8)); ctx.fillStyle = T.accent; ctx.translate(W / 2, H * 0.25);
      ctx.beginPath(); ctx.arc(0, -8, 22, Math.PI * 0.85, Math.PI * 0.15, false); ctx.lineTo(0, 34); ctx.closePath();
      ctx.moveTo(8, -8); ctx.arc(0, -8, 8, 0, Math.PI * 2, true); ctx.fill("evenodd"); ctx.restore();
      var y = H * 0.44;
      if (vn.name) {
        font(T.ns, 400, 66 * T.k, T.fn);
        var nl = wrap(nm(vn.name), 580), lh = 78 * T.k + 10;
        nl.forEach(function (l, i) { var p = rev(t, 0.6 + i * 0.15, 0.9); txt(l, W / 2, y + i * lh + (1 - p) * 20, T.ink, a * p); });
        y += nl.length * lh + 20;
      }
      divider(W / 2, y + 10, 300, rev(t, 1.2, 1), a * rev(t, 1.0, 0.6));
      if (vn.address) {
        font("normal", 400, 32, T.fb);
        wrap(vn.address, 560).forEach(function (l, i) { txt(l, W / 2, y + 70 + i * 46, T.muted, a * rev(t, 1.5 + i * 0.1, 0.8)); });
      }
    }

    var initials = names.map(function (n) { return n.charAt(0); }).join("&");
    function scene5(a, t) {
      sun(W / 2, H * 0.2, 80, t * 0.25, a * rev(t, 0, 0.8), 2.4);
      var s1 = fitSize(nm(U.wait), T.ns, 400, T.fn, 100 * T.k, W - 120, 36);
      var lines = wrap(nm(U.wait), W - 120), lh = s1 * 1.1;
      lines.forEach(function (l, i) { var p = rev(t, 0.3 + i * 0.2, 0.9); txt(l, W / 2, H * 0.4 + i * lh + (1 - p) * 24, T.ink, a * p); });
      var y = H * 0.4 + lines.length * lh;
      divider(W / 2, y + 20, 340, rev(t, 1.0, 1), a * rev(t, 0.8, 0.6));
      if (d.hosts) {
        font("normal", 400, 28, T.fb); spacing(3); txt(U.respect, W / 2, y + 96, T.muted, a * rev(t, 1.3, 0.8)); spacing(0);
        var hs = fitSize(nm(String(d.hosts)), T.ns, 400, T.fn, 58 * T.k, W - 120, 26);
        txt(nm(String(d.hosts)), W / 2, y + 160, T.accent, a * rev(t, 1.5, 0.8));
      }
      font(T.ns, 400, 120 * T.k, T.fn); txt(nm(initials), W / 2, H * 0.78, T.accent, a * 0.85 * rev(t, 1.8, 0.8));
      font("normal", 500, 20, T.fb); spacing(8); txt(U.brand.toUpperCase(), W / 2, H * 0.92, T.muted, a * 0.8 * rev(t, 2.2, 0.8)); spacing(0);
    }

    var scenes, bgFn = background, fgFn = null;
    if (silkMode) {
      var SK = window.VideoSilk.create({
        ctx: ctx, W: W, H: H, d: d, lang: lang, U: U, names: names, year: year, mon: mon, day: day, timeStr: timeStr, weekday: weekday,
        palette: vpal, type: d.type || "uylonuu",
        clamp: clamp, eo: eo, rev: rev, font: font, spacing: spacing, wrap: wrap, fitSize: fitSize, loadImg: loadImg, safeUrl: safeUrl,
        cover: function () { return coverImg; }, drawCover: drawCover
      });
      scenes = SK.scenes; bgFn = SK.background; fgFn = SK.foreground; silkReady = SK.ready;
    } else {
      scenes = [{ f: scene1, d: 4.4 }, { f: scene2, d: 5.6 }, { f: scene3, d: 4.4 }];
      if (d.venue && (d.venue.name || d.venue.address)) scenes.push({ f: scene4, d: 4.4 });
      scenes.push({ f: scene5, d: 4.2, last: true });
    }
    var acc = 0;
    scenes.forEach(function (s) { s.s = acc; s.e = acc + s.d; acc = s.e - 0.6; });
    var DUR = scenes[scenes.length - 1].e;
    Promise.race([Promise.all([fontsDone, coverReady, silkReady]), new Promise(function (r) { setTimeout(r, 10000); })]).then(ready);

    function draw(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      bgFn(t);
      scenes.forEach(function (s) {
        var a = clamp((t - s.s) / 0.6) * (s.last ? 1 : clamp((s.e - t) / 0.6));
        if (a > 0.001) { ctx.save(); s.f(a, t - s.s); ctx.restore(); }
      });
      if (fgFn) { ctx.save(); fgFn(t); ctx.restore(); }
      ctx.globalAlpha = 1;
      if (unpaid) watermark();
    }
    function watermark() {
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.5);
      ctx.font = "700 40px Arial, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.fillStyle = "rgba(0,0,0,.3)"; spacing(0);
      for (var yy = -H, row = 0; yy < H; yy += 190, row++) for (var xx = -W + (row % 2 ? 190 : 0); xx < W; xx += 440) { ctx.strokeText("ПРЕДПРОСМОТР · НЕ ОПЛАЧЕНО", xx, yy); ctx.fillText("ПРЕДПРОСМОТР · НЕ ОПЛАЧЕНО", xx, yy); }
      ctx.restore();
    }

    // ---------- Ойнотуу ----------
    var music = safeUrl(d.music), audio = null;
    if (music && !preview) {
      var crossAudio = false;
      try { crossAudio = /^https?:/i.test(music) && new URL(music, location.href).origin !== location.origin; } catch (e) {}
      var makeAudio = function (useCors) {
        var a = new Audio(); a.preload = "auto";
        if (useCors) a.crossOrigin = "anonymous";
        a.addEventListener("error", function () { if (useCors && audio === a) { audio = makeAudio(false); } });
        a.src = music; return a;
      };
      audio = makeAudio(crossAudio);
    }
    var playing = false, t0 = 0, loop = preview, rec = null, chunks = [], blob = null, ext = "mp4", recording = false;

    function frame(now) {
      if (!playing) return;
      var t = (now - t0) / 1000;
      if (t >= DUR) { if (loop) { t0 = now; t = 0; } else { t = DUR; playing = false; draw(t); $("prog").style.width = "100%"; finished(); return; } }
      if (audio) audio.volume = clamp((DUR - t) / 1.2);
      draw(t);
      $("prog").style.width = (t / DUR * 100) + "%";
      if (recording) $("hint").textContent = U.recording.replace("{s}", Math.max(0, Math.ceil(DUR - t)));
      requestAnimationFrame(frame);
    }
    function play() {
      $("bigPlay").hidden = true; playing = true; t0 = performance.now();
      if (audio) { try { audio.currentTime = 0; audio.volume = 1; var pr = audio.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
      requestAnimationFrame(frame);
    }
    function finished() {
      if (audio) { try { audio.pause(); } catch (e) {} }
      if (rec && rec.state === "recording") setTimeout(function () { try { rec.stop(); } catch (e) {} }, 400);
      else setBusy(false);
    }

    function pickMime() {
      var c = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
      for (var i = 0; i < c.length; i++) { try { if (MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch (e) {} }
      return "";
    }
    function setBusy(b) { recording = b; $("btnRec").disabled = b; $("btnReplay").disabled = b; }

    function startRecording() {
      if (!window.MediaRecorder || !cv.captureStream) { $("hint").textContent = U.noRec; return; }
      var stream;
      try { stream = cv.captureStream(30); } catch (e) { $("hint").textContent = U.noRec; return; }
      if (audio) { try { var as = (audio.captureStream || audio.mozCaptureStream).call(audio); as.getAudioTracks().forEach(function (tr) { stream.addTrack(tr); }); } catch (e) {} }
      var mime = pickMime(), opts = { videoBitsPerSecond: 4000000 };
      if (mime) opts.mimeType = mime;
      try { rec = new MediaRecorder(stream, opts); } catch (e) { $("hint").textContent = U.noRec; return; }
      chunks = [];
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        var type = rec.mimeType || mime || "video/webm";
        ext = type.indexOf("mp4") > -1 ? "mp4" : "webm";
        blob = new Blob(chunks, { type: type.split(";")[0] });
        setBusy(false); rec = null;
        $("btnRec").textContent = U.save; $("btnRec").setAttribute("data-mode", "save");
        $("hint").textContent = U.saved + (ext === "webm" ? U.webm : "");
        try {
          var f = new File([blob], "toy-chakyruu." + ext, { type: blob.type });
          if (navigator.canShare && navigator.canShare({ files: [f] })) { $("btnShare").hidden = false; $("btnShare").onclick = function () { navigator.share({ files: [f] }).catch(function () {}); }; }
        } catch (e) {}
      };
      setBusy(true); rec.start(250); play();
    }
    function saveFile() {
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "toy-chakyruu." + ext;
      document.body.appendChild(a); a.click(); a.remove();
    }

    // ---------- Баскычтар ----------
    $("btnReplay").textContent = U.replay;
    $("btnRec").textContent = U.rec;
    $("btnShare").textContent = U.share;
    $("hint").textContent = U.hint;
    if (unpaid) { $("btnRec").disabled = true; $("btnRec").style.display = "none"; $("hint").textContent = U.unpaid; }
    $("bigPlay").addEventListener("click", play);
    $("btnReplay").addEventListener("click", function () { if (!playing) play(); });
    $("btnRec").addEventListener("click", function () { if ($("btnRec").getAttribute("data-mode") === "save" && blob) saveFile(); else if (!playing) startRecording(); });

    if (qs.get("from") === "site") {
      var b = $("vback"); b.hidden = false; b.textContent = "← " + U.back;
      b.addEventListener("click", function () {
        if (document.referrer && document.referrer.indexOf(location.host) > -1 && history.length > 1) history.back(); else location.href = "index.html#video";
      });
    }

    function ready() {
      if (preview) { play(); return; }
      draw(Math.min(DUR - 1, 6.2)); // постер: аттары көрүнгөн кадр
    }
    window.__video = { draw: draw, duration: function () { return DUR; }, ready: Promise.all([fontsDone, silkReady]) }; // сыноо үчүн
  }
})();
