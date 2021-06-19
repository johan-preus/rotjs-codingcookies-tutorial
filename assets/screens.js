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
    enter() {
        console.log("Entered play screen")
        const map = []
        for (let x = 0; x < 80; x++) {
            map.push([])
            for (let y = 0; y < 24; y++) {
                map[x].push(Game.Tile.nullTile)
            }
        }
        const generator = new ROT.Map.Cellular(80, 24)
        generator.randomize(0.5)
        let totalIterations = 3
        // Iteratively smoothen the map, will make more consistently shaped and connected maps
        for (let i = 0; i < totalIterations - 1; i++) {
            generator.create()
        }
        // Smoothen it one last time and then update our map
        generator.create((x, y, v) => {
            if (v === 1) {
                map[x][y] = Game.Tile.floorTile
            } else {
                map[x][y] = Game.Tile.wallTile
            }
        })
        this._map = new Game.Map(map)
    },
    exit() {
        console.log("Exited play screen")
    },
    render(display) {
        for (let x = 0; x < this._map.getWidth(); x++) {
            for (let y = 0; y < this._map.getHeight(); y++) {
                const glyph = this._map.getTile(x, y).getGlyph()
                display.draw(
                    x,
                    y,
                    glyph.getChar(),
                    glyph.getForeground(),
                    glyph.getBackground()
                )
            }
        }
    },
    handleInput(inputType, inputData) {
        if (inputType === "keydown") {
            if (inputData.keyCode === 13) {
                Game.switchScreen(Game.Screen.winScreen)
            } else if (inputData.keyCode === 27) {
                Game.switchScreen(Game.Screen.loseScreen)
            }
        }
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
