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

  window.Orders = {
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
