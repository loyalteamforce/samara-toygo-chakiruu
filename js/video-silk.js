// ============================================================
//  «Жибек» видео стили: ипек кездеме, алтын оюм-чийме, медальон.
//  js/video.js ушул модулду чакырат: VideoSilk.create(env)
//  Палитралар: cream (крем), emerald, burgundy, navy
// ============================================================
(function () {
  "use strict";

  var FAM = {
    script: '"Bad Script", cursive',
    serif: '"EB Garamond", Georgia, serif',
    cap: '"Cormorant Garamond", Georgia, serif',
    num: '"Prata", Georgia, serif'
  };
  var GOOGLE = ["Bad+Script", "EB+Garamond:ital,wght@0,400;0,600;1,400;1,600", "Prata", "Cormorant+Garamond:wght@500;600"];
  var GOLD = ["#fbeab4", "#e2b650", "#a97b1f", "#f4d581"];

  var PAL = window.Silk.PAL;

  var LABEL = {
    ky: { "uylonuu": "ҮЙЛӨНҮҮ ТОЮ", "kyz-uzatuu": "КЫЗ УЗАТУУ ТОЮ", "nikah": "НИКЕ КЫЮУ ТОЮ", "sunnot": "СҮННӨТ ТОЮ", "beshik": "БЕШИК ТОЮ", "tushoo": "ТУШОО КЕСҮҮ ТОЮ", "yubiley": "МААРАКЕЛИК ТОЙ", "tuulgan-kun": "ТУУЛГАН КҮН", "kuda": "КУДА ТҮШҮҮ" },
    ru: { "uylonuu": "СВАДЬБА", "kyz-uzatuu": "КЫЗ УЗАТУУ", "nikah": "НИКАХ", "sunnot": "СҮННӨТ ТОЙ", "beshik": "БЕШИК ТОЙ", "tushoo": "ТУШОО КЕСУУ", "yubiley": "ЮБИЛЕЙ", "tuulgan-kun": "ДЕНЬ РОЖДЕНИЯ", "kuda": "СВАТОВСТВО" }
  };
  var POEM = {
    ky: {
      "uylonuu": "Ак никеңер бекем болсун,\nүй-бүлөңөр береке-ырыска толсун,\nкөңүлүңөр дайым бир, жолуңар ачык\nболуп, бактылуу өмүр сүрө бергиле!",
      "kyz-uzatuu": "Ак жолуң ачык болсун, кызым,\nүйүң береке-ырыска толсун,\nбосогоңдо бакыт, көңүлүңдө\nжылуулук дайым жүрө берсин!",
      "nikah": "Ак никеңер бекем, ыйык болсун,\nүйүңөр бейпилдикке толсун,\nбир-бириңерге таяныч болуп,\nбактылуу өмүр сүрө бергиле!",
      "sunnot": "Балабыз ден соолукта, эр жүрөк,\nэлине таяныч, атасына тирөөч,\nчың, адептүү болуп чоңойсун,\nжолу ак, бактысы ачык болсун!",
      "beshik": "Бешигиң бекем болсун,\nбөбөгүбүз ден соолукта өссүн,\nырыс-кешиги мол, жолу ак болуп,\nэлине бакыт алып келсин!",
      "tushoo": "Алгачкы кадамың ак болсун,\nбасканың-турганың бактылуу болсун,\nден соолукта өсүп,\nэлине жакшы адам болуп чоңой!",
      "yubiley": "Өмүрүңүз узун, ден соолугуңуз\nчың болсун, бала-чакаңыздын\nбактысына кубанып, элиңиздин\nсый-урматында жүрө бериңиз!",
      "tuulgan-kun": "Туулган күнүң менен!\nДен соолугуң чың, өмүрүң узун болсун,\nбаардык тилектериң орундалсын,\nжаның бакытка толсун!",
      "kuda": "Куда-сөөк болгон эки тарап,\nмаңдайлары жарык, достугу бекем болсун,\nбалдарыбыздын бактысына\nбирге кубанып жүрөлү!"
    },
    ru: {
      "uylonuu": "Пусть ваш союз будет крепким,\nдом — полным достатка и тепла,\nа жизнь — долгой и счастливой!",
      "kyz-uzatuu": "Пусть путь твой будет светлым, дочка,\nдом — полным достатка,\nа сердце — тёплым и счастливым!",
      "nikah": "Пусть ваш никах будет крепким и светлым,\nдом наполнится миром и любовью,\nа жизнь будет долгой и счастливой!",
      "sunnot": "Пусть наш сын растёт здоровым и смелым,\nопорой семьи и гордостью народа,\nпусть путь его будет светлым!",
      "beshik": "Пусть колыбель будет крепкой,\nмалыш растёт здоровым и счастливым,\nа жизнь будет светлой и долгой!",
      "tushoo": "Пусть первые шаги будут лёгкими,\nа путь — светлым и счастливым,\nпусть малыш растёт здоровым!",
      "yubiley": "Долгих вам лет жизни,\nкрепкого здоровья и радости,\nсчастья вашим детям и внукам!",
      "tuulgan-kun": "С днём рождения!\nКрепкого здоровья, долгих лет,\nисполнения всех желаний!",
      "kuda": "Пусть сватовство принесёт радость,\nдружбу двух семей и счастье\nнашим детям!"
    }
  };
  var L = {
    ky: { dear: "Урматтуу коноктор!", age: "жаш", toyDay: "ТОЙ КҮНҮ", time: "Саат", addr: "Дарегибиз:", respect: "Урматтоо менен,", wait: "Сиздерди чын жүрөктөн күтөбүз!", text: "Сиздерди үй-бүлөңүз менен тойубузга чакырабыз. Катышууңуздар биз үчүн чоң кубаныч!" },
    ru: { dear: "Уважаемые гости!", age: "лет", toyDay: "ДАТА ТОРЖЕСТВА", time: "Начало в", addr: "Наш адрес:", respect: "С уважением,", wait: "Ждём вас от всего сердца!", text: "Приглашаем вас вместе с семьёй на наше торжество. Будем рады видеть вас!" }
  };

  var HORN_L = new Path2D("M120 30 C120 16 108 8 98 12 C88 16 90 30 100 28 C106 27 106 20 101 20");
  var HORN_R = new Path2D("M120 30 C120 16 132 8 142 12 C152 16 150 30 140 28 C134 27 134 20 139 20");
  var CORNER = new Path2D("M4 96 V30 C4 14 14 4 30 4 H96 M14 86 V36 C14 22 22 14 36 14 H86 M30 30 C30 46 46 52 54 44 C62 36 54 24 44 28 C38 30 40 38 45 37");

  var rgba = window.Silk.rgba;

  function loadFonts() {
    return new Promise(function (res) {
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=" + GOOGLE.join("&family=") + "&display=swap";
      l.onload = l.onerror = function () { res(); };
      document.head.appendChild(l);
      setTimeout(res, 4000);
    });
  }

  function create(E) {
    var ctx = E.ctx, W = E.W, H = E.H, d = E.d, lang = E.lang === "ru" ? "ru" : "ky", U = E.U;
    var P = PAL[E.palette] || PAL.cream;
    var type = LABEL[lang][E.type] ? E.type : "uylonuu";
    var T = L[lang];
    var age = parseInt(d.age, 10) || 0;
    var yub = type === "yubiley" && age > 0;
    var names = E.names;
    var photos = (Array.isArray(d.photos) ? d.photos : []).map(E.safeUrl).filter(Boolean);
    var imgs = [null, null];

    function goldGrad(x0, y0, x1, y1) {
      var g = ctx.createLinearGradient(x0, y0, x1, y1);
      GOLD.forEach(function (c, i) { g.addColorStop(i / (GOLD.length - 1), c); });
      return g;
    }
    function pad(n) { return (n < 10 ? "0" : "") + n; }

    // ---------- Ипек кездеме (бир жолу чийилет, анан жылдырылат) ----------
    var silk = window.Silk.make(P, 360, 640);

    function background(t) {
      ctx.globalAlpha = 1;
      var cv = E.cover();
      if (cv) { E.drawCover(t, P.wash); return; }
      ctx.drawImage(silk, -40 + Math.sin(t * 0.25) * 18, -40 + Math.cos(t * 0.2) * 14, W + 80, H + 80);
      var sx = ((t * 70) % (W * 2.4)) - W * 0.7, g = ctx.createLinearGradient(sx - 160, 0, sx + 160, H * 0.55);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, P.dark ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.28)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    // ---------- Чарчы: алтын көчүк (рамка) ----------
    function edge(x0, y0, x1, y1, rot) {
      var len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.floor(len / 40)), step = len / n;
      for (var i = 0; i < n; i++) {
        var f = (i + 0.5) * step / len;
        ctx.save(); ctx.translate(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f); ctx.rotate(rot); ctx.scale(0.5, 0.5); ctx.translate(-120, -30);
        ctx.lineWidth = 3.6; ctx.stroke(HORN_L); ctx.stroke(HORN_R); ctx.restore();
      }
    }
    function frame(t) {
      var sh = (t * 90) % (W * 2) - W * 0.4, g = goldGrad(sh - W * 0.7, 0, sh + W * 0.7, H * 0.6);
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.fillStyle = g; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.lineWidth = 3.4; ctx.strokeRect(20, 20, W - 40, H - 40);
      ctx.lineWidth = 1.3; ctx.strokeRect(31, 31, W - 62, H - 62);
      [[20, 20, 1, 1], [W - 20, 20, -1, 1], [20, H - 20, 1, -1], [W - 20, H - 20, -1, -1]].forEach(function (c) {
        ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(c[2] * 1.3, c[3] * 1.3); ctx.translate(-4, -4); ctx.lineWidth = 2.2; ctx.stroke(CORNER);
        ctx.beginPath(); ctx.arc(8, 8, 3.4, 0, 7); ctx.fill(); ctx.restore();
      });
      ctx.lineWidth = 2.2;
      edge(150, 46, W - 150, 46, Math.PI);
      edge(150, H - 46, W - 150, H - 46, 0);
      edge(46, 150, 46, H - 150, Math.PI / 2);
      edge(W - 46, 150, W - 46, H - 150, -Math.PI / 2);
    }

    // ---------- Медальон (радиалдык оюм) ----------
    function circle(r) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); }
    function petal(R) {
      [1, -1].forEach(function (m) {
        ctx.beginPath(); ctx.moveTo(0, -R * 0.3);
        ctx.bezierCurveTo(m * R * 0.24, -R * 0.4, m * R * 0.3, -R * 0.66, m * R * 0.12, -R * 0.78);
        ctx.bezierCurveTo(m * R * 0.0, -R * 0.84, -m * R * 0.12, -R * 0.74, -m * R * 0.04, -R * 0.64);
        ctx.stroke();
      });
      ctx.beginPath(); ctx.moveTo(0, -R * 0.44); ctx.quadraticCurveTo(R * 0.085, -R * 0.62, 0, -R * 0.8); ctx.quadraticCurveTo(-R * 0.085, -R * 0.62, 0, -R * 0.44); ctx.fill();
    }
    function medallion(cx, cy, R, rot, alpha) {
      if (alpha <= 0.001) return;
      ctx.save(); ctx.globalAlpha = E.clamp(alpha); ctx.translate(cx, cy);
      var g = goldGrad(-R, -R, R, R); ctx.strokeStyle = g; ctx.fillStyle = g; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(70,45,0,.3)"; ctx.shadowBlur = R * 0.03; ctx.shadowOffsetY = R * 0.012;
      ctx.lineWidth = R * 0.05; circle(R * 0.98);
      ctx.lineWidth = R * 0.016; circle(R * 0.9);
      for (var i = 0; i < 48; i++) { var a = i / 48 * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * R * 0.94, Math.sin(a) * R * 0.94, R * 0.011, 0, 7); ctx.fill(); }
      ctx.save(); ctx.rotate(rot); ctx.lineWidth = R * 0.034;
      for (var k = 0; k < 12; k++) { ctx.save(); ctx.rotate(k * Math.PI / 6); petal(R); ctx.restore(); }
      ctx.restore();
      ctx.lineWidth = R * 0.04; circle(R * 0.3); ctx.lineWidth = R * 0.014; circle(R * 0.25);
      ctx.save(); ctx.rotate(-rot * 1.5);
      for (var j = 0; j < 16; j++) { ctx.rotate(Math.PI / 8); ctx.beginPath(); ctx.moveTo(-R * 0.03, -R * 0.12); ctx.lineTo(0, -R * 0.23); ctx.lineTo(R * 0.03, -R * 0.12); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      ctx.beginPath(); ctx.arc(0, 0, R * 0.08, 0, 7); ctx.fill();
      ctx.restore();
    }
    function smallOrn(cx, cy, w, alpha) {
      ctx.save(); ctx.globalAlpha = E.clamp(alpha); ctx.strokeStyle = goldGrad(cx - w, cy, cx + w, cy); ctx.lineCap = "round"; ctx.lineWidth = 2.4;
      var s = w / 240; ctx.translate(cx - 120 * s, cy - 22 * s); ctx.scale(s, s); ctx.stroke(HORN_L); ctx.stroke(HORN_R);
      ctx.beginPath(); ctx.moveTo(86, 22); ctx.lineTo(24, 22); ctx.moveTo(154, 22); ctx.lineTo(216, 22); ctx.stroke(); ctx.restore();
    }

    // ---------- Текст жардамчылары ----------
    function gold(s, x, y, size, fam, weight, style, alpha, ls) {
      ctx.save(); E.font(style, weight, size, fam); E.spacing(ls || 0); ctx.globalAlpha = E.clamp(alpha);
      ctx.shadowColor = "rgba(70,45,0,.28)"; ctx.shadowBlur = 2; ctx.shadowOffsetY = 1.5;
      var g = ctx.createLinearGradient(0, y - size * 0.6, 0, y + size * 0.6);
      GOLD.forEach(function (c, i) { g.addColorStop(i / (GOLD.length - 1), c); });
      ctx.fillStyle = g; ctx.fillText(s, x, y); ctx.restore();
    }
    function ink(s, x, y, size, fam, weight, style, alpha, ls, color) {
      ctx.save(); E.font(style, weight, size, fam); E.spacing(ls || 0); ctx.globalAlpha = E.clamp(alpha); ctx.fillStyle = color || P.ink; ctx.fillText(s, x, y); ctx.restore();
    }
    function para(text, cx, y0, size, maxW, maxLines, alpha, t, t0, color, weight) {
      var lines = [], sz = size;
      for (;;) {
        E.font("italic", weight || 600, sz, FAM.serif); lines = [];
        String(text).split("\n").forEach(function (p) { E.wrap(p, maxW).forEach(function (l) { lines.push(l); }); });
        if (lines.length <= maxLines || sz <= 22) break; sz -= 2;
      }
      var lh = sz * 1.45;
      lines.forEach(function (l, i) {
        var p = E.rev(t, t0 + i * 0.32, 0.9);
        ink(l, cx, y0 + i * lh + (1 - p) * 16, sz, FAM.serif, weight || 600, "italic", alpha * p, 0, color);
      });
      return y0 + lines.length * lh;
    }
    function pin(cx, cy, alpha) {
      ctx.save(); ctx.globalAlpha = E.clamp(alpha); ctx.fillStyle = goldGrad(cx - 20, cy - 30, cx + 20, cy + 30); ctx.translate(cx, cy);
      ctx.beginPath(); ctx.arc(0, -8, 20, Math.PI * 0.85, Math.PI * 0.15, false); ctx.lineTo(0, 30); ctx.closePath();
      ctx.moveTo(7, -8); ctx.arc(0, -8, 7, 0, Math.PI * 2, true); ctx.fill("evenodd"); ctx.restore();
    }
    function band(img, y0, y1, fade, alpha, t) {
      ctx.save(); ctx.globalAlpha = E.clamp(alpha); ctx.beginPath(); ctx.rect(0, y0, W, y1 - y0); ctx.clip();
      var iw = img.naturalWidth, ih = img.naturalHeight, z = 1.04 + 0.05 * Math.min(1, t / 6), sc = Math.max(W / iw, (y1 - y0) / ih) * z, dw = iw * sc, dh = ih * sc;
      ctx.drawImage(img, (W - dw) / 2, (y0 + y1) / 2 - dh / 2, dw, dh);
      var g = ctx.createLinearGradient(0, y0, 0, y1);
      if (fade === "bottom") { g.addColorStop(0, rgba(P.mid, 0)); g.addColorStop(0.6, rgba(P.mid, 0)); g.addColorStop(1, rgba(P.mid, 1)); }
      else { g.addColorStop(0, rgba(P.mid, 1)); g.addColorStop(0.4, rgba(P.mid, 0)); g.addColorStop(1, rgba(P.mid, 0)); }
      ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0); ctx.restore();
    }

    var heading = (d.heading || "").toUpperCase();
    var label = LABEL[lang][type];
    var dateStr = pad(E.day) + "  |  " + pad(E.mon + 1) + "  |  " + E.year;

    // ---------- Сахналар ----------
    function intro(a, t) {
      var hp = E.rev(t, 0.2, 1.0);
      medallion(W / 2, 175, 48, t * 0.25, a * hp);
      var head = yub ? names.join(" & ") : label;
      E.font("normal", 600, 34, FAM.cap); E.spacing(9);
      var hs = E.wrap(head.toUpperCase(), 560);
      hs.forEach(function (l, i) { ink(l, W / 2, 262 + i * 44, 34, FAM.cap, 600, "normal", a * E.rev(t, 0.5, 1.0), 9); });
      if (t < 1.6) return;
      var u = t - 1.6;
      if (yub) {
        var p = E.rev(u, 0, 1.4), sc = 1.25 - 0.25 * p;
        ctx.save(); ctx.translate(W / 2, H * 0.44); ctx.scale(sc, sc); ctx.translate(-W / 2, -H * 0.44);
        gold(String(age), W / 2, H * 0.44, 380, FAM.num, 400, "normal", a * p, 0); ctx.restore();
        gold(T.age, W / 2, H * 0.60, 92, FAM.script, 400, "normal", a * E.rev(u, 1.0, 1.0), 0);
        ink(label, W / 2, H * 0.69, 33, FAM.cap, 600, "normal", a * E.rev(u, 1.6, 0.9), 10);
        ink(dateStr, W / 2, H * 0.75, 34, FAM.cap, 600, "normal", a * E.rev(u, 2.0, 0.9), 4);
      } else {
        var n = names.length, base = 168, sz = base, i;
        for (i = 0; i < n; i++) sz = Math.min(sz, E.fitSize(names[i], "normal", 400, FAM.script, base, W - 130, 50));
        var ys = n === 1 ? [H * 0.45] : [H * 0.39, H * 0.55];
        for (i = 0; i < n; i++) { var q = E.rev(u, i * 0.7, 1.2); gold(names[i], W / 2, ys[i] + (1 - q) * 36, sz, FAM.script, 400, "normal", a * q, 0); }
        if (n > 1) gold("&", W / 2, H * 0.47, sz * 0.5, FAM.script, 400, "normal", a * E.rev(u, 0.8, 0.9), 0);
        smallOrn(W / 2, H * 0.655, 300, a * E.rev(u, 1.6, 0.9));
        ink(dateStr, W / 2, H * 0.72, 34, FAM.cap, 600, "normal", a * E.rev(u, 2.0, 0.9), 4);
        if (d.city) ink(String(d.city).toUpperCase(), W / 2, H * 0.775, 28, FAM.cap, 600, "normal", a * E.rev(u, 2.3, 0.9), 12, P.soft);
      }
    }

    function poem(a, t) {
      medallion(W / 2, H * 0.31, 215, t * 0.12, a * E.rev(t, 0.1, 1.2));
      var text = d.poem || POEM[lang][type];
      para(text, W / 2, H * 0.6, 33, 560, 7, a, t, 0.9);
    }

    function invite(a, t) {
      medallion(W / 2, 165, 44, t * 0.25, a * E.rev(t, 0, 0.8));
      var s = E.fitSize(T.dear, "normal", 400, FAM.script, 84, W - 120, 44);
      gold(T.dear, W / 2, H * 0.31, s, FAM.script, 400, "normal", a * E.rev(t, 0.3, 1.0), 0);
      smallOrn(W / 2, H * 0.385, 260, a * E.rev(t, 0.9, 0.9));
      var text = (d.text || T.text).trim();
      para(text, W / 2, H * 0.45, 32, 560, 10, a, t, 1.2);
    }

    function date(a, t) {
      medallion(W / 2, 30, 190, t * 0.12, a * E.rev(t, 0, 1.0));
      ink(T.toyDay, W / 2, H * 0.305, 32, FAM.cap, 600, "normal", a * E.rev(t, 0.3, 0.8), 10);
      var p = E.rev(t, 0.6, 1.1), sc = 1.12 - 0.12 * p;
      ctx.save(); ctx.translate(W / 2, H * 0.478); ctx.scale(sc, sc); ctx.translate(-W / 2, -H * 0.478);
      gold(String(E.day), W / 2, H * 0.478, 270, FAM.num, 400, "normal", a * p, 0); ctx.restore();
      ink(String(E.year), W * 0.15, H * 0.478, 36, FAM.cap, 600, "normal", a * E.rev(t, 1.0, 0.8), 3);
      var ms = E.fitSize(U.mon[E.mon].toUpperCase(), "normal", 600, FAM.cap, 38, 175, 20);
      ink(U.mon[E.mon].toUpperCase(), W * 0.84, H * 0.478, ms, FAM.cap, 600, "normal", a * E.rev(t, 1.0, 0.8), 3);
      ink(U.wd[E.weekday].toUpperCase(), W / 2, H * 0.615, 36, FAM.cap, 600, "normal", a * E.rev(t, 1.4, 0.8), 12);
      ink(T.time + " " + E.timeStr, W / 2, H * 0.68, 46, FAM.serif, 600, "italic", a * E.rev(t, 1.8, 0.8), 0);
      smallOrn(W / 2, H * 0.75, 280, a * E.rev(t, 2.2, 0.8));
    }

    function venue(a, t) {
      var v = d.venue || {};
      if (imgs[0]) band(imgs[0], 0, H * 0.4, "bottom", a * E.rev(t, 0, 1.0), t);
      else medallion(W / 2, H * 0.2, 115, t * 0.15, a * E.rev(t, 0, 1.0));
      pin(W / 2, H * 0.455, a * E.rev(t, 0.4, 0.8));
      gold(T.addr, W / 2, H * 0.53, 84, FAM.script, 400, "normal", a * E.rev(t, 0.6, 1.0), 0);
      var y = H * 0.615;
      if (v.name) y = para(v.name, W / 2, y, 50, 540, 3, a, t, 1.1, P.ink, 600);
      if (v.address) E.wrap && para(v.address, W / 2, y + 14, 32, 540, 3, a * 0.9, t, 1.6, P.soft, 400);
    }

    function ending(a, t) {
      var hasPhoto = !!imgs[1];
      if (hasPhoto) band(imgs[1], H * 0.5, H, "top", a * E.rev(t, 0, 1.0), t);
      else medallion(W / 2, H * 0.74, 150, t * 0.12, a * E.rev(t, 0, 1.2));
      var y = H * 0.17;
      if (d.hosts) {
        ink(T.respect, W / 2, y, 36, FAM.serif, 600, "italic", a * E.rev(t, 0.3, 0.8), 0);
        var hs = E.fitSize(String(d.hosts), "normal", 400, FAM.script, 88, W - 110, 40);
        gold(String(d.hosts), W / 2, y + 90, hs, FAM.script, 400, "normal", a * E.rev(t, 0.7, 1.0), 0);
        y += 190;
      } else y = H * 0.2;
      para(T.wait, W / 2, y + 20, 40, 540, 3, a, t, 1.4, P.ink, 600);
      if (!hasPhoto) ink(U.brand.toUpperCase(), W / 2, H * 0.945, 20, FAM.cap, 600, "normal", a * 0.8 * E.rev(t, 2.0, 0.8), 8, P.soft);
    }

    var scenes = [{ f: intro, d: 9.0 }, { f: poem, d: 6.6 }, { f: invite, d: 7.0 }, { f: date, d: 6.2 }];
    if (d.venue && (d.venue.name || d.venue.address)) scenes.push({ f: venue, d: 5.8 });
    scenes.push({ f: ending, d: 6.6, last: true });

    var ready = Promise.all([E.loadImg(photos[0]), E.loadImg(photos[1])]).then(function (r) { imgs = r; });

    return { scenes: scenes, background: background, foreground: frame, ready: ready };
  }

  window.VideoSilk = {
    create: create,
    loadFonts: loadFonts,
    families: [FAM.script, FAM.serif, FAM.cap, FAM.num],
    palettes: PAL
  };
})();
