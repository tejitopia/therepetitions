// Ensure that hl-gen.js is properly linked in your HTML before this script

let tileSize;
let tiles = [];
let colorSchemes = [];
let currentScheme = 0;
let rotationAngle = 0;
let rotationSpeed;
let tileSizeVariation;
let tileScaleFactor = 0.01;
let tileFadeFactor = 0.01;

function setup() {
  createCanvas(1000, 1000); // Set canvas size to 1000x1000
  frameRate(60);
  colorSchemes = [
    { start: color("#01BFFF"), end: color("#C2ECFF") }, // TEJI Color Scheme
  ];
  initializeTiles();

  // Adjust the canvas to fit the screen
  scaleCanvasToFit();

  // Prepare NFT token metadata
  prepareToken();
}

function draw() {
  background(222);

  if (colorSchemes[currentScheme].start === "TEJI") {
    drawTejiTiles();
  } else {
    drawInterpolatedTiles(
      colorSchemes[currentScheme].start,
      colorSchemes[currentScheme].end
    );
  }

  moveTiles();
}

function windowResized() {
  scaleCanvasToFit();
}

function scaleCanvasToFit() {
  const artworkAspectRatio = height / width;
  const canvasElement = document.querySelector("canvas");

  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  if (innerHeight <= innerWidth * artworkAspectRatio) {
    canvasElement.style.height = "100vh";
    canvasElement.style.width = "auto";
  } else {
    canvasElement.style.width = "100vw";
    canvasElement.style.height = "auto";
  }

  canvasElement.style.display = "block";
  canvasElement.style.position = "absolute";
  canvasElement.style.top = 0;
  canvasElement.style.left = 0;
  canvasElement.style.right = 0;
  canvasElement.style.bottom = 0;
  canvasElement.style.margin = "auto";
}

function initializeTiles() {
  tiles = [];
  tileSize = hl.random(10, 300);

  let tilesAcross = floor(width / tileSize);
  let tilesDown = floor(height / tileSize);
  let totalTiles = tilesAcross * tilesDown;

  let offsetX = (width - tilesAcross * tileSize) / 2;
  let offsetY = (height - tilesDown * tileSize) / 2;

  for (let i = 0; i < totalTiles; i++) {
    let x = offsetX + (i % tilesAcross) * tileSize;
    let y = offsetY + floor(i / tilesAcross) * tileSize;
    tileSizeVariation = hl.random(-50, 50);
    tiles.push({
      x,
      y,
      vx: hl.random(-2, 2),
      vy: hl.random(-2, 2),
      tileSize: tileSize + tileSizeVariation,
      scale: 1,
      alpha: 255,
    });
  }

  rotationSpeed = hl.random(-0.02, 0.02);
}

function drawInterpolatedTiles(startColor, endColor) {
  tiles.forEach((tile, index) => {
    let interColor = lerpColor(startColor, endColor, index / tiles.length);
    fill(interColor);
    push();
    translate(tile.x + tile.tileSize / 2, tile.y + tile.tileSize / 2);
    rotate(rotationAngle + (index / tiles.length) * PI);
    scale(tile.scale);
    ellipse(0, 0, tile.tileSize, tile.tileSize);
    let lighterColor = color(
      red(interColor) + 30,
      green(interColor) + 30,
      blue(interColor) + 30,
      tile.alpha
    );
    fill(lighterColor);
    let smallerCircleSize = tile.tileSize * 0.5;
    ellipse(0, 0, smallerCircleSize, smallerCircleSize);
    pop();
  });

  if (currentScheme === 1) {
    rotationAngle += rotationSpeed;
  }
}

function drawTejiTiles() {}

function moveTiles() {
  tiles.forEach((tile) => {
    tile.vx *= 0.9;
    tile.vy *= 0.9;

    tile.x += tile.vx;
    tile.y += tile.vy;

    if (
      tile.x + tile.tileSize / 2 >= width ||
      tile.x - tile.tileSize / 2 <= 0
    ) {
      tile.vx *= -1;
    }
    if (
      tile.y + tile.tileSize / 2 >= height ||
      tile.y - tile.tileSize / 2 <= 0
    ) {
      tile.vy *= -1;
    }

    tile.scale += hl.random(-tileScaleFactor, tileScaleFactor);
    tile.scale = constrain(tile.scale, 0.5, 1.5);

    tile.alpha += hl.random(-tileFadeFactor, tileFadeFactor) * 255;
    tile.alpha = constrain(tile.alpha, 0, 255);
  });
}

function prepareToken() {
  // NFT metadata specifics
  const numberOfCircles = tiles.length; // Each tile represents a main circle
  const minterWalletAddress = hl.tx.walletAddress; // Minter's wallet address

  const traits = {
    "Number of Circles": numberOfCircles,
    "Minter Wallet Address": minterWalletAddress,
  };

  hl.token.setTraits(traits);
  hl.token.setName(`Repetition #${hl.tx.tokenId}`);
  hl.token.setDescription(
    `The Repetitions is a generative art series by TEJI. Inspired by the countless iterations of the now iconic TEJI character, The Repetitions symbolises the power of iteration and consistent effort over a long period of time.`
  );
}
