// Дизайндын баракчасы: design.html?id=altyn  же  design.html?k=video&id=zhibek-kyz
(function () {
  "use strict";
  var S = window.SITE, Sh = window.Shell, esc = Sh.esc;
  var qs = new URLSearchParams(location.search);
  var kind = qs.get("k") === "video" ? "video" : "site";
  var id = (qs.get("id") || "").replace(/[^a-z0-9-]/gi, "");
  var lang = qs.get("lang") === "ru" ? "ru" : qs.get("lang") === "ky" ? "ky" : Sh.getLang();
  var DEMO_NAMES = { "demo": "Санжар <i>&amp;</i> Нурайым", "demo-beshik": "Айсулуу", "demo-sunnot": "Нурсултан", "demo-kyz": "Айпери", "demo-yubiley": "60" };
  var PAL_BG = { cream: "linear-gradient(160deg,#fffaf0,#e6d4ad)", emerald: "linear-gradient(160deg,#1f6b58,#04251e)", burgundy: "linear-gradient(160deg,#8f2a3d,#2b0810)", navy: "linear-gradient(160deg,#2f4f94,#071230)" };

  function tr(k) { return Sh.tr(lang, k); }
  var list = kind === "video" ? S.videos : S.templates;
  var item = list.filter(function (x) { return x.id === id; })[0] || list[0];

  function vname(v) { return tr("type." + v.type) + " · " + tr("dz.silk") + " " + tr("dz.pal." + v.vp).toLowerCase(); }
  function nameOf(x) { return kind === "video" ? vname(x) : x.name; }
  function url(x) { return "design.html?" + (kind === "video" ? "k=video&" : "") + "id=" + x.id + "&lang=" + lang; }

  function mini(x) {
    if (kind === "video") {
      return '<a class="dz-mini" href="' + url(x) + '"><span class="dz-mini-pv dz-vid" style="background:' + PAL_BG[x.vp] + '"><span class="dz-vid-frame"></span><span class="dz-vid-t">' + esc(tr("type." + x.type)) + '</span><span class="dz-vid-p">▶</span></span><b>' + esc(vname(x)) + "</b></a>";
    }
    var names = DEMO_NAMES[x.demo || "demo"] || DEMO_NAMES.demo;
    var st = "font-family:" + x.font + (x.italic ? ";font-style:italic" : ";font-style:normal") + (x.upper ? ";text-transform:uppercase" : "") + (x.small ? ";font-size:19px" : "");
    return '<a class="dz-mini" href="' + url(x) + '"><span class="tpl-preview tp-' + x.id + '" style="--tb:' + x.bg + ";--ti:" + x.ink + ";--ta:" + x.accent + '">' +
      '<span class="tp-frame"></span>' + (x.garland && window.Botanic ? '<span class="tp-garland">' + window.Botanic.garland(220, 70, x.garland, 7, false) + "</span>" : "") + '<span class="tp-names" style="' + st + '">' + names + "</span></span><b>" + esc(x.name) + "</b></a>";
  }

  function render() {
    document.documentElement.lang = lang;
    Sh.header(document.getElementById("hdr"), lang, { fallback: "index.html#" + (kind === "video" ? "video" : "templates"), onLang: function (l) { lang = l; render(); } });
    Sh.footer(document.getElementById("siteFooter"), lang);
    var root = document.getElementById("dz");
    if (!item) { root.innerHTML = '<p class="dz-nf">' + esc(tr("dz.nf")) + "</p>"; return; }

    var title = nameOf(item), price, frame, full, feats, tags, hint;
    if (kind === "video") {
      var q = "id=" + item.demo + "&vs=silk&vp=" + item.vp + "&lang=" + lang;
      frame = "video.html?" + q + "&preview=1"; full = "video.html?" + q + "&from=site";
      price = S.prices.video; feats = ["dz.v1", "dz.v2", "dz.v3"]; hint = tr("dz.hintVideo");
      tags = tr("dz.silk") + " · " + tr("dz.pal." + item.vp);
    } else {
      var demo = item.demo || "demo";
      frame = "davet.html?id=" + demo + "&t=" + item.id + "&lang=" + lang;
      full = "davet.html?id=" + demo + "&t=" + item.id + "&lang=" + lang + "&from=site&n=" + encodeURIComponent(item.name);
      price = S.prices.site; feats = ["dz.f1", "dz.f2", "dz.f3"]; hint = tr("dz.hint");
      tags = item.types.map(function (k) { return tr("type." + k); }).join(" · ");
    }
    document.title = title + " · Samara";

    var others = list.filter(function (x) { return x.id !== item.id; });
    var msg = kind === "video" ? tr("wa.videoTpl").replace("{t}", title) : tr("wa.tpl").replace("{t}", title);

    root.innerHTML =
      '<div class="phone"><div class="phone-notch"></div><iframe src="' + frame + '" title="' + esc(title) + '"></iframe></div>' +
      '<p class="dz-hint">' + esc(hint) + "</p>" +
      '<a class="dz-full" href="' + full + '">' + esc(tr("dz.full")) + " ↗</a>" +
      '<h1 class="dz-title">' + esc(title) + "</h1>" +
      '<p class="dz-tags">' + esc(tags) + "</p>" +
      '<p class="dz-price"><b>' + price + "</b> " + esc(tr("som")) + "</p>" +
      '<ul class="dz-list">' + feats.map(function (k) { return "<li>" + esc(tr(k)) + "</li>"; }).join("") + "</ul>" +
      '<section class="dz-more"><h2>' + esc(tr("dz.more")) + '</h2><div class="dz-scroll">' + others.map(mini).join("") + "</div></section>";

    document.getElementById("cta").innerHTML =
      '<a class="btn btn-solid" href="' + esc(Sh.waUrl(msg)) + '" target="_blank" rel="noopener">' + esc(tr("dz.cta")) + ' →</a><small>' + esc(tr("dz.ctaNote")) + "</small>";
  }
  render();
})();
