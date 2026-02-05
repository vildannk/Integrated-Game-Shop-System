import { Constants } from "./constants.js";
import { formatBAM } from "./price.js";

function resolveRentalImage(url) {
  if (!url) return '';
  const v = window.__IMG_CACHE_BUST || '';
  const addBust = (u) => v ? (u + (u.includes('?') ? '&' : '?') + 'v=' + v) : u;
  if (url.startsWith('http')) return addBust(url);
  if (url.startsWith('/')) return addBust(url);
  return addBust(`${window.location.origin}/diplomski/${url}`);
}
export const ConsoleRentalService = {
  catalog: [],
  rates: {},
  selectedConsole: null,

  init: function () {
    const form = document.getElementById("console-rental-form");
    if (!form) return;

    const alreadyBound = form.dataset.bound === "true";

    this.fetchCatalog().then(() => {
      this.renderCards();
      this.populateSelect();
      this.updateRateCards();
      this.bindConsoleCards();
      if (!alreadyBound) {
        this.bindForm(form);
        this.prefillDates();
        form.dataset.bound = "true";
      }
      this.fetchMyRentals();
      this.updateSummary();
      if (this.catalog.length && !this.selectedConsole) {
        this.setSelectedConsole(this.catalog[0].Name);
      } else if (this.selectedConsole) {
        this.highlightSelected(this.selectedConsole);
      }
    });
  },

  fetchCatalog: async function () {
    try {
      const res = await fetch(Constants.PROJECT_BASE_URL + "rentals/catalog", { cache: 'no-store' });
      if (!res.ok) throw new Error("Failed to load catalog");
      const data = (await res.json()).data || [];
      this.catalog = data;
      this.rates = {};
      data.forEach(item => {
        this.rates[item.Name] = parseFloat(item.DailyRate);
      });
    } catch (e) {
      console.error(e);
      toastr.error("Unable to load console catalog.");
    }
  },

  renderCards: function () {
    const container = document.getElementById("rental-cards");
    if (!container) return;

    if (!this.catalog.length) {
      container.innerHTML = '<div class="col text-center text-muted py-5">No consoles available.</div>';
      return;
    }

    container.innerHTML = '';
    this.catalog.forEach(item => {
      container.innerHTML += `
        <div class="col-lg-3 col-md-6">
          <div class="card h-100 shadow-sm border-0 console-card" data-console-card data-console-name="${item.Name}">
            <img src="${resolveRentalImage(item.ImageURL)}" class="card-img-top" alt="${item.Name} rental">
            <div class="card-body">
              <h5 class="fw-bold">${item.Name}</h5>
              <p class="text-muted mb-1">${item.Description || ''}</p>
              <div class="fw-bold" data-console-rate></div>
            </div>
            <div class="card-footer bg-transparent border-0 text-end">
              <button class="btn btn-outline-dark btn-sm console-select-btn" type="button">Select</button>
            </div>
          </div>
        </div>
      `;
    });
  },


  setSelectedConsole: function (name) {
    this.selectedConsole = name;
    const select = document.getElementById("consoleType");
    if (select) {
      select.value = name;
    }
    this.highlightSelected(name);
    this.updateSummary();
  },

  highlightSelected: function (name) {
    document.querySelectorAll('[data-console-card]').forEach((card) => {
      const cardName = card.getAttribute('data-console-name');
      const btn = card.querySelector('.console-select-btn');
      if (cardName === name && name) {
        card.classList.add('console-selected');
        if (btn) {
          btn.textContent = 'Unselect';
          btn.classList.add('console-selected-btn');
        }
      } else {
        card.classList.remove('console-selected');
        if (btn) {
          btn.textContent = 'Select';
          btn.classList.remove('console-selected-btn');
        }
      }
    });
  },
  populateSelect: function () {
    const select = document.getElementById("consoleType");
    if (!select) return;

    select.innerHTML = '';
    this.catalog.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item.Name;
      opt.textContent = item.Name;
      select.appendChild(opt);
    });
  },

  updateRateCards: function () {
    document.querySelectorAll("[data-console-card]").forEach((card) => {
      const name = card.getAttribute("data-console-name");
      const rate = this.getDailyRate(name);
      const el = card.querySelector("[data-console-rate]");
      if (el) {
        el.textContent = `${formatBAM(rate)}/day`;
      }
    });
  },

  bindConsoleCards: function () {
    document.querySelectorAll("[data-console-card]").forEach((card) => {
      const btn = card.querySelector('.console-select-btn');
      if (!btn) return;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const consoleName = card.getAttribute("data-console-name");
        if (this.selectedConsole === consoleName) {
          this.selectedConsole = null;
          this.highlightSelected(null);
          this.clearSummary();
          return;
        }
        const select = document.getElementById("consoleType");
        if (select) {
          select.value = consoleName;
        }
        this.setSelectedConsole(consoleName);
        toastr.success(`${consoleName} selected for rental`);
      });
    });
  },

  bindForm: function (form) {
    const inputs = ["consoleType", "plan", "startDate", "endDate", "deliveryOption"];
    inputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", () => {
          if (id === 'consoleType') {
            this.setSelectedConsole(el.value);
          } else {
            this.updateSummary();
          }
        });
      }
    });

    const planSelect = document.getElementById("plan");
    const startInput = document.getElementById("startDate");
    const endInput = document.getElementById("endDate");
    if (planSelect && startInput && endInput) {
      planSelect.addEventListener("change", () => {
        const startDate = startInput.value ? new Date(startInput.value) : new Date();
        const durations = { weekend: 3, weekly: 7, monthly: 30 };
        const selected = planSelect.value;
        if (durations[selected]) {
          const newEnd = new Date(startDate);
          newEnd.setDate(startDate.getDate() + durations[selected] - 1);
          endInput.value = newEnd.toISOString().slice(0, 10);
        }
        this.updateSummary();
      });
      startInput.addEventListener("change", () => {
        if (startInput.value) {
          endInput.min = startInput.value;
          if (new Date(endInput.value) < new Date(startInput.value)) {
            endInput.value = startInput.value;
          }
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitRental();
    });
  },

  prefillDates: function () {
    const start = document.getElementById("startDate");
    const end = document.getElementById("endDate");
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 3);

    const toInputDate = (d) => d.toISOString().slice(0, 10);

    if (start && !start.value) {
      start.value = toInputDate(today);
      start.min = toInputDate(today);
    }
    if (end && !end.value) {
      end.value = toInputDate(future);
      end.min = toInputDate(today);
    }
  },

  getDays: function () {
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) return 0;

    const diffMs = endDate - startDate;
    return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
  },

  getDailyRate: function (consoleName) {
    return this.rates[consoleName] || 0;
  },

  updateSummary: function () {
    const consoleName = document.getElementById("consoleType")?.value;
    const plan = document.getElementById("plan")?.value;
    const days = this.getDays();
    const dailyRate = this.getDailyRate(consoleName);

    const planDiscount = {
      weekend: 0.05,
      weekly: 0.1,
      monthly: 0.18
    };

    let total = days * dailyRate;
    if (plan && planDiscount[plan]) {
      total = total * (1 - planDiscount[plan]);
    }

    const summary = document.getElementById("rental-summary");
    if (summary) {
      summary.querySelector("[data-summary-console]").textContent = consoleName || "Select console";
      summary.querySelector("[data-summary-days]").textContent = days || 0;
      summary.querySelector("[data-summary-rate]").textContent = `${formatBAM(dailyRate)}`;
      summary.querySelector("[data-summary-total]").textContent = `${formatBAM(total)}`;
    }
  },

  submitRental: async function () {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.info("Please log in to submit a rental request.");
      return;
    }

    const payload = {
      ConsoleName: document.getElementById("consoleType").value,
      Plan: document.getElementById("plan").value,
      StartDate: document.getElementById("startDate").value,
      EndDate: document.getElementById("endDate").value,
      DeliveryOption: document.getElementById("deliveryOption").value,
      Notes: document.getElementById("notes").value,
      DailyRate: this.getDailyRate(document.getElementById("consoleType").value)
    };

    try {
      const response = await fetch(Constants.PROJECT_BASE_URL + "rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: token
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Failed to create rental.");
      }

      toastr.success("Rental request submitted!");
      this.fetchMyRentals();
    } catch (error) {
      console.error(error);
      toastr.error(error.message);
    }
  },

  fetchMyRentals: async function () {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    try {
      const response = await fetch(Constants.PROJECT_BASE_URL + "rentals/me", {
        method: "GET",
        headers: {
          Authentication: token
        }
      });
      if (!response.ok) throw new Error("Unable to load rentals");
      const rentals = (await response.json()).data || [];
      this.renderHistory(rentals);
    } catch (error) {
      console.warn(error);
    }
  },

  renderHistory: function (rentals) {
    const tbody = document.getElementById("rental-history-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!rentals || rentals.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No rentals yet.</td></tr>`;
      return;
    }

    rentals.forEach((rental) => {
      tbody.innerHTML += `
        <tr>
          <td>${rental.ConsoleName}</td>
          <td>${rental.Plan}</td>
          <td>${rental.StartDate}</td>
          <td>${rental.EndDate}</td>
          <td>${formatBAM(rental.TotalPrice || 0)}</td>
          <td><span class="badge bg-${this.statusColor(rental.Status)}">${rental.Status}</span></td>
        </tr>
      `;
    });
  },

  statusColor: function (status) {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return "success";
      case "cancelled":
        return "secondary";
      default:
        return "warning text-dark";
    }
  }
};

if (typeof window !== 'undefined') {
  window.ConsoleRentalService = ConsoleRentalService;
}



