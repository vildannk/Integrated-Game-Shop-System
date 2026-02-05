import { Constants } from "./constants.js";
import { UserService } from "./user-service.js";
import { CartService } from "./cart-service.js";

export const OrderService = {
  openCheckoutModal: function () {
    const modalEl = document.getElementById("checkoutModal");
    const form = document.getElementById("checkoutForm");
    if (!modalEl || !form || typeof bootstrap === "undefined") return;

    if (!form.dataset.bound) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        OrderService.submitCheckout();
      });
      form.dataset.bound = "1";
    }

    const cardNumber = document.getElementById("cardNumber");
    const cardExpiry = document.getElementById("cardExpiry");
    const cardCvv = document.getElementById("cardCvv");

    if (cardNumber && !cardNumber.dataset.bound) {
      cardNumber.addEventListener("input", function () {
        const digits = this.value.replace(/\D+/g, "").slice(0, 16);
        const groups = digits.match(/.{1,4}/g) || [];
        this.value = groups.join(" ");
      });
      cardNumber.dataset.bound = "1";
    }

    if (cardCvv && !cardCvv.dataset.bound) {
      cardCvv.addEventListener("input", function () {
        this.value = this.value.replace(/\D+/g, "").slice(0, 3);
      });
      cardCvv.dataset.bound = "1";
    }

    if (cardExpiry && !cardExpiry.dataset.bound) {
      cardExpiry.addEventListener("input", function () {
        const digits = this.value.replace(/\D+/g, "").slice(0, 4);
        if (digits.length <= 2) {
          this.value = digits;
        } else {
          this.value = digits.slice(0, 2) + "/" + digits.slice(2);
        }
      });
      cardExpiry.dataset.bound = "1";
    }

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  },

  submitCheckout: function () {
    const payload = {
      shipping: {
        address: document.getElementById("shipAddress")?.value || "",
        city: document.getElementById("shipCity")?.value || "",
        postalCode: document.getElementById("shipPostal")?.value || "",
        streetNumber: document.getElementById("shipStreetNumber")?.value || "",
      },
      payment: {
        cardNumber: document.getElementById("cardNumber")?.value || "",
        nameOnCard: document.getElementById("cardName")?.value || "",
        expiry: document.getElementById("cardExpiry")?.value || "",
        cvv: document.getElementById("cardCvv")?.value || "",
      },
    };

    if (!payload.shipping.address || !payload.shipping.city || !payload.shipping.postalCode || !payload.shipping.streetNumber) {
      toastr.error("Please complete all shipping fields.");
      return;
    }

    const cardDigits = payload.payment.cardNumber.replace(/\D+/g, "");
    const cvvDigits = payload.payment.cvv.replace(/\D+/g, "");
    const expiry = payload.payment.expiry.trim();

    if (!cardDigits || !payload.payment.nameOnCard || !expiry || !cvvDigits) {
      toastr.error("Please complete all payment fields.");
      return;
    }

    if (cardDigits.length !== 16) {
      toastr.error("Card number must be 16 digits.");
      return;
    }

    if (cvvDigits.length !== 3) {
      toastr.error("CVV must be 3 digits.");
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      toastr.error("Expiry must be in MM/YY format.");
      return;
    }

    const expParts = expiry.split("/");
    const expMonth = parseInt(expParts[0], 10);
    const expYear = 2000 + parseInt(expParts[1], 10);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      toastr.error("Card expiry must be current or future date.");
      return;
    }

    payload.payment.cardNumber = cardDigits;
    payload.payment.cvv = cvvDigits;

    OrderService.purchaseItems(payload);
  },

  purchaseItems: function (payload = null) {
    const userID = UserService.getUserId();
    const userToken = localStorage.getItem("user_token");
    console.log(userID);

    $.ajax({
      url: Constants.PROJECT_BASE_URL + "cart/checkout",
      type: "POST",
      headers: {
        Authentication: userToken,
      },
      data: payload ? JSON.stringify(payload) : null,
      contentType: payload ? "application/json" : undefined,
      success: function (data) {
        console.log("Checkout successful:", data);
        toastr.success("Successfully purchased!");
        const modalEl = document.getElementById("checkoutModal");
        if (modalEl && typeof bootstrap !== "undefined") {
          bootstrap.Modal.getOrCreateInstance(modalEl).hide();
        }
        CartService.__init();
      },
      error: function (error) {
        const msg = error?.responseJSON?.message || "Purchase failed.";
        toastr.error(msg);
        console.error("Checkout failed:", error);
        CartService.__init();
      },
    });
  },
};

if (typeof window !== 'undefined') {
  window.OrderService = OrderService;
}
