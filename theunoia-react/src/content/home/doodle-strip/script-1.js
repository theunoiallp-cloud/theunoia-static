/* Icons dodge the cursor; when the cursor reaches the computer they ALL burst out
   and "Crafted with ♥ by THEUNOiA" types onto the screen */
(function(){
  var strip=document.querySelector('.crafted-strip'); if(!strip) return;
  var stage=strip.querySelector('.cs-stage'), screen=strip.querySelector('.cs-screen');
  var icons=[].slice.call(strip.querySelectorAll('.cs-ic'));
  var chars=[].slice.call(strip.querySelectorAll('.cs-type .ch'));
  var RADIUS=120, PUSH=60, BURST=95;     /* dodge reach, dodge push, burst distance (px) */
  var st=icons.map(function(){return {x:0,y:0,tx:0,ty:0,rate:1}});
  /* gear spin animations, sped up when gears are pushed */
  var spins=icons.map(function(el){var g=el.querySelector('.spin');return g&&g.getAnimations?g.getAnimations()[0]:null});
  var mx=-9999,my=-9999,running=false,onPc=false,typeTimer=null;
  var still=false;

  function type(){ clearInterval(typeTimer); var i=0; stage.classList.add('typing');
    typeTimer=setInterval(function(){ if(i<chars.length){chars[i++].setAttribute('visibility','visible')}
      else{clearInterval(typeTimer);stage.classList.remove('typing');stage.classList.add('typed')} }, still?0:55); }
  function clear(){ clearInterval(typeTimer); stage.classList.remove('typing','typed');
    chars.forEach(function(c){c.setAttribute('visibility','hidden')}); }

  function setPointer(x,y){mx=x;my=y;
    var r=screen.getBoundingClientRect(), pad=14;
    var inside=x>r.left-pad&&x<r.right+pad&&y>r.top-pad&&y<r.bottom+pad+30;
    if(inside!==onPc){onPc=inside; inside?type():clear()}
    kick()}
  window.addEventListener('mousemove',function(e){setPointer(e.clientX,e.clientY)},{passive:true});
  strip.addEventListener('touchstart',function(e){var t=e.touches[0];setPointer(t.clientX,t.clientY)},{passive:true});
  window.addEventListener('touchmove',function(e){var t=e.touches[0];setPointer(t.clientX,t.clientY)},{passive:true});
  document.addEventListener('mouseleave',function(){setPointer(-9999,-9999)});

  function kick(){if(!running&&!still){running=true;requestAnimationFrame(tick)}}
  function tick(){
    var moving=false, sr=screen.getBoundingClientRect(), pcx=sr.left+sr.width/2, pcy=sr.top+sr.height/2;
    icons.forEach(function(el,i){
      var s=st[i], r=el.getBoundingClientRect();
      var cx=r.left+r.width/2-s.x, cy=r.top+r.height/2-s.y;          /* home position */
      if(onPc){                                                      /* burst away from the computer */
        var bx=cx-pcx, by=cy-pcy, bd=Math.sqrt(bx*bx+by*by)||1;
        s.tx=bx/bd*BURST; s.ty=by/bd*BURST*.7;
      }else{                                                         /* single icon dodges the cursor */
        var dx=cx-mx, dy=cy-my, d=Math.sqrt(dx*dx+dy*dy)||1;
        if(d<RADIUS){var f=(1-d/RADIUS)*PUSH; s.tx=dx/d*f; s.ty=dy/d*f}else{s.tx=0;s.ty=0}
      }
      s.x+=(s.tx-s.x)*.12; s.y+=(s.ty-s.y)*.12;
      var goal=onPc?5:1+Math.min(4,Math.sqrt(s.tx*s.tx+s.ty*s.ty)/12);   /* spin faster when pushed */
      s.rate+=(goal-s.rate)*.08;
      if(spins[i]) spins[i].playbackRate=s.rate;
      if(Math.abs(s.tx-s.x)>.2||Math.abs(s.ty-s.y)>.2||Math.abs(goal-s.rate)>.02) moving=true;
      el.style.transform='translate('+s.x.toFixed(1)+'px,'+s.y.toFixed(1)+'px) rotate('+(s.x*.2).toFixed(1)+'deg)';
    });
    if(moving) requestAnimationFrame(tick); else running=false;
  }
})();
