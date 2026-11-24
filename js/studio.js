// Студия: өз шаблондорун жасоо жана музыка китепканасы (админ коду менен гана)
(function () {
  "use strict";
  var O = window.Orders, Sc = window.Scenes, P = window.Photos;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function toast(msg) { var t = document.querySelector(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); } t.textContent = msg; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 1800); }

  var TYPES = [["uylonuu", "Үйлөнүү той"], ["kyz-uzatuu", "Кыз узатуу"], ["nikah", "Ныке кыюу"], ["sunnot", "Сүннөт той"], ["beshik", "Бешик той"], ["tushoo", "Тушоо кесүү"], ["yubiley", "Юбилей"], ["tuulgan-kun", "Туулган күн"], ["kuda", "Куда түшүү"]];
  var SLOT = { sky: "Асман", m: "Тоолор", water: "Суу", tree: "Дарак", stone: "Таш", bal: "Корпус", balSh: "Көлөкө", glow: "Жарык", p: "Тоо", sun: "Күн", bg: "Фон", snow: "Кар", grass: "Чөп", hill: "Дөбө", ridge: "Тоо", petal: "Гүл", flower: "Гүл", wood: "Бутак", yw: "Боз үй", yr: "Үстү", yb: "Кемер", yd: "Эшик", moon: "Ай", heart: "Жүрөк", edge: "Чек", ribbon: "Кадак", arch: "Арка", fig: "Фигура", line: "Сызык", shadow: "Көлөкө", main: "Гүл 1", acc: "Гүл 2", cols: "" };
  function slotLabel(path) { var parts = path.split("."); var out = []; parts.forEach(function (k) { if (k === "pal" || k === "fl") return; if (/^\d+$/.test(k)) { out.push(String(+k + 1)); return; } var w = SLOT[k]; if (w === "") return; out.push(w || k); }); return out.join(" ") || path; }

  var cur = { id: "", base: "", ov: {}, slots: [] };
  var all = [];

  // ---------- Шаблон формасы ----------
  function fillSelects() {
    $("tBase").innerHTML = Sc.builtin.map(function (id) { return '<option value="' + id + '">' + esc(Sc.themes[id].name) + "</option>"; }).join("");
    $("tFont").innerHTML = Sc.fonts.map(function (f) { return '<option value="' + esc(f) + '" style="font-family:\'' + esc(f) + '\'">' + esc(f) + "</option>"; }).join("");
    $("tTypes").innerHTML = TYPES.map(function (t) { return '<label><input type="checkbox" value="' + t[0] + '"><span>' + t[1] + "</span></label>"; }).join("");
  }
  function loadBase(baseId, keep) {
    var t = Sc.themes[baseId]; if (!t) return;
    cur.base = baseId;
    if (!keep) {
      $("tFont").value = t.font; $("tItal").checked = !!t.ital; $("tUpper").checked = !!t.upper;
      $("cBg").value = t.bg; $("cInk").value = t.ink; $("cAccent").value = t.accent;
      $("cPaper").value = t.bg; $("cLining").value = t.bg; $("cSeal").value = t.accent; $("envOn").checked = false;
      cur.ov = {};
      Array.prototype.forEach.call($("tTypes").querySelectorAll("input"), function (i) { i.checked = t.types.indexOf(i.value) > -1; });
    }
    cur.slots = Sc.colorSlots(baseId);
    $("slotBox").innerHTML = cur.slots.map(function (s, i) {
      var v = cur.ov[s.path] || s.val;
      return '<label>' + esc(slotLabel(s.path)) + ' <input type="color" data-i="' + i + '" value="' + v + '"></label>';
    }).join("");
  }
  function config() {
    var ov = {}; Array.prototype.forEach.call($("slotBox").querySelectorAll("input"), function (inp) {
      var s = cur.slots[+inp.getAttribute("data-i")]; if (s && inp.value.toLowerCase() !== s.val.toLowerCase()) ov[s.path] = inp.value;
    });
    var types = Array.prototype.filter.call($("tTypes").querySelectorAll("input"), function (i) { return i.checked; }).map(function (i) { return i.value; });
    var c = { base: cur.base, ov: ov, bg: $("cBg").value, ink: $("cInk").value, accent: $("cAccent").value, font: $("tFont").value, ital: $("tItal").checked, upper: $("tUpper").checked, types: types.length ? types : ["uylonuu"], demo: (Sc.themes[cur.base] || {}).demo };
    if ($("envOn").checked) c.env = { paper: $("cPaper").value, lining: $("cLining").value, seal: $("cSeal").value };
    return c;
  }
  var showEnv = false, ptimer;
  function preview() { clearTimeout(ptimer); ptimer = setTimeout(function () {
    var c = config(), json = JSON.stringify({ name: $("tName").value || "Шаблон", base: c.base, ov: c.ov, bg: c.bg, ink: c.ink, accent: c.accent, font: c.font, ital: c.ital, upper: c.upper, types: c.types, env: c.env });
    var b64 = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_");
    var demo = c.demo || "demo";
    $("frame").src = "davet.html?id=" + demo + "&t=ct-preview&lang=ky" + (showEnv ? "" : "&preview=1") + "&ctpl=" + encodeURIComponent(b64);
  }, 350); }

  function resetForm() {
    cur.id = ""; $("tName").value = ""; $("stEditing").textContent = "";
    $("tBase").value = Sc.builtin[0]; loadBase(Sc.builtin[0], false); preview();
  }
  function editRow(r) {
    var c = r.config || {}; cur.id = r.id; $("stEditing").textContent = "· правка";
    $("tName").value = r.name; $("tBase").value = c.base; cur.ov = c.ov || {};
    loadBase(c.base, true);
    $("tFont").value = c.font || Sc.themes[c.base].font; $("tItal").checked = !!c.ital; $("tUpper").checked = !!c.upper;
    $("cBg").value = c.bg || Sc.themes[c.base].bg; $("cInk").value = c.ink || Sc.themes[c.base].ink; $("cAccent").value = c.accent || Sc.themes[c.base].accent;
    $("envOn").checked = !!c.env; if (c.env) { $("cPaper").value = c.env.paper || $("cPaper").value; $("cLining").value = c.env.lining || $("cLining").value; $("cSeal").value = c.env.seal || $("cSeal").value; }
    Array.prototype.forEach.call($("tTypes").querySelectorAll("input"), function (i) { i.checked = (c.types || []).indexOf(i.value) > -1; });
    preview(); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function slugify(s) { var TR = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "j", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ы: "y", э: "e", ю: "yu", я: "ya", ө: "o", ү: "u", ң: "n" };
    return String(s || "").toLowerCase().split("").map(function (c) { return TR[c] != null ? TR[c] : c; }).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 18); }
  function save() {
    var name = $("tName").value.trim(), msg = $("stMsg");
    if (!name) { msg.textContent = "Впишите название шаблона."; return; }
    var id = cur.id || ("ct-" + (slugify(name) || "tpl") + "-" + Math.random().toString(36).slice(2, 5));
    var c = config(); $("btnSave").disabled = true; msg.textContent = "Сохраняем…";
    O.templateSave(id, name, c).then(function () {
      Sc.register({ id: id, name: name, config: c }); Sc.flush(); try { localStorage.removeItem("samara-ctpl"); } catch (e) {}
      cur.id = id; $("stEditing").textContent = "· правка"; msg.textContent = "Сохранено ✓ Шаблон уже на сайте: «" + name + "»."; toast("Шаблон сохранён ✓"); return loadList();
    }).catch(function (e) { msg.textContent = /forbidden/.test(e.message) ? "Нет доступа — войдите заново." : "Не удалось сохранить: " + e.message; })
      .then(function () { $("btnSave").disabled = false; });
  }
  function loadList() {
    return O.templatesAll().then(function (rows) {
      all = rows || [];
      $("myList").innerHTML = all.length ? all.map(function (r) {
        var c = r.config || {}, th = Sc.themes[c.base] || {};
        return '<div class="st-row" data-id="' + esc(r.id) + '"><span class="st-sw" style="background:' + esc(c.bg || th.bg) + ";border-color:" + esc(c.accent || th.accent) + '"></span><b>' + esc(r.name) + "<small>" + (r.published ? "виден на сайте" : "скрыт") + "</small></b>" +
          '<button type="button" class="btn btn-sm btn-ghost" data-act="edit">Изменить</button><button type="button" class="btn btn-sm btn-ghost" data-act="pub">' + (r.published ? "Скрыть" : "Показать") + '</button><button type="button" class="btn btn-sm btn-ghost" data-act="del">✕</button></div>';
      }).join("") : '<p class="hint">Пока нет своих шаблонов. Создайте первый слева.</p>';
    }).catch(function () { $("myList").innerHTML = '<p class="hint">Не удалось загрузить.</p>'; });
  }
  $("myList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b) return; var row = b.closest(".st-row"), id = row.getAttribute("data-id"), r = all.filter(function (x) { return x.id === id; })[0];
    if (b.getAttribute("data-act") === "edit") editRow(r);
    else if (b.getAttribute("data-act") === "pub") O.templatePublish(id, !r.published).then(function () { try { localStorage.removeItem("samara-ctpl"); } catch (e) {} toast(r.published ? "Скрыт" : "Показан"); loadList(); });
    else if (b.getAttribute("data-act") === "del") { if (confirm("Удалить шаблон «" + r.name + "»? Приглашения, уже сделанные с ним, потеряют оформление.")) O.templateDelete(id).then(function () { try { localStorage.removeItem("samara-ctpl"); } catch (e) {} toast("Удалён"); if (cur.id === id) resetForm(); loadList(); }); }
  });
  ["tName", "tFont", "tItal", "tUpper", "cBg", "cInk", "cAccent", "cPaper", "cLining", "cSeal", "envOn"].forEach(function (id) { $(id).addEventListener("input", preview); $(id).addEventListener("change", preview); });
  $("tTypes").addEventListener("change", preview);
  $("slotBox").addEventListener("input", preview);
  $("tBase").addEventListener("change", function () { loadBase($("tBase").value, false); preview(); });
  $("btnSave").addEventListener("click", save);
  $("btnNew").addEventListener("click", resetForm);
  var be = document.createElement("button"); be.type = "button"; be.className = "btn btn-sm btn-ghost"; be.textContent = "Показать конверт"; be.addEventListener("click", function () { showEnv = !showEnv; be.textContent = showEnv ? "Показать приглашение" : "Показать конверт"; preview(); });
  $("phoneWrap").parentNode.insertBefore(be, $("phoneWrap").nextSibling);

  // ---------- Музыка ----------
  var songs = [], fileUrl = "";
  function loadSongs() {
    return O.songsList().then(function (rows) {
      songs = rows || []; $("sCount").textContent = songs.length ? "(" + songs.length + ")" : "";
      $("songList").innerHTML = songs.length ? songs.map(function (s) {
        return '<div class="st-row" data-id="' + esc(s.id) + '"><b>' + esc(s.title) + "<small>" + esc([s.artist, s.category, s.lang].filter(Boolean).join(" · ")) + '</small></b><audio controls preload="none" src="' + esc(s.url) + '"></audio><button type="button" class="btn btn-sm btn-ghost" data-act="del">✕</button></div>';
      }).join("") : '<p class="hint">Библиотека пуста. Добавьте первую песню.</p>';
    }).catch(function () {});
  }
  $("songList").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act=del]"); if (!b) return; var id = b.closest(".st-row").getAttribute("data-id");
    if (confirm("Удалить песню из библиотеки?")) O.songDelete(id).then(function () { toast("Удалено"); loadSongs(); });
  });
  $("sFile").addEventListener("change", function () {
    var f = this.files && this.files[0]; if (!f) return; var bar = $("sBar"), nm = $("sFileName");
    if (!P || !P.enabled()) { nm.textContent = "Загрузка файлов не настроена."; return; }
    bar.hidden = false; bar.firstElementChild.style.width = "0%"; nm.textContent = "Загружаем " + f.name + "…";
    P.music(f, function (p) { bar.firstElementChild.style.width = Math.round(p * 100) + "%"; }).then(function (url) {
      fileUrl = url; nm.textContent = "Загружено ✓ " + f.name; bar.hidden = true; if (!$("sTitle").value) $("sTitle").value = f.name.replace(/\.[^.]+$/, "");
    }).catch(function (er) { bar.hidden = true; nm.textContent = er.message === "format" ? "Нужен mp3, m4a или aac." : er.message === "size" ? "Файл больше " + (er.maxMB || 8) + " МБ." : "Не удалось загрузить."; });
  });
  $("btnSong").addEventListener("click", function () {
    var url = fileUrl || $("sUrl").value.trim(), title = $("sTitle").value.trim(), m = $("sMsg");
    if (!title) { m.textContent = "Впишите название песни."; return; }
    if (!/^https:\/\//.test(url)) { m.textContent = "Выберите файл или вставьте ссылку https://…"; return; }
    $("btnSong").disabled = true; m.textContent = "Сохраняем…";
    O.songAdd(title, $("sArtist").value, $("sLang").value, $("sCat").value, url).then(function () {
      m.textContent = "Добавлено ✓"; fileUrl = ""; $("sFileName").textContent = ""; ["sTitle", "sArtist", "sUrl"].forEach(function (i) { $(i).value = ""; }); $("sFile").value = ""; return loadSongs();
    }).catch(function (er) { m.textContent = "Не удалось сохранить: " + er.message; }).then(function () { $("btnSong").disabled = false; });
  });

  // ---------- Табтар ----------
  $("stTabs").addEventListener("click", function (e) {
    var c = e.target.closest("[data-tab]"); if (!c) return; var tab = c.getAttribute("data-tab");
    Array.prototype.forEach.call(this.querySelectorAll(".chip"), function (x) { x.classList.toggle("on", x === c); });
    $("tabTpl").hidden = tab !== "tpl"; $("tabMusic").hidden = tab !== "music";
  });

  // ---------- Кирүү ----------
  function open() { document.body.classList.remove("gated"); $("gate").hidden = true; fillSelects(); resetForm(); loadList(); loadSongs(); }
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
  Sc.ready.then(function () {
    if (!O || !O.enabled()) showGate("Сервер не настроен.");
    else if (O.secret()) O.adminCheck(O.secret()).then(function (ok) { if (ok) open(); else { O.forgetSecret(); showGate(); } }).catch(function () { showGate("Нет связи с сервером."); });
    else showGate();
  });
})();
