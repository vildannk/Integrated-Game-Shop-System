let NavbarService = {
  __init: function () {
    const navbar = document.getElementById("navbar");
    navbar.innerHTML = "";
    const userToken = localStorage.getItem("user_token");

    if (!userToken) {
      this.renderNavbar();
      return;
    }

    const decodedToken = jwt_decode(userToken);

    const isAdmin = decodedToken.user.RoleID;

    if (isAdmin === 2) {
      console.log("ADMIN LOGGED IN!");

      this.renderAdminNavbar();
    } else if (isAdmin === 1) {
      console.log("USER Logged in!!!");

      this.renderUserNavbar();
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
                        <a class="nav-link dropdown-toggle" id="shopDropdown" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">Shop</a>
                        <ul class="dropdown-menu" aria-labelledby="shopDropdown">
                            <li><a class="dropdown-item" href="#products">All Products</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item" href="#phones">Phones</a></li>
                            <li><a class="dropdown-item" href="#consoles">Consoles</a></li>
                            <li><a class="dropdown-item" href="#pc-gadgets">PC Gadgets</a></li>
                            <li><a class="dropdown-item" href="#deals">Deals & Offers</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="#console-rental">Console Rental</a></li>
                    <li class="nav-item"><a class="nav-link" href="#admin-console-rentals">Rental Admin</a></li>
                    <li class="nav-item"><a class="nav-link" href="#blog">Blog</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
    
                <!-- Cart Button (Always Visible) -->
                <form class="d-flex me-3" onsubmit="event.preventDefault(); window.location.href='#cart';">
                    <button class="cart-btn" type="submit">
                        <i class="bi bi-cart-fill me-1"></i> Cart
                        <span class="badge bg-dark text-white ms-1 rounded-pill cart-counter">0</span>
                    </button>
                </form>
    
                <!-- Profile Icon and Logout Button (Visible if logged in) -->
              <div>
                <a href="#admin" class="nav-item">   Admin </a>
              </div>
                <!-- Login and Register Buttons (Visible if not logged in) -->
                <div id="authButtons">
                    <a href="#home" onclick = "AuthService.logOut()"class="btn login-btn ms-3">Logout</a>
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
                        <a class="nav-link dropdown-toggle" id="shopDropdown" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">Shop</a>
                        <ul class="dropdown-menu" aria-labelledby="shopDropdown">
                            <li><a class="dropdown-item" href="#products">All Products</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item" href="#phones">Phones</a></li>
                            <li><a class="dropdown-item" href="#consoles">Consoles</a></li>
                            <li><a class="dropdown-item" href="#pc-gadgets">PC Gadgets</a></li>
                            <li><a class="dropdown-item" href="#deals">Deals & Offers</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="#console-rental">Console Rental</a></li>
                    <li class="nav-item"><a class="nav-link" href="#blog">Blog</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
    
                <!-- Cart Button (Always Visible) -->
                <form class="d-flex me-3" onsubmit="event.preventDefault(); window.location.href='#cart';">
                    <button class="cart-btn" type="submit">
                        <i class="bi bi-cart-fill me-1"></i> Cart
                        <span class="badge bg-dark text-white ms-1 rounded-pill cart-counter">0</span>
                    </button>
                </form>
    
                <!-- Profile Icon and Logout Button (Visible if logged in) -->
                <div id="profileSection" style="display: none;" class="ms-3">
                    <a href="profile.html" class="text-decoration-none text-dark">
                        <i class="bi bi-person-circle fs-4"></i>
                    </a>
                    <button id="logoutButton" class="btn btn-danger ms-2" style="display: none;">Logout</button>
                </div>
    
                <!-- Login and Register Buttons (Visible if not logged in) -->
                <div id="authButtons">
                    <a href="#home" onclick = "AuthService.logOut()" class="btn register-btn ms-2">Log out</a>
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
                        <a class="nav-link dropdown-toggle" id="shopDropdown" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">Shop</a>
                        <ul class="dropdown-menu" aria-labelledby="shopDropdown">
                            <li><a class="dropdown-item" href="#products">All Products</a></li>
                            <li><hr class="dropdown-divider" /></li>
                            <li><a class="dropdown-item" href="#phones">Phones</a></li>
                            <li><a class="dropdown-item" href="#consoles">Consoles</a></li>
                            <li><a class="dropdown-item" href="#pc-gadgets">PC Gadgets</a></li>
                            <li><a class="dropdown-item" href="#deals">Deals & Offers</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="#console-rental">Console Rental</a></li>
                    <li class="nav-item"><a class="nav-link" href="#blog">Blog</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
    
                <!-- Cart Button (Always Visible) -->
                <form class="d-flex me-3" onsubmit="event.preventDefault(); window.location.href='#cart';">
                    <button class="cart-btn" type="submit">
                        <i class="bi bi-cart-fill me-1"></i> Cart
                        <span class="badge bg-dark text-white ms-1 rounded-pill cart-counter">0</span>
                    </button>
                </form>
    
                <!-- Profile Icon and Logout Button (Visible if logged in) -->
                <div id="profileSection" style="display: none;" class="ms-3">
                    <a href="profile.html" class="text-decoration-none text-dark">
                        <i class="bi bi-person-circle fs-4"></i>
                    </a>
                    <button id="logoutButton" class="btn btn-danger ms-2" style="display: none;">Logout</button>
                </div>
    
                <!-- Login and Register Buttons (Visible if not logged in) -->
                <div id="authButtons">
                    <a href="#login" class="btn login-btn ms-3">Login</a>
                    <a href="#register" class="btn register-btn ms-2">Register</a>
                </div>
            </div>
        </div>
    `;
  },

  showMore: function () {
    const shopmenu = document.getElementById("shop-flydown-menu");

    if (!shopmenu) {
      console.error("Shop menu element not found");
    }

    console.log("Mouse over shop menu");

    shopFlyDownMenu.classList.add("show");
    navbar.style.borderBottom = "none";
    navbar.style.boxShadow = "none";
  },
};
