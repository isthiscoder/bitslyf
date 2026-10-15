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
