export const NavbarService = {
  __init: function () {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    navbar.innerHTML = "";
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      this.renderNavbar();
      if (typeof window.bindShopLinks === "function") { window.bindShopLinks(); }
      return;
    }

    let decodedToken = null;
    try {
      decodedToken = jwt_decode(userToken);
    } catch (e) {
      localStorage.removeItem("user_token");
      this.renderNavbar();
      if (typeof window.bindShopLinks === "function") { window.bindShopLinks(); }
      return;
    }
    const roleId = decodedToken && decodedToken.user ? decodedToken.user.RoleID : null;

    if (roleId === 1) {
      this.renderAdminNavbar();
      if (typeof window.bindShopLinks === "function") { window.bindShopLinks(); }
      if (window.NotificationService) { window.NotificationService.refreshNavbarCounter(true); }
    } else {
      this.renderUserNavbar();
      if (typeof window.bindShopLinks === "function") { window.bindShopLinks(); }
      if (window.NotificationService) { window.NotificationService.refreshNavbarCounter(false); }
    }
  },

  renderAdminNavbar: function () {
    const navbar = document.getElementById("navbar");
    navbar.innerHTML = "";
    navbar.innerHTML = `
      <div class="container px-4 px-lg-5">
        <a class="navbar-brand" href="index.html"><b>GAME & GEAR</b></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="shopDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
              <ul class="dropdown-menu" aria-labelledby="shopDropdown">
                <li><a class="dropdown-item" href="#products">All Products</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="phones">Phones</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="consoles">Consoles</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="pc-gadgets">PC Gadgets</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="deals">Deals & Offers</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="#console-rental">Console Rental</a></li>
            <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
            <li class="nav-item"><a class="nav-link" href="admin-panel.html">Admin Panel</a></li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-1" href="#admin-notifications">
                Notifications
                <span class="badge notif-counter">0</span>
              </a>
            </li>
          </ul>
          <form class="d-flex me-3" onsubmit="event.preventDefault(); window.location.href='#cart';">
            <button class="cart-btn" type="submit">
              <i class="bi bi-cart-fill me-1"></i> Cart
              <span class="badge bg-dark text-white ms-1 rounded-pill cart-counter">0</span>
            </button>
          </form>
          <div id="authButtons">
            <a href="#home" onclick="AuthService.logOut()" class="btn login-btn ms-3">Logout</a>
          </div>
        </div>
      </div>
    `;
  },

  renderUserNavbar: function () {
    const navbar = document.getElementById("navbar");
    navbar.innerHTML = "";
    navbar.innerHTML = `
      <div class="container px-4 px-lg-5">
        <a class="navbar-brand" href="index.html"><b>GAME & GEAR</b></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="shopDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
              <ul class="dropdown-menu" aria-labelledby="shopDropdown">
                <li><a class="dropdown-item" href="#products">All Products</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="phones">Phones</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="consoles">Consoles</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="pc-gadgets">PC Gadgets</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="deals">Deals & Offers</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="#console-rental">Console Rental</a></li>
            <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center gap-1" href="#notifications">
                Notifications
                <span class="badge notif-counter">0</span>
              </a>
            </li>
          </ul>
          <form class="d-flex me-3" onsubmit="event.preventDefault(); window.location.href='#cart';">
            <button class="cart-btn" type="submit">
              <i class="bi bi-cart-fill me-1"></i> Cart
              <span class="badge bg-dark text-white ms-1 rounded-pill cart-counter">0</span>
            </button>
          </form>
          <div id="profileSection" style="display: none;" class="ms-3">
            <a href="profile.html" class="text-decoration-none text-dark">
              <i class="bi bi-person-circle fs-4"></i>
            </a>
            <button id="logoutButton" class="btn btn-danger ms-2" style="display: none;">Logout</button>
          </div>
          <div id="authButtons">
            <a href="#home" onclick="AuthService.logOut()" class="btn register-btn ms-2">Log out</a>
          </div>
        </div>
      </div>
    `;
  },

  renderNavbar: function () {
    const navbar = document.getElementById("navbar");
    navbar.innerHTML = "";
    navbar.innerHTML = `
      <div class="container px-4 px-lg-5">
        <a class="navbar-brand" href="index.html"><b>GAME & GEAR</b></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" id="shopDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
              <ul class="dropdown-menu" aria-labelledby="shopDropdown">
                <li><a class="dropdown-item" href="#products">All Products</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="phones">Phones</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="consoles">Consoles</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="pc-gadgets">PC Gadgets</a></li>
                <li><a class="dropdown-item" href="#products" data-shop-section="deals">Deals & Offers</a></li>
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="#console-rental">Console Rental</a></li>
            <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
          </ul>
          <form class="d-flex me-3" onsubmit="event.preventDefault(); window.location.href='#cart';">
            <button class="cart-btn" type="submit">
              <i class="bi bi-cart-fill me-1"></i> Cart
              <span class="badge bg-dark text-white ms-1 rounded-pill cart-counter">0</span>
            </button>
          </form>
          <div id="profileSection" style="display: none;" class="ms-3">
            <a href="profile.html" class="text-decoration-none text-dark">
              <i class="bi bi-person-circle fs-4"></i>
            </a>
            <button id="logoutButton" class="btn btn-danger ms-2" style="display: none;">Logout</button>
          </div>
          <div id="authButtons">
            <a href="#login" class="btn login-btn ms-3">Login</a>
            <a href="#register" class="btn register-btn ms-2">Register</a>
          </div>
        </div>
      </div>
    `;
  },
};

if (typeof window !== 'undefined') {
  window.NavbarService = NavbarService;
}
