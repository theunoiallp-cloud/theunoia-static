/* v10: (1) the gold disc sits exactly behind his computer head
         (2) now and then two coloured blocks slide together, hit, throw a few pixel sparks and spring back home */
(function () {
  // ---- disc ----
  var man = document.getElementById("man"), disc = document.querySelector(".mascot .disc");
  function placeDisc() {
    if (!man || !disc) return;
    var w = man.offsetWidth, h = man.offsetHeight; if (!w || !h) return;
    var D = h * (innerWidth <= 820 ? 0.6 : 0.70), cx = man.offsetLeft + w * 0.44, cy = man.offsetTop + h * 0.323;   // centre of the monitor in the frames
    disc.style.width = D.toFixed(1) + "px"; disc.style.height = D.toFixed(1) + "px";
    disc.style.left = (cx - D / 2).toFixed(1) + "px"; disc.style.top = (cy - D / 2).toFixed(1) + "px";
  }
  placeDisc(); addEventListener("resize", placeDisc); addEventListener("load", placeDisc); setInterval(placeDisc, 1000);

  // ---- colliding blocks ----
  var NS = "http://www.w3.org/2000/svg";
  function isColour(f) { f = (f || "").toLowerCase(); return f === "#c9a227" || f === "#c65d3b" || f.indexOf("--gold") > -1 || f.indexOf("--terra") > -1; }
  function navyOf(f) { return f.indexOf("var(") === 0 ? "var(--navy)" : "#14213D"; }
  function liveSvg() {
    var g = document.getElementById("grid");
    if (g && getComputedStyle(g).display !== "none" && g.querySelector("rect")) return g;
    var p = document.querySelector(".px-base");
    if (p && getComputedStyle(p).display !== "none") return p;
    return null;
  }
  var busy = false;
  function collide() {
    var svg = liveSvg(); if (!svg || busy || document.hidden) return;
    var rs = Array.prototype.filter.call(svg.querySelectorAll("rect"), function (r) { return isColour(r.getAttribute("fill")) && !r.classList.contains("spark"); });
    var rows = {}, pairs = [];
    rs.forEach(function (r) { var y = Math.round(+r.getAttribute("y") * 10); (rows[y] = rows[y] || []).push(r); });
    Object.keys(rows).forEach(function (y) {
      var a = rows[y].sort(function (p, q) { return +p.getAttribute("x") - +q.getAttribute("x"); });
      for (var i = 0; i < a.length; i++) for (var j = i + 1; j < a.length; j++) {
        var w = +a[i].getAttribute("width"), d = (+a[j].getAttribute("x") - +a[i].getAttribute("x")) / w;
        if (d >= 2 && d <= 10) pairs.push([a[i], a[j], a[i].getAttribute("fill") !== a[j].getAttribute("fill") ? 2 : 1]);
      }
    });
    if (!pairs.length) return;
    var best = pairs.filter(function (p) { return p[2] === 2; }); if (!best.length) best = pairs;
    var P = best[Math.floor(Math.random() * best.length)], A = P[0], B = P[1];
    var layer = svg.querySelector("g.mvl");
    if (!layer) { layer = document.createElementNS(NS, "g"); layer.setAttribute("class", "mvl"); svg.appendChild(layer); }
    [A, B].forEach(function (r) {
      if (r.parentNode === layer) return;
      var base = r.cloneNode(); base.setAttribute("fill", navyOf(r.getAttribute("fill"))); r.parentNode.insertBefore(base, r);
      r.classList.add("mv"); layer.appendChild(r);
    });
    var w = +A.getAttribute("width"), ax = +A.getAttribute("x"), bx = +B.getAttribute("x");
    var meet = (bx - ax - w) / 2;                                // each travels half the gap, edges touch in the middle
    var T = 2600, E_IN = "cubic-bezier(.55,0,.9,.4)", E_OUT = "cubic-bezier(.15,.75,.3,1.25)";
    busy = true;
    function anim(r, dir) {
      if (!r.animate) return;
      var m = meet * dir;
      r.animate([
        { transform: "translate(0px,0px)", easing: E_IN },
        { transform: "translate(" + m + "px,0px)", offset: .38, easing: "ease-out" },
        { transform: "translate(" + (m - dir * w * .06) + "px,0px) scale(.8,1.14)", offset: .42, easing: "ease-out" },
        { transform: "translate(" + (m - dir * w * .5) + "px," + (-w * .35) + "px) rotate(" + (-dir * 14) + "deg)", offset: .58, easing: E_OUT },
        { transform: "translate(" + (-dir * w * .12) + "px,0px)", offset: .86, easing: "ease-in-out" },
        { transform: "translate(0px,0px)" }
      ], { duration: T, fill: "none" });
    }
    anim(A, 1); anim(B, -1);
    // sparks at the point of contact
    setTimeout(function () {
      var cx = ax + w + meet, cy = +A.getAttribute("y") + w / 2, cols = [A.getAttribute("fill"), B.getAttribute("fill"), A.getAttribute("fill").indexOf("var(") === 0 ? "var(--ivory)" : "#FAF7F0"];
      for (var k = 0; k < 9; k++) {
        var q = document.createElementNS(NS, "rect"), s = w * (.12 + Math.random() * .1);
        q.setAttribute("x", cx - s / 2); q.setAttribute("y", cy - s / 2); q.setAttribute("width", s); q.setAttribute("height", s);
        q.setAttribute("fill", cols[k % 3]); q.setAttribute("class", "spark");
        layer.appendChild(q);
        var ang = -Math.PI / 2 + (Math.random() - .5) * 2.4, dist = w * (.7 + Math.random() * 1.1);
        if (q.animate) q.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: "translate(" + (Math.cos(ang) * dist).toFixed(1) + "px," + (Math.sin(ang) * dist).toFixed(1) + "px)", opacity: 0 }],
          { duration: 650 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" });
        (function (q) { setTimeout(function () { if (q.parentNode) q.parentNode.removeChild(q); }, 1100); })(q);
      }
    }, T * .39);
    setTimeout(function () { busy = false; }, T + 100);
  }
  var root = document.documentElement;
  function loop() { collide(); setTimeout(loop, 5200 + Math.random() * 2600); }

  window.__collide = collide;
})();
