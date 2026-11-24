(function () {
  "use strict";
  var S = window.SITE, I = window.I18N;
  var TYPES = ["uylonuu", "kyz-uzatuu", "nikah", "sunnot", "beshik", "tushoo", "yubiley", "tuulgan-kun", "kuda"];
  var lang = "ky", filter = "all", product = "site";

  try { var saved = localStorage.getItem("samara-lang"); if (saved === "ky" || saved === "ru") lang = saved; } catch (e) {}

  function tr(k) { return (I[lang] && I[lang][k] != null) ? I[lang][k] : (I.ru[k] != null ? I.ru[k] : k); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function waUrl(text) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text); }

  var DEMO_NAMES = { "demo": "Санжар <i>&amp;</i> Нурайым", "demo-beshik": "Айсулуу", "demo-sunnot": "Нурсултан", "demo-kyz": "Айпери", "demo-yubiley": "Азамат" };

  function renderTypes() {
    document.getElementById("typeList").innerHTML = TYPES.map(function (k) {
      return '<button type="button" class="type-card" data-type="' + k + '"><b>' + esc(tr("type." + k)) + "</b><span>" + esc(tr("type." + k + ".d")) + "</span></button>";
    }).join("");
  }

  function renderFilter() {
    var keys = ["all"].concat(TYPES);
    document.getElementById("tplFilter").innerHTML = keys.map(function (k) {
      return '<button type="button" class="chip' + (k === filter ? " on" : "") + '" data-filter="' + k + '">' + esc(tr(k === "all" ? "type.all" : "type." + k)) + "</button>";
    }).join("");
  }

  function vcardHtml(v) {
    var q = "id=" + v.demo + "&vs=silk&vp=" + v.vp + "&lang=" + lang;
    return '<a class="vcard" href="design.html?k=video&id=' + v.id + '&lang=' + lang + '">' +
      '<span class="vc-frame"><iframe src="video.html?' + q + '&preview=1" loading="lazy" tabindex="-1" aria-hidden="true" title=""></iframe><span class="vc-play">▶</span></span>' +
      "<b>" + esc(tr("type." + v.type)) + "</b><span>" + esc(tr("cta.view")) + "</span></a>";
  }

  function renderTemplates() {
    var grid = document.getElementById("tplGrid");
    if (product === "video") {
      var vl = S.videos.filter(function (v) { return filter === "all" || v.type === filter; });
      grid.className = "tpl-grid vids";
      grid.innerHTML = vl.length ? vl.map(function (v) {
        return '<article class="vtile">' + vcardHtml(v) + '<a class="btn btn-sm btn-solid" href="create.html?p=video&vp=' + v.vp + "&type=" + v.type + '">' + esc(tr("cta.createShort")) + "</a></article>";
      }).join("") : '<p class="center muted vnone">—</p>';
      return;
    }
    grid.className = "tpl-grid";
    var list = S.templates.filter(function (t) { return filter === "all" || t.types.indexOf(filter) > -1; });
    document.getElementById("tplGrid").innerHTML = list.map(function (t) {
      var demo = t.demo || "demo";
      var names = DEMO_NAMES[demo] || DEMO_NAMES.demo;
      var view = "design.html?id=" + t.id + "&lang=" + lang;
      var nameStyle = "font-family:" + t.font + (t.italic ? ";font-style:italic" : ";font-style:normal") +
        (t.upper ? ";text-transform:uppercase" : "") + (t.small ? ";font-size:24px" : "");
      var tags = t.types.map(function (k) { return tr("type." + k); }).join(" · ");
      return (
        '<article class="tpl">' +
          '<a class="tpl-preview tp-' + t.id + '" href="' + view + '" style="--tb:' + t.bg + ";--ti:" + t.ink + ";--ta:" + t.accent + '">' +
            '<span class="tp-frame"></span>' +
            (t.scene && window.Scenes ? window.Scenes.card(t.id) : "") + (t.garland && window.Botanic ? '<span class="tp-garland">' + window.Botanic.garland(300, 96, t.garland, 7, false) + "</span>" : "") +
            '<span class="tp-eyebrow">' + (lang === "ky" ? "ТОЙГО ЧАКЫРУУ" : "ПРИГЛАШЕНИЕ") + "</span>" +
            (t.isNew ? '<span class="tp-new">' + esc(tr("tpl.new")) + "</span>" : "") +
            '<span class="tp-names" style="' + nameStyle + '">' + names + "</span>" +
            '<svg class="tp-orn" viewBox="0 0 240 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M120 30 C120 16 108 8 98 12 C88 16 90 30 100 28 C106 27 106 20 101 20"/><path d="M120 30 C120 16 132 8 142 12 C152 16 150 30 140 28 C134 27 134 20 139 20"/><path d="M86 22 H30 M154 22 H210"/></svg>' +
            '<span class="tp-date">19 · XII · 2026</span>' +
          "</a>" +
          '<div class="tpl-info">' +
            "<div><h3>" + esc(t.name) + "</h3><p>" + esc(tags) + "</p></div>" +
            '<div class="tpl-actions">' +
              '<a class="btn btn-sm btn-ghost" href="' + view + '">' + esc(tr("cta.view")) + "</a>" +
              '<a class="btn btn-sm btn-solid" href="create.html?t=' + t.id + "&p=" + product + '">' + esc(tr("cta.createShort")) + "</a>" +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function renderVideos() {
    var box = document.getElementById("vcards");
    if (!box) return;
    box.innerHTML = S.videos.map(vcardHtml).join("");
  }

  function renderFaq() {
    document.getElementById("faqList").innerHTML = tr("faq").map(function (q) {
      return "<details><summary>" + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>";
    }).join("");
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = tr(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang); });
    document.querySelectorAll(".js-wa").forEach(function (a) {
      a.href = waUrl(tr("wa." + (a.getAttribute("data-wa") || "general")));
      a.target = "_blank"; a.rel = "noopener";
    });
    renderTypes(); renderFilter(); renderTemplates(); renderVideos(); renderFaq(); applyPrices();
    if (window.Shell) window.Shell.footer(document.getElementById("siteFooter"), lang);
  }

  function applyPrices() {
    document.querySelectorAll("[data-price]").forEach(function (el) { var v = S.prices[el.getAttribute("data-price")]; if (v != null) el.textContent = v; });
    var hp = document.getElementById("heroPrice");
    if (hp) hp.innerHTML = tr("hero.priceline").replace("{site}", S.prices.site).replace("{video}", S.prices.video).replace("{both}", S.prices.both);
    var pp = document.getElementById("prodPrice"); if (pp) pp.textContent = S.prices[product];
    var pn = document.getElementById("prodNote"); if (pn) pn.textContent = tr("prod.note." + product);
    document.querySelectorAll("#prodTabs [data-p]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-p") === product); });
  }
  // чыныгы баалар серверден (админ өзгөртө алат)
  if (window.Orders && window.Orders.enabled()) {
    window.Orders.prices().then(function (p) { if (p && p.site != null) { S.prices.site = p.site; S.prices.video = p.video; S.prices.both = p.both; applyPrices(); } }).catch(function () {});
  }
  var qProd = new URLSearchParams(location.search).get("p");
  if (qProd === "video" || qProd === "both") product = qProd;
  document.querySelectorAll('[data-count="templates"]').forEach(function (el) { el.textContent = S.templates.length; });
  // ?type=sunnot — алдынкы баракчалардан келген фильтр
  var qType = new URLSearchParams(location.search).get("type");
  if (qType && TYPES.indexOf(qType) > -1) filter = qType;

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (b) { lang = b.getAttribute("data-lang"); try { localStorage.setItem("samara-lang", lang); } catch (err) {} applyLang(); return; }
    var pt = e.target.closest("#prodTabs [data-p]");
    if (pt) { product = pt.getAttribute("data-p"); applyPrices(); renderTemplates(); return; }
    var f = e.target.closest("[data-filter]");
    if (f) { filter = f.getAttribute("data-filter"); renderFilter(); renderTemplates(); return; }
    var ty = e.target.closest("[data-type]");
    if (ty) {
      filter = ty.getAttribute("data-type"); renderFilter(); renderTemplates();
      document.getElementById("templates").scrollIntoView({ behavior: "smooth" });
    }
  });

  applyLang();

  // «Көрүү» басканда турган жерди эстеп, артка кайтканда ошол жерге алып келебиз
  try { history.scrollRestoration = "manual"; } catch (e) {}
  document.addEventListener("click", function (e) {
    if (e.target.closest('.tpl a[href^="design.html"], .vcard')) {
      try { sessionStorage.setItem("samara-y", String(Math.round(window.scrollY))); } catch (err) {}
    }
  }, true);
  try {
    var y = sessionStorage.getItem("samara-y");
    var nav = performance.getEntriesByType("navigation")[0];
    if (y && nav && nav.type === "back_forward") {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, +y);
      document.documentElement.style.scrollBehavior = "";
    }
    sessionStorage.removeItem("samara-y");
  } catch (e) {}

  // ---------- Люкс көрүнүш: ипек фон жана жумшак пайда болуу ----------
  try {
    if (window.Silk) {
      var silkUrl = 'url("' + window.Silk.make(window.Silk.PAL.emerald, 360, 640).toDataURL("image/jpeg", 0.82) + '")';
      document.documentElement.style.setProperty("--hero-silk", silkUrl);
    }
  } catch (e) {}

  var REVEAL = ".section h2, .section .kicker, .section .sub, .type-card, .tpl, .feat, .steps li, .price-card, .faq details, .vchips li, .final-cta h2, .final-cta p";
  var io = null;
  function observeReveal() {
    var els = document.querySelectorAll(REVEAL);
    els.forEach(function (el, i) { if (!el.classList.contains("rv")) { el.classList.add("rv"); el.style.transitionDelay = ((i % 6) * 70) + "ms"; } });
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".rv").forEach(function (e) { e.classList.add("in"); }); return; }
    if (!io) io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".rv:not(.in)").forEach(function (e) { io.observe(e); });
  }
  observeReveal();
  var origApply = applyLang;
  applyLang = function () { origApply(); observeReveal(); };

  // ---------- Мөөрлүү конверт (башкы бөлүк) ----------
  (function () {
    var env = document.getElementById("henv"), pill = document.getElementById("henvPill"), more = document.getElementById("henvMore");
    if (!env) return;
    env.classList.add("henv-t");
    (function () { var r = env.querySelector(".he-ribbon"); if (r) { var c = r.cloneNode(true); c.classList.add("r2"); r.parentNode.insertBefore(c, r.nextSibling); } })();
    var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var auto = !reduce, busy = false, rv = null;
    function setOpen(v) { env.classList.toggle("opened", v); if (pill) pill.hidden = v; if (more) more.hidden = !v; }

    // Алтын учкундар / золотые искры
    function sparks(host) {
      var h = "";
      for (var i = 0; i < 46; i++) {
        var a = Math.random() * 360, d = 90 + Math.random() * 300, sz = 4 + Math.random() * 8;
        h += '<i style="--a:' + a.toFixed(0) + "deg;--d:" + d.toFixed(0) + "px;--s:" + sz.toFixed(1) + "px;--t:" + (0.9 + Math.random() * 0.9).toFixed(2) + "s;--dl:" + (Math.random() * 0.25).toFixed(2) + 's"></i>';
      }
      host.innerHTML = h;
    }

    function wallHtml() {
      var T = S.templates.slice(), rows = [[], [], [], []];
      T.forEach(function (t, i) { rows[i % 4].push(t); });
      return rows.map(function (r, ri) {
        var cards = r.concat(r).map(function (t) {
          var demo = t.demo || "demo", names = DEMO_NAMES[demo] || DEMO_NAMES.demo;
          var nameStyle = "font-family:" + t.font + (t.italic ? ";font-style:italic" : ";font-style:normal") + (t.upper ? ";text-transform:uppercase" : "") + (t.small ? ";font-size:20px" : "");
          return '<a class="rv-card tpl-preview tp-' + t.id + '" href="design.html?id=' + t.id + "&lang=" + lang + '" style="--tb:' + t.bg + ";--ti:" + t.ink + ";--ta:" + t.accent + '" tabindex="-1">' +
            '<span class="tp-frame"></span>' +
            (t.scene && window.Scenes ? window.Scenes.card(t.id) : "") + (t.garland && window.Botanic ? '<span class="tp-garland">' + window.Botanic.garland(300, 96, t.garland, 7, false) + "</span>" : "") +
            '<span class="tp-eyebrow">' + (lang === "ky" ? "ТОЙГО ЧАКЫРУУ" : "ПРИГЛАШЕНИЕ") + "</span>" +
            '<span class="tp-names" style="' + nameStyle + '">' + names + '</span><span class="tp-date">19 · XII · 2026</span></a>';
        }).join("");
        return '<div class="rv-row ' + (ri % 2 ? "r" : "l") + '" style="--dl:' + (ri * 0.12) + "s;--sp:" + (46 + ri * 9) + 's"><div class="rv-track">' + cards + "</div></div>";
      }).join("");
    }

    function closeRv() {
      if (!rv) return;
      var el = rv; rv = null; clearTimeout(el._t); el.classList.add("out");
      document.documentElement.classList.remove("rv-lock");
      setTimeout(function () { el.remove(); busy = false; setOpen(false); auto = false; }, 500);
    }

    var play;
    function openRv() {
      var el = document.createElement("div");
      el.className = "rvx"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
      el.innerHTML = '<div class="rv-glow"></div><div class="rv-sparks"></div><div class="rv-wall" aria-hidden="false">' + wallHtml() + "</div>" +
        '<div class="rv-veil"></div>' +
        '<div class="rv-sheet"><h2>' + tr("rv.make") + '</h2><div class="rv-two">' +
          '<a class="rv-pc" href="create.html?p=site"><span class="rv-pi" style="background-image:url(&quot;' + (window.Scenes ? window.Scenes.uri("scn-lake-scarlet") : "") + '&quot;)"></span><b>' + esc(tr("price.p1t")) + "</b><strong>" + S.prices.site + " <small>сом</small></strong></a>" +
          '<a class="rv-pc" href="create.html?p=video"><span class="rv-pi" style="background-image:url(&quot;' + (window.Scenes ? window.Scenes.uri("scn-yurt-night") : "") + '&quot;)"><i>▶</i></span><b>' + esc(tr("price.p3t")) + "</b><strong>" + S.prices.video + " <small>сом</small></strong></a></div>" +
          '<a class="rv-both" href="create.html?p=both"><b>' + esc(tr("price.p4t")) + "</b><strong>" + S.prices.both + " <small>сом</small></strong></a>" +
          '<p class="rv-free">' + tr("rv.free") + '</p><a class="rv-all" href="#templates">' + esc(tr("rv.all")) + "</a></div>" +
        '<button type="button" class="rv-replay" aria-label="' + esc(tr("rv.replay")) + '">↻</button>' +
        '<div class="rv-phonebox"><div class="rv-phone"><video src="media/krem.mp4" poster="media/krem.jpg" muted playsinline autoplay preload="auto"></video></div><span class="rv-pill2" id="rvCap">' + esc(tr("rv.guest")) + '</span><button type="button" class="rv-skip2">' + esc(tr("rv.skip")) + '</button></div>' +
        '<button type="button" class="rv-x" aria-label="' + esc(tr("rv.close")) + '">✕</button>';
      document.body.appendChild(el); rv = el;
      document.documentElement.classList.add("rv-lock");
      sparks(el.querySelector(".rv-sparks"));
      function toWall() { clearTimeout(el._t); el.classList.add("wall"); var v0 = el.querySelector("video"); if (v0) v0.pause(); }
      var vid = el.querySelector("video");
      el.querySelector(".rv-skip2").addEventListener("click", toWall);
      el.querySelector(".rv-replay").addEventListener("click", function () { closeRv(); setTimeout(function () { play(); }, 700); });
      vid.addEventListener("ended", toWall);
      vid.addEventListener("error", function () { el._t = setTimeout(toWall, 900); });
      var pp = vid.play(); if (pp && pp.catch) pp.catch(function () {});
      el._t = setTimeout(toWall, 14000);
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("on"); }); });
      el.querySelector(".rv-x").addEventListener("click", closeRv);
      el.querySelector(".rv-all").addEventListener("click", function () { closeRv(); });
      el.addEventListener("click", function (e) { if (e.target.classList.contains("rv-veil") || e.target.classList.contains("rv-glow")) closeRv(); });
      el.querySelector(".rv-x").focus({ preventScroll: true });
    }
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && rv) closeRv(); });

    function shards() {
      var st = env.querySelector(".henv-stage"); if (!st || st.querySelector(".shard")) return;
      for (var i = 0; i < 9; i++) {
        var a = (i / 9) * 6.283 + Math.random() * 0.5, d = 60 + Math.random() * 90, sp = document.createElement("span");
        sp.className = "shard"; sp.style.cssText = "--dx:" + Math.round(Math.cos(a) * d) + "px;--dy:" + Math.round(Math.sin(a) * d + 30) + "px;--r:" + Math.round(Math.random() * 540 - 270) + "deg;width:" + (4 + Math.random() * 4).toFixed(1) + "%";
        st.appendChild(sp);
      }
    }
    function silkSvg() {
      // Чыныгы сатин: турбуленттик бүдүр бетти жарык менен жаркыратабыз
      return '<svg viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true"><defs>' +
        '<filter id="satin" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">' +
          '<feTurbulence type="fractalNoise" baseFrequency="0.0035 0.0011" numOctaves="2" seed="11" result="n"/>' +
          '<feGaussianBlur in="n" stdDeviation="5" result="nb"/>' +
          '<feSpecularLighting in="nb" surfaceScale="9" specularConstant=".9" specularExponent="34" lighting-color="#f3dc9a" result="spec"><feDistantLight azimuth="235" elevation="48"/></feSpecularLighting>' +
          '<feDiffuseLighting in="nb" surfaceScale="7" diffuseConstant=".95" lighting-color="#2a8f72" result="dif"><feDistantLight azimuth="235" elevation="55"/></feDiffuseLighting>' +
          '<feComposite in="dif" in2="SourceGraphic" operator="arithmetic" k1="1.0" k2="0" k3="0" k4="-.08" result="base"/>' +
          '<feComposite in="spec" in2="base" operator="arithmetic" k1="0" k2=".55" k3="1" k4="0"/>' +
        '</filter>' +
        '<linearGradient id="skg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d4a3a"/><stop offset=".5" stop-color="#0f6b52"/><stop offset="1" stop-color="#083a2c"/></linearGradient></defs>' +
        '<path filter="url(#satin)" d="M-60 -20H470C430 140 500 260 450 400S500 650 460 820H-60C-20 650 -90 520 -40 400S-100 140 -60 -20Z" fill="url(#skg)"/></svg>';
    }
    var skipBtn = null, timers = [];
    function later(f, ms) { var t = setTimeout(f, ms); timers.push(t); return t; }
    function cleanupPlay() { timers.forEach(clearTimeout); timers = []; if (skipBtn) { skipBtn.remove(); skipBtn = null; } }
    var ph = null;
    function expandEnv() {
      var r = env.getBoundingClientRect();
      ph = document.createElement("div"); ph.style.cssText = "width:" + r.width + "px;height:" + r.height + "px;margin:0 auto"; env.parentNode.insertBefore(ph, env);
      env.style.cssText = "position:fixed;left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px;margin:0;z-index:150;";
      document.documentElement.classList.add("fx-on");
      void env.offsetWidth;
      env.classList.add("fx");
      env.style.transition = "left .75s cubic-bezier(.6,.05,.2,1), top .75s cubic-bezier(.6,.05,.2,1), width .75s cubic-bezier(.6,.05,.2,1), height .75s cubic-bezier(.6,.05,.2,1), border-radius .75s";
      env.style.left = "0px"; env.style.top = "0px"; env.style.width = "100vw"; env.style.height = window.innerHeight + "px"; env.style.borderRadius = "0";
    }
    function resetEnv() {
      env.classList.remove("fx", "crack"); env.removeAttribute("style"); if (ph) { ph.remove(); ph = null; }
      document.documentElement.classList.remove("fx-on");
      env.querySelectorAll(".shard").forEach(function (s) { s.remove(); });
    }
    play = function () {
      if (busy) return; busy = true; auto = false;
      try { var pre = document.createElement("video"); pre.preload = "auto"; pre.muted = true; pre.src = "media/krem.mp4"; } catch (e) {}
      var silk = null;
      function finishToRv() { cleanupPlay(); if (silk) { silk.remove(); silk = null; } openRv(); resetEnv(); }
      if (reduce) { setOpen(true); later(finishToRv, 50); return; }
      setOpen(false);
      expandEnv();
      skipBtn = document.createElement("button"); skipBtn.type = "button"; skipBtn.className = "hs-skip"; skipBtn.textContent = tr("rv.skip");
      skipBtn.addEventListener("click", function (e) { e.stopPropagation(); finishToRv(); }); document.body.appendChild(skipBtn);
      later(function () { shards(); env.classList.add("crack"); }, 800);
      later(function () { setOpen(true); }, 1350);
      later(function () {
        silk = document.createElement("div"); silk.className = "silk"; silk.innerHTML = silkSvg(); document.body.appendChild(silk);
        requestAnimationFrame(function () { silk.classList.add("in"); });
      }, 3000);
      later(function () { openRv(); resetEnv(); if (skipBtn) { skipBtn.remove(); skipBtn = null; } }, 4050);
      later(function () { if (silk) { silk.classList.remove("in"); silk.classList.add("out"); } }, 4150);
      later(function () { if (silk) { silk.remove(); silk = null; } }, 5250);
    };
    function onTap() { if (busy) return; if (env.classList.contains("opened") && !auto) { /* авто-демодон кийин */ } play(); }
    env.addEventListener("click", onTap);
    env.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(); } });
    function cycle() { if (!auto) return; setOpen(true); setTimeout(function () { if (!auto) return; setOpen(false); setTimeout(cycle, 3800); }, 6500); }
    setTimeout(cycle, 2200);
  })();
  if (window.Scenes && window.Scenes.ready) window.Scenes.ready.then(function () { renderTemplates(); document.querySelectorAll('[data-count="templates"]').forEach(function (el) { el.textContent = S.templates.length; }); });
  // Көрүнгөндө гана ойнойт, көрүнбөсө токтойт
  (function () {
    var vids = document.querySelectorAll("video[data-src]");
    if (!vids.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function ensure(v) { if (!v.src && v.getAttribute("data-src")) { v.src = v.getAttribute("data-src"); v.load(); } }
    if (reduce || !("IntersectionObserver" in window)) { vids.forEach(function (v) { v.controls = true; ensure(v); }); return; }
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (en) { var v = en.target; if (en.isIntersecting) { ensure(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { io2.observe(v); });
  })();
})();
