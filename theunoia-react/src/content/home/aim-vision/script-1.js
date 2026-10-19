(()=>{
const svg=document.getElementById('town'),NS='http://www.w3.org/2000/svg';
const INK='#0F1B2D',IV='#F7F2E8',BE='#D9CBB0',GO='#C9A55C',GD='#A88540',GS='#8A6B2F';
const K=.74,C=.866*K,S=.5*K,OX=470,OY=92;
const P=(x,y,z=0)=>[OX+(x-y)*C,OY+(x+y)*S-z];
const pts=a=>a.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ');
const poly=(a,f,sw=1.4,st=INK)=>`<polygon points="${pts(a)}" fill="${f}" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const quad=(x0,y0,z0,x1,y1,z1,axis)=>axis==='y'?[P(x0,y0,z0),P(x1,y0,z0),P(x1,y0,z1),P(x0,y0,z1)]:[P(x0,y0,z0),P(x0,y1,z0),P(x0,y1,z1),P(x0,y0,z1)];

/* ---------- ground ---------- */
let g=`<defs><clipPath id="clipTick"><rect x="2" y="4" width="${(87*K-4).toFixed(1)}" height="16"/></clipPath><clipPath id="clipScreen"><rect x="1" y="1" width="${(106*K-2).toFixed(1)}" height="40"/></clipPath><pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r=".9" fill="${GS}" opacity=".55"/></pattern></defs>`;
const ground=(x,y,w,d,f,op=1)=>`<polygon points="${pts([P(x,y),P(x+w,y),P(x+w,y+d),P(x,y+d)])}" fill="${f}" opacity="${op}"/>`;
const ROAD=GD;
g+=ground(-300,300,1300,44,ROAD,.55);      // road along x
g+=ground(330,-300,44,1300,ROAD,.55);      // road along y
g+=ground(-300,610,1300,40,ROAD,.45);      // lower road
g+=ground(750,330,36,280,ROAD,.45);        // side lane
g+=ground(58,-300,36,600,ROAD,.4);         // back lane
// roundabout
const [rx,ry]=P(352,322);
g+=`<ellipse cx="${rx}" cy="${ry}" rx="${78*K*1.22}" ry="${78*K*.707}" fill="${ROAD}" opacity=".55"/><ellipse cx="${rx}" cy="${ry}" rx="${34*K*1.22}" ry="${34*K*.707}" fill="${GO}"/>`;
// gardens
const garden=(x,y,w,d)=>`<polygon points="${pts([P(x,y),P(x+w,y),P(x+w,y+d),P(x,y+d)])}" fill="${BE}" stroke="${GS}" stroke-width="1" opacity=".95"/><polygon points="${pts([P(x,y),P(x+w,y),P(x+w,y+d),P(x,y+d)])}" fill="url(#dots)"/>`;
g+=garden(420,400,170,150)+garden(30,380,150,120)+garden(560,120,120,130)+garden(-60,660,160,120);
const shadow=(x,y,w,d,h)=>`<polygon points="${pts([P(x+w,y),P(x+w+h*.55,y+h*.15),P(x+w+h*.55,y+d+h*.15),P(x+w,y+d)])}" fill="${GS}" opacity=".28"/>`;
const groundLayer=document.createElementNS(NS,'g');

/* ---------- objects (depth-sorted) ---------- */
const items=[];
const add=(depth,html)=>items.push({depth,html});
const foot=[];const reg=(x,y,w,d)=>foot.push({x0:x,y0:y,x1:x+w,y1:y+d,key:x+y+w+d});
// a point (person/tree) must be drawn after every building it stands in front of
const pkey=(x,y)=>{let k=x+y;for(const f of foot){const nearX=x>f.x0-140&&x<f.x1+140,nearY=y>f.y0-140&&y<f.y1+140;
  if(!(nearX&&nearY))continue;const front=(x>=f.x1&&y>f.y0-30)||(y>=f.y1&&x>f.x0-30);if(front&&k<=f.key)k=f.key+.5;}return k;};
reg(430,90,95,95);reg(110,120,130,80);reg(600,420,130,100);reg(170,410,70,52);reg(430,650,80,70);

function box(x,y,w,d,h,{top=IV,left=BE,right=GO,z=0}={}){
  return poly([P(x,y,z+h),P(x+w,y,z+h),P(x+w,y+d,z+h),P(x,y+d,z+h)],top)+
         poly([P(x,y+d,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x,y+d,z+h)],left)+
         poly([P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d,z+h),P(x+w,y,z+h)],right);
}
function winY(x,y,d,cols,rows,z0,h,w,f=INK){let s='';const cw=w/cols,rh=h/rows;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const a=x+i*cw+cw*.22,b=x+(i+1)*cw-cw*.22,c=z0+j*rh+rh*.25,e=z0+(j+1)*rh-rh*.2;
    s+=poly(quad(a,y+d,c,b,y+d,e,'y'),f,1);}return s;}
function winX(x,y,cols,rows,z0,h,dd,f=INK){let s='';const cw=dd/cols,rh=h/rows;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const a=y+i*cw+cw*.22,b=y+(i+1)*cw-cw*.22,c=z0+j*rh+rh*.25,e=z0+(j+1)*rh-rh*.2;
    s+=poly(quad(x,a,c,x,b,e,'x'),f,1);}return s;}

// text painted onto building walls (y-face = front-left wall, x-face = front-right wall)
const FONT='Manrope,ui-sans-serif,system-ui,sans-serif';
const txtY=(xm,y,z,str,size,fill,ls=.4)=>{const [X,Y]=P(xm,y,z);return `<text transform="matrix(.866 .5 0 1 ${X.toFixed(1)} ${Y.toFixed(1)})" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-weight="800" font-size="${size}" letter-spacing="${ls}" fill="${fill}">${str}</text>`;};
const txtX=(x,ym,z,str,size,fill,ls=.4)=>{const [X,Y]=P(x,ym,z);return `<text transform="matrix(.866 -.5 0 1 ${X.toFixed(1)} ${Y.toFixed(1)})" text-anchor="middle" dominant-baseline="central" font-family="${FONT}" font-weight="800" font-size="${size}" letter-spacing="${ls}" fill="${fill}">${str}</text>`;};

// THEUNOiA HQ tower
(()=>{const x=430,y=90,w=95,d=95,h=230;let s=shadow(x,y,w,d,h)+box(x,y,w,d,h);
  s+=winY(x,y,d,4,9,12,h-24,w,INK)+winX(x+w,y,4,9,12,h-24,d,GS);
  s+=box(x+18,y+18,w-36,d-36,16,{z:h,top:GO,left:BE,right:GD});
  // rooftop sign
  const [sx,sy]=P(x+w*.5,y+d*.5,h+16);
  s+=`<g transform="translate(${sx} ${sy-22})"><rect x="-36" y="-12" width="72" height="20" rx="3" fill="${INK}"/><text x="0" y="3" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="10.5" letter-spacing=".6" fill="${GO}">THEUNOiA</text><line x1="-20" y1="8" x2="-20" y2="22" stroke="${INK}" stroke-width="1.6"/><line x1="20" y1="8" x2="20" y2="22" stroke="${INK}" stroke-width="1.6"/></g>`;

  add(x+y+w+d,s);})();

// Campus building with pitched roof
(()=>{const x=110,y=120,w=130,d=80,h=86,hr=38;let s=shadow(x,y,w,d,h+hr*.6)+box(x,y,w,d,h,{top:BE,left:IV,right:BE});
  s+=winY(x,y,d,5,2,10,h-16,w,INK);
  s+=poly([P(x+w,y+16,0),P(x+w,y+d-16,0),P(x+w,y+d-16,40),P(x+w,y+16,40)],INK);           // door on gable side
  s+=poly([P(x,y,h),P(x+w,y,h),P(x+w,y+d/2,h+hr),P(x,y+d/2,h+hr)],GS);
  s+=poly([P(x,y+d,h),P(x+w,y+d,h),P(x+w,y+d/2,h+hr),P(x,y+d/2,h+hr)],GD);
  s+=poly([P(x+w,y,h),P(x+w,y+d,h),P(x+w,y+d/2,h+hr)],IV);
  s+=poly([P(x+w,y+d/2-7,h+8),P(x+w,y+d/2+7,h+8),P(x+w,y+d/2+7,h+22),P(x+w,y+d/2-7,h+22)],INK,1); // round window
  add(x+y+w+d,s);})();

// Glass studio / coworking
(()=>{const x=600,y=420,w=130,d=100,h=62;let s=shadow(x,y,w,d,h)+box(x,y,w,d,h,{top:IV,left:BE,right:GO});
  s+=poly(quad(x+10,y+d,8,x+w-10,y+d,h-8,'y'),INK,1);
  for(let i=1;i<5;i++){const u=x+10+i*(w-20)/5;s+=`<polyline points="${pts([P(u,y+d,8),P(u,y+d,h-8)])}" stroke="${GO}" stroke-width="1.4" fill="none"/>`;}
  s+=winX(x+w,y,3,1,10,h-20,d,GS);
  s+=box(x+20,y+20,40,30,10,{z:h,top:GO,left:BE,right:GD});
  // flag with H
  const [fx,fy]=P(x+w-18,y+18,h);s+=`<line x1="${fx}" y1="${fy}" x2="${fx}" y2="${fy-46}" stroke="${INK}" stroke-width="1.8"/><path d="M${fx} ${fy-46} l26 6 -26 7z" fill="${GO}" stroke="${INK}" stroke-width="1.2"/><text x="${fx+8}" y="${fy-36.5}" font-family="Manrope,sans-serif" font-weight="800" font-size="8" fill="${INK}">H</text>`;
  add(x+y+w+d,s);})();

// Meetup stall (Hivh) with awning
(()=>{const x=170,y=410,w=70,d=52,h=36;let s=shadow(x,y,w,d,h+30);
  s+=box(x,y,w,d,h,{top:IV,left:GO,right:GD});
  // posts
  [[x+2,y+d-2],[x+w-2,y+d-2],[x+w-2,y+2]].forEach(([a,b])=>{s+=`<polyline points="${pts([P(a,b,h),P(a,b,h+34)])}" stroke="${INK}" stroke-width="1.6" fill="none"/>`;});
  // striped awning
  const z=h+34;s+=poly([P(x-6,y-6,z),P(x+w+6,y-6,z),P(x+w+6,y+d+6,z),P(x-6,y+d+6,z)],IV);
  for(let i=0;i<6;i+=2){const a=x-6+i*(w+12)/6,b=x-6+(i+1)*(w+12)/6;s+=poly([P(a,y+d+6,z),P(b,y+d+6,z),P(b,y+d+6,z-9),P(a,y+d+6,z-9)],GO,1);
    s+=poly([P(a,y+d+6,z),P(b,y+d+6,z),P(b,y+d+6,z-9),P(a,y+d+6,z-9)],'none',1);}
  for(let i=1;i<6;i+=2){const a=x-6+i*(w+12)/6,b=x-6+(i+1)*(w+12)/6;s+=poly([P(a,y+d+6,z),P(b,y+d+6,z),P(b,y+d+6,z-9),P(a,y+d+6,z-9)],IV,1);}
  // wheel
  const [wx,wy]=P(x+w*.7,y+d,8);s+=`<ellipse cx="${wx}" cy="${wy}" rx="9" ry="10" fill="${BE}" stroke="${INK}" stroke-width="1.4"/><circle cx="${wx}" cy="${wy}" r="2" fill="${INK}"/>`;
  add(x+y+w+d,s);})();

// Small house front-bottom
(()=>{const x=430,y=650,w=80,d=70,h=58,hr=30;let s=shadow(x,y,w,d,h)+box(x,y,w,d,h,{top:BE,left:IV,right:GO});
  s+=winY(x,y,d,3,2,8,h-14,w,INK);
  s+=poly([P(x,y,h),P(x+w,y,h),P(x+w,y+d/2,h+hr),P(x,y+d/2,h+hr)],INK);
  s+=poly([P(x,y+d,h),P(x+w,y+d,h),P(x+w,y+d/2,h+hr),P(x,y+d/2,h+hr)],INK);
  s+=poly([P(x+w,y,h),P(x+w,y+d,h),P(x+w,y+d/2,h+hr)],GO);
  add(x+y+w+d,s);})();

// Map pin landmark
(()=>{const [px,py]=P(40,250);let s=`<ellipse cx="${px}" cy="${py}" rx="16" ry="7" fill="${GS}" opacity=".35"/><ellipse cx="${px}" cy="${py}" rx="9" ry="4" fill="${GO}" stroke="${INK}" stroke-width="1.3"/>`;
  s+=`<path d="M${px} ${py} C${px-6} ${py-22},${px-20} ${py-34},${px-20} ${py-50} a20 20 0 1 1 40 0 C${px+20} ${py-34},${px+6} ${py-22},${px} ${py}Z" fill="${GO}" stroke="${INK}" stroke-width="1.6"/><circle cx="${px}" cy="${py-50}" r="11" fill="${IV}" stroke="${INK}" stroke-width="1.3"/><text x="${px}" y="${py-46}" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="11" fill="${INK}">H</text>`;
  add(40+250+1,s);})();


/* ---------- live wall pieces (animated each frame) ---------- */
// local frames: Ly = flat on a front-left wall (local x runs along world +x), Lx = flat on a front-right wall (local x runs along world -y). Local y points down, 1 unit = 1px.
const Ly=(x,y,z)=>{const [X,Y]=P(x,y,z);return `matrix(.866 .5 0 1 ${X.toFixed(1)} ${Y.toFixed(1)})`;};
const Lx=(x,y,z)=>{const [X,Y]=P(x,y,z);return `matrix(.866 -.5 0 1 ${X.toFixed(1)} ${Y.toFixed(1)})`;};
const T=(x,y,str,size,fill,anchor='middle',ls=.4,w=800)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="central" font-family="${FONT}" font-weight="${w}" font-size="${size}" letter-spacing="${ls}" fill="${fill}">${str}</text>`;
const TICK='BUILD TODAY ✦ LEAD TOMORROW ✦ ';let tickW=170;
const live=[];
// 1. tower: LED ticker board + a hanging "HUSTLERS" banner that flutters
live.push({depth:710.3,draw:(ms,W,side)=>{const L=87*K,off=(ms*.028)%tickW;
  let s=`<g transform="${Ly(434,185,38)}"><rect width="${L.toFixed(1)}" height="24" fill="${INK}" stroke="${INK}" stroke-width="1.2"/>`;
  for(let i=3;i<L;i+=4)s+=`<circle cx="${i}" cy="2.4" r=".7" fill="${GO}" opacity="${(.4+.6*((Math.floor(ms/180)+i)%3===0)).toFixed(1)}"/><circle cx="${i}" cy="21.6" r=".7" fill="${GO}" opacity="${(.4+.6*((Math.floor(ms/180)+i+1)%3===0)).toFixed(1)}"/>`;
  s+=`<g clip-path="url(#clipTick)"><g transform="translate(${(-off).toFixed(1)} 0)">${T(0,12.5,TICK+TICK,10,GO,'start',.6)}</g></g></g>`;
  const fl=side*(2+3*W);let b=`<g transform="${Lx(525,152,208)}"><line x1="-2" y1="-2" x2="16" y2="-2" stroke="${INK}" stroke-width="2"/>`;
  const w1=Math.sin(ms/160)*3*W,w2=Math.sin(ms/160+1.2)*3*W;
  b+=`<path d="M0 0H14V${(104+w1).toFixed(1)}L7 ${(96+w2).toFixed(1)}L0 ${(104-w1).toFixed(1)}Z" fill="${GO}" stroke="${INK}" stroke-width="1.1" transform="skewX(${(-fl*.6).toFixed(2)})"/>`;
  'HUSTLERS'.split('').forEach((c,i)=>b+=`<g transform="skewX(${(-fl*.6).toFixed(2)})">${T(7,9+i*11.4,c,9.5,INK)}</g>`);
  return s+b+'</g>';}});
// 2. glass studio: digital screen cycling Hunhar messages
const MSG=[['HUNHAR','LIVE 13 · 11'],['BID.','BUILD. EARN.'],['A–Z','SKILLS WELCOME'],['10% FEE','ONLY ON DONE WORK'],['HUSTLERS','APPLY NOW']];
live.push({depth:1250.3,draw:(ms)=>{const L=106*K,H=42,cyc=2600,i=Math.floor(ms/cyc)%MSG.length,p=(ms%cyc)/cyc;
  const dy=p<.12?(1-p/.12)*H:p>.9?-(p-.9)/.1*H:0;const m=MSG[i];
  let s=`<g transform="${Ly(612,520,52)}"><rect width="${L.toFixed(1)}" height="${H}" fill="${INK}" stroke="${GO}" stroke-width="1.2"/><g clip-path="url(#clipScreen)"><g transform="translate(0 ${dy.toFixed(1)})">`;
  s+=T(L/2,16,m[0],m[0].length>6?11:14,GO,'middle',.6)+T(L/2,31,m[1],6.2,IV,'middle',.5,700);
  s+=`</g></g><circle cx="${L-5}" cy="5" r="1.6" fill="${GO}" opacity="${(Math.floor(ms/400)%2?1:.25)}"/></g>`;return s;}});
// 3. campus: "HUSTLERS WANTED" poster with tear-off tabs flapping in the wind
live.push({depth:440.3,draw:(ms,W,side)=>{const L=60*K;
  let s=`<g transform="${Lx(240,190,76)}"><rect width="${L.toFixed(1)}" height="22" fill="${IV}" stroke="${INK}" stroke-width="1"/>`;
  s+=T(L/2,7.5,'HUSTLERS',7.6,INK,'middle',.5)+T(L/2,15.5,'WANTED',6.4,GS,'middle',1.2)+`<circle cx="3" cy="3" r="1.3" fill="${GD}"/><circle cx="${L-3}" cy="3" r="1.3" fill="${GD}"/>`;
  const n=6,tw=L/n;for(let k=0;k<n;k++){const a=-side*(6+14*W)*(.6+.4*Math.sin(ms/120+k*1.7))*(k===2?0:1);
    s+=k===2?'':`<g transform="rotate(${a.toFixed(1)} ${(k*tw+tw/2).toFixed(1)} 22)"><rect x="${(k*tw+.6).toFixed(1)}" y="22" width="${(tw-1.2).toFixed(1)}" height="9" fill="${IV}" stroke="${INK}" stroke-width=".7"/><line x1="${(k*tw+tw/2).toFixed(1)}" y1="24" x2="${(k*tw+tw/2).toFixed(1)}" y2="29.5" stroke="${GS}" stroke-width=".9"/></g>`;}
  return s+'</g>';}});
// 4. Hivh stall: bunting flags under the awning swinging in the wind
live.push({depth:702.3,draw:(ms,W,side)=>{const L=82*K,ch=['H','I','V','H'];
  let s=`<g transform="${Ly(164,468,61)}"><path d="M0 0 Q${L/2} 5 ${L} 0" fill="none" stroke="${INK}" stroke-width="1"/>`;
  ch.forEach((c,i)=>{const cx=L*(i+.5)/4,cy=1.6*Math.sin(Math.PI*(i+.5)/4)*2,a=-side*(5+12*W)+Math.sin(ms/140+i*1.3)*6*W,f=i%2?IV:INK,tc=i%2?INK:GO;
    s+=`<g transform="rotate(${a.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})"><path d="M${(cx-6.5).toFixed(1)} ${cy.toFixed(1)}H${(cx+6.5).toFixed(1)}L${cx.toFixed(1)} ${(cy+14).toFixed(1)}Z" fill="${f}" stroke="${INK}" stroke-width=".9"/>${T(cx.toFixed(1),(cy+4.6).toFixed(1),c,6.8,tc)}</g>`;});
  return s+'</g>';}});
// 5. small house: launch poster with a corner peeling in the wind
live.push({depth:1230.3,draw:(ms,W)=>{const w=36,h=26,f=5+4*W*(.5+.5*Math.sin(ms/110));
  let s=`<g transform="${Lx(510,706,48)}"><path d="M0 0H${w}V${(h-f).toFixed(1)}L${(w-f).toFixed(1)} ${h}H0Z" fill="${GO}" stroke="${INK}" stroke-width="1"/>`;
  s+=T(w/2,8,'HUNHAR',7.8,INK,'middle',.5)+T(w/2,16.5,'LIVE 13·11',5.6,INK,'middle',.4,700);
  s+=`<path d="M${(w-f).toFixed(1)} ${h}L${w} ${(h-f).toFixed(1)}L${(w-f*1.1).toFixed(1)} ${(h-f*1.25).toFixed(1)}Z" fill="${IV}" stroke="${INK}" stroke-width=".8"/>`;
  return s+'</g>';}});

// Trees (drawn every frame so they bend in the wind)
function tree(x,y,sc,ang,flut){const [tx,ty]=P(x,y);const bend=ang*.6;
  return `<ellipse cx="${tx+8*sc+ang*.3}" cy="${ty+2}" rx="${12*sc}" ry="${5*sc}" fill="${GS}" opacity=".35"/>`+
  `<g transform="rotate(${bend.toFixed(2)} ${tx} ${ty})"><path d="M${tx} ${ty} q${(ang*.08).toFixed(2)} ${-10*sc} ${(ang*.18).toFixed(2)} ${-20*sc}" stroke="${INK}" stroke-width="1.6" fill="none"/>`+
  `<g transform="rotate(${(ang*.5+flut).toFixed(2)} ${tx} ${ty-20*sc})"><ellipse cx="${tx}" cy="${ty-34*sc}" rx="${10*sc}" ry="${20*sc}" fill="${GD}" stroke="${INK}" stroke-width="1.3"/><path d="M${tx} ${ty-48*sc} q4 12 0 24" stroke="${GS}" stroke-width="1.1" fill="none"/></g></g>`;}
const trees=[[450,430,1],[500,460,.85],[560,420,1.1],[470,520,1],[540,505,.8],[580,530,1],[60,410,1],[120,450,.8],[150,395,1.05],[590,150,1],[650,170,.9],[620,230,1.1],[-20,690,1],[40,720,.85],[250,230,.9],[300,60,1],[810,300,.9]]
  .map(([x,y,s],i)=>({x,y,s,ph:i*1.7}));

// People
function person(x,y,o={}){const {body=INK,legs=INK,head=BE,laptop=false,hair=INK,stride=0,lean=0,blow=0}=o;const [sx,sy]=P(x,y);
  let s=`<ellipse cx="${sx+6}" cy="${sy+1}" rx="8" ry="3" fill="${GS}" opacity=".35"/>`;
  s+=`<line x1="${sx-1.6}" y1="${sy-9}" x2="${sx-1.6+stride}" y2="${sy}" stroke="${legs}" stroke-width="2.2" stroke-linecap="round"/><line x1="${sx+1.6}" y1="${sy-9}" x2="${sx+1.6-stride}" y2="${sy}" stroke="${legs}" stroke-width="2.2" stroke-linecap="round"/>`;
  s+=`<g transform="rotate(${lean.toFixed(2)} ${sx} ${sy-9})">`;
  s+=`<line x1="${sx-3.6}" y1="${sy-19}" x2="${sx-3.6-stride*.9}" y2="${sy-11}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
  s+=`<rect x="${sx-4}" y="${sy-21}" width="8" height="13" rx="3" fill="${body}" stroke="${INK}" stroke-width="1"/>`;
  s+=laptop?`<rect x="${sx+2}" y="${sy-17}" width="7" height="5" rx="1" fill="${GO}" stroke="${INK}" stroke-width=".9"/>`
           :`<line x1="${sx+3.6}" y1="${sy-19}" x2="${sx+3.6+stride*.9}" y2="${sy-11}" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
  s+=`<circle cx="${sx}" cy="${sy-25}" r="3.6" fill="${head}" stroke="${INK}" stroke-width="1"/><path d="M${sx-3.6} ${sy-25.5} a3.6 3.6 0 0 1 7.2 0" fill="${hair}"/>`;
  const sg=blow<0?-1:1,bb=Math.abs(blow);s+=`<path d="M${sx+3*sg} ${sy-27} q${sg*(2+bb)} ${-1-bb*.3} ${sg*(3+bb*1.6)} ${bb*.4}" stroke="${hair}" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>`;
  return s;}

/* ---------- everyone walks ---------- */
// a,b = start/end in ground units; pp = walk back and forth
const walkers=[
  {a:[156,312],b:[504,312],v:.026,t:0,body:IV,pp:1},
  {a:[491,332],b:[175,332],v:.02,t:.4,body:GO,laptop:true,pp:1},
  {a:[345,113],b:[345,519],v:.024,t:.2,body:INK,pp:1},
  {a:[362,519],b:[362,131],v:.019,t:.65,body:GD,pp:1},
  {a:[-160,628],b:[324,628],v:.022,t:.5,body:IV,laptop:true,pp:1},
  {a:[768,330],b:[768,620],v:.03,t:.1,body:GO,pp:1},
  {a:[540,302],b:[860,302],v:.03,t:.3,body:INK,pp:1},
  {a:[165,322],b:[497,322],v:.017,t:.82,body:GD,pp:1},
  {a:[352,519],b:[352,120],v:.028,t:.08,body:IV,laptop:true,pp:1},
  {a:[-160,620],b:[316,620],v:.02,t:.12,body:GO,pp:1},
  // students strolling around the stall, gardens and studio
  {a:[140,490],b:[280,470],v:.05,t:0,body:GO,pp:1},
  {a:[175,530],b:[300,476],v:.045,t:.5,body:IV,laptop:true,pp:1},
  {a:[440,410],b:[590,540],v:.04,t:.2,body:INK,laptop:true,pp:1},
  {a:[590,560],b:[740,560],v:.05,t:.6,body:IV,pp:1},
  {a:[390,262],b:[250,282],v:.05,t:.3,body:GD,laptop:true,pp:1},
  {a:[720,580],b:[820,470],v:.045,t:.7,body:IV,laptop:true,pp:1},
  {a:[560,30],b:[700,100],v:.04,t:.4,body:GO,pp:1},
  {a:[220,590],b:[299,594],v:.04,t:.9,body:INK,pp:1}
];

/* ---------- gentle breeze that follows the cursor ---------- */
const streaks=Array.from({length:6},(_,i)=>({x:(i*173)%900,y:(i*251)%640,len:60+(i*37)%50,v:70+(i*23)%40,ph:i*1.3}));
const leaves=Array.from({length:9},(_,i)=>({x:(i*311)%900,y:(i*137)%640,v:40+(i*17)%30,ph:i*.9,amp:6+(i*5)%10,sz:2.2+(i%3)*.6,spin:(i%2?1:-1)*(60+(i*29)%90),c:[GD,GO,GS][i%3]}));
// newspapers that blow through now and then
const papers=Array.from({length:3},(_,i)=>({on:false,wait:1.5+i*2.8,x:0,y:0,r:0,sp:0,v:0,ph:0}));
const paper=(x,y,r,f)=>`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(1)}) scale(${f.toFixed(2)} 1)"><path d="M-13 -9 L13 -9 L13 9 L-13 9Z" fill="${IV}" stroke="${INK}" stroke-width="1"/><line x1="0" y1="-9" x2="0" y2="9" stroke="${GS}" stroke-width=".7"/><rect x="-11" y="-7" width="9" height="2.6" fill="${INK}"/><path d="M-11 -2.5h9M-11 0h9M-11 2.5h7M-11 5h9M2 -7h9M2 -4.5h9M2 -2h6" stroke="${GS}" stroke-width=".9"/><rect x="2" y="0.5" width="9" height="6" fill="${GO}" stroke="${INK}" stroke-width=".5"/></g>`;
const gust=t=>.55+.45*(.5+.5*Math.sin(t/3100)*Math.sin(t/1300+1)); // soft swell, 0.55..1
let dir={x:1,y:.12},target={x:1,y:.12};
const sec=document.querySelector('.vm');
sec.addEventListener('pointermove',e=>{const r=sec.getBoundingClientRect();const vx=e.clientX-(r.left+r.width/2),vy=e.clientY-(r.top+r.height/2);
  const m=Math.hypot(vx,vy);if(m>20)target={x:vx/m,y:vy/m};});

const root=document.createElementNS(NS,'g');const air=document.createElementNS(NS,'g');
svg.innerHTML=g;svg.appendChild(root);svg.appendChild(air);
const reduce=false; // always animate (requested), even when the device has animations turned off
let prev=null;
const wrap=(v,max,pad)=>v>max+pad?v-(max+2*pad):v<-pad?v+(max+2*pad):v;

function frame(ms){
  const dt=prev==null?0:Math.min(.1,(ms-prev)/1000);prev=ms;
  // ease the wind toward the cursor direction
  dir.x+=(target.x-dir.x)*Math.min(1,dt*2.5);dir.y+=(target.y-dir.y)*Math.min(1,dt*2.5);
  const dm=Math.hypot(dir.x,dir.y)||1,dx=dir.x/dm,dy=dir.y/dm;
  const W=gust(ms),side=dx; // -1 (left) .. 1 (right)
  const list=items.slice();
  live.forEach(l=>list.push({depth:l.depth,html:l.draw(ms,W,side)}));
  trees.forEach(tr=>{const ang=side*(2.5+4*W)+Math.sin(ms/420+tr.ph)*1.4*W;
    const flut=Math.sin(ms/260+tr.ph)*1.6*W;list.push({depth:pkey(tr.x,tr.y),html:tree(tr.x,tr.y,tr.s,ang,flut)});});
  walkers.forEach(w=>{let p=((w.t+ms*w.v/1000/(Math.hypot(w.b[0]-w.a[0],w.b[1]-w.a[1])/400))%1+1)%1;
    if(w.pp)p=p<.5?p*2:2-p*2;
    const x=w.a[0]+(w.b[0]-w.a[0])*p,y=w.a[1]+(w.b[1]-w.a[1])*p;
    const stride=Math.sin(ms/130+w.t*10)*2.6;
    list.push({depth:pkey(x,y),html:person(x,y,{body:w.body,laptop:w.laptop,stride,lean:side*(1.5+1.5*W),blow:side*(.6+.8*W+Math.sin(ms/110+w.t*9)*.3)})});});
  list.sort((a,b)=>a.depth-b.depth);
  root.innerHTML=list.map(i=>i.html).join('');
  let a='';const t=ms/1000,nx=-dy,ny=dx;
  streaks.forEach(s=>{s.x=wrap(s.x+dx*s.v*W*dt,900,140);s.y=wrap(s.y+dy*s.v*W*dt,640,140);
    const L=s.len,wob=Math.sin(t*1.1+s.ph)*5,x0=s.x-dx*L,y0=s.y-dy*L,mx=(s.x+x0)/2+nx*wob,my=(s.y+y0)/2+ny*wob;
    a+=`<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${s.x.toFixed(1)} ${s.y.toFixed(1)}" fill="none" stroke="#F7F2E8" stroke-width="1.5" stroke-linecap="round" opacity="${(.22+.18*W).toFixed(2)}"/>`;});
  leaves.forEach(l=>{l.x=wrap(l.x+dx*l.v*W*dt,900,40);l.y=wrap(l.y+dy*l.v*W*dt,640,40);
    const o=Math.sin(t*1.4+l.ph)*l.amp,x=l.x+nx*o,y=l.y+ny*o;
    a+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(l.sz*1.6).toFixed(1)}" ry="${l.sz.toFixed(1)}" fill="${l.c}" stroke="${INK}" stroke-width=".6" opacity=".85" transform="rotate(${(t*l.spin%360).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;});
  papers.forEach(n=>{
    if(!n.on){n.wait-=dt;if(n.wait<=0){const off=(Math.random()-.5)*620;n.x=470-dx*540+nx*off;n.y=320-dy*380+ny*off*.6;
      n.v=55+Math.random()*35;n.sp=(Math.random()<.5?-1:1)*(90+Math.random()*140);n.ph=Math.random()*6;n.r=Math.random()*360;n.age=0;n.on=true;}return;}
    n.x+=dx*n.v*W*dt;n.y+=dy*n.v*W*dt+Math.sin(t*1.8+n.ph)*18*dt;n.r+=n.sp*dt;
    if(n.x<-240||n.x>1140||n.y<-240||n.y>880||(n.age=(n.age||0)+dt)>30){n.on=false;n.wait=3+Math.random()*7;return;}
    const lift=Math.sin(t*2.3+n.ph)*10;a+=paper(n.x+nx*lift,n.y+ny*lift,n.r,Math.cos(t*3.1+n.ph));});
  air.innerHTML=a;
}
const measure=()=>{try{const t=document.createElementNS(NS,'text');t.setAttribute('font-family',FONT);t.setAttribute('font-weight','800');t.setAttribute('font-size','10');t.setAttribute('letter-spacing','.6');t.textContent=TICK;svg.appendChild(t);tickW=t.getComputedTextLength()||tickW;t.remove();}catch(e){}};
measure();document.fonts&&document.fonts.ready.then(measure);
frame(0);
const t0=performance.now();let lastRaf=0;
const onScreen=()=>{const r=sec.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;};
const loop=ms=>{lastRaf=performance.now();if(onScreen())frame(ms);requestAnimationFrame(loop);};requestAnimationFrame(loop);
// backup timer in case the page's host pauses animation frames
setInterval(()=>{const now=performance.now();if(now-lastRaf>200&&onScreen())frame(now-t0);},40);
})();
