/* Extra interactive blocks: map, tabernacle, connect, match, rings, kings, stepper, accordion.
   Each entry has render(k, H) -> html and optional wire(el, H). */
(function(){
"use strict";
var X = window.EXT_BLOCKS = window.EXT_BLOCKS || {};
function J(o){ return String(JSON.stringify(o)).replace(/&/g,"&amp;").replace(/"/g,"&quot;"); }
function rd(el){ return JSON.parse(el.querySelector("[data-k]").getAttribute("data-k")); }
var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- MAP: simplified geography, places by real longitude/latitude ---------- */
var BASES = {
  neareast: {lon0:24, lon1:52, lat0:24, lat1:38.5, labels:[["Mediterranean Sea",28.5,33.6],["Red Sea",36.2,25.2],["Persian Gulf",50.0,27.6],["Arabian Desert",42,28.5]]},
  israel: {lon0:33.9, lon1:36.9, lat0:29.4, lat1:33.7, labels:[["Mediterranean Sea",34.2,32.6],["Negev",34.85,30.6],["Gulf of Aqaba",34.6,29.55]]}
};
var GEO = {
  med: [[18,40],[26.3,40],[26.5,38.4],[27.3,37.0],[28.0,36.6],[29.5,36.2],[30.6,36.8],[32.0,36.5],[33.5,36.1],[34.6,36.8],[36.1,36.9],[36.0,36.0],[35.8,35.4],[35.95,34.7],[35.5,33.9],[35.2,33.1],[35.05,32.85],[34.9,32.5],[34.75,32.0],[34.5,31.6],[34.2,31.32],[33.6,31.13],[32.3,31.25],[31.4,31.55],[30.4,31.45],[29.9,31.2],[29.0,30.9],[27.3,31.4],[25.2,31.6],[22,32.8],[18,32]],
  cyprus: [[32.3,35.1],[32.9,35.4],[34.6,35.7],[33.9,35.0],[33.0,34.6],[32.4,34.7]],
  red: [[32.55,29.95],[32.7,29.3],[33.5,28.0],[33.9,27.3],[34.3,26.5],[35.0,25.0],[35.6,23.5],[38,23.5],[37.0,25.2],[36.2,26.3],[35.3,27.8],[34.95,29.52],[34.6,28.6],[34.3,27.85],[33.6,28.4],[32.9,29.4]],
  gulf: [[48.0,30.1],[49.0,30.1],[50.0,29.2],[50.5,28.0],[51.5,27.9],[53,27.3],[53,23.5],[51.5,24.0],[51.2,26.1],[50.8,24.8],[50.4,25.5],[50.1,26.2],[49.6,26.9],[48.8,27.6],[48.3,28.5],[48.0,29.4]],
  dead: [[35.47,31.78],[35.56,31.76],[35.6,31.3],[35.5,31.05],[35.39,31.3]],
  galilee: [[35.55,32.89],[35.64,32.86],[35.65,32.75],[35.58,32.7],[35.52,32.8]],
  rivers: [
    [[31.2,30.05],[31.3,29.0],[30.9,28.0],[31.0,27.0],[31.8,26.2],[32.7,25.7],[32.9,24.0],[32.9,23]],
    [[31.2,30.05],[30.4,31.45]],[[31.2,30.05],[31.8,31.5]],
    [[38.5,39],[38.3,37.0],[38.2,36.4],[39.0,36.0],[40.1,35.3],[40.9,34.4],[42.0,34.2],[43.3,33.4],[44.3,32.5],[45.3,31.6],[46.4,31.0],[47.4,31.0],[48.0,30.4],[48.3,30.05]],
    [[40.2,39],[41.2,37.4],[42.3,37.0],[43.1,36.4],[43.3,35.5],[43.8,34.7],[44.4,33.6],[45.3,32.8],[46.0,31.9],[47.2,31.0],[47.4,31.0]],
    [[35.62,33.25],[35.6,32.89]],[[35.57,32.71],[35.55,32.3],[35.56,31.9],[35.55,31.77]]
  ]
};
function proj(b){
  var c = Math.cos((b.lat0+b.lat1)/2*Math.PI/180), W = 1000, sx = W/((b.lon1-b.lon0)*c), H = (b.lat1-b.lat0)*sx;
  return {W:W, H:Math.round(H), p:function(lon,lat){ return [((lon-b.lon0)*c*sx), ((b.lat1-lat)*sx)]; }};
}
function poly(pr, pts){ return pts.map(function(q, i){ var p = pr.p(q[0], q[1]); return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1); }).join("")+"Z"; }
function line(pr, pts){ return pts.map(function(q, i){ var p = pr.p(q[0], q[1]); return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1); }).join(""); }
X.map = {
  render: function(k, H){
    var b = BASES[k.base] || BASES.neareast, pr = proj(b), s = pr.W/1000, fs = k.base === "israel" ? 30 : 17;
    var svg = '<svg viewBox="0 0 '+pr.W+' '+pr.H+'" class="geo geo-'+(k.base||"neareast")+'" role="img" aria-label="'+H.esc(H.plain(k.title||"Map"))+'">'+
      '<rect width="100%" height="100%" class="land"/>'+
      ["med","red","gulf","cyprus","dead","galilee"].map(function(n){ return '<path class="'+(n==="cyprus"?"island":"sea")+'" d="'+poly(pr, GEO[n])+'"/>'; }).join("")+
      GEO.rivers.map(function(r){ return '<path class="river" d="'+line(pr, r)+'"/>'; }).join("")+
      b.labels.concat((k.regions||[]).map(function(r){ return [r.name, r.lon, r.lat, 1]; })).map(function(l){ var p = pr.p(l[1], l[2]); return '<text class="'+(l[3]?"region":"sealabel")+'" x="'+p[0].toFixed(0)+'" y="'+p[1].toFixed(0)+'" font-size="'+(l[3]?fs+2:fs)+'">'+H.esc(l[0])+'</text>'; }).join("");
    var byName = {};
    (k.places||[]).forEach(function(pl){ byName[pl.name] = pr.p(pl.lon, pl.lat); });
    (k.routes||[]).forEach(function(r, i){
      var a = byName[r.from], z = byName[r.to]; if (!a || !z) return;
      var mx = (a[0]+z[0])/2, my = (a[1]+z[1])/2, dx = z[0]-a[0], dy = z[1]-a[1], bend = r.bend == null ? .18 : r.bend;
      var cx = mx - dy*bend, cy = my + dx*bend;
      svg += '<path class="route" data-r="'+i+'" style="--rc:'+(r.color||"var(--accent)")+'" d="M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' Q'+cx.toFixed(1)+' '+cy.toFixed(1)+' '+z[0].toFixed(1)+' '+z[1].toFixed(1)+'" marker-end="url(#ah)"/>';
    });
    (k.places||[]).forEach(function(pl, i){
      var p = byName[pl.name], left = pl.label === "left" || (pl.label !== "right" && p[0] > pr.W*0.8), anchor = left ? "end" : "start", off = left ? -12 : 12;
      svg += '<g class="place" data-i="'+i+'" tabindex="0" role="button" aria-label="'+H.esc(pl.name)+'"><circle class="halo" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="16"/><circle class="dot" cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="7"/><text x="'+(p[0]+off).toFixed(1)+'" y="'+(p[1]+5).toFixed(1)+'" text-anchor="'+anchor+'" font-size="'+fs+'">'+H.esc(pl.name)+'</text></g>';
    });
    svg += '<defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--ink)" opacity=".7"/></marker></defs></svg>';
    var legend = (k.routes||[]).length ? '<div class="geo-legend">'+k.routes.map(function(r, i){ return '<button class="chip" data-r="'+i+'"><i style="background:'+(r.color||"var(--accent)")+'"></i>'+H.md(r.label||(r.from+" to "+r.to))+'</button>'; }).join("")+'</div>' : "";
    return H.title(k, H.I.map)+'<div class="geo-wrap" data-k="'+J(k)+'"><div class="geo-scroll">'+svg+'</div>'+
      '<div class="geo-bar">'+((k.routes||[]).length?'<button class="btn small play">Play the journey</button>':'')+'<span class="geo-hint">Tap a place to learn about it.<span class="geo-swipe'+(k.base==="israel"?" hide":"")+'"> Swipe the map sideways to see more.</span></span></div>'+legend+
      '<div class="geo-info" aria-live="polite">'+H.md(k.intro||"")+'</div></div>';
  },
  wire: function(el, H){
    var k = rd(el), info = el.querySelector(".geo-info"), routes = el.querySelectorAll(".route"), timer = [];
    // on narrow screens the map is wider than the card: start it centred on the places
    var sc = el.querySelector(".geo-scroll"), dots = el.querySelectorAll(".place .dot");
    function centre(){
      if (sc.scrollWidth <= sc.clientWidth || !dots.length) return;
      var svgEl = el.querySelector("svg"), vb = svgEl.viewBox.baseVal, start = 0;
      if (k.routes && k.routes.length) k.places.forEach(function(pl, i){ if (pl.name === k.routes[0].from) start = i; });
      var cx = +dots[start].getAttribute("cx");
      sc.scrollLeft = Math.max(0, cx/vb.width*svgEl.getBoundingClientRect().width - sc.clientWidth*0.3);
    }
    setTimeout(centre, 60);
    function show(i){ var pl = k.places[i]; el.querySelectorAll(".place").forEach(function(g){ g.classList.toggle("on", +g.dataset.i === i); }); info.innerHTML = '<b>'+H.md(pl.name)+'</b>'+(pl.d?'<p>'+H.md(pl.d)+'</p>':''); }
    el.querySelectorAll(".place").forEach(function(g){
      g.addEventListener("click", function(){ show(+g.dataset.i); });
      g.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); show(+g.dataset.i); } });
    });
    function drawRoute(i){
      var r = routes[i]; if (!r) return; var len = r.getTotalLength();
      r.style.strokeDasharray = len; r.style.strokeDashoffset = reduce ? 0 : len; r.classList.add("shown");
      if (!reduce) r.animate([{strokeDashoffset:len},{strokeDashoffset:0}], {duration:1400, easing:"ease-in-out", fill:"forwards"});
      var rt = k.routes[+r.dataset.r]; info.innerHTML = '<b>'+H.md(rt.label||"")+'</b>'+(rt.d?'<p>'+H.md(rt.d)+'</p>':'');
      el.querySelectorAll(".chip").forEach(function(c){ c.classList.toggle("on", c.dataset.r === r.dataset.r); });
    }
    function play(){
      timer.forEach(clearTimeout); timer = [];
      routes.forEach(function(r){ r.classList.remove("shown"); });
      routes.forEach(function(r, i){ timer.push(setTimeout(function(){ drawRoute(i); }, i*(reduce?50:1900))); });
    }
    var pb = el.querySelector(".play"); if (pb) pb.onclick = play;
    el.querySelectorAll(".chip").forEach(function(c){ c.onclick = function(){ timer.forEach(clearTimeout); drawRoute(+c.dataset.r); }; });
    // draw all routes once when the map scrolls into view
    if ("IntersectionObserver" in window){
      var o = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ o.disconnect(); play(); } }, {threshold:.35}); o.observe(el);
    } else play();
  }
};

/* ---------- TABERNACLE: clickable floor plan with a guided walk from gate to ark ---------- */
var TAB = [
  {key:"gate", x:880, y:150, w:16, h:100, label:"Gate"},
  {key:"altar", x:700, y:170, w:60, h:60, label:"Bronze altar"},
  {key:"laver", x:590, y:200, r:20, label:"Laver"},
  {key:"holyplace", x:250, y:140, w:200, h:120, label:"Holy Place", zone:1},
  {key:"lampstand", x:380, y:228, r:13, label:"Lampstand"},
  {key:"table", x:370, y:150, w:44, h:26, label:"Table of bread"},
  {key:"incense", x:290, y:190, w:22, h:22, label:"Incense altar"},
  {key:"veil", x:244, y:140, w:8, h:120, label:"Veil"},
  {key:"ark", x:150, y:180, w:52, h:40, label:"Ark of the covenant", zone:2}
];
X.tabernacle = {
  render: function(k, H){
    var g = '<rect class="t-court" x="40" y="40" width="860" height="320" rx="6"/><text class="t-lab" x="470" y="30" text-anchor="middle">Outer court (100 × 50 cubits)</text>'+
      '<rect class="t-mostholy" x="90" y="140" width="150" height="120"/><text class="t-lab" x="165" y="132" text-anchor="middle">Most Holy Place</text><text class="t-lab" x="350" y="132" text-anchor="middle">Holy Place</text>'+
      '<path class="t-walk" d="M900 200 H730 H590 H452 H300 H246 H176"/>'+
      '<text class="t-lab small" x="905" y="380" text-anchor="end">East: entrance faces the sunrise</text>';
    TAB.forEach(function(t, i){
      if (t.zone === 1){ g += '<rect class="t-hit t-holy" data-key="'+t.key+'" x="'+t.x+'" y="'+t.y+'" width="'+t.w+'" height="'+t.h+'" tabindex="0" role="button" aria-label="'+t.label+'"/>'; return; }
      var shape = t.r ? '<circle cx="'+t.x+'" cy="'+t.y+'" r="'+t.r+'"/>' : '<rect x="'+t.x+'" y="'+t.y+'" width="'+t.w+'" height="'+t.h+'" rx="3"/>';
      g += '<g class="t-item t-'+t.key+'" data-key="'+t.key+'" tabindex="0" role="button" aria-label="'+t.label+'">'+shape+'</g>';
    });
    var LBL = {gate:[872,272,"Gate"], altar:[730,250,"Altar"], laver:[590,238,"Laver"], lampstand:[380,256,"Lampstand"], table:[392,194,"Table"], incense:[301,236,"Incense"], veil:[248,280,"Veil"], ark:[176,240,"Ark"]};
    Object.keys(LBL).forEach(function(key){ var l = LBL[key]; g += '<text class="t-name" x="'+l[0]+'" y="'+l[1]+'" text-anchor="middle">'+l[2]+'</text>'; });
    return H.title(k, H.I.map)+'<div class="tab-wrap" data-k="'+J(k)+'"><svg viewBox="0 0 940 400" class="tab-svg" role="img" aria-label="Floor plan of the tabernacle">'+g+'</svg>'+
      '<div class="geo-bar"><button class="btn small walk">Walk from the gate to the ark</button><span class="geo-hint">Or tap any piece of furniture.</span></div>'+
      '<div class="tab-info" aria-live="polite"><b>'+H.md(k.intro_h||"Approaching a holy God")+'</b><p>'+H.md(k.intro||"Every worshipper came in from the east, past the altar and the water, toward the presence of God behind the veil.")+'</p></div></div>';
  },
  wire: function(el, H){
    var k = rd(el), info = el.querySelector(".tab-info"), svg = el.querySelector("svg"), timer = [];
    // keep furniture above the Holy Place hit area
    var holy = svg.querySelector(".t-holy"); svg.querySelectorAll(".t-item").forEach(function(n){ svg.appendChild(n); });
    function show(key){
      var it = (k.items||{})[key]; if (!it) return;
      svg.querySelectorAll("[data-key]").forEach(function(n){ n.classList.toggle("on", n.dataset.key === key); });
      info.innerHTML = '<b>'+H.md(it.h)+'</b>'+(it.ref?'<small>'+H.esc(it.ref)+'</small>':'')+'<p>'+H.md(it.d||"")+'</p>'+(it.christ?'<p class="tab-christ"><strong>Fulfilled in Jesus: </strong>'+H.md(it.christ)+'</p>':'');
      if (info.animate && !reduce) info.animate([{opacity:0, transform:"translateY(6px)"},{opacity:1, transform:"none"}], {duration:300});
    }
    svg.querySelectorAll("[data-key]").forEach(function(n){
      n.addEventListener("click", function(){ timer.forEach(clearTimeout); show(n.dataset.key); });
      n.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); show(n.dataset.key); } });
    });
    el.querySelector(".walk").onclick = function(){
      timer.forEach(clearTimeout); timer = [];
      var path = svg.querySelector(".t-walk"), len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      if (path.animate) path.animate([{strokeDashoffset:len},{strokeDashoffset:0}], {duration:reduce?10:9000, easing:"linear", fill:"forwards"});
      ["gate","altar","laver","holyplace","lampstand","table","incense","veil","ark"].forEach(function(key, i){ timer.push(setTimeout(function(){ show(key); }, i*(reduce?10:1100))); });
    };
  }
};

/* ---------- CONNECT: shadow -> substance with drawn connector lines ---------- */
X.connect = {
  render: function(k, H){
    return H.title(k, H.I.diagram)+'<div class="con" data-k="'+J(k)+'"><div class="con-head"><span>'+H.md(k.left||"Shadow")+'</span><span>'+H.md(k.right||"Substance")+'</span></div>'+
      '<div class="con-grid"><svg class="con-lines" aria-hidden="true"></svg>'+
      k.pairs.map(function(p, i){ return '<button class="con-l" data-i="'+i+'">'+H.md(p.a)+'</button><span class="con-gap"></span><button class="con-r" data-i="'+i+'">'+H.md(p.b)+'</button>'; }).join("")+
      '</div><div class="con-info" aria-live="polite">Tap either side to see how they connect.</div></div>';
  },
  wire: function(el, H){
    var k = rd(el), grid = el.querySelector(".con-grid"), svg = el.querySelector(".con-lines"), info = el.querySelector(".con-info"), active = -1;
    function draw(){
      var g = grid.getBoundingClientRect(); svg.setAttribute("viewBox", "0 0 "+g.width+" "+g.height); svg.setAttribute("width", g.width); svg.setAttribute("height", g.height);
      var out = "";
      k.pairs.forEach(function(p, i){
        var a = grid.querySelector('.con-l[data-i="'+i+'"]').getBoundingClientRect(), b = grid.querySelector('.con-r[data-i="'+i+'"]').getBoundingClientRect();
        var x1 = a.right-g.left, y1 = a.top+a.height/2-g.top, x2 = b.left-g.left, y2 = b.top+b.height/2-g.top, mx = (x1+x2)/2;
        out += '<path class="'+(i===active?"on":"")+'" style="animation-delay:'+(i*0.12)+'s" d="M'+x1+' '+y1+' C'+mx+' '+y1+' '+mx+' '+y2+' '+x2+' '+y2+'"/>';
      });
      svg.innerHTML = out;
    }
    function pick(i){
      active = i; draw();
      el.querySelectorAll(".con-l,.con-r").forEach(function(b){ b.classList.toggle("on", +b.dataset.i === i); });
      var p = k.pairs[i]; info.innerHTML = '<b>'+H.md(p.a)+' → '+H.md(p.b)+'</b><p>'+H.md(p.d||"")+'</p>'+(p.ref?'<small>'+H.esc(p.ref)+'</small>':'');
    }
    el.querySelectorAll(".con-l,.con-r").forEach(function(b){ b.onclick = function(){ pick(+b.dataset.i); }; });
    requestAnimationFrame(draw); window.addEventListener("resize", draw);
    if ("IntersectionObserver" in window){ var o = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ o.disconnect(); draw(); el.classList.add("drawn"); } }); o.observe(el); }
  }
};

/* ---------- MATCH: tap-to-pair memory game ---------- */
X.match = {
  render: function(k, H){
    var idx = k.pairs.map(function(_, i){ return i; }), right = idx.slice();
    for (var i = right.length-1; i > 0; i--){ var j = Math.floor(Math.random()*(i+1)); var t = right[i]; right[i] = right[j]; right[j] = t; }
    return H.title(k, H.I.quiz)+'<div class="match" data-k="'+J(k)+'"><p class="match-how">'+H.md(k.how||"Tap an item on the left, then its partner on the right.")+'</p><div class="match-cols"><div>'+
      idx.map(function(i){ return '<button class="m-a" data-i="'+i+'">'+H.md(k.pairs[i].a)+'</button>'; }).join("")+'</div><div>'+
      right.map(function(i){ return '<button class="m-b" data-i="'+i+'">'+H.md(k.pairs[i].b)+'</button>'; }).join("")+
      '</div></div><div class="match-score" aria-live="polite"></div></div>';
  },
  wire: function(el, H){
    var k = rd(el), sel = null, done = 0, tries = 0, score = el.querySelector(".match-score");
    el.querySelectorAll(".m-a").forEach(function(b){ b.onclick = function(){ if (b.disabled) return; el.querySelectorAll(".m-a").forEach(function(x){ x.classList.remove("sel"); }); b.classList.add("sel"); sel = b; }; });
    el.querySelectorAll(".m-b").forEach(function(b){ b.onclick = function(){
      if (!sel || b.disabled) return; tries++;
      if (sel.dataset.i === b.dataset.i){
        [sel, b].forEach(function(x){ x.classList.remove("sel"); x.classList.add("ok"); x.disabled = true; }); done++; sel = null;
        if (done === k.pairs.length) score.textContent = "All " + done + " matched in " + tries + " tries." + (tries === done ? " Perfect!" : "");
        else score.textContent = done + " of " + k.pairs.length + " matched.";
      } else { b.classList.add("no"); setTimeout(function(){ b.classList.remove("no"); }, 450); }
    }; });
  }
};

/* ---------- RINGS: concentric zones (e.g. degrees of holiness) ---------- */
X.rings = {
  render: function(k, H){
    var n = k.items.length, out = "";
    k.items.forEach(function(it, i){ var r = 48 - i*(40/n); out += '<circle class="ring-z" data-i="'+i+'" cx="50" cy="50" r="'+r.toFixed(1)+'" style="--o:'+(0.12+i*(0.75/n)).toFixed(2)+';animation-delay:'+(i*0.15)+'s" tabindex="0" role="button" aria-label="'+H.esc(H.plain(it.h))+'"/>'; });
    k.items.forEach(function(it, i){ var r = 48 - i*(40/n); out += '<text x="50" y="'+(50 - r + 4.2).toFixed(1)+'" text-anchor="middle" class="ring-t">'+H.esc(H.plain(it.h))+'</text>'; });
    return H.title(k, H.I.diagram)+'<div class="rings" data-k="'+J(k)+'"><svg viewBox="0 0 100 100" class="rings-svg">'+out+'</svg><div class="rings-info" aria-live="polite"><b>'+H.md(k.center||"Tap a ring")+'</b><p>'+H.md(k.hint||"Each step inward is a step closer to God's presence.")+'</p></div></div>';
  },
  wire: function(el, H){
    var k = rd(el), info = el.querySelector(".rings-info");
    el.querySelectorAll(".ring-z").forEach(function(c){
      function go(e){ e.stopPropagation(); el.querySelectorAll(".ring-z").forEach(function(x){ x.classList.toggle("on", x === c); }); var it = k.items[+c.dataset.i]; info.innerHTML = '<b>'+H.md(it.h)+'</b><p>'+H.md(it.d||"")+'</p>'; }
      c.addEventListener("click", go); c.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); go(e); } });
    });
  }
};

/* ---------- KINGS: filterable reign chart ---------- */
var VERDICT = {good:"Did right", bad:"Did evil", mixed:"Mixed"};
X.kings = {
  render: function(k, H){
    var groups = []; k.items.forEach(function(it){ if (groups.indexOf(it.group) < 0) groups.push(it.group); });
    return H.title(k, H.I.diagram)+'<div class="kings" data-k="'+J(k)+'"><div class="k-filters"><button class="chip on" data-g="">All</button>'+
      groups.map(function(g){ return '<button class="chip" data-g="'+H.esc(g)+'">'+H.esc(g)+'</button>'; }).join("")+
      '<span class="k-legend"><i class="v-good"></i>Did right <i class="v-mixed"></i>Mixed <i class="v-bad"></i>Did evil</span></div>'+
      '<div class="k-list">'+k.items.map(function(it, i){
        return '<button class="k-row v-'+(it.verdict||"mixed")+'" data-g="'+H.esc(it.group)+'" data-i="'+i+'" style="animation-delay:'+(i*0.03)+'s"><span class="k-n">'+H.md(it.name)+'</span><span class="k-when">'+H.esc(it.when||"")+'</span><span class="k-g">'+H.esc(it.group)+'</span>'+
          '<span class="k-more"><span>'+H.md(it.d||"")+'</span>'+(it.ref?'<small>'+H.esc(it.ref)+'</small>':'')+(it.verdict?'<small>Verdict: '+VERDICT[it.verdict]+'</small>':'')+'</span></button>';
      }).join("")+'</div></div>';
  },
  wire: function(el){
    el.querySelectorAll(".k-filters .chip").forEach(function(c){ c.onclick = function(){
      el.querySelectorAll(".k-filters .chip").forEach(function(x){ x.classList.toggle("on", x === c); });
      el.querySelectorAll(".k-row").forEach(function(r){ r.hidden = !!c.dataset.g && r.dataset.g !== c.dataset.g; });
    }; });
    el.querySelectorAll(".k-row").forEach(function(r){ r.onclick = function(){ r.classList.toggle("open"); }; });
  }
};

/* ---------- STEPPER: one step at a time, animated ---------- */
X.stepper = {
  render: function(k, H){
    return H.title(k, H.I.diagram)+'<div class="stepper" data-k="'+J(k)+'"><div class="st-track"><div class="st-fill"></div></div><div class="st-dots">'+
      k.items.map(function(_, i){ return '<button class="st-dot'+(i?"":" on")+'" data-i="'+i+'" aria-label="Step '+(i+1)+'">'+(i+1)+'</button>'; }).join("")+'</div>'+
      '<div class="st-stage" aria-live="polite"></div><div class="st-nav"><button class="btn ghost small st-prev">Back</button><button class="btn small st-next">Next step</button></div></div>';
  },
  wire: function(el, H){
    var k = rd(el), i = 0, stage = el.querySelector(".st-stage"), dir = 1;
    function go(n){
      dir = n >= i ? 1 : -1; i = Math.max(0, Math.min(k.items.length-1, n)); var it = k.items[i];
      stage.innerHTML = '<div class="st-card"><span class="st-num">Step '+(i+1)+' of '+k.items.length+'</span><h4>'+H.md(it.h)+'</h4><p>'+H.md(it.d||"")+'</p>'+(it.why?'<p class="st-why"><strong>Why: </strong>'+H.md(it.why)+'</p>':'')+(it.christ?'<p class="st-christ"><strong>Pointing to Jesus: </strong>'+H.md(it.christ)+'</p>':'')+(it.ref?'<small>'+H.esc(it.ref)+'</small>':'')+'</div>';
      var card = stage.firstChild; if (card.animate && !reduce) card.animate([{opacity:0, transform:"translateX("+(dir*30)+"px)"},{opacity:1, transform:"none"}], {duration:350, easing:"ease-out"});
      el.querySelectorAll(".st-dot").forEach(function(d){ d.classList.toggle("on", +d.dataset.i <= i); });
      el.querySelector(".st-fill").style.width = (k.items.length > 1 ? i/(k.items.length-1)*100 : 100) + "%";
      el.querySelector(".st-prev").disabled = i === 0; el.querySelector(".st-next").textContent = i === k.items.length-1 ? "Start again" : "Next step";
    }
    el.querySelector(".st-prev").onclick = function(){ go(i-1); };
    el.querySelector(".st-next").onclick = function(){ go(i === k.items.length-1 ? 0 : i+1); };
    el.querySelectorAll(".st-dot").forEach(function(d){ d.onclick = function(){ go(+d.dataset.i); }; });
    go(0);
  }
};

/* ---------- ACCORDION: expandable detail ---------- */
X.accordion = {
  render: function(k, H){
    return H.title(k, H.I.bulb)+'<div class="acc">'+k.items.map(function(it){ return '<details><summary>'+H.md(it.h)+'</summary><div>'+H.md(it.d||"").split(/\n\n/).map(function(p){ return '<p>'+p+'</p>'; }).join("")+(it.ref?'<small>'+H.esc(it.ref)+'</small>':'')+'</div></details>'; }).join("")+'</div>';
  }
};
})();
