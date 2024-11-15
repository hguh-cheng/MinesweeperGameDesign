// Constants
const TILE_SIZE = 32; // Size of each tile in pixels
const MAP_ROWS = 40;
const MAP_COLS = 40;
const VIEWPORT_ROWS = 12; // Number of rows visible on the screen
const VIEWPORT_COLS = 20; // Number of cols visible on the screen
const PLAYER_SPEED = 4; // Pixels per frame
const CAMERA_LERP = 0.1; // Camera smoothing factor (0-1)

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

// Handle keyboard input
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Handle flag placement/removal on spacebar press
  if (e.key === " ") {
    // Calculate tile position based on player center
    const playerCenterX = player.x + TILE_SIZE / 2;
    const playerCenterY = player.y + TILE_SIZE / 2;
    const tileX = Math.floor(playerCenterX / TILE_SIZE);
    const tileY = Math.floor(playerCenterY / TILE_SIZE);

    // Find if a flag exists at this position
    const flagIndex = flags.findIndex(
      (flag) => flag.x === tileX && flag.y === tileY
    );

    if (flagIndex === -1) {
      // No flag exists, add one
      flags.push({ x: tileX, y: tileY });
    } else {
      // Flag exists, remove it
      flags.splice(flagIndex, 1);
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
  // Update player position
  if (keys["ArrowUp"]) player.y -= PLAYER_SPEED;
  if (keys["ArrowDown"]) player.y += PLAYER_SPEED;
  if (keys["ArrowLeft"]) player.x -= PLAYER_SPEED;
  if (keys["ArrowRight"]) player.x += PLAYER_SPEED;

  // Keep player within map bounds (in pixels)
  player.x = Math.max(0, Math.min(player.x, (MAP_COLS - 1) * TILE_SIZE));
  player.y = Math.max(0, Math.min(player.y, (MAP_ROWS - 1) * TILE_SIZE));

  // Calculate desired camera position (centered on player)
  const targetCameraX = player.x - canvas.width / 2;
  const targetCameraY = player.y - canvas.height / 2;

  // Smoothly move camera towards target position
  camera.x = lerp(camera.x, targetCameraX, CAMERA_LERP);
  camera.y = lerp(camera.y, targetCameraY, CAMERA_LERP);

  // Clamp camera to map bounds
  camera.x = Math.max(
    0,
    Math.min(camera.x, MAP_COLS * TILE_SIZE - canvas.width)
  );
  camera.y = Math.max(
    0,
    Math.min(camera.y, MAP_ROWS * TILE_SIZE - canvas.height)
  );
}

// Function to draw a flag
function drawFlag(x, y) {
  // Flag pole
  ctx.beginPath();
  ctx.moveTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.2);
  ctx.lineTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.8);
  ctx.strokeStyle = "#4a4a4a";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Flag
  ctx.beginPath();
  ctx.moveTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.2);
  ctx.lineTo(x + TILE_SIZE * 0.3, y + TILE_SIZE * 0.35);
  ctx.lineTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.5);
  ctx.fillStyle = "#ff0000";
  ctx.fill();
}

// Render the visible map and player
function render() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Calculate the starting tile positions based on camera position
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
        ctx.fillStyle = map[mapY][mapX] === "water" ? "#87ceeb" : "#228b22";
        ctx.fillRect(
          col * TILE_SIZE - offsetX,
          row * TILE_SIZE - offsetY,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
  }

  // Draw flags
  flags.forEach((flag) => {
    const screenX = flag.x * TILE_SIZE - camera.x;
    const screenY = flag.y * TILE_SIZE - camera.y;

    // Only draw flags that are within the viewport
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
}

// Start the game
gameLoop();
