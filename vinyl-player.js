/**
 * ============================================================
 *  AFTERHRS — vinyl-player.js
 *  Vinyl-style floating music player (fixed bottom-left).
 *  Include on every page: <script src="vinyl-player.js">
 *
 *  VIVA: "I build the player panel dynamically and inject it
 *  into the DOM. Tracks point to the /music/ folder. The HTML5
 *  Audio API handles playback. The disc spins via a CSS class
 *  toggle. A ♫ button in the corner shows/hides the panel."
 *
 *  TO ADD YOUR MUSIC: drop mp3 files into the /music/ folder
 *  named track1.mp3, track2.mp3, track3.mp3
 * ============================================================
 */

var VP_PLAYLIST = [
  { title: "After Dark",    artist: "Afterhrs", src: "music/track1.mp3" },
  { title: "Midnight Haze", artist: "Afterhrs", src: "music/track2.mp3" },
  { title: "NOIR Vibes",    artist: "Afterhrs", src: "music/track3.mp3" },
];

var VP = { audio: null, index: 0, playing: false, visible: false };

document.addEventListener("DOMContentLoaded", function () {
  buildVinylPlayer();
});

function buildVinylPlayer() {
  // ── 1. Toggle button (always visible in corner) ──
  var btn = document.createElement("button");
  btn.id = "vinyl-toggle-btn";
  btn.innerHTML = "&#9835;";
  btn.title = "Music Player";
  btn.onclick = toggleVinyl;
  document.body.appendChild(btn);

  // ── 2. Player panel ──
  var panel = document.createElement("div");
  panel.id = "vinyl-player";
  panel.className = "player-hidden";
  panel.innerHTML =
    '<div class="vp-header">' +
      '<span class="vp-label">Now Playing</span>' +
      '<button class="vp-minimize" onclick="toggleVinyl()">&#8722;</button>' +
    '</div>' +
    '<div class="vp-disc-wrap">' +
      '<div class="vp-disc" id="vp-disc">' +
        '<div class="vp-disc-center"><div class="vp-disc-dot"></div></div>' +
      '</div>' +
    '</div>' +
    '<div class="vp-track-info">' +
      '<p class="vp-track-name" id="vp-name">After Dark</p>' +
      '<p class="vp-track-artist" id="vp-artist">Afterhrs</p>' +
    '</div>' +
    '<div class="vp-progress-wrap">' +
      '<div class="vp-progress-bar" id="vp-bar">' +
        '<div class="vp-progress-fill" id="vp-fill"></div>' +
      '</div>' +
      '<div class="vp-time"><span id="vp-cur">0:00</span><span id="vp-dur">0:00</span></div>' +
    '</div>' +
    '<div class="vp-controls">' +
      '<button class="vp-btn" id="vp-prev" title="Previous">&#9664;&#9664;</button>' +
      '<button class="vp-btn vp-play-btn" id="vp-play" title="Play/Pause">&#9654;</button>' +
      '<button class="vp-btn" id="vp-next" title="Next">&#9654;&#9654;</button>' +
    '</div>' +
    '<div class="vp-volume-row">' +
      '<span class="vp-vol-icon">&#9834;</span>' +
      '<input type="range" class="vp-vol-slider" id="vp-vol" min="0" max="100" value="60">' +
    '</div>';
  document.body.appendChild(panel);

  // ── 3. Audio engine ──
  VP.audio = new Audio();
  VP.audio.volume = 0.6;

  // ── 4. Wire controls ──
  document.getElementById("vp-prev").onclick = vpPrev;
  document.getElementById("vp-next").onclick = vpNext;
  document.getElementById("vp-play").onclick = vpTogglePlay;
  document.getElementById("vp-vol").oninput = function () {
    VP.audio.volume = this.value / 100;
  };
  document.getElementById("vp-bar").onclick = function (e) {
    if (!VP.audio.duration) return;
    var pct = (e.clientX - this.getBoundingClientRect().left) / this.offsetWidth;
    VP.audio.currentTime = pct * VP.audio.duration;
  };

  // ── 5. Audio events ──
  VP.audio.ontimeupdate = vpUpdateProgress;
  VP.audio.onended      = vpNext;
  VP.audio.onerror      = function () {
    document.getElementById("vp-name").textContent   = "Add mp3 to /music/";
    document.getElementById("vp-artist").textContent = "see README";
  };

  // ── 6. Load first track (don't autoplay) ──
  vpLoadTrack(0);
}

function toggleVinyl() {
  VP.visible = !VP.visible;
  var panel  = document.getElementById("vinyl-player");
  var btn    = document.getElementById("vinyl-toggle-btn");
  if (VP.visible) {
    panel.classList.remove("player-hidden");
    btn.style.display = "none";
  } else {
    panel.classList.add("player-hidden");
    btn.style.display = "flex";
  }
}

function vpLoadTrack(i) {
  VP.index = i;
  var t = VP_PLAYLIST[i];
  VP.audio.src = t.src;
  document.getElementById("vp-name").textContent   = t.title;
  document.getElementById("vp-artist").textContent = t.artist;
  document.getElementById("vp-fill").style.width   = "0%";
  document.getElementById("vp-cur").textContent    = "0:00";
  document.getElementById("vp-dur").textContent    = "0:00";
  if (VP.playing) VP.audio.play().catch(function () {});
}

function vpTogglePlay() {
  if (VP.playing) {
    VP.audio.pause();
    VP.playing = false;
    document.getElementById("vp-play").innerHTML = "&#9654;";
    document.getElementById("vp-disc").classList.remove("spinning");
  } else {
    VP.audio.play().then(function () {
      VP.playing = true;
      document.getElementById("vp-play").innerHTML = "&#9646;&#9646;";
      document.getElementById("vp-disc").classList.add("spinning");
    }).catch(function () {
      document.getElementById("vp-name").textContent   = "Add mp3 to /music/";
      document.getElementById("vp-artist").textContent = "files not found";
    });
  }
}

function vpNext() { vpLoadTrack((VP.index + 1) % VP_PLAYLIST.length); }
function vpPrev() {
  if (VP.audio.currentTime > 3) { VP.audio.currentTime = 0; return; }
  vpLoadTrack((VP.index - 1 + VP_PLAYLIST.length) % VP_PLAYLIST.length);
}

function vpUpdateProgress() {
  if (!VP.audio.duration) return;
  var pct = (VP.audio.currentTime / VP.audio.duration) * 100;
  document.getElementById("vp-fill").style.width = pct + "%";
  document.getElementById("vp-cur").textContent  = vpFmt(VP.audio.currentTime);
  document.getElementById("vp-dur").textContent  = vpFmt(VP.audio.duration);
}
function vpFmt(s) {
  var m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" + sec : sec);
}
