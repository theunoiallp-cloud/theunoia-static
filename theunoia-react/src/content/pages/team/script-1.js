(function () {
  var people = [
    { id: 'sai', since: 'Oct 2025', name: 'Sai Krishnan', role: 'Managing Director & Founder', dept: 'Compass', bio: 'Founded THEUNOiA and holds final decision authority across every department.' },
    { id: 'adil', since: 'Oct 2025', name: 'Adil Hassani', role: 'Capital Operations Architect', dept: 'The Vault', bio: 'Runs finance — capital, accounts and the money side of every move.' },
    { id: 'narayani', since: 'Oct 2025', name: 'Narayani Dey', role: 'Legal Custodian · Head of Studio', dept: 'Chambers + Studio', bio: 'Leads legal at Chambers and heads the creative department, Studio.' },
    { id: 'snehith', since: 'Aug 2026', name: 'Snehith Krishna', role: 'Accountability Anchor', dept: 'Compass', bio: 'Keeps the squad accountable — deadlines, check-ins and follow-through.' },
    { id: 'kanchan', since: 'Dec 2025', name: 'Kanchan Barapatre', role: 'Head of Guild', dept: 'Guild', bio: 'Builds Guild — a strong base of hustlers across every field.' },
    { id: 'yash', since: 'Jul 2026', name: 'Yashowardhan Joshi', role: 'Strategic Scout', dept: 'Compass', bio: 'Scouts new opportunities, partners and directions for THEUNOiA to grow into.' },
    { id: 'madhiya', since: 'Aug 2026', name: 'Madiha Bhesaniya', role: 'Strategic Intelligence Lead', dept: 'Compass', bio: 'Gathers research and market insight so every big decision is backed by facts.' },
    { id: 'parinika', since: 'Dec 2026', name: 'Guntamukkala Parinika', role: 'Mentor Advisor', dept: 'Mentoria', bio: 'Guides students and connects them with mentors who help them grow.' },
    { id: 'anushree', since: 'Jan 2026', name: 'Anushree Banthia', role: 'Venture Ideation Captain', dept: 'Studio', bio: 'Shapes raw ideas into ventures and products worth building.' },
    { id: 'yachika', since: 'Jan 2026', name: 'Yachika Nimje', role: 'Visual Designer', dept: 'Studio', bio: 'Designs the visuals that bring THEUNOiA\'s ideas to life.' },
    { id: 'tanvi', since: 'Jul 2026', name: 'Tanvi Ambare', role: 'Brand Identity Lead', dept: 'Hype House', bio: 'Keeps THEUNOiA\'s look, voice and identity consistent everywhere.' },
    { id: 'harish', since: 'Sep 2026', name: 'Harish Prabhu', role: 'Brand Architect', dept: 'Hype House', bio: 'Builds the brand story and how the world sees THEUNOiA.' },
    { id: 'aarav', since: 'Aug 2026', name: 'Aarav Patro', role: 'Tech Forge Lead', dept: 'Build Division', bio: 'Leads the tech team that builds THEUNOiA\'s software and platforms.' },
    { id: 'gokul', since: 'Oct 2025', name: 'Gokul Krishnan', role: 'Organic Growth Lead', dept: 'Algorithm Desk', bio: 'Grows THEUNOiA\'s audience through content, search and community.' },
    { id: 'tamil', since: 'Oct 2025', name: 'Tamil Selvan', role: 'Digital Acquisition Lead', dept: 'Algorithm Desk', bio: 'Runs digital campaigns that bring new users and clients to THEUNOiA.' }
  ];
  function initials(n) {
    var p = n.split(' ');
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : (p[0][1] || ''))).toUpperCase();
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var IMG = {sai:'/assets/img/b74da8f671fb.webp',adil:'/assets/img/dedefac4a87b.webp',narayani:'/assets/img/aba39a9187db.webp',snehith:'/assets/img/050c403726ac.webp',kanchan:'/assets/img/43c611e2d356.webp',yash:'/assets/img/2c26f57c1b9d.webp',anushree:'/assets/img/b26ee044ae53.webp',tanvi:'/assets/img/9d0c7f91ba51.webp',harish:'/assets/img/249fc39cf01e.webp',gokul:'/assets/img/fec4b2619172.webp',aarav:'/assets/img/aa940f2d8557.webp',tamil:'/assets/img/235d6213239b.webp',yachika:'/assets/img/95163421955d.webp',parinika:'/assets/img/5a76bd6b847f.webp',madhiya:'/assets/img/86dafa9e6ba6.webp'};
  function pic(p) { return IMG[p.id] ? '<img class="pic" src="' + IMG[p.id] + '" alt="' + esc(p.name) + '" decoding="async">' : ''; }
  var byId = {}; people.forEach(function (p) { p.ini = initials(p.name); byId[p.id] = p; });

  /* ---------- Hero mosaic: 15 faces, 6 orbit tiles, headline ---------- */
  var T = '#B5532F', G = '#C9A227', S = 'fill="none" stroke="' + T + '" stroke-width="1.4"';
  var orbs = {
    o1: '<ellipse cx="42" cy="50" rx="18" ry="38" ' + S + '/><ellipse cx="58" cy="50" rx="18" ry="38" ' + S + '/><circle cx="58" cy="12" r="2.6" fill="' + T + '"/>',
    o2: '<circle cx="38" cy="38" r="22" ' + S + '/><circle cx="62" cy="38" r="22" ' + S + '/><circle cx="38" cy="62" r="22" ' + S + '/><circle cx="62" cy="62" r="22" ' + S + '/><circle cx="84" cy="62" r="2.6" fill="' + G + '"/>',
    o3: '<circle cx="50" cy="50" r="36" ' + S + '/><circle cx="42" cy="50" r="24" ' + S + '/><circle cx="36" cy="50" r="12" ' + S + '/><circle cx="86" cy="50" r="2.6" fill="' + T + '"/>',
    o4: '<ellipse cx="50" cy="40" rx="38" ry="15" ' + S + '/><ellipse cx="50" cy="52" rx="38" ry="15" ' + S + '/><ellipse cx="50" cy="64" rx="38" ry="15" ' + S + '/><circle cx="12" cy="52" r="2.6" fill="' + G + '"/>'
  };
  var faces = ['sai','adil','narayani','snehith','kanchan','yash','parinika','anushree','tanvi','harish','aarav','madhiya','gokul','tamil','yachika'];
  var pattern = ['p','o1','p','p','o2','p','p','p', 'o3','p','p','o4','p','p','p','o1', 'H','p','p','p','o2','p'];
  var fi = 0, html = '';
  pattern.forEach(function (k) {
    if (k === 'H') {
      html += '<div class="mosaic-head"><p class="eyebrow">Meet the Squad</p><h1>The makers behind<br><span>beautiful thinking.</span></h1></div>';
    } else if (k === 'p') {
      var p = byId[faces[fi++]];
      html += '<div class="tile face" role="img" aria-label="' + esc(p.name) + '"><div class="head"></div><div class="body"></div><span class="ini">' + p.ini + '</span>' + pic(p) + '</div>';
    } else {
      html += '<div class="tile orb"><svg viewBox="0 0 100 100" aria-hidden="true">' + orbs[k] + '</svg></div>';
    }
  });
  document.getElementById('mosaic').innerHTML = html;

  /* ---------- Squad grid with filter + expandable details ---------- */
  var depts = ['All','Compass','The Vault','Chambers','Studio','Build Division','Algorithm Desk','Hype House','Mentoria','Guild'];
  var state = { dept: 'All', open: null };
  function inDept(p, d) { return d === 'All' || p.dept.indexOf(d) !== -1; }

  var chipsEl = document.getElementById('chips');
  chipsEl.innerHTML = depts.map(function (d) {
    var n = people.filter(function (p) { return inDept(p, d); }).length;
    return '<button type="button" class="chip" data-dept="' + esc(d) + '" aria-pressed="' + (d === 'All') + '">' + esc(d) + ' <small>' + n + '</small></button>';
  }).join('');
  chipsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    state.dept = b.getAttribute('data-dept'); state.open = null;
    chipsEl.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
    renderGrid();
  });

  var gridEl = document.getElementById('grid');
  var plus = '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 9h12M9 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function renderGrid() {
    gridEl.innerHTML = people.filter(function (p) { return inDept(p, state.dept); }).map(function (p) {
      return '<article class="card" data-id="' + p.id + '">' +
        '<div class="card-top"><div><h3>' + esc(p.name) + '</h3><p class="role">' + esc(p.role) + '</p></div>' +
        '<button type="button" class="toggle" aria-expanded="false" aria-controls="d-' + p.id + '" aria-label="Show details for ' + esc(p.name) + '">' + plus + '</button></div>' +
        '<div class="photo"><div class="head"></div><div class="body"></div><span class="ini">' + p.ini + '</span>' + pic(p) + (p.core ? '<span class="badge">Core</span>' : '') + '</div>' +
        '<dl id="d-' + p.id + '">' +
          '<div><dt>Department</dt><dd style="font-weight:600">' + esc(p.dept) + '</dd></div>' +
          '<div><dt>Status</dt><dd>' + 'Maker' + '</dd></div>' +
          '<div><dt>Making since</dt><dd>' + esc(p.since || '') + '</dd></div>' +
          '<div><dt>What they do</dt><dd style="color:#3A3F4C">' + esc(p.bio) + '</dd></div>' +
          '<div class="links"><a href="#">LinkedIn ↗</a><a href="#">Portfolio ↗</a></div>' +
        '</dl></article>';
    }).join('');
  }
  gridEl.addEventListener('click', function (e) {
    var t = e.target.closest('.toggle'); if (!t) return;
    var card = t.closest('.card');
    var open = !card.classList.contains('open');
    gridEl.querySelectorAll('.card.open').forEach(function (c) {
      c.classList.remove('open');
      var b = c.querySelector('.toggle'); b.setAttribute('aria-expanded', 'false');
      b.setAttribute('aria-label', b.getAttribute('aria-label').replace('Hide', 'Show'));
    });
    if (open) {
      card.classList.add('open'); t.setAttribute('aria-expanded', 'true');
      t.setAttribute('aria-label', t.getAttribute('aria-label').replace('Show', 'Hide'));
    }
  });
  renderGrid();
})();
