// «Сахна» темалары: коддон тартылган көркөм фондор (тоолор, көл террасасы, гүлдөр, боз үй, жүрөк ж.б.)
// Бардыгы SVG — сүрөт файлы жок, ар бир чакырууга жана видеого бирдей чыгат.
(function () {
  "use strict";
  var uid = 0;
  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function n(v) { return Math.round(v * 10) / 10; }
  function stops(arr, ids) { return arr.map(function (c, i) { return '<stop offset="' + (ids ? ids[i] : n(i / (arr.length - 1))) + '" stop-color="' + c + '"/>'; }).join(""); }
  function lg(id, arr, x2, y2, ids) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (x2 || 0) + '" y2="' + (y2 == null ? 1 : y2) + '">' + stops(arr, ids) + "</linearGradient>"; }
  function rg(id, c1, c2, o1, o2) { return '<radialGradient id="' + id + '"><stop offset="0" stop-color="' + c1 + '" stop-opacity="' + (o1 == null ? 1 : o1) + '"/><stop offset="1" stop-color="' + (c2 || c1) + '" stop-opacity="' + (o2 == null ? 0 : o2) + '"/></radialGradient>'; }

  // ---------- Гүлдөр ----------
  function leaf(x, y, L, ang, col) { return '<path d="M0 0Q' + n(L * 0.5) + " " + n(-L * 0.3) + " " + n(L) + " 0Q" + n(L * 0.5) + " " + n(L * 0.3) + ' 0 0Z" fill="' + col + '" transform="translate(' + n(x) + " " + n(y) + ") rotate(" + n(ang) + ')"/>'; }
  function rose(x, y, r, c, rand) {
    var g = '<g transform="translate(' + n(x) + " " + n(y) + ") rotate(" + n(rand() * 360) + ')">';
    g += '<circle r="' + n(r) + '" fill="' + c[2] + '"/><circle r="' + n(r * 0.93) + '" fill="' + c[1] + '"/>';
    for (var k = 0; k < 5; k++) {
      var R = r * (0.82 - k * 0.15);
      g += '<path d="M' + n(-R) + " 0A" + n(R) + " " + n(R) + ' 0 0 1 ' + n(R) + ' 0" fill="' + (k % 2 ? c[1] : c[0]) + '" stroke="' + c[2] + '" stroke-width="' + n(r * 0.05) + '" stroke-opacity=".7" transform="rotate(' + (k * 67 + 20) + ')"/>';
    }
    g += '<circle r="' + n(r * 0.16) + '" fill="' + c[2] + '" opacity=".55"/><ellipse cx="' + n(-r * 0.3) + '" cy="' + n(-r * 0.4) + '" rx="' + n(r * 0.32) + '" ry="' + n(r * 0.14) + '" fill="#fff" opacity=".22" transform="rotate(-30)"/></g>';
    return g;
  }
  function peony(x, y, r, c, rand) {
    var g = '<g transform="translate(' + n(x) + " " + n(y) + ") rotate(" + n(rand() * 360) + ')">', k;
    for (k = 0; k < 9; k++) g += '<ellipse cx="0" cy="' + n(-r * 0.5) + '" rx="' + n(r * 0.4) + '" ry="' + n(r * 0.58) + '" fill="' + c[2] + '" opacity=".9" transform="rotate(' + k * 40 + ')"/>';
    for (k = 0; k < 7; k++) g += '<ellipse cx="0" cy="' + n(-r * 0.38) + '" rx="' + n(r * 0.34) + '" ry="' + n(r * 0.46) + '" fill="' + c[1] + '" stroke="' + c[2] + '" stroke-width="' + n(r * 0.025) + '" transform="rotate(' + (k * 51 + 12) + ')"/>';
    for (k = 0; k < 5; k++) g += '<ellipse cx="0" cy="' + n(-r * 0.22) + '" rx="' + n(r * 0.22) + '" ry="' + n(r * 0.3) + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="' + n(r * 0.02) + '" transform="rotate(' + (k * 72 + 30) + ')"/>';
    g += '<circle r="' + n(r * 0.09) + '" fill="#e8c35a"/></g>';
    return g;
  }
  function hydr(x, y, r, c, rand) {
    var g = '<g transform="translate(' + n(x) + " " + n(y) + ')"><circle r="' + n(r) + '" fill="' + c[2] + '" opacity=".45"/>';
    for (var i = 0; i < 20; i++) {
      var a = rand() * 6.283, d = Math.sqrt(rand()) * r * 0.82, px = Math.cos(a) * d, py = Math.sin(a) * d, fr = r * 0.2, col = c[Math.floor(rand() * 3)];
      for (var k = 0; k < 4; k++) g += '<circle cx="' + n(px + Math.cos(k * 1.571) * fr * 0.55) + '" cy="' + n(py + Math.sin(k * 1.571) * fr * 0.55) + '" r="' + n(fr * 0.62) + '" fill="' + col + '" stroke="' + c[2] + '" stroke-width=".4" stroke-opacity=".5"/>';
      g += '<circle cx="' + n(px) + '" cy="' + n(py) + '" r="' + n(fr * 0.18) + '" fill="#f6f0c8"/>';
    }
    return g + "</g>";
  }
  function poppy(x, y, r, c, rand) {
    var g = '<g transform="translate(' + n(x) + " " + n(y) + ") rotate(" + n(rand() * 72) + ')">';
    for (var k = 0; k < 5; k++) g += '<circle cx="' + n(Math.cos(k * 1.2566) * r * 0.46) + '" cy="' + n(Math.sin(k * 1.2566) * r * 0.46) + '" r="' + n(r * 0.54) + '" fill="' + (k % 2 ? c[0] : c[1]) + '"/>';
    g += '<circle r="' + n(r * 0.22) + '" fill="' + c[2] + '"/>';
    for (k = 0; k < 7; k++) g += '<circle cx="' + n(Math.cos(k * 0.9) * r * 0.32) + '" cy="' + n(Math.sin(k * 0.9) * r * 0.32) + '" r="' + n(r * 0.04) + '" fill="#1b1209"/>';
    return g + "</g>";
  }
  function tulip(x, y, h, c) {
    var w = h * 0.2;
    return '<g transform="translate(' + n(x) + " " + n(y) + ')"><path d="M0 0 C' + n(w * 0.4) + " " + n(-h * 0.4) + " " + n(-w * 0.3) + " " + n(-h * 0.7) + ' 0 ' + n(-h * 0.88) + '" stroke="#4c7a3a" stroke-width="' + n(h * 0.05) + '" fill="none"/>' +
      '<ellipse cx="' + n(-w * 0.5) + '" cy="' + n(-h * 0.95) + '" rx="' + n(w * 0.55) + '" ry="' + n(w * 1.05) + '" fill="' + c[1] + '" transform="rotate(-18 ' + n(-w * 0.5) + " " + n(-h * 0.95) + ')"/>' +
      '<ellipse cx="' + n(w * 0.5) + '" cy="' + n(-h * 0.95) + '" rx="' + n(w * 0.55) + '" ry="' + n(w * 1.05) + '" fill="' + c[1] + '" transform="rotate(18 ' + n(w * 0.5) + " " + n(-h * 0.95) + ')"/>' +
      '<ellipse cx="0" cy="' + n(-h * 0.98) + '" rx="' + n(w * 0.6) + '" ry="' + n(w * 1.15) + '" fill="' + c[0] + '"/></g>';
  }
  function bloom(type, x, y, r, c, rand) { return (type === "peony" ? peony : type === "hydr" ? hydr : type === "poppy" ? poppy : rose)(x, y, r, c, rand); }
  var LEAF = ["#3f6b3f", "#5a8a4a", "#2f5232", "#6f9a58"];
  function cluster(fl, rand, k) {
    var g = "", i, lc = fl.leaf || LEAF;
    for (i = 0; i < 16; i++) g += leaf(rand() * 120, rand() * 120, 38 + rand() * 50, 10 + rand() * 80, lc[Math.floor(rand() * lc.length)]);
    var spots = [[26, 28, 34], [86, 20, 26], [20, 92, 26], [72, 72, 30], [134, 46, 20], [44, 142, 21], [112, 114, 18], [164, 20, 15], [16, 156, 14], [150, 90, 13]];
    spots.forEach(function (s, j) {
      var useAcc = fl.acc && j % 3 === 2;
      g += bloom(useAcc ? fl.acc.type : fl.main.type, s[0] + (rand() - 0.5) * 8, s[1] + (rand() - 0.5) * 8, s[2] * k, useAcc ? fl.acc.cols : fl.main.cols, rand);
    });
    return g;
  }
  function corners(fl, rand, k, y) {
    k = k || 1; y = y || 0;
    return '<g transform="translate(0 ' + y + ") scale(" + k + ')">' + cluster(fl, rand, 1) + "</g>" +
      '<g transform="translate(400 ' + y + ") scale(" + -k + " " + k + ')">' + cluster(fl, rng(99), 1) + "</g>";
  }

  // ---------- Дөбөлөр / тоолор ----------
  function ridge(rand, y0, amp, step, smooth, bottom) {
    var pts = [], x = -30;
    while (x < 440) { pts.push([x, y0 - amp * (0.2 + rand() * 0.8)]); x += step * (0.7 + rand() * 0.6); }
    var d = "M" + n(pts[0][0]) + " " + n(pts[0][1]), i;
    if (smooth) {
      for (i = 1; i < pts.length - 1; i++) d += "Q" + n(pts[i][0]) + " " + n(pts[i][1]) + " " + n((pts[i][0] + pts[i + 1][0]) / 2) + " " + n((pts[i][1] + pts[i + 1][1]) / 2);
      d += "L" + n(pts[pts.length - 1][0]) + " " + n(pts[pts.length - 1][1]);
    } else { for (i = 1; i < pts.length; i++) d += "L" + n(pts[i][0]) + " " + n(pts[i][1]); }
    return { d: d + "L440 " + bottom + "L-30 " + bottom + "Z", pts: pts };
  }
  function cloud(x, y, w, op) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + w + '" ry="' + n(w * 0.22) + '" opacity="' + op + '"/><ellipse cx="' + n(x - w * 0.35) + '" cy="' + n(y + 4) + '" rx="' + n(w * 0.55) + '" ry="' + n(w * 0.2) + '" opacity="' + op + '"/><ellipse cx="' + n(x + w * 0.4) + '" cy="' + n(y + 3) + '" rx="' + n(w * 0.6) + '" ry="' + n(w * 0.2) + '" opacity="' + op + '"/>'; }
  function star4(x, y, r, col, op) { return '<path d="M' + x + " " + n(y - r) + "Q" + x + " " + y + " " + n(x + r) + " " + y + "Q" + x + " " + y + " " + x + " " + n(y + r) + "Q" + x + " " + y + " " + n(x - r) + " " + y + "Q" + x + " " + y + " " + x + " " + n(y - r) + 'Z" fill="' + col + '" opacity="' + op + '"/>'; }
  function stars(rand, count, ymax, col) {
    var g = "";
    for (var i = 0; i < count; i++) g += '<circle cx="' + n(rand() * 400) + '" cy="' + n(rand() * ymax) + '" r="' + n(0.5 + rand() * 1.3) + '" fill="' + col + '" opacity="' + n(0.35 + rand() * 0.6) + '"/>';
    for (i = 0; i < 6; i++) g += star4(n(20 + rand() * 360), n(10 + rand() * ymax * 0.8), n(4 + rand() * 6), col, 0.9);
    return g;
  }
  function petals(rand, count, col, y0, y1) {
    var g = "";
    for (var i = 0; i < count; i++) g += '<ellipse cx="' + n(rand() * 400) + '" cy="' + n(y0 + rand() * (y1 - y0)) + '" rx="' + n(3 + rand() * 3) + '" ry="' + n(1.6 + rand() * 1.8) + '" fill="' + col + '" opacity="' + n(0.45 + rand() * 0.45) + '" transform="rotate(' + n(rand() * 180) + " " + n(rand() * 400) + " " + n(y0) + ')"/>';
    return g;
  }

  // ---------- Сахналар ----------
  function lake(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.sky, 0, 1, [0, 0.6, 1]) + lg(I + "w", P.water) + lg(I + "t", P.stone) + rg(I + "g", P.glow, P.glow, 0.95, 0) + '<filter id="' + I + 'b" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="7"/></filter></defs>';
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/><circle cx="' + n(130 + rand() * 140) + '" cy="405" r="250" fill="url(#' + I + 'g)"/>';
    g += '<g fill="#fff" filter="url(#' + I + 'b)">' + cloud(80, 120, 70, 0.8) + cloud(310, 70, 80, 0.7) + cloud(240, 250, 90, 0.55) + cloud(60, 300, 60, 0.5) + "</g>";
    var m1 = ridge(rand, 405, 100, 46, false, 440), m2 = ridge(rand, 425, 66, 40, true, 440), m3 = ridge(rand, 440, 34, 34, true, 440);
    g += '<path d="' + m1.d + '" fill="' + P.m[0] + '" opacity=".85"/><path d="' + m2.d + '" fill="' + P.m[1] + '"/><path d="' + m3.d + '" fill="' + P.m[2] + '"/>';
    // кыштак
    var hx = 20 + rand() * 40, i;
    for (i = 0; i < 9; i++) { var x = hx + i * (7 + rand() * 6), y = 432 + rand() * 4, w = 5 + rand() * 4; g += '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(w * 0.7) + '" fill="#f3e6d0"/><path d="M' + n(x - 1) + " " + n(y) + "L" + n(x + w / 2) + " " + n(y - w * 0.55) + "L" + n(x + w + 1) + " " + n(y) + 'Z" fill="#c9784f"/>'; }
    g += '<rect y="440" width="400" height="70" fill="url(#' + I + 'w)"/>';
    for (i = 0; i < 46; i++) g += '<rect x="' + n(rand() * 400) + '" y="' + n(446 + rand() * 54) + '" width="' + n(10 + rand() * 38) + '" height="1.2" fill="#fff" opacity="' + n(0.15 + rand() * 0.3) + '"/>';
    [[28, 1.1], [52, 0.85], [348, 1.0], [372, 1.25], [326, 0.75]].forEach(function (t) { g += '<ellipse cx="' + t[0] + '" cy="' + n(452 - 24 * t[1]) + '" rx="' + n(5.2 * t[1]) + '" ry="' + n(27 * t[1]) + '" fill="' + P.tree[0] + '"/><ellipse cx="' + (t[0] + 2) + '" cy="' + n(448 - 22 * t[1]) + '" rx="' + n(3 * t[1]) + '" ry="' + n(20 * t[1]) + '" fill="' + P.tree[1] + '" opacity=".55"/>'; });
    for (i = 0; i < 6; i++) g += '<circle cx="' + n(70 + i * 38 + rand() * 20) + '" cy="' + n(447 + rand() * 4) + '" r="' + n(6 + rand() * 5) + '" fill="' + P.tree[i % 2] + '" opacity=".9"/>';
    // террасса
    g += '<rect y="548" width="400" height="52" fill="url(#' + I + 't)"/>';
    for (i = -7; i <= 7; i++) g += '<path d="M' + (200 + i * 17) + " 556L" + (200 + i * 64) + ' 600" stroke="' + P.balSh + '" stroke-width=".8" opacity=".6"/>';
    g += '<path d="M0 568H400M0 582H400" stroke="' + P.balSh + '" stroke-width=".8" opacity=".5"/>';
    g += '<rect y="503" width="400" height="9" fill="' + P.bal + '"/><rect y="512" width="400" height="3" fill="' + P.balSh + '" opacity=".6"/>';
    for (i = 0; i < 16; i++) { var cx = 8 + i * 26.4; g += '<path d="M' + n(cx - 4) + " 515L" + n(cx + 4) + " 515L" + n(cx + 3) + " 521Q" + n(cx + 8) + " 528 " + n(cx + 4) + " 534Q" + n(cx + 9) + " 539 " + n(cx + 6) + " 544L" + n(cx + 7) + " 549L" + n(cx - 7) + " 549L" + n(cx - 6) + " 544Q" + n(cx - 9) + " 539 " + n(cx - 4) + " 534Q" + n(cx - 8) + " 528 " + n(cx - 3) + ' 521Z" fill="' + P.bal + '" stroke="' + P.balSh + '" stroke-width=".7"/>'; }
    g += '<rect y="549" width="400" height="9" fill="' + P.bal + '"/><rect y="557" width="400" height="3" fill="' + P.balSh + '"/>';
    [-2, 376].forEach(function (px) { g += '<rect x="' + px + '" y="486" width="26" height="72" fill="' + P.bal + '" stroke="' + P.balSh + '" stroke-width=".8"/><rect x="' + (px - 3) + '" y="480" width="32" height="9" fill="' + P.bal + '" stroke="' + P.balSh + '" stroke-width=".8"/>'; });
    if (fl) g += corners(fl, rand, 0.92, -10);
    return d + g;
  }

  function peaks(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.bg) + rg(I + "s", P.sun[0], P.sun[1], 1, 1) + "</defs>";
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/>';
    if (P.dark) g += stars(rand, 40, 300, "#fff");
    g += '<circle cx="200" cy="410" r="82" fill="url(#' + I + 's)"/><circle cx="200" cy="410" r="96" fill="none" stroke="' + P.sun[1] + '" stroke-width="1" opacity=".45"/><circle cx="200" cy="410" r="112" fill="none" stroke="' + P.sun[1] + '" stroke-width=".8" opacity=".25"/>';
    var bases = [452, 478, 508, 543, 580], amps = [100, 88, 70, 55, 40];
    P.p.forEach(function (c, i) {
      var r = ridge(rand, bases[i], amps[i], 52, false, 610);
      g += '<path d="' + r.d + '" fill="' + c + '"/>';
      if (i < 3) r.pts.forEach(function (p, j) {
        var prev = r.pts[j - 1], next = r.pts[j + 1];
        if (prev && next && p[1] < prev[1] && p[1] < next[1] && p[1] < bases[i] - amps[i] * 0.45 && p[0] > 10 && p[0] < 390) {
          var x = p[0], y = p[1];
          g += '<path d="M' + n(x) + " " + n(y) + "L" + n(x + 15) + " " + n(y + 20) + "L" + n(x + 7) + " " + n(y + 14) + "L" + n(x + 2) + " " + n(y + 24) + "L" + n(x - 5) + " " + n(y + 15) + "L" + n(x - 13) + " " + n(y + 21) + 'Z" fill="' + P.snow + '" opacity=".92"/>';
        }
      });
    });
    return d + g;
  }

  function yurt(x, y, s, P, glow) {
    var g = '<g transform="translate(' + x + " " + y + ") scale(" + s + ')">';
    g += '<path d="M-34 0V-24H34V0Z" fill="' + P.yw + '"/><path d="M-38 -24Q-38 -54 0 -60Q38 -54 38 -24Z" fill="' + P.yr + '"/>';
    for (var i = -3; i <= 3; i++) g += '<path d="M' + i * 4 + " -59Q" + i * 9 + " -42 " + i * 12.5 + ' -24" stroke="' + P.yd + '" stroke-width=".6" fill="none" opacity=".35"/>';
    g += '<rect x="-34" y="-19" width="68" height="5.5" fill="' + P.yb + '"/><path d="M-34 -16.2';
    for (i = 0; i < 17; i++) g += "l2 " + (i % 2 ? 2.5 : -2.5) + " ";
    g += 'h0" stroke="' + P.yw + '" stroke-width=".8" fill="none"/><circle cy="-60" r="5" fill="' + P.yb + '"/>';
    g += '<path d="M-7 0V-13Q0 -22 7 -13V0Z" fill="' + (glow ? P.glow : P.yd) + '"/>';
    return g + "</g>";
  }
  function steppe(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.sky, 0, 1, [0, 0.55, 1]) + lg(I + "g", P.grass) + rg(I + "s", P.sun, P.sun, 0.95, 0) + rg(I + "h", P.sun, P.sun, 0.35, 0) + (P.night ? '<mask id="' + I + 'm"><rect width="400" height="600" fill="#fff"/><circle cx="318" cy="112" r="27" fill="#000"/></mask>' : "") + "</defs>";
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/>';
    if (P.night) { g += stars(rand, 70, 380, "#fff") + '<circle cx="300" cy="120" r="90" fill="url(#' + I + 'h)"/><circle cx="300" cy="120" r="30" fill="' + P.moon + '" mask="url(#' + I + 'm)"/>'; }
    else g += '<circle cx="210" cy="430" r="200" fill="url(#' + I + 's)"/><g fill="#fff" opacity=".85">' + cloud(90, 110, 62, 0.7) + cloud(300, 170, 70, 0.55) + "</g>";
    var r1 = ridge(rand, 430, 110, 50, false, 520), r2 = ridge(rand, 460, 70, 44, true, 540);
    g += '<path d="' + r1.d + '" fill="' + P.ridge[0] + '"/><path d="' + r2.d + '" fill="' + P.ridge[1] + '"/>';
    var r3 = ridge(rand, 505, 40, 80, true, 620);
    g += '<path d="' + r3.d + '" fill="url(#' + I + 'g)"/>';
    g += yurt(110, 528, 1.0, P, P.night) + yurt(290, 552, 1.35, P, P.night) + yurt(205, 514, 0.55, P, P.night);
    g += '<path d="M0 578Q120 560 240 574T400 566V600H0Z" fill="' + P.grass[1] + '"/>';
    for (var i = 0; i < 60; i++) { var x = rand() * 400, y = 574 + rand() * 24; g += '<path d="M' + n(x) + " " + n(y) + "q1 -7 " + n(rand() * 4 - 2) + ' -12" stroke="' + P.grass[0] + '" stroke-width="1.2" fill="none" opacity=".8"/>'; }
    return d + g;
  }

  function heart(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.bg) + '<filter id="' + I + 's" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="' + P.shadow + '" flood-opacity=".28"/></filter><filter id="' + I + 'b"><feGaussianBlur stdDeviation="3"/></filter></defs>';
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/>', i;
    // перде
    for (i = 0; i < 7; i++) {
      var x = i * 17;
      g += '<path d="M' + x + " 0Q" + (x + 9) + " 220 " + (x - 6) + ' 600" stroke="#fff" stroke-width="' + (8 + (i % 3) * 3) + '" opacity="' + n(0.28 - i * 0.025) + '" fill="none" filter="url(#' + I + 'b)"/>';
      g += '<path d="M' + (400 - x) + " 0Q" + (391 - x) + " 220 " + (406 - x) + ' 600" stroke="#fff" stroke-width="' + (8 + (i % 3) * 3) + '" opacity="' + n(0.28 - i * 0.025) + '" fill="none" filter="url(#' + I + 'b)"/>';
    }
    g += '<path d="M0 0H70Q40 300 62 600H0Z" fill="#fff" opacity=".35"/><path d="M400 0H330Q360 300 338 600H400Z" fill="#fff" opacity=".35"/>';
    g += '<g transform="translate(200 350) scale(1.17) translate(-200 -350)">';
    var H = "M200 478C48 372 50 186 200 262C350 186 352 372 200 478Z";
    g += '<g filter="url(#' + I + 's)"><path d="' + H + '" fill="' + P.heart + '"/></g>';
    g += '<path d="' + H + '" fill="none" stroke="' + P.edge + '" stroke-width="7" stroke-dasharray="0.1 9" stroke-linecap="round" transform="translate(200 350) scale(.94) translate(-200 -350)"/>';
    g += '<path d="' + H + '" fill="none" stroke="' + P.edge + '" stroke-width="1.2" opacity=".7"/>';
    g += '<path d="' + H + '" fill="none" stroke="' + P.edge + '" stroke-width=".8" opacity=".5" transform="translate(200 350) scale(.88) translate(-200 -350)"/>';
    // кадак
    g += '<path d="M64 330C60 250 86 215 150 232" fill="none" stroke="' + P.ribbon + '" stroke-width="5" stroke-linecap="round" opacity=".9"/>';
    g += '<g transform="translate(70 322)"><path d="M0 0C-30 -28 -46 -6 -34 12C-24 24 -8 10 0 0Z" fill="' + P.ribbon + '"/><path d="M0 0C30 -26 48 -2 36 14C26 24 8 10 0 0Z" fill="' + P.ribbon + '"/><path d="M0 0C-6 24 -22 44 -34 64L-18 58L-12 72C-2 50 6 26 0 0Z" fill="' + P.ribbon + '" opacity=".95"/><path d="M0 0C8 22 22 42 30 62L16 58L14 70C2 48 -6 24 0 0Z" fill="' + P.ribbon + '" opacity=".85"/><circle r="7" fill="' + P.ribbon + '" stroke="#fff" stroke-opacity=".5"/></g>';
    g += "</g>" + petals(rand, 16, P.petal, 90, 590);
    return d + g;
  }

  function couple(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.bg) + "</defs>";
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/>';
    g += '<path d="M-20 420C80 330 170 470 260 380S380 300 430 340" stroke="' + P.line + '" stroke-width="1.3" fill="none" opacity=".6"/><path d="M-20 450C90 365 180 500 275 410S380 330 430 372" stroke="' + P.line + '" stroke-width=".9" fill="none" opacity=".4"/>';
    g += petals(rand, 26, P.petal, 40, 560);
    var S = P.line, F = P.fig;
    g += '<g transform="translate(96 262) scale(1.8)" stroke="' + S + '" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">' +
      // күйөө
      '<circle cx="34" cy="22" r="10.5" fill="' + F + '"/><path d="M22 36Q34 31 46 36L49 100L43 102L41 190L32 190L30 112L28 190L19 190L17 102L11 100Z" fill="' + F + '"/><path d="M34 33V60M30 33L34 45L38 33" fill="none"/>' +
      // колдор
      '<path d="M46 52Q64 74 80 70" fill="none" stroke-width="2.6"/>' +
      // келин: вуаль, көйнөк
      '<path d="M96 14C132 22 140 110 124 200C118 150 108 90 90 44Z" fill="' + F + '" opacity=".9"/><circle cx="90" cy="26" r="9.5" fill="' + F + '"/><path d="M82 38Q90 34 98 38L101 76Q118 120 118 194L66 194Q66 120 84 76Z" fill="' + F + '"/><path d="M86 82Q92 90 100 82" fill="none"/>' +
      "</g>";
    g += '<path d="M0 560Q100 545 200 556T400 548V600H0Z" fill="' + P.line + '" opacity=".18"/>';
    return d + g;
  }

  function arch(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.bg) + rg(I + "g", "#fff", "#fff", 0.9, 0) + "</defs>";
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/><ellipse cx="200" cy="330" rx="150" ry="230" fill="url(#' + I + 'g)"/>';
    var A = "M72 592V250A128 128 0 0 1 328 250V592";
    g += '<path d="' + A + '" fill="#fff" opacity=".35"/><path d="' + A + '" fill="none" stroke="' + P.arch + '" stroke-width="6"/><path d="M84 592V250A116 116 0 0 1 316 250V592" fill="none" stroke="' + P.arch + '" stroke-width="1.4" opacity=".6"/>';
    var pts = [], i;
    for (i = 0; i <= 26; i++) {
      var t = i / 26, x, y;
      if (t < 0.28) { x = 72; y = 592 - (t / 0.28) * 342; } else if (t < 0.72) { var a = Math.PI - ((t - 0.28) / 0.44) * Math.PI; x = 200 + Math.cos(a) * 128; y = 250 - Math.sin(a) * 128; } else { x = 328; y = 250 + ((t - 0.72) / 0.28) * 342; }
      pts.push([x, y, t]);
    }
    var lc = fl.leaf || LEAF;
    pts.forEach(function (p) { for (var k = 0; k < 3; k++) g += leaf(p[0] + (rand() - 0.5) * 22, p[1] + (rand() - 0.5) * 22, 22 + rand() * 24, rand() * 360, lc[Math.floor(rand() * lc.length)]); });
    pts.forEach(function (p, j) {
      var dense = p[1] < 300 || p[1] > 500 ? 1 : 0.5;
      if (rand() > dense * 0.75 + 0.2) return;
      var useAcc = fl.acc && j % 3 === 1;
      g += bloom(useAcc ? fl.acc.type : fl.main.type, p[0] + (rand() - 0.5) * 18, p[1] + (rand() - 0.5) * 18, (15 + rand() * 13) * (p[1] > 480 ? 1.25 : 1), useAcc ? fl.acc.cols : fl.main.cols, rand);
    });
    g += petals(rand, 18, fl.main.cols[0], 400, 600) + '<path d="M0 575Q100 560 200 572T400 564V600H0Z" fill="' + P.grass + '" opacity=".55"/>';
    return d + g;
  }

  function sakura(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.bg) + '<filter id="' + I + 'b"><feGaussianBlur stdDeviation="5"/></filter></defs>';
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/><g filter="url(#' + I + 'b)">', i;
    for (i = 0; i < 12; i++) g += '<circle cx="' + n(rand() * 400) + '" cy="' + n(rand() * 520) + '" r="' + n(8 + rand() * 16) + '" fill="#fff" opacity="' + n(0.2 + rand() * 0.3) + '"/>';
    g += "</g>";
    var r1 = ridge(rand, 520, 40, 70, true, 610), r2 = ridge(rand, 560, 30, 90, true, 610);
    g += '<path d="' + r1.d + '" fill="' + P.hill[0] + '" opacity=".7"/><path d="' + r2.d + '" fill="' + P.hill[1] + '"/>';
    function branch(x0, y0, dir, seed) {
      var rr = rng(seed), x = x0, y = y0, out = "", blossoms = "", ang = dir > 0 ? 0.35 : Math.PI - 0.35, w = 7, k;
      for (k = 0; k < 18; k++) {
        var nx = x + Math.cos(ang) * 22, ny = y + Math.sin(ang) * 22 + 3;
        out += '<path d="M' + n(x) + " " + n(y) + "L" + n(nx) + " " + n(ny) + '" stroke="' + P.wood + '" stroke-width="' + n(w) + '" stroke-linecap="round"/>';
        w = Math.max(1.6, w * 0.92); ang += (rr() - 0.45) * 0.45 * (k > 6 ? 1.4 : 1);
        if (k > 2) {
          var bx = nx, by = ny, bl = 28 + rr() * 38, ba = ang + (rr() > 0.5 ? 1 : -1) * (0.7 + rr() * 0.6);
          var ex = bx + Math.cos(ba) * bl, ey = by + Math.sin(ba) * bl;
          out += '<path d="M' + n(bx) + " " + n(by) + "Q" + n((bx + ex) / 2) + " " + n(by + 6) + " " + n(ex) + " " + n(ey) + '" stroke="' + P.wood + '" stroke-width="1.8" fill="none"/>';
          for (var q = 0; q < 3; q++) blossoms += sakuraFlower(bx + (ex - bx) * (q / 2.4) + (rr() - 0.5) * 8, by + (ey - by) * (q / 2.4) + (rr() - 0.5) * 8, 7 + rr() * 6, P, rr);
        }
        blossoms += sakuraFlower(nx + (rr() - 0.5) * 12, ny + (rr() - 0.5) * 12, 8 + rr() * 7, P, rr);
        x = nx; y = ny;
      }
      return out + blossoms;
    }
    g += branch(-10, 10, 1, 11) + branch(410, 70, -1, 23);
    g += petals(rand, 30, P.petal[1], 60, 580);
    return d + g;
  }
  function sakuraFlower(x, y, r, P, rand) {
    var g = '<g transform="translate(' + n(x) + " " + n(y) + ") rotate(" + n(rand() * 72) + ')">';
    for (var k = 0; k < 5; k++) g += '<ellipse cx="0" cy="' + n(-r * 0.55) + '" rx="' + n(r * 0.5) + '" ry="' + n(r * 0.62) + '" fill="' + P.petal[k % 2] + '" stroke="' + P.petal[2] + '" stroke-width=".4" stroke-opacity=".6" transform="rotate(' + k * 72 + ')"/>';
    return g + '<circle r="' + n(r * 0.18) + '" fill="' + P.petal[2] + '"/></g>';
  }

  function field(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.sky, 0, 1, [0, 0.6, 1]) + lg(I + "g", P.grass) + rg(I + "s", "#fff6d0", "#fff6d0", 0.95, 0) + "</defs>";
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/><circle cx="' + n(120 + rand() * 160) + '" cy="360" r="210" fill="url(#' + I + 's)"/>';
    g += '<g fill="#fff" opacity=".8">' + cloud(90, 110, 60, 0.7) + cloud(310, 150, 70, 0.55) + "</g>";
    var r1 = ridge(rand, 420, 80, 50, true, 480), r2 = ridge(rand, 450, 46, 60, true, 500);
    g += '<path d="' + r1.d + '" fill="' + P.hill[0] + '"/><path d="' + r2.d + '" fill="' + P.hill[1] + '"/><rect y="440" width="400" height="170" fill="url(#' + I + 'g)"/>';
    var rows = 9, i, j;
    for (i = 0; i < rows; i++) {
      var y = 455 + i * 17 + i * i * 0.9, sc = 0.45 + i * 0.2, cnt = 11 - Math.floor(i / 3);
      for (j = 0; j < cnt; j++) {
        var x = (j + 0.5 + (rand() - 0.5) * 0.7) * (400 / cnt);
        g += '<path d="M' + n(x) + " " + n(y) + "q" + n(rand() * 6 - 3) + " " + n(-14 * sc) + " " + n(rand() * 8 - 4) + " " + n(-26 * sc) + '" stroke="#4c7a3a" stroke-width="' + n(1.4 * sc) + '" fill="none"/>';
        if (P.type === "tulip") g += tulip(x, y, 54 * sc, P.flower[Math.floor(rand() * P.flower.length)]);
        else g += poppy(x, y - 26 * sc, 11 * sc, P.flower, rand);
      }
    }
    return d + g;
  }

  function night(P, fl, rand, I) {
    var d = "<defs>" + lg(I + "a", P.sky, 0, 1, [0, 0.55, 1]) + rg(I + "s", P.moon, P.moon, 0.5, 0) + '<mask id="' + I + 'm"><rect width="400" height="600" fill="#fff"/><circle cx="288" cy="118" r="38" fill="#000"/></mask></defs>';
    var g = '<rect width="400" height="600" fill="url(#' + I + 'a)"/>' + stars(rand, 90, 400, "#fff");
    g += '<circle cx="262" cy="130" r="120" fill="url(#' + I + 's)"/><circle cx="256" cy="134" r="50" fill="' + P.moon + '" mask="url(#' + I + 'm)"/>';
    if (P.dust) for (var i = 0; i < 22; i++) g += '<circle cx="' + n(rand() * 400) + '" cy="' + n(rand() * 600) + '" r="' + n(1.5 + rand() * 3) + '" fill="' + P.moon + '" opacity="' + n(0.18 + rand() * 0.3) + '"/>';
    var bases = [455, 490, 530, 570];
    P.ridge.forEach(function (c, k) { var r = ridge(rand, bases[k], 95 - k * 18, 56, k > 1, 610); g += '<path d="' + r.d + '" fill="' + c + '"/>'; });
    return d + g;
  }

  var KINDS = { lake: lake, peaks: peaks, steppe: steppe, heart: heart, couple: couple, arch: arch, sakura: sakura, field: field, night: night };

  // ---------- Палитралар ----------
  var HYD_BLUE = { main: { type: "hydr", cols: ["#7ea3d6", "#a9c4ec", "#5b80b8"] }, acc: { type: "rose", cols: ["#fffaf0", "#f1e4d4", "#d6bf9f"] } };
  var HYD_LILAC = { main: { type: "hydr", cols: ["#a98fd6", "#c8b4ec", "#8068b4"] }, acc: { type: "rose", cols: ["#fffaf0", "#f1e4d4", "#d6bf9f"] } };
  var ROSE_RED = { main: { type: "rose", cols: ["#d8384a", "#ec5a66", "#8f1630"] }, acc: { type: "rose", cols: ["#fffaf0", "#f4e8d8", "#d9c3a8"] } };
  var ROSE_BORD = { main: { type: "rose", cols: ["#9b2740", "#bb4660", "#561026"] }, acc: { type: "rose", cols: ["#fbf3ea", "#efe0d2", "#d6bfa8"] } };
  var PEONY = { main: { type: "peony", cols: ["#f9d0d9", "#f4a8bb", "#e07f98"] }, acc: { type: "peony", cols: ["#fffaf3", "#f6e6e4", "#e3c3c3"] } };
  var ROSE_WHITE = { main: { type: "rose", cols: ["#fffaf0", "#f3e7d3", "#d6bf9f"] }, acc: { type: "rose", cols: ["#f2c4cd", "#e8a0b0", "#c06880"] } };
  var ROSE_BLUSH = { main: { type: "rose", cols: ["#f6bcc8", "#ec92a8", "#c45a78"] }, acc: { type: "rose", cols: ["#fffaf0", "#f4e8d8", "#d9c3a8"] } };
  var STONE = ["#f4eee0", "#d9cdb4"];

  // fonts: [шрифттер], names: name-style
  var T = {
    "scn-lake-azure":   { name: "Көк көл", kind: "lake", types: ["uylonuu", "nikah", "kuda"], demo: "demo", seed: 3, ink: "#2b4a63", accent: "#4f7aa6", bg: "#eef4f8", dark: 0, fl: HYD_BLUE, font: "Cormorant Garamond", ital: 1,
      pal: { sky: ["#8fbfea", "#c9e0f3", "#f4f1e6"], m: ["#8fb0c9", "#6f95b0", "#4f7a83"], water: ["#a9cfe0", "#7fb0c4"], glow: "#fff6dc", tree: ["#2d4a3a", "#4a6b45"], stone: STONE, bal: "#f2ead9", balSh: "#cdbfa2" } },
    "scn-lake-olive":   { name: "Зайтун көл", kind: "lake", types: ["nikah", "uylonuu", "kuda", "yubiley"], demo: "demo", seed: 8, ink: "#3b4a2e", accent: "#6b7f4e", bg: "#f6f0e3", dark: 0, font: "Cormorant Garamond", ital: 1,
      pal: { sky: ["#a9cfe6", "#e3ead8", "#f6e9c9"], m: ["#a8b99a", "#879f7c", "#66805f"], water: ["#bcd6d6", "#8fb7b5"], glow: "#fff0c8", tree: ["#33472f", "#566f43"], stone: STONE, bal: "#f4ecda", balSh: "#cfc2a4" } },
    "scn-lake-scarlet": { name: "Кызыл роза", kind: "lake", types: ["nikah", "uylonuu", "kyz-uzatuu"], demo: "demo", seed: 5, ink: "#6b2332", accent: "#b3283a", bg: "#fbefe6", dark: 0, fl: ROSE_RED, font: "Bad Script",
      pal: { sky: ["#efc9bc", "#f7dcc6", "#fbeedb"], m: ["#c9a89a", "#a98f87", "#7f8a6c"], water: ["#ecd0c2", "#d3aa9c"], glow: "#ffe2b0", tree: ["#3a4a35", "#5a6b44"], stone: STONE, bal: "#f4ead8", balSh: "#d2c2a4" } },
    "scn-lake-bordeaux": { name: "Бордо роза", kind: "lake", types: ["nikah", "kyz-uzatuu", "uylonuu"], demo: "demo-kyz", seed: 12, ink: "#561a2c", accent: "#8f2540", bg: "#f8ece6", dark: 0, fl: ROSE_BORD, font: "Bad Script",
      pal: { sky: ["#e6c2bb", "#f3d6c6", "#faead8"], m: ["#bf9b92", "#a08388", "#76806a"], water: ["#e7ccc0", "#cba39a"], glow: "#ffd9a6", tree: ["#38482f", "#566a40"], stone: STONE, bal: "#f3e8d6", balSh: "#d0bfa2" } },
    "scn-lake-blush":   { name: "Пион", kind: "lake", types: ["kyz-uzatuu", "nikah", "tuulgan-kun"], demo: "demo-kyz", seed: 17, ink: "#7a3a52", accent: "#c4637f", bg: "#fdf1f0", dark: 0, fl: PEONY, font: "Bad Script",
      pal: { sky: ["#f3cfda", "#fadfe0", "#fdf1e6"], m: ["#d4b5c2", "#bb9fb0", "#9d9a8c"], water: ["#f1d6da", "#dcb6bf"], glow: "#fff0dc", tree: ["#42563f", "#62784f"], stone: STONE, bal: "#f8eee2", balSh: "#d9c8b6" } },
    "scn-lake-gold":    { name: "Алтын күүгүм", kind: "lake", types: ["nikah", "yubiley", "uylonuu"], demo: "demo", seed: 21, ink: "#5e3a1c", accent: "#b8782b", bg: "#fbefdc", dark: 0, fl: ROSE_WHITE, font: "Cormorant Garamond", ital: 1,
      pal: { sky: ["#eeb687", "#f6d5a6", "#fdeccb"], m: ["#c49478", "#a67c68", "#7a7458"], water: ["#f2cd9c", "#d9a676"], glow: "#fff2c4", tree: ["#3d452c", "#5d6a3b"], stone: STONE, bal: "#f6ecd8", balSh: "#d6c19e" } },
    "scn-lake-lilac":   { name: "Лаванда", kind: "lake", types: ["nikah", "tuulgan-kun", "uylonuu"], demo: "demo", seed: 27, ink: "#4d3a6e", accent: "#7a5ea8", bg: "#f4eef8", dark: 0, fl: HYD_LILAC, font: "Cormorant Garamond", ital: 1,
      pal: { sky: ["#c8b6e4", "#e6dbef", "#f9eeea"], m: ["#a897c2", "#8d7fa8", "#6d7a8c"], water: ["#d8c9e6", "#b8a6d0"], glow: "#fff0e6", tree: ["#3d4a45", "#5b6b5d"], stone: STONE, bal: "#f6efe9", balSh: "#d3c6c2" } },

    "scn-peaks-bakyt":  { name: "Чоку", kind: "peaks", types: ["yubiley", "uylonuu", "sunnot"], demo: "demo-yubiley", seed: 2, ink: "#26405c", accent: "#b8862b", bg: "#f4e9d2", dark: 0, font: "Prata",
      pal: { bg: ["#f7eed8", "#efe0bf"], sun: ["#f9d975", "#c8902a"], p: ["#e0e1db", "#bcc8d0", "#8ca2b4", "#566f8c", "#2b4467"], snow: "#f5f7f6" } },
    "scn-peaks-rose":   { name: "Таңшуу", kind: "peaks", types: ["nikah", "uylonuu", "kyz-uzatuu"], demo: "demo", seed: 6, ink: "#43355f", accent: "#a9553d", bg: "#f8e1d8", dark: 0, font: "Cormorant Garamond", ital: 1,
      pal: { bg: ["#fae6de", "#f3cdc0"], sun: ["#ffe9ab", "#e9a85a"], p: ["#ecd3d0", "#d4a9b2", "#a98098", "#7a5a7a", "#43355f"], snow: "#fff4f0" } },
    "scn-peaks-emerald": { name: "Зумурут тоо", kind: "peaks", types: ["uylonuu", "yubiley", "nikah"], demo: "demo", seed: 9, ink: "#f6ecd0", accent: "#e0b866", bg: "#0f3b31", dark: 1, font: "Prata",
      pal: { dark: 1, bg: ["#0d3a30", "#1d5c4a"], sun: ["#f7e08f", "#cf9a3a"], p: ["#2f6f5c", "#245b4a", "#1a4538", "#12342b", "#0a231d"], snow: "#cfe3d6" } },

    "scn-yurt-sunset":  { name: "Боз үй · Күүгүм", kind: "steppe", types: ["uylonuu", "kyz-uzatuu", "sunnot", "tushoo"], demo: "demo", seed: 4, ink: "#5a2a1c", accent: "#b5502f", bg: "#fbe6cc", dark: 0, font: "Philosopher", upper: 1,
      pal: { sky: ["#f2a876", "#f8cf9a", "#fde9c8"], sun: "#fff3c0", ridge: ["#d9a07e", "#b97d6a"], grass: ["#7f8f4a", "#5c7440"], yw: "#fbf5e8", yr: "#efe3cc", yb: "#b5502f", yd: "#6b3b24", glow: "#ffd98a" } },
    "scn-yurt-green":   { name: "Жайлоо", kind: "steppe", types: ["uylonuu", "kuda", "sunnot", "tuulgan-kun"], demo: "demo-sunnot", seed: 14, ink: "#24473b", accent: "#2e7d5b", bg: "#eaf4ee", dark: 0, font: "Philosopher", upper: 1,
      pal: { sky: ["#86c0e6", "#cfe8f4", "#f6f3df"], sun: "#fffbe0", ridge: ["#9db8c6", "#6f9c86"], grass: ["#8fb25a", "#628f40"], yw: "#fdfaf0", yr: "#f1ecda", yb: "#2e7d5b", yd: "#3d5a48", glow: "#ffe9a0" } },
    "scn-yurt-night":   { name: "Түнкү жайлоо", kind: "steppe", types: ["sunnot", "tushoo", "uylonuu", "tuulgan-kun"], demo: "demo-sunnot", seed: 18, ink: "#f4eddb", accent: "#e7c77d", bg: "#101a3a", dark: 1, font: "Lora", ital: 1,
      pal: { night: 1, sky: ["#0d1738", "#27306a", "#5a4a7c"], sun: "#e7c77d", moon: "#f6efd2", ridge: ["#1b2a52", "#14223f"], grass: ["#14314a", "#0d2236"], yw: "#e8dcc2", yr: "#cdbf9f", yb: "#e7c77d", yd: "#3a3320", glow: "#ffcf6b" } },

    "scn-heart-sage":   { name: "Жүрөк · Шалфей", kind: "heart", types: ["nikah", "uylonuu", "kyz-uzatuu"], demo: "demo", seed: 1, ink: "#3e4a35", accent: "#6b8a5e", bg: "#f1eee2", dark: 0, font: "Bad Script",
      pal: { bg: ["#f4f0e4", "#e8e4d4"], heart: "#fbf8ef", edge: "#c9c3a8", ribbon: "#6b8a5e", petal: "#cfc8a6", shadow: "#7d7a5c" } },
    "scn-heart-rose":   { name: "Жүрөк · Роза", kind: "heart", types: ["nikah", "kyz-uzatuu", "uylonuu"], demo: "demo-kyz", seed: 7, ink: "#6b3744", accent: "#c76f82", bg: "#fbefee", dark: 0, font: "Bad Script",
      pal: { bg: ["#fcefee", "#f5dcdc"], heart: "#fffaf7", edge: "#e4b4bc", ribbon: "#c76f82", petal: "#f0b6c0", shadow: "#a8606c" } },
    "scn-heart-navy":   { name: "Жүрөк · Көк", kind: "heart", types: ["nikah", "uylonuu", "sunnot"], demo: "demo", seed: 11, ink: "#25395e", accent: "#3d5a8c", bg: "#e8eef6", dark: 0, font: "Bad Script",
      pal: { bg: ["#e9eff7", "#d5dff0"], heart: "#fbfcff", edge: "#b4c3de", ribbon: "#3d5a8c", petal: "#b8c8e6", shadow: "#586a8e" } },

    "scn-couple-rose":  { name: "Бирге", kind: "couple", types: ["nikah", "uylonuu", "kyz-uzatuu"], demo: "demo", seed: 13, ink: "#7a3a3c", accent: "#b5524f", bg: "#f3e1da", dark: 0, font: "Cormorant Garamond", ital: 1,
      pal: { bg: ["#f6e6df", "#ecd3cb"], line: "#a8706a", fig: "rgba(255,246,240,.7)", petal: "#b5524f" } },
    "scn-couple-sage":  { name: "Жупташ", kind: "couple", types: ["nikah", "uylonuu"], demo: "demo", seed: 19, ink: "#3f5236", accent: "#6f8a62", bg: "#e9eee2", dark: 0, font: "Cormorant Garamond", ital: 1,
      pal: { bg: ["#edf1e6", "#dde6d6"], line: "#6f8a62", fig: "rgba(255,255,250,.7)", petal: "#8aa67a" } },

    "scn-arch-rose":    { name: "Гүл арка", kind: "arch", types: ["nikah", "kyz-uzatuu", "uylonuu"], demo: "demo", seed: 23, ink: "#6e2f46", accent: "#c45a78", bg: "#fbeee8", dark: 0, fl: ROSE_BLUSH, font: "Bad Script",
      pal: { bg: ["#fcf1ec", "#f6dfd6"], arch: "#c9a37a", grass: "#a3b58a" } },
    "scn-arch-blue":    { name: "Көк арка", kind: "arch", types: ["nikah", "uylonuu", "sunnot"], demo: "demo", seed: 29, ink: "#2b4a6e", accent: "#5b80b8", bg: "#e9f0f6", dark: 0, fl: HYD_BLUE, font: "Cormorant Garamond", ital: 1,
      pal: { bg: ["#edf3f8", "#dbe7f2"], arch: "#b9a47e", grass: "#9db58a" } },

    "scn-sakura":       { name: "Сакура", kind: "sakura", types: ["kyz-uzatuu", "nikah", "tuulgan-kun", "beshik"], demo: "demo-kyz", seed: 31, ink: "#7a3550", accent: "#d0678a", bg: "#fdeef2", dark: 0, font: "Bad Script",
      pal: { bg: ["#fde6ee", "#fff6f0"], wood: "#6b4a4a", petal: ["#ffd9e3", "#f7aec3", "#e8809f"], hill: ["#e9d3da", "#dcc3cb"] } },

    "scn-field-poppy":  { name: "Мак талаасы", kind: "field", types: ["tuulgan-kun", "kuda", "uylonuu", "beshik"], demo: "demo-beshik", seed: 33, ink: "#3b4a2a", accent: "#d0392d", bg: "#f2f6e6", dark: 0, font: "Bad Script",
      pal: { type: "poppy", sky: ["#c8e3f5", "#eaf5ee", "#fbf6df"], grass: ["#a8c96a", "#6d9a3e"], hill: ["#a9c7a0", "#86b078"], flower: ["#e0392d", "#f2604f", "#7a1010"] } },
    "scn-field-tulip":  { name: "Жоогазын", kind: "field", types: ["kyz-uzatuu", "beshik", "tushoo", "tuulgan-kun"], demo: "demo-beshik", seed: 37, ink: "#6b3a5a", accent: "#c25a8a", bg: "#fdf0f2", dark: 0, font: "Bad Script",
      pal: { type: "tulip", sky: ["#f6dcec", "#fdf0ea", "#fff8e8"], grass: ["#b6d27a", "#7aa648"], hill: ["#c4d8a8", "#a5c585"], flower: [["#f0a6c4", "#e0709f"], ["#ffd96b", "#f0b43a"], ["#d9a6f0", "#b077d6"], ["#fff0f4", "#f0c4d4"]] } },

    "scn-night-moon":   { name: "Ай түнү", kind: "night", types: ["sunnot", "tushoo", "beshik", "nikah"], demo: "demo-sunnot", seed: 41, ink: "#eef0fa", accent: "#e7c77d", bg: "#101a3a", dark: 1, font: "Lora", ital: 1,
      pal: { sky: ["#0b1535", "#1d2b63", "#3b4a8a"], moon: "#f3f1e6", ridge: ["#26346a", "#1b2755", "#131d44", "#0b1230"] } },
    "scn-night-gold":   { name: "Алтын жылдыз", kind: "night", types: ["yubiley", "nikah", "uylonuu"], demo: "demo-yubiley", seed: 43, ink: "#fbeed8", accent: "#f0c872", bg: "#24123a", dark: 1, font: "Cormorant Garamond", ital: 1,
      pal: { dust: 1, sky: ["#1a0f2e", "#3a1f4d", "#7a3b5a"], moon: "#f6d98a", ridge: ["#5a2c55", "#3f1f4a", "#2a1438", "#180b27"] } }
  };
  // tulip үчүн ар бир гүл өзүнүн түсү
  function art(id) {
    var t = T[id]; if (!t) return "";
    if (t._svg) return t._svg;
    var I = "sc" + (++uid), rand = rng(t.seed * 7919);
    var P = t.pal;
    if (t.kind === "field" && P.type === "tulip") { /* түстөр массив-массив */ }
    var body = KINDS[t.kind](P, t.fl, rand, I);
    t._svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' + body + "</svg>";
    return t._svg;
  }
  function uri(id) { var t = T[id]; if (!t) return ""; if (!t._uri) t._uri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(art(id)); return t._uri; }
  function image(id, w, h) {
    return new Promise(function (res) {
      if (!T[id]) return res(null);
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { res(null); };
      im.width = w || 540; im.height = h || 810;
      im.src = uri(id);
      setTimeout(function () { res(null); }, 6000);
    });
  }

  // ---------- Сайтка тема катары тиркөө ----------
  var FONT_Q = { "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,500;1,500", "Bad Script": "Bad+Script", "Prata": "Prata", "Philosopher": "Philosopher:wght@400;700", "Lora": "Lora:ital,wght@0,400;0,500;1,400" };
  var NK = { heart: 0.72, arch: 0.8, couple: 1.05 };
  var TOP = { lake: 19, peaks: 15, steppe: 15, heart: 33, couple: 13, arch: 30, sakura: 20, field: 15, night: 15 };
  var ids = Object.keys(T);
  var css = "";
  ids.forEach(function (id) {
    var t = T[id], dark = !!t.dark;
    t.fonts = [FONT_Q[t.font] || "Bad+Script"];
    var fam = "'" + t.font + "', " + (t.font === "Bad Script" ? "cursive" : "serif");
    css += 'body[data-theme="' + id + '"]{--bg:' + t.bg + ";--bg2:color-mix(in srgb," + t.bg + " 70%,#fff);--ink:" + t.ink + ";--muted:color-mix(in srgb," + t.ink + " 68%," + t.bg + ");--accent:" + t.accent + ";--accent-ink:" + (dark ? t.bg : "#fff") +
      ";--line:color-mix(in srgb," + t.accent + " 42%,transparent);--f-names:" + fam + ";--f-head:" + (dark ? fam : "'Cormorant Garamond',serif") + ";--names-style:" + (t.ital ? "italic" : "normal") + ";--names-k:" + (NK[t.kind] ? NK[t.kind] * (t.font === "Bad Script" ? 1 : 1.1) : t.font === "Bad Script" ? 1.15 : t.upper ? 0.82 : 1.25) + ";--hpt:" + (TOP[t.kind] || 15) + "svh;--tsh:" + (dark ? "0 2px 16px rgba(0,0,0,.5)" : "0 1px 14px rgba(255,255,255,.65)") +
      ";--zgold:" + t.accent + ";--zcard1:color-mix(in srgb," + t.bg + " 60%,#fff);--zcard2:" + t.bg + ";--zseal1:color-mix(in srgb," + t.accent + " 70%,#fff);--zseal2:" + t.accent + ";--env:" + t.bg + ";--env2:color-mix(in srgb," + t.bg + " 88%,#000);--seal:" + t.accent + "}";
  });
  try { var st = document.createElement("style"); st.id = "scene-themes"; st.textContent = css; document.head.appendChild(st); } catch (e) {}

  var list = ids.map(function (id) {
    var t = T[id];
    return { id: id, name: t.name, isNew: true, types: t.types, demo: t.demo, font: "'" + t.font + "', " + (t.font === "Bad Script" ? "cursive" : "serif"), italic: !!t.ital, upper: !!t.upper, bg: t.bg, ink: t.ink, accent: t.accent, scene: true };
  });
  if (window.SITE && Array.isArray(window.SITE.templates)) window.SITE.templates = list.concat(window.SITE.templates);

  window.SCENE_THEMES = T;
  window.Scenes = {
    themes: T, list: list,
    has: function (id) { return !!T[id]; },
    dark: function (id) { return !!(T[id] && T[id].dark); },
    art: art, uri: uri, image: image,
    card: function (id) { return T[id] ? '<img class="tp-art" src="' + uri(id) + '" alt="" loading="lazy" decoding="async">' : ""; }
  };
})();
