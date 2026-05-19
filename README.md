# AFTERHRS — Curated After Dark

> A niche streetwear e-commerce frontend built with pure HTML, CSS, and Vanilla JavaScript.

---

## 📁 Folder Structure

```
afterhrs/
├── index.html            ← Homepage (hero, countdown, products, collections)
├── shop.html             ← Full product listing with category filters
├── product.html          ← Single product detail page
├── cart.html             ← Cart page with quantity controls
├── checkout.html         ← Checkout with address + payment selection
├── order-success.html    ← Order confirmation page
├── collections.html      ← Collections grid
├── category.html         ← Category listing (Hoodies) with sort
├── about.html            ← Brand story page
├── contact.html          ← Contact form
├── auth.html             ← Login / Sign Up
│
├── style.css             ← Core site styles
├── js-enhancements.css   ← Styles for JS features (drawer, toast, modals)
├── vinyl-player.css      ← Styles for vinyl player + size chart + success page
│
├── cart.js               ← Cart logic, localStorage, drawer, toast
├── index.js              ← Countdown, scroll reveal, cursor glow, banner
├── shop.js               ← Category filter, quick view modal
├── product.js            ← Accordion, size buttons, wishlist, stock counter
├── auth.js               ← Login / signup via localStorage
├── category.js           ← Sort dropdown
├── vinyl-player.js       ← Music player widget (injected on every page)
├── size-chart.js         ← Size chart modal (injected on every page)
│
├── music/
│   └── README.txt        ← Add track1.mp3, track2.mp3, track3.mp3 here
│
└── IMAGES/
    └── index/            ← All product and campaign images
```

---

## ✅ Features

### Existing (Preserved)
- Cart drawer (slide-in from right) with badge counter
- Add to cart with toast notification
- Quick View modal on every product card
- Category filter bar on shop page
- Wishlist (heart button) with localStorage
- Drop countdown timer
- Scroll reveal animations (IntersectionObserver)
- Custom cursor glow effect
- Auto-scrolling banner strip
- Auth system (login/signup via localStorage)
- Product accordion (Details / Materials / Shipping)
- Stock urgency counter
- Sort dropdown on category page

### New Features Added
- **Vinyl Music Player** — fixed bottom-left ♫ button, opens a vinyl disc widget with play/pause/prev/next, progress bar, volume slider
- **Cart Page** — full `/cart.html` with quantity controls (+ / −), remove, promo code, live order total
- **Checkout Page** — address card selection, UPI / Card / COD payment (highlight-only, no real payment)
- **Order Success Page** — animated checkmark, displays Order ID, amount, payment method
- **Size Chart Modal** — Clothing (S/M/L/XL) and Shoes (UK 6–11) tabs, triggered from any "Size Guide" link
- **More Products** — 18 products on shop.html, 8 on index.html, quick view on all
- **Cart link in navbar** — all pages now have a direct Cart link
- **"Size Chart" button** on the Shop filter bar

---

## 🎵 Adding Music

1. Drop your `.mp3` files into the `/music/` folder
2. Name them `track1.mp3`, `track2.mp3`, `track3.mp3`
3. To add more, edit the `VP_PLAYLIST` array in `vinyl-player.js`

---

## 🛒 Cart → Checkout → Success Flow

```
Shop page → Add to Cart → Cart Drawer → cart.html
→ checkout.html (select address + payment) → Place Order
→ order-success.html (shows order ID + payment method)
```

All data stored in `localStorage`. No backend required.

---

## 🔑 Promo Code

Use code `AFTERHRS10` on the cart page.

---

## 💻 Tech Stack

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox, Animations)
- Vanilla JavaScript (no frameworks, no libraries)
- localStorage for cart, auth, wishlist, messages
- Google Fonts: Cormorant Garamond + Montserrat

---

## 🚀 Running Locally

Just open `index.html` in your browser — no build step needed.

For music to work, serve the files through a local server (e.g. VS Code Live Server or `python3 -m http.server`) since browsers block local audio file access.

---

© 2026 AFTERHRS. Built After Dark.
