let ConsoleRentalService = {
  rates: {
    "PlayStation 5": 25,
    "Xbox Series X": 22,
    "Nintendo Switch OLED": 18,
    "Steam Deck OLED": 20
  },

  init: function () {
    const form = document.getElementById("console-rental-form");
    if (!form) return;

    if (form.dataset.bound === "true") {
      this.updateSummary();
      this.fetchMyRentals();
      return;
    }

    this.bindConsoleCards();
    this.bindForm(form);
    this.prefillDates();
    this.fetchMyRentals();
    this.updateSummary();
    form.dataset.bound = "true";
  },

  bindConsoleCards: function () {
    document.querySelectorAll("[data-console-card]").forEach((card) => {
      card.addEventListener("click", () => {
        const consoleName = card.getAttribute("data-console-name");
        const select = document.getElementById("consoleType");
        select.value = consoleName;
        this.updateSummary();
        toastr.success(`${consoleName} selected for rental`);
      });
    });
  },

  bindForm: function (form) {
    const inputs = ["consoleType", "plan", "startDate", "endDate", "deliveryOption"];
    inputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", () => this.updateSummary());
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
    return this.rates[consoleName] || 20;
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
      summary.querySelector("[data-summary-rate]").textContent = `$${dailyRate.toFixed(2)}`;
      summary.querySelector("[data-summary-total]").textContent = `$${total.toFixed(2)}`;
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
      const response = await fetch(Constants.PROJECT_BASE_URL + "console-rentals/", {
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
      const response = await fetch(Constants.PROJECT_BASE_URL + "console-rentals/my", {
        method: "GET",
        headers: {
          Authentication: token
        }
      });
      if (!response.ok) throw new Error("Unable to load rentals");
      const rentals = await response.json();
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
          <td>$${parseFloat(rental.TotalPrice || 0).toFixed(2)}</td>
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
