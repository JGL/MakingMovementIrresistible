var canvas;

// Create the GUI: https://github.com/colejd/guify
var gui = new guify({
  title: "Making Movement Irresistible",
  theme: "dark", // dark, light, yorha, or theme object
  align: "right", // left, right
  width: 300,
  barMode: "offset", // none, overlay, above, offset
  panelMode: "inner",
  opacity: 0.95,
  open: true,
});

// Populate the GUI
var lineWidth = 4;
gui.Register({
  // A slider representing `lineWidth`, constrained between 1 and 20.
  type: "range",
  label: "Range",
  min: 1,
  max: 20,
  step: 1,
  object: this,
  property: "lineWidth",
});

var rgbColor = rgb(255, 0, 0);
gui.Register({
  type: "color",
  label: "RGB Color",
  format: "rgb",
  object: this,
  property: "rgbColor",
});

function windowResized() {
  var canvasDiv = document.getElementById("drawing-area");
  //lots of strangeness with offsetWidth vs. client width
  //https://www.w3schools.com/jsref/prop_element_clientwidth.asp
  //https://www.w3schools.com/css/css_boxmodel.asp
  //https://stackoverflow.com/questions/52016682/get-divs-width-for-p5-js
  //https://github.com/processing/p5.js/issues/193
  var canvasWidth = canvasDiv.offsetWidth;
  var canvasHeight = canvasDiv.offsetHeight;

  //https://p5js.org/reference/#/p5/resizeCanvas
  resizeCanvas(canvasWidth, canvasHeight);
}

function setup() {
  //https://stackoverflow.com/questions/37083287/how-to-set-canvas-width-height-using-parent-divs-attributes
  //https://github.com/processing/p5.js/wiki/Beyond-the-canvas
  //https://github.com/processing/p5.js/wiki/Positioning-your-canvas

  var canvasDiv = document.getElementById("drawing-area");
  var canvasWidth = canvasDiv.offsetWidth;
  var canvasHeight = canvasDiv.offsetHeight;
  // var canvas = createCanvas(canvasWidth, desiredHeight);
  canvas = createCanvas(canvasWidth, canvasHeight);
  //console.log(canvas);
  canvas.parent("drawing-area"); //https://github.com/processing/p5.js/wiki/Beyond-the-canvas

  textSize(42); // 42 is the answer to everything
  textAlign(CENTER, CENTER); //https://p5js.org/reference/#/p5/textAlign
}

// Using p5 to render
function draw() {
  background(0);

  strokeWeight(lineWidth);
  stroke(rgbColor);
  noFill();
  circle(mouseX, mouseY, 20);
}
