/* ==========================================================
   utils.js  -  Small helper functions used everywhere
   ========================================================== */
(function (app) {
  "use strict";

  var U = (app.utils = {});

  U.$ = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  U.$$ = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  /* Makes user text safe before putting it inside innerHTML */
  U.escapeHtml = function (value) {
    var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return map[ch];
    });
  };

  /* Runs fn only after the user stops typing for `wait` ms */
  U.debounce = function (fn, wait) {
    var timer;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  };

  U.uid = function (prefix) {
    return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  };

  U.today = function () {
    return new Date().toISOString().slice(0, 10);
  };

  U.formatDate = function (iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  U.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  U.slug = function (text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);
  };

  /* Fills a <select> from [{value,label}] (optionally keeps a first "All" option) */
  U.fillSelect = function (select, options, firstOption) {
    select.innerHTML = "";
    if (firstOption) {
      var first = document.createElement("option");
      first.value = firstOption.value;
      first.textContent = firstOption.label;
      select.appendChild(first);
    }
    options.forEach(function (opt) {
      var o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label || opt.value;
      select.appendChild(o);
    });
  };

  U.findBy = function (list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  };

  /* Lookup helper for config lists, e.g. CSS class for a category */
  U.classFor = function (list, value, fallback) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].value === value) return list[i].cssClass;
    }
    return fallback;
  };

  U.downloadText = function (filename, content) {
    var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  };
})(window.UniShare);
