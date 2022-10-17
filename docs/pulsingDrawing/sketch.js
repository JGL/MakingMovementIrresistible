//wiggly code copied from https://openprocessing.org/sketch/632717 via https://discourse.processing.org/t/giving-variable-thickness-to-a-line-calculating-normals/5890 thanks hamoid!

var points = []; // [] indicates an array, see https://github.com/processing/p5.js/wiki/JavaScript-basics#data-type-array (-;
var normals = [];
var pulses = [];

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

var strokeAlpha = 128;
gui.Register({
  type: "range",
  label: "Stroke Alpha",
  min: 0,
  max: 255,
  step: 1,
  object: this,
  property: "strokeAlpha",
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

var doPulse = true;
gui.Register({
  type: "checkbox",
  label: "Pulse line?",
  object: this,
  property: "doPulse",
});

var bpm = 60;
gui.Register({
  // A slider representing `lineLength`, constrained between 1 and 400.
  type: "range",
  label: "Pulse Rate",
  min: 2,
  max: 200,
  step: 1,
  object: this,
  property: "bpm",
});

var debugDraw = false;
gui.Register({
  type: "checkbox",
  label: "Debug draw?",
  object: this,
  property: "debugDraw",
});

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

  while (points.length > lineLength) {
    //get rid of the first element in the array
    let oldestPositionVector = points.shift();
    let oldestNormalVector = normals.shift();
    let oldestPulse = pulses.shift();
  }

  let newestPositionVectorForPointsArray = createVector(mouseX, mouseY);

  //push the new position vector onto the points array
  points.push(newestPositionVectorForPointsArray);
  normals.push(createVector(0, 0));
  pulses.push(0.0);

  // Calculate normals
  for (var i = 0; i < points.length - 1; i++) {
    var sub = p5.Vector.sub(points[i], points[i + 1]);
    normals[i].set(-sub.y, sub.x);
  }
  for (var i = 1; i < points.length; i++) {
    var sub = p5.Vector.sub(points[i], points[i - 1]);
    normals[i].add(sub.y, -sub.x);
  }

  // Resize normals
  var doubleLineWidth = lineWidth * 2.0;
  var beatsPerSecond = bpm / 60.0;
  //hacky way of just getting the value after the decimal point
  var seconds = millis() / 1000.0;
  // var normalisedMillisOnlyAfterDecimalPoint =
  //   normalisedMillis - Math.floor(normalisedMillis);

  for (var i = 0; i < normals.length; i++) {
    if (doPulse) {
      // following line is from original demo from hamoid
      // normals[i]
      //   .normalize()
      //   .mult(lineWidth * 2.0 * noise(i * 0.04 + frameCount * 0.02));
      // trying to do an even pulse with sine
      // normals[i].normalize().mult(lineWidth * 2.0 + sin(i) * lineWidth);
      // even pulse with bpm control
      normals[i]
        .normalize()
        .mult(
          doubleLineWidth +
            doubleLineWidth * abs(sin(seconds * PI * beatsPerSecond))
        );
    } else {
      // following line just draws a constant linewidth based on gui value
      normals[i].normalize().mult(doubleLineWidth);
    }
  }

  if (points.length > 2) {
    // draw calculated thick line, with a bit of alpha
    noStroke();

    var alphaDColour = color(strokeColour);
    if (debugDraw) {
      alphaDColour.setAlpha(128);
    } else {
      alphaDColour.setAlpha(strokeAlpha);
    }
    fill(alphaDColour);

    beginShape(QUAD_STRIP);
    for (var i in points) {
      var p = points[i];
      var n = normals[i];
      vertex(p.x + n.x, p.y + n.y);
      vertex(p.x - n.x, p.y - n.y);
    }
    endShape();

    if (debugDraw) {
      // draw the original line
      stroke(strokeColour);
      noFill();
      beginShape();
      for (const p of points) {
        vertex(p.x, p.y);
      }
      endShape();

      // draw line vertices
      stroke(strokeColour);
      strokeWeight(2);
      fill(255);
      for (const p of points) {
        ellipse(p.x, p.y, 6, 6);
      }
    }
  }
}
