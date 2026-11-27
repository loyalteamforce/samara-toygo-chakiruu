(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var PUBLIC = document.body.getAttribute("data-mode") === "public";   // create.html: клиенттер өзү чакыруу түзөт
  var O = window.Orders;
  var DRAFT_KEY = PUBLIC ? "samara-create-draft-v1" : "samara-admin-draft-v1";

  // ---------- Шаблоны текстов ----------
  var TYPES = [
    ["uylonuu", "Свадьба (үйлөнүү той)"], ["kyz-uzatuu", "Кыз узатуу"], ["nikah", "Никах (нике кыюу)"],
    ["sunnot", "Сүннөт той"], ["beshik", "Бешик той"], ["tushoo", "Тушоо кесүү"],
    ["yubiley", "Юбилей (мааракелик той)"], ["tuulgan-kun", "День рождения"], ["kuda", "Куда түшүү"]
  ];
  var HEAD = {
    ky: { "uylonuu": "Үйлөнүү тойго чакыруу", "kyz-uzatuu": "Кыз узатуу тойго чакыруу", "nikah": "Нике кыюу тоюна чакыруу", "sunnot": "Сүннөт тойго чакыруу", "beshik": "Бешик тойго чакыруу", "tushoo": "Тушоо кесүү тоюна чакыруу", "yubiley": "Мааракелик тойго чакыруу", "tuulgan-kun": "Туулган күнгө чакыруу", "kuda": "Куда түшүүгө чакыруу" },
    ru: { "uylonuu": "Приглашение на свадьбу", "kyz-uzatuu": "Приглашение на кыз узатуу", "nikah": "Приглашение на никах", "sunnot": "Приглашение на сүннөт той", "beshik": "Приглашение на бешик той", "tushoo": "Приглашение на тушоо кесүү", "yubiley": "Приглашение на юбилей", "tuulgan-kun": "Приглашение на день рождения", "kuda": "Приглашение на куда түшүү" }
  };
  var TEXT = {
    ky: "Кадырлуу коноктор!\nСиздерди үй-бүлөңүз менен тойубуздун салтанатына чакырабыз. Сиздердин катышууңуздар биз үчүн чоң кубаныч!",
    ru: "Дорогие гости!\nПриглашаем вас вместе с семьёй разделить с нами радость нашего праздника. Будем рады видеть вас!"
  };
  var PROG = {
    ky: [["17:00", "Конокторду тосуу", "Чай, фотозона"], ["18:00", "Жаштарды тосуу", "Беташар, бата"], ["19:00", "Салтанаттуу дасторкон", ""]],
    ru: [["17:00", "Встреча гостей", "Чай, фотозона"], ["18:00", "Встреча молодых", "Беташар, бата"], ["19:00", "Праздничный дастархан", ""]]
  };
  var WA_MSG = {
    ky: "Урматтуу {n}! Сизди тойубузга чакырабыз\n{l}",
    ru: "Уважаемый(ая) {n}! Приглашаем вас на наш той\n{l}"
  };

  var theme = "ak-kuu";
  var currentLink = "", videoLink = "", shortCode = "", longLink = "";
  var timer;

  // ---------- Заполнение статичных частей ----------
  $("type").innerHTML = TYPES.map(function (t) { return '<option value="' + t[0] + '">' + t[1] + "</option>"; }).join("");

  function renderThemes() {
    $("themes").innerHTML = S.templates.map(function (t) {
      return '<button type="button" class="th" data-theme="' + t.id + '" aria-pressed="' + (t.id === theme) + '" title="' + t.name + '">' +
        '<span class="th-sw" style="background:' + t.bg + ';color:' + t.ink + '"><b style="color:' + t.ink + '">' + t.name.slice(0, 1) + "&amp;" + t.name.slice(0, 1) + '</b><i style="background:' + t.accent + '"></i></span>' +
        '<span class="th-n">' + t.name + "</span></button>";
    }).join("");
  }
  renderThemes();
  window.addEventListener("scenes:templates", renderThemes);
  if (window.Scenes && window.Scenes.ready) window.Scenes.ready.then(function () { renderThemes(); if (typeof applyParams === "function" && PUBLIC) applyParams(); });

  function setTheme(id) {
    theme = id;
    if (typeof csBuild === "function") { try { csBuild(); } catch (e) {} }
    document.querySelectorAll(".th").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-theme") === id); });
  }

  function lang() { return document.querySelector('input[name=lang]:checked').value; }

  // ---------- Программа ----------
  function addRow(time, title, note) {
    var r = document.createElement("div");
    r.className = "prow";
    r.innerHTML = '<input class="pt" type="time" aria-label="Время"><input class="pl" maxlength="50" placeholder="Название" aria-label="Название"><input class="pn" maxlength="50" placeholder="Пояснение" aria-label="Пояснение"><button type="button" class="x" aria-label="Удалить">×</button>';
    r.querySelector(".pt").value = time || "";
    r.querySelector(".pl").value = title || "";
    r.querySelector(".pn").value = note || "";
    $("programList").appendChild(r);
  }
  function setProgram(rows) { $("programList").innerHTML = ""; rows.forEach(function (x) { addRow(x[0], x[1], x[2]); }); }
  function getProgram() {
    return Array.prototype.map.call($("programList").children, function (r) {
      return { time: r.querySelector(".pt").value, title: r.querySelector(".pl").value.trim(), note: r.querySelector(".pn").value.trim() };
    }).filter(function (p) { return p.title; }).map(function (p) { if (!p.note) delete p.note; return p; });
  }
  function programIsPreset() {
    var cur = JSON.stringify(Array.prototype.map.call($("programList").children, function (r) { return [r.querySelector(".pt").value, r.querySelector(".pl").value, r.querySelector(".pn").value]; }));
    return !$("programList").children.length || cur === JSON.stringify(PROG.ky) || cur === JSON.stringify(PROG.ru);
  }

  // ---------- Предустановки (не затирают то, что ввёл человек) ----------
  function isPreset(val, group) {
    val = val.trim();
    if (!val) return true;
    return ["ky", "ru"].some(function (l) {
      var g = group === "head" ? HEAD[l] : null;
      return group === "head" ? Object.keys(g).some(function (k) { return g[k] === val; }) : TEXT[l] === val;
    });
  }
  function applyPresets(force) {
    var l = lang(), t = $("type").value;
    if (force || isPreset($("heading").value, "head")) $("heading").value = HEAD[l][t];
    if (force || isPreset($("text").value, "text")) $("text").value = TEXT[l];
    if (force || programIsPreset()) setProgram(PROG[l]);
  }

  // ---------- Сбор данных ----------

  // ---------- Өз стили (түстөр, фон, шрифт, конверт) ----------
  var Sc = window.Scenes;
  var csSE = $("csStyle") && window.StyleEdit ? window.StyleEdit.mount($("csStyle"), function () { schedule(); }) : null;
  function csBase() { var t = Sc && Sc.themes[theme]; return t ? (t._base || theme) : ""; }
  function csOk() { return !!csSE && !!csBase() && Sc.builtin.indexOf(csBase()) > -1; }
  function csBuild() {
    var box = $("csBox"); if (!box) return;
    box.hidden = !csOk();
    if (!csOk()) { $("csOn").checked = false; return; }
    if (!$("csOn").checked) csSE.setBase(csBase(), Sc.themes[theme]);
  }
  function csCollect() {
    if (!$("csBox") || !$("csOn").checked || !csOk()) return null;
    var c = csSE.get(); c.types = (Sc.themes[theme] || {}).types || ["uylonuu"]; return c;
  }
  function csFill(cs) {
    if (!$("csBox")) return;
    csBuild();
    if (!cs || !csOk()) { $("csOn").checked = false; return; }
    $("csOn").checked = true; csSE.set(cs, csBase());
  }
  if ($("csOn")) $("csOn").addEventListener("change", function () { if (this.checked && csOk()) csSE.setBase(csBase(), Sc.themes[theme]); });


  // ---------- Өлчөм жана жайгашуу ----------
  var LAY = [["layN", "n", 100], ["layD", "d", 100], ["layY", "y", 0], ["layZ", "z", 100], ["layFx", "fx", 50], ["layFy", "fy", 50], ["layDim", "dim", 100]];
  function layOut() { LAY.forEach(function (r) { var el = $(r[0]); if (!el) return; var o = el.parentNode.querySelector("output"); if (o) o.textContent = el.value + (r[1] === "y" ? "" : "%"); }); }
  function layCollect() { var o = {}; LAY.forEach(function (r) { var el = $(r[0]); if (el && +el.value !== r[2]) o[r[1]] = +el.value; }); return Object.keys(o).length ? o : null; }
  function layFill(l) { l = l || {}; LAY.forEach(function (r) { var el = $(r[0]); if (el) el.value = l[r[1]] != null ? l[r[1]] : r[2]; }); layOut(); }
  if ($("layBox")) { $("layBox").addEventListener("input", layOut); $("layReset").addEventListener("click", function () { layFill(null); schedule(); }); layOut(); }

  // WhatsApp номерин тууралоо: 0550... же 550... же +996... → 996550...
  function waNorm(v) { var d = String(v || "").replace(/\D/g, ""); if (d.length === 9) d = "996" + d; else if (d.length === 10 && d.charAt(0) === "0") d = "996" + d.slice(1); return d; }

  function collect() {
    var names = [$("name1").value.trim(), $("name2").value.trim()].filter(Boolean);
    var dt = $("date").value;
    var d = { lang: lang(), type: $("type").value, theme: theme, heading: $("heading").value.trim(), names: names, date: dt ? dt + ":00+06:00" : "" };
    function put(k, v) { v = typeof v === "string" ? v.trim() : v; if (v && (!Array.isArray(v) || v.length)) d[k] = v; }
    put("city", $("city").value);
    put("text", $("text").value);
    put("hosts", $("hosts").value);
    put("program", getProgram());
    var venue = { name: $("vname").value.trim(), address: $("vaddr").value.trim(), map: $("vmap").value.trim() };
    if (venue.name || venue.address || venue.map) { Object.keys(venue).forEach(function (k) { if (!venue[k]) delete venue[k]; }); d.venue = venue; }
    put("dresscode", $("dress").value);
    put("rsvpUntil", $("rsvpUntil").value);
    var wa = waNorm($("rsvpWa").value);
    if (wa) d.rsvpWhatsapp = wa;
    put("music", $("music").value);
    var photos = $("photos").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 6);
    put("photos", photos);
    d.vstyle = $("vstyle").value; d.vpalette = $("vpal").value;
    put("age", $("age").value.replace(/\D/g, ""));
    put("cover", $("cover").value);
    put("video", $("video").value);
    var cs = csCollect(); if (cs) d.cs = cs;
    var ly = layCollect(); if (ly) d.lay = ly;
    put("album", $("album").value);
    return d;
  }

  function fill(d) {
    var l = d.lang === "ru" ? "ru" : "ky";
    document.querySelector('input[name=lang][value=' + l + ']').checked = true;
    if (d.type) $("type").value = d.type;
    $("heading").value = d.heading || "";
    $("name1").value = (d.names && d.names[0]) || "";
    $("name2").value = (d.names && d.names[1]) || "";
    $("date").value = d.date ? String(d.date).slice(0, 16) : "";
    $("city").value = d.city || "";
    $("text").value = d.text || "";
    $("hosts").value = d.hosts || "";
    setProgram((d.program || []).map(function (p) { return [p.time || "", p.title || "", p.note || ""]; }));
    var v = d.venue || {};
    $("vname").value = v.name || ""; $("vaddr").value = v.address || ""; $("vmap").value = v.map || "";
    $("dress").value = d.dresscode || "";
    $("rsvpUntil").value = d.rsvpUntil || "";
    $("rsvpWa").value = d.rsvpWhatsapp || ""; layFill(d.lay);
    $("music").value = d.music || "";
    $("photos").value = (d.photos || []).join("\n");
    $("cover").value = d.cover || "";
    $("vstyle").value = d.vstyle || "classic"; $("vpal").value = d.vpalette || "cream"; $("age").value = d.age || "";
    $("video").value = d.video || "";
    $("album").value = d.album || "";
    setTheme(d.theme || "ak-kuu");
    csFill(d.cs);
    renderThumbs(); if (typeof renderMusic === "function") renderMusic();
  }

  // ---------- Сүрөттөр: галереядан тандоо ----------
  var P = window.Photos, MAXPH = 6;
  function status(msg, err) { var e = $("pickStatus"); e.textContent = msg || ""; e.className = "hint" + (err ? " err" : ""); }
  function photoList() { return $("photos").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean); }
  function thumb(src, onX, n, busy) {
    var d = document.createElement("div"); d.className = "thumb" + (busy ? " busy" : "");
    if (src) { var im = document.createElement("img"); im.src = src; im.alt = ""; im.loading = "lazy"; d.appendChild(im); }
    if (n) { var b = document.createElement("span"); b.className = "n"; b.textContent = n; d.appendChild(b); }
    if (onX) { var x = document.createElement("button"); x.type = "button"; x.className = "x"; x.setAttribute("aria-label", "Удалить"); x.textContent = "×"; x.addEventListener("click", onX); d.appendChild(x); }
    return d;
  }
  var pendingCover = 0, pendingPhotos = 0;
  function renderThumbs() {
    var ct = $("coverThumb"); ct.innerHTML = "";
    var cv = $("cover").value.trim();
    if (cv) ct.appendChild(thumb(cv, function () { $("cover").value = ""; renderThumbs(); schedule(); }));
    if (pendingCover) ct.appendChild(thumb("", null, 0, true));
    var pt = $("photoThumbs"); pt.innerHTML = "";
    photoList().forEach(function (u, i) {
      pt.appendChild(thumb(u, function () { var l = photoList(); l.splice(i, 1); $("photos").value = l.join("\n"); renderThumbs(); schedule(); }, i + 1));
    });
    for (var k = 0; k < pendingPhotos; k++) pt.appendChild(thumb("", null, 0, true));
  }
  var STORAGE_OK = !!(P && P.enabled());
  document.querySelectorAll('[data-need="storage"]').forEach(function (el) { if (!STORAGE_OK) el.classList.add("off"); });
  if (!STORAGE_OK) { $("coverMore").open = true; $("photoMore").open = true; $("musicMore").open = true; }
  function errText(e) { return "Не удалось загрузить фото. Проверьте интернет и попробуйте ещё раз." + (e && e.message ? " (" + e.message + ")" : ""); }

  $("coverFile").addEventListener("change", function () {
    var f = this.files[0]; this.value = "";
    if (!f) return;
    pendingCover = 1; renderThumbs(); status("Загрузка фото…");
    P.add(f).then(function (url) { $("cover").value = url; status("Фото добавлено ✓"); })
      .catch(function (e) { status(errText(e), true); })
      .then(function () { pendingCover = 0; renderThumbs(); schedule(); });
  });
  $("photoFile").addEventListener("change", function () {
    var files = Array.prototype.slice.call(this.files); this.value = "";
    var room = MAXPH - photoList().length;
    if (room <= 0) { status("Максимум " + MAXPH + " фото. Удалите лишние.", true); return; }
    var cut = files.length > room;
    if (cut) files = files.slice(0, room);
    status(cut ? "Добавляю только первые " + room + " фото (максимум " + MAXPH + ")…" : "Загрузка фото…");
    pendingPhotos = files.length; renderThumbs();
    files.reduce(function (chain, f) {
      return chain.then(function () {
        return P.add(f).then(function (url) { var l = photoList(); l.push(url); $("photos").value = l.join("\n"); })
          .catch(function (e) { status(errText(e), true); })
          .then(function () { pendingPhotos--; renderThumbs(); schedule(); });
      });
    }, Promise.resolve()).then(function () { if (!$("pickStatus").classList.contains("err")) status(cut ? "Добавлены первые " + room + " фото — максимум " + MAXPH + " ✓" : "Фото добавлены ✓"); });
  });
  // ---------- Музыка ----------
  function renderMusic() {
    var u = $("music").value.trim(), row = $("musicRow");
    row.hidden = !u;
    if (u) { var pl = $("musicPlayer"); if (pl.getAttribute("src") !== u) { pl.pause(); pl.setAttribute("src", u); } }
    else $("musicPlayer").removeAttribute("src");
  }
  function musicErr(e) {
    if (e && e.message === "format") return "Формат не подходит. Выберите файл mp3, m4a или aac.";
    if (e && e.message === "size") return "Файл больше " + e.maxMB + " МБ. Выберите более короткую запись или mp3 меньшего размера.";
    return "Не удалось загрузить музыку. Проверьте интернет и попробуйте ещё раз." + (e && e.message ? " (" + e.message + ")" : "");
  }
  $("musicFile").addEventListener("change", function () {
    var f = this.files[0]; this.value = "";
    if (!f) return;
    var bar = $("musicBar"), fill = bar.firstElementChild;
    bar.hidden = false; fill.style.width = "3%"; status("Загрузка музыки…");
    P.music(f, function (p) { fill.style.width = Math.max(3, Math.round(p * 100)) + "%"; })
      .then(function (url) { $("music").value = url; status("Музыка добавлена ✓"); })
      .catch(function (e) { status(musicErr(e), true); })
      .then(function () { bar.hidden = true; renderMusic(); schedule(); });
  });
  $("musicDel").addEventListener("click", function () { $("music").value = ""; renderMusic(); schedule(); });
  $("music").addEventListener("input", renderMusic);

  $("cover").addEventListener("input", renderThumbs);
  $("photos").addEventListener("input", renderThumbs);

  // ---------- Обновление ----------
  function toast(msg) {
    var t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("on");
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 1800);
  }


  // ---------- Кыска туруктуу шилтеме ----------
  var TR = { "а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"e","ж":"j","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"ts","ч":"ch","ш":"sh","щ":"sh","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","ө":"o","ү":"u","ң":"n" };
  function slugify(s) { return String(s || "").toLowerCase().split("").map(function (c) { return TR[c] != null ? TR[c] : c; }).join("").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40); }
  function shortUrl(kind) { return location.origin + "/" + kind + "/" + shortCode; }
  function waText(d, link) { return O.waText(d, link); }
  function shortUi(d) {
    var ok = d.names.length && d.date, b = $("btnShort"), w = $("btnWaText"), sl = $("slug");
    if (!b) return;
    if (sl && !sl.value && !sl.dataset.touched && !shortCode) sl.value = slugify(d.names.join("-"));
    b.disabled = !ok || !slugify(sl.value); w.disabled = !ok;
    b.textContent = shortCode ? "Обновить короткую ссылку" : "Создать короткую ссылку";
    var si = $("shortInfo");
    if (shortCode) { si.className = "hint ok"; si.textContent = "Ссылка: " + shortUrl("i") + " — если вы изменили приглашение, нажмите «Обновить»."; }
  }
  if ($("slug")) {
    $("slug").addEventListener("input", function () { this.dataset.touched = "1"; shortCode = ""; schedule(); });
    $("btnShort").addEventListener("click", function () {
      var d = collect(), slug = slugify($("slug").value), si = $("shortInfo");
      if (!slug || slug.length < 3) { si.className = "hint err"; si.textContent = "Название слишком короткое (минимум 3 буквы)."; return; }
      $("btnShort").disabled = true; si.className = "hint"; si.textContent = "Сохраняем…";
      O.publish(slug, d).then(function (r) {
        shortCode = r.code; $("slug").value = r.code; update();
        copy(shortUrl("i")); si.className = "hint ok"; si.textContent = (r.updated ? "Обновлено ✓ " : "Готово ✓ ") + shortUrl("i");
      }).catch(function (e) {
        si.className = "hint err";
        si.textContent = /taken/.test(e.message) ? "Это название занято — выберите другое." : /reserved/.test(e.message) ? "Это название нельзя использовать." : /forbidden/.test(e.message) ? "Нет доступа — войдите по коду заново." : "Не удалось сохранить: " + e.message;
      }).then(function () { $("btnShort").disabled = false; });
    });
    $("btnWaText").addEventListener("click", function () { if (!currentLink) return; copy(waText(collect(), currentLink)); toast("Текст скопирован ✓"); });
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(update, 350); }

  function update() {
    var d = collect();
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) {}
    var ok = d.names.length && d.date;
    ["btnCopy", "btnOpen", "btnVCopy", "btnVOpen"].forEach(function (id) { $(id).disabled = !ok; });
    $("btnWa").setAttribute("aria-disabled", ok ? "false" : "true");
    $("phoneWrap").classList.toggle("has", !!ok);
    (function () {
      var h = $("rsvpHint"); if (!h) return; var n = waNorm($("rsvpWa").value);
      if (!n) { h.className = "hint"; h.textContent = "Впишите номер WhatsApp: сюда придут ответы гостей (приду / не смогу, количество, пожелания)."; }
      else if (n.length < 11) { h.className = "hint err"; h.textContent = "Номер выглядит неполным. Пример: 996 550 123 456."; }
      else { h.className = "hint ok"; h.innerHTML = "Ответы гостей придут в WhatsApp на +" + n + ". <a href=\"https://wa.me/" + n + "\" target=\"_blank\" rel=\"noopener\">Проверить номер</a>"; }
    })();
    if (!ok) { currentLink = ""; videoLink = ""; $("vlink").value = ""; $("link").value = ""; $("linkInfo").textContent = ""; $("btnWa").removeAttribute("href"); $("frame").removeAttribute("src"); return; }
    window.CODEC.encode(d).then(function (code) {
      var base = new URL("davet.html", location.href).href;
      longLink = base + "?d=" + code;
      currentLink = shortCode ? shortUrl("i") : longLink;
      $("link").value = currentLink;
      videoLink = shortCode ? shortUrl("v") : new URL("video.html", location.href).href + "?d=" + code;
      $("vlink").value = videoLink;
      shortUi(d);
      $("frame").src = "davet.html?d=" + code + "&preview=1";
      var n = currentLink.length;
      var info = $("linkInfo");
      info.className = "hint" + (n > 3800 ? " warn" : "");
      info.textContent = shortCode ? "" : "Длина ссылки: " + n + " символов." + (n > 3800 ? " Ссылка длинная — сократите текст или уберите фото." : "");
      $("btnWa").href = "https://wa.me/?text=" + encodeURIComponent(shortCode ? waText(d, currentLink) : currentLink);
    });
  }

  function copy(text) {
    function fb() { var ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(fb); else fb();
    toast("Скопировано ✓");
  }

  // ---------- События ----------
  $("form").addEventListener("input", schedule);
  $("form").addEventListener("change", function (e) {
    if (e.target.name === "lang" || e.target.id === "type") applyPresets(false);
    schedule();
  });
  $("addRow").addEventListener("click", function () { addRow("", "", ""); schedule(); });
  $("programList").addEventListener("click", function (e) {
    var x = e.target.closest(".x"); if (x) { x.parentNode.remove(); schedule(); }
  });
  $("themes").addEventListener("click", function (e) {
    var b = e.target.closest(".th"); if (b) { setTheme(b.getAttribute("data-theme")); schedule(); }
  });
  $("btnCopy").addEventListener("click", function () { if (currentLink) copy(currentLink); });
  $("btnOpen").addEventListener("click", function () { if (currentLink) window.open(currentLink, "_blank", "noopener"); });
  $("btnVCopy").addEventListener("click", function () { if (videoLink) copy(videoLink); });
  $("btnVOpen").addEventListener("click", function () { if (videoLink) window.open(videoLink, "_blank", "noopener"); });

  $("btnGuests").addEventListener("click", function () {
    var list = $("guestList"); list.innerHTML = "";
    if (!currentLink) { toast("Сначала заполните имена и дату"); return; }
    var l = lang();
    $("guests").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 300).forEach(function (n) {
      var link = currentLink + (currentLink.indexOf("?") > -1 ? "&" : "?") + "g=" + encodeURIComponent(n);
      var msg = WA_MSG[l].replace("{n}", n).replace("{l}", link);
      var row = document.createElement("div"); row.className = "g";
      var b = document.createElement("b"); b.textContent = n;
      var c = document.createElement("button"); c.type = "button"; c.className = "btn btn-ghost"; c.textContent = "Копия";
      c.addEventListener("click", function () { copy(link); });
      var w = document.createElement("a"); w.className = "btn btn-solid"; w.textContent = "WhatsApp"; w.target = "_blank"; w.rel = "noopener";
      w.href = "https://wa.me/?text=" + encodeURIComponent(msg);
      row.appendChild(b); row.appendChild(c); row.appendChild(w); list.appendChild(row);
    });
  });

  $("btnImport").addEventListener("click", function () {
    var err = $("importErr"); err.hidden = true;
    var code, sc = "";
    try { var u = new URL($("importLink").value.trim()); code = u.searchParams.get("d"); var pm = u.pathname.match(/^\/[iv]\/([a-z0-9-]+)/i); sc = pm ? pm[1].toLowerCase() : (u.searchParams.get("i") || "").toLowerCase(); } catch (e) {}
    if (sc && O) {
      O.get(sc).then(function (r) { if (!r || !r.data) throw new Error("nf"); fill(r.data); shortCode = sc; if ($("slug")) { $("slug").value = sc; $("slug").dataset.touched = "1"; } update(); toast("Ссылка загружена ✓"); window.scrollTo({ top: 0, behavior: "smooth" }); })
        .catch(function () { err.hidden = false; });
      return;
    }
    if (!code) { err.hidden = false; return; }
    window.CODEC.decode(code).then(function (d) { fill(d); update(); toast("Ссылка загружена ✓"); window.scrollTo({ top: 0, behavior: "smooth" }); })
      .catch(function () { err.hidden = false; });
  });

  $("btnReset").addEventListener("click", function () {
    if (!confirm("Начать новое приглашение? Введённые данные будут очищены.")) return;
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    init(true);
  });

  // ---------- Старт ----------
  function init(fresh) {
    var draft = null;
    if (!fresh) { try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) {} }
    if (draft) { fill(draft); }
    else {
      fill({ lang: "ky", type: "uylonuu", theme: "ak-kuu", names: [], rsvpWhatsapp: PUBLIC ? "" : S.whatsapp, vstyle: "silk", vpalette: "cream" });
      applyPresets(true);
    }
    $("guestList").innerHTML = ""; $("guests").value = ""; $("importLink").value = "";
    update();
  }
  // ---------- Заказ берүү (create.html — коомдук режим) ----------
  var PRICES = (S.prices || {});
  function curProduct() { var r = document.querySelector('input[name=product]:checked'); return r ? r.value : "site"; }
  function setProduct(p) { var r = document.querySelector('input[name=product][value="' + p + '"]'); if (r) { r.checked = true; showPrice(); } }
  function showPrice() {
    var el = $("ordPrice"); if (el) el.textContent = PRICES[curProduct()] != null ? PRICES[curProduct()] : "";
    document.querySelectorAll("[data-pp]").forEach(function (e) { var v = PRICES[e.getAttribute("data-pp")]; if (v != null) e.textContent = v + " сом"; });
  }
  function digits(v) { var d = String(v || "").replace(/\D/g, ""); if (d.length === 9) d = "996" + d; else if (d.length === 10 && d.charAt(0) === "0") d = "996" + d.slice(1); return d; }
  function applyParams() {
    var q = new URLSearchParams(location.search), t = q.get("t"), p = q.get("p"), vp = q.get("vp"), ty = q.get("type");
    if (t && S.templates.some(function (x) { return x.id === t; })) setTheme(t);
    if (p && ["site", "video", "both"].indexOf(p) > -1) setProduct(p);
    if (vp && ["cream", "emerald", "burgundy", "navy"].indexOf(vp) > -1) { $("vpal").value = vp; $("vstyle").value = "silk"; }
    if (ty && TYPES.some(function (x) { return x[0] === ty; })) { $("type").value = ty; applyPresets(false); }
    schedule();
  }
  function wireOrder() {
    document.querySelectorAll("input[name=product]").forEach(function (r) { r.addEventListener("change", showPrice); });
    showPrice();
    if (O && O.enabled()) O.prices().then(function (p) { if (p && p.site != null) { PRICES = p; showPrice(); } }).catch(function () {});
    try { var c = JSON.parse(localStorage.getItem("samara-contact") || "null"); if (c) { $("cName").value = c.n || ""; $("cPhone").value = c.p || ""; } } catch (e) {}
    $("btnOrder").addEventListener("click", function () {
      var err = $("ordErr"), btn = $("btnOrder"), d = collect(), name = $("cName").value.trim(), phone = $("cPhone").value.trim(), msg = "";
      if (!d.names.length) msg = "Впишите имя (имена) в разделе «Кто и когда?».";
      else if (!d.date) msg = "Укажите дату и время тоя.";
      else if (digits(phone).length < 11) msg = "Впишите ваш номер WhatsApp, чтобы мы могли с вами связаться.";
      else if (!O || !O.enabled()) msg = "Заказы временно недоступны. Напишите нам в WhatsApp.";
      if (msg) { err.textContent = msg; err.hidden = false; return; }
      err.hidden = true;
      if (!d.rsvpWhatsapp) d.rsvpWhatsapp = digits(phone);
      try { localStorage.setItem("samara-contact", JSON.stringify({ n: name, p: phone })); } catch (e) {}
      btn.disabled = true; btn.textContent = "Отправляем…";
      O.create(curProduct(), d, name, phone).then(function (r) {
        try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
        location.href = "order.html?i=" + encodeURIComponent(r.code);
      }).catch(function (e) {
        btn.disabled = false; btn.textContent = "Оформить заказ →";
        err.textContent = "Не удалось оформить заказ. Проверьте интернет и попробуйте ещё раз." + (e && e.message ? " (" + e.message + ")" : ""); err.hidden = false;
      });
    });
  }

  // ---------- Админ: заказды ачуу жана сактоо ----------
  var editingCode = "";
  function loadOrderFromUrl() {
    var code = O && O.clean(new URLSearchParams(location.search).get("order"));
    if (!code) return;
    O.get(code).then(function (r) {
      if (!r || !r.data) { toast("Заказ табылган жок"); return; }
      editingCode = code; fill(r.data); update();
      var b = $("btnSaveOrder"); if (b) { b.hidden = false; b.textContent = "Сохранить в заказ №" + code.toUpperCase(); }
      toast("Заказ №" + code.toUpperCase() + " загружен");
    }).catch(function () { toast("Не удалось загрузить заказ"); });
  }
  if ($("btnSaveOrder")) $("btnSaveOrder").addEventListener("click", function () {
    if (!editingCode) return;
    O.update(editingCode, collect()).then(function () { toast("Сохранено ✓"); }).catch(function () { toast("Не удалось сохранить"); });
  });

  // ---------- Кирүү коду ----------
  function openGate() { document.body.classList.remove("gated"); if ($("gate")) $("gate").hidden = true; }
  function startAdmin() { openGate(); init(false); loadOrderFromUrl(); }
  function showGate(msg) {
    var form = $("gateForm"), err = $("gateErr");
    if (msg) { err.textContent = msg; err.hidden = false; }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("gatePin").value.trim(), btn = form.querySelector("button");
      btn.disabled = true;
      O.adminCheck(v).then(function (ok) {
        if (ok) { O.saveSecret(v); startAdmin(); }
        else { err.textContent = "Неверный код"; err.hidden = false; $("gatePin").value = ""; $("gatePin").focus(); }
      }).catch(function () { err.textContent = "Нет связи с сервером. Проверьте интернет."; err.hidden = false; })
        .then(function () { btn.disabled = false; });
    });
    $("gatePin").focus();
  }

  if (PUBLIC) { init(false); applyParams(); wireOrder(); }
  else if (O && O.enabled()) {
    if (O.secret()) {
      O.adminCheck(O.secret()).then(function (ok) { if (ok) startAdmin(); else { O.forgetSecret(); showGate(); } }).catch(function () { showGate("Нет связи с сервером. Проверьте интернет."); });
    } else showGate();
  } else {
    // сервер орнотулган эмес — эч ким кире албайт (код сервердеги ичинде текшерилет)
    showGate("Сервер заказов не настроен.");
  }
})();
