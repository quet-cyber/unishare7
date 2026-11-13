/* ==========================================================
   resources.js  -  Resource cards: filter, sort, render,
   upvote, bookmark, preview, share, delete
   ========================================================== */
(function (app) {
  "use strict";

  var U = app.utils;
  var ui = app.ui;
  var cfg = app.config;
  var R = (app.resources = {});

  /* ---------- Read current filter values from the page ---------- */
  function getFilters() {
    return {
      query: U.$("#searchInput").value.trim().toLowerCase(),
      dept: U.$("#departmentFilter").value,
      sem: U.$("#semesterFilter").value,
      sort: U.$("#sortFilter").value
    };
  }

  R.hasActiveFilters = function () {
    var f = getFilters();
    return !!(f.query || f.dept !== "All" || f.sem !== "All" || app.state.category !== "All");
  };

  /* ---------- Filtering + sorting ---------- */
  R.getFiltered = function () {
    var st = app.state;
    var f = getFilters();
    var words = f.query ? f.query.split(/\s+/) : [];

    var list = st.resources.filter(function (item) {
      if (st.tab === "swap") {
        var physical = item.category === "Textbooks" || item.category === "Lab Equipment" || item.exchangeMode !== "Free PDF";
        if (!physical) return false;
      }
      if (st.tab === "saved" && !item.bookmarked) return false;
      if (st.category !== "All" && item.category !== st.category) return false;
      if (f.dept !== "All" && item.department !== f.dept) return false;
      if (f.sem !== "All" && item.semester !== f.sem) return false;

      if (words.length) {
        var haystack = (item.title + " " + item.courseCode + " " + item.department + " " +
          item.description + " " + item.contributor).toLowerCase();
        for (var i = 0; i < words.length; i++) {
          if (haystack.indexOf(words[i]) === -1) return false;
        }
      }
      return true;
    });

    list.sort(function (a, b) {
      if (f.sort === "newest") return new Date(b.dateAdded) - new Date(a.dateAdded);
      if (f.sort === "course") return a.courseCode.localeCompare(b.courseCode);
      return b.upvotes - a.upvotes;
    });

    return list;
  };

  /* ---------- Rendering ---------- */
  function cardHtml(item) {
    var e = U.escapeHtml;
    var catClass = U.classFor(cfg.categories, item.category, "cat-lab");
    var modeClass = U.classFor(cfg.exchangeModes, item.exchangeMode, "mode-donate");
    var ctaLabel = item.exchangeMode === "Free PDF" ? "Preview & Download" : "Request Exchange";

    return (
      '<article class="resource-card">' +
        "<div>" +
          '<div class="card-top-badges">' +
            '<div class="badge-group">' +
              '<span class="course-badge">' + e(item.courseCode) + "</span>" +
              '<span class="category-badge ' + catClass + '">' + e(item.category) + "</span>" +
              (item.mine ? '<span class="mine-tag">Yours</span>' : "") +
            "</div>" +
            '<span class="exchange-badge ' + modeClass + '">' + e(item.exchangeMode) + "</span>" +
          "</div>" +
          '<h3 class="card-title">' + e(item.title) + "</h3>" +
          '<p class="card-description">' + e(item.description) + "</p>" +
          '<div class="card-meta-list">' +
            '<span class="meta-item">&#127891; ' + e(item.department) + " &bull; " + e(item.semester) + "</span>" +
            '<span class="meta-item">&#128193; ' + e(item.formatInfo) + "</span>" +
            '<span class="meta-item">&#128100; ' + e(item.contributor) + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="card-footer">' +
          '<div class="card-interactions">' +
            '<button type="button" class="icon-action-btn ' + (item.upvotedByMe ? "upvoted" : "") + '" data-action="upvote" data-id="' + e(item.id) + '" aria-pressed="' + item.upvotedByMe + '" title="Upvote this resource">' +
              "<span>&#9650;</span> <span>" + item.upvotes + "</span>" +
            "</button>" +
            '<button type="button" class="icon-action-btn ' + (item.bookmarked ? "bookmarked" : "") + '" data-action="bookmark" data-id="' + e(item.id) + '" aria-pressed="' + item.bookmarked + '" title="Save to Study Vault">' +
              (item.bookmarked ? "&#9733; Saved" : "&#9734; Save") +
            "</button>" +
            (item.mine
              ? '<button type="button" class="icon-action-btn danger" data-action="delete" data-id="' + e(item.id) + '" title="Delete your resource">&#128465; Delete</button>'
              : "") +
          "</div>" +
          '<button type="button" class="card-cta-btn" data-action="preview" data-id="' + e(item.id) + '">' + ctaLabel + "</button>" +
        "</div>" +
      "</article>"
    );
  }

  function emptyHtml() {
    var st = app.state;
    var hasSaved = st.resources.some(function (r) { return r.bookmarked; });

    if (st.tab === "saved" && !hasSaved) {
      return (
        '<div class="empty-state" style="grid-column:1/-1">' +
          "<h3>Your Study Vault is empty</h3>" +
          "<p>Tap &#9734; Save on any resource and it will show up here for quick access.</p>" +
          '<button type="button" class="btn-secondary" data-action="go-all">Browse the Vault</button>' +
        "</div>"
      );
    }
    return (
      '<div class="empty-state" style="grid-column:1/-1">' +
        "<h3>No matching resources found</h3>" +
        "<p>Try clearing the filters, or share your own study material with the campus.</p>" +
        '<button type="button" class="btn-secondary" data-action="reset-filters">Reset Filters</button>' +
      "</div>"
    );
  }

  R.render = function () {
    var list = R.getFiltered();
    var query = U.$("#searchInput").value;

    U.$("#clearSearchBtn").hidden = !query;
    U.$("#searchShortcutHint").hidden = !!query;
    U.$("#resetFiltersBtn").hidden = !R.hasActiveFilters();
    U.$("#resultsCountText").textContent = "Showing " + list.length + (list.length === 1 ? " resource" : " resources");

    U.$("#resourcesGrid").innerHTML = list.length ? list.map(cardHtml).join("") : emptyHtml();
  };

  R.resetFilters = function () {
    U.$("#searchInput").value = "";
    U.$("#departmentFilter").value = "All";
    U.$("#semesterFilter").value = "All";
    U.$("#sortFilter").value = "popular";
    app.state.category = "All";
    R.renderPills();
    R.render();
  };

  R.renderPills = function () {
    var pills = [{ value: "All", label: "All Types" }].concat(
      cfg.categories.map(function (c) { return { value: c.value, label: c.value }; })
    );
    U.$("#categoryPillsContainer").innerHTML = pills.map(function (p) {
      var active = app.state.category === p.value;
      return '<button type="button" class="pill-btn' + (active ? " active" : "") +
        '" data-category="' + U.escapeHtml(p.value) + '" aria-pressed="' + active + '">' +
        U.escapeHtml(p.label) + "</button>";
    }).join("");
  };

  /* ---------- Actions ---------- */
  function upvote(id) {
    var r = U.findBy(app.state.resources, id);
    if (!r) return;
    r.upvotedByMe = !r.upvotedByMe;
    r.upvotes += r.upvotedByMe ? 1 : -1;
    app.store.saveResources();
    app.updateStats();
    R.render();
    ui.toast(r.upvotedByMe ? "Upvoted " + r.courseCode : "Removed upvote for " + r.courseCode, "info");
  }

  function bookmark(id) {
    var r = U.findBy(app.state.resources, id);
    if (!r) return;
    r.bookmarked = !r.bookmarked;
    app.store.saveResources();
    app.updateStats();
    R.render();
    ui.toast(r.bookmarked ? "Saved to your Study Vault" : "Removed from Study Vault", "info");
  }

  function remove(id) {
    var r = U.findBy(app.state.resources, id);
    if (!r || !r.mine) return;
    if (!window.confirm('Delete "' + r.title + '"? This cannot be undone.')) return;
    app.state.resources = app.state.resources.filter(function (x) { return x.id !== id; });
    app.store.saveResources();
    app.updateStats();
    R.render();
    ui.toast("Resource deleted", "danger");
  }

  /* ---------- Preview modal ---------- */
  function openPreview(id) {
    var r = U.findBy(app.state.resources, id);
    if (!r) return;
    var e = U.escapeHtml;
    var isDigital = r.exchangeMode === "Free PDF";
    app.state.previewId = id;

    U.$("#confirmResourceActionBtn").textContent = isDigital
      ? "Download Info Sheet (" + r.downloadsCount + " downloads)"
      : "Send Exchange Request";

    U.$("#previewModalBody").innerHTML =
      '<div class="badge-group" style="margin-bottom:12px">' +
        '<span class="course-badge">' + e(r.courseCode) + "</span>" +
        '<span class="category-badge ' + U.classFor(cfg.categories, r.category, "cat-lab") + '">' + e(r.category) + "</span>" +
        '<span class="exchange-badge ' + U.classFor(cfg.exchangeModes, r.exchangeMode, "mode-donate") + '">' + e(r.exchangeMode) + "</span>" +
      "</div>" +
      '<h4 class="preview-title">' + e(r.title) + "</h4>" +
      '<p class="preview-desc">' + e(r.description) + "</p>" +
      '<div class="detail-box">' +
        "<strong>RESOURCE DETAILS &amp; PICKUP</strong>" +
        '<div class="detail-grid">' +
          '<div class="detail-item"><span>Department &amp; Semester</span><strong>' + e(r.department) + " (" + e(r.semester) + ")</strong></div>" +
          '<div class="detail-item"><span>Format / Condition</span><strong>' + e(r.formatInfo) + "</strong></div>" +
          '<div class="detail-item"><span>Shared By</span><strong>' + e(r.contributor) + "</strong></div>" +
          '<div class="detail-item"><span>Access / Pickup</span><strong>' + e(r.contact) + "</strong></div>" +
        "</div>" +
      "</div>" +
      '<p class="preview-note">Added on ' + e(U.formatDate(r.dateAdded)) + " &bull; " + r.upvotes + " peer upvotes.</p>";

    ui.openModal("previewModal");
  }

  function confirmPreviewAction() {
    var r = U.findBy(app.state.resources, app.state.previewId);
    if (!r) return;
    r.downloadsCount += 1;
    app.store.saveResources();
    ui.closeModal("previewModal");

    if (r.exchangeMode === "Free PDF") {
      /* Demo only: there is no server, so we download a text info sheet */
      var sheet =
        "UniShare - Resource Info Sheet\n" +
        "==============================\n" +
        "Title:       " + r.title + "\n" +
        "Course:      " + r.courseCode + " (" + r.department + ", " + r.semester + ")\n" +
        "Category:    " + r.category + "\n" +
        "Format:      " + r.formatInfo + "\n" +
        "Shared by:   " + r.contributor + "\n" +
        "Access at:   " + r.contact + "\n\n" +
        r.description + "\n";
      U.downloadText(r.courseCode + "-" + U.slug(r.title) + ".txt", sheet);
      ui.toast("Info sheet downloaded (demo: no real PDF stored)");
    } else {
      ui.toast("Exchange request noted for " + r.contributor + " - " + r.contact);
    }
    R.render();
  }

  /* ---------- Share form ---------- */
  function submitShareForm(event) {
    event.preventDefault();
    var form = event.target;
    var val = function (id) { return U.$("#" + id).value.trim(); };

    var item = {
      id: U.uid("res"),
      title: val("resTitle"),
      courseCode: val("resCourseCode").toUpperCase(),
      category: val("resCategory"),
      department: val("resDepartment"),
      semester: val("resSemester"),
      exchangeMode: val("resExchangeMode"),
      formatInfo: val("resFormatInfo"),
      description: val("resDescription"),
      contributor: val("resContributor"),
      contact: val("resContact"),
      dateAdded: U.today(),
      upvotes: 1, upvotedByMe: true, bookmarked: false, downloadsCount: 0, mine: true
    };

    app.state.resources.unshift(item);
    app.store.saveResources();
    form.reset();
    ui.closeModal("uploadModal");
    R.resetFilters();
    U.$("#sortFilter").value = "newest";
    app.navigate("all");
    R.render();
    app.updateStats();
    ui.toast("Published " + item.courseCode + " to UniShare!");
  }

  /* ---------- Wire up events ---------- */
  R.bind = function () {
    var search = U.$("#searchInput");
    search.addEventListener("input", U.debounce(R.render, 120));
    search.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && search.value) {
        search.value = "";
        R.render();
      }
    });
    U.$("#clearSearchBtn").addEventListener("click", function () {
      search.value = "";
      R.render();
      search.focus();
    });
    ["departmentFilter", "semesterFilter", "sortFilter"].forEach(function (id) {
      U.$("#" + id).addEventListener("change", R.render);
    });
    U.$("#resetFiltersBtn").addEventListener("click", R.resetFilters);

    U.$("#categoryPillsContainer").addEventListener("click", function (e) {
      var pill = e.target.closest(".pill-btn");
      if (!pill) return;
      app.state.category = pill.getAttribute("data-category");
      R.renderPills();
      R.render();
    });

    U.$("#resourcesGrid").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var action = btn.getAttribute("data-action");
      var id = btn.getAttribute("data-id");
      if (action === "upvote") upvote(id);
      else if (action === "bookmark") bookmark(id);
      else if (action === "preview") openPreview(id);
      else if (action === "delete") remove(id);
      else if (action === "reset-filters") R.resetFilters();
      else if (action === "go-all") app.navigate("all");
    });

    U.$("#openUploadModalBtn").addEventListener("click", function () { ui.openModal("uploadModal"); });
    U.$("#uploadResourceForm").addEventListener("submit", submitShareForm);
    U.$("#confirmResourceActionBtn").addEventListener("click", confirmPreviewAction);
  };

  /* Fill every dropdown that depends on config lists */
  R.populateSelects = function () {
    U.fillSelect(U.$("#departmentFilter"), cfg.departments, { value: "All", label: "All Departments" });
    U.fillSelect(U.$("#semesterFilter"), cfg.semesters, { value: "All", label: "All Semesters" });
    U.fillSelect(U.$("#resDepartment"), cfg.departments);
    U.fillSelect(U.$("#resSemester"), cfg.semesters);
    U.fillSelect(U.$("#resCategory"), cfg.categories);
    U.fillSelect(U.$("#resExchangeMode"), cfg.exchangeModes);
  };
})(window.UniShare);
