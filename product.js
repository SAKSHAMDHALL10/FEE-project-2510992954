/**
 * ============================================================
 *  AFTERHRS — product.js
 *  Features: Accordion, Size Selection, Wishlist, Stock Timer
 *  PLACE: <script src="product.js"> at bottom of product.html
 * ============================================================
 *
 *  VIVA EXPLANATION:
 *  "Each accordion section has a header. When clicked, I toggle
 *   the body's display and flip the +/- icon. Size buttons work
 *   the same way — click to select, click another to switch."
 */

document.addEventListener("DOMContentLoaded", function () {
  setupAccordion();
  setupSizeButtons();
  setupWishlistBtn();
  animateStockCounter();
});


// ── 1. ACCORDION ─────────────────────────────────────────────

/**
 * setupAccordion()
 * Makes the product detail accordion sections expandable.
 * Clicking a header shows/hides its body and toggles the icon.
 */
function setupAccordion() {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach((header) => {
    header.addEventListener("click", function () {
      const body = this.nextElementSibling; // the .accordion-body
      const icon = this.querySelector(".accordion-icon");

      if (!body) return;

      const isOpen = body.style.display !== "none" && body.style.display !== "";

      if (isOpen) {
        // Collapse
        body.style.display = "none";
        if (icon) icon.textContent = "+";
      } else {
        // Expand
        body.style.display = "block";
        if (icon) icon.textContent = "−";
      }
    });
  });
}


// ── 2. SIZE BUTTON SELECTION ──────────────────────────────────

/**
 * setupSizeButtons()
 * Clicking a size button marks it as selected.
 * Sold-out buttons are skipped (they're disabled in HTML).
 */
function setupSizeButtons() {
  const sizeOptions = document.querySelector(".size-options");
  if (!sizeOptions) return;

  sizeOptions.addEventListener("click", function (e) {
    if (!e.target.classList.contains("size-btn")) return;
    if (e.target.disabled) return; // skip sold-out

    // Deselect all buttons first
    sizeOptions.querySelectorAll(".size-btn").forEach((btn) => {
      btn.classList.remove("selected-size");
    });

    // Select the clicked one
    e.target.classList.add("selected-size");
  });
}


// ── 3. WISHLIST (HEART BUTTON) ────────────────────────────────

/**
 * setupWishlistBtn()
 * Clicking the heart icon toggles a wishlist in localStorage.
 * The heart fills when an item is wishlisted.
 *
 * VIVA:
 * "I store a wishlist array in localStorage. When the heart
 *  is clicked, I check if the product is already in the list
 *  and either add or remove it."
 */
function setupWishlistBtn() {
  const btn = document.querySelector(".btn-wishlist");
  if (!btn) return;

  const productName = document.querySelector(".product-main-name")?.textContent?.trim() || "item";

  // Get current wishlist
  const wishlist = JSON.parse(localStorage.getItem("afterhrs_wishlist") || "[]");
  const isWishlisted = wishlist.includes(productName);

  // Set initial icon state
  btn.innerHTML = isWishlisted ? "♥" : "♡";
  btn.style.color = isWishlisted ? "var(--accent-gold)" : "";

  btn.addEventListener("click", function () {
    const list = JSON.parse(localStorage.getItem("afterhrs_wishlist") || "[]");
    const idx = list.indexOf(productName);

    if (idx === -1) {
      // Add to wishlist
      list.push(productName);
      btn.innerHTML = "♥";
      btn.style.color = "var(--accent-gold)";
      showWishlistToast("Saved to wishlist");
    } else {
      // Remove from wishlist
      list.splice(idx, 1);
      btn.innerHTML = "♡";
      btn.style.color = "";
    }

    localStorage.setItem("afterhrs_wishlist", JSON.stringify(list));
  });
}

function showWishlistToast(msg) {
  const t = document.createElement("div");
  t.id = "cart-toast"; // reuse same toast style
  t.innerHTML = `<span style="color:var(--accent-gold)">♥</span> &nbsp; ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("toast-visible"), 10);
  setTimeout(() => { t.classList.remove("toast-visible"); setTimeout(() => t.remove(), 400); }, 2000);
}


// ── 4. ANIMATED "ONLY X LEFT" STOCK INDICATOR ─────────────────

/**
 * animateStockCounter()
 * Randomly picks a low stock number (3-9) and shows it.
 * Adds urgency to the product page.
 *
 * CREATIVE FEATURE #1
 * VIVA:
 * "I generate a random low-stock number between 3 and 9
 *  to create a sense of urgency. It's a common ecommerce
 *  pattern that drives purchase decisions."
 */
function animateStockCounter() {
  const stockText = document.querySelector(".stock-text");
  if (!stockText) return;

  // Generate a random stock number between 3 and 9
  const stockNum = Math.floor(Math.random() * 7) + 3;
  stockText.innerHTML = `<strong>In Stock</strong> &nbsp;— Only ${stockNum} Left`;

  // If stock is 5 or less, make it pulse to grab attention
  if (stockNum <= 5) {
    const dot = document.querySelector(".stock-dot");
    if (dot) dot.style.animation = "pulse-dot 1s ease-in-out infinite";
  }
}
