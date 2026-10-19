(function(){var LUNA=document.getElementById('luna');
function lsx(){var lv=Math.min(innerWidth/100,innerHeight/106);LUNA.style.setProperty('--sx',(innerWidth/100/lv).toFixed(4));}lsx();addEventListener('resize',lsx);

(function(){

  function scramble(el){
    if(el.dataset.done) return; el.dataset.done=1;
    var fin=el.textContent, set=/\d/.test(fin)?'0123456789':'ABCDEFGHIJKLMNOPQRSTUVWXYZ', d=parseFloat(getComputedStyle(el).getPropertyValue('--d'))||0;
    var n=0, max=10+Math.round(d*25);
    setTimeout(function(){var t=setInterval(function(){el.textContent=set[Math.floor(Math.random()*set.length)];if(++n>=max){clearInterval(t);el.textContent=fin;}},45);},d*400);
  }
  if('IntersectionObserver' in window){
    document.documentElement.classList.add('anim');
    var map=new Map();
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(map.get(e.target)||[e.target]).forEach(function(t){t.classList.add('in');if(t.classList.contains('ch'))scramble(t);});io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
    LUNA.querySelectorAll('[data-r]').forEach(function(el){
      var k=/^(tear|print)/.test(el.dataset.r)?el.parentElement:el;  /* clipped elements have no visible area, so watch their parent */
      if(!map.has(k)) map.set(k,[]); map.get(k).push(el); io.observe(k);
    });
  }
})();
(function(){
  var wolf=document.getElementById('wolf'), stack=document.getElementById('stack'),
      since=document.getElementById('since'), movers=[].slice.call(LUNA.querySelectorAll('[data-speed]'));
  var base={}; movers.forEach(function(m,i){base[i]=getComputedStyle(m).transform; if(base[i]==='none')base[i]='';});
  var ticking=false;
  function frame(){
    ticking=false;
    var y=Math.max(0,-LUNA.getBoundingClientRect().top), vh=window.innerHeight;
    wolf.style.transform='translate(-50%,'+(-y*0.05).toFixed(1)+'px)';
    movers.forEach(function(m,i){
      var r=m.parentElement.getBoundingClientRect();
      var d=(r.top+r.height/2-vh/2)*parseFloat(m.dataset.speed);
      m.style.transform='translateY('+d.toFixed(1)+'px) '+base[i];
    });
    var s=since.getBoundingClientRect(), p=Math.min(1,Math.max(0,(vh-s.top)/(vh+s.height)));
    var step=stack.firstElementChild.getBoundingClientRect().height+parseFloat(getComputedStyle(stack).gap||0);
    stack.style.transform='translateY('+(-(p*3*step)+step*0.6).toFixed(1)+'px)';
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame);}}
  addEventListener('scroll',onScroll,{passive:true}); addEventListener('resize',onScroll); frame();
})();

(function(){
  var w=document.getElementById('wolf'); if(!w) return;
  function buzz(e){ if(e&&e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ') return;
    w.classList.remove('buzz'); void w.offsetWidth; w.classList.add('buzz');
    try{ navigator.vibrate&&navigator.vibrate([40,30,40,30,60]); }catch(_){} }
  w.addEventListener('pointerdown',function(e){e.preventDefault();buzz(e);}); w.addEventListener('keydown',buzz);
  w.addEventListener('animationend',function(e){ if(e.animationName==='ln-buzz') w.classList.remove('buzz'); });
})();

})();
