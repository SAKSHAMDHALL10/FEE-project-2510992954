AFTERHRS — Music Folder
========================

Drop your mp3 files here with EXACTLY these names:

  track1.mp3   →  First track
  track2.mp3   →  Second track
  track3.mp3   →  Third track

To add more tracks, open vinyl-player.js and add entries
to the VP_PLAYLIST array at the top of the file:

  var VP_PLAYLIST = [
    { title: "After Dark",    artist: "Afterhrs", src: "music/track1.mp3" },
    { title: "Midnight Haze", artist: "Afterhrs", src: "music/track2.mp3" },
    { title: "NOIR Vibes",    artist: "Afterhrs", src: "music/track3.mp3" },
    { title: "Your Track",    artist: "Artist",   src: "music/track4.mp3" }, // add more
  ];

The player will gracefully show "Add mp3 to /music/" if
no audio files are found — so the site won't break.
