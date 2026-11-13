/* ==========================================================
   app.js  -  Starts the app: tabs (URL hash), stats, shortcuts
   ========================================================== */
(function (app) {
  "use strict";

  var U = app.utils;
  var ui = app.ui;
  var VALID_TABS = ["all", "swap", "requests", "saved"];

  /* ---------- Top counters ---------- */
  app.updateStats = function () {
    var res = app.state.resources;
    var req = app.state.requests;

    var digital = res.filter(function (r) { return r.category === "Lecture Notes" || r.category === "Previous Year Papers"; }).length;
    var physical = res.length - digital;
    var fulfilled = req.filter(function (r) { return r.fulfilled; }).length;
    var open = req.length - fulfilled;
    var saved = res.filter(function (r) { return r.bookmarked; }).length;
    var upvotes = res.reduce(function (sum, r) { return sum + (Number(r.upvotes) || 0); }, 0);

    U.$("#statDigitalCount").textContent = digital;
    U.$("#statSwapCount").textContent = physical;
    U.$("#statFulfilledCount").textContent = fulfilled + app.config.fulfilledBaseline;
    U.$("#statUpvotesCount").textContent = upvotes;
    U.$("#openRequestsCount").textContent = open;
    U.$("#savedItemsCount").textContent = saved;
  };

  /* ---------- Tabs (the tab name lives in the URL hash, e.g. #requests) ---------- */
  function showTab(tab) {
    var text = app.config.tabs[tab];
    var isRequests = tab === "requests";
    app.state.tab = tab;

    U.$$(".nav-tab").forEach(function (btn) {
      var active = btn.getAttribute("data-tab") === tab;
      btn.classList.toggle("active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    U.$("#sectionHeading").textContent = text.title;
    U.$("#sectionSubheading").textContent = text.text;
    U.$("#resourceFilterBar").hidden = isRequests;
    U.$("#resourcesViewContainer").hidden = isRequests;
    U.$("#requestBoardViewContainer").hidden = !isRequests;

    if (isRequests) app.requests.render();
    else app.resources.render();
  }

  function applyRoute() {
    var tab = window.location.hash.replace("#", "");
    showTab(VALID_TABS.indexOf(tab) === -1 ? "all" : tab);
  }

  app.navigate = function (tab) {
    if (window.location.hash === "#" + tab) applyRoute();
    else window.location.hash = tab; /* triggers hashchange -> applyRoute */
  };

  /* ---------- Start ---------- */
  function init() {
    ui.initTheme();
    ui.initModals();
    app.store.loadAll();

    app.resources.populateSelects();
    app.requests.populateSelects();
    app.resources.renderPills();
    app.resources.bind();
    app.requests.bind();

    U.$$(".nav-tab").forEach(function (btn) {
      btn.addEventListener("click", function () { app.navigate(btn.getAttribute("data-tab")); });
    });

    U.$("#brandHomeLink").addEventListener("click", function () {
      app.resources.resetFilters();
      app.navigate("all");
    });

    U.$("#resetDataBtn").addEventListener("click", function () {
      if (!window.confirm("Restore the sample data? Your shared resources, requests, votes and saves will be removed.")) return;
      app.store.resetAll();
      app.resources.resetFilters();
      app.updateStats();
      applyRoute();
      ui.toast("Sample data restored", "info");
    });

    /* "/" focuses the search box */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "/" || ui.hasOpenModal()) return;
      var tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (app.state.tab === "requests") return;
      e.preventDefault();
      U.$("#searchInput").focus();
    });

    window.addEventListener("hashchange", applyRoute);

    app.updateStats();
    applyRoute();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.UniShare);
