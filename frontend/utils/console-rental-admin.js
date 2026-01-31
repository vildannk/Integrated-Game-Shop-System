let ConsoleRentalAdmin = {
  load: async function () {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.error("Login as admin to view rentals.");
      return;
    }
    try {
      const res = await fetch(Constants.PROJECT_BASE_URL + "console-rentals/", {
        method: "GET",
        headers: {
          Authentication: token
        }
      });
      if (!res.ok) throw new Error("Failed to load rentals");
      const rentals = await res.json();
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
      const statusSelect = `
        <select class="form-select form-select-sm" data-rental="${rental.RentalID}">
          ${this.statusOption("pending", rental.Status)}
          ${this.statusOption("confirmed", rental.Status)}
          ${this.statusOption("cancelled", rental.Status)}
        </select>
      `;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${rental.RentalID}</td>
        <td>${rental.UserID}</td>
        <td>${rental.ConsoleName}</td>
        <td>${rental.Plan}</td>
        <td>${rental.StartDate} → ${rental.EndDate}</td>
        <td>$${parseFloat(rental.TotalPrice || 0).toFixed(2)}</td>
        <td>${statusSelect}</td>
        <td>
          <button class="btn btn-outline-primary btn-sm" type="button" onclick="ConsoleRentalAdmin.updateStatus(${rental.RentalID})">
            Update
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  },

  statusOption: function (value, current) {
    const selected = (current || "").toLowerCase() === value ? "selected" : "";
    return `<option value="${value}" ${selected}>${value}</option>`;
  },

  updateStatus: async function (rentalId) {
    const select = document.querySelector(`select[data-rental="${rentalId}"]`);
    if (!select) return;
    const status = select.value;
    try {
      const res = await fetch(Constants.PROJECT_BASE_URL + `console-rentals/${rentalId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authentication: localStorage.getItem("user_token")
        },
        body: JSON.stringify({ Status: status })
      });
      if (!res.ok) throw new Error("Failed to update");
      toastr.success("Status updated");
    } catch (e) {
      console.error(e);
      toastr.error("Unable to update status");
    }
  }
};
