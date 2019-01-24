var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.id = 'main';
svg.style.height = '100%';
svg.style.width = '100%';
document.body.appendChild(svg);


function encode(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
      var img = document.createElementNS("http://www.w3.org/2000/svg", "image");
      img.setAttribute("href", reader.result);
      img.setAttribute("height", 200);
      img.setAttribute("width", 200);
      svg.appendChild(img);
      // console.log('RESULT', reader.result)
    }
    reader.readAsDataURL(file);
  }

var dropbox;

dropbox = document.getElementById("main");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  
function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

function drop(e) {
    e.stopPropagation();
    e.preventDefault();
  
    var dt = e.dataTransfer;
    // var files = dt.files;
  
    encode(dt);
  }