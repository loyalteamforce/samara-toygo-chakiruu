// Botanik çelenk (yaprak + çiçek) — SVG olarak kodla çizilir, her seferinde aynı sonucu verir.
// Botanic.garland(width, height, "olive"|"blush"|"blue", seed, flip) -> SVG metni
(function () {
  "use strict";
  var PAL = {
    olive: { leaf: ["#5f7545", "#789058", "#8da86b", "#4f6338"], flower: "#fffdf6", shade: "#e9e1cc", center: "#e9c46a", bud: "#f3ecd9", stem: "#566b3d" },
    blush: { leaf: ["#7f9470", "#99ad87", "#b2c3a0", "#6a7f5d"], flower: "#f7d6da", shade: "#e3a3ae", center: "#f2c866", bud: "#f8e2e4", stem: "#667a58" },
    blue:  { leaf: ["#6d8d95", "#8aa8ad", "#a7c0c2", "#58767e"], flower: "#ffffff", shade: "#dbe6e8", center: "#e9c46a", bud: "#eef3f4", stem: "#4f6d75" }
  };
  function rng(seed) { var s = seed || 7; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
  function n(x) { return Math.round(x * 10) / 10; }
  function leafPath(L, W) { return "M0 0C" + n(L * 0.3) + " " + n(-W) + " " + n(L * 0.7) + " " + n(-W) + " " + n(L) + " 0C" + n(L * 0.7) + " " + n(W) + " " + n(L * 0.3) + " " + n(W) + " 0 0Z"; }
  function flower(r, P, rand) {
    var out = "";
    var petals = 5 + (rand() > 0.6 ? 1 : 0);
    for (var k = 0; k < petals; k++) {
      out += '<ellipse cx="0" cy="' + n(-r * 0.56) + '" rx="' + n(r * 0.36) + '" ry="' + n(r * 0.62) + '" fill="' + P.flower + '" stroke="' + P.shade + '" stroke-width="' + n(r * 0.05) + '" transform="rotate(' + n(k * 360 / petals) + ')"/>';
    }
    out += '<circle r="' + n(r * 0.24) + '" fill="' + P.center + '"/>';
    for (var d = 0; d < 6; d++) out += '<circle cx="' + n(Math.cos(d) * r * 0.3) + '" cy="' + n(Math.sin(d * 1.7) * r * 0.3) + '" r="' + n(r * 0.05) + '" fill="#b98a2f"/>';
    return out;
  }
  function garland(w, h, name, seed, flip) {
    var P = PAL[name] || PAL.olive, rand = rng(seed || 7), s = w / 390;
    var p0 = [w * 0.02, h * 0.3], p1 = [w * 0.5, h * 1.5], p2 = [w * 0.98, h * 0.3];
    function B(t) { var a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]]; }
    function T(t) { var dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]); return Math.atan2(dy, dx) * 180 / Math.PI; }
    var g = '<path d="M' + n(p0[0]) + " " + n(p0[1]) + "Q" + n(p1[0]) + " " + n(p1[1]) + " " + n(p2[0]) + " " + n(p2[1]) + '" fill="none" stroke="' + P.stem + '" stroke-width="' + n(2.4 * s) + '" stroke-linecap="round"/>';
    var i, N = 46;
    for (i = 0; i < N; i++) {
      var t = 0.01 + 0.98 * i / (N - 1), pt = B(t), base = T(t), side = i % 2 ? 1 : -1;
      var L = (15 + rand() * 15) * s, W = L * (0.22 + rand() * 0.08), ang = base + side * (32 + rand() * 30);
      g += '<path d="' + leafPath(L, W) + '" fill="' + P.leaf[Math.floor(rand() * P.leaf.length)] + '" transform="translate(' + n(pt[0]) + " " + n(pt[1]) + ") rotate(" + n(ang) + ')"/>';
    }
    // иңкыйгыч — кичине жалбырактар
    for (i = 0; i < 26; i++) {
      var t2 = 0.04 + 0.92 * rand(), q = B(t2), b2 = T(t2), sd = rand() > 0.5 ? 1 : -1, L2 = (9 + rand() * 8) * s;
      g += '<path d="' + leafPath(L2, L2 * 0.26) + '" fill="' + P.leaf[Math.floor(rand() * P.leaf.length)] + '" opacity=".9" transform="translate(' + n(q[0]) + " " + n(q[1]) + ") rotate(" + n(b2 + sd * (55 + rand() * 25)) + ')"/>';
    }
    // гүлдөр
    [[0.5, 1.5], [0.36, 1], [0.64, 1], [0.2, 0.9], [0.8, 0.9], [0.09, 0.7], [0.91, 0.7]].forEach(function (f) {
      var q = B(f[0]), r = (15 + rand() * 4) * s * f[1];
      g += '<g transform="translate(' + n(q[0]) + " " + n(q[1] + (rand() - 0.5) * 6 * s) + ") rotate(" + n(rand() * 72) + ')">' + flower(r, P, rand) + "</g>";
    });
    // бүчүрлөр
    for (i = 0; i < 9; i++) {
      var t3 = 0.06 + 0.88 * rand(), q3 = B(t3);
      g += '<circle cx="' + n(q3[0] + (rand() - 0.5) * 14 * s) + '" cy="' + n(q3[1] + (rand() > 0.5 ? 1 : -1) * (8 + rand() * 8) * s) + '" r="' + n((3 + rand() * 2.5) * s) + '" fill="' + P.bud + '" stroke="' + P.shade + '" stroke-width=".6"/>';
    }
    if (flip) g = '<g transform="translate(0 ' + h + ') scale(1 -1)">' + g + "</g>";
    return '<svg viewBox="0 0 ' + w + " " + h + '" width="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">' + g + "</svg>";
  }
  window.Botanic = { PAL: PAL, garland: garland };
})();
