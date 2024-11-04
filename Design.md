# Overview
Minesweeper is a classic puzzle game. The objective is to click every square on a board without hitting any mines.

### Option: Web Game Design
**Game Title**: Sweeper of the Mines  
**Goal**: Provide a fresh take on Minesweeper. Make it prettier and more fun to play for a wider audience.  
**Target Audience**: 6 and up  
**Interests**: Casual gamers, Minesweeper enthusiasts  

# Functionality

## Rules
In classic Minesweeper, there is a rectangular grid with mines scattered throughout (traditionally 16x30 with 99 mines). A player can click on any of the squares.

- If a player clicks on a square with a mine, they lose.
- If a player clicks on a square without a mine, then the square reveals the number of mines adjacent to it (a number from 1-8).
- If a revealed square does not have any mines adjacent to it, then every square around it is revealed automatically (which in turn can reveal more squares with no adjacent mines).
- The player can mark squares where they believe mines are.
- If a player reveals all of the squares that do not contain mines, they win (they do not have to mark every square with a mine).

## Player
In this version of Minesweeper, the player is a controllable 2D player. They should be able to run around the physical Minesweeper board with the camera following them. Their field of view will be limited, but there should be a hotkey to show a map of the entire board (perhaps **M**).

The player should be able to do the equivalent of “clicking” on a square by facing in the direction of the square and pressing **space** or **enter**. This should give the player multiple possibilities of squares to click on, much like how one would move a king on chess.com. Right-clicking on a square will flag it, and left-clicking on a square will reveal it.


### Other Mechanics
- The player should start with three “lives” (or hearts on the bottom left corner of the screen).
- If a player discovers a bench, they should be able to interact with it by pressing **space** or **enter**, and gain an extra heart.
- If a player clicks on a mine, they should lose a heart, and the mine should be marked with a black Mine (not a heart).
+++(Since we have three lives instead of one, wouldn't having different types of mines make the game more interesting?)
- The player should be able to walk around on revealed squares only.
(How does walking on revealed squares only change the experience from the normal game?)
+++(One thing I think would be interesting if that the player can wander onto the first row of neighboring squares, and if it is a mine, then it should explode)

## UI Elements
Whether the player ultimately wins or loses, a little postgame screen should pop up that details the total time (in seconds) spent playing the game and how many squares were revealed. If the player has previously won, also show their best time.


## Map Generation
The player should start automatically on a random square with no mines.  
The board should be pseudo-randomly generated in such a way that no guessing is necessary.
+++(Wouldn't only revealing one square make the star incredibly difficult? for example starting on a square that is 1 makes the first move a guess)

# Visuals

### Theme
- **Pastel pixel art**: Nothing should be too overwhelming.
- Numbers on the board should be in high contrast against their backgrounds.
- The player should play as this dog. 
+++(Customizable characters based on progression through total mines revealed on your account, ith different health/abilities for a fresh game)
- Classic Minesweeper numbers, flags, and mine sprites should be overlaid on the following tileset.
+++(I think it would be really interesting if you didn't know the shape of the map and it was generated in specific shapes to make the figuring out experience more novel)
- If there is room on the board (where there are no numbers to be obstructed), add trees, water, bridges, and benches randomly as little easter eggs to discover.
- Unrevealed squares should look like this (mines can be placed on top of it without changing the texture).

# Layout
- The Minesweeper board should occupy the majority of the screen.
- While the game is being played, have a counter in the top left that details how much time has been spent on the current board (in seconds).
- On the top right, have a counter that says how many mines remain unmarked.
+++(This is a very simple and strongly presented game that is easy to understand. Good Job :)