// Бардык барактарга ортоктуу: жогорку тилке (ички барактар) жана ылдыйкы маалымат
(function () {
  "use strict";
  var S = window.SITE, I = window.I18N;
  var TYPES = ["uylonuu", "kyz-uzatuu", "nikah", "yubiley", "sunnot", "beshik", "tushoo", "tuulgan-kun", "kuda"];

  function getLang() { try { var l = localStorage.getItem("samara-lang"); if (l === "ru" || l === "ky") return l; } catch (e) {} return "ky"; }
  function setLang(l) { try { localStorage.setItem("samara-lang", l); } catch (e) {} }
  function tr(lang, k) { return (I[lang] && I[lang][k] != null) ? I[lang][k] : (I.ru[k] != null ? I.ru[k] : k); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function waUrl(text) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text); }
  function igName(u) { var m = String(u || "").match(/instagram\.com\/([^/?#]+)/i); return m ? "@" + m[1] : "Instagram"; }
  var LOGO = '<a class="logo" href="index.html"><span class="logo-mark"><img src="logo/mark-sm.svg" alt="" width="30" height="30"></span><span><b>Samara</b><small>ТОЙ ЧАКЫРУУ</small></span></a>';

  // Ички барактардын жогорку тилкеси: артка • логотип • тил
  function header(el, lang, opts) {
    opts = opts || {};
    el.className = "topbar";
    el.innerHTML = '<div class="wrap tb-in"><button type="button" class="tb-back" id="tbBack" aria-label="' + esc(tr(lang, "dz.back")) + '">←</button>' + LOGO +
      '<div class="lang" role="group" aria-label="Тил / Язык"><button type="button" data-lang="ky" aria-pressed="' + (lang === "ky") + '">KG</button><button type="button" data-lang="ru" aria-pressed="' + (lang === "ru") + '">RU</button></div></div>';
    el.querySelector("#tbBack").addEventListener("click", function () {
      if (document.referrer && document.referrer.indexOf(location.host) > -1 && history.length > 1) history.back();
      else location.href = opts.fallback || "index.html";
    });
    el.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { var l = b.getAttribute("data-lang"); setLang(l); if (opts.onLang) opts.onLang(l); });
    });
  }

  function footer(el, lang) {
    if (!el) return;
    el.className = "footer";
    var typeLinks = TYPES.map(function (k) { return '<li><a href="index.html?type=' + k + '#templates">' + esc(tr(lang, "type." + k)) + "</a></li>"; }).join("");
    el.innerHTML =
      '<div class="wrap">' +
        '<div class="foot-brand">' + LOGO + '<p class="brand-kg">Самара · Той чакыруу</p><p class="muted">' + esc(tr(lang, "foot.about")) + "</p></div>" +
        '<div class="foot-grid">' +
          '<div class="foot-col"><h4>' + esc(tr(lang, "foot.col.site")) + "</h4><ul>" +
            '<li><a href="index.html#templates">' + esc(tr(lang, "nav.templates")) + "</a></li>" +
            '<li><a href="index.html#video">' + esc(tr(lang, "nav.video")) + "</a></li>" +
            '<li><a href="texts.html">' + esc(tr(lang, "foot.texts")) + "</a></li>" +
            '<li><a href="index.html#prices">' + esc(tr(lang, "nav.prices")) + "</a></li>" +
            '<li><a href="index.html#faq">' + esc(tr(lang, "nav.faq")) + "</a></li></ul></div>" +
          '<div class="foot-col"><h4>' + esc(tr(lang, "foot.col.inv")) + "</h4><ul>" + typeLinks + "</ul></div>" +
          '<div class="foot-col"><h4>' + esc(tr(lang, "foot.col.cab")) + '</h4><ul><li><a href="admin.html">' + esc(tr(lang, "foot.admin")) + "</a></li></ul></div>" +
          '<div class="foot-col"><h4>' + esc(tr(lang, "foot.col.contact")) + "</h4><ul>" +
            '<li><a href="' + esc(waUrl(tr(lang, "wa.general"))) + '" target="_blank" rel="noopener">WhatsApp</a></li>' +
            (S.instagram ? '<li><a href="' + esc(S.instagram) + '" target="_blank" rel="noopener">' + esc(igName(S.instagram)) + "</a></li>" : "") + "</ul></div>" +
        "</div>" +
        '<p class="copy">© ' + new Date().getFullYear() + " Samara · Кыргызстан. " + esc(tr(lang, "foot.rights")) +
        ' <span class="legal"><a href="terms.html">' + esc(tr(lang, "foot.terms")) + '</a><a href="privacy.html">' + esc(tr(lang, "foot.privacy")) + "</a></span></p>" +
      "</div>";
  }

  window.Shell = { TYPES: TYPES, getLang: getLang, setLang: setLang, tr: tr, esc: esc, waUrl: waUrl, header: header, footer: footer };
})();
