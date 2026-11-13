/* ==========================================================
   ui.js  -  Toasts, modals (with keyboard support), theme
   ========================================================== */
(function (app) {
  "use strict";

  var U = app.utils;
  var ui = (app.ui = {});
  var lastFocus = {};

  /* ---------- Toast ---------- */
  ui.toast = function (message, type) {
    type = type || "success";
    var icons = { success: "&#10004;", info: "&#8505;", danger: "&#10006;" };
    var box = U.$("#toastContainer");
    var toast = document.createElement("div");
    toast.className = "toast-message toast-" + type;
    toast.setAttribute("role", "status");
    toast.innerHTML = '<span class="toast-icon">' + icons[type] + "</span><span>" + U.escapeHtml(message) + "</span>";
    box.appendChild(toast);
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3400);
  };

  /* ---------- Modals ---------- */
  function topModal() {
    var open = U.$$(".modal-overlay.open");
    return open.length ? open[open.length - 1] : null;
  }

  ui.openModal = function (id) {
    var overlay = U.$("#" + id);
    if (!overlay) return;
    lastFocus[id] = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    var target = U.$("[data-autofocus]", overlay) || U.$(".modal-dialog", overlay);
    if (target) target.focus();
  };

  ui.closeModal = function (id) {
    var overlay = typeof id === "string" ? U.$("#" + id) : id;
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    if (!topModal()) document.body.classList.remove("modal-open");
    var back = lastFocus[overlay.id];
    if (back && typeof back.focus === "function") back.focus();
  };

  ui.initModals = function () {
    /* Click on backdrop, or on any [data-close-modal] button */
    document.addEventListener("click", function (event) {
      var closer = event.target.closest("[data-close-modal]");
      if (closer) {
        ui.closeModal(closer.closest(".modal-overlay"));
        return;
      }
      if (event.target.classList.contains("modal-overlay")) {
        ui.closeModal(event.target);
      }
    });

    document.addEventListener("keydown", function (event) {
      var modal = topModal();
      if (!modal) return;

      if (event.key === "Escape") {
        ui.closeModal(modal);
        return;
      }

      /* Keep Tab key inside the open modal */
      if (event.key === "Tab") {
        var focusable = U.$$('a[href], button:not([disabled]), input:not([disabled]), select, textarea', modal);
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  };

  ui.hasOpenModal = function () { return !!topModal(); };

  /* ---------- Theme (dark / light) ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = U.$("#themeToggleBtn");
    var icon = U.$("#themeToggleIcon");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (btn) btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    if (icon) icon.innerHTML = theme === "light" ? "&#127769;" : "&#9728;&#65039;";
    if (meta) meta.setAttribute("content", theme === "light" ? "#f3f5fb" : "#070a12");
  }

  ui.initTheme = function () {
    var saved = app.store.getTheme();
    applyTheme(saved === "light" ? "light" : "dark");
    U.$("#themeToggleBtn").addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      app.store.setTheme(next);
    });
  };
})(window.UniShare);
