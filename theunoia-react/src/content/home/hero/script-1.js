(() => {
  // the design's pixel rows (36 columns, from the THEUNOiA artboard); beyond its edges the skyline carries on block by block
  const ROWS = ["NN..................................", "N...................................", "..N.................................", "TG..................................", "N..N................................", ".N.N................................", "NN..................................", ".NN.................................", "NN..................................", ".NN.................................", ".N.....NG...........................", "GN..NNNNN.NN........N...............", "NNN.NNNNNNNG.NN.....................", "NNNNNNNNNNNN........N..N............", "NNNNNNNGNNNNNNN..GN.G.N...N.........", "NNNTNNNNNNGGNNNNTNNNGN.G..N.N.......", "NNNNNTNNNNNNNNNNNNNNNNNNN.NNNNN.NN..", "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.NN..", "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN", "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN", "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN", "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN"];
  const svg = document.getElementById("grid"), NS = "http://www.w3.org/2000/svg";
  const FILL = { N: "#14213D", G: "#C9A227", T: "#C65D3B" };
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) ^ 0x5bd1e995; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  let TL = 0;                                             // first column of the tower at the screen's left edge
  function cell(c, r) {
    if (r < 0) return ".";
    if (r <= 10 && c >= TL && c <= TL + 3) return ROWS[r][c - TL];                // the vertical tower, at the far left
    if (TL < 0 && r >= 11 && r < 18 && c === TL + 1) return "N";                    // its stem down into the skyline
    if (TL < 0 && r <= 10 && c >= 0 && c <= 3) return ".";
    if (c >= 0 && c < 36) {
      const k = r < ROWS.length ? ROWS[r][c] : "N";
      return k;
    }
    const d = c < 0 ? -c : c - 35;                        // distance from the design edge
    // left: steps down from the design's tall left edge; right: steps down to the base
    const top = c < 0 ? Math.min(17, 11 + Math.floor((d - 1) / 2) + ((d % 5 === 0) ? -1 : 0))
                      : Math.min(18, 16 + Math.floor(d / 3));
    if (r < top) {
      return ".";
    }
    return "N";
  }
  var COLS = [], CS = 1, FX = 0, built = false;
  function draw() {
    if (getComputedStyle(svg).display === "none") return;
    const W = innerWidth, H = innerHeight, u = Math.min(W / 100, H / 62.2), cs = 100 * u / 36;
    const fx = (W - 100 * u) / 2, fy = H - 20.3 * cs;   // skyline sits on the bottom edge
    const ext = fx > .5 ? Math.ceil(fx / cs) : 0, c0 = -ext, c1 = 36 + ext; TL = Math.ceil(-fx / cs - 1e-6); const r1 = 21;
    CS = cs; FX = fx;
    var hs = document.getElementById("hero").style, M = cs * 4;
    hs.setProperty("--c", cs.toFixed(3) + "px");
    hs.setProperty("--ox", (((fx % M) + M) % M).toFixed(2) + "px");
    hs.setProperty("--oy", (((fy % M) + M) % M).toFixed(2) + "px");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const seam = Math.max(1, cs * .028).toFixed(2);
    let out = "";
    COLS = [];
    for (let c = c0; c < c1; c++) {
      let rects = "", seams = "", top = 99;
      for (let r = 0; r < r1; r++) {
        const k = cell(c, r); if (k === ".") continue;
        if (r < top) top = r;
        const x = fx + c * cs, y = fy + r * cs;
        rects += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cs + .5).toFixed(2)}" height="${(cs + .5).toFixed(2)}" fill="${FILL[k]}"/>`;
        if (c + 1 < c1 && cell(c + 1, r) !== ".") seams += `M${(x + cs).toFixed(2)} ${y.toFixed(2)}v${cs.toFixed(2)}`;
        if (cell(c, r + 1) !== ".") seams += `M${x.toFixed(2)} ${(y + cs).toFixed(2)}h${cs.toFixed(2)}`;
      }
      if (!rects) continue;
      const i = c - c0, n = c1 - c0;
      const d = Math.round(120 + i / n * 900 + hash(c, 3) * 160);                     // builds from left to right, slightly uneven
      COLS.push({ c: c, x: fx + (c + .5) * cs });
      out += `<g class="cb" style="--d:${d}ms"><g class="cl" data-i="${COLS.length - 1}">${rects}<path d="${seams}" stroke="#2C3858" stroke-width="${seam}" fill="none"/></g></g>`;
    }
    svg.innerHTML = out;
  }

  // the city in front of him: a stepped edge of blocks over his lower jacket
  var fg = document.getElementById("fg");
  function drawFg() {
    if (!fg || getComputedStyle(fg).display === "none") return;
    var m = document.querySelector(".mascot img#man"); if (!m) return;
    var W = innerWidth, H = innerHeight, u = Math.min(W / 100, H / 62.2), cs = 100 * u / 36;
    var fx = (W - 100 * u) / 2, fy = H - 20.3 * cs, b = m.getBoundingClientRect(), hb = document.getElementById("hero").getBoundingClientRect();
    b = { left: b.left - hb.left, right: b.right - hb.left, bottom: b.bottom - hb.top };   // relative to the hero, so it works after scrolling
    fg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var cA = Math.floor((b.left - fx) / cs), cB = Math.ceil((b.right - fx) / cs) + 1;
    var rBase = Math.floor((b.bottom - fy) / cs) - 2, out = "", seams = "", seam = Math.max(1, cs * .028).toFixed(2);
    var tops = {};
    for (var c = cA; c < cB; c++) { var h = hash(c, 11); tops[c] = rBase + (h < .3 ? -1 : h > .75 ? 1 : 0) + ((c === cA || c === cB - 1) ? 1 : 0); }
    for (var c2 = cA; c2 < cB; c2++) for (var r = tops[c2]; r < 21; r++) {
      var k = cell(c2, r); var fill = k === "G" ? FILL.G : k === "T" ? FILL.T : FILL.N;
      if (r === tops[c2] && hash(c2, 5) > .86) fill = FILL.G;
      var x = fx + c2 * cs, y = fy + r * cs;
      out += '<rect x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" width="' + (cs + .5).toFixed(2) + '" height="' + (cs + .5).toFixed(2) + '" fill="' + fill + '"/>';
      if (c2 + 1 < cB && r >= tops[c2 + 1]) seams += "M" + (x + cs).toFixed(2) + " " + y.toFixed(2) + "v" + cs.toFixed(2);
      seams += "M" + x.toFixed(2) + " " + (y + cs).toFixed(2) + "h" + cs.toFixed(2);
    }
    fg.innerHTML = out + '<path d="' + seams + '" stroke="#2C3858" stroke-width="' + seam + '" fill="none"/>';
  }
  draw(); drawFg(); addEventListener("resize", function () { draw(); drawFg(); });
  addEventListener("load", drawFg);
})();
