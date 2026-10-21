(function(){
"use strict";
var BOOKS = window.BOOKS || [];
var $ = function(s, r){ return (r||document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };
var app = $("#app");

/* ---------- storage (best effort) ---------- */
var store = {
  get: function(k, d){ try{ var v = localStorage.getItem("roots:"+k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set: function(k, v){ try{ localStorage.setItem("roots:"+k, JSON.stringify(v)); }catch(e){} }
};

/* ---------- icons ---------- */
var I = {
  palette:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A2 2 0 0 1 12 22z"/><circle cx="7.5" cy="10.5" r="1.3"/><circle cx="12" cy="7.5" r="1.3"/><circle cx="16.5" cy="10.5" r="1.3"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
  note:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="10"/></svg>',
  arrow:'<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h18m-6-6 6 6-6 6"/></svg>',
  diagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="6" rx="1.5"/><rect x="14" y="15" width="7" height="6" rx="1.5"/><path d="M6.5 9v4a2 2 0 0 0 2 2H14"/></svg>',
  scroll:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a3 3 0 0 1 0 6H6"/><path d="M6 4a3 3 0 0 0 0 6v8a3 3 0 0 0 3 3h9"/><path d="M18 10v8a3 3 0 0 1-3 3"/><path d="M10 14h5M10 17h3"/></svg>',
  calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="12" cy="15.5" r="2.2"/></svg>',
  lamp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v14M5 6v3a7 7 0 0 0 14 0V6M8.5 6v3a3.5 3.5 0 0 0 7 0V6M8 21h8"/><path d="M12 2.5c.8.9.8 1.8 0 2.5-.8-.7-.8-1.6 0-2.5z"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5c3-1.5 7-1.5 10 1 3-2.5 7-2.5 10-1v14c-3-1.5-7-1.5-10 1-3-2.5-7-2.5-10-1z"/><path d="M12 6v14"/></svg>',
  quiz:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5M12 17.5v.5"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="19" cy="12" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M7.5 12h9M7 11l9.6-5M7 13l9.6 5"/></svg>'
};
var BOOK_ICON = { scroll:I.scroll, calendar:I.calendar, lamp:I.lamp, book:I.book };

/* ---------- text helpers ---------- */
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function md(s){ return esc(s).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>"); }
function plain(s){ return String(s||"").replace(/\*/g,""); }
function slug(s){ return plain(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,48); }

/* ---------- theme ---------- */
var SCHEMES = [
  {id:"tekhelet", name:"Tekhelet", c:["#EDF1F7","#2B59C3","#C9A227"]},
  {id:"galilee", name:"Galilee", c:["#E8F4F3","#0F7F82","#D9694C"]},
  {id:"olive", name:"Olive grove", c:["#EFF1E6","#55702A","#B8862B"]},
  {id:"pomegranate", name:"Pomegranate", c:["#FAF1EF","#A3203A","#3F7D5C"]},
  {id:"midnight", name:"Midnight", c:["#0D1B2A","#7FB7FF","#F2C14E"]},
  {id:"menorah", name:"Lamplight", c:["#17140F","#E3B04B","#8FB3E0"]}
];
function applyTheme(){
  var s = store.get("scheme", null);
  if (s) document.documentElement.setAttribute("data-scheme", s); else document.documentElement.removeAttribute("data-scheme");
  document.documentElement.style.setProperty("--fs", store.get("fs", 17) + "px");
  var meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", getComputedStyle(document.body).getPropertyValue("--bg").trim() || "#EDF1F7");
}

/* ---------- progress ---------- */
function done(){ return store.get("done", {}); }
function markDone(key){ var d = done(); d[key] = 1; store.set("done", d); }
function bookPct(b){ var d = done(), n = 0; b.chapters.forEach(function(c){ if (d[b.id+"/"+c.id]) n++; }); return Math.round(100*n/Math.max(1,b.chapters.length)); }

/* ---------- shell ---------- */
function shell(){
  document.body.insertAdjacentHTML("afterbegin",
    '<div class="progressline" id="pl"></div>'+
    '<header class="bar">'+
      '<a class="brand" href="#/" aria-label="Home">'+
        '<svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--accent)"/><path d="M20 11v19M10 13v4a10 10 0 0 0 20 0v-4M15 13v4a5 5 0 0 0 10 0v-4M14 31h12" stroke="var(--accent-ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>'+
        '<span>Roots &amp; Branches</span></a>'+
      '<button class="iconbtn" id="b-search" aria-label="Search">'+I.search+'<span class="lbl">Search</span></button>'+
      '<button class="iconbtn" id="b-theme" aria-label="Colours and text size">'+I.palette+'<span class="lbl">Colours</span></button>'+
      '<button class="iconbtn" id="b-dl" aria-label="Download the app">'+I.download+'<span class="lbl">Download</span></button>'+
    '</header>'+
    '<div class="sheet" id="s-theme" role="dialog" aria-label="Colours and text size"><div class="scrim"></div><div class="panel">'+
      '<h3>Colour scheme</h3><div class="swatches" id="swatches"></div>'+
      '<h3>Text size</h3><div class="row"><div class="seg" id="fsseg"></div></div>'+
      '<p style="margin-top:16px;color:var(--muted);font-size:.85rem">Your choices are remembered on this device.</p>'+
    '</div></div>'+
    '<div class="sheet" id="s-search" role="dialog" aria-label="Search"><div class="scrim"></div><div class="panel">'+
      '<input class="search-input" id="q" type="search" placeholder="Search every chapter, e.g. Passover, Shema, seven seals" autocomplete="off">'+
      '<div class="results" id="results"></div>'+
    '</div></div>'+
    '<div class="toast" id="toast" role="status"></div>');
  document.body.insertAdjacentHTML("beforeend", '<footer>A study companion on the Jewish roots of the Christian faith. Works offline once downloaded.</footer>');

  $("#swatches").innerHTML = SCHEMES.map(function(s){
    return '<button class="swatch" data-s="'+s.id+'"><span class="dots">'+s.c.map(function(c){return '<i style="background:'+c+'"></i>';}).join("")+'</span>'+s.name+'</button>';
  }).join("");
  $("#fsseg").innerHTML = [[15,"Small"],[17,"Medium"],[19,"Large"],[21,"Huge"]].map(function(f){ return '<button data-fs="'+f[0]+'">'+f[1]+'</button>'; }).join("");
  function syncTheme(){
    var cur = store.get("scheme", null) || (matchMedia("(prefers-color-scheme: dark)").matches ? "midnight" : "tekhelet");
    $$("#swatches .swatch").forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.s === cur); });
    $$("#fsseg button").forEach(function(b){ b.setAttribute("aria-pressed", +b.dataset.fs === store.get("fs",17)); });
  }
  $("#swatches").addEventListener("click", function(e){ var b = e.target.closest(".swatch"); if(!b) return; store.set("scheme", b.dataset.s); applyTheme(); syncTheme(); });
  $("#fsseg").addEventListener("click", function(e){ var b = e.target.closest("button"); if(!b) return; store.set("fs", +b.dataset.fs); applyTheme(); syncTheme(); });
  function openSheet(id){ $("#"+id).classList.add("open"); syncTheme(); if (id==="s-search") setTimeout(function(){ $("#q").focus(); }, 50); }
  function closeSheets(){ $$(".sheet").forEach(function(s){ s.classList.remove("open"); }); }
  $("#b-theme").onclick = function(){ openSheet("s-theme"); };
  $("#b-search").onclick = function(){ openSheet("s-search"); };
  $$(".sheet .scrim").forEach(function(s){ s.onclick = closeSheets; });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") closeSheets();
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)){ e.preventDefault(); openSheet("s-search"); }
  });
  $("#results").addEventListener("click", function(e){ if (e.target.closest("a")) closeSheets(); });
  $("#q").addEventListener("input", function(){ search(this.value); });
  $("#b-dl").onclick = download;
  window.addEventListener("scroll", function(){
    var h = document.documentElement; var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    $("#pl").style.width = (p*100) + "%";
  }, {passive:true});
}

function toast(msg){ var t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(function(){ t.classList.remove("show"); }, 2600); }

/* ---------- download: saves this whole app as one offline file ---------- */
var PRISTINE = null;
function download(){
  var html = "<!DOCTYPE html>\n" + PRISTINE, name = "roots-and-branches.html";
  var hosted = window.claude && typeof window.claude.use === "function";
  if (hosted){
    toast("Preparing your download\u2026");
    window.claude.use("downloads").then(function(dl){
      if (!dl) return toast("Downloads aren\u2019t available in this view. Open the app in a browser to save it.");
      return dl.save({filename:name, data:new Blob([html], {type:"text/html"})}).then(function(){
        toast("Saved " + name + ". Open it on any device, even offline.");
      }, function(e){ if (e && e.code !== "declined") toast("The file wasn\u2019t saved. Try again in a moment."); });
    });
    return;
  }
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([html], {type:"text/html"})); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
  toast("Saved " + name + ". Open it on any device, even offline.");
}

/* ---------- search ---------- */
var INDEX = [];
function buildIndex(){
  BOOKS.forEach(function(b){ b.chapters.forEach(function(c){
    var parts = [c.title, c.summary];
    (c.sections||[]).forEach(function(s){ parts.push(s.h); (s.blocks||[]).forEach(function(k){ parts.push(blockText(k)); }); });
    (c.keypoints||[]).forEach(function(k){ parts.push(k); });
    INDEX.push({b:b, c:c, text: plain(parts.join(" • "))});
  }); });
}
function blockText(k){
  var out = [];
  (function walk(o){ if (o == null) return; if (typeof o === "string") out.push(o); else if (Array.isArray(o)) o.forEach(walk); else if (typeof o === "object") Object.keys(o).forEach(function(key){ if (key !== "t" && key !== "kind") walk(o[key]); }); })(k);
  return out.join(" ");
}
function search(q){
  q = q.trim(); var r = $("#results");
  if (q.length < 2){ r.innerHTML = '<p style="color:var(--muted);font-size:.9rem;margin:6px 4px">Type at least two letters.</p>'; return; }
  var ql = q.toLowerCase(), hits = [];
  INDEX.forEach(function(it){
    var i = it.text.toLowerCase().indexOf(ql); if (i < 0) return;
    var s = Math.max(0, i-60), snip = it.text.slice(s, i+q.length+80);
    hits.push('<a href="#/'+it.b.id+'/'+it.c.id+'"><b>'+esc(it.c.title)+'</b><small>'+esc(it.b.short)+'</small><small>…'+esc(snip).replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"ig"), function(m){return "<mark>"+m+"</mark>";})+'…</small></a>');
  });
  r.innerHTML = hits.length ? hits.slice(0,30).join("") : '<p style="color:var(--muted);font-size:.9rem;margin:6px 4px">No chapter mentions “'+esc(q)+'”. Try a shorter word.</p>';
}

/* ---------- block renderers ---------- */
function title(k, icon){ return k.title ? '<div class="blk-title">'+(icon||I.diagram)+md(k.title)+'</div>' : ""; }
var R = {
  p: function(k){ return '<p>'+md(k.text)+'</p>'; },
  list: function(k){ return title(k, I.bulb)+'<ul>'+k.items.map(function(i){ return '<li>'+md(i)+'</li>'; }).join("")+'</ul>'; },
  callout: function(k){ var kind = k.kind || "insight"; return '<div class="callout '+kind+'">'+(kind==="insight"?I.bulb:I.note)+'<div>'+(k.title?'<b>'+md(k.title)+'</b>':"")+'<p>'+md(k.text)+'</p></div></div>'; },
  quote: function(k){ return '<blockquote class="quote">'+md(k.text)+(k.ref?'<cite>'+esc(k.ref)+'</cite>':"")+'</blockquote>'; },
  term: function(k){ return '<div class="term"><div><span class="w">'+esc(k.word)+'</span>'+(k.heb?'<span class="heb">'+esc(k.heb)+'</span>':"")+'</div><div><p class="m">'+md(k.meaning)+'</p>'+(k.lang?'<small>'+esc(k.lang)+'</small>':"")+'</div></div>'; },
  flow: function(k){
    return title(k)+'<div class="flow">'+k.nodes.map(function(n, i){
      var h = typeof n === "string" ? md(n) : md(n.h) + (n.d ? '<small>'+md(n.d)+'</small>' : "");
      return (i ? '<div class="arrow" aria-hidden="true">'+I.arrow+'</div>' : "") + '<div class="node">'+h+'</div>';
    }).join("")+'</div>';
  },
  steps: function(k){ return title(k)+'<div class="steps"><div class="fill"></div>'+k.items.map(function(s, i){ return '<div class="step"><span class="dot">'+(i+1)+'</span><b>'+md(s.h)+'</b>'+(s.d?'<p>'+md(s.d)+'</p>':"")+'</div>'; }).join("")+'</div>'; },
  compare: function(k){ return title(k)+'<div class="compare" style="--cols:'+k.cols.length+'">'+k.cols.map(function(c){ return '<div class="col"><h4>'+md(c.h)+'</h4><ul>'+c.items.map(function(i){return '<li>'+md(i)+'</li>';}).join("")+'</ul></div>'; }).join("")+'</div>'; },
  timeline: function(k){ return title(k)+'<div class="timeline">'+k.items.map(function(t){ return '<div class="tl">'+(t.when?'<span class="when">'+esc(t.when)+'</span>':"")+'<b>'+md(t.h)+'</b>'+(t.d?'<p>'+md(t.d)+'</p>':"")+'</div>'; }).join("")+'</div>'; },
  cards: function(k){ return title(k)+'<div class="cards">'+k.items.map(function(c){ return '<div class="card"><b>'+md(c.h)+'</b><p>'+md(c.d||"")+'</p></div>'; }).join("")+'</div>'; },
  table: function(k){ return title(k)+'<div class="tbl"><table><thead><tr>'+k.head.map(function(h){return '<th>'+md(h)+'</th>';}).join("")+'</tr></thead><tbody>'+k.rows.map(function(r){ return '<tr>'+r.map(function(c){return '<td>'+md(c)+'</td>';}).join("")+'</tr>'; }).join("")+'</tbody></table></div>'; },
  flip: function(k){ return title(k, I.quiz)+'<div class="flips">'+k.items.map(function(f){ return '<button class="flip" aria-pressed="false"><span class="inner"><span class="face front">'+md(f.front)+'<small>Tap to reveal</small></span><span class="face back">'+md(f.back)+'</span></span></button>'; }).join("")+'</div>'; },
  tree: function(k){
    function kids(arr){ return arr && arr.length ? '<ul>'+arr.map(function(n){ if (typeof n === "string") n = {h:n}; return '<li><span class="tn">'+md(n.h)+(n.d?'<small>'+md(n.d)+'</small>':"")+'</span>'+kids(n.children)+'</li>'; }).join("")+'</ul>' : ""; }
    return title(k, I.map)+'<div class="tree"><span class="troot">'+md(k.root)+'</span>'+kids(k.children)+'</div>';
  },
  cycle: function(k){
    var n = k.items.length, uid = "cy"+Math.random().toString(36).slice(2,7);
    var nodes = k.items.map(function(it, i){
      var a = -Math.PI/2 + i*2*Math.PI/n, x = 50 + 35*Math.cos(a), y = 50 + 36*Math.sin(a);
      return '<button class="cnode" style="left:'+x.toFixed(2)+'%;top:'+y.toFixed(2)+'%" data-i="'+i+'" aria-pressed="false">'+md(it.h)+'</button>';
    }).join("");
    return title(k)+'<div class="cycle" id="'+uid+'" data-items="'+esc(JSON.stringify(k.items))+'"><svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true"><circle class="ring-path" cx="50" cy="50" r="35.5"/></svg>'+nodes+'<div class="center"><b>'+md(k.center||"Tap a circle")+'</b><span>'+md(k.hint||"Each one opens its meaning here.")+'</span></div></div>';
  }
};
function renderBlock(k){
  var f = R[k.t]; if (!f) return "";
  var cls = k.t === "p" ? "" : " reveal";
  return k.t === "p" ? f(k) : '<div class="blk'+cls+'">'+f(k)+'</div>';
}

/* ---------- interactions inside content ---------- */
var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function(es){
  es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
}, {rootMargin:"0px 0px -8% 0px"}) : null;
function wire(root){
  $$(".reveal", root).forEach(function(el){ if (io) io.observe(el); else el.classList.add("in"); });
  $$(".flip", root).forEach(function(b){ b.onclick = function(){ b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"); }; });
  $$(".cycle", root).forEach(function(c){
    var items = JSON.parse(c.dataset.items), center = $(".center", c);
    c.addEventListener("click", function(e){
      var b = e.target.closest(".cnode"); if (!b) return;
      $$(".cnode", c).forEach(function(x){ x.setAttribute("aria-pressed", x === b); });
      var it = items[+b.dataset.i];
      center.innerHTML = '<b>'+md(it.h)+'</b><span>'+md(it.d||"")+'</span>';
      center.animate && center.animate([{opacity:0, transform:"translate(-50%,-46%)"},{opacity:1, transform:"translate(-50%,-50%)"}], {duration:350, easing:"ease-out"});
    });
  });
}

/* ---------- views ---------- */
function menorahSVG(){
  var xs = [40, 80, 120, 160, 200, 240, 280], out = "";
  // arms
  [[1,5],[2,4],[3,3]].forEach(function(p, i){
    var l = xs[p[0]-1], r = xs[7-p[0]], depth = 150 - i*45;
    out += '<path class="stem" style="animation-delay:'+(.2+i*.15)+'s" d="M'+l+' 110 v20 a'+((160-l))+' '+depth*0.6+' 0 0 0 '+(r-l)+' 0 v-20"/>';
  });
  out += '<path class="stem" d="M160 110 v200"/>';
  out += '<path class="base" d="M110 330 h100 l-14 -20 h-72 z" />';
  xs.forEach(function(x, i){
    var d = 1.2 + Math.abs(i-3)*.18;
    out += '<ellipse class="glow" cx="'+x+'" cy="86" rx="16" ry="20" style="animation-delay:'+d+'s"/>';
    out += '<rect class="cup" x="'+(x-11)+'" y="100" width="22" height="10" rx="3"/>';
    out += '<path class="flame" style="animation-delay:'+d+'s, '+(d+.5)+'s" d="M'+x+' 64 C '+(x+12)+' 80 '+(x+10)+' 96 '+x+' 98 C '+(x-10)+' 96 '+(x-12)+' 80 '+x+' 64 Z"/>';
  });
  return '<svg class="menorah" viewBox="0 0 320 350" role="img" aria-label="A seven-branched lampstand lighting up">'+out+'</svg>';
}

function viewHome(){
  var total = 0; BOOKS.forEach(function(b){ total += b.chapters.length; });
  var h = '<section class="wrap hero">'+
    '<div><h1>Read the Bible with first-century Jewish eyes.</h1>'+
    '<p class="lead">Three studies in one place: how Jesus taught as a Jewish rabbi, what Israel’s feasts reveal about him, and how the book of Revelation reads to someone steeped in the Hebrew Scriptures. '+total+' chapters, each with diagrams, flashcards and a short quiz.</p>'+
    '<div class="cta"><a class="btn" href="#/'+(BOOKS[0]?BOOKS[0].id:"")+'">Start reading</a><a class="btn ghost" href="#/glossary">Browse the glossary</a></div></div>'+
    menorahSVG()+'</section>'+
    '<section class="wrap"><div class="sectionhead"><h2>Choose a study</h2></div><div class="books">'+
    BOOKS.map(function(b){
      var p = bookPct(b);
      return '<a class="book" href="#/'+b.id+'" style="--bk:'+b.color+'"><span class="stripe"></span>'+
        '<span class="glyph">'+(BOOK_ICON[b.icon]||I.book)+'</span><h3>'+esc(b.title)+'</h3><p>'+md(b.tagline)+'</p>'+
        '<div class="meta"><span class="ring" style="--p:'+p+'">'+p+'%</span><span>'+b.chapters.length+' chapters</span></div></a>';
    }).join("")+'</div>'+
    '<div class="sectionhead"><h2>Study tools</h2></div><div class="tools">'+
      '<a class="tool" href="#/glossary">'+I.book+'<b>Glossary</b><span>Every Hebrew and Greek word explained in plain English.</span></a>'+
      '<a class="tool" href="#/maps">'+I.map+'<b>Big-picture maps</b><span>The skeleton of each study on one screen.</span></a>'+
      '<a class="tool" href="#/cards">'+I.quiz+'<b>Flashcards</b><span>Flip cards from every chapter to test your memory.</span></a>'+
      '<a class="tool" href="#/'+(BOOKS[1]?BOOKS[1].id:"")+'">'+I.calendar+'<b>Feast calendar</b><span>The yearly cycle of Israel’s appointed times.</span></a>'+
    '</div></section>';
  return h;
}

function mindmap(b, animate){
  return '<div class="mindmap"><div class="mm'+(animate?' mm-anim':'')+'"><div class="mm-root">'+esc(b.title)+'</div><div class="mm-branches"><span class="rail"></span>'+
    b.chapters.map(function(c, i){
      return '<div class="mm-branch" style="animation-delay:'+(i*0.06)+'s"><a class="mm-node" href="#/'+b.id+'/'+c.id+'">'+esc(c.title)+'</a><div class="mm-leaves">'+
        (c.sections||[]).map(function(s){ return '<span class="mm-leaf">'+esc(plain(s.h))+'</span>'; }).join("")+'</div></div>';
    }).join("")+'</div></div></div>';
}

function viewBook(b, tab){
  tab = tab || "chapters";
  var d = done();
  var h = '<section class="wrap bookhead" style="--bk:'+b.color+'"><div class="crumbs"><a href="#/">Home</a> / '+esc(b.short)+'</div>'+
    '<h1>'+esc(b.title)+'</h1><p class="lead">'+md(b.intro || b.tagline)+'</p></section>'+
    '<section class="wrap"><div class="tabs" role="tablist">'+
      [["chapters","Chapters"],["map","Big-picture map"],["overview","Overview"]].map(function(t){ return '<button role="tab" data-tab="'+t[0]+'" aria-selected="'+(t[0]===tab)+'">'+t[1]+'</button>'; }).join("")+
    '</div><div id="tabbody">';
  if (tab === "chapters"){
    h += '<div class="chapters">'+b.chapters.map(function(c, i){
      return '<a class="chap'+(d[b.id+"/"+c.id]?" done":"")+'" href="#/'+b.id+'/'+c.id+'"><span class="n">'+(i+1)+'</span><span><h3>'+esc(c.title)+'</h3><p>'+md(c.summary)+'</p></span></a>';
    }).join("")+'</div>';
  } else if (tab === "map"){
    h += mindmap(b, true);
  } else {
    h += '<article class="chapter" style="padding-bottom:48px">'+(b.overview||[]).map(renderBlock).join("")+'</article>';
  }
  h += '</div></section>';
  return h;
}

function viewChapter(b, c){
  var idx = b.chapters.indexOf(c), prev = b.chapters[idx-1], next = b.chapters[idx+1];
  var secs = c.sections || [];
  var toc = '<nav class="toc" id="toc" aria-label="In this chapter"><h4>In this chapter</h4>'+
    secs.map(function(s, i){ return '<a href="#/'+b.id+'/'+c.id+'/'+slug(s.h)+'" data-sec="'+slug(s.h)+'">'+esc(plain(s.h))+'</a>'; }).join("")+
    (c.keypoints?'<a href="#/'+b.id+'/'+c.id+'/key-points" data-sec="key-points">Key points</a>':"")+
    (c.quiz?'<a href="#/'+b.id+'/'+c.id+'/quiz" data-sec="quiz">Quiz</a>':"")+
    '<details><summary>All chapters</summary><div class="chlist">'+b.chapters.map(function(x, i){ return '<a href="#/'+b.id+'/'+x.id+'"'+(x===c?' class="on"':'')+'>'+(i+1)+'. '+esc(x.title)+'</a>'; }).join("")+'</div></details></nav>';
  var art = '<article class="chapter"><div class="crumbs"><a href="#/">Home</a> / <a href="#/'+b.id+'">'+esc(b.short)+'</a> / Chapter '+(idx+1)+'</div>'+
    '<h1>'+esc(c.title)+'</h1><p class="summary">'+md(c.summary)+'</p>';
  secs.forEach(function(s, i){
    art += '<h2 id="'+slug(s.h)+'"><span class="hn">'+(i+1)+'</span>'+md(s.h)+'</h2>' + (s.blocks||[]).map(renderBlock).join("");
  });
  if (c.keypoints) art += '<section class="keypoints reveal"><h2 id="key-points">Key points to remember</h2><ol>'+c.keypoints.map(function(k){ return '<li>'+md(k)+'</li>'; }).join("")+'</ol></section>';
  if (c.quiz) art += '<section class="quiz"><h2 id="quiz">Check your understanding</h2>'+c.quiz.map(function(q, qi){
      return '<div class="q" data-a="'+q.answer+'"><b>'+(qi+1)+'. '+md(q.q)+'</b><div class="opts">'+q.options.map(function(o, oi){ return '<button class="opt" data-i="'+oi+'">'+md(o)+'</button>'; }).join("")+'</div><div class="why" hidden>'+md(q.why||"")+'</div></div>';
    }).join("")+'<p class="score" id="score"></p></section>';
  art += '<div class="chapnav">'+(prev?'<a href="#/'+b.id+'/'+prev.id+'"><small>Previous</small>'+esc(prev.title)+'</a>':'<span></span>')+
    (next?'<a class="next" href="#/'+b.id+'/'+next.id+'"><small>Next</small>'+esc(next.title)+'</a>':'<a class="next" href="#/'+b.id+'"><small>Finished</small>Back to the chapter list</a>')+'</div></article>';
  return '<div class="wrap reader">'+toc+art+'</div><button class="iconbtn tocbtn" id="tocbtn">'+I.menu+' Contents</button>';
}

function allTerms(){
  var seen = {}, list = [];
  BOOKS.forEach(function(b){ b.chapters.forEach(function(c){ (c.sections||[]).forEach(function(s){ (s.blocks||[]).forEach(function(k){
    if (k.t === "term"){ var key = k.word.toLowerCase(); if (!seen[key]){ seen[key] = 1; list.push({k:k, b:b, c:c}); } }
  }); }); }); });
  (window.EXTRA_TERMS||[]).forEach(function(k){ var key = k.word.toLowerCase(); if (!seen[key]){ seen[key]=1; list.push({k:k}); } });
  return list.sort(function(a, b){ return a.k.word.localeCompare(b.k.word); });
}
function viewGlossary(letter){
  var list = allTerms();
  var letters = []; list.forEach(function(t){ var L = t.k.word[0].toUpperCase(); if (letters.indexOf(L) < 0) letters.push(L); });
  var shown = letter ? list.filter(function(t){ return t.k.word[0].toUpperCase() === letter; }) : list;
  return '<section class="wrap bookhead"><div class="crumbs"><a href="#/">Home</a> / Glossary</div><h1>Glossary</h1><p class="lead">'+list.length+' words from the three studies, with what they mean and where they appear.</p></section>'+
    '<section class="wrap"><div class="letters"><button data-l="" aria-pressed="'+(!letter)+'">All</button>'+letters.map(function(L){ return '<button data-l="'+L+'" aria-pressed="'+(L===letter)+'">'+L+'</button>'; }).join("")+'</div>'+
    '<div class="gloss">'+shown.map(function(t){
      return '<div class="term"><div><span class="w">'+esc(t.k.word)+'</span>'+(t.k.heb?'<span class="heb">'+esc(t.k.heb)+'</span>':"")+'</div><div><p class="m">'+md(t.k.meaning)+'</p>'+(t.c?'<small><a href="#/'+t.b.id+'/'+t.c.id+'">'+esc(t.c.title)+'</a></small>':"")+'</div></div>';
    }).join("")+'</div></section>';
}
function viewMaps(){
  return '<section class="wrap bookhead"><div class="crumbs"><a href="#/">Home</a> / Big-picture maps</div><h1>Big-picture maps</h1><p class="lead">The skeleton of each study: every chapter and the topics inside it. Tap a chapter to open it.</p></section>'+
    '<section class="wrap">'+BOOKS.map(function(b){ return '<h2 style="margin-top:24px">'+esc(b.title)+'</h2>'+mindmap(b, true); }).join("")+'</section>';
}
function viewCards(){
  var cards = [];
  BOOKS.forEach(function(b){ b.chapters.forEach(function(c){ (c.sections||[]).forEach(function(s){ (s.blocks||[]).forEach(function(k){ if (k.t==="flip") k.items.forEach(function(f){ cards.push({f:f, b:b}); }); }); }); }); });
  for (var i = cards.length-1; i > 0; i--){ var j = Math.floor(Math.random()*(i+1)); var t = cards[i]; cards[i] = cards[j]; cards[j] = t; }
  return '<section class="wrap bookhead"><div class="crumbs"><a href="#/">Home</a> / Flashcards</div><h1>Flashcards</h1><p class="lead">'+cards.length+' cards, shuffled each visit. Say the answer out loud, then tap to check.</p></section>'+
    '<section class="wrap" style="padding-bottom:48px"><div class="blk in">'+R.flip({items:cards.map(function(x){ return x.f; })})+'</div></section>';
}

/* ---------- router ---------- */
function find(id){ for (var i = 0; i < BOOKS.length; i++) if (BOOKS[i].id === id) return BOOKS[i]; }
var lastKey = "";
function route(){
  var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  var key = parts.slice(0,2).join("/"), html, b, c, after = null;
  if (!parts.length) html = viewHome();
  else if (parts[0] === "glossary") html = viewGlossary(parts[1]||"");
  else if (parts[0] === "maps") html = viewMaps();
  else if (parts[0] === "cards") html = viewCards();
  else if ((b = find(parts[0]))){
    if (parts[1] && parts[1].indexOf("tab-") === 0) html = viewBook(b, parts[1].slice(4));
    else if (parts[1]){ c = b.chapters.filter(function(x){ return x.id === parts[1]; })[0]; html = c ? viewChapter(b, c) : viewBook(b); }
    else html = viewBook(b);
  } else html = viewHome();

  // same chapter, only a section anchor changed
  if (c && key === lastKey && parts[2]){ scrollToSec(parts[2]); return; }
  lastKey = key;

  var show = function(){
    app.innerHTML = html; app.classList.remove("page-enter"); void app.offsetWidth; app.classList.add("page-enter");
    wire(app); bindView(b, c);
    if (parts[2]) scrollToSec(parts[2]); else window.scrollTo(0, 0);
    document.title = (c ? c.title + " – " : b ? b.short + " – " : "") + "Roots & Branches";
  };
  if (c){
    app.innerHTML = '<div class="wrap"><div class="skel" aria-hidden="true"><i class="h"></i><i></i><i style="width:85%"></i><i class="box"></i><i></i><i style="width:70%"></i></div></div>';
    setTimeout(show, 260);
  } else show();
}
function scrollToSec(id){ var el = document.getElementById(id); if (el) el.scrollIntoView({behavior:"smooth", block:"start"}); var t = $("#toc"); if (t) t.classList.remove("open"); }

function bindView(b, c){
  $$(".tabs button").forEach(function(t){ t.onclick = function(){ location.hash = "#/"+b.id+"/tab-"+t.dataset.tab; }; });
  $$(".letters button").forEach(function(t){ t.onclick = function(){ location.hash = "#/glossary" + (t.dataset.l ? "/"+t.dataset.l : ""); }; });
  if (!c) return;
  var tb = $("#tocbtn"); if (tb) tb.onclick = function(){ $("#toc").classList.toggle("open"); };
  // quiz
  var answered = 0, right = 0, total = $$(".q").length;
  $$(".q").forEach(function(q){
    var a = +q.dataset.a;
    $$(".opt", q).forEach(function(o){ o.onclick = function(){
      $$(".opt", q).forEach(function(x){ x.disabled = true; });
      $$(".opt", q)[a].classList.add("right");
      if (+o.dataset.i !== a) o.classList.add("wrong"); else right++;
      $(".why", q).hidden = false; answered++;
      if (answered === total){
        $("#score").textContent = "You got " + right + " of " + total + " right." + (right === total ? " Chapter marked as complete." : " Review the key points and try again any time.");
        if (right === total) markDone(b.id+"/"+c.id);
      }
    }; });
  });
  // mark complete when reaching the end
  var end = $(".chapnav");
  if (end && "IntersectionObserver" in window){
    var o = new IntersectionObserver(function(es){ if (es[0].isIntersecting){ markDone(b.id+"/"+c.id); o.disconnect(); } });
    o.observe(end);
  }
  // scrollspy
  var heads = $$("article.chapter h2[id]");
  if ("IntersectionObserver" in window){
    var spy = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){
      $$(".toc a[data-sec]").forEach(function(a){ a.classList.toggle("on", a.dataset.sec === e.target.id); });
    } }); }, {rootMargin:"-10% 0px -80% 0px"});
    heads.forEach(function(h){ spy.observe(h); });
  }
}

/* ---------- boot ---------- */
PRISTINE = (function(){
  var h = "", b = "";
  $$("[data-app]").forEach(function(el){ if (el.tagName === "SCRIPT") b += el.outerHTML + "\n"; else h += el.outerHTML + "\n"; });
  return '<html lang="en">\n<head>\n<meta charset="utf-8">\n' + h + '</head>\n<body>\n<main id="app"></main>\n' + b + '</body>\n</html>';
})();
applyTheme(); shell(); buildIndex();
window.addEventListener("hashchange", route);
route();
})();
