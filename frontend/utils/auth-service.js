let AuthService = {
  register: function () {
    console.log("Registering user...");

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      console.log("Register form found");
    }

    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      let data = {
        Name: username,
        Email: email,
        Password: password,
      };

      if (AuthService.validateEmail(email) == null) {
        toastr.error("Invalid Email!");
      } else {
        $.ajax({
          url: Constants.PROJECT_BASE_URL + "auth/register",
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
          success: function (res) {
            console.log("Registration successful");
            window.location.href = "#login";
            console.log(res);
            console.log(data);
          },
          error: function (err) {
            console.log("Registration failed");
            console.log(err);
            toastr.error("Registration failed: " + err.responseText);
          }
        });
      }
    });
  },

  validateEmail: function (email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  },

  login: function () {
    console.log("Logging in user...");

    const LoginForm = document.getElementById("loginForm");
    if (!LoginForm) return;

    LoginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      console.log("Login form submitted.");

      const email = document.getElementById("email-login").value;
      const password = document.getElementById("password-login").value;

      const loginData = {
        Email: email,
        Password: password,
      };

      $.ajax({
        url: Constants.PROJECT_BASE_URL + "auth/login",
        type: "POST",
        data: JSON.stringify(loginData),
        contentType: "application/json",
        success: function (res) {
          console.log(res);
          localStorage.setItem("user_token", res.data.user_token);
          window.location.href = "#home";
        },
        error: function (err) {
          console.log(err);
          toastr.error("Login failed: " + err.responseText);
        },
      });
    });
  },

  logOut: function () {
    localStorage.removeItem("user_token");
    NavbarService.renderNavbar();
  },
};
