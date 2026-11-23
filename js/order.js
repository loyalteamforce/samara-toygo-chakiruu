// «Мой заказ» баракчасы: order.html?i=КОД
(function () {
  "use strict";
  var S = window.SITE, Sh = window.Shell, O = window.Orders, esc = Sh.esc;
  var qs = new URLSearchParams(location.search);
  var code = O.clean(qs.get("i"));
  var lang = Sh.getLang(), cur = null, timer = null, LS = "samara-orders";

  var T = {
    ky: {
      title: "Заказ №", loading: "Жүктөлүүдө…", nf: "Заказ табылган жок. Шилтемени текшериңиз.", myOrders: "Менин заказдарым", none: "Азырынча заказ жок.", create: "Чакыруу түзүү",
      st: { "new": "Төлөм күтүлүүдө", paid: "Төлөнгөн ✓" },
      prod: { site: "Сайт-чакыруу", video: "Видео-чакыруу", both: "Сайт + видео" },
      sum: "Сумма", date: "Той күнү", payTitle: "Кантип төлөйсүз",
      p1: "ELQR колдогон банк тиркемеңизди ачып, QR-кодду сканерлеңиз (же төмөнкү номерге которуңуз).",
      p2: "Сумма: {s} сом. Комментарийге заказ кодун жазыңыз: {c}",
      p3: "Чекти (скриншот) бизге WhatsApp'ка жөнөтүңүз — төлөмдү ырастайбыз, шилтемелер ушул жерде пайда болот.",
      copyPhone: "Номерди көчүрүү", copied: "Көчүрүлдү ✓", sendReceipt: "Чекти WhatsApp'ка жөнөтүү", check: "Төлөмдү текшерүү", checking: "Текшерилүүдө…", stillNew: "Төлөм азырынча көрүнгөн жок. Төлөп, чекти жөнөтүңүз.",
      auto: "Бул бет өзү жаңыланат.", preview: "Чакыруунун көрүнүшү (төлөнгөнгө чейин фильграндуу)",
      readyTitle: "Төлөм ырасталды! Даяр шилтемелер:", linkInv: "Чакыруу шилтемеси", linkVid: "Видео-чакыруу (телефондо ачып «Видеону жүктөп алуу» басыңыз)",
      open: "Ачуу", copy: "Көчүрүү", share: "WhatsApp'ка жөнөтүү",
      guestsTitle: "Конокторго жеке шилтемелер", guestsHint: "Коноктордун аттарын жазыңыз (ар бири жаңы сапка) — ар бирине өзүнчө шилтеме чыгат.", guestsBtn: "Шилтемелерди түзүү",
      edit: "Маалыматты өзгөртүү керек болсо, бизге WhatsApp'ка жазыңыз — шилтеме ошол бойдон калат.",
      waPay: "Саламатсызбы! Заказ №{c} төлөндү: {s} сом. Чекти тиркедим.", waGuest: "Урматтуу {n}! Сизди тойубузга чакырабыз 💐\n{l}"
    },
    ru: {
      title: "Заказ №", loading: "Загрузка…", nf: "Заказ не найден. Проверьте ссылку.", myOrders: "Мои заказы", none: "Заказов пока нет.", create: "Создать приглашение",
      st: { "new": "Ожидает оплаты", paid: "Оплачено ✓" },
      prod: { site: "Сайт-приглашение", video: "Видео-приглашение", both: "Сайт + видео" },
      sum: "Сумма", date: "Дата тоя", payTitle: "Как оплатить",
      p1: "Откройте приложение банка с поддержкой ELQR и отсканируйте QR-код (или переведите на номер ниже).",
      p2: "Сумма: {s} сом. В комментарии укажите код заказа: {c}",
      p3: "Отправьте чек (скриншот) нам в WhatsApp — мы подтвердим оплату, и здесь появятся ваши ссылки.",
      copyPhone: "Скопировать номер", copied: "Скопировано ✓", sendReceipt: "Отправить чек в WhatsApp", check: "Проверить оплату", checking: "Проверяем…", stillNew: "Оплата пока не отображается. Оплатите и отправьте чек.",
      auto: "Страница обновляется сама.", preview: "Как выглядит приглашение (до оплаты — с надписью)",
      readyTitle: "Оплата подтверждена! Ваши ссылки:", linkInv: "Ссылка на приглашение", linkVid: "Видео-приглашение (откройте на телефоне и нажмите «Скачать видео»)",
      open: "Открыть", copy: "Копировать", share: "Отправить в WhatsApp",
      guestsTitle: "Личные ссылки для гостей", guestsHint: "Впишите имена гостей — по одному в строке. У каждого будет своя ссылка.", guestsBtn: "Создать ссылки",
      edit: "Если нужно что-то изменить, напишите нам в WhatsApp — ссылка останется прежней.",
      waPay: "Здравствуйте! Заказ №{c} оплачен: {s} сом. Чек прикладываю.", waGuest: "Уважаемый(ая) {n}! Приглашаем вас на наш той 💐\n{l}"
    }
  };
  function t() { return T[lang]; }
  function abs(p) { return new URL(p, location.href).href; }
  function wa(text) { return Sh.waUrl(text); }
  function toast(msg) { var x = document.querySelector(".toast"); if (!x) { x = document.createElement("div"); x.className = "toast"; document.body.appendChild(x); } x.textContent = msg; x.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { x.classList.remove("on"); }, 1600); }
  function copy(text) {
    function fb() { var ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(fb); else fb();
    toast(t().copied);
  }
  function remember(c) {
    try { var l = JSON.parse(localStorage.getItem(LS) || "[]"); if (l.indexOf(c) < 0) l.unshift(c); localStorage.setItem(LS, JSON.stringify(l.slice(0, 20))); } catch (e) {}
  }

  function head() {
    document.documentElement.lang = lang;
    Sh.header(document.getElementById("hdr"), lang, { fallback: "index.html", onLang: function (l) { lang = l; render(); } });
    Sh.footer(document.getElementById("siteFooter"), lang);
  }

  function listView() {
    var l = []; try { l = JSON.parse(localStorage.getItem(LS) || "[]"); } catch (e) {}
    document.getElementById("pg").innerHTML = '<h1 class="center">' + esc(t().myOrders) + "</h1>" +
      (l.length ? '<div class="ord-list">' + l.map(function (c) { return '<a class="ord-item" href="order.html?i=' + esc(c) + '">№ ' + esc(c.toUpperCase()) + " →</a>"; }).join("") + "</div>"
                : '<p class="center muted">' + esc(t().none) + "</p>") +
      '<p class="center"><a class="btn btn-solid" href="create.html">' + esc(t().create) + "</a></p>";
  }

  function render() {
    head();
    var pg = document.getElementById("pg");
    if (!code) return listView();
    if (cur === undefined) { pg.innerHTML = '<p class="center muted">' + esc(t().loading) + "</p>"; return; }
    if (cur === false) { pg.innerHTML = '<p class="center">' + esc(t().nf) + '</p><p class="center"><a class="btn btn-solid" href="create.html">' + esc(t().create) + "</a></p>"; return; }
    var r = cur, d = r.data || {}, paid = r.status === "paid", tx = t(), P = S.payment || {};
    var names = (d.names || []).join(" & ");
    var dateStr = d.date ? String(d.date).slice(0, 10).split("-").reverse().join(".") : "";
    var inv = abs("davet.html?i=" + code), vid = abs("video.html?i=" + code);
    var html =
      '<h1 class="center">' + esc(tx.title) + esc(code.toUpperCase()) + "</h1>" +
      '<p class="center"><span class="ord-chip ' + (paid ? "ok" : "wait") + '">' + esc(tx.st[r.status] || r.status) + "</span></p>" +
      '<div class="ord-card"><div class="ord-row"><span>' + esc(tx.prod[r.product] || r.product) + "</span><b>" + esc(r.price) + " " + esc(Sh.tr(lang, "som")) + "</b></div>" +
        (names ? '<div class="ord-row"><span>' + esc(names) + "</span><span>" + esc(dateStr) + "</span></div>" : "") + "</div>";

    if (!paid) {
      html += '<div class="ord-card pay"><h2>' + esc(tx.payTitle) + "</h2>" +
        '<ol class="ord-steps"><li>' + esc(tx.p1) + "</li><li>" + esc(tx.p2.replace("{s}", r.price).replace("{c}", code.toUpperCase())) + "</li><li>" + esc(tx.p3) + "</li></ol>" +
        '<div class="ord-qr"><img src="' + esc(P.qr || "img/elqr.jpg") + '" alt="' + esc(P.method || "QR") + '" width="260"></div>' +
        '<p class="ord-pay-name"><b>' + esc(P.name || "") + "</b> · " + esc(P.phone || "") + "</p>" +
        '<div class="ord-btns"><button type="button" class="btn btn-sm btn-ghost" id="bCopy">' + esc(tx.copyPhone) + "</button>" +
        '<a class="btn btn-sm btn-solid" target="_blank" rel="noopener" href="' + esc(wa(tx.waPay.replace("{c}", code.toUpperCase()).replace("{s}", r.price))) + '">' + esc(tx.sendReceipt) + "</a>" +
        '<button type="button" class="btn btn-sm btn-ghost" id="bCheck">' + esc(tx.check) + "</button></div>" +
        '<p class="hint" id="ordMsg">' + esc(tx.auto) + "</p></div>";
    } else {
      html += '<div class="ord-card ready"><h2>' + esc(tx.readyTitle) + "</h2>";
      if (r.product === "site" || r.product === "both") html += linkRow(tx.linkInv, inv);
      if (r.product === "video" || r.product === "both") html += linkRow(tx.linkVid, vid);
      html += '<h3>' + esc(tx.guestsTitle) + '</h3><p class="hint">' + esc(tx.guestsHint) + '</p><textarea id="guests" rows="3" placeholder="Асан байке&#10;Гүлзат эже"></textarea>' +
        '<button type="button" class="btn btn-sm btn-ghost" id="bGuests">' + esc(tx.guestsBtn) + '</button><div id="guestList"></div>' +
        '<p class="hint">' + esc(tx.edit) + "</p></div>";
    }
    var frame = r.product === "video" ? "video.html?i=" + code + "&preview=1" : "davet.html?i=" + code + "&preview=1&lang=" + lang;
    html += '<h2 class="center ord-h">' + esc(tx.preview) + '</h2><div class="phone ord-phone"><div class="phone-notch"></div><iframe src="' + esc(frame) + '" title="preview"></iframe></div>';
    pg.innerHTML = html;
    wire(r, inv);
  }

  function linkRow(label, link) {
    return '<div class="ord-link"><p>' + esc(label) + '</p><input readonly value="' + esc(link) + '"><div class="ord-btns">' +
      '<button type="button" class="btn btn-sm btn-ghost" data-copy="' + esc(link) + '">' + esc(t().copy) + "</button>" +
      '<a class="btn btn-sm btn-ghost" target="_blank" rel="noopener" href="' + esc(link) + '">' + esc(t().open) + "</a>" +
      '<a class="btn btn-sm btn-solid" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(link) + '">' + esc(t().share) + "</a></div></div>";
  }

  function wire(r, inv) {
    var pg = document.getElementById("pg");
    pg.querySelectorAll("[data-copy]").forEach(function (b) { b.addEventListener("click", function () { copy(b.getAttribute("data-copy")); }); });
    var bc = document.getElementById("bCopy"); if (bc) bc.addEventListener("click", function () { copy(String((S.payment || {}).phone || "").replace(/[^\d+]/g, "")); });
    var chk = document.getElementById("bCheck");
    if (chk) chk.addEventListener("click", function () { var m = document.getElementById("ordMsg"); m.textContent = t().checking; load(true).then(function () { if (cur && cur.status !== "paid") { var mm = document.getElementById("ordMsg"); if (mm) mm.textContent = t().stillNew; } }); });
    var bg = document.getElementById("bGuests");
    if (bg) bg.addEventListener("click", function () {
      var list = document.getElementById("guestList"); list.innerHTML = "";
      document.getElementById("guests").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 300).forEach(function (n) {
        var link = inv + "&g=" + encodeURIComponent(n), row = document.createElement("div"); row.className = "g";
        var b = document.createElement("b"); b.textContent = n;
        var c = document.createElement("button"); c.type = "button"; c.className = "btn btn-ghost"; c.textContent = t().copy; c.addEventListener("click", function () { copy(link); });
        var w = document.createElement("a"); w.className = "btn btn-solid"; w.textContent = "WhatsApp"; w.target = "_blank"; w.rel = "noopener"; w.href = "https://wa.me/?text=" + encodeURIComponent(t().waGuest.replace("{n}", n).replace("{l}", link));
        row.appendChild(b); row.appendChild(c); row.appendChild(w); list.appendChild(row);
      });
    });
  }

  function load(silent) {
    if (!silent) { cur = undefined; render(); }
    return O.get(code).then(function (r) { var was = cur && cur.status; cur = r || false; if (!silent || (r && r.status !== was)) render(); if (r && r.status === "paid" && timer) { clearInterval(timer); timer = null; } })
      .catch(function () { if (!silent) { cur = false; render(); } });
  }

  if (!code) { render(); }
  else {
    remember(code);
    load(false).then(function () { if (cur && cur.status !== "paid") timer = setInterval(function () { load(true); }, 20000); });
  }
})();
