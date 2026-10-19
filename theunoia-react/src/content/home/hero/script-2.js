/* THEUNOiA hero — the gentleman.
   Built to work anywhere, including restricted previews:
   plain <img> frames (no canvas), ordinary timers (no animation-frame timer), mouse + pointer + touch events. */
(function () {
  var OPEN = ["/assets/img/2fafe1c3a0a9.webp", "/assets/img/70aebe165f4c.webp", "/assets/img/5b6503f0a251.webp", "/assets/img/6a664c3ecca0.webp", "/assets/img/15956fb06d4b.webp", "/assets/img/8c1d577cbe12.webp", "/assets/img/d33857d667f5.webp", "/assets/img/dd82d3db56c0.webp", "/assets/img/4599d8415666.webp", "/assets/img/91fbd9ee15a0.webp", "/assets/img/c044c627203e.webp", "/assets/img/882fe526d00b.webp", "/assets/img/c5bfe0313437.webp", "/assets/img/8c050be04b47.webp", "/assets/img/1a0ff09e527e.webp", "/assets/img/ba6731d353b9.webp", "/assets/img/c4dd92c2007e.webp", "/assets/img/988202a46798.webp", "/assets/img/fcd47f035071.webp", "/assets/img/6658f3598b50.webp", "/assets/img/57faf7b88bb3.webp", "/assets/img/bb38ce74d06c.webp", "/assets/img/f0f59f11b8bc.webp", "/assets/img/ff04d28a0758.webp", "/assets/img/8b4513ba98e8.webp", "/assets/img/ef8b40cf84f4.webp", "/assets/img/645d7c6db676.webp", "/assets/img/eeb4a2c3b7c8.webp", "/assets/img/f7738ffc209a.webp", "/assets/img/d514f4e4402b.webp", "/assets/img/b2a23c26cf65.webp", "/assets/img/34d313e377ee.webp", "/assets/img/bd6147a0add6.webp", "/assets/img/184c98a81a2b.webp", "/assets/img/0e18fab2383b.webp", "/assets/img/202de31791d8.webp", "/assets/img/d84714a34fe0.webp", "/assets/img/d2dcae2ba6c4.webp", "/assets/img/cf6edc584994.webp", "/assets/img/f43cde85b68a.webp", "/assets/img/47c5415ed1f7.webp", "/assets/img/8b0992c2e091.webp"], CLOSED = ["/assets/img/a6c0eaf47a18.webp", "/assets/img/562807c4d232.webp", "/assets/img/7f43fc097f3c.webp", "/assets/img/c59ce1907582.webp", "/assets/img/b88c022a1a90.webp", "/assets/img/05df0509d005.webp", "/assets/img/c19aeb94a14d.webp", "/assets/img/e43397ff5163.webp", "/assets/img/cf3eee294046.webp", "/assets/img/843cc9f96d66.webp", "/assets/img/346ec4d6612f.webp", "/assets/img/f0de9b88e7c3.webp", "/assets/img/d2279188c1e8.webp", "/assets/img/8e1be3e750f6.webp", "/assets/img/93772297381f.webp", "/assets/img/0cf7a8d0509d.webp", "/assets/img/93847b8322f6.webp", "/assets/img/e836f401dcde.webp", "/assets/img/69301eae595c.webp", "/assets/img/7456104bd599.webp", "/assets/img/54326edfc811.webp", "/assets/img/a696360ed038.webp", "/assets/img/ea196f7af8f0.webp", "/assets/img/1f80fdcfe27f.webp", "/assets/img/25cfff327179.webp", "/assets/img/bb94711f57f7.webp", "/assets/img/ff1d9905aafd.webp", "/assets/img/4c68ade1d483.webp", "/assets/img/0af02d63a3ef.webp", "/assets/img/4fed573b1ada.webp", "/assets/img/795b8169d451.webp", "/assets/img/4668d2555e79.webp", "/assets/img/99d5d75c176b.webp", "/assets/img/36a99fcc9680.webp", "/assets/img/0921f534d8fa.webp", "/assets/img/d6966fa982d4.webp", "/assets/img/6d175235105b.webp", "/assets/img/df3688bdaff3.webp", "/assets/img/5a591d80b814.webp", "/assets/img/40903e4aed35.webp", "/assets/img/50ca920fd72c.webp", "/assets/img/db944493eb5d.webp"];
  var N = OPEN.length;
  var BLINK_EVERY = 3200;     // ms between blinks
  var BLINK_LEN = 140;        // ms the eyes stay shut
  var man = document.getElementById("man");
  if (!man) return;

  // decode every frame ahead of time so swaps are instant
  var cache = [];
  function preload(list) { for (var i = 0; i < list.length; i++) { var im = new Image(); im.src = list[i]; cache.push(im); } }
  preload(OPEN); preload(CLOSED);

  var look = 0, target = 1, shown = -1, closed = false, lastMove = 0, startAt = Date.now();
  function show(i, shut) {
    if (i === shown && shut === closed) return;
    shown = i; closed = shut;
    man.src = shut ? CLOSED[i] : OPEN[i];
  }

  // where is the cursor relative to his head? left of him = turn toward the headline, on/right of him = face you
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

  var reduce = false; // always animate: the team wants him alive even when the OS asks for less motion

  function tick() {
    var now = Date.now();
    // without a cursor he looks at the headline; the first moment after the slide appears he faces you, then turns
    if (now - lastMove > 4000) target = (now - startAt < 600) ? 0 : 1;
    look += (target - look) * 0.22;
    if (Math.abs(target - look) < 0.002) look = target;
    var idx = Math.round(look * (N - 1));
    var t = now - startAt;
    var shut = !reduce && t > 900 && (t % BLINK_EVERY) < BLINK_LEN;
    show(idx, shut);
  }
  window.__heroRestart = function () { startAt = Date.now(); look = 0; target = 0; lastMove = 0; };
  if (reduce) { show(N - 1, false); return; }
  tick();
  setInterval(tick, 40);
})();
