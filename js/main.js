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
            (t.garland && window.Botanic ? '<span class="tp-garland">' + window.Botanic.garland(300, 96, t.garland, 7, false) + "</span>" : "") +
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
    var auto = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    function setOpen(v) { env.classList.toggle("opened", v); if (pill) pill.hidden = v; if (more) more.hidden = !v; }
    function toggle() { auto = false; setOpen(!env.classList.contains("opened")); }
    env.addEventListener("click", toggle);
    env.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
    function cycle() { if (!auto) return; setOpen(true); setTimeout(function () { if (!auto) return; setOpen(false); setTimeout(cycle, 3800); }, 6500); }
    setTimeout(cycle, 2200);
  })();
})();
