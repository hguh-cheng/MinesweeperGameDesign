# CURRENT PROGRESS

## simple mechanics

    - arrow keys to move around
    - enter to open an unrevealed tile
    - space to flag a square
    - m to open minimap
    - three lives (lose a life for every mine revealed)

## board generation

    - mines generate
    - first reveal is guaranteed to clear an area

## UI

    - shows time elapsed
    - shows mines remaining (total mines - flags placed)
    - minimap preview in bottom right corner

# NEXT STEPS (rough order of importance)

## fixes

    - if all non-mine tiles are revealed, the game should tell the player that they've won. nothing happens so far
    - UI elements (mine count, timer, minimap) should not cover the board. move them just outside the canvas.

## additional features

    - allow resetting during the game, and let the player restart after the game is over
    - keep track of personal best scores/make a global leaderboard
    - togglable difficulty
        - difficulty ~ mine density, and perhaps more difficult boards are in the shape of real-life countries that are more populated with landmines
    - ensure solvability (seems difficult & I'm not really sure how to do this)

## aesthetic

    - the board should be textured in a pixelated pastel artform. unrevealed squares should be dark and mysterious. revealed squares should vary between grass, dirt, stone, water, etc. in a way that makes visual sense
    - the character should be a dude running around instead of a square
    - fonts can/should be changed
    - minimap should match with board colors
