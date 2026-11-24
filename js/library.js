// Даяр музыка китепканасы (ыр тандоо терезеси)
(function () {
  "use strict";
  var O = window.Orders, btn = document.getElementById("btnLib"), box = document.getElementById("lib");
  if (!btn || !box || !O) return;
  var songs = null, cat = "", aud = null;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function stop() { if (aud) { aud.pause(); aud = null; } Array.prototype.forEach.call(box.querySelectorAll(".lib-play"), function (b) { b.textContent = "▶"; }); }
  function render() {
    var cats = []; (songs || []).forEach(function (s) { if (s.category && cats.indexOf(s.category) < 0) cats.push(s.category); });
    document.getElementById("libChips").innerHTML = ['<button type="button" class="chip' + (cat ? "" : " on") + '" data-c="">Все</button>'].concat(cats.map(function (c) { return '<button type="button" class="chip' + (c === cat ? " on" : "") + '" data-c="' + esc(c) + '">' + esc(c) + "</button>"; })).join("");
    var list = (songs || []).filter(function (s) { return !cat || s.category === cat; });
    document.getElementById("libList").innerHTML = !songs ? '<p class="hint">Загрузка…</p>' : list.length ? list.map(function (s) {
      return '<div class="lib-row" data-id="' + esc(s.id) + '"><button type="button" class="lib-play" aria-label="Слушать">▶</button><span class="lib-t"><b>' + esc(s.title) + "</b><small>" + esc([s.artist, s.lang].filter(Boolean).join(" · ")) + '</small></span><button type="button" class="btn btn-sm btn-solid lib-pick">Выбрать</button></div>';
    }).join("") : '<p class="hint">Здесь пока пусто. Песни добавляются в «Студии».</p>';
  }
  function open() { box.hidden = false; document.documentElement.classList.add("rv-lock"); if (!songs) O.songsList().then(function (r) { songs = r || []; render(); }).catch(function () { songs = []; render(); }); render(); }
  function close() { stop(); box.hidden = true; document.documentElement.classList.remove("rv-lock"); }
  btn.addEventListener("click", open);
  document.getElementById("libX").addEventListener("click", close);
  box.addEventListener("click", function (e) {
    if (e.target === box) return close();
    var c = e.target.closest("[data-c]"); if (c) { cat = c.getAttribute("data-c"); render(); return; }
    var row = e.target.closest(".lib-row"); if (!row) return;
    var s = songs.filter(function (x) { return x.id === row.getAttribute("data-id"); })[0]; if (!s) return;
    if (e.target.closest(".lib-play")) {
      var was = aud && aud.src === s.url; stop(); if (was) return;
      aud = new Audio(s.url); aud.play().catch(function () {}); e.target.closest(".lib-play").textContent = "❚❚"; aud.onended = stop; return;
    }
    if (e.target.closest(".lib-pick")) {
      var inp = document.getElementById("music"); inp.value = s.url; inp.dispatchEvent(new Event("input", { bubbles: true }));
      var more = document.getElementById("musicMore"); if (more) more.open = false;
      close();
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden) close(); });
})();
