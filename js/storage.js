/* ==========================================================
   storage.js  -  Save / load data in the browser (localStorage)
   No backend: data stays on this device only.
   ========================================================== */
(function (app) {
  "use strict";

  var U = app.utils;
  var KEYS = {
    resources: "unishare_resources_v3",
    requests: "unishare_requests_v3",
    theme: "unishare_theme"
  };

  function read(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (err) {
      /* storage full or blocked (private mode): app still works for this session */
    }
  }

  var store = (app.store = {});

  store.loadAll = function () {
    var res = read(KEYS.resources);
    var req = read(KEYS.requests);
    app.state.resources = Array.isArray(res) ? res : U.clone(app.defaultResources);
    app.state.requests = Array.isArray(req) ? req : U.clone(app.defaultRequests);
  };

  store.saveResources = function () { write(KEYS.resources, app.state.resources); };
  store.saveRequests = function () { write(KEYS.requests, app.state.requests); };

  store.resetAll = function () {
    try {
      localStorage.removeItem(KEYS.resources);
      localStorage.removeItem(KEYS.requests);
    } catch (err) { /* ignore */ }
    app.state.resources = U.clone(app.defaultResources);
    app.state.requests = U.clone(app.defaultRequests);
  };

  store.getTheme = function () {
    try { return localStorage.getItem(KEYS.theme); } catch (err) { return null; }
  };
  store.setTheme = function (theme) { write(KEYS.theme, theme); };
})(window.UniShare);
