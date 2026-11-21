// Телефондун галереясынан сүрөт тандоо → кичирейтип → Supabase Storage'га жүктөө.
// Натыйжа: ачык URL (ал чакырууга/видеого жазылат). Сервер кодусуз.
(function () {
  "use strict";
  var S = (window.SITE && window.SITE.storage) || {};
  var MAX_BYTES = 2.8 * 1024 * 1024; // бакеттин чеги 3 МБ

  function enabled() { return !!(S.url && S.key && S.bucket); }

  function decode(file) {
    if (window.createImageBitmap) {
      return createImageBitmap(file, { imageOrientation: "from-image" }).catch(function () { return viaImg(file); });
    }
    return viaImg(file);
  }
  function viaImg(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { res(im); setTimeout(function () { URL.revokeObjectURL(url); }, 3000); };
      im.onerror = function () { URL.revokeObjectURL(url); rej(new Error("decode")); };
      im.src = url;
    });
  }

  // Сүрөттү кичирейтет: узун жагы maxSide px, JPEG
  function compress(file) {
    return decode(file).then(function (img) {
      var w = img.width || img.naturalWidth, h = img.height || img.naturalHeight;
      var side = S.maxSide || 1600, k = Math.min(1, side / Math.max(w, h));
      var cw = Math.round(w * k), ch = Math.round(h * k);
      function render(scale, q) {
        var c = document.createElement("canvas"); c.width = Math.round(cw * scale); c.height = Math.round(ch * scale);
        var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        return new Promise(function (res, rej) { c.toBlob(function (b) { b ? res(b) : rej(new Error("encode")); }, "image/jpeg", q); });
      }
      function attempt(scale, q) {
        return render(scale, q).then(function (b) {
          if (b.size <= MAX_BYTES || scale < 0.4) return b;
          return attempt(scale * 0.8, Math.max(0.6, q - 0.08));
        });
      }
      return attempt(1, 0.84);
    });
  }

  function rid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "");
    return Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  // Жүктөө (прогресс менен): XHR, анткени fetch жүктөө прогрессин бербейт
  function put(bucket, name, blob, type, onProgress) {
    return new Promise(function (res, rej) {
      var x = new XMLHttpRequest();
      x.open("POST", S.url + "/storage/v1/object/" + bucket + "/" + name);
      x.setRequestHeader("apikey", S.key); x.setRequestHeader("Authorization", "Bearer " + S.key);
      x.setRequestHeader("Content-Type", type); x.setRequestHeader("x-upsert", "false");
      if (onProgress && x.upload) x.upload.onprogress = function (e) { if (e.lengthComputable) onProgress(e.loaded / e.total); };
      x.onload = function () { x.status >= 200 && x.status < 300 ? res(S.url + "/storage/v1/object/public/" + bucket + "/" + name) : rej(new Error("upload " + x.status)); };
      x.onerror = function () { rej(new Error("network")); };
      x.send(blob);
    });
  }
  function upload(blob) { return put(S.bucket, "u/" + rid() + ".jpg", blob, "image/jpeg"); }

  // Бир файл: кичирейтүү + жүктөө → URL
  function add(file) { return compress(file).then(upload); }

  // Музыка: mp3 / m4a / aac (кичирейтилбейт, өлчөмү текшерилет)
  function audioKind(file) {
    var n = (file.name || "").toLowerCase(), t = (file.type || "").toLowerCase();
    if (/\.mp3$/.test(n) || t === "audio/mpeg" || t === "audio/mp3") return { ext: "mp3", type: "audio/mpeg" };
    if (/\.(m4a|mp4)$/.test(n) || t === "audio/mp4" || t === "audio/x-m4a" || t === "audio/m4a") return { ext: "m4a", type: "audio/mp4" };
    if (/\.aac$/.test(n) || t === "audio/aac") return { ext: "aac", type: "audio/aac" };
    return null;
  }
  function music(file, onProgress) {
    var k = audioKind(file);
    if (!k) return Promise.reject(new Error("format"));
    var maxMB = S.maxMusicMB || 8;
    if (file.size > maxMB * 1024 * 1024) { var e = new Error("size"); e.maxMB = maxMB; return Promise.reject(e); }
    return put(S.musicBucket || "samara-music", "u/" + rid() + "." + k.ext, file, k.type, onProgress);
  }

  window.Photos = { enabled: enabled, add: add, compress: compress, music: music };
})();
