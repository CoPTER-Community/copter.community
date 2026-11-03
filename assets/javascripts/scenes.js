/* Home page scenes: illustrated, animated SVGs for the ethos, "What we do"
   and strands sections. A host is <div class="cps-scene" data-scene="ethos|work|strands">.

   Each scene is drawn 360 units high and as wide as its host (680 to 1400
   units), so on wide screens the people spread out instead of the picture
   growing taller; narrower than 680 the whole scene scales down. Resizing
   redraws the scene from the start.

   With prefers-reduced-motion the scene is drawn once, at rest: every person
   has their drone (or drones) beside them, and nothing moves. */
(function () {
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches || !Element.prototype.animate;
  var NS = "http://www.w3.org/2000/svg";
  var INK = "#173250";
  var LOOP = 16000;

  function legs() {
    return '<rect x="-10" y="270" width="8" height="30" rx="3" fill="' + INK + '"/><rect x="2" y="270" width="8" height="30" rx="3" fill="' + INK + '"/>';
  }
  function backdrop(W) {
    return '<rect x="0" y="0" width="' + W + '" height="360" rx="12" fill="#F4F7F6"/>' +
      '<rect x="0" y="300" width="' + W + '" height="60" fill="#E3ECE8"/><path d="M0 300 H' + W + '" stroke="#CFE3DC" stroke-width="2"/>';
  }
  function bubble(cls, colour, title, sub) {
    return '<g class="cps-bub-pos"><g class="cps-bub ' + cls + '"><rect height="54" rx="10" fill="#FFFFFF" stroke="' + colour + '" stroke-width="1.5"/>' +
      '<text x="14" y="22" font-size="13" font-weight="500" fill="' + INK + '">' + title + '</text>' +
      '<text x="14" y="41" font-size="11" fill="#5F5E5A">' + sub + '</text></g></g>';
  }
  /* Speech bubbles size to their text, then sit at their x, kept inside the scene */
  function placeBubbles(svg, W, xs, ys) {
    svg.querySelectorAll(".cps-bub-pos").forEach(function (pos, i) {
      var w = 0;
      pos.querySelectorAll("text").forEach(function (t) { w = Math.max(w, t.getComputedTextLength()); });
      w = Math.ceil(w) + 28;
      pos.querySelector("rect").setAttribute("width", w);
      var x = xs[i] == null ? Math.round((W - w) / 2) : Math.max(8, Math.min(W - 8 - w, xs[i]));
      pos.setAttribute("transform", "translate(" + x + " " + ys[i] + ")");
    });
  }

  /* Smooth flight: cubic Bézier segments, eased, sampled into keyframes */
  function bez(p, t) {
    var u = 1 - t;
    return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
            u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]];
  }
  function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function flight(segs, op) {
    var kf = [];
    segs.forEach(function (s) {
      if (s.hold) { kf.push([s.t0, s.hold]); kf.push([s.t1, s.hold]); return; }
      for (var i = 0; i <= 16; i++) { var t = i / 16; kf.push([s.t0 + (s.t1 - s.t0) * t, bez(s.p, ease(t))]); }
    });
    kf.sort(function (a, b) { return a[0] - b[0]; });
    var out = [];
    kf.forEach(function (k) {
      if (out.length && k[0] <= out[out.length - 1].offset) return;
      out.push({ offset: k[0], transform: "translate(" + k[1][0].toFixed(1) + "px," + k[1][1].toFixed(1) + "px)", opacity: op(k[0]) });
    });
    if (out[out.length - 1].offset < 1) out.push({ offset: 1, transform: out[out.length - 1].transform, opacity: op(1) });
    return out;
  }
  function at(p) { return 'transform="translate(' + p[0].toFixed(1) + " " + p[1].toFixed(1) + ')"'; }

  /* ---------- Ethos: three pilots build a shared landscape ---------- */

  var ETHOS = [
    { c: "#EF9F27", title: "Beyond compliance", sub: "The network behind trainers", f: 0.155, y: 156, bx: -60, tx: 28, dy: 94,
      skin: "#E8B48F", hair: '<path d="M-12 206 Q-10 192 2 193 Q13 194 12 208 Q6 200 -2 201 Q-8 202 -12 206Z" fill="#412402"/>' },
    { c: "#1D9E75", title: "Operation and development", sub: "Fly it, and build it", f: 0.403, y: 148, bx: -102, tx: 104, dy: 102,
      skin: "#8D5B3C", hair: '<path d="M-13 208 Q-12 190 0 191 Q13 192 13 208 Q13 198 0 198 Q-12 198 -13 208Z" fill="#2C2C2A"/>' },
    { c: "#378ADD", title: "International and interdisciplinary", sub: "Every country, every discipline", f: 0.65, y: 160, bx: -146, tx: 168, dy: 90,
      skin: "#F1C9A5", hair: '<path d="M-12 210 Q-14 192 0 192 Q14 192 12 210 L12 220 Q8 206 0 204 Q-8 206 -12 220Z" fill="#BA7517"/>' }
  ];

  function ethos(W) {
    var sx = W - 228; /* screen's left edge; the pilots share the space to its left */
    var P = ETHOS.map(function (p) { return Math.round(sx * p.f); });
    var s = backdrop(W);
    s += '<rect x="' + sx + '" y="108" width="208" height="112" rx="6" fill="#FFFFFF" stroke="' + INK + '" stroke-width="2"/>' +
      '<line x1="' + (sx + 104) + '" y1="220" x2="' + (sx + 104) + '" y2="300" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M' + (sx + 78) + ' 300 L' + (sx + 104) + ' 274 L' + (sx + 130) + ' 300" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<text x="' + (sx + 12) + '" y="125" font-size="11" font-weight="500" fill="' + INK + '">Shared landscape</text>' +
      '<g class="cps-tiles" transform="translate(' + (sx + 12) + ' 134)"></g>' +
      '<g transform="translate(' + (sx - 452) + ' 0)" fill="none" stroke="' + INK + '" stroke-width="0.6" opacity="0.16"><path d="M464 200 Q520 166 560 180 T648 146"/><path d="M464 210 Q530 182 570 192 T650 166"/></g>';
    ETHOS.forEach(function (p, i) { s += bubble("cps-e-p" + i, p.c, p.title, p.sub); });
    ETHOS.forEach(function (p, i) {
      var dx = sx + p.tx - P[i];
      s += '<g transform="translate(' + P[i] + " " + p.y + ')"><g class="cps-e-r' + i + '"><g class="cps-e-sway" style="animation-delay:' + (-1.2 * i) + 's">' +
        '<g class="cps-e-beam cps-e-g' + i + '"><line class="cps-e-flow" x1="0" y1="0" x2="' + dx + '" y2="' + p.dy + '" stroke="' + p.c + '" stroke-width="1.6"/>' +
        '<rect class="cps-e-pk" x="-3" y="-3" width="6" height="6" rx="1" fill="' + p.c + '" style="--dx:' + dx + "px;--dy:" + p.dy + 'px"/>' +
        '<rect class="cps-e-pk" x="-3" y="-3" width="6" height="6" rx="1" fill="' + p.c + '" style="--dx:' + dx + "px;--dy:" + p.dy + 'px;animation-delay:-.45s"/></g>' +
        '<g class="cps-e-bob" style="animation-delay:' + (-0.5 * i) + 's">' +
        '<g fill="none" stroke="' + INK + '" stroke-width="2"><circle cx="-9" cy="-6" r="6"/><circle cx="9" cy="-6" r="6"/><circle cx="-9" cy="10" r="6"/><circle cx="9" cy="10" r="6"/><path d="M-9 -6L9 10M9 -6L-9 10"/></g>' +
        '<rect x="-4" y="-2" width="8" height="8" rx="2" fill="' + p.c + '"/></g></g></g></g>';
    });
    ETHOS.forEach(function (p, i) {
      s += '<g transform="translate(' + P[i] + ' 0)">' + legs() + '<rect x="-15" y="222" width="30" height="54" rx="12" fill="' + p.c + '"/>' +
        '<circle cx="0" cy="208" r="12" fill="' + p.skin + '"/>' + p.hair +
        '<rect x="-11" y="240" width="22" height="12" rx="3" fill="' + INK + '"/><path d="M-13 232 L-8 244 M13 232 L8 244" stroke="' + p.skin + '" stroke-width="5" stroke-linecap="round"/></g>';
    });
    return {
      svg: s,
      after: function (svg) {
        placeBubbles(svg, W, ETHOS.map(function (p, i) { return P[i] + p.bx; }), [82, 82, 82]);
        ethosTiles(svg.querySelector(".cps-tiles"));
      }
    };
  }

  /* CoPTER in a 3x5 pixel font, blurred into rolling hills: a raster that
     reads as geodata, with the word as high ground */
  function ethosTiles(g) {
    var L = { C: ["111", "100", "100", "100", "111"], o: ["000", "111", "101", "101", "111"], P: ["111", "101", "111", "100", "100"],
              T: ["111", "010", "010", "010", "010"], E: ["111", "100", "111", "100", "111"], R: ["110", "101", "110", "101", "101"] };
    var word = "CoPTER", lc = [];
    word.split("").forEach(function (ch, i) {
      for (var c = 0; c < 3; c++) lc.push(L[ch].map(function (r) { return +r[c]; }));
      if (i < word.length - 1) lc.push([0, 0, 0, 0, 0]);
    });
    var SX = 2, SY = 3, n = lc.length * SX, rows = 5 * SY + 2, cw = 4, chh = 4.5;
    function mask(x, y) { var yy = y - 1; if (yy < 0 || yy >= 5 * SY) return 0; return lc[Math.floor(x / SX)][Math.floor(yy / SY)]; }
    var seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var hue = ETHOS.map(function (p) { return p.c; }), seg = [[0.065, 0.27], [0.375, 0.58], [0.685, 0.89]];
    var bounds = [0, Math.round(n / 3), Math.round(2 * n / 3), n];
    for (var x = 0; x < n; x++) {
      var who = x < bounds[1] ? 0 : x < bounds[2] ? 1 : 2;
      var col = document.createElementNS(NS, "g");
      col.setAttribute("class", "cps-tilecol");
      g.appendChild(col);
      for (var y = 0; y < rows; y++) {
        var m = 0, ws = 0;
        for (var ddx = -1; ddx <= 1; ddx++) for (var ddy = -1; ddy <= 1; ddy++) {
          var xx = x + ddx, yy = y + ddy;
          if (xx < 0 || yy < 0 || xx >= n || yy >= rows) continue;
          var wt = (ddx || ddy) ? 0.4 : 1; m += mask(xx, yy) * wt; ws += wt;
        }
        var hills = 0.16 + 0.1 * Math.sin(x / 5.3 + 1.1) * Math.cos(y / 3.6) + 0.06 * Math.sin((x + y) / 3.7);
        var v = Math.max(0.04, Math.min(1, hills + 0.82 * (m / ws) + 0.12 * (rnd() - 0.5)));
        var r = document.createElementNS(NS, "rect");
        r.setAttribute("x", x * cw); r.setAttribute("y", (y * chh).toFixed(1));
        r.setAttribute("width", cw); r.setAttribute("height", chh + 0.2);
        r.setAttribute("fill", hue[who]); r.setAttribute("fill-opacity", (0.08 + 0.92 * Math.pow(v, 1.6)).toFixed(2));
        col.appendChild(r);
      }
      if (still) continue;
      /* Each pilot fills their third column by column, alternately growing up and down with a small
         overshoot. One animation per column, not per tile: a column fills in about a fifth of a second
         either way, and ~50 animations are far lighter than ~800, which Safari felt */
      var span = bounds[who + 1] - bounds[who], k = x - bounds[who];
      var step = (seg[who][1] - seg[who][0]) / span, p = seg[who][0] + step * k;
      col.style.transformOrigin = k % 2 === 0 ? "50% 100%" : "50% 0%";
      col.animate([
        { opacity: 0, transform: "translateX(-4px) scaleY(0)", offset: 0 },
        { opacity: 0, transform: "translateX(-4px) scaleY(0)", offset: p },
        { opacity: 1, transform: "translateX(0) scaleY(1.12)", offset: p + step * 0.8 },
        { opacity: 1, transform: "translateX(0) scaleY(1)", offset: p + step * 0.8 + 0.006 },
        { opacity: 1, transform: "translateX(0) scaleY(1)", offset: 0.97 },
        { opacity: 0, transform: "translateX(0) scaleY(1)", offset: 1 }], { duration: LOOP, iterations: Infinity });
    }
  }

  /* ---------- Strands: four people, one drone, then a swarm ---------- */

  var QUAD = '<g fill="none" stroke="' + INK + '" stroke-width="2"><circle class="cps-rot" cx="-9" cy="-8" r="6" stroke-dasharray="6 4"/><circle class="cps-rot" cx="9" cy="-8" r="6" stroke-dasharray="6 4"/>' +
    '<circle class="cps-rot" cx="-9" cy="8" r="6" stroke-dasharray="6 4"/><circle class="cps-rot" cx="9" cy="8" r="6" stroke-dasharray="6 4"/><path d="M-9 -8L9 8M9 -8L-9 8"/></g>' +
    '<rect x="-5" y="-5" width="10" height="10" rx="2" fill="#E9A23B"/>';
  function quad(pos, cls, scale, delay) {
    var d = delay || 0;
    return '<g class="' + cls + '"' + (pos ? " " + at(pos) : "") + '><g class="cps-bob" style="animation-delay:' + (-d) + 's"><g class="cps-tilt" style="animation-delay:' + (-2 * d) + 's">' +
      (scale ? '<g transform="scale(' + scale + ')">' + QUAD + "</g>" : QUAD) + "</g></g></g>";
  }

  function strands(W) {
    /* People sit at the centres of four equal slots; Deployment a touch left to make room for her case */
    var P = [W / 8, 3 * W / 8, 5 * W / 8 - 10, 7 * W / 8];
    var CC = P[2] + 63; /* centre of the case */
    /* Flight points, all relative to the people. Rest points keep tilted rotors (about 18 units) clear of the bench, case and heads */
    var S1 = [P[0] + 62, 216], S2 = [P[1], 150], S3 = [CC, 252], LP = [CC + 10, 184], S4 = [P[3] - 10, 122];
    var HO = [[-30, 14], [30, 14], [0, 40]];   /* swarm hovers round the lifted drone, clear of Deployment's head */
    var FO = [[-30, -16], [-30, 16], [-60, 0]]; /* then forms an arrowhead up and left of Direction, away from her face */
    function plus(a, o) { return [a[0] + o[0], a[1] + o[1]]; }

    var s = backdrop(W);
    s += '<g transform="translate(' + P[0] + ' 0)"><rect x="17" y="248" width="70" height="7" rx="2" fill="#5F5E5A"/><rect x="23" y="255" width="5" height="45" fill="#5F5E5A"/><rect x="76" y="255" width="5" height="45" fill="#5F5E5A"/>' +
      '<rect x="67" y="240" width="16" height="8" rx="1.5" fill="#B5D4F4" stroke="' + INK + '" stroke-width="1"/>' +
      '<g class="cps-spark" stroke="#EF9F27" stroke-width="1.6" stroke-linecap="round"><path d="M42 212 l-6 -4 M62 194 v-8 M82 212 l6 -4"/></g></g>';
    /* Swarm is drawn behind the case, so it rises out of it */
    var swarm = "";
    FO.forEach(function (o, i) { swarm += quad(still ? plus(S4, o) : null, "cps-swarm", 0.78, 0.3 + 0.4 * i); });
    s += swarm;
    s += '<g transform="translate(' + P[2] + ' 0)"><rect x="37" y="278" width="52" height="22" rx="3" fill="' + INK + '"/><rect x="43" y="274" width="40" height="4" rx="1" fill="#5F5E5A"/></g>';
    s += '<g transform="translate(' + P[3] + ' 0)"><rect x="41" y="236" width="4" height="64" fill="#5F5E5A"/><path d="M27 230 H65 L73 238 L65 246 H27 Z" fill="#7F77DD"/></g>';
    s += '<path class="cps-trail" d="M' + (S4[0] + 22) + " " + S4[1] + " C" + (S4[0] + 60) + " " + (S4[1] - 4) + " " + (W - 60) + " " + (S4[1] - 12) + " " + (W + 10) + " " + (S4[1] - 16) +
      '" fill="none" stroke="#7F77DD" stroke-width="1.6" stroke-dasharray="4 5"/>';
    s += bubble("cps-s-b0", "#378ADD", "Technology", "Leading on how it's built") +
      bubble("cps-s-b1", "#1D9E75", "Operations", "Leading on how it's used") +
      bubble("cps-s-b2", "#EF9F27", "Deployment", "Leading on how it's adopted") +
      bubble("cps-s-b3", "#7F77DD", "Direction", "Leading on where it's going");
    /* Technology: leans in to the bench, waving an abstract tool that stops short of the drone */
    s += '<g transform="translate(' + P[0] + ' 0)"><g class="cps-act cps-s-a0">' + legs() +
      '<rect x="-15" y="222" width="30" height="54" rx="12" fill="#378ADD"/><circle cx="0" cy="208" r="12" fill="#F1C9A5"/><path d="M-12 206 Q-10 192 2 193 Q13 194 12 208 Q6 200 -2 201 Q-8 202 -12 206Z" fill="#5F5E5A"/>' +
      '<g transform="translate(25 241)"><g class="cps-tool"><g transform="rotate(-34)"><rect x="-2" y="-2.5" width="10" height="5" rx="2.5" fill="' + INK + '"/><rect x="7" y="-1" width="11" height="2" rx="1" fill="#5F5E5A"/></g></g></g>' +
      '<path d="M12 236 L26 242" stroke="#F1C9A5" stroke-width="5" stroke-linecap="round"/></g></g>';
    /* Operations: sways with her controller during the survey */
    s += '<g transform="translate(' + P[1] + ' 0)"><g class="cps-act cps-s-a1">' + legs() +
      '<rect x="-15" y="222" width="30" height="54" rx="12" fill="#1D9E75"/><circle cx="0" cy="208" r="12" fill="#8D5B3C"/><path d="M-13 208 Q-12 190 0 191 Q13 192 13 208 Q13 198 0 198 Q-12 198 -13 208Z" fill="#2C2C2A"/>' +
      '<rect x="-11" y="240" width="22" height="12" rx="3" fill="' + INK + '"/><path d="M-13 232 L-8 244 M13 232 L8 244" stroke="#8D5B3C" stroke-width="5" stroke-linecap="round"/></g></g>';
    /* Deployment: hops as her bar chart builds */
    s += '<g transform="translate(' + P[2] + ' 0)"><g class="cps-act cps-s-a2">' + legs() +
      '<rect x="-15" y="222" width="30" height="54" rx="12" fill="#EF9F27"/><circle cx="0" cy="208" r="12" fill="#E8B48F"/><path d="M-12 210 Q-14 192 0 192 Q14 192 12 210 L12 222 Q8 206 0 204 Q-8 206 -12 222Z" fill="#412402"/>' +
      '<path d="M-13 234 L-24 242" stroke="#E8B48F" stroke-width="5" stroke-linecap="round"/><rect x="-50" y="222" width="30" height="34" rx="3" fill="#FFFFFF" stroke="' + INK + '" stroke-width="1.4"/>' +
      '<rect class="cps-bar" x="-45" y="236" width="5" height="16" fill="#B8731A"/><rect class="cps-bar" x="-38" y="231" width="5" height="21" fill="#B8731A" style="animation-delay:.25s"/><rect class="cps-bar" x="-31" y="226" width="5" height="26" fill="#B8731A" style="animation-delay:.5s"/>' +
      '<path d="M13 234 L18 246" stroke="#E8B48F" stroke-width="5" stroke-linecap="round"/></g></g>';
    /* Direction: steps forward, waves, then points the swarm off to the right */
    s += '<g transform="translate(' + P[3] + ' 0)"><g class="cps-step">' + legs() +
      '<g transform="translate(12 230)"><g class="cps-arm"><path d="M0 0 L24 -17" stroke="#C68B5E" stroke-width="5" stroke-linecap="round"/><circle cx="25" cy="-18" r="3.5" fill="#C68B5E"/></g></g>' +
      '<rect x="-15" y="222" width="30" height="54" rx="12" fill="#7F77DD"/><circle cx="0" cy="208" r="12" fill="#C68B5E"/>' +
      '<path d="M-14 214 Q-15 192 0 191 Q15 192 14 214 Q14 224 10 230 L-10 230 Q-14 224 -14 214 Z M-9 210 Q0 200 9 210 Q9 218 0 220 Q-9 218 -9 210Z" fill="#26215C" fill-rule="evenodd"/></g></g>';
    /* The one drone. At rest, everyone has theirs: bench, survey, case, and Direction's arrowhead */
    if (still) s += quad(S2, "cps-drone", 0, 0.6) + quad([CC, 254], "cps-drone", 0, 0.9) + quad(S4, "cps-drone", 0, 0.2);
    s += '<g class="cps-drone"' + (still ? " " + at(S1) : "") + '><g class="cps-sway">' + quad(null, "", 0, 0) + "</g></g>";

    return {
      svg: s,
      after: function (svg) {
        placeBubbles(svg, W, [P[0] - 75, P[1] - 105, P[2] - 119, P[3] - 195], [84, 62, 100, 30]);
        if (still) return;
        function exitFrom(o) {
          return [[S4[0], S4[1]], [S4[0] + 48, S4[1] - 4], [S4[0] + 0.6 * (W + 90 - S4[0]), S4[1] - 10], [W + 90, S4[1] - 16]]
            .map(function (p) { return plus(p, o); });
        }
        var main = [
          { t0: 0, t1: 0.21, hold: S1 },
          { t0: 0.21, t1: 0.29, p: [S1, [S1[0], 110], [S2[0] - 35, 64], S2] },
          { t0: 0.29, t1: 0.46, hold: S2 },
          { t0: 0.46, t1: 0.54, p: [S2, [S2[0] + 75, 60], [S3[0], 70], S3] },
          { t0: 0.54, t1: 0.60, hold: S3 },
          { t0: 0.60, t1: 0.64, p: [S3, [S3[0], 228], [LP[0], 200], LP] },
          { t0: 0.64, t1: 0.79, hold: LP },
          { t0: 0.79, t1: 0.87, p: [LP, [LP[0] + 40, LP[1] - 40], [S4[0] - 50, S4[1] + 10], S4] },
          { t0: 0.87, t1: 0.875, hold: S4 },
          { t0: 0.875, t1: 0.925, p: exitFrom([0, 0]) },
          { t0: 0.9255, t1: 0.928, hold: [-40, 92] },
          { t0: 0.929, t1: 0.985, p: [[-40, 92], [50, 70], [S1[0], 96], S1] },
          { t0: 0.985, t1: 1, hold: S1 }];
        function mainOp(o) {
          if (o > 0.875 && o < 0.925) return 1 - (o - 0.875) / 0.05 * 0.9;
          if (o >= 0.925 && o < 0.929) return 0;
          if (o >= 0.929 && o < 0.96) return Math.min(1, (o - 0.929) / 0.031);
          return 1;
        }
        svg.querySelector(".cps-drone").animate(flight(main, mainOp), { duration: LOOP, iterations: Infinity });
        svg.querySelectorAll(".cps-swarm").forEach(function (el, i) {
          var go = 0.64 + i * 0.02, C = [CC - 14 + i * 14, 292], H = plus(LP, HO[i]), F = plus(S4, FO[i]);
          var segs = [
            { t0: 0, t1: go, hold: C },
            { t0: go, t1: go + 0.06, p: [C, [C[0], C[1] - 70], [H[0], H[1] + 30], H] },
            { t0: go + 0.06, t1: 0.80 + i * 0.008, hold: H },
            { t0: 0.80 + i * 0.008, t1: 0.855 + i * 0.006, p: [H, [H[0], H[1] - 40], [F[0] - 24, F[1] + 12], F] },
            { t0: 0.87, t1: 0.875, hold: F },
            { t0: 0.875, t1: 0.925, p: exitFrom(FO[i]) },
            { t0: 0.9255, t1: 1, hold: C }];
          function op(o) {
            if (o < go) return 0;
            if (o < go + 0.01) return (o - go) / 0.01;
            if (o > 0.875 && o < 0.925) return 1 - (o - 0.875) / 0.05 * 0.9;
            if (o >= 0.925) return 0;
            return 1;
          }
          el.animate(flight(segs, op), { duration: LOOP, iterations: Infinity });
        });
      }
    };
  }

  /* ---------- What we do: share practice, then co-develop resources ---------- */

  /* Four people from disciplines that rarely meet, each with a prop */
  var WORK = [
    { c: "#5B7DB1", skin: "#F1C9A5", f: 0.12, /* roboticist, with a laptop */
      hair: '<path d="M-12 206 Q-10 192 2 193 Q13 194 12 208 Q6 200 -2 201 Q-8 202 -12 206Z" fill="#5F5E5A"/>',
      prop: '<path d="M-13 232 L-8 244 M13 232 L8 244" stroke="#F1C9A5" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="-12" y="228" width="24" height="15" rx="2" fill="#B5D4F4" stroke="' + INK + '" stroke-width="1.4"/><rect x="-14" y="243" width="28" height="3" rx="1" fill="' + INK + '"/>' },
    { c: "#2A9D8F", skin: "#8D5B3C", f: 0.31, /* ecologist, in a sun hat with binoculars */
      hair: '<path d="M-11 200 Q-10 188 0 188 Q10 188 11 200 Z" fill="#C9B27C"/><ellipse cx="0" cy="200" rx="18" ry="3.5" fill="#C9B27C"/>',
      prop: '<path d="M-8 222 L0 236 L8 222" fill="none" stroke="' + INK + '" stroke-width="1.2"/><circle cx="-4" cy="238" r="4" fill="' + INK + '"/><circle cx="4" cy="238" r="4" fill="' + INK + '"/>' +
        '<path d="M-14 232 L-17 258 M14 232 L17 258" stroke="#8D5B3C" stroke-width="5" stroke-linecap="round"/>' },
    { c: "#D9694F", skin: "#E8B48F", f: 0.69, /* GIS specialist, with a map */
      hair: '<path d="M-12 210 Q-14 192 0 192 Q14 192 12 210 L12 222 Q8 206 0 204 Q-8 206 -12 222Z" fill="#2C2C2A"/>',
      prop: '<path d="M-14 234 L-15 242 M14 234 L15 242" stroke="#E8B48F" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="-18" y="230" width="36" height="22" rx="1.5" fill="#FFF7E8" stroke="' + INK + '" stroke-width="1.2"/>' +
        '<path d="M-6 230 V252 M6 230 V252" stroke="' + INK + '" stroke-width="0.6" opacity="0.4"/>' +
        '<path d="M-15 246 Q-6 236 2 242 T15 236 M-15 250 Q-4 242 4 247 T15 243" fill="none" stroke="#D9694F" stroke-width="1"/>' },
    { c: "#C25B8A", skin: "#C68B5E", f: 0.88, /* trainer, with a clipboard */
      hair: '<path d="M-13 208 Q-12 190 0 191 Q13 192 13 208 Q13 198 0 198 Q-12 198 -13 208Z" fill="#412402"/>',
      prop: '<path d="M-13 232 L-16 258" stroke="#C68B5E" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="8" y="230" width="16" height="21" rx="1.5" fill="#FFFFFF" stroke="' + INK + '" stroke-width="1.2"/><rect x="12" y="228" width="8" height="4" rx="1" fill="' + INK + '"/>' +
        '<path d="M11 237 H21 M11 241 H21 M11 245 H18" stroke="#C25B8A" stroke-width="1"/><path d="M13 232 L14 242" stroke="#C68B5E" stroke-width="5" stroke-linecap="round"/>' }
  ];

  /* Each discipline's idea, drawn about 11 units across: cog, leaf, map pin, light bulb */
  var IDEA = [
    function (c) { return '<circle r="4.2" fill="none" stroke="' + c + '" stroke-width="2.6" stroke-dasharray="2 1.3"/><circle r="1.6" fill="' + c + '"/>'; },
    function (c) { return '<path d="M-5 4.5 Q-5.5 -5 5 -5 Q5.5 4.5 -5 4.5 Z" fill="' + c + '"/><path d="M-4 3.5 L3 -3" stroke="#FFFFFF" stroke-width="0.9"/>'; },
    function (c) { return '<path d="M0 6 L-3.6 0.8 A4.4 4.4 0 1 1 3.6 0.8 Z" fill="' + c + '"/><circle cy="-2" r="1.5" fill="#FFFFFF"/>'; },
    function (c) { return '<circle cy="-1.5" r="4" fill="' + c + '"/><rect x="-2" y="2.5" width="4" height="3" rx="0.8" fill="' + INK + '"/>'; }
  ];

  function work(W) {
    var P = WORK.map(function (p) { return W * p.f; }), CX = W / 2;
    var TC = P.map(function (x) { return [x + 22, 168]; }); /* thought clouds, up and right of each head */
    var H = TC.map(function (c) { return [c[0], 128]; });   /* drone hovers just above each cloud */
    var B = [CX, 180];                                       /* hover point over the binder */
    var SEQ = [0, 2, 1, 3, 0];                               /* idea relay: everyone gives one idea and receives one */
    var APEX = [96, 110, 90, 84];                            /* each hop arcs to its own height, under the bubble */
    var PAGE_OFF = [0, 16], CHIP_OFF = [0, 24]; /* ideas and pages hover just below the drone, which stays above the clouds */
    function slot(k) { return [CX, 241 - k * 6]; }
    function arc(a, b, y) { return [a, [a[0], y], [b[0], y], b]; }
    function plus(a, o) { return [a[0] + o[0], a[1] + o[1]]; }
    function own(i) { return plus(TC[i], [-6, -1]); }      /* each person's own idea, left of their cloud */
    function got(i) { return plus(TC[i], [10, -1]); }      /* the idea they receive, right of it */

    var s = backdrop(W);
    /* Each cloud shares a wrapper with the idea it receives, so both shrink away together
       (about the trail's end, in scene units: the wrapper's parent is the svg itself) */
    var chipOf = [];
    for (var k = 0; k < 4; k++) chipOf[SEQ[k + 1]] = k;
    WORK.forEach(function (p, i) {
      var k = chipOf[i], g = SEQ[k];
      s += '<g class="cps-w-think" style="transform-origin:' + (TC[i][0] - 19) + "px " + (TC[i][1] + 29) + 'px">' +
        '<g transform="translate(' + TC[i][0] + " " + TC[i][1] + ')">' +
        '<circle cx="-19" cy="27" r="2" fill="#FFFFFF" stroke="' + INK + '" stroke-width="1"/><circle cx="-14" cy="20" r="3" fill="#FFFFFF" stroke="' + INK + '" stroke-width="1"/>' +
        '<path d="M-14 12 a8 8 0 0 1 -4 -14 a10 10 0 0 1 14 -8 a10 10 0 0 1 16 2 a9 9 0 0 1 8 14 a6 6 0 0 1 -6 6 Z" fill="#FFFFFF" stroke="' + INK + '" stroke-width="1.2"/>' +
        '<g transform="translate(-6 -1)">' + IDEA[i](p.c) + "</g></g>" +
        /* the idea the drone brings: a copy of the giver's */
        '<g class="cps-w-chip" data-k="' + k + '"' + (still ? " " + at(got(i)) : "") + '><circle r="7" fill="#FFFFFF"/>' + IDEA[g](WORK[g].c) + "</g></g>";
    });
    s += bubble("cps-w-b0", "#E9A23B", "Share ideas and experience", "Swap what works across disciplines") +
      bubble("cps-w-b1", "#2f7d5b", "Co-develop practice", "Develop shared practice and processes together");
    /* Lectern with a binder that fills page by page */
    s += '<rect x="' + (CX - 36) + '" y="250" width="72" height="6" rx="2" fill="#5F5E5A"/><rect x="' + (CX - 3) + '" y="256" width="6" height="44" fill="#5F5E5A"/>' +
      '<rect x="' + (CX - 18) + '" y="296" width="36" height="4" rx="1" fill="#5F5E5A"/>' +
      '<rect x="' + (CX - 24) + '" y="244" width="48" height="6" rx="1.5" fill="' + INK + '"/>';
    WORK.forEach(function (p, i) {
      s += '<g class="cps-w-page"' + (still ? " " + at(slot(i)) : "") + '><rect x="-18" y="-2.5" width="36" height="5" rx="1.5" fill="' + p.c + '"/></g>';
    });
    s += '<g class="cps-w-tick" transform="translate(' + (CX + 30) + ' 226)"><g class="cps-w-pop"><circle r="9" fill="#2f7d5b"/><path d="M-4 0 L-1 3 L4 -3" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></g>';
    WORK.forEach(function (p, i) {
      s += '<g transform="translate(' + P[i] + ' 0)"><g class="cps-w-act">' + legs() + '<rect x="-15" y="222" width="30" height="54" rx="12" fill="' + p.c + '"/>' +
        '<circle cx="0" cy="208" r="12" fill="' + p.skin + '"/>' + p.hair + p.prop + "</g></g>";
    });
    s += quad(still ? B : null, "cps-w-drone", 0, 0);

    return {
      svg: s,
      after: function (svg) {
        placeBubbles(svg, W, [null, null], [18, 18]);
        if (still) return;
        /* Share ideas and experience: the drone glides in just over a cloud and picks up a copy of that idea, carries it
           over and lowers it into the next cloud, then drifts across and collects that person's idea in turn */
        function grabAt(i) { return plus(own(i), [0, -CHIP_OFF[1]]); } /* drone position that hovers a carried idea on its spot */
        function dropAt(i) { return plus(got(i), [0, -CHIP_OFF[1]]); }
        function line(a, b) { return [a, a, b, b]; }
        var segs = [{ t0: 0, t1: 0.03, hold: B }, { t0: 0.03, t1: 0.09, p: [B, [B[0], 110], [grabAt(0)[0], 110], grabAt(0)] },
          { t0: 0.09, t1: 0.10, hold: grabAt(0) }];
        var arrive = [[0, 0.09]], grab = [0.09], release = [];
        for (var k = 0; k < 4; k++) {
          var g = SEQ[k], r = SEQ[k + 1], t0 = 0.10 + k * 0.09, t1 = t0 + 0.06;
          segs.push({ t0: t0, t1: t1, p: arc(grabAt(g), dropAt(r), APEX[k]) });
          release.push(t1);
          arrive.push([r, t1]);
          if (k < 3) {
            segs.push({ t0: t1, t1: t1 + 0.025, p: line(dropAt(r), grabAt(r)) }, { t0: t1 + 0.025, t1: t1 + 0.03, hold: grabAt(r) });
            grab.push(t1 + 0.025);
          } else {
            segs.push({ t0: t1, t1: t1 + 0.03, p: line(dropAt(r), H[r]) }, { t0: t1 + 0.03, t1: 0.535, hold: H[r] });
          }
        }
        /* Each carried idea hovers below the drone from its pick-up to its drop */
        svg.querySelectorAll(".cps-w-chip").forEach(function (chip) {
          var k = +chip.dataset.k;
          var g0 = grab[k], released = release[k], to = got(SEQ[k + 1]);
          var ride = segs.filter(function (q) { return q.t0 >= g0 && q.t1 <= released; }).map(function (q) {
            return q.hold ? { t0: q.t0, t1: q.t1, hold: plus(q.hold, CHIP_OFF) } : { t0: q.t0, t1: q.t1, p: q.p.map(function (v) { return plus(v, CHIP_OFF); }) };
          });
          chip.animate(flight([{ t0: 0, t1: g0 - 0.001, hold: own(SEQ[k]) }, { t0: g0 - 0.001, t1: g0, hold: own(SEQ[k]) }].concat(ride,
            [{ t0: released, t1: 0.5, hold: to }, { t0: 0.5, t1: 0.505, hold: to }, { t0: 0.505, t1: 1, hold: to }]), function (o) {
            /* once it lands, the cloud's wrapper does the shrinking and fading */
            return o < g0 || o > 0.5 ? 0 : 1;
          }), { duration: LOOP, iterations: Infinity });
        });
        /* Co-develop: collect a page from each person and lower it into the binder */
        var steps = svg.querySelectorAll(".cps-w-page");
        function fadeOut(o) { return o > 0.96 ? Math.max(0, 1 - (o - 0.96) / 0.025) : 1; }
        WORK.forEach(function (p, i) {
          var t = 0.50 + i * 0.10, pick = t + 0.035, leave = t + 0.045, land = t + 0.08, drop = t + 0.09;
          var D = plus(slot(i), [0, -CHIP_OFF[1]]); /* drone position that lays the page on the stack */
          if (i) segs.push({ t0: t, t1: pick, p: [B, [B[0], 110], [H[i][0], 110], H[i]] });
          segs.push({ t0: pick, t1: leave, hold: H[i] });
          var toD = [H[i], [H[i][0], 110], [D[0], 110], D];
          segs.push({ t0: leave, t1: land, p: toD }, { t0: land, t1: drop, hold: D },
            { t0: drop, t1: i < 3 ? t + 0.10 : drop + 0.03, p: line(D, B) });
          if (i === 3) segs.push({ t0: drop + 0.03, t1: 1, hold: B });
          grab.push(pick); release.push(land);
          arrive.push([i, pick]);
          var under = toD.map(function (q) { return plus(q, CHIP_OFF); }), sl = slot(i);
          steps[i].animate(flight([{ t0: 0, t1: pick, hold: under[0] }, { t0: pick, t1: leave, hold: under[0] }, { t0: leave, t1: land, p: under },
            { t0: land, t1: 0.96, hold: sl }, { t0: 0.96, t1: 0.985, hold: sl }, { t0: 0.985, t1: 1, hold: sl }], function (o) {
            if (o < pick) return 0;
            if (o < pick + 0.005) return (o - pick) / 0.005;
            return fadeOut(o);
          }), { duration: LOOP, iterations: Infinity });
        });
        svg.querySelector(".cps-w-drone").animate(flight(segs, function () { return 1; }), { duration: LOOP, iterations: Infinity });
        /* Each person gives a little hop when the drone reaches them */
        svg.querySelectorAll(".cps-w-act").forEach(function (el, i) {
          var kf = [{ offset: 0, transform: "translateY(0)" }];
          arrive.filter(function (a) { return a[0] === i; }).map(function (a) { return a[1]; }).sort(function (x, y) { return x - y; }).forEach(function (t) {
            kf.push({ offset: t - 0.002, transform: "translateY(0)" }, { offset: t + 0.01, transform: "translateY(-6px)" }, { offset: t + 0.025, transform: "translateY(0)" });
          });
          kf.push({ offset: 1, transform: "translateY(0)" });
          el.animate(kf, { duration: LOOP, iterations: Infinity, easing: "ease-in-out" });
        });
      }
    };
  }

  var SCENES = {
    work: { draw: work, title: "Share ideas and experience, co-develop practice", desc: "Four people from different disciplines. A drone carries ideas between their thought clouds until each has someone else's, then collects a page from each and lowers it into a shared binder, which earns a tick." },
    ethos: { draw: ethos, title: "Shared landscape", desc: "Three pilots take turns. Each drone beams data to a small screen labelled Shared landscape, where a raster builds column by column and CoPTER emerges as high ground." },
    strands: { draw: strands, title: "Four strands, one drone", desc: "One drone passes between four people. Technology builds it at a bench, Operations flies it in a gentle survey, Deployment's bar chart grows as three more drones rise from her case, and Direction waves the swarm off to the right." }
  };

  function render(host) {
    var scene = SCENES[host.dataset.scene];
    if (!scene) return;
    var W = Math.max(680, Math.min(1400, Math.round(host.clientWidth)));
    if (W === host._cpsW) return;
    host._cpsW = W;
    var built = scene.draw(W);
    host.innerHTML = '<svg class="cps-svg' + (still ? " cps-still" : "") + '" viewBox="0 0 ' + W + ' 360" role="img" aria-labelledby="' + host.id + '-t ' + host.id + '-d">' +
      '<title id="' + host.id + '-t">' + scene.title + '</title><desc id="' + host.id + '-d">' + scene.desc + "</desc>" + built.svg + "</svg>";
    built.after(host.firstChild);
    settle(host);
  }

  /* Every loop starts at the timeline's zero, so a redrawn scene stays in step with its cards */
  function phase(anims) { anims.forEach(function (a) { a.startTime = 0; }); }

  document.querySelectorAll("[class*='cps-k-']").forEach(function (card) {
    if (card.getAnimations) phase(card.getAnimations());
  });
  /* Scenes off screen, or in a hidden tab, pause; back in view they rejoin the loop in step with their columns */
  function live(host) { return host._cpsSeen && document.visibilityState !== "hidden"; }
  function settle(host) {
    if (!host.getAnimations) return;
    var anims = host.getAnimations({ subtree: true });
    if (live(host)) phase(anims); else anims.forEach(function (a) { a.pause(); });
  }
  var seen = window.IntersectionObserver && new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target._cpsSeen = e.isIntersecting; settle(e.target); });
  }, { rootMargin: "100px 0px" });
  document.addEventListener("visibilitychange", function () {
    document.querySelectorAll(".cps-scene").forEach(settle);
  });

  document.querySelectorAll(".cps-scene").forEach(function (host, i) {
    if (!host.id) host.id = "cps-" + i;
    host._cpsSeen = !seen;
    render(host);
    if (seen) seen.observe(host);
    if (window.ResizeObserver) {
      var timer = 0;
      new ResizeObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(function () { render(host); }, 150);
      }).observe(host);
    }
  });
})();
