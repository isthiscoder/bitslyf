/* Bitslyf site script: theme switch, header search, subscribe check. */

/* Light / dark switch. Starts from the reader's system setting; their choice is remembered on this device. */
(function(){
  var root=document.documentElement, btn=document.getElementById("theme"), KEY="bitslyf-theme";
  function systemDark(){return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;}
  function current(){var t=root.getAttribute("data-theme"); return t ? t==="dark" : systemDark();}
  function apply(dark){root.setAttribute("data-theme",dark?"dark":"light"); btn.setAttribute("aria-checked",dark?"true":"false");}
  var saved=null; try{saved=localStorage.getItem(KEY);}catch(e){}
  if(saved==="dark"||saved==="light") apply(saved==="dark"); else btn.setAttribute("aria-checked",current()?"true":"false");
  btn.addEventListener("click",function(){var d=!current(); apply(d); try{localStorage.setItem(KEY,d?"dark":"light");}catch(e){}});
})();

/* Header search: looks through /search.json (title, date, tags, type of every entry). */
var ENTRIES=[], loaded=false;
var MONTHS=["january","february","march","april","may","june","july","august","september","october","november","december"];
function dateWords(iso){
  var p=iso.split("-"),y=p[0],m=+p[1],d=+p[2],full=MONTHS[m-1],short=full.slice(0,3);
  return [iso, y+"-"+p[1], y, full, short, d+" "+short, d+" "+full, short+" "+y, full+" "+y, d+" "+short+" "+y, d+" "+full+" "+y, p[2]+"/"+p[1]+"/"+y, d+"/"+m+"/"+y].join(" | ");
}
function fmt(iso){var p=iso.split("-");return +p[2]+" "+MONTHS[+p[1]-1].slice(0,3).replace(/^./,function(c){return c.toUpperCase()})+" "+p[0];}
function prep(list){list.forEach(function(e){e.tags=e.tags||[];e._t=(e.title||"").toLowerCase();e._d=dateWords(e.date);e._g=e.tags.join(" ");e._y=(e.type||"").toLowerCase();});return list;}
function load(cb){
  if(loaded){cb();return;}
  var url=document.querySelector(".search").getAttribute("data-index")||"/search.json";
  fetch(url).then(function(r){return r.json()}).then(function(list){ENTRIES=prep(list);loaded=true;cb();}).catch(function(){loaded=true;cb();});
}

function esc(s){return s.replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]});}
function hi(text,terms){
  var out=esc(text);
  terms.forEach(function(t){ if(t.length<2) return;
    var re=new RegExp("("+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig");
    out=out.replace(re,"<mark>$1</mark>");});
  return out;
}
/* A query is split into terms. Every term must match the title, the date, a tag or the type.
   "#energy" or "tag:energy" only matches tags. A run like "12 oct 2026" or "oct 2026" is read as one date. */
function parse(q){
  q=q.toLowerCase().trim(); var tags=[],words=[],dates=[];
  var dateRe=/\b(\d{1,2}\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(\s+\d{4})?\b|\b\d{4}-\d{2}(-\d{2})?\b|\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;
  q=q.replace(dateRe,function(m){dates.push(m.replace(/\s+/g," ").replace(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/,function(x){return x.slice(0,3)}));return " ";});
  q.split(/\s+/).forEach(function(w){ if(!w) return;
    if(w[0]==="#") {if(w.length>1) tags.push(w.slice(1));}
    else if(w.indexOf("tag:")===0){if(w.length>4) tags.push(w.slice(4));}
    else words.push(w);});
  return {tags:tags,words:words,dates:dates};
}
function search(q){
  var P=parse(q), res=[];
  if(!P.tags.length && !P.words.length && !P.dates.length) return null;
  ENTRIES.forEach(function(e){
    var why={},score=0,ok=true;
    P.tags.forEach(function(t){ var hit=e.tags.filter(function(g){return g.indexOf(t)===0}); if(hit.length){why.tag=1;score+=3}else ok=false;});
    P.dates.forEach(function(d){ if(e._d.indexOf(d)>-1){why.date=1;score+=3}else ok=false;});
    P.words.forEach(function(w){
      if(e._t.indexOf(w)>-1){why.title=1;score+=(e._t.indexOf(w)===0||e._t.indexOf(" "+w)>-1)?3:2;}
      else if(e.tags.some(function(g){return g.indexOf(w)===0})){why.tag=1;score+=2;}
      else if(e._y.indexOf(w)===0){why.type=1;score+=1;}
      else if(e._d.indexOf(w)>-1){why.date=1;score+=2;}
      else ok=false;});
    if(ok) res.push({e:e,score:score,why:Object.keys(why)});
  });
  res.sort(function(a,b){return b.score-a.score||b.e.date.localeCompare(a.e.date)});
  return {P:P,res:res};
}
var q=document.getElementById("q"), box=document.getElementById("results"), sel=-1;
var LABEL={title:"Title",date:"Date",tag:"Tag",type:"Type"};
function help(){
  return '<div class="r-help"><b>Search by title, date or tag</b><ul>'+
    '<li><button type="button" data-q="packaging">packaging</button> words in a title</li>'+
    '<li><button type="button" data-q="oct 2026">oct 2026</button> a month, a day like 12 oct, or 2026-10-12</li>'+
    '<li><button type="button" data-q="#energy">#energy</button> a tag</li>'+
    '<li><button type="button" data-q="#semiconductors prediction">#semiconductors prediction</button> combine them</li></ul></div>';
}
function render(){
  var v=q.value, r=search(v); sel=-1;
  if(!r){ box.innerHTML=help(); }
  else if(!r.res.length){ box.innerHTML='<div class="r-head"><span>No matches</span></div><div class="r-empty">Nothing matches "'+esc(v)+'". Try fewer words, a month like oct 2026, or a tag like #energy.</div>'; }
  else{
    var terms=r.P.words.concat(r.P.tags);
    box.innerHTML='<div class="r-head"><span>'+r.res.length+(r.res.length===1?' result':' results')+'</span><span>↑ ↓ to move · Enter to open</span></div><div class="r-list">'+
      r.res.map(function(x,i){var e=x.e;
        return '<a class="r-item" role="option" id="opt'+i+'" aria-selected="false" href="'+e.url+'">'+
          '<span class="r-title">'+hi(e.title,r.P.words)+'</span><span class="r-type">'+e.type+'</span>'+
          '<span class="r-meta"><span>'+fmt(e.date)+'</span>'+e.tags.map(function(g){return '<span class="r-tag">#'+hi(g,terms)+'</span>'}).join("")+'</span>'+
          '<span class="r-why">Matched on '+x.why.map(function(w){return LABEL[w]}).join(", ").toLowerCase()+'</span></a>';}).join("")+'</div>';
  }
  open(true);
}
function open(on){box.hidden=!on;q.setAttribute("aria-expanded",on?"true":"false");}
function move(d){
  var items=box.querySelectorAll(".r-item"); if(!items.length) return;
  if(sel>-1) items[sel].setAttribute("aria-selected","false");
  sel=(sel+d+items.length)%items.length; items[sel].setAttribute("aria-selected","true");
  items[sel].scrollIntoView({block:"nearest"}); q.setAttribute("aria-activedescendant",items[sel].id);
}
q.addEventListener("input",function(){load(render)});
q.addEventListener("focus",function(){load(render)});
q.addEventListener("keydown",function(e){
  if(e.key==="ArrowDown"){e.preventDefault();move(1);}
  else if(e.key==="ArrowUp"){e.preventDefault();move(-1);}
  else if(e.key==="Enter"){var it=box.querySelectorAll(".r-item")[sel<0?0:sel]; if(it){e.preventDefault(); it.click();}}
  else if(e.key==="Escape"){open(false);q.blur();}
});
box.addEventListener("mousedown",function(e){var b=e.target.closest("button[data-q]"); if(b){e.preventDefault(); q.value=b.dataset.q; render();}});
document.addEventListener("click",function(e){ if(!e.target.closest(".search")) open(false); });

/* Subscribe box: friendly message if the email is not valid. */
(function(){
  var f=document.querySelector(".sub-form"); if(!f) return;
  var em=f.querySelector("input[type=email]"), msg=document.querySelector(".sub-msg");
  f.addEventListener("submit",function(e){
    if(!em.value || !em.checkValidity()){
      e.preventDefault();
      if(msg) msg.textContent="Enter a valid email address, like name@example.com.";
      em.focus();
    }
  });
})();
