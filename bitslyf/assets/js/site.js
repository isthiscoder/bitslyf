(function(){
  var entries = Array.prototype.slice.call(document.querySelectorAll(".entry"));
  var q = document.getElementById("q");
  var empty = document.getElementById("empty");
  var rules = document.getElementById("rules");
  var standfirst = document.getElementById("standfirst");
  var heading = document.getElementById("filterhead");
  var links = Array.prototype.slice.call(document.querySelectorAll("nav a"));
  var kinds = ["analysis","research","prediction","thesis"];
  var kind = "all";

  var titles = {
    analysis:"Analysis",
    research:"Research",
    prediction:"Predictions",
    thesis:"Thesis"
  };
  var blurbs = {
    analysis:"How industries actually work — the workflow underneath, and the impact it creates. Published weekly.",
    research:"One variable moved, assumptions on the table: how an industry could change its impact by changing the workflow.",
    prediction:"Every call made here, with its confidence, its resolution date and how it turned out. Resolutions are appended, never written over the claim.",
    thesis:"Industries and workflows designed from scratch, with the impact measured rather than asserted."
  };

  function render(){
    var term = q ? q.value.trim().toLowerCase() : "";
    var shown = 0;
    entries.forEach(function(el){
      var okKind = (kind === "all") || (el.dataset.kind === kind);
      var okTerm = !term || el.dataset.text.indexOf(term) !== -1;
      var vis = okKind && okTerm;
      el.hidden = !vis;
      if(vis){ shown++; }
    });
    empty.hidden = shown !== 0;
    rules.hidden = kind !== "prediction";
    standfirst.hidden = kind !== "all";
    heading.hidden = kind === "all";
    if(kind !== "all"){
      heading.querySelector("h1").textContent = titles[kind];
      heading.querySelector("p").textContent = blurbs[kind];
    }
    links.forEach(function(a){
      var h = (a.getAttribute("href") || "").split("#")[1];
      a.setAttribute("aria-current", String(!!h && h === kind));
    });
    document.title = kind === "all" ? "Bitslyf" : titles[kind] + " · Bitslyf";
  }

  function setFromHash(){
    var h = (location.hash || "").slice(1);
    kind = kinds.indexOf(h) !== -1 ? h : "all";
    render();
  }

  window.addEventListener("hashchange", function(){
    setFromHash();
    window.scrollTo(0,0);
  });
  setFromHash();

  if(q){
    q.addEventListener("input", render);
  }

  var form = document.getElementById("subscribe");
  var note = document.getElementById("subnote");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var v = document.getElementById("email").value.trim();
      if(!/^\S+@\S+\.\S+$/.test(v)){
        note.textContent = "That address doesn't look right — check it and try again.";
        return;
      }
      note.textContent = "This form isn't connected yet — point it at your email provider before launch.";
    });
  }
})();
