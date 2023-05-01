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

var lerpAmount = 0.1;
gui.Register({
	type: "range",
	label: "Speed of colour change",
	min: 0,
	max: 1,
	step: 0.01,
	object: this,
	property: "lerpAmount",
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
	//colorMode(RGB, 255, 255, 255, 255);
	//colorMode(HSB, 360, 100, 100, 1);
}

// Using p5 to render
function draw() {
	console.log(`frameCount is ${frameCount}.`);
	if (fadeBackground) {
		fadeUpBackgroundViaLerp();
		//via https://p5js.org/examples/interaction-wavemaker.html
	}
	fill("black");
	ellipse(mouseX, mouseY, paintSize, paintSize);
}

function fadeUpBackgroundViaLerp() {
	//colorMode(HSB, 360, 100, 100, 1)
	//https://p5js.org/reference/#/p5/pixelDensity
	let d = pixelDensity();
	//setting up some default values for efficiency
	let targetColour = color(paintColour);
	let currentColour = paintColour;
	let hueComponentOfCurrentPixel = 0;
	let saturationComponentOfCurrentPixel = 0;
	let brightnessComponentOfCurrentPixel = 0;
	let alphaComponentOfCurrentPixel = 0;

	//https://p5js.org/reference/#/p5/loadPixels
	//https://p5js.org/reference/#/p5/pixels
	loadPixels();
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			for (let i = 0; i < d; i++) {
				for (let j = 0; j < d; j++) {
					// if the colour of the current pixel matches the given colour, then increment numberOfPixelsThatMatchGivenColour
					index = 4 * ((y * d + j) * width * d + (x * d + i));
					currentColour = color(
						pixels[index],
						pixels[index + 1],
						pixels[index + 2],
						pixels[index + 3]
					);

					let newColor = lerpColor(currentColour, targetColour, lerpAmount);

					pixels[index] = red(newColor);
					pixels[index + 1] = green(newColor);
					pixels[index + 2] = blue(newColor);
					pixels[index + 3] = alpha(newColor);
				}
			}
		}
	}
	//https://p5js.org/reference/#/p5/updatePixels
	updatePixels();
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
