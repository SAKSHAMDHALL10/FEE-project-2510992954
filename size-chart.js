/**
 * ============================================================
 *  AFTERHRS — size-chart.js
 *  Shared size chart modal — works on any page.
 *  Include: <script src="size-chart.js"> on every page.
 *
 *  VIVA: "I build the modal once and inject it into the DOM.
 *  Any element with class 'size-guide-link' will open it on
 *  click. Two tabs — Clothing and Shoes — toggle the table.
 *  Clothing shows S/M/L/XL. Shoes show UK 6–11 with EU/US."
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  buildSizeChartModal();

  // Wire any .size-guide-link on the page
  document.querySelectorAll(".size-guide-link").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      openSizeChart();
    });
  });
});

function buildSizeChartModal() {
  if (document.getElementById("size-chart-modal")) return;

  var m = document.createElement("div");
  m.id = "size-chart-modal";
  m.innerHTML =
    '<div class="sc-overlay" onclick="closeSizeChart()"></div>' +
    '<div class="sc-panel">' +
      '<button class="sc-close" onclick="closeSizeChart()">&#10005;</button>' +
      '<p class="sc-eyebrow">Sizing Guide</p>' +
      '<h2 class="sc-heading">Size Chart</h2>' +
      '<div class="sc-tabs">' +
        '<button class="sc-tab active" onclick="scTab(this,\'sc-clothing\')">Clothing</button>' +
        '<button class="sc-tab" onclick="scTab(this,\'sc-shoes\')">Shoes</button>' +
      '</div>' +
      '<div class="sc-table-wrap active" id="sc-clothing">' +
        '<table class="sc-table">' +
          '<thead><tr><th>Size</th><th>Chest (in)</th><th>Waist (in)</th><th>Hip (in)</th><th>Fit</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>S</td><td>36–38</td><td>30–32</td><td>38–40</td><td>Regular</td></tr>' +
            '<tr><td>M</td><td>38–40</td><td>32–34</td><td>40–42</td><td>Regular</td></tr>' +
            '<tr><td>L</td><td>40–42</td><td>34–36</td><td>42–44</td><td>Regular</td></tr>' +
            '<tr><td>XL</td><td>42–44</td><td>36–38</td><td>44–46</td><td>Relaxed</td></tr>' +
          '</tbody>' +
        '</table>' +
        '<p class="sc-note">Measurements in inches. Our pieces are cut slightly oversized — size down for standard fit, or stay for the dropped-shoulder look. Model wears M at 6\'0".</p>' +
      '</div>' +
      '<div class="sc-table-wrap" id="sc-shoes">' +
        '<table class="sc-table">' +
          '<thead><tr><th>UK</th><th>EU</th><th>US</th><th>Foot Length (cm)</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>6</td><td>39</td><td>7</td><td>24.4</td></tr>' +
            '<tr><td>7</td><td>40</td><td>8</td><td>25.1</td></tr>' +
            '<tr><td>8</td><td>41</td><td>9</td><td>25.8</td></tr>' +
            '<tr><td>9</td><td>42</td><td>10</td><td>26.5</td></tr>' +
            '<tr><td>10</td><td>43</td><td>11</td><td>27.2</td></tr>' +
            '<tr><td>11</td><td>44</td><td>12</td><td>27.9</td></tr>' +
          '</tbody>' +
        '</table>' +
        '<p class="sc-note">We stock UK sizes 6–11 for all footwear. Measure foot length and match above. When between sizes, go half a size up for comfort.</p>' +
      '</div>' +
    '</div>';
  document.body.appendChild(m);
}

function openSizeChart() {
  document.getElementById("size-chart-modal").classList.add("sc-open");
  document.body.style.overflow = "hidden";
}

function closeSizeChart() {
  document.getElementById("size-chart-modal").classList.remove("sc-open");
  document.body.style.overflow = "";
}

function scTab(btn, tableId) {
  document.querySelectorAll(".sc-tab").forEach(function (t) { t.classList.remove("active"); });
  document.querySelectorAll(".sc-table-wrap").forEach(function (w) { w.classList.remove("active"); });
  btn.classList.add("active");
  document.getElementById(tableId).classList.add("active");
}
