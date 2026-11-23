// Админ: заказдардын тизмеси, «Төлөндү» белгилөө, баалар (orders.html)
(function () {
  "use strict";
  var S = window.SITE, O = window.Orders;
  var $ = function (id) { return document.getElementById(id); };
  var all = [], filter = "all";
  var PROD = { site: "Сайт", video: "Видео", both: "Сайт + видео" };
  var ST = { "new": "Ожидает оплаты", paid: "Оплачено", cancelled: "Отменён" };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function abs(p) { return new URL(p, location.href).href; }
  function toast(msg) { var t = document.querySelector(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); } t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 1800); }
  function digits(v) { return String(v || "").replace(/\D/g, ""); }
  function fmt(iso) { var d = new Date(iso); function p(n) { return (n < 10 ? "0" : "") + n; } return p(d.getDate()) + "." + p(d.getMonth() + 1) + " " + p(d.getHours()) + ":" + p(d.getMinutes()); }

  function render() {
    var list = all.filter(function (o) { return filter === "all" || o.status === filter; });
    var nNew = all.filter(function (o) { return o.status === "new"; }).length, nPaid = all.filter(function (o) { return o.status === "paid"; }).length;
    $("oaCount").textContent = "Всего: " + all.length + " · ждут оплаты: " + nNew + " · оплачено: " + nPaid;
    $("oaList").innerHTML = list.length ? list.map(function (o) {
      var names = (o.names || []).join(" & ") || "—", date = o.date ? String(o.date).slice(0, 10).split("-").reverse().join(".") : "";
      var link = abs("order.html?i=" + o.code);
      var msg = o.status === "paid"
        ? "Оплата подтверждена ✅ Ваш заказ №" + o.code.toUpperCase() + ". Ваши ссылки здесь: " + link
        : "Здравствуйте! Ваш заказ №" + o.code.toUpperCase() + " ждёт оплаты. Оплатить можно здесь: " + link;
      var wa = digits(o.customer_phone) ? "https://wa.me/" + digits(o.customer_phone) + "?text=" + encodeURIComponent(msg) : "";
      return '<article class="oa-item st-' + o.status + '">' +
        '<div class="oa-h"><b>№ ' + esc(o.code.toUpperCase()) + '</b><span class="ord-chip ' + (o.status === "paid" ? "ok" : o.status === "new" ? "wait" : "off") + '">' + esc(ST[o.status] || o.status) + "</span></div>" +
        '<p class="oa-line"><b>' + esc(names) + "</b> · " + esc(date) + (o.type ? " · " + esc(o.type) : "") + "</p>" +
        '<p class="oa-line muted">' + esc(PROD[o.product] || o.product) + " · <b>" + esc(o.price) + " сом</b> · " + esc(fmt(o.created_at)) + "</p>" +
        '<p class="oa-line">' + esc(o.customer_name || "—") + " · " + (wa ? '<a href="' + esc(wa) + '" target="_blank" rel="noopener">' + esc(o.customer_phone) + " (WhatsApp)</a>" : esc(o.customer_phone || "—")) + "</p>" +
        '<div class="oa-btns">' +
          (o.status !== "paid" ? '<button type="button" class="btn btn-sm btn-solid" data-act="paid" data-code="' + esc(o.code) + '">Оплачено ✓</button>' : '<button type="button" class="btn btn-sm btn-ghost" data-act="new" data-code="' + esc(o.code) + '">Вернуть в ожидание</button>') +
          (o.status !== "cancelled" ? '<button type="button" class="btn btn-sm btn-ghost" data-act="cancelled" data-code="' + esc(o.code) + '">Отменить</button>' : "") +
          '<a class="btn btn-sm btn-ghost" target="_blank" rel="noopener" href="' + esc(link) + '">Страница заказа</a>' +
          '<a class="btn btn-sm btn-ghost" href="admin.html?order=' + esc(o.code) + '">Изменить</a>' +
        "</div></article>";
    }).join("") : '<p class="muted center">Заказов нет.</p>';
  }

  function load() {
    return O.list().then(function (r) { all = r || []; render(); }).catch(function () { toast("Не удалось загрузить заказы"); });
  }
  function loadPrices() {
    O.prices().then(function (p) { if (p) { $("pSite").value = p.site; $("pVideo").value = p.video; $("pBoth").value = p.both; } }).catch(function () {});
  }

  $("oaList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act"), code = b.getAttribute("data-code");
    if (act === "cancelled" && !confirm("Отменить заказ №" + code.toUpperCase() + "?")) return;
    b.disabled = true;
    O.setStatus(code, act).then(function () { toast(act === "paid" ? "Отмечено: оплачено ✓" : "Готово"); return load(); }).catch(function () { toast("Ошибка. Попробуйте ещё раз."); b.disabled = false; });
  });
  $("oaFilter").addEventListener("click", function (e) {
    var c = e.target.closest("[data-f]"); if (!c) return; filter = c.getAttribute("data-f");
    this.querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("on", x === c); }); render();
  });
  $("btnRefresh").addEventListener("click", function () { load().then(function () { toast("Обновлено"); }); });
  $("btnPrices").addEventListener("click", function () {
    var p = { site: parseInt($("pSite").value, 10), video: parseInt($("pVideo").value, 10), both: parseInt($("pBoth").value, 10) };
    if (!(p.site > 0 && p.video > 0 && p.both > 0)) { $("pMsg").textContent = "Впишите три цены (числа больше нуля)."; return; }
    O.setPrices(p).then(function () { $("pMsg").textContent = "Цены сохранены ✓"; }).catch(function () { $("pMsg").textContent = "Не удалось сохранить."; });
  });

  // ---------- Кирүү ----------
  function open() { document.body.classList.remove("gated"); $("gate").hidden = true; load(); loadPrices(); setInterval(load, 45000); }
  function showGate(msg) {
    var form = $("gateForm"), err = $("gateErr");
    if (msg) { err.textContent = msg; err.hidden = false; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("gatePin").value.trim(), btn = form.querySelector("button"); btn.disabled = true;
      O.adminCheck(v).then(function (ok) { if (ok) { O.saveSecret(v); open(); } else { err.textContent = "Неверный код"; err.hidden = false; $("gatePin").value = ""; $("gatePin").focus(); } })
        .catch(function () { err.textContent = "Нет связи с сервером."; err.hidden = false; }).then(function () { btn.disabled = false; });
    });
    $("gatePin").focus();
  }
  if (!O || !O.enabled()) { showGate("Сервер заказов не настроен."); }
  else if (O.secret()) O.adminCheck(O.secret()).then(function (ok) { if (ok) open(); else { O.forgetSecret(); showGate(); } }).catch(function () { showGate("Нет связи с сервером."); });
  else showGate();
})();
