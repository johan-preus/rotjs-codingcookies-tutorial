Game.Screen = {}

Game.Screen.startScreen = {
    enter() {
        console.log("Entered start screen")
    },
    exit() {
        console.log("Exited start screen")
    },
    render(display) {
        display.drawText(1, 1, "%c{yellow}Javascript Roguelike")
        display.drawText(1, 2, "Press [Enter] to start")
    },
    handleInput(inputType, inputData) {
        if (inputType === "keydown") {
            if (inputData.keyCode === 13) {
                Game.switchScreen(Game.Screen.playScreen)
            }
        }
    },
}

Game.Screen.playScreen = {
    _map: null,
    // _centerX: 0,
    // _centerY: 0,
    enter() {
        console.log("Entered play screen")
        const map = []
        const mapWidth = 500
        const mapHeight = 500
        for (let x = 0; x < mapWidth; x++) {
            map.push([])
            for (let y = 0; y < mapHeight; y++) {
                // map[x].push(Game.Tile.nullTile)
                map[x].push(nullTile)
            }
        }
        const generator = new ROT.Map.Cellular(mapWidth, mapHeight)
        generator.randomize(0.5)
        let totalIterations = 3
        // Iteratively smoothen the map, will make more consistently shaped and connected maps
        for (let i = 0; i < totalIterations - 1; i++) {
            generator.create()
        }
        // Smoothen it one last time and then update our map
        generator.create((x, y, v) => {
            if (v === 1) {
                // map[x][y] = Game.Tile.floorTile
                map[x][y] = floorTile
            } else {
                // map[x][y] = Game.Tile.wallTile
                map[x][y] = wallTile
            }
        })
        this._map = new Game.Map(map)
        this._player = new Entity(Game.PlayerTemplate)
        const position = this._map.getRandomFloorPosition()
        this._player.setX(position.x)
        this._player.setY(position.y)
    },
    exit() {
        console.log("Exited play screen")
    },
    render(display) {
        const screenWidth = Game.getScreenWidth()
        const screenHeight = Game.getScreenHeight()

        // Make sure the x-axis doesn't go to the left of the left bound
        let topLeftX = Math.max(0, this._player.getX() - screenWidth / 2)
        // Make sure we still have enough space to fit an entire game screen
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth)

        let topLeftY = Math.max(0, this._player.getY() - screenHeight / 2)
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight)
        for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
                const tile = this._map.getTile(x, y)
                // rendered relative to the top left cell
                display.draw(
                    x - topLeftX,
                    y - topLeftY,
                    tile.getChar(),
                    tile.getForeground(),
                    tile.getBackground()
                )
            }
        }
        display.draw(
            this._player.getX() - topLeftX,
            this._player.getY() - topLeftY,
            this._player.getChar(),
            this._player.getForeground(),
            this._player.getBackground()
        )
    },
    handleInput(inputType, inputData) {
        if (inputType === "keydown") {
            if (inputData.keyCode === 13) {
                Game.switchScreen(Game.Screen.winScreen)
            } else if (inputData.keyCode === 27) {
                Game.switchScreen(Game.Screen.loseScreen)
            }
            if (inputData.keyCode === 97) {
                this.move(-1, 1)
            } else if (inputData.keyCode === 98) {
                this.move(0, 1)
            } else if (inputData.keyCode === 99) {
                this.move(1, 1)
            } else if (inputData.keyCode === 100) {
                this.move(-1, 0)
            } else if (inputData.keyCode === 102) {
                this.move(1, 0)
            } else if (inputData.keyCode === 103) {
                this.move(-1, -1)
            } else if (inputData.keyCode === 104) {
                this.move(0, -1)
            } else if (inputData.keyCode === 105) {
                this.move(1, -1)
            }
        }
    },
    move(dX, dY) {
        // Positive dX means movement right
        // negative means movement left
        // 0 means none
        // Note that we have to subtract 1 from the map's width and height to get the real index of the last cell as arrays are 0-based.
        // max and min used to ensure staying within bounds
        const newX = this._player.getX() + dX
        const newY = this._player.getY() + dY
        this._player.tryMove(newX, newY, this._map)
    },
}

Game.Screen.winScreen = {
    enter() {
        console.log("Entered win screen")
    },
    exit() {
        console.log("Exited win screen")
    },
    render(display) {
        for (let i = 0; i < 22; i++) {
            // should this be Math.floor instead???
            const r = Math.round(Math.random() * 255)
            const g = Math.round(Math.random() * 255)
            const b = Math.round(Math.random() * 255)
            const background = ROT.Color.toRGB([r, g, b])
            display.drawText(2, i + 1, `%b{${background}}You win!`)
        }
    },
    handleInput(inputType, inputData) {},
}

Game.Screen.loseScreen = {
    enter() {
        console.log("Entered lose screen")
    },
    exit() {
        console.log("Exited lose screen")
    },
    render(display) {
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose!")
        }
    },
    handleInput(inputType, inputData) {},
}
