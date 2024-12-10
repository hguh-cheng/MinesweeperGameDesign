# CURRENT PROGRESS

## player actions

    - arrow keys to move around
    - enter to open an unrevealed tile or chord a revealed tile
    - space to flag a square
    - m to open minimap
    - three lives (lose a life for every mine revealed)

    - y = developer cheat feature. it reveals a 10 block radius around the player making it easier to playtest. should remove when game is finished.

## board mechanics

    - mines generate
    - revealed tiles either blow up or show how many mines are adjacent to them
    - revealed tiles with 0 mines around them automatically reveal all tiles around them
    - first reveal is guaranteed to clear an area
    - if a revealed tile has its number of flags placed around it, pressing enter on that tile (or "chording") reveals all adjacent non-flagged tiles

## UI

    - shows time elapsed
    - shows mines remaining (total mines - flags placed)
    - minimap preview in bottom right corner
    - menu gamestate
    - win gamestate with restart or menu buttons that happens when all non-mine tiles are revealed
    - UI elements no longer impede vision: opacity of mini map changes when player collides with it allowing to see under it in the bottom right corner
    - can restart after the game is over

# NEXT STEPS

## fixes

    - not that important but I lowk don't know why I made "water" tiles mean tiles with mines on them. it just turned out that way and I never bothered to change it. but don't be mistaken. they are mines. you might want to change that for your convenience
    - i can't figure out how to separate my script.js into multiple files lmao. sorry

## additional features

    - (VERY PRESSING) allow resetting during the game. i would make a pause menu where you can do this.
    - keep track of personal best scores/make a global leaderboard
    - togglable difficulty
        - difficulty ~ mine density, and perhaps more difficult boards are in the shape of real-life countries that are more populated with landmines
        - make selectable sizes because rn it takes so long to finish the current map
    - ensure solvability (seems difficult & I'm not really sure how to do this)

## aesthetic

    - the board should be textured in a pixelated pastel artform. unrevealed squares should be dark and mysterious. revealed squares should vary between grass, dirt, stone, water, etc. in a way that makes visual sense
    - the character should be a dude running around instead of a square
    - fonts can/should be changed
    - minimap should match with board colors
    - numbers of mines should vary depending on the number
