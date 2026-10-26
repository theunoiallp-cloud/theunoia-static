(function(){
const _gl=(()=>{try{if(!window.THREE)return false;const c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'));}catch(e){return false;}})();
if(!_gl){const B=document.getElementById('bt');B.classList.add('bt-static');B.style.height='auto';B.innerHTML='<article class="bt-s bt-s1"><h2>Our Story</h2><p>How a simple idea became a vision to connect people, talent, and opportunity.</p></article><article class="bt-s"><h2>It began with a question</h2><p>What if finding the right person for an opportunity could be simpler? In 2025, THEUNOiA LLP began with a thought: that talent exists everywhere, but finding the right connection isn’t always easy.</p></article><article class="bt-s"><h2>Connection changes everything</h2><p>People have skills. Ideas have potential. Opportunities are everywhere… THEUNOiA was created to bring them together: giving people a space to discover opportunities, showcase what they can do, and turn ideas into something real.</p></article><article class="bt-s"><h2>We are all part of something bigger</h2><p>No idea grows alone. Behind every opportunity is a person. Behind every project is a team. And behind every successful idea is a network of people willing to build together. THEUNOiA LLP brings those people closer.</p></article><article class="bt-s"><h2>The first step</h2><p>What started as an idea is becoming a platform. THEUNOiA is building a space where talent can be discovered, opportunities can be created, and people from across India can come together to build what comes next: HUNHAR.</p></article><article class="bt-s"><h2>This is just the beginning</h2><p>The idea was never just to build a platform. It was to build a community around possibility.</p></article><article class="bt-s"><h2>Be part of what comes next</h2><p>Have a skill? An idea? An opportunity? A team to build? Tell us what you’re working on. Your next opportunity might begin with a connection.</p></article>';return;}
const SEC=document.getElementById('bt'),STAGE=SEC.querySelector('.bt-stage'),STEP=55,HOLD=45;
const N=24000, MORPH=2800, TAU=Math.PI*2;
let scene,camera,renderer,pts,cur=0,tgt=0,morphing=false,t0=0,locked=false,rot=0,last=0,lf=0;
let mx=0,my=0,tmx=0,tmy=0;const mw=new THREE.Vector3(),tmw=new THREE.Vector3();
const attract=[0,0,0,0,0,0], rotW=[0,0,1,0,0,0];
const secShape=[0,1,2,4,3,1,5];
const secs=[
 {n:'Story',big:1,t:'Our Story',p:'How a simple idea became a vision to connect people, talent, and opportunity.'},
 {n:'2025',t:'It began with a question',p:'What if finding the right person for an opportunity could be simpler? In 2025, THEUNOiA LLP began with a thought: that talent exists everywhere, but finding the right connection isn’t always easy.'},
 {n:'Idea',t:'Connection changes everything',p:'People have skills. Ideas have potential. Opportunities are everywhere… THEUNOiA was created to bring them together: giving people a space to discover opportunities, showcase what they can do, and turn ideas into something real.'},
 {n:'Name',t:'We are all part of something bigger',p:'No idea grows alone. Behind every opportunity is a person. Behind every project is a team. And behind every successful idea is a network of people willing to build together. THEUNOiA LLP brings those people closer.'},
 {n:'HUNHAR',cd:1,t:'The first step',p:'What started as an idea is becoming a platform. THEUNOiA is building a space where talent can be discovered, opportunities can be created, and people from across India can come together to build what comes next: HUNHAR.'},
 {n:'Cities',t:'This is just the beginning',p:'The idea was never just to build a platform. It was to build a community around possibility.'},
 {n:'Signal',top:1,t:'Be part of what comes next',p:'Have a skill? An idea? An opportunity? A team to build? Tell us what you’re working on. Your next opportunity might begin with a connection.'}
];
function daysLine(){const d=Math.ceil((new Date(2026,10,13)-new Date())/864e5);return d>0?d+(d===1?' day':' days')+' to go':'Now live';}

/* ---------------------------------------------------------------------------
   Every shape is worked out on the graphics card from each particle's own
   random numbers (aF, aR) and the clock, so after a shape forms its particles
   keep travelling along it:
   0 sphere: drifts round its tilted axis like a globe, each particle at its own speed
   1 swarm: swirls like a galaxy, faster near the centre
   2 helix: neighbouring strands flow in opposite directions along the wave
   3 stream: the ribbon flows left to right while its wave rolls along
   4 torus: particles circle the ring and wind round the tube
   5 rings: each ring orbits, alternate rings in opposite directions
   logo: particles travel round the infinity mark, swirl inside the two dots and run down the stem
--------------------------------------------------------------------------- */
const vs=`
uniform float uP,uT,uPR,uAtt,uRot,uTr,uHd,uLs,uCs,uLp,uSA,uSB,uLf;uniform vec3 uM;uniform vec2 uLo,uHp;
uniform float uS2U[65];
attribute vec3 aL,aR,aC;attribute float aP,aS;attribute vec4 aF;attribute vec2 aU;
varying vec3 vC;varying float vA;
const float PI=3.14159265,TAU=6.2831853;
float ease(float t){return t<.5?4.*t*t*t:1.-pow(-2.*t+2.,3.)/2.;}
vec3 rotX(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,p.y*c-p.z*s,p.y*s+p.z*c);}
vec2 rot2(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(p.x*c-p.y*s,p.x*s+p.y*c);}
vec2 lem(float u){float t=1.5*PI-TAU*u,sn=sin(t),c=cos(t),d=1.+sn*sn;return 6.3*vec2(c/d,sn*c/d);}
vec4 shapeAt(float id){
 float t=uT;
 if(id<-.5)return vec4(position,1.);
 if(id<.5){
  float th=aF.x*TAU+t*(.10+.12*aR.x);
  float ph=acos(2.*aF.y-1.)+.18*sin(t*.35+aF.x*TAU);
  float r=aF.z<.93?5.8+(aF.w-.5)*.45:aF.z<.98?4.2+aF.w*1.4:.5+aF.w*3.5;
  return vec4(rotX(vec3(r*sin(ph)*cos(th),r*sin(ph)*sin(th),r*cos(ph)),1.15),1.);
 }
 if(id<1.5){
  float rad=pow(aF.x,2.2)*8.;
  float th=aF.y*TAU+t*(.35/(1.+rad*.35))*(.7+.6*aR.y);
  float ph=acos(2.*aF.z-1.);
  return vec4(rad*sin(ph)*cos(th),rad*sin(ph)*sin(th),rad*cos(ph)*.6,1.);
 }
 if(id<2.5){
  float k=floor(aF.y*7.),ph=k*TAU/7.,dir=mod(k,2.)<.5?1.:-1.;
  float T=mod(aF.x*6.*PI+t*dir*(.45+.35*aR.z),6.*PI)-3.*PI;
  float ds=abs(T)/(3.*PI),env=.6+pow(ds,.85)*2.4,fx=T*1.1;
  return vec4(T*1.9,
   sin(fx+ph)*env*1.5+sin(T*2.2-ph*.5)*.6+(aF.z-.5)*.45,
   cos(fx+ph)*env*1.8+cos(T*2.2-ph*.5)*.6+(aF.w-.5)*.45,
   smoothstep(0.,.07,1.-ds));
 }
 if(id<3.5){
  float u=mod(aF.x*20.+t*(.9+.8*aR.x),20.)-10.,env=cos(u/20.*PI);
  return vec4(u,sin(u*.8-t*.9)*.9*env+(aF.y-.5)*(1.2+env*3.2)*.65,(aF.z-.5)*(1.2+env*3.),smoothstep(0.,.18,env));
 }
 if(id<4.5){
  float u=aF.x*TAU*2.+t*(.12+.08*aR.y),v=aF.y*TAU*3.+t*(.45+.3*aR.x);
  float rm=2.6+sin(v*3.)*.5+(aF.z-.5)*.6,R=5.2+rm*cos(v);
  return vec4(R*cos(u)*.95,R*sin(u)*.95,rm*sin(v)*.95+(aF.w-.5)*.6,1.);
 }
 float k=floor(aF.x*15.),r=1.6+k*.6+(aF.y-.5)*.12,dir=mod(k,2.)<.5?1.:-1.;
 float th=aF.z*TAU+t*dir*(.32-k*.014)*(.8+.4*aR.x);
 return vec4(r*cos(th)*1.7,r*sin(th)*.55-1.5,r*sin(th)*.9,1.);
}
void main(){
 float e=ease(uP);
 float st=aR.z*.22; float lp=clamp((e-st)/(1.-.22),0.,1.);
 vec4 A=shapeAt(uSA),B=shapeAt(uSB);
 vec3 p=mix(A.xyz,B.xyz,lp);float fade=mix(A.w,B.w,lp);
 if(abs(uRot)>.0001)p=rotX(p,uRot);
 if(uAtt>.001){float d=aR.x*aR.x*6.5+.3;vec3 o=normalize(aR-vec3(.5));p=mix(p,uM+o*d,uAtt*.92);}
 // logo: particles move along the mark once it is fully drawn (uLf grows only then)
 vec3 L=aL;float pe=aP;
 if(aU.x>=0.){
  float s=fract(aU.x+uLf*(.8+.4*aR.y)),k=s*64.,i0=floor(k);
  float u=mix(uS2U[int(i0)],uS2U[int(min(i0+1.,64.))],k-i0);
  vec2 q=lem(u),tg=normalize(lem(u+.0005)-q+1e-6);
  L.xy=q+vec2(-tg.y,tg.x)*aU.y;pe=.1+.9*s;
 }else if(aU.x>-1.5){L.xy=vec2(0.,3.7)+rot2(aL.xy-vec2(0.,3.7),uLf*6.*(.6+.8*aR.x));}
 else if(aU.x>-2.5){L.xy=vec2(0.,-1.95)+rot2(aL.xy-vec2(0.,-1.95),-uLf*6.*(.6+.8*aR.x));}
 else{L.y=-1.95+mod(aL.y+1.95-uLf*4.*(.6+.8*aR.z),4.57);}
 float rv=clamp((uTr-aP)/.08,0.,1.);rv=rv*rv*(3.-2.*rv);
 p=mix(mix(p,vec3(uHp,0.),uCs),vec3(L.xy*uLs+uLo,L.z),rv);
 p+=vec3(sin(uT*.5+aR.x*6.28),cos(uT*.4+aR.y*6.28),sin(uT*.6+aR.z*6.28))*.06;
 vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;
 float hd=step(.001,uHd)*exp(-pow((uHd-pe-.03)/.02,2.));
 hd*=1.-uLp*(1.-step(.1,aP)*step(aP,1.));
 gl_PointSize=aS*uPR*26./-mv.z*(1.+rv*.7+hd*1.2);
 vec3 og=vec3(.83,.41,.29)*(.8+.3*aR.x);
 vC=mix(mix(aC,og,rv*.92),vec3(.11,.12,.29),hd);vA=mix(.55+.45*aR.y,.95,rv*.8)*mix(1.,smoothstep(0.,.25,rv),uCs)*mix(fade,1.,rv);
}`;
const fs=`varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;
 gl_FragColor=vec4(vC,smoothstep(.5,.28,d)*vA);}`;

/* the same shapes in JavaScript, used only to freeze the in-between picture when someone scrolls again mid-morph */
let F,R;
function shapeJS(id,i,t,o){
 const fx=F[i*4],fy=F[i*4+1],fz=F[i*4+2],fw=F[i*4+3],rx=R[i*3],ry=R[i*3+1],rz=R[i*3+2],mod=(a,m)=>a-m*Math.floor(a/m);
 const S=Math.sin,C=Math.cos,PI=Math.PI;let x,y,z;
 if(id===0){const th=fx*TAU+t*(.10+.12*rx),ph=Math.acos(2*fy-1)+.18*S(t*.35+fx*TAU),r=fz<.93?5.8+(fw-.5)*.45:fz<.98?4.2+fw*1.4:.5+fw*3.5;
  x=r*S(ph)*C(th);const y0=r*S(ph)*S(th),z0=r*C(ph),c=C(1.15),s=S(1.15);y=y0*c-z0*s;z=y0*s+z0*c;}
 else if(id===1){const rad=Math.pow(fx,2.2)*8,th=fy*TAU+t*(.35/(1+rad*.35))*(.7+.6*ry),ph=Math.acos(2*fz-1);
  x=rad*S(ph)*C(th);y=rad*S(ph)*S(th);z=rad*C(ph)*.6;}
 else if(id===2){const k=Math.floor(fy*7),ph=k*TAU/7,dir=mod(k,2)<.5?1:-1,T=mod(fx*6*PI+t*dir*(.45+.35*rz),6*PI)-3*PI,
  ds=Math.abs(T)/(3*PI),env=.6+Math.pow(ds,.85)*2.4,f=T*1.1;
  x=T*1.9;y=S(f+ph)*env*1.5+S(T*2.2-ph*.5)*.6+(fz-.5)*.45;z=C(f+ph)*env*1.8+C(T*2.2-ph*.5)*.6+(fw-.5)*.45;}
 else if(id===3){const u=mod(fx*20+t*(.9+.8*rx),20)-10,env=C(u/20*PI);
  x=u;y=S(u*.8-t*.9)*.9*env+(fy-.5)*(1.2+env*3.2)*.65;z=(fz-.5)*(1.2+env*3);}
 else if(id===4){const u=fx*TAU*2+t*(.12+.08*ry),v=fy*TAU*3+t*(.45+.3*rx),rm=2.6+S(v*3)*.5+(fz-.5)*.6,Rr=5.2+rm*C(v);
  x=Rr*C(u)*.95;y=Rr*S(u)*.95;z=rm*S(v)*.95+(fw-.5)*.6;}
 else{const k=Math.floor(fx*15),r=1.6+k*.6+(fy-.5)*.12,dir=mod(k,2)<.5?1:-1,th=fz*TAU+t*dir*(.32-k*.014)*(.8+.4*rx);
  x=r*C(th)*1.7;y=r*S(th)*.55-1.5;z=r*S(th)*.9;}
 o[0]=x;o[1]=y;o[2]=z;
}

// Logo: infinity mark + dot. Six cities sit on it; particles trace city to city and draw it.
let logo,csm=0,trG=0,traceStart=0,LS=1;const LO_Y=.9,CITY_SEC=5;
function buildLogo(){
 const a=6.3,w=.62,K=4000,DOT=[0,3.7],DR=.78,DEL=[0,-1.95],DLR=.62,I_STYLE=false,SW=1.3,SH=.3;
 const pt=u=>{const t=1.5*Math.PI-2*Math.PI*u,sn=Math.sin(t),c=Math.cos(t),d=1+sn*sn;return [a*c/d,a*sn*c/d];};
 const cs=new Float32Array(K+1);let pv=pt(0);
 for(let k=1;k<=K;k++){const q=pt(k/K);cs[k]=cs[k-1]+Math.hypot(q[0]-pv[0],q[1]-pv[1]);pv=q;}
 const tot=cs[K];
 const uOfS=s=>{s*=tot;let lo=0,hi=K;while(hi-lo>1){const m=(lo+hi)>>1;if(cs[m]<=s)lo=m;else hi=m;}return (lo+(s-cs[lo])/((cs[hi]-cs[lo])||1))/K;};
 const gOf=u=>.10+.90*cs[Math.round(u*K)]/tot;
 const L=new Float32Array(N*3),P=new Float32Array(N),U=new Float32Array(N*2);
 for(let i=0;i<N;i++){
  if(i%25===0){const r=DR*Math.sqrt(Math.random()),th=Math.random()*6.2832;
   if(I_STYLE){L[i*3]=DOT[0]+(Math.random()*2-1)*SW;L[i*3+1]=DOT[1]+(Math.random()*2-1)*SH;}
   else{L[i*3]=DOT[0]+r*Math.cos(th);L[i*3+1]=DOT[1]+r*Math.sin(th);}
   P[i]=Math.random()*.03;U[i*2]=-1;}
  else if(i%40===1){const r=DLR*Math.sqrt(Math.random()),th=Math.random()*6.2832;
   if(I_STYLE){L[i*3]=DEL[0]+(Math.random()*2-1)*SW;L[i*3+1]=DEL[1]+(Math.random()*2-1)*SH;}
   else{L[i*3]=DEL[0]+r*Math.cos(th);L[i*3+1]=DEL[1]+r*Math.sin(th);}
   P[i]=1.03+Math.random()*.02;U[i*2]=-2;}
  else if(i%8===3){const y0=I_STYLE?DOT[1]:DOT[1]-DR-.3,y1=DEL[1],y=y1+Math.random()*(y0-y1);
   L[i*3]=(Math.random()*2-1)*w;L[i*3+1]=y;
   P[i]=y>0?.03+.07*((y0-y)/y0):1.005+.025*(-y/(-y1));U[i*2]=-3;}
  else{const s=Math.random(),u=uOfS(s),q=pt(u),q2=pt(Math.min(1,u+1e-4)),tx=q2[0]-q[0],ty=q2[1]-q[1],l=Math.hypot(tx,ty)||1,o=(Math.random()*2-1)*w;
   L[i*3]=q[0]-ty/l*o;L[i*3+1]=q[1]+tx/l*o;P[i]=.10+.90*s;U[i*2]=s;U[i*2+1]=o;}
  L[i*3+2]=(Math.random()-.5)*.5;
 }
 const s2u=[];for(let j=0;j<=64;j++)s2u.push(uOfS(j/64));
 const sm=f=>{f=Math.max(0,Math.min(1,f));return f*f*(3-2*f);};
 const headAt=g=>{
  if(g<.03)return DOT;
  if(g<.10){const f=(g-.03)/.07,q=pt(0);return [DOT[0]+(q[0]-DOT[0])*f,DOT[1]+(q[1]-DOT[1])*f];}
  if(g<=1)return pt(uOfS(Math.min(1,(g-.10)/.90)));
  const f=sm((g-1)/.05);return [0,DEL[1]*f];
 };
 const at=u=>{const q=pt(u);return {x:q[0],y:q[1],g:gOf(u)};};
 const cities=[
  {name:'Raipur',hub:1,x:DOT[0],y:DOT[1],g:.08,from:.02,side:'r'},
  Object.assign({name:'Nagpur',side:'t'},at(.125)),
  Object.assign({name:'Mumbai',side:'l'},at(.25)),
  Object.assign({name:'Bengaluru',side:'b'},at(.375)),
  Object.assign({name:'Chennai',side:'t'},at(.625)),
  Object.assign({name:'Bhubaneswar',side:'r'},at(.75)),
  Object.assign({name:'Coimbatore',side:'b'},at(.875)),
  {name:'Delhi',x:DEL[0],y:DEL[1],g:1.05,from:1.0,side:'b'}
 ];
 cities.forEach(c=>{if(c.from===undefined)c.from=c.g-.01;});
 return {L,P,U,s2u,cities,headAt,iStyle:I_STYLE};
}
const TRACE_MS=4200,LOOP_MS=6000,G_END=1.14;
function gAt(el){return Math.min(G_END,el/TRACE_MS);}
const _pv=new THREE.Vector3();
function updatePins(){
 const show=sec===CITY_SEC&&trG>0;
 const pxU=innerHeight/(2*camera.position.z*.5206)*LS,narrow=innerWidth<700,mid=innerWidth<1400;
 pts.updateMatrixWorld();
 logo.cities.forEach(c=>{
  const on=show&&trG>=c.from;c.el.classList.toggle('on',on);
  if(!on)return;
  _pv.set(c.x*LS,c.y*LS+LO_Y,0).applyMatrix4(pts.matrixWorld).project(camera);
  c.el.style.transform=`translate(${(_pv.x+1)/2*innerWidth}px,${(1-_pv.y)/2*innerHeight}px)`;
  let side=c.side;if(c.name==='Mumbai'&&mid)side='t';if(c.name==='Bhubaneswar'&&narrow)side='t';
  const gap=(c.hub?(logo.iStyle?1.45:.78):c.name==='Delhi'?.4:.66)*pxU+8,st=c.lb.style;
  st.left=st.top='0px';
  st.transform=side==='l'?`translate(calc(-100% - ${gap}px),-50%)`:side==='r'?`translate(${gap}px,-50%)`:side==='t'?`translate(-50%,calc(-100% - ${gap}px))`:`translate(-50%,${gap}px)`;
 });
}

function fit(){const a=innerWidth/innerHeight;camera.position.z=13.5*Math.max(1,Math.min(2,1.2/a));
 LS=Math.min(1,camera.position.z*.5206*a*.8/7.1);if(pts)pts.material.uniforms.uLs.value=LS;}
function pickColor(){const r=Math.random();return new THREE.Color(r<.18?'#d4694a':r<.32?'#c9a93a':r<.8?'#1d1e4a':'#3a3d73');}

function init(){
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);fit();
 renderer=new THREE.WebGLRenderer({canvas:document.getElementById('bt-gl'),antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.setClearColor(0xf4efe2,1);
 logo=buildLogo();
 const g=new THREE.BufferGeometry(),S=new Float32Array(N),Cc=new Float32Array(N*3);
 R=new Float32Array(N*3);F=new Float32Array(N*4);
 for(let i=0;i<N;i++){R[i*3]=Math.random();R[i*3+1]=Math.random();R[i*3+2]=Math.random();
  for(let k=0;k<4;k++)F[i*4+k]=Math.random();
  const q=Math.random();S[i]=q>.97?2.4+Math.random()*1.4:q>.75?1.2+Math.random()*.5:.55+Math.random()*.45;
  const c=pickColor();Cc.set([c.r,c.g,c.b],i*3);}
 g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3)); // holds a frozen in-between picture when a morph is interrupted
 g.setAttribute('aF',new THREE.BufferAttribute(F,4));
 g.setAttribute('aL',new THREE.BufferAttribute(logo.L,3));g.setAttribute('aP',new THREE.BufferAttribute(logo.P,1));g.setAttribute('aU',new THREE.BufferAttribute(logo.U,2));
 g.setAttribute('aR',new THREE.BufferAttribute(R,3));g.setAttribute('aS',new THREE.BufferAttribute(S,1));g.setAttribute('aC',new THREE.BufferAttribute(Cc,3));
 pts=new THREE.Points(g,new THREE.ShaderMaterial({vertexShader:vs,fragmentShader:fs,transparent:true,depthWrite:false,blending:THREE.NormalBlending,
  uniforms:{uP:{value:1},uT:{value:0},uPR:{value:renderer.getPixelRatio()},uAtt:{value:0},uRot:{value:0},uTr:{value:0},uHd:{value:0},uCs:{value:0},uLp:{value:0},
   uSA:{value:0},uSB:{value:0},uLf:{value:0},uS2U:{value:logo.s2u},
   uHp:{value:new THREE.Vector2(0,3.7)},uLs:{value:LS},uLo:{value:new THREE.Vector2(0,LO_Y)},uM:{value:new THREE.Vector3()}}}));
 pts.frustumCulled=false; // positions are made in the shader, so the box three.js measures is not the real one
 scene.add(pts);
 document.querySelectorAll('[data-go]').forEach(a=>a.onclick=e=>{e.preventDefault();const idx=+a.dataset.go;window.scrollTo({top:chY(idx),behavior:'smooth'});});
 const pl=document.createElement('div');pl.id='bt-pins';STAGE.appendChild(pl);
 logo.cities.forEach(c=>{const d=document.createElement('div');d.className='cpin'+(c.hub?' hub':'');d.innerHTML='<i></i><b>'+c.name+'</b>';pl.appendChild(d);c.el=d;c.lb=d.querySelector('b');});
 show(0,true);
 addEventListener('resize',()=>{fit();camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);pts.material.uniforms.uPR.value=renderer.getPixelRatio();});
 const mv=(x,y)=>{tmx=(x/innerWidth-.5)*2;tmy=(y/innerHeight-.5)*2;const v=new THREE.Vector3(tmx,-tmy,.5).unproject(camera);const d=v.sub(camera.position).normalize();tmw.copy(camera.position).add(d.multiplyScalar(-camera.position.z/d.z));};
 addEventListener('mousemove',e=>mv(e.clientX,e.clientY));
 addEventListener('touchmove',e=>mv(e.touches[0].clientX,e.touches[0].clientY),{passive:true});
 requestAnimationFrame(animate);
}
let sec=0;
function step(d){go(Math.max(0,Math.min(secs.length-1,sec+d)));}
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function go(i){
 if(i===sec||locked)return;locked=true;setTimeout(()=>locked=false,700);
 const from=secShape[sec];sec=i;const to=secShape[i];
 if(i===CITY_SEC)traceStart=performance.now()+1100;
 if(from!==to){
  const u=pts.material.uniforms;
  if(morphing){
   // scrolled again before the last morph finished: freeze exactly what is on screen and morph on from there
   const pa=pts.geometry.attributes.position,arr=pa.array,t=u.uT.value,e=ease(u.uP.value),sa=u.uSA.value,sb=u.uSB.value,
    a=[0,0,0],b=[0,0,0],ang=u.uRot.value,c=Math.cos(ang),s=Math.sin(ang);
   for(let k=0;k<N;k++){
    if(sa<0){a[0]=arr[k*3];a[1]=arr[k*3+1];a[2]=arr[k*3+2];}else shapeJS(sa,k,t,a);
    shapeJS(sb,k,t,b);
    const lp=Math.max(0,Math.min(1,(e-R[k*3+2]*.22)/(1-.22)));
    const x=a[0]+(b[0]-a[0])*lp,y=a[1]+(b[1]-a[1])*lp,z=a[2]+(b[2]-a[2])*lp;
    arr[k*3]=x;arr[k*3+1]=y*c-z*s;arr[k*3+2]=y*s+z*c;
   }
   pa.needsUpdate=true;u.uSA.value=-1;rot=0;u.uRot.value=0;
  }else u.uSA.value=from;
  u.uSB.value=to;u.uP.value=0;cur=from;tgt=to;t0=performance.now();morphing=true;
 }
 show(i);
}
function show(i,instant){
 const c=document.getElementById('bt-copy');
 const apply=()=>{const s=secs[i];
  c.className='copy '+(s.big?'big':'mid'+(s.top?' top':''));c.style.visibility=s.t?'':'hidden';
  c.innerHTML=`<h2>${s.t}</h2><p>${s.p}</p>`;
 };
 if(instant){apply();return;}
 c.classList.add('out');setTimeout(apply,420);
}
const eas=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function setSec(i){if(i===sec)return;if(i===CITY_SEC)traceStart=performance.now()+400;sec=i;show(i);}
/* Slide 2: continuous uninterrupted natural scrolling.
   Chapters advance smoothly driven by scroll position without blocking or trapping. */
const DUR=1500, NCH=secs.length;
let ch=0,from=0,to=0,busy=false,ct0=0,doneAt=0;
const chY=i=>SEC.getBoundingClientRect().top+scrollY+i*STEP/100*innerHeight;
function stepTo(d){const nx=Math.max(0,Math.min(NCH-1,ch+d));if(nx===ch)return false;from=ch;to=nx;ch=nx;busy=true;ct0=performance.now();return true;}
function animate(time){
 requestAnimationFrame(animate);
 const s=time*.001,dt=Math.max(0,Math.min(s-last,.05));last=s;
 const now=performance.now();
 const br=SEC.getBoundingClientRect();
 if(br.bottom<=0||br.top>=innerHeight)return; // off screen: don't draw
 const rel=(scrollY-chY(0))/(STEP/100*innerHeight);
 const targetCh=Math.max(0,Math.min(NCH-1,Math.round(rel)));
 if(targetCh!==to){
   from=to;to=targetCh;ch=targetCh;busy=true;ct0=now;
 }
 const u=pts.material.uniforms;
 let k=1;
 if(busy){k=Math.min(1,(now-ct0)/DUR);if(k>=1){busy=false;from=to;doneAt=now;}}
 u.uSA.value=secShape[from];u.uSB.value=secShape[to];u.uP.value=k;u.uAtt.value=0;
 setSec(busy&&k<.5?from:to);
 const m=eas(k);rot+=dt*.1;u.uRot.value=rot*(rotW[secShape[from]]+(rotW[secShape[to]]-rotW[secShape[from]])*m);
 let hdv;
 if(sec===CITY_SEC){const el=performance.now()-traceStart;
  if(el<0){trG=Math.max(0,trG-dt*1.5);hdv=trG;}
  else{trG=gAt(el);hdv=trG<G_END?trG:.13+.9*(((el-G_END*TRACE_MS)/LOOP_MS)%1);}}
 else{trG=Math.max(0,trG-dt*1.6);hdv=trG;}
 csm+=((sec===CITY_SEC?1:0)-csm)*Math.min(1,dt*5);
 if(sec===CITY_SEC&&trG>=G_END)lf+=dt*.04;else if(trG<=0&&csm<.02)lf=0;
 u.uLf.value=lf;
 const hp=logo.headAt(trG);u.uHp.value.set(hp[0]*LS,hp[1]*LS+LO_Y);
 u.uCs.value=csm;u.uLp.value=(sec===CITY_SEC&&trG>=G_END)?1:0;u.uTr.value=trG;u.uHd.value=hdv;updatePins();
 mw.lerp(tmw,.06);u.uM.value.copy(mw);u.uT.value=s;
 mx+=(tmx-mx)*.04;my+=(tmy-my)*.04;
 pts.rotation.y=mx*.08;pts.rotation.x=-my*.05;
 renderer.render(scene,camera);
}
addEventListener('DOMContentLoaded',init);
SEC.style.height=((secs.length-1)*STEP+100+HOLD)+'vh';
})();
