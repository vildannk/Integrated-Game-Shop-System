import { constant } from "./constant.js";

export const NotificationService = {
  _cache: {},
  loadUserNotifications: function () {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.error("Login to view notifications.");
      return;
    }
    fetch(constant.PROJECT_BASE_URL + "notifications/me", {
      method: "GET",
      headers: { Authentication: token }
    })
      .then(res => res.json())
      .then(res => {
        const data = res.data || [];
        this.renderUser(data);
        this.bindFilters(false);
        this.updateNavbarCounter(data);
      })
      .catch(() => {
        toastr.error("Unable to load notifications.");
      });
  },

  loadAdminNotifications: function () {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.error("Login as admin to view notifications.");
      return;
    }
    fetch(constant.PROJECT_BASE_URL + "notifications", {
      method: "GET",
      headers: { Authentication: token }
    })
      .then(res => res.json())
      .then(res => {
        const data = res.data || [];
        this.renderAdmin(data);
        this.bindFilters(true);
        this.updateNavbarCounter(data);
      })
      .catch(() => {
        toastr.error("Unable to load notifications.");
      });
  },

  renderUser: function (items) {
    const unread = document.getElementById("user-notifications-unread");
    const read = document.getElementById("user-notifications-read");
    if (!unread || !read) return;
    this._cache = {};
    items.forEach(n => { this._cache[n.NotificationID] = n; });
    const unreadItems = items.filter(n => Number(n.IsRead) !== 1);
    const readItems = items.filter(n => Number(n.IsRead) === 1);
    unread.innerHTML = unreadItems.length
      ? unreadItems.map(n => this.renderItem(n, false)).join("")
      : '<div class="text-center text-muted py-4">No unread notifications.</div>';
    read.innerHTML = readItems.length
      ? readItems.map(n => this.renderItem(n, false)).join("")
      : '<div class="text-center text-muted py-4">No read notifications.</div>';
    this.bindListClicks(false);
  },

  renderAdmin: function (items) {
    const unread = document.getElementById("admin-notifications-unread");
    const read = document.getElementById("admin-notifications-read");
    if (!unread || !read) return;
    this._cache = {};
    items.forEach(n => { this._cache[n.NotificationID] = n; });
    const unreadItems = items.filter(n => Number(n.IsRead) !== 1);
    const readItems = items.filter(n => Number(n.IsRead) === 1);
    unread.innerHTML = unreadItems.length
      ? unreadItems.map(n => this.renderItem(n, true)).join("")
      : '<div class="text-center text-muted py-4">No unread notifications.</div>';
    read.innerHTML = readItems.length
      ? readItems.map(n => this.renderItem(n, true)).join("")
      : '<div class="text-center text-muted py-4">No read notifications.</div>';
    this.bindListClicks(true);
  },

  renderItem: function (n, isAdmin) {
    const readClass = Number(n.IsRead) === 1 ? "notification-read" : "notification-unread";
    const date = n.CreatedAt ? new Date(n.CreatedAt).toLocaleString() : "";
    const refId = n.ReferenceId || n.ReferenceID || null;
    const isRental = isAdmin && (n.Type === "rental" || n.ReferenceType === "console_rental") && refId;
    const isRead = Number(n.IsRead) === 1;
    if (isRental && !n.StatusLabel && n.Message) {
      const msg = n.Message.toLowerCase();
      if (msg.includes("declined") || msg.includes("cancelled")) n.StatusLabel = "Declined";
      else if (msg.includes("accepted") || msg.includes("confirmed")) n.StatusLabel = "Accepted";
    }
    let actions = "";
    if (isRead) {
      if (isRental) {
        const label = (n.StatusLabel || "").toLowerCase() === "declined" ? "Declined" : "Accepted";
        actions = `
          <button class="btn btn-outline-primary btn-sm btn-read-disabled" type="button" disabled>${label}</button>
        `;
      } else {
        actions = `
          <button class="btn btn-outline-primary btn-sm btn-read-disabled" type="button" disabled>Read</button>
        `;
      }
    } else if (isRental) {
      actions = `
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary btn-sm" type="button" onclick="NotificationService.adminRentalDecision(${n.NotificationID}, ${refId}, 'confirmed', this)">
            Accept
          </button>
          <button class="btn btn-outline-danger btn-sm" type="button" onclick="NotificationService.adminRentalDecision(${n.NotificationID}, ${refId}, 'cancelled', this)">
            Decline
          </button>
        </div>
      `;
    } else {
      actions = `
        <button class="btn btn-outline-primary btn-sm" type="button" onclick="NotificationService.markRead(${n.NotificationID}, ${isAdmin}, this)">
          Mark read
        </button>
      `;
    }
    const statusBadge = isRental && isRead && n.StatusLabel
      ? `<span class="badge badge-rental-status ms-2">${n.StatusLabel}</span>`
      : "";
    return `
      <div class="list-group-item d-flex justify-content-between align-items-start ${readClass}" data-notif-id="${n.NotificationID}">
        <div class="ms-2 me-auto">
          <div class="fw-bold">${n.Title}${statusBadge}</div>
          <div class="text-muted small">${n.Message}</div>
          <div class="text-muted small">${date}</div>
        </div>
        ${actions}
      </div>
    `;
  },

  markRead: function (id, isAdmin, btn) {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch(constant.PROJECT_BASE_URL + "notifications/" + id + "/read", {
      method: "PATCH",
      headers: { Authentication: token }
    })
      .then(res => res.json())
      .then(() => {
        if (btn) {
          btn.textContent = "Read";
          btn.disabled = true;
          btn.classList.add("btn-read-disabled");
        }
        if (isAdmin) {
          this.loadAdminNotifications();
        } else {
          this.loadUserNotifications();
        }
      });
  },

  markUnread: function (id, isAdmin) {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch(constant.PROJECT_BASE_URL + "notifications/" + id + "/unread", {
      method: "PATCH",
      headers: { Authentication: token }
    })
      .then(res => res.json())
      .then(() => {
        if (isAdmin) {
          this.loadAdminNotifications();
        } else {
          this.loadUserNotifications();
        }
      });
  },

  markAllRead: function () {
    const list = document.querySelectorAll("#user-notifications .list-group-item button");
    list.forEach(btn => btn.click());
  },

  markAllReadAdmin: function () {
    const list = document.querySelectorAll("#admin-notifications .list-group-item button");
    list.forEach(btn => btn.click());
  },

  adminRentalDecision: function (notificationId, rentalId, status, btn) {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch(constant.PROJECT_BASE_URL + "rentals/" + rentalId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authentication: token
      },
      body: JSON.stringify({ Status: status })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update rental");
        const statusLabel = status === "confirmed" ? "Accepted" : "Declined";
        return fetch(constant.PROJECT_BASE_URL + "notifications/" + notificationId + "/read", {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authentication: token 
          },
          body: JSON.stringify({ StatusLabel: statusLabel })
        });
      })
      .then(() => {
        toastr.success(status === "confirmed" ? "Rental accepted" : "Rental declined");
        if (btn && btn.parentElement) {
          const container = btn.parentElement;
          const keepText = status === "confirmed" ? "Accepted" : "Declined";
          container.innerHTML = `<button class="btn btn-outline-primary btn-sm btn-read-disabled" type="button" disabled>${keepText}</button>`;
        }
        this.loadAdminNotifications();
      })
      .catch(() => {
        toastr.error("Unable to update rental status.");
      });
  },

  bindFilters: function (isAdmin) {
    const root = isAdmin ? "admin" : "user";
    const container = document.querySelector(isAdmin ? "#admin-notifications-page .notification-filters" : "#notifications .notification-filters");
    if (!container || container.dataset.bound) return;
    const unread = document.getElementById(`${root}-notifications-unread`);
    const read = document.getElementById(`${root}-notifications-read`);
    if (!unread || !read) return;
    container.addEventListener("click", function (e) {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      const filter = btn.dataset.filter;
      container.querySelectorAll("button[data-filter]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (filter === "read") {
        unread.classList.add("d-none");
        read.classList.remove("d-none");
      } else {
        read.classList.add("d-none");
        unread.classList.remove("d-none");
      }
    });
    container.dataset.bound = "1";
  },

  updateNavbarCounter: function (items) {
    const unreadCount = (items || []).filter(n => Number(n.IsRead) !== 1).length;
    document.querySelectorAll(".notif-counter").forEach(el => {
      el.textContent = unreadCount;
      el.style.display = unreadCount > 0 ? "inline-flex" : "none";
    });
  },

  refreshNavbarCounter: function (isAdmin) {
    const token = localStorage.getItem("user_token");
    if (!token) return;
    const url = isAdmin
      ? constant.PROJECT_BASE_URL + "notifications"
      : constant.PROJECT_BASE_URL + "notifications/me";
    fetch(url, {
      method: "GET",
      headers: { Authentication: token }
    })
      .then(res => res.json())
      .then(res => {
        const data = res.data || [];
        this.updateNavbarCounter(data);
      })
      .catch(() => {});
  },

  bindListClicks: function (isAdmin) {
    const root = isAdmin ? "admin" : "user";
    const containers = [
      document.getElementById(`${root}-notifications-unread`),
      document.getElementById(`${root}-notifications-read`)
    ];
    containers.forEach(container => {
      if (!container || container.dataset.bound) return;
      container.addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        const item = e.target.closest("[data-notif-id]");
        if (!item) return;
        const id = item.getAttribute("data-notif-id");
        this.showNotificationModal(id);
      });
      container.dataset.bound = "1";
    });
  },

  showNotificationModal: function (id) {
    const modalEl = document.getElementById("notificationModal");
    if (!modalEl || typeof bootstrap === "undefined") return;
    const titleEl = modalEl.querySelector("[data-notif-title]");
    const dateEl = modalEl.querySelector("[data-notif-date]");
    const bodyEl = modalEl.querySelector("[data-notif-body]");
    const readBtn = modalEl.querySelector("[data-notif-mark-read]");
    const unreadBtn = modalEl.querySelector("[data-notif-mark-unread]");
    const n = this._cache[id];
    if (!n) return;
    const date = n.CreatedAt ? new Date(n.CreatedAt).toLocaleString() : "";
    if (titleEl) titleEl.textContent = n.Title || "Notification";
    if (dateEl) dateEl.textContent = date;
    if (bodyEl) {
      const msg = (n.Message || "").replace(/\n/g, "<br>");
      bodyEl.innerHTML = msg;
    }
    if (readBtn) {
      readBtn.disabled = Number(n.IsRead) === 1;
      readBtn.classList.toggle("btn-read-disabled", Number(n.IsRead) === 1);
    }
    if (unreadBtn) {
      unreadBtn.disabled = Number(n.IsRead) !== 1;
      unreadBtn.classList.toggle("btn-read-disabled", Number(n.IsRead) !== 1);
    }
    if (readBtn && !readBtn.dataset.bound) {
      readBtn.addEventListener("click", () => {
        this.markRead(id, n.IsAdmin === 1);
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
      });
      readBtn.dataset.bound = "1";
    }
    if (unreadBtn && !unreadBtn.dataset.bound) {
      unreadBtn.addEventListener("click", () => {
        this.markUnread(id, n.IsAdmin === 1);
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
      });
      unreadBtn.dataset.bound = "1";
    }
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
};

if (typeof window !== 'undefined') {
  window.NotificationService = NotificationService;
}
