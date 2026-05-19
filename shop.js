/**
 * ============================================================
 *  AFTERHRS — shop.js
 *  Features: Category Filter, Quick View Modal, Add to Cart
 *  PLACE: <script src="shop.js"> at bottom of shop.html
 * ============================================================
 *
 *  VIVA EXPLANATION:
 *  "I read each product card's category label and match it
 *   to the active filter button. Non-matching cards get hidden
 *   with a CSS class. The quick view modal reads data stored
 *   directly on each card using data-* attributes."
 */

document.addEventListener("DOMContentLoaded", function () {
  setupFilters();
  setupQuickView();
  setupAddToCartOnCards();
  injectQuickViewButtons();
});


// ── 1. CATEGORY FILTER ────────────────────────────────────────

/**
 * setupFilters()
 * Makes the filter bar buttons on shop.html actually work.
 * Clicking a filter shows only matching product cards.
 */
function setupFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".product-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // Stop anchor tags from navigating away
      e.preventDefault();

      // Update active button styling
      filterBtns.forEach((b) => b.classList.remove("active-filter"));
      this.classList.add("active-filter");

      const selected = this.textContent.trim().toLowerCase();

      // Show/hide cards based on category
      cards.forEach((card) => {
        const category = card.querySelector(".card-category");
        if (!category) return;

        const cardCat = category.textContent.trim().toLowerCase();

        if (selected === "all" || cardCat === selected) {
          // Show: remove hidden class
          card.classList.remove("card-hidden");
          card.classList.add("card-visible");
        } else {
          // Hide: add hidden class (CSS handles opacity + display)
          card.classList.remove("card-visible");
          card.classList.add("card-hidden");
        }
      });
    });
  });
}


// ── 2. INJECT QUICK VIEW BUTTONS ON CARDS ─────────────────────

/**
 * injectQuickViewButtons()
 * Adds a "Quick View" hover button to every product card.
 * The button appears on hover via CSS.
 */
function injectQuickViewButtons() {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    // Don't add if already done
    if (card.querySelector(".quick-view-btn")) return;

    // Read product data from the card's DOM
    const name     = card.querySelector(".card-name")?.textContent || "Product";
    const price    = card.querySelector(".card-price")?.textContent || "₹0";
    const category = card.querySelector(".card-category")?.textContent || "";
    const imgSrc   = card.querySelector("img")?.src || "";

    // Store as data attributes for the modal to read
    card.dataset.name     = name;
    card.dataset.price    = price;
    card.dataset.category = category;
    card.dataset.image    = imgSrc;

    // Wrap card content in a relative container for button positioning
    card.style.position = "relative";
    card.style.overflow = "hidden";

    // Create the button
    const btn = document.createElement("button");
    btn.className = "quick-view-btn";
    btn.textContent = "Quick View";
    btn.addEventListener("click", function (e) {
      e.preventDefault();  // don't follow any link
      e.stopPropagation(); // don't trigger card click
      openQuickView(card.dataset);
    });

    card.appendChild(btn);
  });
}


// ── 3. QUICK VIEW MODAL ───────────────────────────────────────

/**
 * setupQuickView()
 * Creates the modal HTML once and attaches it to the body.
 * The modal is shown/hidden using a CSS class.
 */
function setupQuickView() {
  if (document.getElementById("quick-view-modal")) return; // already exists

  const modal = document.createElement("div");
  modal.id = "quick-view-modal";
  modal.innerHTML = `
    <div class="qv-overlay" id="qv-overlay"></div>
    <div class="qv-panel">
      <button class="qv-close" id="qv-close">✕</button>
      <div class="qv-content">
        <div class="qv-image-side">
          <img id="qv-img" src="" alt="Product" />
        </div>
        <div class="qv-info-side">
          <p id="qv-category" class="product-category-label"></p>
          <h2 id="qv-name" class="product-main-name"></h2>
          <p id="qv-price" class="product-price-main" style="margin-bottom:24px;"></p>
          <div id="qv-stock" class="stock-indicator">
            <div class="stock-dot"></div>
            <p class="stock-text"><strong>In Stock</strong></p>
          </div>
          <p class="size-label" style="margin-top:20px;">Select Size</p>
          <div class="size-options" id="qv-sizes">
            <button class="size-btn">S</button>
            <button class="size-btn">M</button>
            <button class="size-btn">L</button>
            <button class="size-btn">XL</button>
          </div>
          <div class="product-actions" style="margin-top:24px;">
            <button class="btn-cart" id="qv-add-btn">Add to Cart</button>
          </div>
          <a href="product.html" class="qv-full-link">View Full Product →</a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close on overlay click
  document.getElementById("qv-overlay").addEventListener("click", closeQuickView);
  document.getElementById("qv-close").addEventListener("click", closeQuickView);

  // Size selection inside modal
  setupSizeSelection("#quick-view-modal .size-btn");
}

/**
 * openQuickView(data)
 * Fills the modal with the clicked product's info and shows it.
 * data = { name, price, category, image } from card.dataset
 */
function openQuickView(data) {
  document.getElementById("qv-img").src         = data.image;
  document.getElementById("qv-category").textContent = data.category.toUpperCase();
  document.getElementById("qv-name").textContent = data.name;
  document.getElementById("qv-price").textContent = data.price;

  // Set Add to Cart for this specific product
  const addBtn = document.getElementById("qv-add-btn");
  addBtn.onclick = function () {
    const selectedSize = document.querySelector("#quick-view-modal .selected-size");
    addToCart({
      name:     data.name,
      price:    data.price,
      category: data.category,
      image:    data.image,
      size:     selectedSize ? selectedSize.textContent : "OS",
    });
    closeQuickView();
  };

  const modal = document.getElementById("quick-view-modal");
  modal.classList.add("qv-open");
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  const modal = document.getElementById("quick-view-modal");
  if (modal) modal.classList.remove("qv-open");
  document.body.style.overflow = "";
}


// ── 4. SIZE SELECTION (reusable) ──────────────────────────────

/**
 * setupSizeSelection(selector)
 * Makes size buttons toggleable — clicking one selects it,
 * clicking another deselects the old one.
 *
 * selector = CSS selector for the size buttons container
 */
function setupSizeSelection(selector) {
  const container = document.querySelector(selector)?.closest(".size-options") ||
                    document.querySelector(".size-options");
  if (!container) return;

  container.addEventListener("click", function (e) {
    if (!e.target.classList.contains("size-btn")) return;
    if (e.target.disabled) return; // sold out

    // Deselect all
    container.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("selected-size"));
    // Select clicked
    e.target.classList.add("selected-size");
  });
}


// ── 5. ADD TO CART FROM PRODUCT CARDS ─────────────────────────

/**
 * setupAddToCartOnCards()
 * This is for the product.html page specifically —
 * hooks up the main "Add to Cart" button.
 */
function setupAddToCartOnCards() {
  const mainCartBtn = document.querySelector(".btn-cart");
  if (!mainCartBtn) return;

  mainCartBtn.addEventListener("click", function () {
    const name     = document.querySelector(".product-main-name")?.textContent || "Product";
    const price    = document.querySelector(".product-price-main")?.textContent || "₹0";
    const category = document.querySelector(".product-category-label")?.textContent || "";
    const image    = document.querySelector(".product-images img")?.src || "";
    const selectedSize = document.querySelector(".size-btn.selected-size");

    if (!selectedSize) {
      // Shake the size options to indicate selection needed
      const sizeOptions = document.querySelector(".size-options");
      if (sizeOptions) {
        sizeOptions.classList.add("shake-it");
        setTimeout(() => sizeOptions.classList.remove("shake-it"), 500);
      }
      return;
    }

    addToCart({
      name:     name.replace(/\n/g, " ").trim(),
      price:    price,
      category: category,
      image:    image,
      size:     selectedSize.textContent,
    });

    // Button feedback
    this.textContent = "✓ Added";
    this.style.background = "var(--accent-gold)";
    this.style.color = "#000";
    setTimeout(() => {
      this.textContent = "Add To Cart";
      this.style.background = "";
      this.style.color = "";
    }, 1800);
  });
}
