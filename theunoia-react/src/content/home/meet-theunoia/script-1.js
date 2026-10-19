(function(){
const $=id=>document.getElementById(id);
const root=$('tu'), canvas=$('tuCanvas');
let W=1280,H=720,S=1,portrait=false;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const seg=(y,a,b)=>clamp((y-a)/(b-a));
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const eout=t=>1-Math.pow(1-t,3);
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=(a,b)=>a+Math.random()*(b-a);

/* scroll timeline, in % of viewport height scrolled */
const TL={t01:[45,100],pad:[55,110],write:[110,215],t12:[228,262],fan:[236,352],t23:[296,334],dr:[362,470],end:395};
root.style.height=(TL.end+100)+'vh';

/* ================= STICKERS ================= */
const STK=[
 {x:.06,y:.21,r:-8,w:80,h:96,html:`<svg viewBox="0 0 80 96" width="80"><g font-family="Manrope" font-size="10" fill="#14213D">
   <rect x="2" y="2" width="56" height="20" rx="2" fill="#EEE7D8" transform="rotate(-14 30 12)"/><text x="12" y="17" transform="rotate(-14 30 12)">Ideas</text>
   <rect x="16" y="24" width="56" height="20" rx="2" fill="#EEE7D8" transform="rotate(10 44 34)"/><text x="30" y="38" transform="rotate(10 44 34)">worth</text>
   <rect x="4" y="48" width="56" height="20" rx="2" fill="#EEE7D8" transform="rotate(-6 32 58)"/><text x="14" y="62" transform="rotate(-6 32 58)">building</text>
   <rect x="18" y="72" width="50" height="20" rx="2" fill="#EEE7D8" transform="rotate(-14 43 82)"/><text x="30" y="86" transform="rotate(-14 43 82)">here ✦</text></g></svg>`},
 {x:.2,y:.03,r:0,html:`<svg viewBox="0 0 92 44" width="92"><ellipse cx="46" cy="22" rx="44" ry="20" fill="#E0C27A"/><ellipse cx="46" cy="22" rx="40" ry="16" fill="none" stroke="#8590AD" stroke-dasharray="2 3"/><text x="46" y="20" text-anchor="middle" font-family="JetBrains Mono" font-size="9" fill="#22305A">CONSULT</text><text x="46" y="31" text-anchor="middle" font-family="JetBrains Mono" font-size="7" fill="#22305A">ANCY</text></svg>`},
 {x:.165,y:.28,r:0,html:`<svg viewBox="0 0 90 90" width="88"><g fill="#8590AD"><circle cx="30" cy="30" r="24"/><circle cx="60" cy="30" r="24"/><circle cx="30" cy="60" r="24"/><circle cx="60" cy="60" r="24"/></g><text x="45" y="42" text-anchor="middle" font-family="Manrope" font-size="22" font-weight="500" fill="#22305A">06</text><text x="45" y="56" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="#22305A">DEC 2025</text><text x="45" y="66" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="#22305A">incorporated</text></svg>`},
 {x:.33,y:.16,r:0,html:`<svg viewBox="0 0 92 92" width="90"><path d="M2 2H90V74L72 90H2Z" fill="#E0C27A"/><path d="M90 74H72V90Z" fill="#C9A24A"/><text x="12" y="30" font-family="Manrope" font-size="10" fill="#7E6328">Digital</text><text x="12" y="43" font-family="Manrope" font-size="10" fill="#7E6328">Platforms</text><circle cx="15" cy="70" r="2" fill="#7E6328"/><text x="21" y="73" font-family="Manrope" font-size="8" fill="#7E6328">Live</text><path d="M74 12 l8 -8" stroke="#7E6328"/></svg>`},
 {x:.46,y:.15,r:0,html:`<svg viewBox="0 0 92 122" width="88"><rect x="2" y="2" width="88" height="118" fill="#F7EDD2"/><g fill="#fff"><circle cx="8" cy="20" r="4"/><circle cx="8" cy="44" r="4"/><circle cx="8" cy="68" r="4"/><circle cx="8" cy="92" r="4"/></g><g stroke="#D3C6AE"><path d="M20 50H80M20 66H80M20 82H80M20 98H80"/></g><text x="22" y="22" font-family="Manrope" font-size="9" fill="#22305A">Every skill</text><text x="22" y="35" font-family="Manrope" font-size="9" fill="#22305A">deserves a stage</text></svg>`},
 {x:.605,y:.14,r:0,html:`<svg viewBox="0 0 80 92" width="72"><path d="M40 8 c-20 0 -26 18 -26 38 c0 14 -8 22 -12 30 h76 c-4 -8 -12 -16 -12 -30 c0 -20 -6 -38 -26 -38Z" fill="#E0C27A"/><circle cx="40" cy="6" r="4" fill="none" stroke="#C9A24A" stroke-width="2"/><circle cx="40" cy="82" r="7" fill="#E0C27A"/><path id="bc" d="M18 46 A24 24 0 0 1 62 46" fill="none"/><text font-family="Manrope" font-size="8.5" fill="#A8853A"><textPath href="#bc" startOffset="50%" text-anchor="middle">New Opportunity</textPath></text></svg>`},
 {x:.705,y:.04,r:-6,html:`<svg viewBox="0 0 96 56" width="96"><ellipse cx="48" cy="28" rx="46" ry="26" fill="#BCC3D6"/><circle cx="10" cy="22" r="3.5" fill="#fff"/><ellipse cx="50" cy="32" rx="22" ry="10" fill="none" stroke="#8590AD"/><path id="pc" d="M14 26 A36 18 0 0 1 84 26" fill="none"/><text font-family="Manrope" font-size="9" fill="#46557A"><textPath href="#pc" startOffset="50%" text-anchor="middle">Claim your chance</textPath></text></svg>`},
 {x:.75,y:.28,r:0,html:`<svg viewBox="0 0 116 58" width="114"><defs><mask id="tk"><rect width="116" height="58" fill="#fff"/><g fill="#000"><circle cx="116" cy="6" r="3"/><circle cx="116" cy="16" r="3"/><circle cx="116" cy="26" r="3"/><circle cx="116" cy="36" r="3"/><circle cx="116" cy="46" r="3"/><circle cx="116" cy="56" r="3"/></g></mask></defs><rect width="116" height="58" rx="6" fill="#46557A" mask="url(#tk)"/><text x="10" y="17" font-family="JetBrains Mono" font-size="7" fill="#BCC3D6">01 SEP 25</text><text x="70" y="17" font-family="JetBrains Mono" font-size="7" fill="#BCC3D6">06 DEC 25</text><path d="M8 24H104" stroke="#8590AD"/><text x="10" y="44" font-family="JetBrains Mono" font-size="13" fill="#fff">IDEA → LLP</text></svg>`},
 {x:.86,y:.2,r:0,html:`<svg viewBox="0 0 70 84" width="66"><circle cx="35" cy="48" r="32" fill="#B5A68A"/><circle cx="35" cy="10" r="6" fill="none" stroke="#B5A68A" stroke-width="3"/><circle cx="35" cy="24" r="3" fill="#fff"/><path id="gc" d="M10 52 A26 26 0 0 0 60 52" fill="none"/><text font-family="Manrope" font-size="8.5" fill="#fff"><textPath href="#gc" startOffset="50%" text-anchor="middle">100% STUDENT-DRIVEN</textPath></text></svg>`},
 {x:.965,y:.15,r:-4,html:`<svg viewBox="0 0 64 32" width="62"><path d="M0 0H64V32H0L4 16Z" fill="#A9543A"/><text x="34" y="14" text-anchor="middle" font-family="Manrope" font-size="8.5" fill="#fff">Since</text><text x="34" y="25" text-anchor="middle" font-family="Manrope" font-size="8.5" fill="#fff">2025</text></svg>`},
 {x:.915,y:.39,r:0,html:`<svg viewBox="0 0 120 86" width="116"><path d="M8 8 H52 a8 8 0 0 0 16 0 H112 V78 H8Z" fill="#EEDCA8"/><circle cx="60" cy="10" r="3" fill="#fff"/><text x="16" y="38" font-family="Manrope" font-size="9.5" fill="#7E6328">Founder</text><text x="16" y="52" font-family="Manrope" font-size="9.5" font-weight="600" fill="#7E6328">Sai Krishnan</text><path d="M16 64H104" stroke="#E0C27A" stroke-dasharray="2 2"/></svg>`},
 {x:.915,y:.6,r:0,html:`<svg viewBox="0 0 76 80" width="72"><rect x="10" y="10" width="62" height="66" rx="4" fill="#C26A4B"/><rect x="2" y="2" width="62" height="66" rx="4" fill="#C26A4B"/><g transform="rotate(48 33 35)" font-family="Manrope" font-size="8.5" fill="#7E3B27" text-anchor="middle"><text x="33" y="28">Build today.</text><text x="33" y="40">Lead tomorrow.</text></g></svg>`},
 {x:.82,y:.82,r:0,html:`<svg viewBox="0 0 84 88" width="80"><path d="M42 2 L82 34 H72 V86 H12 V34 H2Z" fill="#46557A"/><g fill="#E0C27A"><rect x="20" y="40" width="5" height="5"/><rect x="27" y="40" width="5" height="5"/><rect x="20" y="47" width="5" height="5"/><rect x="27" y="47" width="5" height="5"/></g><text x="20" y="66" font-family="JetBrains Mono" font-size="8" fill="#E0C27A">hunhar.in</text><text x="20" y="77" font-family="JetBrains Mono" font-size="7" fill="#E0C27A">13 NOV 26</text></svg>`},
 {x:.975,y:.86,r:0,html:`<svg viewBox="0 0 92 92" width="88"><path d="${(()=>{let d='';for(let i=0;i<=40;i++){const a=i/40*Math.PI*2,r=i%2?42:45;d+=(i?'L':'M')+(46+r*Math.cos(a)).toFixed(1)+' '+(46+r*Math.sin(a)).toFixed(1)}return d+'Z'})()}" fill="#EEDCA8"/><circle cx="46" cy="46" r="30" fill="#E0C27A"/><path id="sc" d="M18 46 A28 28 0 1 1 74 46" fill="none"/><text font-family="Manrope" font-size="7.5" fill="#22305A"><textPath href="#sc" startOffset="50%" text-anchor="middle">every dream deserves direction</textPath></text></svg>`},
 {x:.63,y:.8,r:0,html:`<svg viewBox="0 0 108 52" width="104"><path d="M0 0H100L108 8V52H0Z" fill="#EBBBA6"/><text x="12" y="22" font-family="Manrope" font-size="9" fill="#C26A4B">Project 001</text><circle cx="15" cy="37" r="2" fill="#7E3B27"/><text x="21" y="40" font-family="Manrope" font-size="7.5" fill="#7E3B27">Delivered</text></svg>`},
 {x:.7,y:.96,r:0,html:`<svg viewBox="0 0 76 44" width="72"><ellipse cx="38" cy="22" rx="36" ry="20" fill="#EBBBA6"/><text x="38" y="20" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="#A9543A">Startups</text><text x="38" y="30" text-anchor="middle" font-family="JetBrains Mono" font-size="7.5" fill="#A9543A">welcome!</text></svg>`},
 {x:.44,y:.83,r:0,html:`<svg viewBox="0 0 90 92" width="84"><g fill="#B5A68A"><path d="M18 6 H66 L62 40 H22Z"/><circle cx="14" cy="22" r="8" fill="none" stroke="#B5A68A" stroke-width="5"/><path d="M22 46 H70 L66 84 Q44 90 26 84Z" fill="#8C7D63"/><circle cx="76" cy="62" r="8" fill="none" stroke="#8C7D63" stroke-width="5"/></g><text x="42" y="26" text-anchor="middle" font-family="Manrope" font-size="8.5" fill="#7E3B27">Hustler</text><text x="46" y="68" text-anchor="middle" font-family="Manrope" font-size="8.5" fill="#7E3B27">Client</text></svg>`},
 {x:.21,y:.8,r:0,html:`<svg viewBox="0 0 140 90" width="132"><path d="M2 2 L138 45 L12 88 L28 45Z" fill="#C9A24A"/><path d="M28 45 L138 45" stroke="#C9A24A"/><path d="M2 2 L28 45 L12 88" fill="#C9A24A"/><text transform="translate(26 70) rotate(-14)" font-family="Manrope" font-size="8" fill="#7E6328">To: every student</text></svg>`},
 {x:.31,y:.98,r:-12,html:`<svg viewBox="0 0 64 84" width="58"><path d="M32 2 L62 22 V82 H2 V22Z" fill="#8590AD"/><circle cx="32" cy="18" r="4" fill="#fff"/><text font-family="Manrope" font-size="9" fill="#E4E7EF" transform="rotate(-12 32 50)"><tspan x="10" y="42">Skills</tspan><tspan x="10" y="54">find a</tspan><tspan x="10" y="66">stage</tspan></text></svg>`},
 {x:.025,y:.79,r:0,html:`<svg viewBox="0 0 70 32" width="68"><rect width="70" height="32" rx="16" fill="#F6E0D6"/><text x="35" y="20" text-anchor="middle" font-family="Manrope" font-size="10" fill="#C26A4B">eunoia ♥</text></svg>`},
 {x:.025,y:.5,r:-4,html:`<svg viewBox="0 0 74 44" width="72"><path d="M0 8 L60 0 L74 8 V38 L14 44 L0 36Z" fill="#A9543A"/><text x="40" y="26" text-anchor="middle" font-family="Manrope" font-size="8.5" fill="#fff">IT Solutions</text></svg>`},
 {x:.145,y:.57,r:0,html:`<svg viewBox="0 0 80 82" width="76"><path d="M2 10 H76 V72 l-6 6 -6 -6 -6 6 -6 -6 -6 6 -6 -6 -6 6 -6 -6 -6 6 -6 -6 -6 6 -6 -6Z" fill="#22305A"/><path d="M8 16H70" stroke="#8C7D63"/><text x="10" y="34" font-family="Manrope" font-size="9" fill="#F7EDD2">Code v1.0</text><text x="10" y="46" font-family="Manrope" font-size="7.5" fill="#D3C6AE">shipped by students</text><rect x="44" y="0" width="10" height="26" rx="5" fill="none" stroke="#C26A4B" stroke-width="2.5"/></svg>`},
];

const stkWrap=$('tuStk');
let dragging=null;
STK.forEach((s,i)=>{
  const d=document.createElement('div');d.className='stk';
  d.innerHTML=`<div class="par"><div class="in" style="transform:rotate(${s.r}deg)">${s.html}</div></div>`;
  stkWrap.appendChild(d);s.el=d;s.par=d.firstChild;s.dx=0;s.dy=0;s.i=i;s.ox=0;s.oy=0;s.dip=0;
  s.ax=rnd(2,5);s.ay=rnd(3,7);s.ar=rnd(.8,2.6);s.w1=rnd(.45,.85);s.w2=rnd(.35,.75);s.ph=rnd(0,6.28);s.depth=rnd(.35,1);
  let sx,sy,ox,oy,id=null;
  d.addEventListener('pointerdown',e=>{if(intro<2||cur>4)return;id=e.pointerId;d.setPointerCapture(id);d.classList.add('drag');dragging=s;sx=e.clientX;sy=e.clientY;ox=s.dx;oy=s.dy;activity();e.preventDefault()});
  d.addEventListener('pointermove',e=>{if(e.pointerId!==id)return;s.dx=ox+(e.clientX-sx)/S;s.dy=oy+(e.clientY-sy)/S;stkDirty=true;activity()});
  const up=e=>{if(e.pointerId!==id)return;id=null;d.classList.remove('drag');dragging=null};
  d.addEventListener('pointerup',up);d.addEventListener('pointercancel',up);
});
let stkDirty=true;
function homeXY(s){
  const i=s.i;
  if(!portrait) return [s.x*W+s.dx,s.y*H+s.dy];
  const top=i<11, j=top?i:i-11, col=j%3, row=Math.floor(j/3);
  const bandY=top?[.07,.17,.27,.36]:[.64,.74,.84,.93];
  const xs=[.17,.5,.83], jit=((i*37)%11-5)*6;
  return [xs[col]*W+jit+(row%2?40:-20)+s.dx, bandY[row]*H+s.dy];
}
const baseScale=()=>portrait?.85:1;
function setStk(s,x,y,r,sc,op){
  s.el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
  s.el.style.opacity=op;
}

/* ================= HEADLINE ================= */
const word='Meet THEUNOiA!';
$('tuH1').innerHTML=[...word].map((c,i)=>`<span class="${c==='i'?'i':''}${i===9?' o':''}" style="transition-delay:${i*40}ms">${c===' '?'&nbsp;':c}</span>`).join('');
const oSpan=$('tuH1').querySelector('.o');
let heroScale=1, heroBox={x:0,y:0,w:0,h:0};

/* ================= INTRO (the reference's "o" pile + burst) ================= */
let intro=0; const timers=[];
const at=(ms,f)=>timers.push(setTimeout(f,ms));
function slotCenter(){
  const r=oSpan.getBoundingClientRect(), c=canvas.getBoundingClientRect();
  return [(r.left+r.width/2-c.left)/S,(r.top+r.height/2-c.top)/S];
}
function startIntro(){
  if(intro)return;intro=1;
  const hero=$('tuHero');
  at(150,()=>hero.classList.add('in'));
  const n=STK.length; let sc0;
  at(1250,()=>{ // the O opens into a slot
    sc0=slotCenter();
    const ow=oSpan.getBoundingClientRect().width/S/heroScale;
    oSpan.style.transitionDelay='0ms';oSpan.style.transition='width .35s cubic-bezier(.3,.7,.3,1),opacity .15s';
    oSpan.style.width=ow+'px';void oSpan.offsetWidth;oSpan.style.width=(portrait?70:84)+'px';oSpan.style.opacity=0;
    STK.forEach(s=>{s.jx=rnd(-12,12);s.jy=rnd(-10,10);s.jr=rnd(-24,24);s.el.style.transition='none';setStk(s,sc0[0],sc0[1],s.jr,.08,0);s.el.style.zIndex=100+s.i});
  });
  STK.forEach((s,i)=>at(1450+i*48,()=>{ // stickers stack up one by one inside the slot
    s.el.style.transition='transform .16s cubic-bezier(.3,1.5,.5,1),opacity .06s';
    setStk(s,sc0[0]+s.jx,sc0[1]+s.jy,s.jr,(portrait?.3:.36),1);
  }));
  const tGrow=1450+n*48+80;
  at(tGrow,()=>STK.forEach(s=>{ // the pile swells
    s.el.style.transition='transform .42s cubic-bezier(.55,0,.8,.3)';
    setStk(s,sc0[0]+s.jx*5,sc0[1]+s.jy*5,s.jr*1.2,1.05*baseScale(),1);
  }));
  const tBurst=tGrow+430;
  at(tBurst,()=>{ // ...and bursts out to every edge
    STK.forEach((s,i)=>{const [x,y]=homeXY(s);s.el.style.transition=`transform 1s cubic-bezier(.12,.92,.22,1.04) ${i*10}ms`;setStk(s,x,y,0,baseScale(),1)});
    oSpan.style.transition='width .5s cubic-bezier(.3,1.4,.5,1) .15s,opacity .3s .25s';
    oSpan.style.width=(oSpan.dataset.w||40)+'px';oSpan.style.opacity=1;
  });
  at(tBurst+1250,()=>{STK.forEach(s=>{s.el.style.transition='none';s.el.style.zIndex=''});oSpan.style.width='';intro=2;stkDirty=true});
  at(tBurst+500,()=>{ // the bird flies in and sits on THEUNOiA
    B.x=-140;B.y=H*.92;B.scale=1;B.op=1;
    flyTo({t:'hero'},1700,()=>{ring();$('tuHint').classList.add('on')});
  });
}
function finishIntro(){
  timers.forEach(clearTimeout);timers.length=0;
  $('tuHero').classList.add('in');oSpan.style.transition='none';oSpan.style.width='';oSpan.style.opacity=1;
  STK.forEach(s=>{s.el.style.transition='none';s.el.style.zIndex=''});
  if(B.mode==='off'){B.mode='perched';B.target={t:'hero'};B.op=1;B.perchAt=performance.now()}
  intro=2;stkDirty=true;$('tuHint').classList.add('on');
}

/* ================= BIRD ================= */
$('tuBirdSvg').innerHTML=document.getElementById('birdShapeFull').innerHTML;
const bird=$('tuBird'), bsvg=$('tuBirdSvg');
const BG={};['bAll','bHead','bEye','bWingF','bWingFo','bWingB','bTail','bLegs'].forEach(k=>BG[k]=bsvg.querySelector('.'+k));
const B={x:-200,y:0,scale:1,op:0,face:1,mode:'off',target:{t:'hero'},fl:null,perchAt:0,wait:3000};
const BP={phase:0,wing:0,outer:0,wingB:0,tuck:0,pitch:0,bob:0,head:0,headT:0,nextLook:0,blinkAt:0,blinkUntil:0,tail:0,kick:0,preenUntil:0,landAt:-1e9,last:0,py:0,vy:0,crouch:0};
function targetPos(tg){
  if(tg.t==='hero') return [heroBox.x-heroBox.w*.14, heroBox.y-heroBox.h/2+20, 1];
  const s=tg.s,[x,y]=homeXY(s),sc=baseScale();
  return [x+s.ox+s.w*sc*.08, y+s.oy-s.h*sc*.42, .72];
}
function flyTo(tg,dur,done){
  const now=performance.now();
  B.fl={fx:B.x,fy:B.y,fs:B.scale,tg,t0:now+(B.mode==='perched'?150:0),dur:dur||1200,done};B.mode='flight';B.target=tg;
}
function ring(){const h=$('tuHero');h.classList.add('ring');setTimeout(()=>h.classList.remove('ring'),900)}
function pickTarget(){
  const pad=60, cands=STK.filter(s=>{const [x,y]=homeXY(s);return x>pad&&x<W-pad&&y>110&&y<H-50&&!(B.target.s===s)});
  if(Math.random()<.2&&B.target.t!=='hero') return {t:'hero'};
  return {t:'stk',s:cands[Math.floor(Math.random()*cands.length)]};
}
function wander(){
  const tg=pickTarget();const [tx,ty]=targetPos(tg);
  const dist=Math.hypot(tx-B.x,ty-B.y);
  flyTo(tg,clamp(dist*1.6,800,1800),()=>{
    if(tg.t==='hero')ring();else tg.s.dip=1;
    if(Math.random()<.45){BP.preenUntil=performance.now()+rnd(700,1100)+250}
  });
}
bird.addEventListener('click',()=>{if(intro===2&&cur<4&&B.mode==='perched'){activity(-99999);wander()}});
let lastAct=0;function activity(v){lastAct=performance.now()+(v||0)}
const T=(el,v)=>{el.style.transform=v};
function poseBird(now,flying,p,pre,glide){
  const dt=Math.min(.05,(now-(BP.last||now))/1000)||.016;BP.last=now;
  const k=(r)=>1-Math.exp(-dt*r); // frame-rate independent smoothing
  let wingT,outerT,tuckT,pitchT,bob=0,sx=1,sy=1;
  if(flying){
    BP.phase+=dt*Math.PI*2*(4.4+ (pre?2:0));
    const u=Math.pow((1-Math.cos(BP.phase))/2,.85);
    let flap=lerp(-30,98,u), outer=22*Math.sin(BP.phase-1.2);
    wingT=lerp(flap,36+3*Math.sin(now/140),glide);outerT=lerp(outer,-8,glide);
    tuckT=1;pitchT=clamp(BP.vy*1.1,-20,22);bob=3.2*Math.sin(BP.phase)*(1-glide);
    if(pre){wingT=lerp(20,flap,.5);tuckT=0;pitchT=10;sy=.9;sx=1.04}
    if(p>.8&&!pre){const f=ease(seg(p,.8,1));wingT=lerp(wingT,88,f);outerT=lerp(outerT,-20,f);pitchT=lerp(pitchT,-18,f);tuckT=lerp(1,0,f);bob*=1-f}
    BP.head+=(0-BP.head)*k(10);
    BP.tail=lerp(BP.tail,6*Math.sin(BP.phase+1)-(p>.8?14:0),k(12));
  }else{
    wingT=0;outerT=10;tuckT=0;pitchT=0;
    const br=Math.sin(now/430);sy=1+.014*br;sx=1-.006*br;
    // a bird never keeps its head still: quick looks, preening, blinking, tail flicks
    if(now>BP.nextLook){
      BP.nextLook=now+rnd(700,2600);
      const r=Math.random();
      if(r<.10){BP.preenUntil=now+rnd(700,1100)}
      else if(r<.18&&B.mode==='perched'&&now-B.perchAt>1200){B.face*=-1;BP.landAt=now-60}
      else BP.headT=[-18,-9,-4,0,0,5,10,16][Math.floor(Math.random()*8)];
      if(Math.random()<.22)BP.kick=1;
    }
    let headTarget=now<BP.preenUntil?44+4*Math.sin(now/60):BP.headT;
    BP.head+=(headTarget-BP.head)*k(now<BP.preenUntil?9:16);
    BP.kick*=Math.exp(-dt*5);
    BP.tail+=(-18*BP.kick+1.5*br-BP.tail)*k(14);
    const ls=seg(now-BP.landAt,0,280);if(ls<1){const q=Math.sin(Math.PI*ls)*.12;sy-=q;sx+=q*.5}
  }
  BP.wing+=(wingT-BP.wing)*k(flying?40:12);
  BP.outer+=(outerT-BP.outer)*k(flying?40:12);
  BP.tuck+=(tuckT-BP.tuck)*k(10);
  BP.pitch+=(pitchT-BP.pitch)*k(8);
  if(now>BP.blinkAt){BP.blinkUntil=now+110;BP.blinkAt=now+rnd(1800,4800)}
  const eye=now<BP.blinkUntil?.12:1;
  T(BG.bAll,`translateY(${bob.toFixed(2)}px) rotate(${BP.pitch.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`);
  T(BG.bHead,`rotate(${BP.head.toFixed(2)}deg)`);
  T(BG.bEye,`scaleY(${eye})`);
  T(BG.bWingF,`rotate(${BP.wing.toFixed(2)}deg)`);
  T(BG.bWingFo,`rotate(${BP.outer.toFixed(2)}deg)`);
  T(BG.bWingB,`rotate(${(BP.wing*.9+(flying?8:0)).toFixed(2)}deg)`);
  T(BG.bTail,`rotate(${BP.tail.toFixed(2)}deg)`);
  T(BG.bLegs,`rotate(${(32*BP.tuck).toFixed(2)}deg) scaleY(${(1-.62*BP.tuck).toFixed(3)})`);
}
function birdStep(now){
  let x,y,sc,flying=false,p=0,pre=false,glide=0;
  if(B.mode==='flight'){
    const f=B.fl;pre=now<f.t0;p=clamp((now-f.t0)/f.dur);const e=ease(p);
    const [tx,ty,ts]=targetPos(f.tg);
    const arc=Math.max(0,Math.min(170,Math.hypot(tx-f.fx,ty-f.fy)*.35+40,Math.min(f.fy,ty)-90));
    x=lerp(f.fx,tx,e);y=lerp(f.fy,ty,e)-Math.sin(p*Math.PI)*arc;sc=lerp(f.fs,ts,e);flying=true;
    if(f.dur>1100)glide=Math.sin(Math.PI*seg(p,.34,.62));
    if(Math.abs(tx-f.fx)>4)B.face=tx<f.fx?-1:1;
    if(p>=1){B.mode='perched';B.perchAt=now;BP.landAt=now;B.wait=rnd(2300,4200);f.done&&f.done()}
  }else if(B.mode==='perched'){
    [x,y,sc]=targetPos(B.target);
    if(intro===2&&cur<3&&target<3&&!dragging&&now-lastAct>1600&&now-B.perchAt>B.wait)wander();
  }else{x=B.x;y=B.y;sc=B.scale}
  BP.vy=lerp(BP.vy,(y-(BP.py??y)),.3);BP.py=y;
  B.x=x;B.y=y;B.scale=sc;
  // dock into the header logo as the visitor scrolls on
  const t=eout(seg(cur,TL.t01[0],TL.t01[1]-8));
  const lx=47,ly=36;
  let dx=lerp(x,lx,t),dy=lerp(y,ly,t),ds=lerp(sc,.2,t);
  const docking=t>.02&&t<.98;
  poseBird(now,flying||docking,docking?.5:p,pre&&!docking,docking?0:glide);
  const face=t>.02?-1:B.face;
  bsvg.classList.toggle('flip',face<0);
  bird.style.transform=`translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) translate(-52%,-89%) scale(${ds.toFixed(3)})`;
  bird.style.opacity=B.op*(1-seg(t,.9,1));
  bird.style.pointerEvents=t>.05?'none':'auto';
  $('tuLogo').style.opacity=seg(t,.85,1);
}

/* ---------- stickers breathe and drift, and lean away from the cursor ---------- */
let pmx=0,pmy=0,tmx=0,tmy=0;
root.addEventListener('pointermove',e=>{tmx=(e.clientX/innerWidth-.5)*2;tmy=(e.clientY/innerHeight-.5)*2},{passive:true});
function driftStickers(now){
  if(cur>110)return;
  pmx+=(tmx-pmx)*.06;pmy+=(tmy-pmy)*.06;
  const t=now/1000;
  STK.forEach(s=>{
    if(s.el.classList.contains('drag')){s.ox*=.9;s.oy*=.9;s.par.style.transform=`translate(${s.ox.toFixed(1)}px,${s.oy.toFixed(1)}px)`;return}
    s.dip*=.93;
    s.ox=s.ax*Math.sin(t*s.w1+s.ph)-pmx*12*s.depth;
    s.oy=s.ay*Math.sin(t*s.w2+s.ph*1.3)-pmy*9*s.depth+s.dip*6;
    const r=s.ar*Math.sin(t*s.w1*.8+s.ph);
    s.par.style.transform=`translate(${s.ox.toFixed(2)}px,${s.oy.toFixed(2)}px) rotate(${r.toFixed(2)}deg)`;
  });
}

/* ================= NOTE ================= */
const pad=$('tuPad');
const wEls=[...pad.querySelectorAll('.w')];
const pen=document.createElement('div');

/* ================= PHOTO SHUFFLE (between the note and the drawers) ================= */
const CARDTXT=['FOUNDED 01·09·25','LLP DEED','HUNHAR.IN','HIVH PASS','PROJECT BRIEF','BID #024','INVOICE','PORTFOLIO','CONSULTING','CODE v1.0','CERTIFICATE','PITCH DECK','RÉSUMÉ','PROPOSAL','MEETUP','WIREFRAME','OFFER LETTER','DESIGN v2'];
const CARDCOL=['#FBF8F1','#F7EDD2','#F6E0D6','#E4E7EF','#FBF8F1','#F6F1E6','#F7EDD2','#FBF8F1','#E4E7EF','#F6E0D6','#F7EDD2','#FBF8F1','#F6F1E6','#E4E7EF','#F6E0D6','#FBF8F1','#F7EDD2','#F6F1E6'];
$('tuFan').innerHTML=CARDTXT.map((t,k)=>{
  const blk=['#C9A24A','#D98F73','#8590AD','#46557A','#A9543A','#E0C27A'][k%6];
  return `<div class="card" style="background:${CARDCOL[k]}">${t}<div class="ln"></div><div class="ln" style="width:70%"></div><div class="blk" style="background:${blk};opacity:.6"></div><div class="ln"></div><div class="ln" style="width:55%"></div><div class="ln" style="width:80%"></div></div>`}).join('');
const cardEls=[...document.querySelectorAll('#tu .card')];

/* ================= DRAWERS ================= */
const DR=[
 {lab:'The Company',c:'#EBBBA6',item:`<svg viewBox="0 0 150 60" width="150"><rect width="150" height="60" rx="4" fill="#FBF8F1" stroke="#F6E0D6"/><text x="12" y="38" font-family="JetBrains Mono" font-size="15" fill="#A9543A">01·09 → 06·12</text><text x="12" y="16" font-family="JetBrains Mono" font-size="7" fill="#D98F73">EST.           LLP</text><text x="128" y="38" font-family="JetBrains Mono" font-size="10" fill="#A9543A">25</text></svg>`,
   head:['THE COMPANY','4 FACTS'],ents:[['Sai Krishnan','FOUNDER','Founded THEUNOiA, a student-driven IT company.'],['Established','2025 · SEP','<div class="big">01 Sep 2025</div>THEUNOiA begins.'],['Incorporated as an LLP','2025 · DEC','<div class="big">06 Dec 2025</div>Officially registered.'],['Across cities, one team','THEUNOiA','Young minds from across India, building smart technology together.']]},
 {lab:'What We Build',c:'#EBBBA6',item:`<svg viewBox="0 0 124 64" width="124"><path d="M0 0 H110 L124 32 L110 64 H0Z" fill="#C26A4B"/><circle cx="108" cy="32" r="4" fill="#fff"/><text x="12" y="30" font-family="JetBrains Mono" font-size="11" fill="#fff">ideas → products</text><text x="12" y="46" font-family="JetBrains Mono" font-size="7" fill="#F6E0D6">HUNHAR · HIVH</text></svg>`,
   head:['WHAT WE BUILD','3 THINGS'],ents:[['Software for clients','BUSINESSES','We turn ideas into scalable digital products.'],['Hunhar','LAUNCHING 13 NOV 2026','A digital marketplace connecting talent with real opportunities.'],['Hivh','COMMUNITY','A community where young minds come together to learn, connect, collaborate, and build what\'s next.']]},
 {lab:'Our Services',c:'#EEDCA8',item:`<svg viewBox="0 0 140 70" width="140"><g font-family="Manrope" font-size="8" fill="#7E6328"><path d="M4 18 h40 l6 -10 h40 l6 10 h40 V70 H4Z" fill="#EEDCA8"/><path d="M4 28 H136 V70 H4Z" fill="#F7EDD2"/><text x="14" y="46">Platforms · IT · Software</text><text x="14" y="60" font-family="JetBrains Mono" font-size="6.5">4 SERVICES</text></g></svg>`,
   head:['OUR SERVICES','4 ITEMS'],ents:[['Digital Platforms','BUILD','Platforms like Hunhar, built and launched by us.'],['IT Solutions','DELIVER','Reliable, cost-effective IT for startups and growing businesses.'],['Software Development','DEVELOP','Software for businesses, startups and organizations.'],['Digital Solutions','SOLVE','Technology built to solve problems and drive growth.']]},
 {lab:'How We Work',c:'#EEDCA8',item:`<svg viewBox="0 0 150 56" width="150"><rect width="150" height="56" rx="5" fill="#FBF8F1" stroke="#EEDCA8"/><g font-family="JetBrains Mono" font-size="8" fill="#22305A"><text x="10" y="24">IDEA → BUILD</text><text x="10" y="40">→ LAUNCH → GROW</text></g></svg>`,
   head:['HOW WE WORK','4 STEPS'],ents:[['01 · Your idea','START','Bring us an idea worth building.'],['02 · We build','YOUNG TALENT','Young minds and fresh thinking turn it into a digital product.'],['03 · We launch','DELIVER','Reliable and cost-effective, built to solve the real problem.'],['04 · You grow','REAL VALUE','Technology that creates real value and drives growth.']]},
 {lab:'Our Projects',c:'#EBBBA6',item:`<svg viewBox="0 0 124 64" width="124"><path d="M0 0 H110 L124 32 L110 64 H0Z" fill="#C26A4B"/><circle cx="108" cy="32" r="4" fill="#fff"/><text x="12" y="30" font-family="JetBrains Mono" font-size="13" fill="#fff">hunhar.in</text><text x="12" y="46" font-family="JetBrains Mono" font-size="7" fill="#F6E0D6">LIVE 13 NOV 2026</text></svg>`,
   head:['OUR PROJECTS','3 PROJECTS'],ents:[['Hunhar','PLATFORM · 13 NOV 2026','Clients post projects with their budget; skilled talent sends proposals.'],['Hivh','COMMUNITY · 16 CITIES','Workshops, awareness drives, meetups and campus visits.'],['Client solutions','FOR BUSINESSES','Software we build and launch for businesses, startups and organizations.']]},
 {lab:'Tech Stack',c:'#BCC3D6',item:`<svg viewBox="0 0 140 64" width="140"><rect width="140" height="64" rx="6" fill="#22305A"/><text x="12" y="28" font-family="JetBrains Mono" font-size="12" fill="#BCC3D6">&lt;/&gt; build</text><text x="12" y="46" font-family="JetBrains Mono" font-size="7" fill="#8590AD">WEB · APPS · CLOUD</text></svg>`,
   head:['TECH STACK','3 LAYERS'],ents:[['Web','PLATFORMS','Websites and web platforms, like hunhar.in.'],['Apps','PRODUCTS','Digital products people use every day.'],['Cloud','SCALE','Systems that grow with your business.']]},
 {lab:'Who We Build For',c:'#BCC3D6',item:`<svg viewBox="0 0 140 56" width="140"><g font-family="JetBrains Mono" font-size="7"><rect x="2" y="12" width="42" height="32" rx="16" fill="#46557A"/><text x="23" y="31" text-anchor="middle" fill="#fff">STARTUP</text><rect x="49" y="12" width="42" height="32" rx="16" fill="#8590AD"/><text x="70" y="31" text-anchor="middle" fill="#fff">BUSINESS</text><rect x="96" y="12" width="42" height="32" rx="16" fill="#BCC3D6"/><text x="117" y="31" text-anchor="middle" fill="#22305A">ORG.</text></g></svg>`,
   head:['WHO WE BUILD FOR','4 GROUPS'],ents:[['Startups','FIRST STEP','Every startup taking its first step.'],['Businesses','READY TO GROW','Every business ready to embrace technology.'],['Organizations','SOLVE','Software that solves real problems.'],['Anyone with an idea','BUILD','Everyone with an idea worth building.']]},
 {lab:'Our Approach',c:'#F7EDD2',item:`<svg viewBox="0 0 150 56" width="150"><g font-family="JetBrains Mono" font-size="6.5"><rect x="2" y="14" width="34" height="28" rx="4" fill="#F6E0D6"/><text x="19" y="31" text-anchor="middle" fill="#A9543A">ACCESS</text><rect x="40" y="14" width="34" height="28" rx="4" fill="#F6E0D6"/><text x="57" y="31" text-anchor="middle" fill="#A9543A">AFFORD</text><rect x="78" y="14" width="34" height="28" rx="4" fill="#F6E0D6"/><text x="95" y="31" text-anchor="middle" fill="#A9543A">ACHIEVE</text><rect x="116" y="14" width="32" height="28" rx="4" fill="#F6E0D6"/><text x="132" y="31" text-anchor="middle" fill="#A9543A">VALUE</text></g></svg>`,
   head:['OUR APPROACH','4 VALUES'],ents:[['Accessible','FOR EVERY BUSINESS','Great technology for every business with an idea worth building.'],['Affordable','COST-EFFECTIVE','Reliable IT solutions for startups and growing businesses.'],['Achievable','YOUNG TALENT','Fresh thinking from young minds across India.'],['Real value','IMPACT','Every skill deserves a stage. Every dream deserves direction.']]},
 {lab:'Let\'s Build',c:'#EBBBA6',item:`<svg viewBox="0 0 120 70" width="120"><ellipse cx="60" cy="35" rx="56" ry="30" fill="none" stroke="#C26A4B" stroke-width="2"/><ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#C26A4B" stroke-dasharray="2 2"/><text x="60" y="41" text-anchor="middle" font-family="Caveat" font-size="20" font-weight="700" fill="#C26A4B" transform="rotate(-6 60 35)">let's build</text></svg>`,
   head:['LET\'S BUILD','GET IN TOUCH'],ents:[['A note of belief','THEUNOiA','To everyone with an idea worth building: we\'re here to build it with you.'],['Call us','+91 63742 14583','<a href="tel:+916374214583">+91 63742 14583</a>'],['Visit us','CHANDRAPUR','THEUNOiA LLP, Laxmi Nagar, Chandrapur, Maharashtra 442401.'],['Write to us','EMAIL','<a href="mailto:howdy@theunoia.com">howdy@theunoia.com</a>']]},
];
$('tuGrid').innerHTML=DR.map((d,i)=>`<div class="dr" data-i="${i}" style="--c:${d.c}"><div class="files"><i style="background:${CARDCOL[i]}">${CARDTXT[i]}</i><i style="background:${CARDCOL[i+9]}">${CARDTXT[i+9]}</i></div><div class="item">${d.item}</div><div class="top"></div><div class="front"><div class="lab">${d.lab}</div><div class="key"></div><div class="knob"></div><span class="no">0${i+1}</span><span class="cnt">2 FILES</span></div></div>`).join('');
$('tuProg').innerHTML=DR.map(()=>'<i></i>').join('');
const drEls=[...document.querySelectorAll('#tu .dr')];
let openIdx=-2,manual=false,lastAutoK=-2;
function openDrawer(i){
  if(i===openIdx)return;openIdx=i;
  document.querySelectorAll('#tu .dr').forEach((e,k)=>e.classList.toggle('open',k===i));
  document.querySelectorAll('#tuProg i').forEach((e,k)=>e.classList.toggle('on',k===i));
  $('tuGrid').classList.toggle('has-open',i>=0);
  const p=$('tuPanel');p.classList.remove('on');
  if(i<0){clearTimeout(p._t);p._t=setTimeout(()=>{
    p.innerHTML=`<div class="ph"><span>THE INDEX</span><span>9 DRAWERS</span></div>`+DR.map((d,k)=>`<div class="ix" data-k="${k}" style="transition-delay:${80+k*40}ms"><b>0${k+1}</b><i style="background:${d.c}"></i>${d.lab}<small>${d.head[0]}</small></div>`).join('')+`<div class="ixf">PICK A DRAWER, OR TAP ONE ON THE CABINET</div>`;
    p.querySelectorAll('.ix').forEach(r=>{const k=+r.dataset.k;
      r.addEventListener('mouseenter',()=>drEls[k].classList.add('peek'));
      r.addEventListener('mouseleave',()=>drEls[k].classList.remove('peek'));
      r.addEventListener('click',()=>{drEls[k].classList.remove('peek');openDrawer(k)});});
    void p.offsetWidth;p.classList.add('on');},160);return}
  const d=DR[i];
  clearTimeout(p._t);p._t=setTimeout(()=>{
    p.innerHTML=`<div class="ph"><span>${d.head[0]}</span><span>${d.head[1]}</span></div>`+d.ents.map((e,k)=>`<div class="ent" style="transition-delay:${120+k*80}ms"><div class="et">${e[0]}<small>${e[1]}</small></div>${e[2]?`<div class="ed">${e[2]}</div>`:''}</div>`).join('');
    void p.offsetWidth;p.classList.add('on');
  },160);
}
document.querySelectorAll('#tu .dr').forEach(e=>e.addEventListener('click',()=>{const i=+e.dataset.i;manual=true;openDrawer(i===openIdx?-1:i)}));
openDrawer(-1);
$('tuLamp').addEventListener('click',e=>{e.stopPropagation();const c=$('tuCabinet');c.classList.toggle('lit');$('tuCab').classList.toggle('lit',c.classList.contains('lit'));$('tuLamp').querySelector('.tip').textContent=c.classList.contains('lit')?'TURN OFF THE LAMP':'TURN ON THE LAMP'});
$('tuPhoto').addEventListener('click',()=>$('tuPhoto').classList.toggle('flip'));
/* ---------- desk tools ---------- */
const cab=$('tuCab'), ink=$('tuInk'), ictx=ink.getContext('2d'), tb=$('tuToolbar');
let tool=null, penColor='#22305A', penIdx=2, drawing=false, lastPt=null, stamps=0;
const PENS=[['#C9A24A',1],['#22305A',2],['#C26A4B',3]];
function toCanvas(e){const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)/S,(e.clientY-r.top)/S]}
function setToolbar(){
  if(tool==='pen'){
    tb.innerHTML=`✎ DRAW ANYWHERE <span class="sep"></span>`+PENS.map(([c,i])=>`<span class="sw${i===penIdx?' on':''}" data-p="${i}" style="background:${c}"></span>`).join('')+`<span class="sep"></span><button data-a="clear">CLEAR</button><button class="pri" data-a="done">PUT PEN BACK</button>`;
  }else if(tool==='stamp'){
    tb.innerHTML=`● STAMP THE NOTE <span class="sep"></span><button data-a="clearst">NEW PAPER</button><button class="pri" data-a="done">PUT STAMP BACK</button>`;
  }
  tb.querySelectorAll('[data-p]').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();pickPen(+el.dataset.p)}));
  tb.querySelectorAll('[data-a]').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();const a=el.dataset.a;
    if(a==='done')exitTool();else if(a==='clear')ictx.clearRect(0,0,ink.width,ink.height);else if(a==='clearst')newPaper()}));
}
function pickPen(i){
  if(tool==='stamp')exitTool();
  if(tool!=='pen')stopVanish();
  tool='pen';penIdx=i;penColor=PENS.find(p=>p[1]===i)[0];
  cab.classList.add('tool-pen');cab.classList.remove('tool-stamp');
  $('tuPenCur').style.setProperty('--pc',penColor);
  document.querySelectorAll('#tuCup .pen1,#tuCup .pen2,#tuCup .pen3').forEach(p=>p.classList.toggle('held',p.classList.contains('pen'+i)));
  setToolbar();
}
function pickStamp(){
  if(tool==='pen')exitTool();
  tool='stamp';cab.classList.add('tool-stamp');cab.classList.remove('tool-pen');
  $('tuStampD').querySelector('svg').classList.add('held');setToolbar();
}
let vanishT=null;
function vanishInk(){ // the drawing fades away once the pen goes back in the cup
  ink.classList.add('vanish');clearTimeout(vanishT);
  vanishT=setTimeout(()=>{ictx.save();ictx.setTransform(1,0,0,1,0,0);ictx.clearRect(0,0,ink.width,ink.height);ictx.restore();ink.classList.remove('vanish')},1250);
}
function stopVanish(){if(vanishT){clearTimeout(vanishT);vanishT=null;ictx.save();ictx.setTransform(1,0,0,1,0,0);ictx.clearRect(0,0,ink.width,ink.height);ictx.restore();ink.classList.remove('vanish')}}
function exitTool(){
  if(tool==='pen')vanishInk();
  tool=null;drawing=false;cab.classList.remove('tool-pen','tool-stamp');
  document.querySelectorAll('#tu .deco .held').forEach(p=>p.classList.remove('held'));
}
function newPaper(){$('tuPaper').querySelectorAll('.imp').forEach(n=>n.remove());stamps=0;$('tuPaper').classList.remove('stamped');$('tuStampCount').textContent='NOT STAMPED YET'}
$('tuCup').addEventListener('click',e=>{
  e.stopPropagation();
  const m=(e.target.getAttribute&&e.target.getAttribute('class')||'').match(/pen(\d)/);
  if(tool==='pen'&&!m){exitTool();return}
  pickPen(m?+m[1]:2);
});
$('tuStampD').addEventListener('click',e=>{e.stopPropagation();tool==='stamp'?exitTool():pickStamp()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&tool)exitTool()});
// follow the pointer with the tool in hand
cab.addEventListener('pointermove',e=>{
  if(!tool)return;const [x,y]=toCanvas(e);
  const c=tool==='pen'?$('tuPenCur'):$('tuStampCur');c.style.transform=`translate(${x}px,${y}px)`;
  if(tool==='pen'&&drawing){
    ictx.strokeStyle=penColor;ictx.lineWidth=3.2;ictx.lineCap='round';ictx.lineJoin='round';
    const mx=(lastPt[0]+x)/2,my=(lastPt[1]+y)/2;
    ictx.beginPath();ictx.moveTo(lastPt[2]??lastPt[0],lastPt[3]??lastPt[1]);ictx.quadraticCurveTo(lastPt[0],lastPt[1],mx,my);ictx.stroke();
    lastPt=[x,y,mx,my];
  }
});
ink.addEventListener('pointerdown',e=>{if(tool!=='pen')return;e.preventDefault();{const [x,y]=toCanvas(e);$('tuPenCur').style.transform=`translate(${x}px,${y}px)`}{const r=$('tuCup').getBoundingClientRect();if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top-20&&e.clientY<r.bottom){exitTool();return}}ink.setPointerCapture(e.pointerId);drawing=true;const [x,y]=toCanvas(e);lastPt=[x,y];
  ictx.fillStyle=penColor;ictx.beginPath();ictx.arc(x,y,1.6,0,Math.PI*2);ictx.fill();});
const endDraw=()=>{drawing=false;lastPt=null};
ink.addEventListener('pointerup',endDraw);ink.addEventListener('pointercancel',endDraw);
// stamping
const IMP=`<svg width="132" height="132" viewBox="0 0 132 132"><g filter="url(#tuInkRough)" fill="none" stroke="#C26A4B"><circle cx="66" cy="66" r="60" stroke-width="3.2"/><circle cx="66" cy="66" r="37" stroke-width="1.6"/></g><g filter="url(#tuInkRough)" fill="#C26A4B"><text font-family="JetBrains Mono" font-size="7.6" font-weight="700" letter-spacing=".6"><textPath href="#tuRing">THIS STARTUP IS MADE TO BUILD SOCIETY ✦ DEVELOP THE NATION ✦</textPath></text><text x="66" y="66" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="14.5" letter-spacing=".8">BELIEVE</text><text x="66" y="79" text-anchor="middle" font-family="JetBrains Mono" font-size="6.5" letter-spacing="1">THEUNOiA · 2025</text><path d="M44 52 H88 M44 85 H88" stroke="#C26A4B" stroke-width="1.2"/></g></svg>`;
cab.addEventListener('pointerdown',e=>{
  if(tool!=='stamp'||e.target.closest('.toolbar'))return;
  e.preventDefault();e.stopPropagation();{const [x,y]=toCanvas(e);$('tuStampCur').style.transform=`translate(${x}px,${y}px)`}
  const cur=$('tuStampCur');cur.classList.add('press');setTimeout(()=>cur.classList.remove('press'),230);
  const p=$('tuPaper'),r=p.getBoundingClientRect();
  if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
  setTimeout(()=>{
    const pr=p.getBoundingClientRect(),sc=pr.width/p.offsetWidth;
    const n=document.createElement('div');n.className='imp';n.innerHTML=IMP;
    n.style.left=((e.clientX-pr.left)/sc)+'px';n.style.top=((e.clientY-pr.top)/sc)+'px';n.style.setProperty('--ir',(Math.random()*24-12).toFixed(1)+'deg');
    p.appendChild(n);stamps++;p.classList.add('stamped');
    $('tuStampCount').textContent=`BELIEVED × ${stamps}`;
  },110);
},true);
// keep drawer taps from firing while a tool is in hand
$('tuGrid').addEventListener('click',e=>{if(tool){e.stopPropagation()}},true);
// cabinet tilts gently toward the cursor
let tiltX=0,tiltY=0,tX=0,tY=0;
$('tuCab').addEventListener('pointermove',e=>{const r=$('tuCabinet').getBoundingClientRect();tY=clamp((e.clientX-(r.left+r.width/2))/r.width,-1,1)*5;tX=-clamp((e.clientY-(r.top+r.height/2))/r.height,-1,1)*4});
$('tuCab').addEventListener('pointerleave',()=>{tX=0;tY=0});

/* ================= LAYOUT ================= */
let fanY=0,fanS=1,cellC=[],lastVW=0,lastVH=0,cabSc=1;
function layout(){
  const vw=innerWidth,vh=innerHeight;if(!vw||!vh)return false;lastVW=vw;lastVH=vh;portrait=vw/vh<0.9;
  S=portrait?Math.min(vw/470,vh/980):Math.min(vw/1280,vh/640);
  W=vw/S;H=vh/S;
  canvas.style.width=W+'px';canvas.style.height=H+'px';canvas.style.transform=`scale(${S})`;
  heroScale=portrait?1.1:1;
  const hero=$('tuHero');
  heroBox={x:W/2,y:H/2,w:hero.offsetWidth*heroScale,h:hero.offsetHeight*heroScale};
  if(!oSpan.style.width) oSpan.dataset.w=oSpan.offsetWidth;
  // note pad
  pad.style.top=(portrait?120:96)+'px';pad.style.width=Math.min(840,W-(portrait?40:200))+'px';
  pad.querySelector('.sheet').style.padding=portrait?'34px 26px 60px 74px':'';
  pad.querySelectorAll('.txt').forEach(t=>t.style.whiteSpace=portrait?'normal':'nowrap');
  const cap=$('tuCap');cap.style.cssText=portrait?'position:absolute;top:62px;left:0;right:0;justify-content:center;font-size:15px':'';
  // drawers
  const g=$('tuCabinet'),pnl=$('tuPanel'),ch=$('tuCabHint'),pr=$('tuProg');
  const gw=630,gh=354;
  if(!portrait){
    const total=gw+70+290, gx=(W-total)/2, gy=Math.max(210,(H-gh)/2+60);
    g.style.left=gx+'px';g.style.top=gy+'px';cabSc=1;
    pnl.style.left=(gx+gw+70)+'px';pnl.style.top=(gy-60)+'px';pnl.style.width='290px';
    ch.style.left=gx+'px';ch.style.top=(gy+gh+76)+'px';
    pr.style.left=(gx+gw-9*20)+'px';pr.style.top=(gy+gh+48)+'px';
  }else{
    const sc=Math.min(1,(W-40)/gw);
    g.style.left=((W-gw*sc)/2)+'px';g.style.top='300px';cabSc=sc;
    pnl.style.left='30px';pnl.style.width=(W-60)+'px';pnl.style.top=(300+gh*sc+100)+'px';
    ch.style.left='30px';ch.style.top='120px';pr.style.right='30px';pr.style.left='auto';pr.style.top='142px';
  }
  const gr=g.getBoundingClientRect(),cr=canvas.getBoundingClientRect(),gsc=portrait?Math.min(1,(W-40)/gw):1;
  const gl=parseFloat(g.style.left),gt=parseFloat(g.style.top);
  cellC=[...Array(9)].map((_,j)=>[gl+((j%3)*210+105)*gsc, gt+(Math.floor(j/3)*118+59)*gsc]);
  fanY=H/2+20;fanS=portrait?.8:1;const fan=$('tuFan');fan.style.top=fanY+'px';fan.style.transform=`scale(${fanS})`;
  // desk tools
  const dpr=Math.min(2,devicePixelRatio||1), old=document.createElement('canvas');
  if(ink.width){old.width=ink.width;old.height=ink.height;old.getContext('2d').drawImage(ink,0,0)}
  ink.style.width=W+'px';ink.style.height=H+'px';ink.width=Math.round(W*S*dpr);ink.height=Math.round(H*S*dpr);
  ictx.setTransform(S*dpr,0,0,S*dpr,0,0);if(old.width){ictx.save();ictx.setTransform(1,0,0,1,0,0);ictx.drawImage(old,0,0,ink.width,ink.height);ictx.restore()}
  const ppr=$('tuPaper');ppr.style.left=pnl.style.left;ppr.style.top=(parseFloat(pnl.style.top)-(portrait?0:6))+'px';ppr.style.width=pnl.style.width;ppr.style.height=(portrait?330:400)+'px';
  const cbx=parseFloat(g.style.left),cby=parseFloat(g.style.top);
  $('tuCab').style.setProperty('--lx',(cbx+110*cabSc+200)+'px');$('tuCab').style.setProperty('--ly',(cby+40*cabSc+200)+'px');
  STK.forEach(s=>{s.w=s.el.offsetWidth;s.h=s.el.offsetHeight});
  stkDirty=true;lastY=-1;
}

/* ================= RENDER (scroll-scrubbed, smoothed) ================= */
const CAPS={
 1:'<b>Note</b> Who we are <span class="ic" style="background:#D98F73">✎</span>, written down.',
 2:'<b>Drawers</b> Everything about THEUNOiA <span class="ic" style="background:#8590AD">▤</span>, sorted.',
};
let target=0,cur=0,lastY=-1,capStage=-1,stage=0;
function setCap(s){
  if(s===capStage)return;capStage=s;const c=$('tuCap');c.style.opacity=0;
  clearTimeout(c._t);c._t=setTimeout(()=>{c.innerHTML=CAPS[s]||'';c.style.opacity=1},200);
  document.querySelectorAll('#tuDots i').forEach((d,k)=>d.classList.toggle('on',k===s));
}
const vis=(el,o)=>{el.style.opacity=o;el.style.visibility=o<.01?'hidden':'visible'};
function render(){
  const y=cur;
  if(intro<2&&y>25)finishIntro();
  const t01=ease(seg(y,...TL.t01)),t12=ease(seg(y,...TL.t12)),t23=ease(seg(y,...TL.t23)),t34=0;
  stage=y<TL.t01[0]+30?0:y<TL.t12[0]+30?1:2;
  setCap(stage);
  $('tuHdr').style.opacity=seg(y,TL.t01[0]+10,TL.t01[1])*(1-t34);

  // headline
  const hero=$('tuHero');
  hero.style.transform=`translate(-50%,-50%) translateY(${(-t01*90).toFixed(1)}px) scale(${(heroScale*(1-.12*t01)).toFixed(3)})`;
  hero.style.opacity=1-clamp(t01*1.5);
  $('tuHint').style.visibility=y>8?'hidden':'visible';

  // stickers: gather into a strip at the top, then tuck away behind the note
  if(intro===2&&(stkDirty||y!==lastY)){
    const n=STK.length,bs=baseScale();
    STK.forEach((s,i)=>{
      const [hx,hy]=homeXY(s);
      const ti=eout(seg(y,TL.t01[0]+i*.9,TL.t01[0]+30+i*.9));
      const rx=W*(.08+.84*i/(n-1)), ry=portrait?120:88;
      const fade=seg(y,TL.t01[1]-12,TL.t01[1]+6);
      setStk(s,lerp(hx,rx,ti),lerp(hy,ry,ti),lerp(0,(i%3-1)*8,ti),lerp(bs,.42,ti),1-fade);
      s.el.style.pointerEvents=y>4?'none':'auto';
    });
    stkDirty=false;
  }

  if(y!==lastY){
    // note pad slides up, writes itself, then lifts away
    const pin=eout(seg(y,...TL.pad));
    const pout=t12;
    pad.style.transform=`translate(-50%,${(lerp(H+40,0,pin)-pout*H*.8).toFixed(1)}px)`;
    vis(pad,1-seg(pout,.5,1));
    const wp=seg(y,...TL.write), n=wEls.length;
    wEls.forEach((el,i)=>{
      const li=clamp(wp*n-i);
      el.style.clipPath=`inset(0 ${((1-li)*100).toFixed(2)}% 0 0)`;
      el.parentElement.classList.toggle('pop',li>=.999);
    });
    $('tuSig').classList.toggle('pop',wp>=.999);

    // photo shuffle: cards fan across, then file themselves into the drawers
    const fp=seg(y,...TL.fan);
    vis($('tuEco'),fp>0&&fp<1?1:0);
    const bump=new Array(9).fill(0);
    cardEls.forEach((el,k)=>{
      const sx=-400+k*48, sy=175-k*22;
      const c=eout(clamp((fp-k*.022)/.40)), out=ease(seg(fp,.50+k*.017,.78+k*.012));
      const [cx,cy]=cellC[k%9]||[W/2,H/2], dx=(cx-W/2)/fanS, dy=(cy-fanY)/fanS;
      const x=lerp(sx-480*(1-c),dx,out), yy=lerp(sy+300*(1-c),dy-30,out);
      el.style.opacity=(clamp(c*3)*(1-seg(out,.82,1))).toFixed(3);
      el.style.transform=`translate3d(${x.toFixed(1)}px,${yy.toFixed(1)}px,0) rotateY(${(-55*(1-out)).toFixed(1)}deg) rotate(${(out*((k%5)-2)*4).toFixed(1)}deg) scale(${(1-.62*out).toFixed(3)})`;
      bump[k%9]=Math.max(bump[k%9],Math.sin(Math.PI*seg(out,.8,1)));
    });
    drEls.forEach((d,j)=>d.style.setProperty('--b',bump[j].toFixed(3)));

    // drawers
    const cab=$('tuCab');vis(cab,t23*(1-t34));
    cab.style.transform=`translateY(${((1-t23)*140-t34*160).toFixed(1)}px)`;
    // drawers open only when the visitor taps them; close them again when the cabinet leaves
    if(y<TL.t23[0]+10&&openIdx>=0)openDrawer(-1);
    if((y<TL.t23[1]-4||y>TL.end+40)&&tool)exitTool();

    lastY=y;
  }
}
function readScroll(){
  const r=root.getBoundingClientRect(), vh=innerHeight;
  if(!vh)return;
  const t=Math.max(0,-r.top)/vh*100;
  if(isFinite(t))target=t;
  if(!intro&&r.top<innerHeight*.6&&r.bottom>0)startIntro();
}
function loop(now){
  // the host may give the page a 0×0 size at first, or resize it later: re-measure whenever that changes
  if(innerWidth&&innerHeight&&(innerWidth!==lastVW||innerHeight!==lastVH)){layout();readScroll()}
  if(!lastVW){requestAnimationFrame(loop);return}
  {const rr=root.getBoundingClientRect();if(rr.bottom<-60||rr.top>innerHeight+60){requestAnimationFrame(loop);return}}
  if(!isFinite(target))target=0;if(!isFinite(cur))cur=target;
  const d=target-cur;cur=Math.abs(d)<.02?target:cur+d*.13;
  render();driftStickers(now);birdStep(now);
  if(stage===2&&!portrait){tiltX+=(tX-tiltX)*.08;tiltY+=(tY-tiltY)*.08}else{tiltX*=.85;tiltY*=.85}
  const tilted=Math.abs(tiltX)+Math.abs(tiltY)>.02;
  $('tuCabinet').style.transform=tilted?`scale(${cabSc}) translate(315px,177px) perspective(1600px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translate(-315px,-177px)`:`scale(${cabSc})`;
  requestAnimationFrame(loop);
}
addEventListener('scroll',()=>{readScroll();activity()},{passive:true});
addEventListener('pointermove',()=>{},{passive:true});
addEventListener('resize',()=>{layout();readScroll()});
document.querySelectorAll('#tuDots i').forEach(d=>d.addEventListener('click',()=>{
  const stops=[0,TL.write[1]+5,TL.dr[0]+4];
  window.__tuStop&&window.__tuStop(+d.dataset.s);
}));
document.querySelector('#tu .stage').addEventListener('scroll',e=>{e.target.scrollLeft=0;e.target.scrollTop=0});
layout();readScroll();cur=target;
document.fonts&&document.fonts.ready.then(layout);
requestAnimationFrame(loop);
window.__tu={state:()=>({cur,target,intro,B,stage})};
/* Meet THEUNOiA: only the opening ("Meet THEUNOiA!" + stickers + the bird landing) holds the page.
   After it has played, the note and the drawers scroll freely, following the visitor's scroll. */
(function(){
 const top0=()=>root.getBoundingClientRect().top+scrollY;
 const holding=()=>{const r=root.getBoundingClientRect();return intro<2&&r.top<=2&&r.top>-innerHeight*.25&&r.bottom>=innerHeight-2;};
 window.__tuStop=i=>{if(intro<2)finishIntro();const s=[0,TL.write[1]+5,TL.dr[0]+4][i]||0;scrollTo({top:top0()+s*innerHeight/100,behavior:'smooth'});};
 const block=e=>{if(holding()){e.preventDefault();if(Math.abs(scrollY-top0())>1)scrollTo(0,top0());}};
 addEventListener('wheel',e=>{if(e.deltaY>0)block(e);},{passive:false});
 addEventListener('touchmove',block,{passive:false});
 addEventListener('keydown',e=>{if(['ArrowDown','PageDown',' '].includes(e.key)&&!(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)))block(e);});
 (function hold(){requestAnimationFrame(hold);if(holding()&&scrollY>top0()+1)scrollTo(0,top0());})();
})();

})();
