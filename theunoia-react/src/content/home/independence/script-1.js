(function () {
  /* timing in seconds */
  var SHOW_FULL = 0;                    // background plays full-screen first
  var SHRINK    = 0;                    // then shrinks into its frame
  var HANDS_AT  = SHOW_FULL + SHRINK - 0.4;   // then the hands slide in and join

  var hero = document.querySelector('.tn-hero');
  var box  = hero.querySelector('.tn-video');
  var pair = hero.querySelector('.tn-pair');
  var vid  = box.querySelector('video');
  var birds = hero.querySelector('.tn-birds');
  var tag = hero.querySelector('.tn-tagline');
  var c1 = hero.querySelector('.tn-cloud--1'), c2 = hero.querySelector('.tn-cloud--2');
  // extra clouds reuse the two cloud animations (no extra download)
  // cloud bank: a back row (smaller, dimmer, a little higher) and a front row, spread across the full width
  var proto = [c1, c2];
  var spec = [  // [left (share of width), width (share of width), front?, taller/flatter, which cloud, flipped?]
    [-0.04, 0.17, 0, 1.0, 1, 0], [0.13, 0.15, 0, 1.2, 2, 1], [0.30, 0.16, 0, 0.9, 1, 1], [0.47, 0.14, 0, 1.1, 2, 0],
    [0.62, 0.17, 0, 1.0, 1, 1], [0.79, 0.15, 0, 1.25, 2, 0], [0.93, 0.14, 0, 0.9, 1, 0],
    [0.00, 0.21, 1, 1.15, 1, 0], [0.20, 0.14, 1, 1.3, 2, 1], [0.37, 0.17, 1, 0.85, 1, 1], [0.55, 0.13, 1, 1.15, 2, 0],
    [0.68, 0.18, 1, 0.9, 1, 1], [0.84, 0.19, 1, 1.0, 2, 0]
  ];
  var clouds = spec.map(function (c, i) {
    var el = i < 2 ? proto[i] : proto[c[4] - 1].cloneNode(false);
    if (i >= 2) { el.className = 'tn-cloud'; c1.parentNode.insertBefore(el, c1); }
    el.style.animation = 'sd-tn-drift ' + (24 + (i * 7) % 13) + 's ease-in-out ' + (-(i * 5) % 17) + 's infinite ' + (i % 2 ? 'alternate-reverse' : 'alternate');
    el.style.scale = c[5] ? '-1 1' : '';
    el.style.filter = c[2] ? '' : 'brightness(.8)';
    el.style.zIndex = c[2] ? 1 : 0;
    return [el, c[0], c[1], 180 / 320, c[2] ? 1.3 : 1.5, c[3]];
  });

  var BA = 1200 / 778;   // bird clip aspect
  var VA = 1920 / 844, PA = 1920 / 517;
  var F = null, anim = null, timers = [], shrunk = false;

  // final layout: hands across the top, the whole (uncropped) video below them
  function layout() {
    var W = hero.clientWidth, H = hero.clientHeight;
    var pw = W * (W > H ? 0.66 : 0.84);          // hand size: share of screen width
    var pairH = pw / PA, overlap = pairH * 0.12, gap = H * 0.03;   // fingers dip slightly into the bird strip
    var strip = H * (W > H ? 0.15 : 0.11);        // open sky strip between the hands and the scene: tagline + birds
    // scene runs edge to edge and down to the bottom of the hero (no empty navy at the sides)
    var top = gap;
    var sceneY = top + pairH - overlap + strip;
    var vh = H - sceneY, vw = vh * VA;
    // landscape screens: the scene always reaches the bottom edge (if it is wider than the screen, its far sides run off-screen)
    // portrait phones: fit the scene to the width and end the hero there
    // phones too: the scene fills down to the bottom of the screen (the sides of the wide scene run off-screen)
    pair.style.top = top + 'px'; pair.style.width = pw + 'px'; pair.style.left = (W - pw) / 2 + 'px';
    if (vw * 1.9 < W) { vw = W / 1.9; vh = vw / VA; }
    F = { x: (W - vw) / 2, y: sceneY, w: vw, h: vh, W: W, H: hero.clientHeight };
    box.style.left = F.x + 'px'; box.style.top = F.y + 'px';
    box.style.width = vw + 'px'; box.style.height = vh + 'px';
    // birds: a small flock below the hands, rising gently (clip rotated 5deg; 17deg would be level) toward the mountain at the top of the scene
    var bw = W * (W > H ? 0.14 : 0.26), bh = bw / BA, th = 5 * Math.PI / 180;
    var hx = W * 0.31, hy = F.y + F.h * 0.07;   // under the cloud bank, over the hilltops            // the point the flock flies to (it fades out here)
    var ox = 0.427 * bw, oy = -0.151 * bh;                         // heading point relative to the clip centre
    var rx = ox * Math.cos(th) - oy * Math.sin(th), ry = ox * Math.sin(th) + oy * Math.cos(th);
    birds.style.width = bw + 'px'; birds.style.height = bh + 'px';
    birds.style.left = (hx - bw / 2 - rx) + 'px'; birds.style.top = (hy - bh / 2 - ry) + 'px';
    // clouds: small, sitting just above the mountain line on either side (bottoms tuck slightly behind the hills)
    var ts = Math.max(14, Math.min(W * 0.036, strip * 0.5, 56));
    var k = W > H ? 1 : 1.6;   // bigger clouds on phones
    clouds.forEach(function (c) {
      var w = W * c[2] * k, h = w * c[3] * c[5];   // c[5]: taller or flatter, so no two look alike
      c[0].style.width = w + 'px'; c[0].style.height = h + 'px';
      c[0].style.left = (W * c[1] - (k > 1 ? w * 0.25 : 0)) + 'px';
      var tagBottom = F.y - strip * 0.62 + ts * 0.3;   // cloud tops may just touch the bottom of the tagline               // never rise into the tagline
      c[0].style.top = Math.max(F.y - h * c[4], tagBottom) + 'px';
    });
    // tagline sits in the upper part of the strip, just under the fingertips
    tag.style.setProperty('--tag-size', ts + 'px');
    tag.style.top = (F.y - strip * 0.62) + 'px';
  }
  // transform that makes the framed video fill the whole hero
  function cover() {
    var s = Math.max(F.W / F.w, F.H / F.h);
    var cx = (F.W - F.w * s) / 2, cy = (F.H - F.h * s) / 2;
    return 'translate(' + (cx - F.x) + 'px,' + (cy - F.y) + 'px) scale(' + s + ')';
  }

  function play() {
    timers.forEach(clearTimeout); timers = [];
    if (anim) anim.cancel();
    hero.classList.remove('hands-in', 'birds-in', 'tag-in', 'clouds-in'); shrunk = false;
    layout(); box.style.transform = 'none';
    timers.push(setTimeout(function () {
      var from = cover();
      box.style.transform = 'none'; shrunk = true;
      hero.classList.add('clouds-in');
      if (box.animate) anim = box.animate([{ transform: from }, { transform: 'none' }],
                                          { duration: SHRINK * 1000, easing: 'cubic-bezier(.65,0,.35,1)' });
    }, SHOW_FULL * 1000));
    timers.push(setTimeout(function () { void hero.offsetWidth; hero.classList.add('hands-in'); }, HANDS_AT * 1000));
    timers.push(setTimeout(function () { hero.classList.add('birds-in'); }, (HANDS_AT + 0.8) * 1000));
    timers.push(setTimeout(function () { hero.classList.add('tag-in'); }, (HANDS_AT + 4.4) * 1000));   // after the hands join
  }

  window.addEventListener('resize', function () { layout();  });

  var started = false, wasOut = false;
  function start() { if (!started) { started = true; play(); } }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { if (!started) start(); else if (wasOut) play(); wasOut = false; }
      else if (started) wasOut = true;
    }, { threshold: .25 }).observe(hero);
  }
  layout(); box.style.transform = 'none';
  if (!('IntersectionObserver' in window)) start();
  [vid, birds].filter(Boolean).forEach(function (v) { var pr = v.play && v.play(); if (pr && pr.catch) pr.catch(function () {}); });
})();
