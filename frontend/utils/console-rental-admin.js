import { constant } from "./constant.js";
import { formatBAM } from "./price.js";

export const ConsoleRentalAdmin = {
  load: async function () {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.error("Login as admin to view rentals.");
      return;
    }
    try {
      const res = await fetch(constant.PROJECT_BASE_URL + "rentals", {
        method: "GET",
        headers: {
          Authentication: token
        }
      });
      if (!res.ok) throw new Error("Failed to load rentals");
      const rentals = (await res.json()).data || [];
      this.render(rentals || []);
    } catch (e) {
      console.error(e);
      toastr.error("Unable to load rentals.");
    }
  },

  render: function (rentals) {
    const tbody = document.getElementById("rental-admin-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!rentals.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No rentals yet.</td></tr>`;
      return;
    }

    rentals.forEach(rental => {
      const statusBadge = `<span class="badge bg-${this.statusColor(rental.Status)} text-white">${rental.Status}</span>`;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${rental.RentalID}</td>
        <td>${rental.UserID}</td>
        <td>${rental.ConsoleName}</td>
        <td>${rental.Plan}</td>
        <td>${rental.StartDate} - ${rental.EndDate}</td>
        <td>${formatBAM(rental.TotalPrice || 0)}</td>
        <td>${statusBadge}</td>
        <td>
          <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-outline-primary btn-sm" type="button" onclick="ConsoleRentalAdmin.updateStatusValue(${rental.RentalID}, 'confirmed')">
              Accept
            </button>
            <button class="btn btn-outline-danger btn-sm" type="button" onclick="ConsoleRentalAdmin.updateStatusValue(${rental.RentalID}, 'cancelled')">
              Decline
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });
  },

  statusColor: function (status) {
    const normalized = (status || "").toLowerCase();
    if (normalized === "confirmed") return "success";
    if (normalized === "cancelled") return "danger";
    return "secondary";
  },

  updateStatusValue: async function (rentalId, status) {
    try {
      const res = await fetch(constant.PROJECT_BASE_URL + `rentals/` + rentalId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("user_token")
        },
        body: JSON.stringify({ Status: status })
      });
      if (!res.ok) throw new Error("Failed to update");
      toastr.success(status === "confirmed" ? "Rental accepted" : "Rental declined");
      this.load();
    } catch (e) {
      console.error(e);
      toastr.error("Unable to update status");
    }
  }
};

if (typeof window !== 'undefined') {
  window.ConsoleRentalAdmin = ConsoleRentalAdmin;
}
