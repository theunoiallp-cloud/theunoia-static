(function(){
  const btns=[...document.querySelectorAll('.filters button')];
  const cards=[...document.querySelectorAll('.card')];
  const empty=document.getElementById('empty');
  btns.forEach(b=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.setAttribute('aria-pressed', x===b?'true':'false'));
    const cat=b.dataset.cat; let shown=0;
    cards.forEach(c=>{const on=cat==='all'||c.dataset.cat===cat; c.hidden=!on; if(on)shown++;});
    empty.hidden=shown>0;
  }));
  document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
})();
