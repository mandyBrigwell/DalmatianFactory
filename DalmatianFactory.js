import p5 from "p5";

const seed=~~(fxrand()*90128);
const noise=~~(fxrand()*90128);
let screenSize, graphicsLayerSize;
var graphicsLayer, buffer;

let colorMode = 0;
let hue = 60*~~(fxrand()*5);
let hueDescription;
if (hue == 0) {
	hueDescription = "Carnelian";
	} else if (hue <= 60) {
		hueDescription = "Tourmaline";
	} else if (hue <= 120) {
		hueDescription = "Peridot";
	} else if (hue <= 180) {
		hueDescription = "Turquoise";
	} else if (hue <= 240) {
		hueDescription = "Lapis lazuli";
	} else if (hue <= 300) {
		hueDescription = "Garnet";
	} else {
		hueDescription = "Carnelian";
	}

let granularityHash = fxrand();
let granularity, granularityDescription;
if (granularityHash < 0.2) {
	granularity = 8;
	granularityDescription = "Small dots";
} else if (granularityHash < 0.8) {
	granularity = 6;
	granularityDescription = "Medium dots";
} else {
	granularity = 4;
	granularityDescription = "Large dots";
}

let wonky = fxrand()*0.5;
let wonkyDescription;
if (wonky < 0.125) {
	wonkyDescription = "Relatively straight";
	} else if (wonky < 0.375) {
		wonkyDescription = "Slightly off-kilter";
	} else {
		wonkyDescription = "Unacceptably askew"
	}

let inversehash = fxrand();
let inverse, inverseDescription;
if (inversehash < 0.2) {
	inverse = 0.25;
	inverseDescription = "25%";
} else if (inversehash < 0.8) {
	inverse = 0.5;
	inverseDescription = "50%";
} else {
	inverse = 0.75;
	inverseDescription = "75%";
}

let varianceHash = fxrand();
let variance, varianceDescription;
if (varianceHash < 0.1) {
	variance = 64;
	varianceDescription = "Frantic";
} else if (varianceHash < 0.3) {
	variance = 128;
	varianceDescription = "Lively";
} else if (varianceHash < 0.6) {
	variance = 512;
	varianceDescription = "Steady";
} else if (varianceHash < 0.9) {
	variance = 2048;
	varianceDescription = "Lethargic";
} else {
	variance = 4096;
	varianceDescription = "Glacial";
}

let gridSpacingHash = fxrand();
let gridSpacing, gridSpacingDescription;
if (gridSpacingHash < 0.2) {
	gridSpacing = 0.02;
	gridSpacingDescription = "Smaller";
} else if (gridSpacingHash < 0.8) {
	gridSpacing = 0.01;
	gridSpacingDescription = "Normal";
} else {
	gridSpacing = 0.03;
	gridSpacingDescription = "Larger";
}

let gridhash = fxrand();
let gridSize, gridDescription;
if (gridhash < 0.2) {
	gridSize = 2;
	gridDescription = "2x2";
} else if (gridhash < 0.4) {
	gridSize = 3;
	gridDescription = "3x3";
} else if (gridhash < 0.6) {
	gridSize = 4;
	gridDescription = "4x4";
} else if (gridhash < 0.8) {
	gridSize = 5;
	gridDescription = "5x5";
} else if (gridhash < 0.9) {
	gridSize = 8;
	gridDescription = "8x8";
} else {
	gridSize = 12;
	gridDescription = "12x12";
	}
	
let gridLineColorhash = fxrand();
let gridLineColor, gridLineColorDescription;
if (gridLineColorhash < 0.25) {
	gridLineColor = 0;
	gridLineColorDescription = "Black";
	} else if (gridLineColorhash < 0.75) {
		gridLineColor = 180;
		gridLineColorDescription = "Grey";
	} else {
	gridLineColor = 360;
	gridLineColorDescription = "White";
}

let sketch = function(p5) {

  p5.setup = function() {
		p5.randomSeed(seed);
		p5.noiseSeed(noise);
		screenSize = p5.min(p5.windowWidth, p5.windowHeight);
		p5.createCanvas(screenSize, screenSize);
		p5.colorMode(p5.HSB, 360);
		p5.rectMode(p5.CENTER);
		p5.initiate();
		graphicsLayer.colorMode(p5.HSB, 360);
	};
	
	p5.initiate = function() {
		buffer = gridSpacing * screenSize;
		graphicsLayerSize = (screenSize-buffer)/gridSize;
		graphicsLayer = p5.createGraphics(graphicsLayerSize-buffer, graphicsLayerSize-buffer);
		p5.redraw();
	}
  	
	p5.draw = function() {
		if (colorMode == 0) {
			p5.background(gridLineColor);
		} else {
			p5.background(hue, 180, gridLineColor);
		}
		p5.drawingContext.shadowOffsetY = 4;
		p5.drawingContext.shadowOffsetX = 4;
		p5.drawingContext.shadowBlur = screenSize/(gridSize*4);
		p5.drawingContext.shadowColor = "#000000";
			for (var i=0; i<gridSize; i++) {
				for (var j=0; j<gridSize; j++) {
					graphicsLayer.push();
					graphicsLayer.translate(graphicsLayerSize/2, graphicsLayerSize/2);
// 					graphicsLayer.rotate(p5.PI/8 + (p5.noise(i, j)-0.5) * p5.PI/2);
					graphicsLayer.rotate((j+i+1)%(p5.TAU/2));
					graphicsLayer.scale(p5.sqrt(2));
					graphicsLayer.translate(-graphicsLayerSize/2, -graphicsLayerSize/2);
					graphicsLayer.clear();
					graphicsLayer.noStroke();
// 					graphicsLayer.rectMode(p5.CENTER);
					if (colorMode == 0) {
						if (p5.noise(i, j) < inverse) {
							graphicsLayer.background(0);
						} else {
							graphicsLayer.background(360);
						}
					} else {
						if (p5.noise(i, j) < inverse) { // Hue mode
							graphicsLayer.background(hue, 360, 30);
						} else {
							graphicsLayer.background(hue, 360, 330);
						}
					}
					var dotSize = p5.noise(i, j) * graphicsLayerSize/granularity;
						for (var k=0; k<graphicsLayerSize; k+=dotSize+1) {
							for (var l=0; l<graphicsLayerSize; l+=dotSize+1) {
							var alphaPoint = 1-p5.dist(k, l, graphicsLayerSize/2, graphicsLayerSize/2)/graphicsLayerSize;
								if (colorMode == 0) {
									if (p5.noise(i, j) < inverse) {
										graphicsLayer.fill(360, 60 + alphaPoint*360);
									} else {
										graphicsLayer.fill(0, 60 + alphaPoint*360);
									}
								} else { // Use the hue
									if (p5.noise(i, j) < inverse) {
									graphicsLayer.fill(hue, 360, 360, 60 + alphaPoint*360);
								} else {
									graphicsLayer.fill(0, 60 + alphaPoint*360);
									}

								}
								var newSize = dotSize * p5.sin(0.025 * (k-graphicsLayerSize) * (l-graphicsLayerSize) + p5.frameCount/(variance/gridSize));
								newSize *=  1-p5.sin(p5.dist(k, l, graphicsLayerSize/2, graphicsLayerSize/2)/graphicsLayerSize/2);
								graphicsLayer.ellipse(k*0.9, l*0.9, newSize, newSize);
							}
						}
					graphicsLayer.pop();
					p5.translate(buffer + i * graphicsLayerSize, buffer + j * graphicsLayerSize);
					p5.translate(graphicsLayerSize/2, graphicsLayerSize/2);
					p5.rotate(wonky * (p5.noise(i,j)-0.5)/p5.TAU);
					p5.translate(-graphicsLayerSize/2, -graphicsLayerSize/2);
					p5.image(graphicsLayer, 0, 0);
					p5.resetMatrix();
				}
			}
		};
		
	p5.mouseClicked = function() {
		colorMode += 1;
		if (colorMode > 1) {
			colorMode = 0;
		}
	}

	p5.windowResized = function() {
		screenSize = p5.min(p5.windowWidth, p5.windowHeight, );
		p5.resizeCanvas(screenSize, screenSize);
		p5.initiate();
	}
	  
}

let myp5 = new p5(sketch, window.document.body);

window.$fxhashFeatures = {
  "Granularity": granularityDescription,
  "Grid size": gridDescription,
  "Variance": varianceDescription,
  "Rotation": wonkyDescription,
  "Inverse probability": inverseDescription,
  "Grid lines": gridLineColorDescription,
  "Grid spacing": gridSpacingDescription,
  "Hue": hueDescription
  }

/*

Dalmatian Factory

Monochrome dots, changing over time. Click for monochrome colour!

Features:

Granularity - This affects the dot size; extremes of size are rarer.

Grid size - The number of squares, with varying rarity.

Variance - The speed at which the pattern changes over time. Extremes are rarer.

Rotation - Some squares are given a slight tilt.

Inverse probability - The likelihood that a particular square will be inverted. An equal mix is slightly more likely.

Grid lines - These can be black, white or grey. They are most likely to be grey.

Grid spacing - The distance between individual squares.

Hue - The monochrome hue used when the canvas is clicked.

*/