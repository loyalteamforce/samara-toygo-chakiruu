// Чакыруунун маалыматын URL ичине коюу / URL'den okuma (sunucu yok).
// "p" + base64url(JSON)           — кыска чакыруулар, эски телефондорго да иштейт
// "z" + base64url(deflate(JSON))  — узун чакыруулар (фото ж.б.)
(function () {
  function toB64u(u) {
    var s = ""; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function fromB64u(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
    var b = atob(s), u = new Uint8Array(b.length);
    for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    return u;
  }
  window.CODEC = {
    encode: function (obj) {
      var bytes = new TextEncoder().encode(JSON.stringify(obj));
      var plain = "p" + toB64u(bytes);
      if (plain.length <= 2000 || !window.CompressionStream) return Promise.resolve(plain);
      var st = new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));
      return new Response(st).arrayBuffer().then(function (b) { return "z" + toB64u(new Uint8Array(b)); });
    },
    decode: function (str) {
      try {
        var kind = str.charAt(0), bytes = fromB64u(str.slice(1));
        if (kind === "p") return Promise.resolve(JSON.parse(new TextDecoder().decode(bytes)));
        if (kind === "z" && window.DecompressionStream) {
          var st = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
          return new Response(st).text().then(JSON.parse);
        }
      } catch (e) {}
      return Promise.reject(new Error("bad data"));
    }
  };
})();
