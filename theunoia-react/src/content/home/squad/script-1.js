(() => {
  const team = [
    {role:"THEUNOiA Squad", bg:"var(--yellow)", img:"/assets/img/050c403726ac.webp"},
    {role:"THEUNOiA Squad", bg:"var(--pink)", img:"/assets/img/dedefac4a87b.webp"},
    {role:"THEUNOiA Squad", bg:"var(--blue)", img:"/assets/img/249fc39cf01e.webp"},
    {role:"THEUNOiA Squad", bg:"var(--cream)", img:"/assets/img/fd344294d0f4.webp"},
    {role:"THEUNOiA Squad", bg:"#1e1e1e", img:"/assets/img/95163421955d.webp"},
    {role:"THEUNOiA Squad", bg:"var(--yellow)", img:"/assets/img/2c26f57c1b9d.webp"},
    {role:"THEUNOiA Squad", bg:"var(--pink)", img:"/assets/img/b26ee044ae53.webp"},
    {role:"THEUNOiA Squad", bg:"var(--blue)", img:"/assets/img/b74da8f671fb.webp"},
    {role:"THEUNOiA Squad", bg:"var(--cream)", img:"/assets/img/43c611e2d356.webp"},
    {role:"THEUNOiA Squad", bg:"#1e1e1e", img:"/assets/img/9d0c7f91ba51.webp"},
    {role:"THEUNOiA Squad", bg:"var(--yellow)", img:"/assets/img/aba39a9187db.webp"},
    {role:"THEUNOiA Squad", bg:"var(--pink)", img:"/assets/img/b3e3060fb2e1.webp"},
    {role:"THEUNOiA Squad", bg:"var(--blue)", img:"/assets/img/fec4b2619172.webp"},
    {role:"THEUNOiA Squad", bg:"var(--cream)", img:"/assets/img/235d6213239b.webp"},
    {role:"THEUNOiA Squad", bg:"#1e1e1e", img:"/assets/img/aa940f2d8557.webp"},
  ];
  const sil = {
    short:`<circle cx="50" cy="54" r="19"/><path d="M12 124C12 92 30 80 50 80s38 12 38 44Z"/>`,
    bun:`<circle cx="50" cy="31" r="9"/><circle cx="50" cy="56" r="17"/><path d="M14 124C14 94 31 80 50 80s36 14 36 44Z"/>`,
    long:`<path d="M29 58C29 30 71 30 71 58L76 104H24Z"/><circle cx="50" cy="55" r="17"/><path d="M12 124C12 92 30 80 50 80s38 12 38 44Z"/>`
  };
  const backSVG = `<img class="mark" src="/assets/img/64e97976f90a.webp" alt="THEUNOiA mark">`;

  const brandSVG = `<svg viewBox="0 0 100 60" fill="none" stroke-width="7"><circle cx="36" cy="30" r="22" stroke="#EDA9DE"/><circle cx="64" cy="30" r="22" stroke="#6E8EF4"/></svg>`;
  const frame = document.getElementById('sq-frame');
  const face = document.getElementById('sq-face');
  const replay = document.getElementById('sq-replay');
  const N = team.length;
  const TILT = [-6,4,-3,5,-5,3,-4,6,-2,5,-5,3,4];

  const cards = team.map((t,j) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `<div class="bob">
      <div class="f back">${backSVG}</div>
      <div class="f front" style="--bg:${t.bg}">
        <div class="portrait"><img src="${t.img}" alt="${t.role}" loading="lazy" decoding="async" draggable="false"></div>
        <div class="label"><span>${t.role}</span><i></i></div>
      </div></div>`;
    el._slot = j;
    frame.insertBefore(el, replay);
    return el;
  });

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  let W, H, cs, portrait, ring, C;
  function measure(){
    W = frame.clientWidth; H = frame.clientHeight;
    portrait = W < H*0.9;
    if (portrait){
      cs = (H*0.17)/244;
      ring = {cx:W/2, cy:H*0.52, rx:W*0.37, ry:H*0.13};
      C = {x:W/2, y:H*0.42};
    } else {
      cs = (W/1440)*0.98;
      ring = {cx:W/2, cy:W*0.36, rx:W*0.41, ry:W*0.15};
      C = {x:W/2, y:W*0.255};
    }
  }
  const T = c => `translate(-50%,-50%) translate3d(${c.x}px,${c.y}px,0) rotateX(${c.rx||0}deg) rotateZ(${c.rz||0}deg) rotateY(${c.ry||0}deg) scale(${(c.s||1)*cs})`;
  function put(el, c, d=650, e=EASE){
    el.style.transition = d ? `transform ${d}ms ${e}` : 'none';
    el.style.transform = T(c);
  }

  // ---------- the deck ----------
  // stack[0] = bottom card, stack[N-1] = top card
  let stack = [];
  const DS = 1.15;                     // deck card size while shuffling
  const deckPos = (k, dx=0, dy=0, extra={}) => ({x:C.x+dx, y:C.y+dy - k*2, rx:48, s:DS, ...extra});
  function restack(d=0){ stack.forEach((el,k)=>{ el.style.zIndex = 150+k; put(el, deckPos(k), d); }); }

  async function riffle(id){
    const sx = portrait ? W*0.24 : W*0.13;
    const half = Math.ceil(N/2);
    const L = stack.slice(0,half), R = stack.slice(half);
    // split into two halves
    L.forEach((el,k)=> put(el, deckPos(k, -sx, 10, {rz:-12, ry:-18, rx:44}), 520, 'cubic-bezier(.5,0,.2,1)'));
    R.forEach((el,k)=> put(el, deckPos(k, sx, 10, {rz:12, ry:18, rx:44}), 520, 'cubic-bezier(.5,0,.2,1)'));
    await wait(560); if(id!==run) return false;
    // thumbs bend the halves up
    L.forEach((el,k)=> put(el, deckPos(k, -sx*.62, -6, {rz:-8, ry:26, rx:30}), 300));
    R.forEach((el,k)=> put(el, deckPos(k, sx*.62, -6, {rz:8, ry:-26, rx:30}), 300));
    await wait(320); if(id!==run) return false;
    // cascade: cards fall in alternately from each side
    const order = [];
    for (let k=0;k<half;k++){ if(R[k]) order.push(R[k]); order.push(L[k]); }
    for (let k=0;k<order.length;k++){
      const el = order[k];
      el.style.zIndex = 150+k;
      put(el, deckPos(k, 0, 0, {rz:(k%2?3:-3)}), 300, 'cubic-bezier(.3,1.4,.5,1)');
      await wait(70); if(id!==run) return false;
    }
    stack = order;
    await wait(260); if(id!==run) return false;
    // square up with a little bump
    stack.forEach((el,k)=> put(el, deckPos(k, 0, -10, {s:DS*1.04}), 160));
    await wait(170);
    restack(260);
    await wait(320);
    return id===run;
  }

  async function cut(id){
    const sx = portrait ? W*0.26 : W*0.14;
    const half = Math.floor(N/2);
    const bottom = stack.slice(0,half), top = stack.slice(half);
    top.forEach((el,k)=> put(el, deckPos(k, sx, -20, {rz:9, ry:10}), 420, 'cubic-bezier(.5,0,.2,1)'));
    await wait(440); if(id!==run) return false;
    bottom.forEach((el,k)=>{ el.style.zIndex = 170+k; put(el, deckPos(k+half, sx*.95, -40, {rz:6, ry:6}), 460, 'cubic-bezier(.5,0,.2,1)'); });
    await wait(480); if(id!==run) return false;
    stack = top.concat(bottom);
    restack(420);
    await wait(480);
    return id===run;
  }

  // ---------- orbit around the face ----------
  function orbit(slot, theta){
    const a = theta + slot*2*Math.PI/N;
    const c = Math.cos(a), sn = Math.sin(a), depth = (c+1)/2;
    return {
      x: ring.cx + ring.rx*sn,
      y: ring.cy + ring.ry*c,
      ry: 180 - sn*18,
      rz: TILT[slot]*(.35+.65*depth),
      s: (.56 + .4*depth)*(portrait?1:.92),
      zi: Math.round(100 + c*60) + (c > 0 ? 1 : 0)
    };
  }

  let boost = 1, run = 0, theta = 0, orbiting = false, hovered = null, last = 0;
  const SPEED = (2*Math.PI)/14000;   // one lap every 14s
  function tick(now){
    const dt = last ? Math.min(now-last, 50) : 16; last = now;
    if (orbiting){
      boost += (1 - boost)*Math.min(1, dt/700);
      if (!hovered) theta -= dt*SPEED*boost;
      cards.forEach(el=>{
        const o = orbit(el._slot, theta);
        if (el === hovered){ o.s *= 1.12; o.rz = 0; o.ry = 180; o.y -= 18; el.style.zIndex = 250; }
        else el.style.zIndex = o.zi;
        el.style.transition = el === hovered || el._ease ? 'transform 300ms ' + EASE : 'none';
        el.style.transform = T(o);
      });
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---------- Luna blinks ----------
  const lunaEl = document.getElementById('sq-luna');
  (function blinkLoop(){
    setTimeout(()=>{
      const twice = Math.random() < .28;
      lunaEl.classList.add('blink');
      setTimeout(()=>{ lunaEl.classList.remove('blink');
        if (twice) setTimeout(()=>{ lunaEl.classList.add('blink'); setTimeout(()=>lunaEl.classList.remove('blink'),120); },160);
      },140);
      blinkLoop();
    }, 2200 + Math.random()*3000);
  })();

  // ---------- Luna says hi ----------
  const say = (() => {
    const box = document.getElementById('sq-say');
    const lines = [['sq-s1','I am Luna,'],['sq-s2','Director of Vibes'],['sq-s3','nice meeting you!']];
    const caret = '<span class="caret"></span>';
    function hide(){ box.classList.remove('show','asking'); lines.forEach(([k])=> document.getElementById(k).innerHTML=''); }
    async function show(id){
      hide(); box.classList.add('show');
      lunaEl.classList.add('blink'); setTimeout(()=>lunaEl.classList.remove('blink'),140);
      await wait(450);
      for (const [k,txt] of lines){
        const el = document.getElementById(k);
        for (let i=1;i<=txt.length;i++){
          if (id!==run) return;
          el.innerHTML = txt.slice(0,i) + caret;
          await wait(txt[i-1]===',' ? 220 : 42);
        }
        el.innerHTML = txt;
        await wait(260);
      }
      if (id!==run) return;
      await wait(1500); if (id!==run) return;
      const known = remembered();
      if (known) greet(known, true, id); else ask(id);
    }
    // --- visitor tells Luna their name ---
    const $ = k => document.getElementById(k);
    function remembered(){ try { return localStorage.getItem('luna-visitor') || ''; } catch(e){ return ''; } }
    function remember(n){ try { n ? localStorage.setItem('luna-visitor', n) : localStorage.removeItem('luna-visitor'); } catch(e){} }
    async function typeInto(el, txt, id){
      for (let i=1;i<=txt.length;i++){ if (id!==run) return false; el.innerHTML = esc(txt.slice(0,i)) + caret; await wait(txt[i-1]===','||txt[i-1]==='!' ? 200 : 40); }
      el.textContent = txt; return true;
    }
    const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    async function ask(id){
      lines.forEach(([k])=> $(k).innerHTML='');
      if (!await typeInto($('sq-s1'), "What's your name?", id)) return;
      $('sq-s3').innerHTML = `<div class="ask" id="sq-askForm">
        <input id="sq-askName" type="text" maxlength="20" placeholder="Type your name" aria-label="Your name" autocomplete="off" enterkeyhint="send">
        <button type="button" id="sq-askGo" aria-label="Tell Luna">→</button></div>`;
      box.classList.add('asking');
      const inp = $('sq-askName'), go = $('sq-askGo');
      if (matchMedia('(hover:hover)').matches) setTimeout(()=>inp.focus({preventScroll:true}), 50);
      let sent = false;
      const send = () => {
        if (sent) return;
        let n = inp.value.trim().replace(/\s+/g,' ').slice(0,20);
        if (!n){ inp.focus(); inp.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260}); return; }
        n = n.charAt(0).toUpperCase() + n.slice(1);
        sent = true;
        box.classList.remove('asking');
        remember(n);
        greet(n, false, run);
      };
      inp.addEventListener('keydown', e=>{ if (e.key === 'Enter' || e.keyCode === 13){ e.preventDefault(); send(); } });
      go.addEventListener('click', send);
      // keep typing keys from reaching anything else on the page
      inp.addEventListener('keyup', e=> e.stopPropagation());
    }
    async function greet(n, back, id){
      lines.forEach(([k])=> $(k).innerHTML='');
      // Luna celebrates: bounce, double blink, cards whoosh
      face.classList.remove('yay'); void face.offsetWidth; face.classList.add('yay');
      setTimeout(()=>face.classList.remove('yay'), 950);
      lunaEl.classList.add('blink'); setTimeout(()=>{ lunaEl.classList.remove('blink'); setTimeout(()=>{ lunaEl.classList.add('blink'); setTimeout(()=>lunaEl.classList.remove('blink'),120); },150); },120);
      boost = 9;
      if (!await typeInto($('sq-s1'), back ? 'Welcome back,' : 'Nice meeting you,', id)) return;
      if (!await typeInto($('sq-s2'), n + '!', id)) return;
      if (!await typeInto($('sq-s3'), back ? 'good to see you again ✦' : 'Welcome to the squad ✦', id)) return;
      await wait(900); if (id!==run) return;
      const b = document.createElement('button'); b.className = 'notyou'; b.type = 'button';
      b.textContent = 'Not ' + n + '?';
      b.onclick = ()=>{ remember(''); ask(run); };
      $('sq-s3').appendChild(document.createElement('br')); $('sq-s3').appendChild(b);
    }
    return {show, hide};
  })();

  async function play(){
    const id = ++run;
    orbiting = false; hovered = null; theta = 0;
    measure();
    replay.classList.remove('on');
    say.hide();
    frame.classList.remove('outro');
    frame.classList.add('intro');                 // MEET THE SQUAD! comes in
    stack = cards.slice();
    cards.forEach(el=>{
      el.querySelector('.bob').classList.remove('float');
      el.style.opacity = 0;
    });
    stack.forEach((el,k)=>{ el.style.zIndex = 150+k; put(el, deckPos(k, 0, -60), 0); });
    await wait(40);
    stack.forEach(el=>{ el.style.opacity = 1; });
    stack.forEach((el,k)=> put(el, deckPos(k), 700, 'cubic-bezier(.3,1.3,.5,1)'));
    await wait(900); if(id!==run) return;

    // ---- shuffle ----
    if(!await riffle(id)) return;
    if(!await riffle(id)) return;
    if(!await cut(id)) return;
    if(!await riffle(id)) return;
    await wait(250); if(id!==run) return;

    // ---- text leaves, face arrives ----
    frame.classList.remove('intro');
    frame.classList.add('outro');
    // deck tucks in behind where the face will be
    stack.forEach((el,k)=>{ el.style.zIndex = 60+k; put(el, deckPos(k, 0, -20, {s:.8, rx:20}), 600); });
    await wait(1050); if(id!==run) return;

    // ---- spread out onto the orbit ----
    for (let k=N-1; k>=0; k--){
      const el = stack[k];
      const o = orbit(el._slot, 0);
      el.style.zIndex = o.zi;
      put(el, o, 950, 'cubic-bezier(.16,1,.3,1)');
      await wait(110); if(id!==run) return;
    }
    await wait(1000); if(id!==run) return;

    // ---- rotate forever ----
    cards.forEach((el,i)=>{
      const b = el.querySelector('.bob');
      b.style.setProperty('--fd', (4.2+(i%3)*.7)+'s');
      b.style.setProperty('--fdel', (-i*.6)+'s');
      b.classList.add('float');
    });
    last = 0; orbiting = true;
    setTimeout(()=>{ if(id===run) say.show(id); }, 500);
    replay.classList.add('on');
  }

  cards.forEach(el=>{
    el.addEventListener('mouseenter',()=>{ if(orbiting) hovered = el; });
    el.addEventListener('mouseleave',()=>{ if(hovered===el){ hovered = null; el._ease = true; setTimeout(()=>el._ease=false,300);} });
  });
  replay.addEventListener('click', play);
  addEventListener('resize', measure);

  addEventListener('mousemove', e=>{
    const dx = e.clientX/innerWidth - .5, dy = e.clientY/innerHeight - .5;
    face.style.transform = `translate(${dx*14}px,${dy*10}px) rotate(${dx*5}deg)`;
  });

  measure();
  cards.forEach(el=>{ el.style.opacity = 0; });
  const sqSec = document.getElementById('sq'); let sqStarted = false;
  const sqGo = () => { if (!sqStarted){ sqStarted = true; play(); } };
  if ('IntersectionObserver' in window){ const io = new IntersectionObserver(es=>{ if (es[0].isIntersecting){ sqGo(); io.disconnect(); } }, {threshold:.4}); io.observe(sqSec); } else sqGo();
})();

// background dashed lines flow along their own shapes
(() => {
  const lines = [...document.querySelectorAll('#sq .rings circle, #sq .rings ellipse')].map(el => ({
    el, speed: 180 / parseFloat(el.style.getPropertyValue('--t')) * (el.classList.contains('rev') ? -1 : 1), off: 0
  }));
  let last = 0;
  function step(t){
    const dt = last ? Math.min(t - last, 100) / 1000 : 0; last = t;
    for (const l of lines){ l.off -= l.speed * dt; l.el.setAttribute('stroke-dashoffset', l.off.toFixed(2)); }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();
