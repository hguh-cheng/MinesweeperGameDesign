1. GameManager
Manages the game state, level progression, player lives, and interactions.

Variables
timeElapsed: int - Tracks the total time spent on the current game in seconds.
minesRemaining: int - Number of mines left to be flagged.
lives: int - Number of hearts remaining for the player.
isGameOver: boolean - Indicates if the game is over.
player: Player - Instance of the controllable player character.
board: Board - Instance of the game board.
revealedSquares: int - Number of squares revealed so far.
bestTime: int - The best completion time (stored locally).
Methods
initializeGame()
Behavior: Resets the game with initial lives, mines, and board generation. Resets player’s position and starts the timer.
endGame(win: boolean)
Behavior: Displays the end screen, showing the player's score and time. Updates bestTime if the player wins with a new record.
tickTimer()
Behavior: Increments timeElapsed every second. Updates the timer on the HUD.
updateMinesRemaining()
Behavior: Updates the minesRemaining counter when a square is flagged or unflagged.
decrementLife()
Behavior: Decreases lives when a mine is triggered. If lives reach zero, triggers endGame(false).
resetGame()
Behavior: Resets the game to its initial state for a new playthrough.
2. Board
Handles the generation of the map, mine placement, and board interactions.

Variables
grid: 2D Array of Cell - Represents the game board, where each cell has properties for terrain, mines, and cosmetics.
rows: int - Number of rows on the board.
cols: int - Number of columns on the board.
islandShape: String - Shape of the island (e.g., "Ukraine").
safeZone: List<Point> - List of coordinates for the 3x3 safe area around the player’s first click.
Methods
loadMap(shape: String)
Behavior: Loads a predefined map shape from the database and initializes the board with land and water cells.
generateMines(excludeZone: List<Point>)
Behavior: Randomly places mines on land cells, excluding the initial safe zone. Ensures no 2x2 mine clusters.
calculateAdjacentMines()
Behavior: Calculates the number of adjacent mines for each non-mine cell.
generateCosmetics()
Behavior: Randomly assigns cosmetics to land cells based on a decreasing probability.
revealSquare(x: int, y: int)
Behavior: Reveals the specified square. If it’s a mine, decreases player’s life.
flagSquare(x: int, y: int)
Behavior: Flags or unflags the specified square.
3. Cell
Represents each individual square on the board.

Variables
isLand: boolean - Indicates if the cell is land or water.
hasMine: boolean - Indicates if the cell contains a mine.
adjacentMines: int - Number of mines in adjacent cells.
revealed: boolean - Indicates if the cell is revealed.
flagged: boolean - Indicates if the cell is flagged.
hasCosmetic: boolean - Indicates if the cell has a cosmetic item.
Methods
reset()
Behavior: Resets the cell properties for a new game.
reveal()
Behavior: Reveals the cell and triggers adjacent reveals if adjacentMines is zero.
flag()
Behavior: Toggles the flagged state of the cell.
4. Player
Handles player movement, interactions, and field of view.

Variables
position: Point - Current position of the player.
hearts: int - Number of hearts remaining.
cosmeticsCollected: List<Cosmetic> - List of cosmetics the player has unlocked.
viewRadius: int - Radius of squares visible to the player.
Methods
move(direction: String)
Behavior: Updates the player's position based on input (WASD). Prevents movement onto water cells.
revealTiles()
Behavior: Reveals tiles within the player’s field of view.
interact()
Behavior: Reveals or flags the tile in front of the player based on input.
collectCosmetic(cosmetic: Cosmetic)
Behavior: Adds a cosmetic to the player’s collection.
5. HUDManager
Handles the display of game information on the screen.

Variables
timeDisplay: HTMLElement - Shows the elapsed time.
minesCounter: HTMLElement - Shows the number of remaining mines.
heartsDisplay: HTMLElement - Shows the number of hearts left.
minimap: HTMLElement - Displays a minimap of the board.
settingsMenu: HTMLElement - Displays character customization options.
Methods
updateTime()
Behavior: Updates the timer display every second.
updateMinesCounter()
Behavior: Updates the mine counter based on flagged squares.
showEndScreen(win: boolean)
Behavior: Displays the game-over or win screen.
toggleMinimap()
Behavior: Shows or hides the minimap.
openSettings()
Behavior: Opens the character customization menu.
6. CosmeticManager
Handles the logic for unlocking and managing cosmetics.

Variables
cosmeticProbability: float - Base probability of finding a cosmetic.
cosmeticsUnlocked: List<Cosmetic> - List of cosmetics the player has unlocked.
Methods
generateCosmetic()
Behavior: Determines if a cosmetic is unlocked when a cell is revealed.
adjustProbability()
Behavior: Decreases the probability of unlocking a cosmetic as more squares are revealed.
7. Utility Classes
Point
Represents coordinates on the board.

Variables
x: int - The x-coordinate.
y: int - The y-coordinate.
Cosmetic
Represents collectible items the player can use for customization.

Variables
name: String - Name of the cosmetic.
type: String - Type of cosmetic (e.g., hat, color).
isEquipped: boolean - Indicates if the cosmetic is currently equipped.


1 Game Grid and Board Generation
Grid Generation and Layout: The board should be a 2D array where each cell can store data about the mine status, the number of adjacent mines, and whether it has been revealed. Here’s the process:

Data Structure: Use a 2D array of say "landOrWater" objects that have a bunch of booleans to represent each square’s properties, like { hasMine: true/false, adjacentMines: int, revealed: true/false, flagged: true/false }.
- isLand checks if the object is land or not
    - if isLand is true, squares would have a new hasMine parameter that checks whether or not to have a mine there
        - hasMine would use Math.random() * 2 to randomize the squares that would have mines
- hasCosmetic would use Math.random() * probability where probability is an integer that represents the user's  likelihood to unluck a cosmetic
    - probability decreases as they unlock more squares to reward for getting further in the game (this means that the user is more likely to get something)

Game Generation: generate from top left to bottom right, assigning the parameters as you go
- design maps (ie a ukraine-shaped island) and save them in a database
    - stored as a 2D array, where some squares are land and other squares are water, other parameters just set to false or null
- pull from that database to start map generation
- nested for loop to go through, randomly assigning the land squares to have mines and/or cosmetics

Random Mine Placement: Start by placing mines at random positions. You can calculate adjacency numbers after mine placement using a nested loop that increments the adjacentMines value of neighboring cells.
- each non-mine land square has an int parameter called "numMines" that represents the number of mines around it
- nested for loop goes through the whole map checking for mines
    - if square is a mine, increment the numMine parameter for all non-mine squares that are one tile away (including diagonals)

Ensure Solvability: Ensure the player starts in a mine-free area and make sure there are no 2x2 or greater areas of only mines
- first square the player clicks on should start with a 3x3 square of safe squares around it
- then generate the rest of the board

- as you generate the mines, make sure the top, top-left, left squares relative to the square you are on are not mines to prevent 2x2 and greater shapes that would otherwise make the game chance-based 
- you are generating cosmetics in the same loop, but make sure you do cosmetics after the mine to make sure you don't generate a cosmetic on a square with a mine

2. Player Movement and Interactions
Movement
Grid-Based Movement: Move the player using arrow keys or WASD. The player should only move on revealed tiles.
- they can only walk left, right, forwards, or backwards
- they cannot walk onto water

Field of View: To create a limited view, use a radius-based approach where only squares within a certain radius are revealed. Adjust this dynamically based on player’s movement.
- we are viewing from above, so only show squares say 8 squares to the right and left and 6 squares above and below 
    - (these numbers might not be right, adjust them for what works later)
- as they move to the right, show the newly revealed squares to the right and hide the squares to the left

Square Interaction
Reveal Squares: Map the space or enter key to reveal the tile in front of the player, updating the cell’s state.
Flag Squares: Map right-click to flag a tile, changing its flagged property.
Life System
Heart Display and Mechanics: Show hearts on the UI using an array representing the player’s current health. If the player hits a mine, decrement a heart and mark the square with a distinct black mine icon.

3. Map and UI Elements
HUD Components
Top Left Timer: Start a simple timer with the board and update it every second.
Top Right Mines Counter: Display the number of unmarked mines based on the flagged status of each cell.
Reset Button: Attach an on-click event to reset all game parameters (board, timer, etc.).
Minimap (Bottom Right): Implement a mini-map that displays the entire board. The mini-map is only interactive if you allow clicking for an expanded view.
Character Customization (Bottom Left): Use a settings menu with options to change skins or colors.
End Screen
Display a screen that shows total play time, squares revealed, and the player's best score if available.
4. Game Logic and Win/Loss Conditions
Win Condition
Track the number of revealed squares, checking if the total equals the number of non-mine squares on each reveal action.
When this count matches, show the win screen.
Loss Condition
Trigger a game-over screen if hearts are depleted.
5. Random Cosmetics Drops
Use a small probability calculation after each revealed square to determine if a cosmetic is awarded.
Increment the probability slightly with each reveal to give players increasing chances over time.
6. Core Visuals and Assets
Pastel Pixel Art Theme
Use a simple CSS style for each cell, making sure revealed numbers and mines have high contrast for accessibility.
Player Sprite: Design a dog sprite (or other character), and set it as a CSS background-image for player’s cell.
Overlays and Background Elements
Add small decorative tiles like trees and water. These can be randomly placed on unrevealed tiles without mines.
7. Technical Stack
HTML, CSS, and JavaScript (Canvas API)
HTML: Set up the layout with basic div elements for the board and UI sections. Use CSS grid or flexbox for alignment.
CSS: Style each cell, including hover states for unrevealed tiles. Use CSS transitions for smoother reveals.
JavaScript (Game Logic): Handle the core mechanics, like grid generation, mine placement, and interaction.
Canvas API (Optional): If you want smoother animations and rendering control, consider using the Canvas API for the board instead of HTML elements.