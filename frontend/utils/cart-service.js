let CartService = {
  initializeCart: function () {

        console.log("CartService initialized");

    const userToken = localStorage.getItem("user_token");
    if (!userToken) {
      return;
    }
    const decodedToken = jwt_decode(userToken);
    const userID = decodedToken.user.UserID;


    console.log(userID);

    const user_ID = {
      user_id: userID,
    };

    $.ajax({
      url: `http://localhost/vildankWebProject/backend/user/create-cart/${userID}`,
      type: "POST",
      data: user_ID,
      headers: {
        Authentication: `${userToken}`,
      },
      success: function (response) {
        console.log(response);
        console.log("Cart Initialized.");
      },
      error: function (error) {
        console.error("Response: " + error.innerHTML);

      },
    })


  },

  getCartID: function () {
    return new Promise((resolve, reject) => {
      const userToken = localStorage.getItem("user_token");
      if (!userToken) {
        toastr.error("You must be logged in to add to cart!");
        reject("User token not found");
        return;
      }
      const decodedToken = jwt_decode(userToken);
      const userID = decodedToken.user.UserID;
      console.log("getCartID - USER ID:" + userID);

      RestClient.get(
        `cart/${userID}`,
        async function (data) {
          let cartId = data && (data.CartID || data.cart_id);
          if (!cartId) {
            // Try to create a cart then refetch
            try {
              await $.ajax({
                url: `http://localhost/vildankWebProject/backend/user/create-cart/${userID}`,
                type: "POST",
                headers: { Authentication: `${userToken}` },
              });
              const retry = await $.ajax({
                url: `http://localhost/vildankWebProject/backend/cart/${userID}`,
                type: "GET",
                headers: { Authentication: `${userToken}` },
              });
              cartId = retry && (retry.CartID || retry.cart_id);
            } catch (e) {
              console.error("Failed to create/fetch cart", e);
            }
          }
          if (cartId) {
            console.log("CartService::getCartId() -> " + cartId);
            resolve(cartId);
          } else {
            console.error(
              "getCartID: cart_id not found in response or data is malformed.",
              data
            );
            reject("Cart ID not found in API response");
          }
        },
        function (error) {
          console.log(error);
          reject(error);
        }
      );
    });
  },

  addToCart: async function (product_id, meta) {
    console.log("CartService::addToCart");
    if (!product_id) {
      toastr.error("Missing product reference.");
      return;
    }

    let cart_ID;
    try {
      cart_ID = await CartService.getCartID();
    } catch (e) {
      toastr.error("Could not find or create a cart. Please log in again.");
      return;
    }

    console.log("CID:::");

    console.log(cart_ID);

    const data = {
      CartID: cart_ID,
      ProductID: product_id,
      quantity: 1,
    };

    console.log("endofthis");

    $.ajax({
      url: `http://localhost/vildankWebProject/backend/cart/item/new-item`,
      type: "POST",
      data: data,
      headers: {
        Authentication: `${localStorage.getItem("user_token")}`,
      },
      success: function (response) {
        console.log(response);
        console.log("Success!!!");
        // Show notification
        toastr.success((meta && meta.name) ? `${meta.name} added to cart` : "Item added to cart!");
        // Increment cart count in navbar
        document.querySelectorAll(".cart-counter").forEach(el => {
          let count = parseInt(el.textContent) || 0;
          el.textContent = count + 1;
        });
      },
      error: function (error) {
        console.log("ERROR");
        console.log(error);
        toastr.error("Failed to add item to cart.");
      }});
    

    console.log(data);
  
  },



__init: function () {
  console.log("CartService initialized");
  
  const userToken = localStorage.getItem("user_token");
  if (!userToken) {
    return;
  }
  const decodedToken = jwt_decode(userToken);
  const userID = decodedToken.user.UserID;

  console.log(userID);
  console.log("denko medenko init");

  RestClient.get(`user/cart/${userID}`, function (data) {
    const cartDiv = document.getElementById("cart-items");
    console.log(cartDiv);
    console.log("denko ::: ", data);

    if (data.cart === false || !data.cart || !data.orders || data.orders.length === 0) {
      cartDiv.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">
            <h3>Your Cart is Empty</h3>
            <p>Browse our store and add some items to your cart!</p>
          </td>
        </tr>
      `;
      return;
    }

    let rows = "";

   let totalPrice = 0.00;


    data.orders.forEach((order) => {
     let productTotal = parseFloat(order.Price) * parseInt(order.quantity);
    totalPrice += productTotal; // Add to overall total
    });

   let totalpricefloat = parseFloat(totalPrice).toFixed(2);
    
    const subtotal = document.getElementById("subtotal");
    const tax = document.getElementById("tax");
    const total = document.getElementById("total");

    
    subtotal.innerHTML = `$${totalpricefloat}`;
    let taxAmount = totalPrice * 0.1;
    
    tax.innerHTML = `$${taxAmount.toFixed(2)}`;
    
    const priceAmount = taxAmount + totalPrice + 10;

    total.innerHTML = `$${parseFloat(priceAmount).toFixed(2)}`;
    // Update cart counter bubbles
    const totalItems = data.orders.reduce((sum, order) => sum + parseInt(order.quantity), 0);
    document.querySelectorAll(".cart-counter").forEach(el => el.textContent = totalItems);
    data.orders.forEach((order) => {
      // Calculate total per product
      const productTotal = parseFloat(order.Price);
      rows += `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img src="${order.ImageURL}" alt="${order.Name}" style="width:60px; height:60px; object-fit:cover; margin-right:10px;">
              <div>
                <strong>${order.Name}</strong>
                <p class="mb-0 text-muted">${order.Description || ""}</p>
              </div>
            </div>
          </td>
          <td>$${parseFloat(order.Price).toFixed(2)}</td>
          <td>${order.quantity}</td>
          <td>$${productTotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="CartService.deleteOrder(${order.CartItemID})">
              Delete
            </button>
          </td>
        </tr>
      `;
    });

    // Set the table body with all rows
    cartDiv.innerHTML = rows;
  });
},
  countItems: function (iterable) {
    if (iterable == null) return 0;

    if (typeof iterable.length === "number") {
      return iterable.length;
    }

    if (typeof iterable.size === "number") {
      return iterable.size;
    }

    if (typeof iterable[Symbol.iterator] === "function") {
      let count = 0;
      for (const _ of iterable) {
        count++;
      }
      return count;
    }

    return 0;
  },

deleteOrder: function (cartItemID) {
  console.log("deleting item with id:", cartItemID);
  const userToken = localStorage.getItem("user_token");
  if (!userToken) {
    toastr.error("Please log in to manage your cart.");
    return;
  }
  // Assume UserService.getUserId() returns the logged-in user's ID
  const userID = UserService.getUserId();


  console.log("USER ID IS ", userID);

  

  $.ajax({
    url: `http://localhost/vildankWebProject/backend/cart/item/${cartItemID}/${userID}`,
    type: "DELETE",
    headers: {
      Authentication: `${userToken}`,
    },
    success: function (data) {
      console.log(data);
      // Check if the deletion was actually successful
      if (
        data["Success: "] &&
        data["Success: "].toString().trim().toLowerCase() === "true"
      ) {
        toastr.success("Deleted product from cart.");
      } else {
        toastr.error(data.Message || "Failed to delete product from cart.");
      }
    },
    error: function (error) {
      console.error(error);
      toastr.error("Failed to delete product from cart.");
    },
  });
},


};
