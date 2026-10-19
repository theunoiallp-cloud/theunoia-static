
(() => {
  const sheets = [...document.querySelectorAll('.fs-sheet')];
  const opaque = c => c && !/rgba\(.*,\s*0\)$/.test(c) && c !== 'transparent';
  sheets.forEach((s, i) => {
    s.style.zIndex = 10 + i;
    const sec = s.querySelector('.fs-tab').nextElementSibling;
    let c = getComputedStyle(sec).backgroundColor, k = sec.firstElementChild;
    const kc = k && getComputedStyle(k).backgroundColor;
    if (opaque(kc) && (!opaque(c) || sec.id === 'vmx' || sec.id === 'sd')) c = kc;
    if (!opaque(c)) c = '#F5F0E6';
    s.style.setProperty('--fs-c', c);
    const m = c.match(/\d+/g).map(Number), lum = (m[0]*299 + m[1]*587 + m[2]*114) / 1000;
    s.style.setProperty('--fs-t', lum < 140 ? '#F5F0E6' : '#14213D');
  });
  // hanging folder, as on illoca: the sheet rises with its right side lifted (hung from the tab corner)
  // and levels out smoothly as it reaches the top. Scroll-driven, eased, no wobble.
  const marks = sheets.map(s => s.previousElementSibling);
  const st = sheets.map(() => ({a: 0, t: 0, on: false}));
  const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  let lastY = scrollY, vel = 0;
  (function tick() {
    requestAnimationFrame(tick);
    const vh = innerHeight, A = innerWidth < 820 ? 1.4 : 1.8, y = scrollY;
    vel += (Math.max(-120, Math.min(120, y - lastY)) - vel) * 0.25; lastY = y;     // smoothed scroll speed (+ down, - up)
    sheets.forEach((s, i) => {
      const o = st[i], T = marks[i].getBoundingClientRect().bottom;   // = where the sheet starts
      const live = T < vh && T > vh * 0.06;                     // this sheet's top edge is on screen
      const p = (vh - T) / vh;
      let ta = 0, tt = 0;
      if (live) {
        const k = 1 - ss(0.35, 0.88, p);                          // 1 while the sheet is low on screen, 0 once it fills it
        ta = -A * k;                                              // rises hung from the tab corner
        ta += Math.max(-1.2, Math.min(1.2, -vel * 0.04)) * k;           // scroll down: right side swings up; scroll up: it swings down
        tt = Math.max(-14, Math.min(14, vel * 0.5)) * k;            // the sheet trails the scroll, then catches up (moves up and down)
      }
      o.a += (ta - o.a) * 0.08; o.t += (tt - o.t) * 0.08;
      if (T <= vh * 0.06 && Math.abs(o.a) < 0.6 && Math.abs(o.t) < 8) { o.a = 0; o.t = 0; }   // flat at the top
      if (Math.abs(o.a) < 0.005 && Math.abs(o.t) < 0.05 && !live) { if (o.on) { s.style.transform = ''; o.tf = ''; o.on = false; } o.a = 0; o.t = 0; }
      else { const tf = `translateY(${o.t.toFixed(1)}px) rotate(${o.a.toFixed(2)}deg)`; if (tf !== o.tf) { s.style.transform = o.tf = tf; } o.on = true; }
    });
  })();
})();
