//copied from https://openprocessing.org/sketch/632717 via https://discourse.processing.org/t/giving-variable-thickness-to-a-line-calculating-normals/5890 thanks hamoid!

var points = [];
var normals = [];

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

  for (var i = 0; i < 20; i++) {
    points.push(createVector(0, 0));
    normals.push(createVector(0, 0));
  }
}

function draw() {
  background(255);

  // populate points
  for (var i = 0; i < points.length; i++) {
    points[i].set(
      map(i, 0, 20, width * 0.25, width * 0.75),
      map(
        noise(i * 0.05 + frameCount * 0.01),
        0,
        1,
        height * 0.25,
        height * 0.75
      )
    );
  }

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
  for (var i = 0; i < normals.length; i++) {
    normals[i].normalize().mult(70 * noise(i * 0.04 + frameCount * 0.02));
  }

  // 3. Use the calculated normals
  // to draw in different ways

  // draw calculated thick line
  noStroke();
  fill("#FFCC00");
  beginShape(QUAD_STRIP);
  for (var i in points) {
    var p = points[i];
    var n = normals[i];
    vertex(p.x + n.x, p.y + n.y);
    vertex(p.x - n.x, p.y - n.y);
  }
  endShape();

  // draw the original line
  stroke("#552200");
  noFill();
  beginShape();
  for (const p of points) {
    vertex(p.x, p.y);
  }
  endShape();

  // draw line vertices
  stroke("#552200");
  strokeWeight(2);
  fill(255);
  for (const p of points) {
    ellipse(p.x, p.y, 6, 6);
  }

  // draw contour points
  noStroke();
  fill("#883300");
  for (var i in points) {
    var p = points[i];
    var n = normals[i];
    ellipse(p.x + n.x, p.y + n.y, 3, 3);
    ellipse(p.x - n.x, p.y - n.y, 3, 3);
  }
}
