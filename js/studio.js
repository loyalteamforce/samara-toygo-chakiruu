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

  var cur = { id: "", base: "" };
  var showEnv = false, ptimer;
  var SE = window.StyleEdit.mount($("styEd"), function () { preview(); });
  $("styEd").addEventListener("focusin", function (e) { showEnv = !!(e.target.closest(".sy-env") || e.target.matches('.pal [data-k]')); });
  $("tName").addEventListener("focus", function () { showEnv = false; });
  var all = [];

  // ---------- Шаблон формасы ----------
  function fillSelects() {
    $("tBase").innerHTML = Sc.builtin.map(function (id) { return '<option value="' + id + '">' + esc(Sc.themes[id].name) + "</option>"; }).join("");
    $("tTypes").innerHTML = TYPES.map(function (t) { return '<label><input type="checkbox" value="' + t[0] + '"><span>' + t[1] + "</span></label>"; }).join("");
  }
  function setTypes(arr) { Array.prototype.forEach.call($("tTypes").querySelectorAll("input"), function (i) { i.checked = arr.indexOf(i.value) > -1; }); }
  function loadBase(baseId) {
    var t = Sc.themes[baseId]; if (!t) return;
    cur.base = baseId; SE.setBase(baseId, t); setTypes(t.types);
  }
  function config() {
    var c = SE.get();
    var types = Array.prototype.filter.call($("tTypes").querySelectorAll("input"), function (i) { return i.checked; }).map(function (i) { return i.value; });
    c.types = types.length ? types : ["uylonuu"]; c.demo = (Sc.themes[cur.base] || {}).demo;
    return c;
  }
  function preview() { clearTimeout(ptimer); ptimer = setTimeout(function () {
    var c = config(), o = {}; Object.keys(c).forEach(function (k) { o[k] = c[k]; }); o.name = $("tName").value || "Шаблон";
    var b64 = btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_");
    $("frame").src = "davet.html?id=" + (c.demo || "demo") + "&t=ct-preview&lang=ky" + (showEnv ? "" : "&preview=1") + "&ctpl=" + encodeURIComponent(b64);
  }, 350); }

  function resetForm() {
    cur.id = ""; $("tName").value = ""; $("stEditing").textContent = "";
    $("tBase").value = Sc.builtin[0]; loadBase(Sc.builtin[0]); preview();
  }
  function editRow(r) {
    var c = r.config || {}; cur.id = r.id; $("stEditing").textContent = "· правка";
    $("tName").value = r.name; $("tBase").value = c.base; cur.base = c.base;
    SE.set(c, c.base); setTypes(c.types || []);
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
  $("tName").addEventListener("input", preview);
  $("tTypes").addEventListener("change", preview);
  $("tBase").addEventListener("change", function () { loadBase($("tBase").value); preview(); });
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
  function titleOf(f) { return f.name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").trim(); }
  function logLine(txt, cls) { var r = document.createElement("div"); r.className = "s-row" + (cls ? " " + cls : ""); r.textContent = txt; $("sFileName").appendChild(r); return r; }
  $("sFile").addEventListener("change", function () {
    var files = Array.prototype.slice.call(this.files || []); if (!files.length) return; this.value = "";
    var bar = $("sBar"), box = $("sFileName"); box.innerHTML = "";
    if (!P || !P.enabled()) { logLine("Загрузка файлов не настроена.", "bad"); return; }
    var multi = files.length > 1, ok = 0, i = 0;
    bar.hidden = false;
    function next() {
      if (i >= files.length) { bar.hidden = true; if (multi) { logLine("Готово: добавлено " + ok + " из " + files.length, ok === files.length ? "ok" : ""); loadSongs(); } return; }
      var f = files[i++], row = logLine((multi ? i + "/" + files.length + " " : "") + f.name + " …");
      bar.firstElementChild.style.width = "0%";
      P.music(f, function (p) { bar.firstElementChild.style.width = Math.round(p * 100) + "%"; }, (window.SITE && window.SITE.storage && window.SITE.storage.maxLibMB) || 25).then(function (url) {
        if (!multi) { fileUrl = url; row.textContent = "Загружено: " + f.name; row.className = "s-row ok"; if (!$("sTitle").value) $("sTitle").value = titleOf(f); return; }
        return O.songAdd(titleOf(f), $("sArtist").value, $("sLang").value, $("sCat").value, url).then(function () { ok++; row.textContent = "Добавлено: " + f.name; row.className = "s-row ok"; });
      }).catch(function (er) {
        row.className = "s-row bad";
        row.textContent = f.name + ": " + (er.message === "format" ? "нужен mp3, m4a или aac" : er.message === "size" ? "файл больше " + (er.maxMB || 25) + " МБ" : "не удалось загрузить");
      }).then(next);
    }
    next();
  });
  $("btnSong").addEventListener("click", function () {
    var url = fileUrl || $("sUrl").value.trim(), title = $("sTitle").value.trim(), m = $("sMsg");
    if (!title) { m.textContent = "Впишите название песни."; return; }
    if (!/^https:\/\//.test(url)) { m.textContent = "Выберите файл или вставьте ссылку https://…"; return; }
    $("btnSong").disabled = true; m.textContent = "Сохраняем…";
    O.songAdd(title, $("sArtist").value, $("sLang").value, $("sCat").value, url).then(function () {
      m.textContent = "Добавлено ✓"; fileUrl = ""; $("sFileName").innerHTML = ""; ["sTitle", "sArtist", "sUrl"].forEach(function (i) { $(i).value = ""; }); $("sFile").value = ""; return loadSongs();
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
