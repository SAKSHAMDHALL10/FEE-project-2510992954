/**
 * ============================================================
 *  AFTERHRS — auth.js
 *  Login / Signup using localStorage (no backend needed)
 *  PLACE THIS FILE: <script src="auth.js"> in auth.html
 * ============================================================
 *
 *  VIVA EXPLANATION:
 *  "I simulate authentication by saving user credentials in
 *   localStorage. On login, I check if the email exists and
 *   the password matches. On signup, I validate inputs and
 *   store the new user. I also update the navbar to show the
 *   user's name once they're logged in."
 */

document.addEventListener("DOMContentLoaded", function () {

  // ── TAB SWITCHING (Login / Sign Up) ──────────────────────────

  /**
   * The auth page has two tabs: Login and Sign Up.
   * We show one form at a time based on which tab is active.
   */
  const tabs = document.querySelectorAll(".auth-tab");
  const loginForm  = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Show login form by default
  showLoginForm();

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", function () {
      // Remove active class from both tabs
      tabs.forEach((t) => t.classList.remove("active-tab"));
      // Set clicked tab as active
      this.classList.add("active-tab");

      // index 0 = Login, index 1 = Sign Up
      if (index === 0) {
        showLoginForm();
      } else {
        showSignupForm();
      }
    });
  });

  function showLoginForm() {
    if (loginForm)  loginForm.style.display  = "block";
    if (signupForm) signupForm.style.display = "none";
  }

  function showSignupForm() {
    if (loginForm)  loginForm.style.display  = "none";
    if (signupForm) signupForm.style.display = "block";
  }


  // ── LOGIN LOGIC ───────────────────────────────────────────────

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // stop page reload

      const email    = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      // Get all registered users from localStorage
      const users = JSON.parse(localStorage.getItem("afterhrs_users") || "[]");

      // Find matching user
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // Save "logged in" session
        localStorage.setItem("afterhrs_session", JSON.stringify({
          name:  user.name,
          email: user.email,
        }));
        showAuthMessage("Welcome back, " + user.name + "! Redirecting...", "success");
        // Redirect to homepage after 1.5s
        setTimeout(() => (window.location.href = "index.html"), 1500);
      } else {
        showAuthMessage("Incorrect email or password. Please try again.", "error");
      }
    });
  }


  // ── SIGNUP LOGIC ──────────────────────────────────────────────

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name     = document.getElementById("signup-name").value.trim();
      const email    = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirm  = document.getElementById("signup-confirm").value;
      const terms    = document.getElementById("terms").checked;

      // Validate: passwords must match
      if (password !== confirm) {
        showAuthMessage("Passwords do not match.", "error");
        return;
      }

      // Validate: password at least 8 chars
      if (password.length < 8) {
        showAuthMessage("Password must be at least 8 characters.", "error");
        return;
      }

      // Validate: must agree to terms
      if (!terms) {
        showAuthMessage("Please agree to the Terms & Conditions.", "error");
        return;
      }

      // Check if email already exists
      const users = JSON.parse(localStorage.getItem("afterhrs_users") || "[]");
      const alreadyExists = users.find((u) => u.email === email);
      if (alreadyExists) {
        showAuthMessage("An account with this email already exists.", "error");
        return;
      }

      // Save new user to localStorage
      users.push({ name, email, password });
      localStorage.setItem("afterhrs_users", JSON.stringify(users));

      // Auto log them in
      localStorage.setItem("afterhrs_session", JSON.stringify({ name, email }));

      showAuthMessage("Account created! Welcome, " + name + ". Redirecting...", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    });
  }


  // ── MESSAGE DISPLAY ───────────────────────────────────────────

  /**
   * showAuthMessage(text, type)
   * Shows a styled message (success=gold, error=red) inside the auth box.
   */
  function showAuthMessage(text, type) {
    let msg = document.getElementById("auth-message");
    if (!msg) {
      msg = document.createElement("p");
      msg.id = "auth-message";
      // Insert before first form in auth-box
      const authBox = document.querySelector(".auth-box");
      const firstForm = authBox.querySelector("form");
      authBox.insertBefore(msg, firstForm);
    }
    msg.textContent = text;
    msg.style.cssText = `
      font-size: 12px;
      letter-spacing: 1px;
      padding: 12px 16px;
      margin-bottom: 20px;
      border: 1px solid ${type === "success" ? "var(--accent-gold)" : "#c0392b"};
      color: ${type === "success" ? "var(--accent-gold)" : "#e74c3c"};
      text-align: center;
      border-radius: 2px;
    `;
  }


  // ── UPDATE NAVBAR FOR LOGGED-IN STATE ─────────────────────────

  updateNavForUser();
});

/**
 * updateNavForUser()
 * If a user is logged in (session in localStorage),
 * replace "Login" link in navbar with their name + logout button.
 * This runs on every page via cart.js too (we export it globally).
 */
function updateNavForUser() {
  const session = JSON.parse(localStorage.getItem("afterhrs_session") || "null");
  const loginLink = document.querySelector('.nav-links a[href="auth.html"]');

  if (session && loginLink) {
    const li = loginLink.parentElement;
    li.innerHTML = `
      <span style="
        font-size:12px; letter-spacing:2px; color:var(--accent-gold);
        text-transform:uppercase; cursor:default;
      ">
        ${session.name.split(" ")[0]}
        <button onclick="logoutUser()" style="
          background:none; border:none; cursor:pointer; color:var(--text-muted);
          font-size:10px; letter-spacing:1px; margin-left:6px; font-family:inherit;
        ">[Logout]</button>
      </span>
    `;
  }
}

/**
 * logoutUser()
 * Clears the session from localStorage and reloads to home.
 */
function logoutUser() {
  localStorage.removeItem("afterhrs_session");
  window.location.href = "index.html";
}
