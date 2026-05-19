/**
 * ============================================================
 *  AFTERHRS — index.js
 *  Features: Drop Countdown Timer, Scroll Reveal Animations,
 *            Custom Cursor Glow, Banner Scroll
 *  PLACE: <script src="index.js"> at bottom of index.html
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  setupCountdownTimer();
  setupScrollReveal();
  setupCustomCursor();
  setupBannerScroll();
  updateNavForUser(); // from auth.js — update nav if logged in
});


// ── 1. DROP COUNTDOWN TIMER ────────────────────────────────────

/**
 * setupCountdownTimer()
 * Shows a live countdown to the next "drop" date.
 * We set the target 7 days from first visit (stored in localStorage).
 *
 * CREATIVE FEATURE #2
 * VIVA:
 * "I create urgency by showing a countdown to the next drop.
 *  The target date is saved in localStorage so it stays the
 *  same across page refreshes. When it hits zero, it resets
 *  for the next drop cycle."
 */
function setupCountdownTimer() {
  const timerEl = document.getElementById("drop-countdown");
  if (!timerEl) return;

  // Get or set the target drop date
  let targetDate = localStorage.getItem("afterhrs_drop_date");

  if (!targetDate) {
    // Set target 7 days from now
    const future = new Date();
    future.setDate(future.getDate() + 7);
    targetDate = future.toISOString();
    localStorage.setItem("afterhrs_drop_date", targetDate);
  }

  const target = new Date(targetDate);

  // Update every second
  function tick() {
    const now   = new Date();
    const diff  = target - now;

    if (diff <= 0) {
      // Reset for the next drop
      const next = new Date();
      next.setDate(next.getDate() + 7);
      localStorage.setItem("afterhrs_drop_date", next.toISOString());
      timerEl.textContent = "LIVE NOW";
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    timerEl.innerHTML = `
      <span>${pad(days)}<small>D</small></span>
      <span>${pad(hours)}<small>H</small></span>
      <span>${pad(minutes)}<small>M</small></span>
      <span>${pad(seconds)}<small>S</small></span>
    `;
  }

  tick(); // run immediately so there's no blank flash
  setInterval(tick, 1000);
}

// Pad single digits with a leading zero: 5 → "05"
function pad(n) {
  return n < 10 ? "0" + n : n;
}


// ── 2. SCROLL REVEAL ANIMATIONS ───────────────────────────────

/**
 * setupScrollReveal()
 * Uses IntersectionObserver to fade elements in as they scroll
 * into view. We add the class "reveal-item" to elements we
 * want to animate, then use CSS to handle the actual animation.
 *
 * VIVA:
 * "IntersectionObserver fires a callback when an element enters
 *  the viewport. I add a 'visible' class, and CSS handles the
 *  fade-in transition. No JavaScript animation loop needed."
 */
function setupScrollReveal() {
  // Add reveal class to product cards and section headings
  const targets = document.querySelectorAll(
    ".product-card, .collection-card, .section-heading, .section-title"
  );

  targets.forEach((el) => el.classList.add("reveal-item"));

  // Create the observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.1 } // trigger when 10% of element is visible
  );

  targets.forEach((el) => observer.observe(el));
}


// ── 3. CUSTOM CURSOR GLOW ─────────────────────────────────────

/**
 * setupCustomCursor()
 * Creates a soft glowing circle that follows the mouse.
 * Gives the site a premium, immersive feel.
 *
 * CREATIVE FEATURE #3
 * VIVA:
 * "I track the mouse position with mousemove and move a div
 *  to match it. CSS handles the glow and blur effect.
 *  It gives the site a premium dark-mode feel."
 */
function setupCustomCursor() {
  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  document.body.appendChild(glow);

  document.addEventListener("mousemove", function (e) {
    // Offset to center the glow on the cursor
    glow.style.left = e.clientX + "px";
    glow.style.top  = e.clientY + "px";
  });

  // Make glow bigger when hovering interactive elements
  document.querySelectorAll("a, button, .product-card").forEach((el) => {
    el.addEventListener("mouseenter", () => glow.classList.add("glow-expanded"));
    el.addEventListener("mouseleave", () => glow.classList.remove("glow-expanded"));
  });
}


// ── 4. AUTO-SCROLLING BANNER STRIP ────────────────────────────

/**
 * setupBannerScroll()
 * Makes the top banner strip scroll continuously.
 * Achieved purely through CSS animation, but this JS
 * doubles the content so there's no gap at the loop point.
 */
function setupBannerScroll() {
  const banner = document.querySelector(".banner-strip p");
  if (!banner) return;

  // Duplicate the text so the scroll loop is seamless
  const original = banner.innerHTML;
  banner.innerHTML = original + "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;" + original;
  banner.style.display = "inline-block";
  banner.style.whiteSpace = "nowrap";
  banner.style.animation = "bannerScroll 20s linear infinite";
}
