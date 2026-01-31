// scripts.js

// Show/hide admin password field based on role
const roleSelect = document.getElementById("role");
if (roleSelect) {
    roleSelect.addEventListener("change", () => {
        const adminField = document.getElementById("adminPasswordField");
        adminField.style.display = roleSelect.value === "Admin" ? "block" : "none";
    });
}




// Login form handling


function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const profileSection = document.getElementById("profileSection");
    const authButtons = document.getElementById("authButtons");
    const logoutButton = document.getElementById("logoutButton");

    if (user) {
        if (profileSection) profileSection.style.display = "flex";
        if (authButtons) authButtons.style.display = "none";
        if (logoutButton) logoutButton.style.display = "inline-block";
    } else {
        if (profileSection) profileSection.style.display = "none";
        if (authButtons) authButtons.style.display = "flex";
        if (logoutButton) logoutButton.style.display = "none";
    }
}


// ==================== INITIALIZE PAGES ====================
function initializePage() {
    updateNavbar();

    // SPA route change: re-initialize after each section load
    $(document).on("spapp:contentChanged", function () {
        bindFormHandlers();
        updateNavbar(); // Re-check for login status
        if (typeof ConsoleRentalService !== "undefined") {
            ConsoleRentalService.init();
        }
        if (document.getElementById("cart-items") && typeof CartService !== "undefined") {
            CartService.__init();
        }
    });

    // Initial load
    bindFormHandlers();
    updateNavbar();
    if (typeof ConsoleRentalService !== "undefined") {
        ConsoleRentalService.init();
    }
}

function bindFormHandlers() {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            handleRegistration();
        });

        const roleSelect = document.getElementById("role");
        if (roleSelect) {
            roleSelect.addEventListener("change", function () {
                const adminField = document.getElementById("adminPasswordField");
                if (adminField) {
                    adminField.style.display = this.value === "Admin" ? "block" : "none";
                }
            });
        }
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            handleLogin();
        });
    }

    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
}



// Initialize when page loads
document.addEventListener("DOMContentLoaded", initializePage);

$(document).ready(function () {
    console.log("scripts.js loaded successfully!");

    var app = $.spapp({
        defaultView: "#home",
        templateDir: "frontend/views/"
    });

    app.run();
});
document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper(".mySwiper", {
        loop: true, 
        autoplay: {
            delay: 4000, 
            disableOnInteraction: false, 
        },
        navigation: {
            nextEl: ".swiper-button-next", 
            prevEl: ".swiper-button-prev", 
        },
        pagination: {
            el: ".swiper-pagination", 
            clickable: true, 
        },
        speed: 1000, 
    });
});

// ======================
// CART SYSTEM - MAIN CODE
// ======================

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function() {
    // Set up cart if it doesn't exist
    if (!localStorage.getItem("cart")) {
        localStorage.setItem("cart", JSON.stringify([]));
    }
    
    // Update cart counter everywhere
    updateCartCounter();
    
    // Load cart if on cart page
    if (document.getElementById("cart-items")) {
        if (typeof CartService !== "undefined") {
            CartService.__init();
        } else {
            loadCart();
        }
    }
});

// ======================
// CORE CART FUNCTIONS
// ======================

/**
 * Adds item to cart or increases quantity if already exists
 * @param {string} id - Unique product ID
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {string} image - Path to product image
 */
function addToCart(id, name, price, image) {
    // Prefer backend cart when logged in
    const hasToken = !!localStorage.getItem("user_token");
    if (typeof CartService !== "undefined" && !isNaN(parseInt(id)) && hasToken) {
        CartService.addToCart(id, { name, price, image });
        return;
    }

    // Fallback to local cart for guests
    const cart = JSON.parse(localStorage.getItem("cart"));
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex >= 0) {
        cart[existingIndex].quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    showNotification(`${name} was added to your cart!`);

    if (document.getElementById("cart-items")) {
        loadCart();
    }
}

/**
 * Loads and displays cart items
 */
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const container = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("subtotal");
    
    // Clear previous items
    container.innerHTML = "";
    
    if (cart.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">Your cart is empty</td>
            </tr>
        `;

        return;
    }
    
    let subtotal = 0;
    
    // Add each item to display
    cart.forEach((item, index) => {
        const totalPrice = item.price * item.quantity;
        subtotal += totalPrice;
        
        container.innerHTML += `
            <tr>
                <td class="align-middle">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" width="60" class="me-3 rounded">
                        ${item.name}
                    </div>
                </td>
                <td class="align-middle">$${item.price.toFixed(2)}</td>
                <td class="align-middle">
                    <input type="number" min="1" value="${item.quantity}" 
                           class="form-control form-control-sm quantity-input"
                           data-index="${index}"
                           style="width: 70px;">
                </td>
                <td class="align-middle">$${totalPrice.toFixed(2)}</td>
                <td class="align-middle">
                    <button class="btn btn-outline-danger btn-sm remove-btn" 
                            data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    // Update subtotal
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    // Add event listeners
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", function() {
            updateQuantity(this.dataset.index, this.value);
        });
    });
    
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            removeFromCart(this.dataset.index);
        });
    });
}

/**
 * Updates item quantity in cart
 */
function updateQuantity(index, newQuantity) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
    } else {
        cart.splice(index, 1); // Remove if quantity is 0
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCounter();
}

/**
 * Removes item from cart
 */
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const removedItem = cart.splice(index, 1)[0];
    localStorage.setItem("cart", JSON.stringify(cart));
    
    showNotification(`${removedItem.name} was removed from cart`);
    loadCart();
    updateCartCounter();
}

/**
 * Clears entire cart
 */
function clearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
        localStorage.setItem("cart", JSON.stringify([]));
        showNotification("Cart has been cleared");
        loadCart();
        updateCartCounter();
    }
}

// ======================
// HELPER FUNCTIONS
// ======================

/**
 * Updates cart counter in navigation
 */
function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll(".cart-counter").forEach(el => {
        el.textContent = totalItems;
    });
}

/**
 * Shows notification to user
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "cart-notification alert alert-success";
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to notification container
    const container = document.getElementById("notification-container") || createNotificationContainer();
    container.innerHTML = "";
    container.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Creates notification container if it doesn't exist
 */
function createNotificationContainer() {
    const container = document.createElement("div");
    container.id = "notification-container";
    container.className = "position-fixed top-0 end-0 p-3";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
    return container;
}

// Add JWT handling to login function


async function fetchProtectedData() {
    const token = localStorage.getItem('jwt');
    const response = await fetch('/api/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
}

function handleRegistration() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const passwordError = document.getElementById("passwordError");

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showNotification("Please enter a valid email address.");
        return;
    }
    // Password match validation
    if (password !== confirmPassword) {
        if (passwordError) passwordError.style.display = "block";
        showNotification("Passwords do not match.");
        return;
    } else {
        if (passwordError) passwordError.style.display = "none";
    }
    // Required fields validation
    if (!username || !email || !password || !confirmPassword) {
        showNotification("All fields are required.");
        return;
    }
    // If all validations pass, proceed with registration (call AuthService.register or AJAX)
    AuthService.register();
}
