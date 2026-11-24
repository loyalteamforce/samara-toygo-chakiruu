// Конвертти жасоочу (студия жана «Свой стиль» үчүн бирдей)
(function () {
  "use strict";
  var P = window.Photos;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var OPT = {
    pattern: [["lattice", "Ромбы"], ["stripes", "Полоски"], ["dots", "Точки"], ["none", "Без узора"]],
    frame: [["full", "Полная: узор и уголки"], ["simple", "Простая линия"], ["none", "Без рамки"]],
    sealShape: [["round", "Круглая"], ["scallop", "Зубчатая"], ["diamond", "Ромб"], ["heart", "Сердце"]]
  };
  function sel(k, label) { return '<label>' + label + '<select data-k="' + k + '">' + OPT[k].map(function (o) { return '<option value="' + o[0] + '">' + o[1] + "</option>"; }).join("") + "</select></label>"; }
  function up(k, label) { return '<div class="ee-up" data-up="' + k + '"><span class="ee-t">' + label + '</span><div class="ee-row"><label class="btn btn-sm btn-ghost">Загрузить<input type="file" accept="image/*" hidden></label><button type="button" class="btn btn-sm btn-ghost ee-x" hidden>Убрать</button><img class="ee-th" alt="" hidden></div><small class="ee-st"></small></div>'; }

  function mount(el, onChange, opts) {
    opts = opts || {};
    el.classList.add("ee");
    el.innerHTML =
      '<div class="st-colors"><label>Бумага <input type="color" data-k="paper"></label><label>Подкладка <input type="color" data-k="lining"></label><label>Печать <input type="color" data-k="seal"></label><label>Кисточки <input type="color" data-k="tassel"></label></div>' +
      '<div class="row2">' + sel("pattern", "Узор подкладки") + sel("frame", "Рамка") + "</div>" +
      '<div class="row2">' + sel("sealShape", "Форма печати") + '<label>Буквы на печати <small>(до 3, пусто — инициалы)</small><input data-k="sealText" maxlength="3" placeholder="С&amp;Н"></label></div>' +
      up("sealImg", "Свой логотип на печати (вместо букв)") + up("paperImg", "Своя картинка на бумаге конверта") + up("bgImg", "Фон за конвертом (фото)") +
      '<label>Подпись под конвертом <input data-k="hint" maxlength="40" placeholder="Нажмите на печать"></label>' +
      '<div class="row2"><label class="chk"><input type="checkbox" data-k="tassels"> Кисточки</label><label class="chk"><input type="checkbox" data-k="sweep"> Шёлк при открытии</label></div>';
    var urls = {}, refs = {};
    Array.prototype.forEach.call(el.querySelectorAll('[data-k]'), function (i) { refs[i.getAttribute('data-k')] = i; });
    var colorRow = el.querySelector('.st-colors'), colorEls = colorRow ? Array.prototype.slice.call(colorRow.children) : [];
    if (opts.palette && colorRow) colorRow.remove();
    function fire() { if (onChange) onChange(); }
    function q(k) { return refs[k]; }
    function showUp(k) {
      var box = el.querySelector('[data-up="' + k + '"]'), im = box.querySelector(".ee-th"), x = box.querySelector(".ee-x");
      im.hidden = !urls[k]; x.hidden = !urls[k]; if (urls[k]) im.src = urls[k];
    }
    el.addEventListener("input", fire); el.addEventListener("change", function (e) { if (!e.target.matches('input[type="file"]')) fire(); });
    Array.prototype.forEach.call(el.querySelectorAll("[data-up]"), function (box) {
      var k = box.getAttribute("data-up"), st = box.querySelector(".ee-st");
      box.querySelector('input[type="file"]').addEventListener("change", function () {
        var f = this.files && this.files[0]; if (!f) return;
        if (!P || !P.enabled()) { st.textContent = "Загрузка не настроена."; return; }
        st.textContent = "Загружаем…";
        P.add(f).then(function (u) { urls[k] = u; st.textContent = ""; showUp(k); fire(); }).catch(function () { st.textContent = "Не удалось загрузить."; });
      });
      box.querySelector(".ee-x").addEventListener("click", function () { delete urls[k]; showUp(k); fire(); });
    });
    return {
      colorEls: function () { return colorEls; },
      set: function (e, def) {
        e = e || {}; def = def || {};
        ["paper", "lining", "seal", "tassel"].forEach(function (k) { q(k).value = e[k] || def[k] || "#888888"; });
        ["pattern", "frame", "sealShape"].forEach(function (k) { q(k).value = e[k] || OPT[k][0][0]; });
        q("sealText").value = e.sealText || ""; q("hint").value = e.hint || "";
        q("tassels").checked = e.tassels !== false; q("sweep").checked = e.sweep !== false;
        urls = {}; ["sealImg", "paperImg", "bgImg"].forEach(function (k) { if (e[k]) urls[k] = e[k]; showUp(k); });
      },
      get: function () {
        var o = { paper: q("paper").value, lining: q("lining").value, seal: q("seal").value, tassel: q("tassel").value, pattern: q("pattern").value, frame: q("frame").value, sealShape: q("sealShape").value, tassels: q("tassels").checked, sweep: q("sweep").checked };
        if (q("sealText").value.trim()) o.sealText = q("sealText").value.trim().slice(0, 3);
        if (q("hint").value.trim()) o.hint = q("hint").value.trim().slice(0, 40);
        Object.keys(urls).forEach(function (k) { o[k] = urls[k]; });
        return o;
      }
    };
  }
  window.EnvEdit = { mount: mount };
})();
