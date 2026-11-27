// Стиль жасоочу: арка фон (сүрөт/түс/фото), кичине палитра, шрифт, конверт (студия жана «Свой стиль» үчүн бирдей)
(function () {
  "use strict";
  var Sc = window.Scenes, P = window.Photos;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var SLOT = { sky: "Асман", m: "Тоо", water: "Суу", tree: "Дарак", stone: "Таш", bal: "Перила", balSh: "Көлөкө", glow: "Жарык", p: "Тоо", sun: "Күн", bg: "Фон", snow: "Кар", grass: "Чөп", hill: "Дөбө", ridge: "Тоо", petal: "Гүл", flower: "Гүл", wood: "Бутак", yw: "Боз үй", yr: "Үстү", yb: "Кемер", yd: "Эшик", moon: "Ай", heart: "Жүрөк", edge: "Чек", ribbon: "Кадак", arch: "Арка", fig: "Фигура", line: "Сызык", shadow: "Көлөкө", main: "Гүл", acc: "Гүл 2", cols: "", dust: "" };
  function slotLabel(path) { var out = []; path.split(".").forEach(function (k) { if (k === "pal" || k === "fl") return; if (/^\d+$/.test(k)) { out.push(String(+k + 1)); return; } var w = SLOT[k]; if (w === "") return; out.push(w || k); }); return out.join(" ") || path; }

  function mount(el, onChange) {
    var RID = Math.random().toString(36).slice(2, 6);
    el.classList.add("sy");
    el.innerHTML =
      '<div class="row2"><label>Шрифт имён <select data-s="font"></select></label><div class="sy-chks"><label class="chk"><input type="checkbox" data-s="ital"> Курсив</label><label class="chk"><input type="checkbox" data-s="upper"> ЗАГЛАВНЫЕ</label></div></div>' +
      '<p class="cs-t">Фон приглашения</p>' +
      '<div class="seg sy-seg" data-s="bgMode"><label><input type="radio" name="sybg' + RID + '" value="scene" checked><span>Рисунок</span></label><label><input type="radio" name="sybg' + RID + '" value="color"><span>Цвет</span></label><label><input type="radio" name="sybg' + RID + '" value="photo"><span>Фото</span></label><label><input type="radio" name="sybg' + RID + '" value="video"><span>Видео</span></label></div>' +
      '<div class="sy-p" data-p="color" hidden><label class="chk"><input type="checkbox" data-s="grad"> Градиент (второй цвет фона)</label></div>' +
      '<div class="sy-p" data-p="photo" hidden><div class="ee-up" data-up="bgImg"><span class="ee-t">Фото для фона приглашения и видео</span><div class="ee-row"><label class="btn btn-sm btn-ghost">Загрузить фото<input type="file" accept="image/*" hidden></label><button type="button" class="btn btn-sm btn-ghost ee-x" hidden>Убрать</button><img class="ee-th" alt="" hidden></div><small class="ee-st"></small></div></div>' +
      '<div class="sy-p" data-p="video" hidden><div class="ee-up" data-up="bgVideo"><span class="ee-t">Видео для фона (mp4 или webm, до 20 МБ, лучше 5–15 секунд). Играет без звука по кругу.</span><div class="ee-row"><label class="btn btn-sm btn-ghost">Загрузить видео<input type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.mov,.webm" hidden></label><button type="button" class="btn btn-sm btn-ghost ee-x" hidden>Убрать</button><video class="ee-th" muted playsinline preload="metadata" hidden></video></div><small class="ee-st"></small></div></div>' +
      '<div class="sy-p" data-p="dim" hidden><label>Затемнение фона <input type="range" min="0" max="85" step="5" data-s="bgDim" value="30"></label></div>' +
      '<p class="cs-t">Цвет текста</p>' +
      '<div class="sy-presets"><button type="button" class="chip" data-preset="#ffffff">Весь текст белый</button><button type="button" class="chip" data-preset="#1a1a1a">Весь текст чёрный</button><button type="button" class="chip" data-preset="#e8c56a">Весь текст золотой</button></div>' +
      '<div class="pal" data-s="tpal"></div>' +
      '<label>Тень под текстом <select data-s="tsh"><option value="">Автоматически</option><option value="none">Без тени</option><option value="light">Светлая</option><option value="dark">Тёмная</option></select></label>' +
      '<p class="cs-t">Цвета</p><div class="pal" data-s="pal"></div>' +
      '<details class="sy-env"><summary>Конверт: форма, узор, мөөр, фото</summary><div data-s="envHost"></div></details>';
    var q = function (k) { return el.querySelector('[data-s="' + k + '"]'); };
    q("font").innerHTML = Sc.fonts.map(function (f) { return '<option value="' + esc(f) + '">' + esc(f) + "</option>"; }).join("");
    var pal = q("pal"), tpal = q("tpal"), base = "", slots = [], envDirty = false, bgImg = "", bgVideo = "", theme0 = null, touched = {};
    var swatches = {};   // key -> input
    function fire() { vis(); if (onChange) onChange(); }
    function sw(key, label) {
      var l = document.createElement("label"); l.className = "sw"; l.title = label;
      l.innerHTML = '<input type="color" data-c="' + key + '" value="#888888"><i>' + esc(label) + "</i>";
      swatches[key] = l.querySelector("input"); return l;
    }
    var ee = window.EnvEdit.mount(q("envHost"), function () { envDirty = true; fire(); }, { palette: true });
    function build(baseId) {
      base = baseId; slots = Sc.colorSlots(baseId); swatches = {}; pal.innerHTML = "";
      tpal.innerHTML = "";
      [["ink", "Имена"], ["td", "Дата и цифры"], ["ts", "Надписи"]].forEach(function (k) { tpal.appendChild(sw(k[0], k[1])); });
      [["bg", "Фон"], ["bg2", "Фон 2"], ["accent", "Акцент и линии"]].forEach(function (k) { pal.appendChild(sw(k[0], k[1])); });
      ee.colorEls().forEach(function (l, i) { l.classList.add("sw"); var inp = l.querySelector("input"); var t = l.textContent.trim(); l.innerHTML = ""; l.appendChild(inp); var it = document.createElement("i"); it.textContent = t; l.appendChild(it); l.title = t; pal.appendChild(l); });
      slots.forEach(function (s, i) { var l = sw("s" + i, slotLabel(s.path)); pal.appendChild(l); });
    }
    function vis() {
      var m = mode();
      el.querySelector('[data-p="color"]').hidden = m !== "color"; el.querySelector('[data-p="photo"]').hidden = m !== "photo";
      el.querySelector('[data-p="video"]').hidden = m !== "video"; el.querySelector('[data-p="dim"]').hidden = !(m === "photo" || m === "video");
      swatches.bg2 && (swatches.bg2.parentNode.hidden = !(m === "color" && q("grad").checked));
    }
    function mode() { var r = q("bgMode").querySelector("input:checked"); return r ? r.value : "scene"; }
    function showImg() { var box = el.querySelector('[data-up="bgImg"]'), im = box.querySelector(".ee-th"), x = box.querySelector(".ee-x"); im.hidden = !bgImg; x.hidden = !bgImg; if (bgImg) im.src = bgImg; }
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-preset]"); if (!b) return; var v = b.getAttribute("data-preset");
      swatches.ink.value = v; swatches.td.value = v; swatches.ts.value = v; touched.td = true; touched.ts = true; fire();
    });
    el.addEventListener("input", function (e) {
      if (e.target.matches('[data-c="td"]')) touched.td = true; if (e.target.matches('[data-c="ts"]')) touched.ts = true; if (e.target.matches('input[type="file"]')) return; if (e.target.closest(".sy-env") && !e.target.matches("[data-c]")) return; if (e.target.matches('[data-k="paper"],[data-k="lining"],[data-k="seal"],[data-k="tassel"]')) envDirty = true; fire(); });
    el.addEventListener("change", function (e) { if (e.target.matches('input[type="file"]')) return; fire(); });
    // палитранын ичиндеги конверт түстөрү ee ичинде эмес болгондуктан өзүнчө байлайбыз
    var upBox = el.querySelector('[data-up="bgImg"]');
    upBox.querySelector('input[type="file"]').addEventListener("change", function () {
      var f = this.files && this.files[0], st = upBox.querySelector(".ee-st"); if (!f) return;
      if (!P || !P.enabled()) { st.textContent = "Загрузка не настроена."; return; }
      st.textContent = "Загружаем…"; P.add(f).then(function (u) { bgImg = u; st.textContent = ""; showImg(); fire(); }).catch(function () { st.textContent = "Не удалось загрузить."; });
    });
    upBox.querySelector(".ee-x").addEventListener("click", function () { bgImg = ""; showImg(); fire(); });
    var vBox = el.querySelector('[data-up="bgVideo"]');
    function showVid() { var th = vBox.querySelector(".ee-th"), x = vBox.querySelector(".ee-x"); th.hidden = !bgVideo; x.hidden = !bgVideo; if (bgVideo) th.src = bgVideo + "#t=0.5"; }
    vBox.querySelector('input[type="file"]').addEventListener("change", function () {
      var f = this.files && this.files[0], st = vBox.querySelector(".ee-st"); if (!f) return;
      if (!P || !P.video) { st.textContent = "Загрузка не настроена."; return; }
      st.textContent = "Загружаем видео…"; P.video(f, function (p) { st.textContent = "Загрузка " + Math.round(p * 100) + "%"; }).then(function (u) { bgVideo = u; st.textContent = ""; showVid(); fire(); })
        .catch(function (er) { st.textContent = er.message === "format" ? "Нужен mp4, mov или webm." : er.message === "size" ? "Видео больше " + (er.maxMB || 20) + " МБ. Сожмите его." : "Не удалось загрузить."; });
    });
    vBox.querySelector(".ee-x").addEventListener("click", function () { bgVideo = ""; showVid(); fire(); });

    function setDefaults(t) {
      theme0 = t;
      q("font").value = t.font; q("ital").checked = !!t.ital; q("upper").checked = !!t.upper; q("grad").checked = false; q("bgDim").value = 30;
      q("bgMode").querySelector('input[value="scene"]').checked = true; bgImg = ""; showImg();
      swatches.bg.value = t.bg; swatches.bg2.value = t.bg; swatches.ink.value = t.ink; swatches.accent.value = t.accent; swatches.td.value = t.accent; swatches.ts.value = t.accent; touched = {}; q("tsh").value = ""; bgVideo = ""; showVid();
      envDirty = false; ee.set(null, { paper: t.bg, lining: t.accent, seal: t.accent, tassel: t.accent });
      slots.forEach(function (s, i) { swatches["s" + i].value = s.val; });
      vis();
    }
    return {
      // baseId — рисунок негизи; t — азыркы теманын маалыматы (түстөрдү баштапкы кылуу үчүн)
      setBase: function (baseId, t) { build(baseId); setDefaults(t || Sc.themes[baseId]); },
      set: function (cfg, baseId) {
        cfg = cfg || {}; build(baseId); var t = Sc.themes[baseId]; setDefaults(t);
        if (cfg.font) q("font").value = cfg.font; q("ital").checked = !!cfg.ital; q("upper").checked = !!cfg.upper;
        if (/^#[0-9a-f]{6}$/i.test(cfg.bg || "")) swatches.bg.value = cfg.bg;
        if (/^#[0-9a-f]{6}$/i.test(cfg.ink || "")) swatches.ink.value = cfg.ink;
        if (/^#[0-9a-f]{6}$/i.test(cfg.accent || "")) swatches.accent.value = cfg.accent;
        if (/^#[0-9a-f]{6}$/i.test(cfg.td || "")) { swatches.td.value = cfg.td; touched.td = true; }
        if (/^#[0-9a-f]{6}$/i.test(cfg.ts || "")) { swatches.ts.value = cfg.ts; touched.ts = true; }
        q("tsh").value = cfg.tsh || "";
        if (cfg.bgVideo) { bgVideo = cfg.bgVideo; showVid(); }
        var m = ["color", "photo", "video"].indexOf(cfg.bgMode) > -1 ? cfg.bgMode : "scene";
        q("bgMode").querySelector('input[value="' + m + '"]').checked = true;
        if (cfg.bgColor2) { q("grad").checked = true; swatches.bg2.value = cfg.bgColor2; }
        if (cfg.bgImg) { bgImg = cfg.bgImg; showImg(); }
        if (cfg.bgDim != null) q("bgDim").value = cfg.bgDim;
        slots.forEach(function (s, i) { if (cfg.ov && cfg.ov[s.path]) swatches["s" + i].value = cfg.ov[s.path]; });
        if (cfg.env) { envDirty = true; var d = { paper: t.bg, lining: t.accent, seal: t.accent, tassel: t.accent }; ee.set(cfg.env, d); ["paper", "lining", "seal", "tassel"].forEach(function (k) { if (swatches[k]) swatches[k].value = cfg.env[k] || d[k]; }); }
        vis();
      },
      get: function () {
        var m = mode(), c = { base: base, bg: swatches.bg.value, ink: swatches.ink.value, accent: swatches.accent.value, font: q("font").value, ital: q("ital").checked, upper: q("upper").checked };
        var ov = {}; slots.forEach(function (s, i) { var v = swatches["s" + i].value; if (v.toLowerCase() !== s.val.toLowerCase()) ov[s.path] = v; }); c.ov = ov;
        if (m === "color") { c.bgMode = "color"; c.bgColor = swatches.bg.value; if (q("grad").checked) c.bgColor2 = swatches.bg2.value; }
        else if (m === "photo" && bgImg) { c.bgMode = "photo"; c.bgImg = bgImg; c.bgDim = +q("bgDim").value; }
        else if (m === "video" && bgVideo) { c.bgMode = "video"; c.bgVideo = bgVideo; c.bgDim = +q("bgDim").value; }
        if (touched.td) c.td = swatches.td.value; if (touched.ts) c.ts = swatches.ts.value; if (q("tsh").value) c.tsh = q("tsh").value;
        if (envDirty) c.env = ee.get();
        return c;
      }
    };
  }
  window.StyleEdit = { mount: mount };
})();
