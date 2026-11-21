(function () {
  "use strict";
  var S = window.SITE, I = window.I18N;
  var TYPES = ["uylonuu", "kyz-uzatuu", "nikah", "sunnot", "beshik", "tushoo", "yubiley", "tuulgan-kun", "kuda"];
  var lang = "ru", filter = "all";

  try { var saved = localStorage.getItem("samara-lang"); if (saved === "ky" || saved === "ru") lang = saved; } catch (e) {}

  function tr(k) { return (I[lang] && I[lang][k] != null) ? I[lang][k] : (I.ru[k] != null ? I.ru[k] : k); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function waUrl(text) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text); }

  var DEMO_NAMES = { "demo": "Санжар <i>&amp;</i> Нурайым", "demo-beshik": "Айсулуу", "demo-sunnot": "Нурсултан" };

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

  function renderTemplates() {
    var list = S.templates.filter(function (t) { return filter === "all" || t.types.indexOf(filter) > -1; });
    document.getElementById("tplGrid").innerHTML = list.map(function (t) {
      var demo = t.demo || "demo";
      var names = DEMO_NAMES[demo] || DEMO_NAMES.demo;
      var view = "davet.html?id=" + demo + "&t=" + t.id + "&lang=" + lang;
      var nameStyle = "font-family:" + t.font + (t.italic ? ";font-style:italic" : ";font-style:normal") +
        (t.upper ? ";text-transform:uppercase" : "") + (t.small ? ";font-size:24px" : "");
      var tags = t.types.map(function (k) { return tr("type." + k); }).join(" · ");
      return (
        '<article class="tpl">' +
          '<a class="tpl-preview tp-' + t.id + '" href="' + view + '" target="_blank" rel="noopener" style="--tb:' + t.bg + ";--ti:" + t.ink + ";--ta:" + t.accent + '">' +
            '<span class="tp-frame"></span>' +
            '<span class="tp-eyebrow">' + (lang === "ky" ? "ТОЙГО ЧАКЫРУУ" : "ПРИГЛАШЕНИЕ") + "</span>" +
            (t.isNew ? '<span class="tp-new">' + esc(tr("tpl.new")) + "</span>" : "") +
            '<span class="tp-names" style="' + nameStyle + '">' + names + "</span>" +
            '<svg class="tp-orn" viewBox="0 0 240 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M120 30 C120 16 108 8 98 12 C88 16 90 30 100 28 C106 27 106 20 101 20"/><path d="M120 30 C120 16 132 8 142 12 C152 16 150 30 140 28 C134 27 134 20 139 20"/><path d="M86 22 H30 M154 22 H210"/></svg>' +
            '<span class="tp-date">19 · XII · 2026</span>' +
          "</a>" +
          '<div class="tpl-info">' +
            "<div><h3>" + esc(t.name) + "</h3><p>" + esc(tags) + "</p></div>" +
            '<div class="tpl-actions">' +
              '<a class="btn btn-sm btn-ghost" href="' + view + '" target="_blank" rel="noopener">' + esc(tr("cta.view")) + "</a>" +
              '<a class="btn btn-sm btn-solid" href="' + waUrl(tr("wa.tpl").replace("{t}", t.name)) + '" target="_blank" rel="noopener">' + esc(tr("cta.orderShort")) + "</a>" +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
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
    renderTypes(); renderFilter(); renderTemplates(); renderFaq();
  }

  document.querySelectorAll("[data-price]").forEach(function (el) { el.textContent = S.prices[el.getAttribute("data-price")]; });
  document.querySelectorAll('[data-count="templates"]').forEach(function (el) { el.textContent = S.templates.length; });
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("igLink").href = S.instagram;

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (b) { lang = b.getAttribute("data-lang"); try { localStorage.setItem("samara-lang", lang); } catch (err) {} applyLang(); return; }
    var f = e.target.closest("[data-filter]");
    if (f) { filter = f.getAttribute("data-filter"); renderFilter(); renderTemplates(); return; }
    var ty = e.target.closest("[data-type]");
    if (ty) {
      filter = ty.getAttribute("data-type"); renderFilter(); renderTemplates();
      document.getElementById("templates").scrollIntoView({ behavior: "smooth" });
    }
  });

  applyLang();
})();
