// Ипек (сатин) кездеме эффекти: конверт ачылгандан кийин экранды жаап өтөт
(function () {
  "use strict";
  function hex(c) { var n = parseInt(String(c).replace("#", ""), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function toHex(a) { return "#" + a.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  function mix(a, b, t) { var x = hex(a), y = hex(b); return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]); }
  function lum(h) { var c = hex(h); return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255; }
  var uid = 0;
  function svg(base) {
    var id = "sx" + (++uid), L = lum(base), light = L > 0.5;
    var dark = mix(base, "#000000", light ? 0.1 : 0.3), mid = mix(base, "#000000", light ? 0.02 : 0.1), lite = mix(base, "#ffffff", light ? 0.5 : 0.35), spec = mix(base, "#ffffff", 0.82);
    return '<svg viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden="true"><defs>' +
      '<filter id="' + id + 'f" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.0035 0.0011" numOctaves="2" seed="11" result="n"/><feGaussianBlur in="n" stdDeviation="5" result="nb"/>' +
        '<feSpecularLighting in="nb" surfaceScale="9" specularConstant=".9" specularExponent="34" lighting-color="' + spec + '" result="spec"><feDistantLight azimuth="235" elevation="48"/></feSpecularLighting>' +
        '<feDiffuseLighting in="nb" surfaceScale="7" diffuseConstant=".95" lighting-color="' + lite + '" result="dif"><feDistantLight azimuth="235" elevation="55"/></feDiffuseLighting>' +
        '<feComposite in="dif" in2="SourceGraphic" operator="arithmetic" k1="1.0" k2="0" k3="0" k4="0" result="base"/>' +
        '<feComposite in="spec" in2="base" operator="arithmetic" k1="0" k2=".55" k3="1" k4="0"/></filter>' +
      '<linearGradient id="' + id + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + dark + '"/><stop offset=".5" stop-color="' + mid + '"/><stop offset="1" stop-color="' + dark + '"/></linearGradient></defs>' +
      '<path filter="url(#' + id + 'f)" d="M-60 -20H470C430 140 500 260 450 400S500 650 460 820H-60C-20 650 -90 520 -40 400S-100 140 -60 -20Z" fill="url(#' + id + 'g)"/></svg>';
  }
  // base — ипектин түсү; onCover — экран толук жабылганда чакырылат
  function sweep(base, onCover) {
    var el = document.createElement("div"); el.className = "silk"; el.innerHTML = svg(base || "#115243"); document.body.appendChild(el);
    var fast = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(function () { el.classList.add("in"); });
    setTimeout(function () { if (onCover) onCover(); }, fast ? 30 : 1000);
    setTimeout(function () { el.classList.remove("in"); el.classList.add("out"); }, fast ? 60 : 1100);
    setTimeout(function () { el.remove(); }, fast ? 200 : 2150);
  }
  window.SilkFx = { sweep: sweep, svg: svg, mix: mix };
})();
