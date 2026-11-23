// Заказ системасы (Supabase RPC). Таблицаларга түз жетүү жок — баары коопсуз функциялар аркылуу.
(function () {
  "use strict";
  var S = (window.SITE && window.SITE.storage) || {};
  var SECRET_KEY = "samara-admin-secret";

  function rpc(fn, body) {
    return fetch(S.url + "/rest/v1/rpc/" + fn, {
      method: "POST",
      headers: { apikey: S.key, Authorization: "Bearer " + S.key, "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (j) {
        if (!r.ok) { var e = new Error((j && j.message) || ("http " + r.status)); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  function secret() { try { return localStorage.getItem(SECRET_KEY) || ""; } catch (e) { return ""; } }
  function clean(code) { return String(code || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40); }

  var MON = { ky: ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"], ru: ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"] };
  var WDAY = { ky: ["Жекшемби","Дүйшөмбү","Шейшемби","Шаршемби","Бейшемби","Жума","Ишемби"], ru: ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"] };
  function waText(d, link) {
    var l = d.lang === "ru" ? "ru" : "ky", m = String(d.date).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/), when = "";
    if (m) {
      var wi = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).getUTCDay();
      var wk = l === "ky" ? ["Жекшемби","Дүйшөмбү","Шейшемби","Шаршемби","Бейшемби","Жума","Ишемби"][wi] : WDAY.ru[wi];
      when = wk + ", " + (+m[3]) + (l === "ky" ? "-" : " ") + MON[l][+m[2] - 1] + ", " + m[1] + (l === "ky" ? ", саат " : ", в ") + m[4] + ":" + m[5];
    }
    var v = d.venue || {}, place = [v.name, v.address].filter(Boolean).join(", ");
    var head = (d.names || []).join(" & ") + (d.heading ? " — " + d.heading : "");
    return (l === "ky" ? "Урматтуу туугандар жана достор!\n\n" : "Уважаемые родные и друзья!\n\n") + head + "\n" +
      (when ? "📅 " + when + "\n" : "") + (place ? "📍 " + place + "\n" : "") +
      (l === "ky" ? "\nСиздерди күтөбүз!\n\nЧакыруу: " : "\nЖдём вас!\n\nПриглашение: ") + link;
  }

  window.Orders = {
    waText: waText,
    enabled: function () { return !!(S.url && S.key); },
    clean: clean,
    prices: function () { return rpc("samara_prices"); },
    create: function (product, data, name, phone) { return rpc("samara_create_order", { p_product: product, p_data: data, p_name: name, p_phone: phone }); },
    get: function (code) { return rpc("samara_get_invitation", { p_code: clean(code) }); },
    // администратор
    secret: secret,
    saveSecret: function (v) { try { localStorage.setItem(SECRET_KEY, v); } catch (e) {} },
    forgetSecret: function () { try { localStorage.removeItem(SECRET_KEY); } catch (e) {} },
    adminCheck: function (v) { return rpc("samara_admin_check", { p_secret: v }); },
    list: function () { return rpc("samara_admin_list", { p_secret: secret() }); },
    setStatus: function (code, status) { return rpc("samara_admin_set_status", { p_secret: secret(), p_code: code, p_status: status }); },
    publish: function (slug, data) { return rpc("samara_admin_publish", { p_secret: secret(), p_slug: slug, p_data: data }); },
    update: function (code, data) { return rpc("samara_admin_update", { p_secret: secret(), p_code: code, p_data: data }); },
    setPrices: function (p) { return rpc("samara_admin_set_prices", { p_secret: secret(), p_prices: p }); }
  };
})();
