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
var strokeColour = "rgb(255, 0, 0)";
gui.Register({
  type: "color",
  label: "Stroke colour",
  format: "rgb",
  object: this,
  property: "strokeColour",
});

var backgroundColour = "rgb(0, 0, 0)";
gui.Register({
  type: "color",
  label: "Background colour",
  format: "rgb",
  object: this,
  property: "backgroundColour",
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

var lineLength = 100;
gui.Register({
  // A slider representing `lineLength`, constrained between 1 and 400.
  type: "range",
  label: "Line Length",
  min: 2,
  max: 400,
  step: 1,
  object: this,
  property: "lineLength",
});

// var showCursor = true;
// gui.Register({
//   type: "checkbox",
//   label: "Show Mouse Cursor?",
//   object: this,
//   property: "showCursor",
//   onChange: (data) => {
//     if (showCursor) {
//       console.log("Should be switching cursor on");
//       cursor(ARROW);
//     } else {
//       console.log("Should be switching cursor off");
//       noCursor();
//     }
//   },
// });

let arrayOfPositions = []; // [] indicates an array, see https://github.com/processing/p5.js/wiki/JavaScript-basics#data-type-array (-;

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
  frameRate(60);
}

// Using p5 to render
function draw() {
  background(backgroundColour);

  strokeWeight(lineWidth);
  stroke(strokeColour);
  noFill();
  //circle(mouseX, mouseY, 42);

  while (arrayOfPositions.length > lineLength) {
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
