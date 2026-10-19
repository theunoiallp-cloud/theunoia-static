(function(){
  var r=document.querySelector('#prod .reader'); if(!r) return;
  var img=r.querySelector('img'), t0=performance.now(), kick=-1e9;
  // slow rocking-chair sway, always on; a click adds a bigger rock that settles back into the sway
  function frame(now){
    var t=(now-t0)/1000;
    var sway=3.2*Math.sin(t*2*Math.PI/4.2);            // ~4 seconds per rock
    var k=(now-kick)/1000, extra=0;
    if(k<3.2) extra=-7*Math.exp(-k*1.1)*Math.sin(k*2*Math.PI/1.4);
    img.style.transform='rotate('+(sway+extra).toFixed(2)+'deg)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  r.addEventListener('click',function(){ kick=performance.now(); });
})();
