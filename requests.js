/* ==========================================================
   requests.js  -  Peer request board
   ========================================================== */
(function (app) {
  "use strict";

  var U = app.utils;
  var ui = app.ui;
  var cfg = app.config;
  var Q = (app.requests = {});

  Q.render = function () {
    var status = U.$("#requestStatusFilter").value;
    var box = U.$("#requestsListContainer");

    var list = app.state.requests.filter(function (req) {
      if (status === "open") return !req.fulfilled;
      if (status === "fulfilled") return req.fulfilled;
      return true;
    });

    /* Open requests first, then newest first */
    list.sort(function (a, b) {
      if (a.fulfilled !== b.fulfilled) return a.fulfilled ? 1 : -1;
      return new Date(b.postedDate) - new Date(a.postedDate);
    });

    if (!list.length) {
      box.innerHTML =
        '<div class="empty-state"><h3>No requests in this view</h3>' +
        "<p>Post a new request if you are looking for specific notes, books, or lab gear.</p></div>";
      return;
    }

    box.innerHTML = list.map(function (req) {
      var e = U.escapeHtml;
      var urgencyClass = req.fulfilled ? "urgency-done" : (req.urgency === "Exam This Week" ? "urgency-high" : "urgency-normal");
      var label = req.fulfilled ? "Fulfilled" : req.urgency;
      var actions;

      if (req.fulfilled) {
        actions = '<span class="campus-pill" style="margin:0">&#10003; ' + e(req.fulfilledBy || "Helped") + "</span>";
      } else {
        actions = '<button type="button" class="btn-primary" data-req-id="' + e(req.id) + '">Offer Help / Fulfill</button>';
      }
      if (req.mine) {
        actions += '<button type="button" class="btn-secondary" data-req-delete="' + e(req.id) + '">&#128465; Delete</button>';
      }

      return (
        '<div class="request-card' + (req.fulfilled ? " fulfilled" : "") + '">' +
          '<div class="request-info">' +
            "<div>" +
              '<span class="urgency-tag ' + urgencyClass + '">' + e(label) + "</span>" +
              '<span class="course-badge">' + e(req.courseCode) + "</span>" +
              (req.mine ? ' <span class="mine-tag">Yours</span>' : "") +
            "</div>" +
            "<h4>" + e(req.title) + "</h4>" +
            "<p>" + e(req.details) + "</p>" +
            '<div class="request-meta">' +
              "<span>&#127979; " + e(req.department) + "</span>" +
              "<span>&#128100; " + e(req.studentName) + "</span>" +
              "<span>&#128197; " + e(U.formatDate(req.postedDate)) + "</span>" +
            "</div>" +
          "</div>" +
          '<div class="request-actions">' + actions + "</div>" +
        "</div>"
      );
    }).join("");
  };

  function fulfill(id) {
    var req = U.findBy(app.state.requests, id);
    if (!req) return;
    req.fulfilled = true;
    req.fulfilledBy = "Marked helped";
    app.store.saveRequests();
    app.updateStats();
    Q.render();
    ui.toast("Marked " + req.courseCode + " request as fulfilled. Thanks for helping!");
  }

  function remove(id) {
    var req = U.findBy(app.state.requests, id);
    if (!req || !req.mine) return;
    if (!window.confirm("Delete your request for " + req.courseCode + "?")) return;
    app.state.requests = app.state.requests.filter(function (r) { return r.id !== id; });
    app.store.saveRequests();
    app.updateStats();
    Q.render();
    ui.toast("Request deleted", "danger");
  }

  function submit(event) {
    event.preventDefault();
    var val = function (id) { return U.$("#" + id).value.trim(); };

    var req = {
      id: U.uid("req"),
      title: val("reqTitle"),
      courseCode: val("reqCourse").toUpperCase(),
      urgency: val("reqUrgency"),
      department: val("reqDepartment"),
      details: val("reqDetails"),
      studentName: val("reqStudentName"),
      postedDate: U.today(),
      fulfilled: false, fulfilledBy: "", mine: true
    };

    app.state.requests.unshift(req);
    app.store.saveRequests();
    event.target.reset();
    U.$("#requestStatusFilter").value = "all";
    app.updateStats();
    Q.render();
    ui.toast("Your request for " + req.courseCode + " is live on the board!");
  }

  Q.populateSelects = function () {
    U.fillSelect(U.$("#reqUrgency"), cfg.urgencies);
    U.fillSelect(U.$("#reqDepartment"), cfg.departments);
  };

  Q.bind = function () {
    U.$("#requestStatusFilter").addEventListener("change", Q.render);
    U.$("#newRequestForm").addEventListener("submit", submit);
    U.$("#requestsListContainer").addEventListener("click", function (e) {
      var helpBtn = e.target.closest("[data-req-id]");
      var delBtn = e.target.closest("[data-req-delete]");
      if (helpBtn) fulfill(helpBtn.getAttribute("data-req-id"));
      else if (delBtn) remove(delBtn.getAttribute("data-req-delete"));
    });
  };
})(window.UniShare);
