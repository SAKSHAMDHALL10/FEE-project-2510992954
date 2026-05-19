/**
 * ============================================================
 *  AFTERHRS — cart.js
 *  Shared utility: cart management via localStorage
 *  INCLUDE THIS FILE IN EVERY PAGE via <script src="cart.js">
 * ============================================================
 *
 *  VIVA EXPLANATION:
 *  "I store the cart as a JSON array in localStorage so it
 *   persists across pages without any backend. Every time the
 *   cart changes I update a badge in the navbar so the user
 *   always sees how many items they have."
 */

// ── 1. CART HELPERS ──────────────────────────────────────────

/**
 * getCart()
 * Reads the cart array from localStorage.
 * If nothing is stored yet, returns an empty array.
 */
function getCart() {
  const stored = localStorage.getItem("afterhrs_cart");
  return stored ? JSON.parse(stored) : [];
}

/**
 * saveCart(cart)
 * Writes the cart array back to localStorage.
 */
function saveCart(cart) {
  localStorage.setItem("afterhrs_cart", JSON.stringify(cart));
}

/**
 * addToCart(product)
 * Adds a product object to the cart.
 * If it already exists (same name), increases qty instead.
 *
 * product = { name, price, category, image, size }
 */
function addToCart(product) {
  const cart = getCart();

  // Check if this exact product+size is already in cart
  const existing = cart.find(
    (item) => item.name === product.name && item.size === product.size
  );

  if (existing) {
    existing.qty += 1; // already there → bump quantity
  } else {
    product.qty = 1;   // new item → add it
    cart.push(product);
  }

  saveCart(cart);
  updateCartBadge();   // refresh the navbar count
  showCartToast(product.name); // show a quick confirmation popup
}

/**
 * removeFromCart(index)
 * Removes an item at a given array index.
 */
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartBadge();
}

/**
 * clearCart()
 * Empties the entire cart.
 */
function clearCart() {
  localStorage.removeItem("afterhrs_cart");
  updateCartBadge();
}

/**
 * getCartTotal()
 * Returns the total price as a formatted string.
 * It strips non-numeric chars (₹, commas) before adding.
 */
function getCartTotal() {
  const cart = getCart();
  let total = 0;
  cart.forEach((item) => {
    // "₹6,499" → 6499
    const price = parseInt(item.price.replace(/[^\d]/g, ""), 10);
    total += price * item.qty;
  });
  return "₹" + total.toLocaleString("en-IN");
}


// ── 2. NAVBAR CART BADGE ─────────────────────────────────────

/**
 * updateCartBadge()
 * Finds the cart icon in the navbar and updates the count.
 * Called automatically after every cart change.
 */
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? "flex" : "none";
}


// ── 3. CART TOAST NOTIFICATION ───────────────────────────────

/**
 * showCartToast(productName)
 * Shows a small popup at the bottom-right for 2 seconds
 * to confirm an item was added to cart.
 */
function showCartToast(productName) {
  // Remove old toast if present
  const old = document.getElementById("cart-toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.id = "cart-toast";
  toast.innerHTML = `
    <span style="color:var(--accent-gold)">✓</span>
    &nbsp; <strong>${productName}</strong> added to cart
  `;
  document.body.appendChild(toast);

  // Fade in
  setTimeout(() => toast.classList.add("toast-visible"), 10);

  // Fade out after 2.5s
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}


// ── 4. CART DRAWER (SLIDE-IN PANEL) ──────────────────────────

/**
 * openCartDrawer()
 * Opens a slide-in panel from the right showing cart contents.
 * Creates the drawer HTML dynamically if it doesn't exist yet.
 */
function openCartDrawer() {
  let drawer = document.getElementById("cart-drawer");

  // Build drawer once, re-use it
  if (!drawer) {
    drawer = document.createElement("div");
    drawer.id = "cart-drawer";
    drawer.innerHTML = `
      <div class="drawer-overlay" onclick="closeCartDrawer()"></div>
      <div class="drawer-panel">
        <div class="drawer-header">
          <p class="drawer-title">Your Cart</p>
          <button class="drawer-close" onclick="closeCartDrawer()">✕</button>
        </div>
        <div class="drawer-items" id="drawer-items"></div>
        <div class="drawer-footer" id="drawer-footer"></div>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  renderCartDrawer(); // fill it with current items
  drawer.classList.add("drawer-open");
  document.body.style.overflow = "hidden"; // prevent page scroll
}

function closeCartDrawer() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.remove("drawer-open");
  document.body.style.overflow = "";
}

/**
 * renderCartDrawer()
 * Reads the cart from localStorage and renders each item
 * inside the open drawer panel.
 */
function renderCartDrawer() {
  const cart = getCart();
  const itemsEl = document.getElementById("drawer-items");
  const footerEl = document.getElementById("drawer-footer");

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="drawer-empty">
        <p>Your cart is empty.</p>
        <a href="shop.html" onclick="closeCartDrawer()">Browse Products →</a>
      </div>`;
    footerEl.innerHTML = "";
    return;
  }

  // Build list of cart items
  itemsEl.innerHTML = cart.map((item, i) => `
    <div class="drawer-item">
      <div class="drawer-item-info">
        <p class="drawer-item-name">${item.name}</p>
        <p class="drawer-item-meta">${item.category} · Size ${item.size || "OS"}</p>
        <p class="drawer-item-price">${item.price} × ${item.qty}</p>
      </div>
      <button class="drawer-remove" onclick="removeFromCart(${i}); renderCartDrawer();">✕</button>
    </div>
  `).join("");

  // Footer with total + checkout button
  footerEl.innerHTML = `
    <div class="drawer-total">
      <span>Total</span>
      <span>${getCartTotal()}</span>
    </div>
    <button class="drawer-checkout-btn" onclick="window.location.href='cart.html'">
      Proceed to Checkout
    </button>
    <button class="drawer-clear" onclick="clearCart(); renderCartDrawer();">
      Clear Cart
    </button>
  `;
}


// ── 5. RUN ON EVERY PAGE LOAD ─────────────────────────────────

/**
 * When any page loads, inject the cart icon into the navbar
 * and refresh the badge count.
 */
document.addEventListener("DOMContentLoaded", function () {
  injectCartIcon();
  updateCartBadge();
});

/**
 * injectCartIcon()
 * Adds a cart icon with a badge counter to the navbar.
 * This runs on every page so you don't have to edit each HTML file.
 */
function injectCartIcon() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  // Don't add twice
  if (document.getElementById("nav-cart-btn")) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <button id="nav-cart-btn" onclick="openCartDrawer()" 
      style="background:none; border:none; cursor:pointer; position:relative; 
             color:var(--text-muted); font-size:13px; letter-spacing:2px; 
             text-transform:uppercase; font-family:inherit; padding:0;">
      Cart
      <span id="cart-badge" 
        style="display:none; position:absolute; top:-8px; right:-14px; 
               background:var(--accent-gold); color:#000; border-radius:50%;
               width:16px; height:16px; font-size:9px; font-weight:700;
               align-items:center; justify-content:center; letter-spacing:0;">
      </span>
    </button>
  `;
  navLinks.appendChild(li);
}
