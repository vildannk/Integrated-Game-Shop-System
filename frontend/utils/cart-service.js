import { constant } from "./constant.js";
import { formatBAM } from "./price.js";

function resolveCartImage(url) {
  if (!url) return '';
  const v = window.__IMG_CACHE_BUST || '';
  const addBust = (u) => v ? (u + (u.includes('?') ? '&' : '?') + 'v=' + v) : u;
  if (url.startsWith('http')) return addBust(url);
  let path = url.replace(/^\//, '');
  if (path.startsWith('diplomski/')) path = path.slice('diplomski/'.length);
  if (path.startsWith('backend/')) path = path.slice('backend/'.length);
  return addBust(`${constant.PROJECT_BASE_URL}${path}`);
}

function updateCartTotals(totalPrice) {
  const subtotal = document.getElementById("subtotal");
  const tax = document.getElementById("tax");
  const total = document.getElementById("total");
  const safeTotal = Number(totalPrice) || 0;

  if (subtotal && tax && total) {
    subtotal.textContent = `${formatBAM(safeTotal)}`;
    const taxAmount = safeTotal * 0.1;
    tax.textContent = `${formatBAM(taxAmount)}`;
    total.textContent = `${formatBAM(taxAmount + safeTotal + (safeTotal > 0 ? 10 : 0))}`;
  }
}

export const CartService = {
  initializeCart: function () {
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  },

  addToCart: function (product_id, meta) {
    if (!product_id) {
      toastr.error("Missing product reference.");
      return;
    }

    const token = localStorage.getItem("user_token");
    if (!token) {
      this.initializeCart();
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.ProductID === product_id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          ProductID: product_id,
          Name: meta?.name || "Item",
          Price: meta?.price || 0,
          ImageURL: meta?.imageUrl || "",
          quantity: 1
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      toastr.success((meta && meta.name) ? `${meta.name} added to cart` : "Item added to cart!");
      this.__init();
      return;
    }

    $.ajax({
      url: constant.PROJECT_BASE_URL + "cart/items",
      type: "POST",
      data: JSON.stringify({ ProductID: product_id, quantity: 1 }),
      contentType: "application/json",
      headers: {
        Authentication: token,
      },
      success: () => {
        toastr.success((meta && meta.name) ? `${meta.name} added to cart` : "Item added to cart!");
        this.__init();
      },
      error: (error) => {
        console.error(error);
        toastr.error("Failed to add item to cart.");
      }
    });
  },

  __init: function () {
    const token = localStorage.getItem("user_token");
    const cartDiv = document.getElementById("cart-items");

    if (!token) {
      this.initializeCart();
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalItems = cart.reduce((sum, item) => sum + parseInt(item.quantity), 0);
      document.querySelectorAll(".cart-counter").forEach(el => el.textContent = totalItems);

      if (!cartDiv) {
        return;
      }

      if (!cart.length) {
        cartDiv.innerHTML = `
          <tr>
            <td colspan="5" class="text-center">
              <h3>Your Cart is Empty</h3>
              <p>Browse our store and add some items to your cart!</p>
            </td>
          </tr>
        `;
        updateCartTotals(0);
        return;
      }

      let rows = "";
      let totalPrice = 0.0;
      cart.forEach((order, index) => {
        const itemTotal = parseFloat(order.Price) * parseInt(order.quantity);
        totalPrice += itemTotal;
        rows += `
          <tr>
            <td>
              <div class="d-flex align-items-center">
                <img src="${resolveCartImage(order.ImageURL)}" alt="${order.Name}" style="width:60px; height:60px; object-fit:cover; margin-right:10px;">
                <div>
                  <strong>${order.Name}</strong>
                </div>
              </div>
            </td>
            <td>${formatBAM(order.Price)}</td>
            <td>${order.quantity}</td>
            <td>${formatBAM(itemTotal)}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="CartService.removeLocalItem(${index})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });

      cartDiv.innerHTML = rows;
      updateCartTotals(totalPrice);
      return;
    }

    $.ajax({
      url: constant.PROJECT_BASE_URL + "cart",
      type: "GET",
      headers: {
        Authentication: token,
      },
      success: function (res) {
        const payload = res.data || {};
        const orders = payload.items || [];

        if (!cartDiv) {
          const totalItems = orders.reduce((sum, order) => sum + parseInt(order.quantity), 0);
          document.querySelectorAll(".cart-counter").forEach(el => el.textContent = totalItems);
          return;
        }

        if (!orders.length) {
          cartDiv.innerHTML = `
            <tr>
              <td colspan="5" class="text-center">
                <h3>Your Cart is Empty</h3>
                <p>Browse our store and add some items to your cart!</p>
              </td>
            </tr>
          `;
          updateCartTotals(0);
          document.querySelectorAll(".cart-counter").forEach(el => el.textContent = 0);
          return;
        }

        let rows = "";
        let totalPrice = 0.0;

        orders.forEach((order) => {
          const itemTotal = parseFloat(order.Price) * parseInt(order.quantity);
          totalPrice += itemTotal;
          rows += `
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <img src="${resolveCartImage(order.ImageURL)}" alt="${order.Name}" style="width:60px; height:60px; object-fit:cover; margin-right:10px;">
                  <div>
                    <strong>${order.Name}</strong>
                    <p class="mb-0 text-muted">${order.Description || ""}</p>
                  </div>
                </div>
              </td>
              <td>${formatBAM(order.Price)}</td>
              <td>${order.quantity}</td>
              <td>${formatBAM(itemTotal)}</td>
              <td>
                <button class="btn btn-danger btn-sm" onclick="CartService.deleteOrder(${order.CartItemID})">
                  Delete
                </button>
              </td>
            </tr>
          `;
        });

        cartDiv.innerHTML = rows;
        updateCartTotals(totalPrice);

        const totalItems = orders.reduce((sum, order) => sum + parseInt(order.quantity), 0);
        document.querySelectorAll(".cart-counter").forEach(el => el.textContent = totalItems);
      },
      error: function (err) {
        console.error(err);
      }
    });
  },

  removeLocalItem: function (index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.__init();
  },

  deleteOrder: function (cartItemID) {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toastr.error("Please log in to manage your cart.");
      return;
    }

    $.ajax({
      url: constant.PROJECT_BASE_URL + "cart/items/" + cartItemID,
      type: "DELETE",
      headers: {
        Authentication: token,
      },
      success: function () {
        toastr.success("Deleted product from cart.");
        CartService.__init();
      },
      error: function (error) {
        console.error(error);
        const msg = error?.responseJSON?.message || "Failed to delete product.";
        toastr.error(msg);
      },
    });
  },
};

export function addToCart(productId, name, price, imageUrl) {
  CartService.addToCart(productId, { name: name, price: price, imageUrl: imageUrl });
}

if (typeof window !== 'undefined') {
  window.CartService = CartService;
  window.addToCart = addToCart;
}
