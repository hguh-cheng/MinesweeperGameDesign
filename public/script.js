// Constants
const TILE_SIZE = 32; // Size of each tile in pixels
const MAP_ROWS = 40;
const MAP_COLS = 40;
const VIEWPORT_ROWS = 12; // Number of rows visible on the screen
const VIEWPORT_COLS = 20; // Number of cols visible on the screen
const PLAYER_SPEED = 4; // Pixels per frame
const CAMERA_LERP = 0.1; // Camera smoothing factor (0-1)
const MAX_LIVES = 3;
let lives = MAX_LIVES;
let gameOver = false;
let gameStartTime = null;
let elapsedTime = 0;

// Set up the canvas and context
const canvas = document.getElementById("game-canvas");
canvas.width = VIEWPORT_COLS * TILE_SIZE;
canvas.height = VIEWPORT_ROWS * TILE_SIZE;
const ctx = canvas.getContext("2d");

// Generate the map
const map = Array.from({ length: MAP_ROWS }, () =>
  Array.from({ length: MAP_COLS }, () =>
    Math.random() < 0.2 ? "water" : "land"
  )
);

// Array to store revealed tiles
const revealedTiles = Array.from({ length: MAP_ROWS }, () =>
  Array.from({ length: MAP_COLS }, () => false)
);

// Array to store placed flags
const flags = [];

// Player's starting position (in pixels)
const player = {
  x: 20 * TILE_SIZE,
  y: 20 * TILE_SIZE,
};

// Camera position (in pixels)
const camera = {
  x: player.x - canvas.width / 2,
  y: player.y - canvas.height / 2,
};

// Function to count water tiles around a position
function countWaterTilesAround(x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const checkX = x + dx;
      const checkY = y + dy;

      if (
        checkX >= 0 &&
        checkX < MAP_COLS &&
        checkY >= 0 &&
        checkY < MAP_ROWS &&
        map[checkY][checkX] === "water"
      ) {
        count++;
      }
    }
  }
  return count;
}

// Function to count flags around a position
function countFlagsAround(x, y) {
  return flags.filter(
    (flag) =>
      Math.abs(flag.x - x) <= 1 &&
      Math.abs(flag.y - y) <= 1 &&
      !(flag.x === x && flag.y === y)
  ).length;
}

// Function to check if a flag exists at given coordinates
function hasFlag(x, y) {
  return flags.some((flag) => flag.x === x && flag.y === y);
}

// Modify map generation to track first reveal
let firstReveal = true;

// Function to ensure first reveal is safe
function ensureSafeFirstReveal(revealX, revealY) {
  // If first reveal, relocate water tiles to ensure 0 water around reveal tile
  if (firstReveal) {
    firstReveal = false;

    // Find and relocate water tiles around the reveal tile
    const tilesToRelocate = [];

    // Identify water tiles around the reveal area
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const checkX = revealX + dx;
        const checkY = revealY + dy;

        if (
          checkX >= 0 &&
          checkX < MAP_COLS &&
          checkY >= 0 &&
          checkY < MAP_ROWS &&
          map[checkY][checkX] === "water"
        ) {
          tilesToRelocate.push({ x: checkX, y: checkY });
        }
      }
    }

    // Remove water tiles from original locations
    tilesToRelocate.forEach((tile) => {
      map[tile.y][tile.x] = "land";
    });

    // Randomly relocate water tiles to other locations
    tilesToRelocate.forEach(() => {
      let placed = false;
      while (!placed) {
        const newX = Math.floor(Math.random() * MAP_COLS);
        const newY = Math.floor(Math.random() * MAP_ROWS);

        // Ensure new location is not too close to the reveal tile and is currently land
        const tooClose =
          Math.abs(newX - revealX) <= 1 && Math.abs(newY - revealY) <= 1;

        if (!tooClose && map[newY][newX] === "land") {
          map[newY][newX] = "water";
          placed = true;
        }
      }
    });
  }
}

// Function to reveal tiles recursively
function revealTiles(x, y) {
  // Start timer on first reveal if not already started
  if (!gameStartTime) {
    gameStartTime = Date.now();
  }

  ensureSafeFirstReveal(x, y);

  // Check bounds
  if (x < 0 || x >= MAP_COLS || y < 0 || y >= MAP_ROWS) {
    return;
  }

  // Skip if already revealed or has flag
  if (revealedTiles[y][x] || hasFlag(x, y) || gameOver) {
    return;
  }

  // Reveal current tile
  revealedTiles[y][x] = true;

  // Lose a life if water tile is revealed
  if (map[y][x] === "water") {
    lives--;

    // Automatically place a flag on the water tile
    if (!hasFlag(x, y)) {
      flags.push({ x: x, y: y });
    }

    if (lives <= 0) {
      gameOver = true;
    }
  }

  // If it's a land tile with no water neighbors, recursively reveal neighbors
  if (map[y][x] === "land" && countWaterTilesAround(x, y) === 0) {
    // Reveal all 8 surrounding tiles
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        revealTiles(x + dx, y + dy);
      }
    }
  }
}

// Function to reveal all surrounding tiles via chording
function chordTiles(x, y) {
  const waterCount = countWaterTilesAround(x, y);
  const flagCount = countFlagsAround(x, y);

  // Only continue if number of flags matches water tile count
  if (waterCount !== flagCount) return;

  // Reveal surrounding tiles if not flagged
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const checkX = x + dx;
      const checkY = y + dy;

      if (
        checkX >= 0 &&
        checkX < MAP_COLS &&
        checkY >= 0 &&
        checkY < MAP_ROWS &&
        !hasFlag(checkX, checkY) &&
        !revealedTiles[checkY][checkX]
      ) {
        revealTiles(checkX, checkY);
      }
    }
  }
}

// Handle keyboard input
const keys = {};
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  keys[e.key] = true;

  if (e.key === " ") {
    // Handle flag placement/removal
    const playerCenterX = player.x + TILE_SIZE / 2;
    const playerCenterY = player.y + TILE_SIZE / 2;
    const tileX = Math.floor(playerCenterX / TILE_SIZE);
    const tileY = Math.floor(playerCenterY / TILE_SIZE);

    // Prevent flagging revealed tiles
    if (!revealedTiles[tileY][tileX]) {
      const flagIndex = flags.findIndex(
        (flag) => flag.x === tileX && flag.y === tileY
      );

      if (flagIndex === -1) {
        flags.push({ x: tileX, y: tileY });
      } else {
        flags.splice(flagIndex, 1);
      }
    }
  } else if (e.key === "Enter") {
    // Handle tile reveal
    const playerCenterX = player.x + TILE_SIZE / 2;
    const playerCenterY = player.y + TILE_SIZE / 2;
    const tileX = Math.floor(playerCenterX / TILE_SIZE);
    const tileY = Math.floor(playerCenterY / TILE_SIZE);

    // Only reveal if there's no flag
    if (!hasFlag(tileX, tileY)) {
      if (
        revealedTiles[tileY][tileX] &&
        countWaterTilesAround(tileX, tileY) > 0
      ) {
        // If tile is revealed and has water neighbors, attempt chording
        chordTiles(tileX, tileY);
      } else {
        // Regular tile reveal
        revealTiles(tileX, tileY);
      }
    }
  }
});
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Linear interpolation helper function
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Update player and camera position
function update() {
  if (keys["ArrowUp"]) player.y -= PLAYER_SPEED;
  if (keys["ArrowDown"]) player.y += PLAYER_SPEED;
  if (keys["ArrowLeft"]) player.x -= PLAYER_SPEED;
  if (keys["ArrowRight"]) player.x += PLAYER_SPEED;

  player.x = Math.max(0, Math.min(player.x, (MAP_COLS - 1) * TILE_SIZE));
  player.y = Math.max(0, Math.min(player.y, (MAP_ROWS - 1) * TILE_SIZE));

  const targetCameraX = player.x - canvas.width / 2;
  const targetCameraY = player.y - canvas.height / 2;

  camera.x = lerp(camera.x, targetCameraX, CAMERA_LERP);
  camera.y = lerp(camera.y, targetCameraY, CAMERA_LERP);

  camera.x = Math.max(
    0,
    Math.min(camera.x, MAP_COLS * TILE_SIZE - canvas.width)
  );
  camera.y = Math.max(
    0,
    Math.min(camera.y, MAP_ROWS * TILE_SIZE - canvas.height)
  );

  // Update elapsed time if game has started
  if (gameStartTime) {
    elapsedTime = Math.floor((Date.now() - gameStartTime) / 1000);
  }
}

// Function to draw a flag
function drawFlag(x, y) {
  ctx.beginPath();
  ctx.moveTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.2);
  ctx.lineTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.8);
  ctx.strokeStyle = "#4a4a4a";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.2);
  ctx.lineTo(x + TILE_SIZE * 0.3, y + TILE_SIZE * 0.35);
  ctx.lineTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.5);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
}

// Render the visible map and player
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startTileX = Math.floor(camera.x / TILE_SIZE);
  const startTileY = Math.floor(camera.y / TILE_SIZE);
  const offsetX = camera.x % TILE_SIZE;
  const offsetY = camera.y % TILE_SIZE;

  // Draw map tiles
  for (let row = 0; row <= VIEWPORT_ROWS + 1; row++) {
    for (let col = 0; col <= VIEWPORT_COLS + 1; col++) {
      const mapX = startTileX + col;
      const mapY = startTileY + row;

      if (mapX >= 0 && mapX < MAP_COLS && mapY >= 0 && mapY < MAP_ROWS) {
        const screenX = col * TILE_SIZE - offsetX;
        const screenY = row * TILE_SIZE - offsetY;

        // Draw base tile
        ctx.fillStyle = "#228b22";
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

        // If tile is revealed, show additional information
        if (revealedTiles[mapY][mapX]) {
          // Changed background color for revealed tiles to brown
          ctx.fillStyle = "#8B4513"; // Saddle Brown
          ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

          if (map[mapY][mapX] === "water") {
            // Show red for water tiles
            ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          } else {
            // Show number for land tiles
            const waterCount = countWaterTilesAround(mapX, mapY);
            if (waterCount > 0) {
              ctx.font = "20px Arial";
              ctx.fillStyle = "white";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(
                waterCount.toString(),
                screenX + TILE_SIZE / 2,
                screenY + TILE_SIZE / 2
              );
            }
          }
        }
      }
    }
  }

  // Draw flags
  flags.forEach((flag) => {
    const screenX = flag.x * TILE_SIZE - camera.x;
    const screenY = flag.y * TILE_SIZE - camera.y;

    if (
      screenX >= -TILE_SIZE &&
      screenX <= canvas.width + TILE_SIZE &&
      screenY >= -TILE_SIZE &&
      screenY <= canvas.height + TILE_SIZE
    ) {
      drawFlag(screenX, screenY);
    }
  });

  // Draw player
  ctx.fillStyle = "#ff5733";
  ctx.fillRect(player.x - camera.x, player.y - camera.y, TILE_SIZE, TILE_SIZE);

  // Calculate total mines and placed flags
  const totalMines = map.flat().filter((tile) => tile === "water").length;
  const placedFlags = flags.length;

  // Draw mine counter in top left
  ctx.fillStyle = "black";
  ctx.font = "24px 'Caveat'";
  ctx.textAlign = "left";
  ctx.fillText(`Mines Left: ${totalMines - placedFlags}`, 10, 30);

  // Draw timer in top right
  if (gameStartTime) {
    ctx.fillStyle = "black";
    ctx.font = "24px 'Caveat'";
    ctx.textAlign = "right";
    ctx.fillText(`Time: ${elapsedTime}`, canvas.width - 10, 30);
  }

  // Draw lives in bottom left with improved heart shape
  for (let i = 0; i < lives; i++) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    const heartX = 15 + 25 * i;
    const heartY = canvas.height - 30;
    const size = 12;

    // Left heart curve
    ctx.moveTo(heartX, heartY + size / 2);
    ctx.bezierCurveTo(
      heartX,
      heartY,
      heartX - size,
      heartY,
      heartX - size,
      heartY + size / 2
    );

    // Right heart curve
    ctx.bezierCurveTo(
      heartX - size,
      heartY + size,
      heartX,
      heartY + size * 1.2,
      heartX,
      heartY + size * 1.5
    );

    // Right side curve
    ctx.bezierCurveTo(
      heartX + size,
      heartY + size * 1.2,
      heartX + size,
      heartY + size,
      heartX + size,
      heartY + size / 2
    );

    // Left side curve
    ctx.bezierCurveTo(
      heartX + size,
      heartY,
      heartX,
      heartY,
      heartX,
      heartY + size / 2
    );

    ctx.fill();
  }

  // Game over text
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("YOU LOSE NERD", canvas.width / 2, canvas.height / 2);
  }
}

// Start the game
gameLoop();
