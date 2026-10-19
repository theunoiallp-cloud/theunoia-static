(function(){
  var sec=document.getElementById('insp'),fit=sec.querySelector('.in-fit'),hero=sec.querySelector('.in-hero');
  function size(){ if(innerWidth<=760){hero.style.transform='';return;} hero.style.transform='scale('+(fit.clientWidth/1440)+')'; }
  size(); addEventListener('resize',size);
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){sec.classList.add('play');io.disconnect();}});},{threshold:.25});
    io.observe(sec);
  } else sec.classList.add('play');
})();
