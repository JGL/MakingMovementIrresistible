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

var paintColour = "rgb(132, 232, 112)";
gui.Register({
	type: "color",
	label: "Paint colour",
	format: "rgb",
	object: this,
	property: "paintColour",
});

var paintSize = 200;
gui.Register({
	type: "range",
	label: "Paint size",
	min: 1,
	max: 200,
	step: 1,
	object: this,
	property: "paintSize",
});

var fadeAmount = 5;
gui.Register({
	type: "range",
	label: "Fade amount",
	min: 1,
	max: 50,
	step: 1,
	object: this,
	property: "fadeAmount",
});

var fadeBackground = true;
gui.Register({
	type: "checkbox",
	label: "Fade?",
	object: this,
	property: "fadeBackground",
});

gui.Register({
	type: "button",
	label: "All black",
	action: () => {
		console.log("Should be all black now");
		let blackColour = color(0, 0, 0, 255);
		console.log(`blackColour is ${blackColour}.`);
		fill(blackColour);
		rect(0, 0, width, height);
	},
});

gui.Register({
	type: "button",
	label: "All paint colour",
	action: () => {
		//background(paintColour);
		fill(paintColour);
		rect(0, 0, width, height);
	},
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
	background(paintColour);
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
	background(paintColour);
	noStroke();
	colorMode(RGB, 255, 255, 255, 255);
	//blendMode(BLEND); //default mode
	//blendMode(ADD);
	//blendMode(LIGHTEST);
	//blendMode(DIFFERENCE);
	//blendMode(EXCLUSION);
	//blendMode(MULTIPLY);
	//blendMode(SCREEN);
	//blendMode(REPLACE);
	//blendMode(REMOVE);
	//blendMode(OVERLAY);
	//blendMode(HARD_LIGHT);
	//blendMode(SOFT_LIGHT);
	//blendMode(DODGE);
	//blendMode(BURN);
}

// Using p5 to render
function draw() {
	if (fadeBackground) {
		let fadeUpColour = color(paintColour);
		fadeUpColour.setAlpha(fadeAmount);
		background(fadeUpColour);
		//via https://p5js.org/examples/interaction-wavemaker.html
	}

	//yes
	fill("black");
	ellipse(mouseX, mouseY, paintSize, paintSize);
}

function percentageColour(givenColour) {
	let percentageColour = 0.0;
	//https://p5js.org/reference/#/p5/pixelDensity
	let d = pixelDensity();
	let totalNumberOfPixels = width * height * d * d;
	let numberOfPixelsThatMatchGivenColour = 0;
	let redComponentOfGivenColour = red(givenColour);
	let greenComponentOfGivenColour = green(givenColour);
	let blueComponentOfGivenColour = blue(givenColour);
	let alphaComponentOfGivenColour = alpha(givenColour);

	//https://p5js.org/reference/#/p5/loadPixels
	//https://p5js.org/reference/#/p5/pixels
	loadPixels();
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			for (let i = 0; i < d; i++) {
				for (let j = 0; j < d; j++) {
					// if the colour of the current pixel matches the given colour, then increment numberOfPixelsThatMatchGivenColour
					index = 4 * ((y * d + j) * width * d + (x * d + i));
					if (
						pixels[index] == redComponentOfGivenColour &&
						pixels[index + 1] == greenComponentOfGivenColour &&
						pixels[index + 2] == blueComponentOfGivenColour &&
						pixels[index + 3] == alphaComponentOfGivenColour
					) {
						numberOfPixelsThatMatchGivenColour++;
					}
				}
			}
		}
	}
	updatePixels();
	// console.log(
	// 	`numberOfPixelsThatMatchGivenColour is ${numberOfPixelsThatMatchGivenColour}, totalNumberOfPixels is ${totalNumberOfPixels}.`
	// );

	percentageColour = numberOfPixelsThatMatchGivenColour / totalNumberOfPixels;

	return percentageColour;
}
