(()=>{
const COVER="/assets/img/e64b5d7f3260.webp";
const B="THEUNOiA";
/* ---------- content ---------- */
const EMB=c=>`<svg class="${c}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="24" cy="24" r="21.5"/><circle cx="24" cy="14.5" r="2.6" fill="currentColor" stroke="none"/><path d="M12 22.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0 4 1.6 6 0"/><path d="M12 28.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0 4 1.6 6 0"/><path d="M15 34.5c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0"/></svg>`;
const WAVE=`<svg class="kos-wave" viewBox="0 0 132 22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M2 8q8-6 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0"/><path d="M2 15q8-6 16 0t16 0 16 0 16 0 16 0 16 0 16 0 16 0" opacity=".55"/></svg>`;
const IC={verify:'<path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',people:'<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.4"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><path d="M14.5 15.2c.6-.3 1.3-.4 2-.4 2.2 0 3.8 1.5 4.3 4.2"/>',scale:'<path d="M12 4v16M5 7h14M8 20h8"/><path d="M5 7l-2.5 6a2.5 2.5 0 005 0zM19 7l-2.5 6a2.5 2.5 0 005 0z"/>',drop:'<path d="M12 3.5c3 4 6 7 6 10.5a6 6 0 01-12 0c0-3.5 3-6.5 6-10.5z"/>',tide:'<path d="M3 10c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',sun:'<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M5.6 18.4l1.6-1.6M16.8 7.2l1.6-1.6"/>',ripple:'<path d="M4 17a8 8 0 0116 0"/><path d="M7.5 17a4.5 4.5 0 019 0"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>'};
const ico=n=>`<span class="kos-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</svg></span>`;
const hl=s=>`<mark class="kos-hl">${s}</mark>`;
const TOC=[["I","The question",5],["II","Where it began",8],["III","SkillBridge is born",10],["IV","Guidance for growth",12],["V","The Ocean Theory",13],["VI","Today",15]];
const P=[
 {label:"Cover",kind:"cover"},
 {label:"Contents",kind:"end"},
 {label:"Creo Lumentia!",center:true,spell:true,body:`<div class="kos-spell"><span class="kos-spark s1"></span><span class="kos-spark s2"></span><span class="kos-spark s3"></span><span class="kos-spark s4"></span><span class="kos-spark s5"></span><span class="kos-spark s6"></span><span class="kos-eyebrow kos-spell-k">Say it as the book opens</span><p class="kos-spell-word" aria-label="Creo Lumentia!"><span>Creo</span> <span>Lumentia!</span></p><p class="kos-spell-say">KRAY-oh · loo-MEN-tee-ah</p><svg class="kos-spell-rule" viewBox="0 0 120 12" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><path d="M2 6h46M72 6h46"/><path d="M60 1l2.2 3.8L66 6l-3.8 1.2L60 11l-2.2-3.8L54 6l3.8-1.2z" fill="currentColor" stroke="none"/></svg><dl class="kos-spell-meaning"><div><dt>Creo</dt><dd>Latin for “I create”</dd></div><div><dt>Lumentia</dt><dd>from <i>lumen</i>, “light”</dd></div></dl><p class="kos-spell-sum">“I create light.”</p><p class="kos-spell-note">A small spell for the pages ahead: every opportunity is a light someone chooses to create, and every hidden talent is waiting for it.</p></div>`},
 {label:"About this book",body:`<span class="kos-eyebrow">About this book</span><h2 class="kos-h kos-h--sm">The story of beautiful thinking</h2><p class="kos-byline">Written by Luna</p><p>Folio is the story of ${B}: how one simple question, “why should talent wait?”, grew into an IT company, a student-first freelancing platform called SkillBridge, a mentorship initiative, and a way of seeing the world called the Ocean Theory.</p><p>It is a short read about students, opportunity, and the belief that hidden potential deserves a chance to rise.</p><dl class="kos-facts"><div><dt>Author</dt><dd>Luna</dd></div><div><dt>Publisher</dt><dd>${B}</dd></div><div><dt>Chapters</dt><dd>Six</dd></div><div><dt>Reading time</dt><dd>About 5 minutes</dd></div></dl>`},
 {label:"Contents",body:`<span class="kos-eyebrow">${B}</span><h2 class="kos-h kos-h--toc">Contents</h2><ol class="kos-toc">${TOC.map(([n,t,f])=>`<li><button type="button" data-goto="${f}"><span class="kos-toc-n">${n}</span><span class="kos-toc-t">${t}</span><span class="kos-toc-p">${f-4}</span></button></li>`).join("")}</ol>`},
 {label:"I · The question",run:"Know our story",body:`<span class="kos-chap">Chapter I</span><h2 class="kos-h">Every great journey begins with a question</h2><p class="kos-lede">Ours was simple, yet powerful…</p><blockquote class="kos-quote">“Why should talent wait for an opportunity to prove itself?”</blockquote><p class="kos-cite">— the question that started it all</p>`},
 {label:"I · The question",run:"The question",body:`<p>As the freelance economy continued to grow, one reality became impossible to ignore.</p><p>${hl("Millions of talented students")} possessed the skills to create, innovate, and contribute, yet many struggled to secure the right opportunities.</p><p>At the same time, startups, entrepreneurs, commoners, and small businesses often found it difficult to access affordable, reliable freelance services.</p><p class="kos-aside">Two sides… and no bridge between them.</p>`},
 {label:"I · The question",run:"Know our story",body:`<p>Research also shows that while freelancing continues to expand globally, many beginners face intense competition, limited visibility, and barriers to winning their first projects.</p><p class="kos-pull">The problem was never a shortage of talent.</p><p>It was a shortage of ${hl("opportunity, accessibility, and connection.")}</p>`},
 {label:"II · Where it began",run:"Where it began",body:`<span class="kos-chap">Chapter II</span><h2 class="kos-h">Where it began</h2><p class="kos-byline">Sai Krishnan · Founder</p><p>Determined to change this, Sai Krishnan founded ${B} with a vision to create an IT services and solutions company that would support startups, entrepreneurs, and small businesses, while creating opportunities for the next generation of professionals and students.</p>`},
 {label:"II · Where it began",run:"Know our story",body:`<p>As the vision evolved, Sai and Adil Hassani (Finance Manager) began exploring how freelancing could become more inclusive and accessible.</p><p>The team questioned a system where ${hl("experience often outweighed potential")}, and where many talented students found it difficult to take their very first step.</p><p class="kos-aside">So they decided to build that first step.</p>`},
 {label:"III · SkillBridge is born",run:"SkillBridge is born",body:`<span class="kos-chap">Chapter III</span><h2 class="kos-h">SkillBridge is born</h2><p class="kos-byline">Bharat’s first student-first freelancing platform</p><p>Those conversations gave birth to SkillBridge: the horizon where talented, skilled, and passionate students meet clients searching for potential, innovation, and opportunity.</p><p>It was designed with a simple belief:</p><p class="kos-belief">Skills and passion deserve recognition before experience.</p>`},
 {label:"III · SkillBridge is born",run:"Know our story",body:`<h2 class="kos-h kos-h--sm">How SkillBridge works</h2><ul class="kos-points"><li>${ico("verify")}AI-assisted skill verification</li><li>${ico("people")}A student-focused ecosystem</li><li>${ico("scale")}An affordable bidding model</li></ul><div class="kos-cards"><div class="kos-card"><span class="kos-card-k">For students</span><p>Real-world experience, financial independence, and professional confidence.</p></div><div class="kos-card"><span class="kos-card-k">For businesses</span><p>Quality digital services, within their budget.</p></div></div>`},
 {label:"IV · Guidance for growth",run:"Guidance for growth",body:`<span class="kos-chap">Chapter IV</span><h2 class="kos-h">Guidance for growth</h2><p>But the journey didn’t end there. Recognising that opportunities alone are not enough, Sai envisioned an ecosystem where ${hl("guidance would accompany growth.")}</p><p>This led to ${B}’s mentorship initiative, an evolving platform that connects aspiring individuals with mentors who help them learn, grow, and navigate their professional journeys with confidence.</p>`},
 {label:"V · The Ocean Theory",run:"Know our story",body:`<span class="kos-chap">Chapter V</span><h2 class="kos-h">The Ocean Theory</h2><p>As ${B} grew, Sai introduced a philosophy that would come to define its identity.</p><p>Inspired by the ocean’s endless depth, interconnected ecosystem, and ability to reveal hidden treasures, it reflects our belief that ${hl("every individual carries untapped potential")} waiting to be discovered.</p>`},
 {label:"V · The Ocean Theory",run:"The Ocean Theory",body:`<div class="kos-poem"><p>Just as every drop strengthens the ocean,</p><p class="kos-em">every individual strengthens our ecosystem,</p><p>and every opportunity becomes a tide that helps hidden talent rise.</p></div>${WAVE}`},
 {label:"VI · Today",run:"Know our story",body:`<span class="kos-chap">Chapter VI</span><h2 class="kos-h">Today</h2><p>${B} is more than an IT company or a freelancing platform. It’s a growing ecosystem where:</p><ul class="kos-points kos-points--tight"><li>${ico("drop")}<span>Students’ talent, skills, and passion are <em>the ocean</em></span></li><li>${ico("tide")}<span>Opportunities are <em>the tides</em></span></li><li>${ico("sun")}<span>Clients are <em>the sunlight</em></span></li><li>${ico("ripple")}<span>Collaboration creates <em>waves</em> that reach every shore</span></li></ul>`},
 {label:"VI · Today",run:"Today",body:`<p class="kos-intro">It’s built on one enduring belief:</p><p class="kos-belief kos-belief--lg">When hidden potential meets the right opportunity, even the deepest ocean reveals its greatest treasures.</p><p class="kos-cite">— Team ${B}</p>`},
 {label:"The end",center:true,body:`${EMB("kos-page-emblem")}<p class="kos-thanks">Thank you for reading.</p><p class="kos-small">Know our story · ${B}</p><div class="kos-actions"><button type="button" class="kos-btn kos-btn--solid" data-act="again"><span aria-hidden="true">↺</span> Read again</button><button type="button" class="kos-btn" data-act="close">Close the book</button></div>`},
 {label:"The end",kind:"end"},
 {label:"Back cover",kind:"back"}
];
P.forEach((p,i)=>{if(i>=5&&i<=16)p.num=i-4});
const LAST=P.length-1,MAXS=Math.ceil(LAST/2);
function pageHTML(i,side){
  if(i==="blank")return `<div class="kos-page kos-page--${side}"></div>`;
  const p=P[i];
  if(p.kind==="cover")return `<div class="kos-cover kos-cover--art"><img class="kos-cover-img" alt="${B}'s Folio θ: the story of beautiful thinking" draggable="false"><button type="button" class="kos-cover-open" data-act="next">Open the book</button></div>`;
  if(p.kind==="end")return `<div class="kos-endpaper kos-endpaper--${side}">${EMB("kos-end-emblem")}</div>`;
  if(p.kind==="back")return `<div class="kos-cover${side==="left"?" kos-cover--back":""} kos-cover--art"><div class="kos-back"><span class="kos-back-brand">${B}’s</span><span class="kos-back-title">Folio</span><span class="kos-back-theta" aria-hidden="true">θ</span><span class="kos-back-tag">The story of beautiful thinking</span><span class="kos-back-author">by Luna</span><button type="button" class="kos-btn kos-btn--solid kos-back-btn" data-act="again"><span aria-hidden="true">↺</span> Read again</button></div></div>`;
  return `<div class="kos-page kos-page--${side}${p.center?" kos-page--center":""}${p.spell?" kos-page--spell":""}">${p.run?`<div class="kos-run"><span>${p.run}</span></div>`:""}<div class="kos-body">${p.body}</div>${p.num?`<div class="kos-num"><span>${p.num}</span></div>`:""}</div>`;
}
const tplCache={};
function pageNode(i,side){
  const k=i+"|"+side;
  if(!tplCache[k]){const d=document.createElement("div");d.innerHTML=pageHTML(i,side);const n=d.firstElementChild;const img=n.querySelector(".kos-cover-img");if(img)img.src=COVER;tplCache[k]=n;}
  return tplCache[k].cloneNode(true);
}
function fill(el,i,side,interactive,fresh){
  el.replaceChildren();
  if(i==null){el.hidden=true;return}
  el.hidden=false;
  const n=pageNode(i,side);
  if(interactive&&fresh&&n.classList.contains("kos-page--spell")){n.classList.add("is-cast");chime()}
  if(!interactive){n.setAttribute("aria-hidden","true");n.querySelectorAll("button").forEach(b=>b.tabIndex=-1)}
  el.appendChild(n);
}

/* ---------- dom & state ---------- */
const $=id=>document.getElementById(id);
const root=$("kos"),stage=$("stage"),book=$("book"),slotL=$("slotL"),slotR=$("slotR"),shadeL=$("shadeL"),shadeR=$("shadeR"),
 cast=$("cast"),castStrip=$("castStrip"),front=$("front"),frontPage=$("frontPage"),frontStrip=$("frontStrip"),
 flapWrap=$("flapWrap"),flap=$("flap"),flapPage=$("flapPage"),flapShade=$("flapShade"),flapStrip=$("flapStrip"),
 leaf=$("leaf"),leafFront=$("leafFront"),leafBack=$("leafBack"),dimF=$("dimF"),dimB=$("dimB"),glossF=$("glossF"),
 btnPrev=$("prev"),btnNext=$("next"),statusEl=$("status"),soundBtn=$("sound");
const SEQ=P.map((p,i)=>i).filter(i=>P[i].kind!=="end");
const mq=matchMedia("(max-width: 760px), (max-aspect-ratio: 4/5)");
const reduce=matchMedia("(prefers-reduced-motion: reduce)");
const st={single:false,W:0,H:0,cur:0,step:null,P:null,mode:null,queue:null,tween:null};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const maxI=()=>st.single?SEQ.length-1:MAXS;
function sides(i){if(st.single)return{L:null,R:SEQ[i]};const L=2*i-1,R=2*i;return{L:L>=0&&L<=LAST?L:null,R:R<=LAST?R:null}}
function isRigid(a,b){const lo=Math.min(a,b),hi=Math.max(a,b);if(hi-lo!==1)return false;return st.single?lo===0:(lo===0||lo===MAXS-1)}
function restShift(i){if(st.single)return -st.W;return i===0?-st.W/2:i===MAXS?st.W/2:0}
function idxOfPage(f){if(st.single){let k=SEQ.indexOf(f);if(k<0)k=SEQ.findIndex(x=>x>=f);return k<0?SEQ.length-1:k}return f%2===0?f/2:(f+1)/2}

/* ---------- geometry ---------- */
function measure(){
  st.single=mq.matches;root.classList.toggle("is-single",st.single);
  const r=stage.getBoundingClientRect();
  st.H=r.height;st.W=st.single?r.width:r.width/2;
  stage.style.fontSize=(st.W*(st.single?.037:.034))+"px";
  book.style.width=(2*st.W)+"px";book.style.height=st.H+"px";
  book.style.perspective=(st.W*5.5)+"px";
  book.style.perspectiveOrigin=st.single?"75% 50%":"50% 50%";
  
}
const poly=pts=>pts.length<3?"polygon(0 0,0 0,0 0)":"polygon("+pts.map(p=>p[0].toFixed(2)+"px "+p[1].toFixed(2)+"px").join(",")+")";
function clipPoly(pts,g){const out=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],ga=g(a),gb=g(b);if(ga>=0)out.push(a);if((ga>=0)!==(gb>=0)){const t=ga/(ga-gb);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}return out}
function constrain(p,cy){
  const W=st.W,H=st.H,near={x:W,y:cy},far={x:W,y:H-cy},diag=Math.hypot(W,H);let q={x:p.x,y:p.y};
  let vx=q.x-near.x,vy=q.y-near.y,l=Math.hypot(vx,vy);if(l>W){q={x:near.x+vx*W/l,y:near.y+vy*W/l}}
  vx=q.x-far.x;vy=q.y-far.y;l=Math.hypot(vx,vy);if(l>diag){q={x:far.x+vx*diag/l,y:far.y+vy*diag/l}}
  return q;
}
function placeStrip(el,M,n,len,h,below,grad){
  // strip aligned with fold line; local +y points to the corner side (-n)
  const th=Math.atan2(n.x,-n.y),L=len;
  el.style.width=L+"px";el.style.height=h+"px";el.style.background=grad;
  el.style.transform=`translate(${M.x}px,${M.y}px) rotate(${th}rad) translate(${-L/2}px,${below?0:-h}px)`;
}
const prOf=p=>clamp((2*st.W-p.x)/(2*st.W));

/* ---------- render a turn ---------- */
function renderStep(){
  const s=st.step,W=st.W,H=st.H;let p=st.P;
  const pr=prOf(p),q=s.fwd?pr:1-pr,e=q<.5?2*q*q:1-Math.pow(-2*q+2,2)/2;
  book.style.transform=`translateX(${restShift(s.a)+(restShift(s.b)-restShift(s.a))*e}px)`;
  if(s.rigid){
    const t=pr,ang=-180*t,sn=Math.sin(Math.PI*t);
    leaf.style.transform=`rotateY(${ang}deg)`;
    dimF.style.opacity=(t*.55).toFixed(3);dimB.style.opacity=((1-t)*.55).toFixed(3);
    glossF.style.opacity=(sn*.5*(t<.5?1:0)).toFixed(3);
    shadeR.style.opacity=slotR.hidden?0:(t<.5?sn*.9:0).toFixed(3);
    shadeL.style.opacity=slotL.hidden?0:(t>.5?sn*.9:0).toFixed(3);
    return;
  }
  p=constrain(p,s.cy);
  const C={x:2*W,y:s.cy},dx=p.x-C.x,dy=p.y-C.y,dist=Math.hypot(dx,dy);
  if(dist<.5){front.style.clipPath="none";flapWrap.hidden=true;flapShade.hidden=true;cast.hidden=true;return}
  flapWrap.hidden=false;flapShade.hidden=false;cast.hidden=false;
  const n={x:dx/dist,y:dy/dist},M={x:(p.x+C.x)/2,y:(p.y+C.y)/2};
  const rect=[[W,0],[2*W,0],[2*W,H],[W,H]],f=v=>(v[0]-M.x)*n.x+(v[1]-M.y)*n.y;
  const fr=clipPoly(rect,f),fl=clipPoly(rect,v=>-f(v));
  front.style.clipPath=poly(fr);
  const d={x:-n.y,y:n.x},A00=2*d.x*d.x-1,A01=2*d.x*d.y,A11=2*d.y*d.y-1,dm=d.x*M.x+d.y*M.y,b0=2*M.x-2*d.x*dm,b1=2*M.y-2*d.y*dm;
  const R=v=>[A00*v[0]+A01*v[1]+b0,A01*v[0]+A11*v[1]+b1];
  // T = Reflect(fold) ∘ Reflect(spine): places the back page onto the folded flap
  flap.style.transform=`matrix(${-A00},${-A01},${A01},${A11},${A00*2*W+b0},${A01*2*W+b1})`;
  flap.style.clipPath=poly(fl.map(v=>[2*W-v[0],v[1]]));
  flapShade.style.clipPath=poly(fl.map(R));
  const k=clamp(dist/(.22*W))*clamp((2*W-dist)/(.3*W)),mid=Math.sin(Math.PI*clamp(dist/(2*W)));
  const L=3*Math.hypot(W,H);
  flapWrap.style.filter=`drop-shadow(0 ${(2+4*mid).toFixed(1)}px ${(6+10*mid).toFixed(1)}px rgba(20,12,4,${(.32*k).toFixed(3)}))`;
  placeStrip(flapStrip,M,n,L,Math.max(dist/2,1),false,`linear-gradient(to top,rgba(40,24,8,${(.28*k).toFixed(3)}) 0%,rgba(255,248,228,${(.22*k).toFixed(3)}) 14%,rgba(255,248,228,0) 42%,rgba(60,36,12,${(.10*k).toFixed(3)}) 100%)`);
  placeStrip(castStrip,M,n,L,W*(.06+.28*mid),true,`linear-gradient(to bottom,rgba(20,12,4,${(.5*k).toFixed(3)}),rgba(20,12,4,${(.18*k).toFixed(3)}) 35%,rgba(20,12,4,0))`);
  placeStrip(frontStrip,M,n,L,W*(.04+.1*mid),false,`linear-gradient(to top,rgba(30,18,6,${(.22*k).toFixed(3)}),rgba(30,18,6,0))`);
}

/* ---------- step lifecycle ---------- */
function makeStep(a,b,cy){
  const fwd=b>a,A=sides(a),Bs=sides(b),s={a,b,fwd,rigid:isRigid(a,b),cy:cy==null?st.H:cy};
  if(fwd){s.left=A.L;s.under=Bs.R;s.front=A.R;s.back=Bs.L}else{s.left=Bs.L;s.under=A.R;s.front=Bs.R;s.back=A.L}
  if(st.single){s.left=null;s.back=s.rigid?1:"blank"}
  return s;
}
function beginStep(s){
  st.step=s;
  fill(slotL,s.left,"left",false);fill(slotR,s.under,"right",false);
  edges(true);
  if(s.rigid){
    fill(leafFront,s.front,"right",false);fill(leafBack,s.back==null?"blank":s.back,"left",false);
    leaf.hidden=false;
  }else{
    fill(frontPage,s.front,"right",false);fill(flapPage,s.back==null?"blank":s.back,"left",false);
    front.hidden=false;flapWrap.hidden=false;flapShade.hidden=false;cast.hidden=false;
  }
  st.P={x:s.fwd?2*st.W:0,y:s.cy};
  book.classList.add("is-turning");
  renderStep();
}
function endStep(done){
  const s=st.step;if(!s)return;
  st.cur=done?s.b:s.a;st.step=null;st.mode=null;
  [front,flapWrap,flapShade,cast,leaf].forEach(e=>e.hidden=true);
  front.style.clipPath="";flap.style.clipPath="";
  shadeL.style.opacity=0;shadeR.style.opacity=0;
  book.classList.remove("is-turning");
  rest();
}
function edges(turning){
  const mk=(n,dir)=>{const a=[];for(let i=1;i<=n;i++)a.push(`${dir*i}px ${i}px 0 ${i%2?"#e7d3a7":"#c9ae7b"}`);return a};
  const drop="0 1.4em 2.6em -.7em rgba(0,0,0,.7)";
  const c=st.cur,turned=st.single?0:Math.max(0,c-1),left=st.single?Math.min(4,maxI()-c):Math.max(0,MAXS-c-1);
  slotR.style.boxShadow=[drop,...mk(Math.min(4,left),1)].join(",");
  slotL.style.boxShadow=[drop,...mk(Math.min(4,turned),-1)].join(",");
}
function rest(){
  const s=sides(st.cur);
  const fresh=st.lastRest!==st.cur;st.lastRest=st.cur;
  fill(slotL,s.L,"left",true,fresh);fill(slotR,s.R,"right",true,fresh);
  edges(false);
  book.style.transform=`translateX(${restShift(st.cur)}px)`;
  btnPrev.disabled=st.cur===0;btnNext.disabled=st.cur===maxI();
  statusEl.textContent=P[s.R!=null?s.R:s.L].label;
  if(st.queue!=null){const t=st.queue;st.queue=null;goTo(t)}
}

/* ---------- animation ---------- */
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const easeOut=t=>1-Math.pow(1-t,3);
function tween(dur,fn,done){
  cancelAnimationFrame(st.tween);const t0=performance.now();
  const f=now=>{const t=clamp((now-t0)/dur);fn(t);renderStep();if(t<1)st.tween=requestAnimationFrame(f);else{st.tween=null;done&&done()}};
  st.tween=requestAnimationFrame(f);
}
function plan(c,t){
  const steps=[];
  while(c!==t){
    const dir=t>c?1:-1;let n;
    if(isRigid(c,c+dir))n=c+dir;
    else{n=t;for(let k=c+dir;k!==t+dir;k+=dir){if(isRigid(k,k+dir)){n=k;break}}}
    steps.push([c,n]);c=n;
  }
  return steps;
}
function goTo(t){
  t=clamp(t,0,maxI());
  if(st.mode){st.queue=t;return}
  if(t===st.cur)return;
  const steps=plan(st.cur,t);
  const run=()=>{
    const [a,b]=steps.shift();const s=makeStep(a,b,st.H);beginStep(s);st.mode="auto";
    const dur=reduce.matches?480:(s.rigid?1050:1000)*(steps.length?.8:1);
    const lift=st.H*(s.rigid?0:.15);
    rustle(s.rigid);
    tween(dur,t=>{const e=ease(t),pr=s.fwd?e:1-e;st.P={x:2*st.W-2*st.W*pr,y:st.H-lift*Math.sin(Math.PI*pr)}},()=>{
      if(steps.length){const q=st.queue;st.step=null;st.cur=b;run()}else endStep(true)
    });
  };
  run();
}
const next=()=>goTo(st.cur+1),prev=()=>goTo(st.cur-1);

/* ---------- pointer: drag, corner peek, click ---------- */
let down=null,raf=null;
const toBook=e=>{const r=book.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
function follow(){
  raf=null;if(!st.step||!(st.mode==="drag"||st.mode==="peek"))return;
  const g=st.target,a=st.mode==="drag"?.42:.18;
  st.P={x:st.P.x+(g.x-st.P.x)*a,y:st.P.y+(g.y-st.P.y)*a};renderStep();
  if(st.mode==="peek"&&st.peekLeave&&Math.hypot(g.x-st.P.x,g.y-st.P.y)<.6){endStep(false);return}
  raf=requestAnimationFrame(follow);
}
const kick=()=>{if(!raf)raf=requestAnimationFrame(follow)};
function hover(p){
  if(st.mode&&st.mode!=="peek")return;
  if(reduce.matches)return;
  const W=st.W,H=st.H,r=W*.2;let zone=null;
  const cyOf=y=>y<r?0:y>H-r?H:null;
  if(p.x>2*W-r&&p.x<=2*W+4&&st.cur<maxI()){const cy=cyOf(p.y);if(cy!=null)zone={dir:1,cy}}
  else if(!st.single&&p.x<r&&p.x>=-4&&st.cur>0&&sides(st.cur).L!=null){const cy=cyOf(p.y);if(cy!=null)zone={dir:-1,cy}}
  book.classList.toggle("is-corner",!!zone);
  if(zone){
    if(st.mode==="peek"&&(st.peekDir!==zone.dir||st.step.cy!==zone.cy)){st.peekLeave=true;st.target={x:st.peekDir>0?2*W:0,y:st.step.cy};kick();return}
    if(!st.mode){beginStep(makeStep(st.cur,st.cur+zone.dir,zone.cy));st.mode="peek";st.peekDir=zone.dir}
    st.peekLeave=false;
    const base={x:zone.dir>0?2*W:0,y:zone.cy},sy=zone.cy?-1:1;
    let vx=p.x-base.x,vy=p.y-base.y;const l=Math.hypot(vx,vy);if(l>r){vx*=r/l;vy*=r/l}
    st.target={x:base.x+(-zone.dir*r*.32)+vx*.55,y:base.y+sy*r*.26+vy*.55};kick();
  }else if(st.mode==="peek"){st.peekLeave=true;st.target={x:st.peekDir>0?2*W:0,y:st.step.cy};kick()}
}
book.addEventListener("pointerdown",e=>{
  if(e.button>0||e.target.closest("button,a"))return;
  if(st.mode==="auto"||st.mode==="release")return;
  down={x:e.clientX,y:e.clientY,p:toBook(e),moved:false,hist:[[performance.now(),e.clientX]]};
  try{book.setPointerCapture(e.pointerId)}catch(_){}
});
book.addEventListener("pointermove",e=>{
  if(!down){if(e.pointerType==="mouse")hover(toBook(e));return}
  const dx=e.clientX-down.x,dy=e.clientY-down.y;
  down.hist.push([performance.now(),e.clientX]);if(down.hist.length>6)down.hist.shift();
  if(!down.moved){
    if(Math.hypot(dx,dy)<6)return;
    down.moved=true;
    let dir;
    if(st.mode==="peek")dir=st.peekDir;
    else dir=st.single?(dx<0?1:-1):(down.p.x<st.W?-1:1);
    if(st.mode!=="peek"){
      const t=st.cur+dir;if(t<0||t>maxI()||(dir<0&&!st.single&&sides(st.cur).L==null)){down.dead=true;return}
      beginStep(makeStep(st.cur,t,down.p.y<st.H/2?0:st.H));
    }
    st.mode="drag";st.dragFrom={x:down.x,y:down.y,P:{...st.P}};book.classList.add("is-grab");
  }
  if(down.dead||st.mode!=="drag")return;
  const f=st.dragFrom;st.target={x:f.P.x+(e.clientX-f.x),y:f.P.y+(e.clientY-f.y)};kick();
});
function release(e){
  if(!down)return;const d=down;down=null;book.classList.remove("is-grab");
  if(st.mode==="drag"){
    const h=d.hist,vx=h.length>1?(h[h.length-1][1]-h[0][1])/Math.max(1,h[h.length-1][0]-h[0][0]):0;
    const s=st.step,pr=prOf(constrain(st.P,s.cy));
    let done=s.fwd?(pr>.3||vx<-.35):(pr<.7||vx>.35);
    if(s.fwd&&vx>.35)done=false;if(!s.fwd&&vx<-.35)done=false;
    const goal=s.fwd?(done?1:0):(done?0:1);
    const from={...(s.rigid?st.P:constrain(st.P,s.cy))},to={x:2*st.W-2*st.W*goal,y:s.cy},sy=s.cy?-1:1;
    st.mode="release";if(done)rustle(s.rigid);
    tween(reduce.matches?260:240+520*Math.abs(goal-pr),t=>{const e2=easeOut(t);st.P={x:from.x+(to.x-from.x)*e2,y:from.y+(to.y-from.y)*e2+sy*st.H*.05*Math.sin(Math.PI*e2)}},()=>endStep(done));
    return;
  }
  if(d.moved||(e&&e.type==="pointercancel"))return;
  // a click
  if(st.mode==="peek"){
    const s=st.step,from={...constrain(st.P,s.cy)},goal=s.fwd?1:0,to={x:2*st.W-2*st.W*goal,y:s.cy},sy=s.cy?-1:1;
    st.mode="release";rustle(false);
    tween(reduce.matches?400:820,t=>{const e2=ease(t);st.P={x:from.x+(to.x-from.x)*e2,y:from.y+(to.y-from.y)*e2+sy*st.H*.16*Math.sin(Math.PI*e2)}},()=>endStep(true));
    return;
  }
  if(st.single){const visX=d.p.x-st.W;visX<st.W*.33?prev():next()}else{d.p.x<st.W?prev():next()}
}
book.addEventListener("pointerup",release);
book.addEventListener("pointercancel",release);
book.addEventListener("pointerleave",e=>{if(!down&&st.mode==="peek"){st.peekLeave=true;st.target={x:st.peekDir>0?2*st.W:0,y:st.step.cy};kick()}book.classList.remove("is-corner")});

/* ---------- buttons & keys ---------- */
root.addEventListener("click",e=>{
  const b=e.target.closest("[data-goto],[data-act]");if(!b||!book.contains(b))return;
  if(st.mode==="peek")endStep(false);
  if(b.dataset.goto)goTo(idxOfPage(+b.dataset.goto));
  else if(b.dataset.act==="next")next();
  else if(b.dataset.act==="again")goTo(idxOfPage(4));
  else if(b.dataset.act==="close")goTo(maxI());
});
btnPrev.onclick=()=>{if(st.mode==="peek")endStep(false);prev()};
btnNext.onclick=()=>{if(st.mode==="peek")endStep(false);next()};
addEventListener("keydown",e=>{
  if(e.key==="Escape"&&parent!==window){try{parent.postMessage("kos-close","*")}catch(_){}}
  const a=document.activeElement,ok=!a||a===document.body||root.contains(a);if(!ok)return;
  const k=e.key,go=f=>{e.preventDefault();if(st.mode==="peek")endStep(false);f()};
  if(k==="ArrowRight"||k==="PageDown")go(next);else if(k==="ArrowLeft"||k==="PageUp")go(prev);
  else if(k==="Home"&&root.contains(a))go(()=>goTo(0));else if(k==="End"&&root.contains(a))go(()=>goTo(maxI()));
});

/* ---------- paper sound ---------- */
let sound=true,AC=null;
try{sound=localStorage.getItem("kos-sound")!=="off"}catch(_){}
soundBtn.setAttribute("aria-pressed",sound);
soundBtn.onclick=()=>{sound=!sound;soundBtn.setAttribute("aria-pressed",sound);try{localStorage.setItem("kos-sound",sound?"on":"off")}catch(_){}};
function chime(){
  if(typeof sound==="undefined"||!sound)return;
  try{
    AC=AC||new(window.AudioContext||window.webkitAudioContext)();
    const now=AC.currentTime+.35;
    [1318.5,1568,1975.5,2637].forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type="sine";o.frequency.value=f;
      const t0=now+i*.11;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.05,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+1.4);
      o.connect(g);g.connect(AC.destination);o.start(t0);o.stop(t0+1.5)});
  }catch(_){}
}
function rustle(hard){
  if(!sound)return;
  try{
    AC=AC||new(window.AudioContext||window.webkitAudioContext)();
    const d=hard?.32:.5,n=Math.floor(AC.sampleRate*d),buf=AC.createBuffer(1,n,AC.sampleRate),ch=buf.getChannelData(0);
    for(let i=0;i<n;i++){const t=i/n;ch[i]=(Math.random()*2-1)*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.25)),hard?3:1.6)*(.55+.45*Math.random())}
    const src=AC.createBufferSource();src.buffer=buf;
    const bp=AC.createBiquadFilter();bp.type="bandpass";bp.Q.value=hard?1.4:.7;
    const now=AC.currentTime;bp.frequency.setValueAtTime(hard?900:3600,now);bp.frequency.exponentialRampToValueAtTime(hard?260:1100,now+d);
    const g=AC.createGain();g.gain.value=hard?.22:.11;
    src.connect(bp);bp.connect(g);g.connect(AC.destination);src.start();
  }catch(_){}
}

/* ---------- boot & resize ---------- */
function relayout(){
  const was=st.single;cancelAnimationFrame(st.tween);st.tween=null;
  if(st.step){const s=st.step;st.step=null;st.mode=null;st.cur=s.a;[front,flapWrap,flapShade,cast,leaf].forEach(e=>e.hidden=true)}
  measure();
  if(was!==st.single){
    if(st.single){const pg=st.cur>=MAXS?LAST:st.cur*2;st.cur=idxOfPage(pg)}
    else{const pg=SEQ[st.cur];st.cur=pg%2===0?pg/2:(pg+1)/2}
  }
  st.queue=null;rest();
}
let rt;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(relayout,120)});
measure();rest();
})();
