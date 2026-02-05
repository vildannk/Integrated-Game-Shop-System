import { constant } from "../utils/constant.js";
import { AuthService } from "../utils/auth-service.js";
import { NavbarService } from "../utils/navbar-service.js";
import { CartService } from "../utils/cart-service.js";
import { ProductService } from "../utils/product-service.js";
import { ConsoleRentalService } from "../utils/console-rental-service.js";
import { ConsoleRentalAdmin } from "../utils/console-rental-admin.js";
import { AdminService } from "../utils/admin-service.js";
import { NotificationService } from "../utils/notification-service.js";

// scripts.js
window.toastr = window.toastr || {
  success: function(){},
  error: function(){},
  info: function(){},
  warning: function(){}
};
$.ajaxSetup({ cache: false });
window.__IMG_CACHE_BUST = window.__IMG_CACHE_BUST || Date.now().toString();

function updateNavbar() {
    let user = null;
    try {
        const raw = localStorage.getItem("currentUser");
        user = raw ? JSON.parse(raw) : null;
    } catch (e) {
        localStorage.removeItem("currentUser");
        user = null;
    }
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

const SHOP_SECTION_HASHES = {
    "#phones": "phones",
    "#consoles": "consoles",
    "#pc-gadgets": "pc-gadgets",
    "#deals": "deals"
};

function normalizeShopHash() {
    const hash = window.location.hash;
    if (SHOP_SECTION_HASHES[hash]) {
        sessionStorage.setItem("shopSection", SHOP_SECTION_HASHES[hash]);
        window.location.hash = "#products";
    }
}

function toggleAdminLayout() {
    const hash = window.location.hash;
    const isAdmin = hash === "#admin" || hash === "#admin-console-rentals" || hash === "#admin-notifications";
    const showNavbar = hash === "#admin-notifications";
    document.body.classList.toggle("admin-mode", isAdmin);
    document.body.classList.toggle("admin-show-navbar", showNavbar);
}

function scrollToShopSection() {
    const target = sessionStorage.getItem("shopSection");
    if (target && window.location.hash === "#products") {
        const el = document.getElementById(target);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            sessionStorage.removeItem("shopSection");
        } else {
            setTimeout(scrollToShopSection, 150);
        }
    }
}

function bindShopLinks() {
    document.querySelectorAll('[data-shop-section]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-shop-section');
            if (target) {
                sessionStorage.setItem('shopSection', target);
                if (window.location.hash !== '#products') {
                    window.location.hash = '#products';
                }
                setTimeout(scrollToShopSection, 100);
            }
        });
    });
}
window.bindShopLinks = bindShopLinks;

function applyBackendAssets() {
    document.querySelectorAll("[data-backend-src]").forEach((el) => {
        const path = el.getAttribute("data-backend-src");
        if (!path) return;
        const url = `${constant.PROJECT_BASE_URL}${path}`;
        if (el.tagName.toLowerCase() === "link") {
            el.setAttribute("href", url);
        } else {
            el.setAttribute("src", url);
        }
    });
}


function ensureViewLoaded(viewId, file) {
    const section = document.getElementById(viewId);
    if (!section) return false;
    if (section.dataset.loaded === "1") return true;
    if (section.innerHTML && section.innerHTML.trim().length > 0) {
        section.dataset.loaded = "1";
        return true;
    }
    if (typeof $ !== "undefined") {
        $(section).load("views/" + file, function () {
            section.dataset.loaded = "1";
            if (typeof onViewReady === "function") {
                onViewReady();
            }
        });
    }
    return false;
}
function initView() {
    const hash = window.location.hash || '#home';

    if (hash === '#home' && !ensureViewLoaded('home', 'home.html')) return;
    if (hash === '#products' && !ensureViewLoaded('products', 'products.html')) return;
    if (hash === '#product' && !ensureViewLoaded('product', 'product.html')) return;
    if (hash === '#cart' && !ensureViewLoaded('cart', 'cart.html')) return;
    if (hash === '#console-rental' && !ensureViewLoaded('console-rental', 'console-rental.html')) return;
    if (hash === '#login' && !ensureViewLoaded('login', 'login.html')) return;
    if (hash === '#register' && !ensureViewLoaded('register', 'register.html')) return;
    if (hash === '#about' && !ensureViewLoaded('about', 'about.html')) return;
    if (hash === '#contact' && !ensureViewLoaded('contact', 'contact.html')) return;
    if (hash === '#shipping-policy' && !ensureViewLoaded('shipping-policy', 'shipping.html')) return;
    if (hash === '#return-policy' && !ensureViewLoaded('return-policy', 'returns.html')) return;
    if (hash === '#faqs' && !ensureViewLoaded('faqs', 'faqs.html')) return;
    if (hash === '#notifications' && !ensureViewLoaded('notifications', 'notifications.html')) return;
    if (hash === '#admin-notifications' && !ensureViewLoaded('admin-notifications', 'admin-notifications.html')) return;

    NavbarService.__init();
    CartService.__init();
    if (hash === '#home') {
        ProductService.renderHomeProducts();
    }

    if (hash === '#products') {
        ProductService.getProducts();
        ProductService.renderCategorySections([
            { categoryId: 5, containerId: 'phones-products' },
            { categoryId: 6, containerId: 'consoles-products' },
            { categoryId: 7, containerId: 'pc-gadgets-products' },
            { categoryId: 8, containerId: 'deals-products' }
        ]);
    }

    if (hash === '#cart') {
        CartService.__init();
    }

    if (hash === '#console-rental') {
        ConsoleRentalService.init();
    }

    if (hash === '#admin') {
        AdminService.showAllProducts();
        AdminService.loadCategories();
    }

    if (hash === '#admin-console-rentals') {
        ConsoleRentalAdmin.load();
    }
    if (hash === '#admin-notifications') {
        NotificationService.loadAdminNotifications();
    }
    if (hash === '#notifications') {
        NotificationService.loadUserNotifications();
    }

    if (hash === '#login') {
        AuthService.login();
        const toggle = document.getElementById("togglePassword");
        if (toggle) {
            toggle.onclick = function () {
                const input = document.getElementById("password-login");
                if (!input) return;
                const isHidden = input.getAttribute("type") === "password";
                input.setAttribute("type", isHidden ? "text" : "password");
                toggle.textContent = isHidden ? "Hide" : "Show";
            };
        }
    }

    if (hash === '#register') {
        AuthService.register();
    }
}

function onViewReady() {
    bindFormHandlers();
    bindShopLinks();
    updateNavbar();
    scrollToShopSection();
    toggleAdminLayout();
    initView();
}


// ==================== INITIALIZE PAGES ====================
function initializePage() {
    updateNavbar();
    toggleAdminLayout();

    bindFormHandlers();
    bindShopLinks();
    updateNavbar();
    scrollToShopSection();
    toggleAdminLayout();
    initView();
}

function bindFormHandlers() {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", AuthService.logOut);
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm && !contactForm.dataset.bound) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = document.getElementById("name")?.value || "";
            const email = document.getElementById("email")?.value || "";
            const subject = document.getElementById("subject")?.value || "";
            const message = document.getElementById("message")?.value || "";

            $.ajax({
                url: constant.PROJECT_BASE_URL + "contact/messages",
                type: "POST",
                data: JSON.stringify({ name, email, subject, message }),
                contentType: "application/json",
                success: function () {
                    toastr.success("Message sent.");
                    contactForm.reset();
                },
                error: function (err) {
                    const msg = err?.responseJSON?.message || "Failed to send message.";
                    toastr.error(msg);
                }
            });
        });
        contactForm.dataset.bound = "1";
    }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", normalizeShopHash);
document.addEventListener("DOMContentLoaded", applyBackendAssets);
document.addEventListener("DOMContentLoaded", initializePage);
window.addEventListener("hashchange", normalizeShopHash);
window.addEventListener("hashchange", toggleAdminLayout);

$(document).ready(function () {
    if (!document.getElementById("spapp") || !$.spapp) return;
    var app = $.spapp({
        defaultView: "#home",
        templateDir: "views/"
    });

    app.route({ view: "home", onReady: onViewReady });
    app.route({ view: "products", onReady: onViewReady });
    app.route({ view: "product", onReady: onViewReady });
    app.route({ view: "cart", onReady: onViewReady });
    app.route({ view: "console-rental", onReady: onViewReady });
    app.route({ view: "login", onReady: onViewReady });
    app.route({ view: "register", onReady: onViewReady });
    app.route({ view: "about", onReady: onViewReady });
    app.route({ view: "contact", onReady: onViewReady });
    app.route({ view: "notifications", onReady: onViewReady });
    app.route({ view: "admin-notifications", onReady: onViewReady });
    app.route({ view: "shipping-policy", onReady: onViewReady });
    app.route({ view: "return-policy", onReady: onViewReady });
    app.route({ view: "faqs", onReady: onViewReady });
    app.run();
});

document.addEventListener("DOMContentLoaded", function () {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector(".mySwiper")) return;
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
