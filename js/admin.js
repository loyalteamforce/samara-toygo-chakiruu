(function () {
  "use strict";
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var DRAFT_KEY = "samara-admin-draft-v1";

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
    ky: "Урматтуу {n}! Сизди тойубузга чакырабыз 💐\n{l}",
    ru: "Уважаемый(ая) {n}! Приглашаем вас на наш той 💐\n{l}"
  };

  var theme = "ak-kuu";
  var currentLink = "";
  var timer;

  // ---------- Заполнение статичных частей ----------
  $("type").innerHTML = TYPES.map(function (t) { return '<option value="' + t[0] + '">' + t[1] + "</option>"; }).join("");

  $("themes").innerHTML = S.templates.map(function (t) {
    return '<button type="button" class="th" data-theme="' + t.id + '" aria-pressed="false" title="' + t.name + '">' +
      '<span class="th-sw" style="background:' + t.bg + ';color:' + t.ink + '"><b style="color:' + t.ink + '">' + t.name.slice(0, 1) + "&amp;" + t.name.slice(0, 1) + '</b><i style="background:' + t.accent + '"></i></span>' +
      '<span class="th-n">' + t.name + "</span></button>";
  }).join("");

  function setTheme(id) {
    theme = id;
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
    var wa = $("rsvpWa").value.replace(/\D/g, "");
    if (wa) d.rsvpWhatsapp = wa;
    put("music", $("music").value);
    var photos = $("photos").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 6);
    put("photos", photos);
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
    $("rsvpWa").value = d.rsvpWhatsapp || "";
    $("music").value = d.music || "";
    $("photos").value = (d.photos || []).join("\n");
    setTheme(d.theme || "ak-kuu");
  }

  // ---------- Обновление ----------
  function toast(msg) {
    var t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("on");
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("on"); }, 1800);
  }

  function schedule() { clearTimeout(timer); timer = setTimeout(update, 350); }

  function update() {
    var d = collect();
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) {}
    var ok = d.names.length && d.date;
    ["btnCopy", "btnOpen"].forEach(function (id) { $(id).disabled = !ok; });
    $("btnWa").setAttribute("aria-disabled", ok ? "false" : "true");
    $("phoneWrap").classList.toggle("has", !!ok);
    if (!ok) { currentLink = ""; $("link").value = ""; $("linkInfo").textContent = ""; $("btnWa").removeAttribute("href"); $("frame").removeAttribute("src"); return; }
    window.CODEC.encode(d).then(function (code) {
      var base = new URL("davet.html", location.href).href;
      currentLink = base + "?d=" + code;
      $("link").value = currentLink;
      $("frame").src = "davet.html?d=" + code + "&preview=1";
      var n = currentLink.length;
      var info = $("linkInfo");
      info.className = "hint" + (n > 3800 ? " warn" : "");
      info.textContent = "Длина ссылки: " + n + " символов." + (n > 3800 ? " Ссылка длинная — сократите текст или уберите фото." : "");
      $("btnWa").href = "https://wa.me/?text=" + encodeURIComponent(currentLink);
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

  $("btnGuests").addEventListener("click", function () {
    var list = $("guestList"); list.innerHTML = "";
    if (!currentLink) { toast("Сначала заполните имена и дату"); return; }
    var l = lang();
    $("guests").value.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 300).forEach(function (n) {
      var link = currentLink + "&g=" + encodeURIComponent(n);
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
    var code;
    try { code = new URL($("importLink").value.trim()).searchParams.get("d"); } catch (e) {}
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
      fill({ lang: "ky", type: "uylonuu", theme: "ak-kuu", names: [], rsvpWhatsapp: S.whatsapp });
      applyPresets(true);
    }
    $("guestList").innerHTML = ""; $("guests").value = ""; $("importLink").value = "";
    update();
  }
  // ---------- Кирүү коду ----------
  function openGate() { document.body.classList.remove("gated"); $("gate").hidden = true; }
  var pin = S.adminPin, ok = false;
  try { ok = !pin || localStorage.getItem("samara-admin-ok") === pin; } catch (e) { ok = !pin; }
  if (ok) { openGate(); init(false); }
  else {
    $("gateForm").addEventListener("submit", function (e) {
      e.preventDefault();
      if ($("gatePin").value.trim() === pin) {
        try { localStorage.setItem("samara-admin-ok", pin); } catch (err) {}
        openGate(); init(false);
      } else { $("gateErr").hidden = false; $("gatePin").value = ""; $("gatePin").focus(); }
    });
    $("gatePin").focus();
  }
})();
