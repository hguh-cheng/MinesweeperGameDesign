# Setup

I used no libraries to set up my project. This runs by itself.

---

# Main Functions

## 1. Map and Tile Management Functions

### `countWaterTilesAround(x, y)`

Counts the number of adjacent "water" tiles around a given tile `(x, y)`.

### `countFlagsAround(x, y)`

Counts the number of flags placed around a given tile `(x, y)`.

### `hasFlag(x, y)`

Checks if a flag exists at the specified `(x, y)` position.

---

## 2. Tile Revealing Functions

### `ensureSafeFirstReveal(revealX, revealY)`

Ensures the first tile revealed has no adjacent "water" tiles by relocating water tiles away from the initial reveal area.

### `revealTiles(x, y)`

Recursively reveals tiles, and reveals adjacent tiles if no "water" tiles are nearby. Starts the game timer on the first reveal.

### `chordTiles(x, y)`

Simultaneously reveals all surrounding tiles if the number of flags matches the number of adjacent "water" tiles.

---

## 3. Player and Input Handling

### Keyboard Input Handling

- **Arrow keys**: Move the player character around the map.
- **Space**: Places or removes flags on the current tile.
- **Enter**: Reveals the tile the player is standing on.
- **`m` key**: Toggles the expansion of the minimap.

---

## 4. Game Loop and Rendering

### `gameLoop()`

Main game loop that updates the game state (`update()`) and renders the scene (`render()`) each frame.

### `update()`

- Moves the player.
- Updates the camera position using linear interpolation (`lerp`).
- Tracks elapsed game time.

### `render()`

- Draws the map, revealed tiles, flags, player, mines counter, timer, and lives on the canvas.

### `drawFlag(x, y)`

Draws a flag on the given tile.

### `renderMinimap()`

Draws a smaller version of the entire map showing player position, revealed tiles, and flags.

---

## 5. Game State Management

### Lives System

- The player starts with `MAX_LIVES`. Losing all lives triggers a `gameOver` state.

### Game Over and Timer

- `gameOver`: Tracks whether the game has ended.
- `elapsedTime`: Tracks how long the game has been running.

### Game Over Message

Displays **"YOU LOSE NERD"** if the player runs out of lives.
