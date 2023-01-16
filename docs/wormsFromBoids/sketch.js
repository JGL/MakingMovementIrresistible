let canvas;

// Create the GUI: https://github.com/colejd/guify
// all the GUI elements must be var not let )-;
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
// default colour is sampled from: "Attenborough's Life That Glows (2016)"
// R: 132	G: 232	B:112
// HSV: 110, 52, 91
// https://www.youtube.com/watch?v=XcHFH5Nrh6E

var flyColour = "rgb(132, 232, 112)";
gui.Register({
  type: "color",
  label: "Fly colour",
  format: "rgb",
  object: this,
  property: "flyColour",
});

var flyAlpha = 128;
gui.Register({
  type: "range",
  label: "Fly Alpha",
  min: 0,
  max: 255,
  step: 1,
  object: this,
  property: "flyAlpha",
});

var flySize = 10;
gui.Register({
  type: "range",
  label: "Fly size",
  min: 1,
  max: 200,
  step: 1,
  object: this,
  property: "flySize",
});

var doPulse = true;
gui.Register({
  type: "checkbox",
  label: "Pulse fly?",
  object: this,
  property: "doPulse",
});

var bpm = 60;
gui.Register({
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

let numberOfFireflies = 1;
let fireflies = []; //array of Firefly objects
let alphaDColour; //global variable for the colour of fireflies
let beatsPerSecond; //how many beats per second
let seconds; // number of seconds since start of sketch

let flock;

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

  // Create fireflies
  for (let i = 0; i < 1; i++) {
    fireflies.push(new Firefly());
  }

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 60; i++) {
    let b = new Boid(width / 2, height / 2);
    flock.addBoid(b);
  }
}

// Using p5 to render
function draw() {
  //background(backgroundColour);
  background(0, 10); // translucent background (creates trails) - via https://p5js.org/examples/interaction-wavemaker.html

  beatsPerSecond = bpm / 60.0;
  seconds = millis() / 1000.0;

  alphaDColour = color(flyColour);
  if (debugDraw) {
    alphaDColour.setAlpha(128);
  } else {
    alphaDColour.setAlpha(flyAlpha);
  }

  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].move();
    fireflies[i].display();
  }

  flock.run();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}

// Firefly class
// initially duplicated from: https://p5js.org/examples/objects-array-of-objects.html
class Firefly {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = 1;
  }

  move() {
    this.x = mouseX;
    this.y = mouseY;

    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);

    //keep them on the screen, wrap them around, hacky!
    this.x = this.x % width;
    this.y = this.y % height;
  }

  display() {
    /// flashing

    let flash = abs(sin(seconds * beatsPerSecond * PI) * 255);
    let fAlpha = map(flash, 0, 255, 50, flyAlpha);

    alphaDColour.setAlpha(fAlpha);

    push();
    fill(alphaDColour);
    noStroke();
    ellipse(this.x, this.y, flySize, flySize);
    pop();
  }
}
