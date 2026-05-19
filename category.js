/**
 * ============================================================
 *  AFTERHRS — category.js
 *  Features: Sort Dropdown, Add to Cart from Category Page
 *  PLACE: <script src="category.js"> at bottom of category.html
 * ============================================================
 *
 *  VIVA EXPLANATION:
 *  "The sort dropdown reads the price from each card, converts
 *   it to a number by stripping the ₹ and commas, then sorts
 *   the DOM elements using JavaScript's sort() method."
 */

document.addEventListener("DOMContentLoaded", function () {
  setupSortDropdown();
  injectQuickViewButtons();  // reuse from shop.js (included via cart.js)
  setupQuickView();          // reuse modal setup
});


// ── SORT DROPDOWN ─────────────────────────────────────────────

function setupSortDropdown() {
  const sortSelect = document.querySelector(".sort-bar select");
  const grid = document.querySelector(".product-grid");

  if (!sortSelect || !grid) return;

  sortSelect.addEventListener("change", function () {
    const value = this.value;
    const cards = Array.from(grid.querySelectorAll(".product-card"));

    /**
     * Helper to get a numeric price from a card.
     * "₹6,499" → 6499
     */
    function getPrice(card) {
      const priceEl = card.querySelector(".card-price");
      if (!priceEl) return 0;
      return parseInt(priceEl.textContent.replace(/[^\d]/g, ""), 10);
    }

    if (value.includes("Low to High")) {
      cards.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (value.includes("High to Low")) {
      cards.sort((a, b) => getPrice(b) - getPrice(a));
    } else {
      // "Featured" and "Newest" — restore original DOM order
      cards.sort((a, b) => a.dataset.originalIndex - b.dataset.originalIndex);
    }

    // Save original index before first sort
    cards.forEach((card, i) => {
      if (card.dataset.originalIndex === undefined) {
        card.dataset.originalIndex = i;
      }
    });

    // Re-append in sorted order
    cards.forEach((card) => grid.appendChild(card));
  });

  // Tag cards with original index on load
  const cards = Array.from(grid.querySelectorAll(".product-card"));
  cards.forEach((card, i) => (card.dataset.originalIndex = i));
}
