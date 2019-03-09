"use strict";

let resSize = 25;

let onRightBottomEdge = false, onLeftBottomEdge = false, onRightTopEdge = false, onLeftTopEdge = false;

let shift = false;

let minHeight = 50, minWidth = 50;

let shiftX, shiftY, dragElement, elementX, elementY, elementW, elementH, svg, selection, ratio;

let isMoving = false, isResizing = false;



function init()
{
  document.getElementsByClassName("input")[0].style.display = "none";
  document.getElementsByClassName("download-button")[0].style.display = "block";

  selection = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  selection.setAttribute("x", 0);
  selection.setAttribute("y", 0);
  selection.setAttribute("width", 0);
  selection.setAttribute("height", 0);
  svg.appendChild(selection);

  let dropbox;

  dropbox = document.getElementById("main");
  dropbox.addEventListener("dragenter", dragenter, false);
  dropbox.addEventListener("dragover", dragover, false);
  dropbox.addEventListener("drop", drop, false);
}

function save(){

} // let LET

function newFile (){
  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.id = 'main';
  svg.style.height = '100%';
  svg.style.width = '100%';
  document.body.insertBefore(svg, document.body.firstChild);

  init();
}

function uploadFile (event){
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.onload = function() {
    document.body.innerHTML += reader.result;
    svg = document.getElementsByTagName("svg")[0];
    svg.remove;
    svg.id = 'main';
    svg.style.height = '100%';
    svg.style.width = '100%';
    document.body.insertBefore(svg, document.body.firstChild);
    init();
  }
  reader.readAsText(file);
}

function addImage (file, x, y) {
  let reader = new FileReader();
  let svg = document.getElementById("main");

  reader.onloadend = function() {

    let temp = new Image();
    let h = 0, w = 0;
    temp.src = reader.result;
    temp.onload = function() {

        w = temp.width;
        h = temp.height;
        let img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("href", reader.result);
        img.setAttribute("class", "draggable");
        img.setAttribute("height", h);
        img.setAttribute("width", w);
        img.setAttribute("x", x-w/2);
        img.setAttribute("y", y-h/2);
        img.setAttribute("preserveAspectRatio", "none");
        svg.appendChild(img);
    };
  }
  reader.readAsDataURL(file);
}


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
  let dt = e.dataTransfer;
  let file;
  for(let i = 0; file = dt.files[i]; i++){
    addImage(file, e.clientX, e.clientY);
  }
}

document.addEventListener('dragstart', function (event)  {

  event.preventDefault();
})

document.addEventListener('mousemove', (e) => {
  if (isMoving)
    moveAt(e.clientX, e.clientY);
  if (isResizing)
    resize(e.clientX, e.clientY);
})


document.addEventListener('mouseup', (e) => {

  finish();

})

document.addEventListener('mousedown', (e) => {

  dragElement = e.target;

  if (!dragElement)
    return;

  let el = document.getElementsByClassName('selected')[0];
  if (el){
    el.classList.remove("selected");
    deselect();
  }
  if (dragElement.classList.contains("draggable"))
    dragElement.classList.add ("selected");
  else
    return;

  selection.remove();
  svg.appendChild(selection);
  dragElement.remove();
  svg.appendChild(dragElement);

  elementX = Number(dragElement.getAttribute('x'));
  elementY = Number(dragElement.getAttribute('y'));
  elementW = Number(dragElement.getAttribute('width'));
  elementH = Number(dragElement.getAttribute('height'));

  select(dragElement);

  if (edges(e)) {
    startResize(e.clientX, e.clientY);
  }

  else{
    document.body.style.cursor = "move";
    isMoving = true;

    startDrag(e.clientX, e.clientY);
  }

  return false;

})

function select(element){

  selection.setAttribute("x", element.getAttribute("x"));
  selection.setAttribute("y", element.getAttribute("y"));
  selection.setAttribute("width", element.getAttribute("width"));
  selection.setAttribute("height", element.getAttribute("height"));
}

function deselect(){
  selection.setAttribute("x", 0);
  selection.setAttribute("y", 0);
  selection.setAttribute("width", 0);
  selection.setAttribute("height", 0);
}

function edges(e){
  let maxx = elementX + elementW;
  let maxy = elementY + elementH;

  if (e.clientX > maxx - resSize && e.clientY > maxy - resSize){
    isResizing = true;
    onRightBottomEdge = true;
    return isResizing;
  }

  if (e.clientX > maxx - resSize && e.clientY < elementY + resSize){
    isResizing = true;
    onRightTopEdge = true;
    return isResizing;
  }

  if (e.clientX < elementX + resSize && e.clientY > maxy - resSize){
    isResizing = true;
    onLeftBottomEdge = true;
    return isResizing;
  }

  if (e.clientX < elementX + resSize && e.clientY < elementY + resSize){
    isResizing = true;
    onLeftTopEdge = true;
    return isResizing;
  }

  return isResizing;
}

function resize(clientX, clientY) {
  
  let newWidth = clientX - elementX;
  let newHeight = clientY - elementY;
  let newX = elementX;
  let newY = elementY;
  let deltaX = 0;
  let deltaY = 0;

  if (onRightBottomEdge){
    document.body.style.cursor = "se-resize";
  }

  if (onLeftBottomEdge){
    newWidth = elementW - newWidth;
    document.body.style.cursor = "sw-resize";
    newX = clientX;
  }

  if (onRightTopEdge){
    newHeight = elementH - newHeight;
    document.body.style.cursor = "ne-resize";
    newY = clientY;
  }

  if (onLeftTopEdge){
    newWidth = elementW - newWidth;
    newHeight = elementH - newHeight;
    document.body.style.cursor = "nw-resize";
    newX = clientX;
    newY = clientY;
  }

  if (newHeight < minHeight)
    return;
  if (newWidth < minWidth)
    return;

  if(shift){
    if (ratio>newWidth/newHeight){
      if (onLeftTopEdge || onLeftBottomEdge){
        deltaX = newWidth;
        newWidth = newHeight*ratio;
        deltaX = Math.abs(newWidth - deltaX);
      }
      else
        newWidth = newHeight*ratio;
    }
    else{
      if (onLeftTopEdge || onRightTopEdge){
        deltaY = newHeight;
        newHeight = newWidth/ratio;
        deltaY = Math.abs(newHeight - deltaY);
      }
      else
        newHeight = newWidth/ratio;
    }
  }

  dragElement.setAttribute("x", newX - deltaX);
  dragElement.setAttribute("y", newY - deltaY);
  dragElement.setAttribute("width", newWidth);
  dragElement.setAttribute("height", newHeight);

  select(dragElement);
}

function startResize(clientX, clientY) {

  ratio = elementW/elementH;

  resize(clientX, clientY);
};

function startDrag(clientX, clientY) {

  shiftX = clientX - dragElement.getBoundingClientRect().left;
  shiftY = clientY - dragElement.getBoundingClientRect().top;

  moveAt(clientX, clientY);
};

function moveAt(clientX, clientY) {

  let newX = clientX - shiftX;
  let newY = clientY - shiftY;

  dragElement.setAttribute("x", newX);
  dragElement.setAttribute("y", newY);

  select(dragElement);
}

function finish() {

  isMoving = false;
  isResizing = false;
  onLeftBottomEdge = false;
  onLeftTopEdge = false;
  onRightBottomEdge = false;
  onRightTopEdge = false;
  document.body.style.cursor = "default";
}

function svgDataURL(svg) {

  let svgAsXML = (new XMLSerializer).serializeToString(svg);
  return "data:image/svg+xml," + encodeURIComponent(svgAsXML);
}

function download(){

  let dl = document.createElement("a");
  document.body.appendChild(dl);
  let svg = document.getElementById("main");
  dl.setAttribute("href", svgDataURL(svg));
  dl.setAttribute("download", "main.svg");
  dl.click();
  document.body.removeChild(dl);
}

document.addEventListener("keydown", (event) => {

  // console.log(event.code);
  
  if (event.code == "Backspace"){
    let del = document.getElementsByClassName("selected")[0];
    if (del)
    {
      del.remove();
      deselect();
    }
    return;
  }
  if (event.code == "ShiftLeft"){
    shift = true;
  }
});

document.addEventListener("keyup", (event) => {

  if (event.code == "ShiftLeft"){
    shift = false;
  }
});