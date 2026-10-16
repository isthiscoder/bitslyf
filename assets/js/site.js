(function(){
  var entries = Array.prototype.slice.call(document.querySelectorAll(".entry"));
  var q = document.getElementById("q");
  var empty = document.getElementById("empty");

  function render(){
    if(!q){ return; }
    var term = q.value.trim().toLowerCase();
    var shown = 0;
    entries.forEach(function(el){
      var vis = !term || el.dataset.text.indexOf(term) !== -1;
      el.hidden = !vis;
      if(vis){ shown++; }
    });
    if(empty){ empty.hidden = shown !== 0; }
  }

  if(q){ q.addEventListener("input", render); }

})();
