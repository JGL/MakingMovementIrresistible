var canvas;

// Create the GUI: https://github.com/colejd/guify
var gui = new guify({
  title: "Making Movement Irresistible",
  theme: "dark", // dark, light, yorha, or theme object
  align: "right", // left, right
  width: 300,
  barMode: "overlay", // none, overlay, above, offset
  panelMode: "inner",
  panelOverflowBehavior: "overflow",
  opacity: 0.95,
  open: true,
});

// Populate the GUI
var rgbColour = "rgba(255, 0, 0)";
gui.Register({
  type: "color",
  label: "Stroke colour",
  format: "rgb",
  object: this,
  property: "rgbColour",
});

var lineWidth = 4;
gui.Register({
  // A slider representing `lineWidth`, constrained between 1 and 20.
  type: "range",
  label: "Line Width",
  min: 1,
  max: 20,
  step: 1,
  object: this,
  property: "lineWidth",
});

let arrayOfPositions = []; // [] indicates an array, see https://github.com/processing/p5.js/wiki/JavaScript-basics#data-type-array (-;
let maxNumberOfPositions = 100;

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
}

// Using p5 to render
function draw() {
  background(255);

  strokeWeight(lineWidth);
  stroke(rgbColour);
  noFill();
  circle(mouseX, mouseY, 42);

  while (arrayOfPositions.length > maxNumberOfPositions) {
    //get rid of the first element in the array
    let oldestPositionVectorFromArray = arrayOfPositions.shift();
  }

  //comment out this line for a continuously updating line
  // if (mouseX != pmouseX && mouseY != pmouseY) {
  //   //make a new vector to add to the array
  let newestPositionVectorForArray = createVector(mouseX, mouseY);

  //push the new position vector onto the array
  arrayOfPositions.push(newestPositionVectorForArray);
  // }

  if (arrayOfPositions.length > 2) {
    for (let i = 0; i < arrayOfPositions.length - 1; i++) {
      //why am I doing -1? What happens when we get to the end of the array?
      let temporaryVector1 = arrayOfPositions[i];

      let temporaryVector2 = arrayOfPositions[i + 1];

      line(
        temporaryVector1.x,
        temporaryVector1.y,
        temporaryVector2.x,
        temporaryVector2.y
      );
    }
  }
}
