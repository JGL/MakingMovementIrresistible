let canvas;

let lineWidthSlider;
let lineColourPicker;

function windowResized() {
  let canvasDiv = document.getElementById("drawing-area");
  //lots of strangeness with offsetWidth vs. client width
  //https://www.w3schools.com/jsref/prop_element_clientwidth.asp
  //https://www.w3schools.com/css/css_boxmodel.asp
  //https://stackoverflow.com/questions/52016682/get-divs-width-for-p5-js
  //https://github.com/processing/p5.js/issues/193
  let canvasWidth = canvasDiv.offsetWidth;
  let canvasHeight = canvasDiv.offsetHeight;

  //https://p5js.org/reference/#/p5/resizeCanvas
  resizeCanvas(canvasWidth, canvasHeight);
}

function setup() {
  //https://stackoverflow.com/questions/37083287/how-to-set-canvas-width-height-using-parent-divs-attributes
  //https://github.com/processing/p5.js/wiki/Beyond-the-canvas
  //https://github.com/processing/p5.js/wiki/Positioning-your-canvas

  let canvasDiv = document.getElementById("drawing-area");
  let canvasWidth = canvasDiv.offsetWidth;
  let canvasHeight = canvasDiv.offsetHeight;
  // var canvas = createCanvas(canvasWidth, desiredHeight);
  canvas = createCanvas(canvasWidth, canvasHeight);
  //console.log(canvas);
  canvas.parent("drawing-area"); //https://github.com/processing/p5.js/wiki/Beyond-the-canvas

  textSize(42); // 42 is the answer to everything
  textAlign(CENTER, CENTER); //https://p5js.org/reference/#/p5/textAlign

  lineWidthSlider = createSlider(1, 20, 4); //https://p5js.org/reference/#/p5/createSlider
  lineWidthSlider.position(10, 10);
  lineColourPicker = createColorPicker("#ff0000"); //https://p5js.org/reference/#/p5/createColorPicker
  lineColourPicker.position(7, 42);
}

// Using p5 to render
function draw() {
  background(255);

  strokeWeight(lineWidthSlider.value());
  stroke(lineColourPicker.color());
  noFill();
  circle(mouseX, mouseY, 42);
}
