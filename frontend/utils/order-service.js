import { constant } from "./constant.js";
import { UserService } from "./user-service.js";
import { CartService } from "./cart-service.js";

let stripeInstance = null;
let stripeElements = null;
let stripePaymentElement = null;
let stripeClientSecret = null;
let stripeInitPromise = null;

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

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    if (stripePaymentElement && typeof stripePaymentElement.unmount === "function") {
      stripePaymentElement.unmount();
    }
    stripeClientSecret = null;
    stripeInitPromise = null;

    OrderService.prepareStripeElements();
  },

  submitCheckout: async function () {
    const payload = {
      shipping: {
        address: document.getElementById("shipAddress")?.value || "",
        city: document.getElementById("shipCity")?.value || "",
        postalCode: document.getElementById("shipPostal")?.value || "",
        streetNumber: document.getElementById("shipStreetNumber")?.value || "",
      }
    };

    if (!payload.shipping.address || !payload.shipping.city || !payload.shipping.postalCode || !payload.shipping.streetNumber) {
      toastr.error("Please complete all shipping fields.");
      return;
    }

    const submitBtn = document.querySelector("#checkoutForm button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    try {
      await OrderService.prepareStripeElements();
      if (!stripeInstance || !stripeElements) {
        throw new Error("Stripe is not initialized.");
      }

      const result = await stripeInstance.confirmPayment({
        elements: stripeElements,
        redirect: "if_required",
      });

      if (result?.error) {
        OrderService.showPaymentMessage(result.error.message || "Payment failed.");
        console.error("Stripe confirmPayment error:", result.error);
        toastr.error(result.error.message || "Payment failed.");
        return;
      }

      const intent = result?.paymentIntent;
      if (!intent || (intent.status !== "succeeded" && intent.status !== "processing")) {
        OrderService.showPaymentMessage("Payment was not completed. Please try again.");
        console.warn("Unexpected payment status:", intent?.status);
        toastr.error("Payment was not completed.");
        return;
      }

      payload.payment = { stripePaymentIntentId: intent.id };
      OrderService.purchaseItems(payload);
    } catch (err) {
      const msg = err?.message || "Failed to initialize payment.";
      OrderService.showPaymentMessage(msg);
      console.error("Checkout error:", err);
      toastr.error(msg);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  },

  purchaseItems: function (payload = null) {
    const userID = UserService.getUserId();
    const userToken = localStorage.getItem("user_token");
    console.log(userID);

    $.ajax({
      url: constant.PROJECT_BASE_URL + "cart/checkout",
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

  showPaymentMessage: function (message = "") {
    const el = document.getElementById("payment-message");
    if (el) el.textContent = message;
  },

  prepareStripeElements: function () {
    if (stripeInitPromise) return stripeInitPromise;

    stripeInitPromise = new Promise((resolve, reject) => {
      const paymentEl = document.getElementById("payment-element");
      if (!paymentEl) {
        reject(new Error("Payment element container not found."));
        return;
      }
      if (typeof Stripe === "undefined") {
        reject(new Error("Stripe.js failed to load."));
        return;
      }

      OrderService.showPaymentMessage("Loading payment form...");

      $.ajax({
        url: constant.PROJECT_BASE_URL + "stripe/config",
        type: "GET",
        success: function (config) {
          const publishableKey = config?.data?.publishableKey;
          if (!publishableKey) {
            reject(new Error("Stripe publishable key is missing."));
            return;
          }
          stripeInstance = stripeInstance || Stripe(publishableKey);

          const userToken = localStorage.getItem("user_token");
          $.ajax({
            url: constant.PROJECT_BASE_URL + "stripe/payment-intent",
            type: "POST",
            headers: {
              Authentication: userToken,
            },
            success: function (intentResponse) {
              const clientSecret = intentResponse?.data?.clientSecret;
              if (!clientSecret) {
                reject(new Error("Payment intent client secret missing."));
                return;
              }

              stripeClientSecret = clientSecret;
              if (stripePaymentElement && typeof stripePaymentElement.unmount === "function") {
                stripePaymentElement.unmount();
              }

              stripeElements = stripeInstance.elements({ clientSecret: stripeClientSecret });
              stripePaymentElement = stripeElements.create("payment");
              stripePaymentElement.mount("#payment-element");

              OrderService.showPaymentMessage("");
              resolve();
            },
            error: function (xhr) {
              const msg = xhr?.responseJSON?.message || "Failed to create payment intent.";
              console.error("Payment intent error:", xhr);
              reject(new Error(msg));
            },
          });
        },
        error: function (xhr) {
          const msg = xhr?.responseJSON?.message || "Failed to load Stripe configuration.";
          console.error("Stripe config error:", xhr);
          reject(new Error(msg));
        },
      });
    }).catch((err) => {
      OrderService.showPaymentMessage(err?.message || "Failed to load payment form.");
      console.error("Stripe init error:", err);
      stripeInitPromise = null;
      throw err;
    });

    return stripeInitPromise;
  },
};

if (typeof window !== 'undefined') {
  window.OrderService = OrderService;
}
