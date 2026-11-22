// Ипек (сатин) кездемени чийүү — видеодо жана «Жибек» чакыруу темаларында колдонулат.
// Аз чечимдеги катмандар чоңойтулганда жумшак, жалтырак бүктөлмөлөр болуп калат.
(function () {
  "use strict";
  var PAL = {
    cream:    { mid: "#f4ead6", hi: "#fffaf0", lo: "#d3bd93", ink: "#3b2a15", soft: "#6e5a3a", wash: "rgba(248,240,224,.7)", dark: false },
    emerald:  { mid: "#115243", hi: "#2f8d74", lo: "#04251e", ink: "#f7edd2", soft: "#c3d9ce", wash: "rgba(8,50,40,.66)", dark: true },
    burgundy: { mid: "#6d1a2a", hi: "#b64c60", lo: "#2b0810", ink: "#f9ead3", soft: "#ead0cf", wash: "rgba(70,14,26,.66)", dark: true },
    navy:     { mid: "#1a3163", hi: "#5278c0", lo: "#071230", ink: "#f4eddb", soft: "#c3cde6", wash: "rgba(12,28,66,.66)", dark: true }
  };
  function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }

  function make(P, w, h) {
    w = w || 360; h = h || 640;
    var seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function bands(g, bw, bh, count, th0, thR, amp0, ampR, rot, peakLight, peakDark) {
      g.save(); g.translate(bw / 2, bh / 2); g.rotate(rot); g.translate(-bw * 1.1, -bh * 1.1);
      var span = Math.max(bw, bh) * 2.2, step = (bh * 2.2) / count;
      for (var i = 0; i < count; i++) {
        var y0 = i * step + rnd() * step * 0.4, amp = amp0 + rnd() * ampR, ph = rnd() * 6, th = th0 + rnd() * thR, x;
        g.beginPath(); g.moveTo(0, y0);
        for (x = 0; x <= span; x += 4) g.lineTo(x, y0 + Math.sin(x / (span / 5.5) + ph) * amp + Math.sin(x / (span / 13) + ph * 2) * amp * 0.28);
        for (x = span; x >= 0; x -= 4) g.lineTo(x, y0 + th + Math.sin(x / (span / 5.5) + ph + 0.8) * amp + Math.sin(x / (span / 11) + ph) * amp * 0.25);
        g.closePath();
        var gr = g.createLinearGradient(0, y0 - amp, 0, y0 + th + amp), light = i % 2 === 0;
        var col = light ? P.hi : P.lo, peak = light ? peakLight : peakDark;
        gr.addColorStop(0, rgba(col, 0)); gr.addColorStop(0.5, rgba(col, peak)); gr.addColorStop(1, rgba(col, 0));
        g.fillStyle = gr; g.fill();
      }
      g.restore();
    }
    var out = document.createElement("canvas"); out.width = w; out.height = h;
    var o = out.getContext("2d"); o.imageSmoothingEnabled = true; o.imageSmoothingQuality = "high";
    o.fillStyle = P.mid; o.fillRect(0, 0, w, h);
    var l1 = document.createElement("canvas"); l1.width = 54; l1.height = 96;
    bands(l1.getContext("2d"), 54, 96, 9, 8, 12, 3, 5, -0.5, P.dark ? 0.42 : 0.85, P.dark ? 0.6 : 0.4);
    o.drawImage(l1, 0, 0, w, h);
    var l2 = document.createElement("canvas"); l2.width = 120; l2.height = 214;
    bands(l2.getContext("2d"), 120, 214, 14, 10, 18, 4, 9, -0.38, P.dark ? 0.22 : 0.5, P.dark ? 0.34 : 0.22);
    o.globalAlpha = 0.9; o.drawImage(l2, 0, 0, w, h); o.globalAlpha = 1;
    return out;
  }

  window.Silk = { PAL: PAL, rgba: rgba, make: make };
})();
