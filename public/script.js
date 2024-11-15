// Constants
const TILE_SIZE = 32; // Size of each tile in pixels
const MAP_ROWS = 40;
const MAP_COLS = 40;
const VIEWPORT_ROWS = 12; // Number of rows visible on the screen
const VIEWPORT_COLS = 20; // Number of cols visible on the screen

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

// Player's starting position
const player = {
  x: 20, // Tile coordinates
  y: 20,
};

// Handle keyboard input
const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Update player position
function update() {
  if (keys["ArrowUp"] && player.y > 0) player.y--;
  if (keys["ArrowDown"] && player.y < MAP_ROWS - 1) player.y++;
  if (keys["ArrowLeft"] && player.x > 0) player.x--;
  if (keys["ArrowRight"] && player.x < MAP_COLS - 1) player.x++;
}

// Render the visible map and player
function render() {
  // Calculate top-left corner of the visible map
  const offsetX = Math.max(
    0,
    Math.min(player.x - Math.floor(VIEWPORT_COLS / 2), MAP_COLS - VIEWPORT_COLS)
  );
  const offsetY = Math.max(
    0,
    Math.min(player.y - Math.floor(VIEWPORT_ROWS / 2), MAP_ROWS - VIEWPORT_ROWS)
  );

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map tiles
  for (let row = 0; row < VIEWPORT_ROWS; row++) {
    for (let col = 0; col < VIEWPORT_COLS; col++) {
      const mapX = col + offsetX;
      const mapY = row + offsetY;
      if (mapX < MAP_COLS && mapY < MAP_ROWS) {
        ctx.fillStyle = map[mapY][mapX] === "water" ? "#87ceeb" : "#228b22"; // Water or land
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Draw player
  ctx.fillStyle = "#ff5733"; // Player color
  ctx.fillRect(
    (player.x - offsetX) * TILE_SIZE,
    (player.y - offsetY) * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

// Start the game
gameLoop();
