/* THEUNOiA hero — the gentleman.
   Restores smooth, natural head movement tracking cursor and touch events
   across high-fidelity frames, with all glitching, flickering, and distortion effects completely removed. */
(function () {
  var OPEN = [
    "/assets/img/2fafe1c3a0a9.webp", "/assets/img/70aebe165f4c.webp", "/assets/img/5b6503f0a251.webp",
    "/assets/img/6a664c3ecca0.webp", "/assets/img/15956fb06d4b.webp", "/assets/img/8c1d577cbe12.webp",
    "/assets/img/d33857d667f5.webp", "/assets/img/dd82d3db56c0.webp", "/assets/img/4599d8415666.webp",
    "/assets/img/91fbd9ee15a0.webp", "/assets/img/c044c627203e.webp", "/assets/img/882fe526d00b.webp",
    "/assets/img/c5bfe0313437.webp", "/assets/img/8c050be04b47.webp", "/assets/img/1a0ff09e527e.webp",
    "/assets/img/ba6731d353b9.webp", "/assets/img/c4dd92c2007e.webp", "/assets/img/988202a46798.webp",
    "/assets/img/fcd47f035071.webp", "/assets/img/6658f3598b50.webp", "/assets/img/57faf7b88bb3.webp",
    "/assets/img/bb38ce74d06c.webp", "/assets/img/f0f59f11b8bc.webp", "/assets/img/ff04d28a0758.webp",
    "/assets/img/8b4513ba98e8.webp", "/assets/img/ef8b40cf84f4.webp", "/assets/img/645d7c6db676.webp",
    "/assets/img/eeb4a2c3b7c8.webp", "/assets/img/f7738ffc209a.webp", "/assets/img/d514f4e4402b.webp",
    "/assets/img/b2a23c26cf65.webp", "/assets/img/34d313e377ee.webp", "/assets/img/bd6147a0add6.webp",
    "/assets/img/184c98a81a2b.webp", "/assets/img/0e18fab2383b.webp", "/assets/img/202de31791d8.webp",
    "/assets/img/d84714a34fe0.webp", "/assets/img/d2dcae2ba6c4.webp", "/assets/img/cf6edc584994.webp",
    "/assets/img/f43cde85b68a.webp", "/assets/img/47c5415ed1f7.webp", "/assets/img/8b0992c2e091.webp"
  ];
  var N = OPEN.length;
  var man = document.getElementById("man");
  if (!man) return;

  // Preload all movement frames so swaps are instant and butter-smooth without flickering
  var cache = [];
  function preload(list) {
    for (var i = 0; i < list.length; i++) {
      var im = new Image();
      im.src = list[i];
      cache.push(im);
    }
  }
  preload(OPEN);

  var look = 0, target = 1, shown = -1, lastMove = 0, startAt = Date.now();

  function show(i) {
    if (i === shown) return;
    shown = i;
    man.src = OPEN[i];
  }

  // Where is the cursor relative to his head?
  // Left of him = turn toward the headline; on/right of him = face the visitor
  function aim(clientX) {
    var r = man.getBoundingClientRect();
    if (!r.width) return;
    var headX = r.left + r.width * 0.36;
    var span = Math.max(240, headX);
    var v = (headX - clientX) / span * 1.25;
    target = v < 0 ? 0 : v > 1 ? 1 : v;
    lastMove = Date.now();
  }

  function onMove(e) {
    var x = e.clientX;
    if (x == null && e.touches && e.touches[0]) x = e.touches[0].clientX;
    if (x != null) aim(x);
  }

  ["mousemove", "pointermove", "touchmove", "touchstart"].forEach(function (n) {
    window.addEventListener(n, onMove, { passive: true });
    document.addEventListener(n, onMove, { passive: true });
  });

  function tick() {
    var now = Date.now();
    // Without recent cursor movement, he looks toward the headline.
    // Right after arrival, he briefly faces forward then smoothly turns toward the headline.
    if (now - lastMove > 4000) {
      target = (now - startAt < 600) ? 0 : 1;
    }
    look += (target - look) * 0.22;
    if (Math.abs(target - look) < 0.002) look = target;
    var idx = Math.round(look * (N - 1));
    show(idx);
  }

  window.__heroRestart = function () {
    startAt = Date.now();
    look = 0;
    target = 0;
    lastMove = 0;
  };

  tick();
  setInterval(tick, 40);
})();
