Game.Screen = {}

Game.Screen.startScreen = {
    enter: function () {
        console.log("Entered start screen")
    },
    exit: function () {
        console.log("Exited start screen")
    },
    render: function (display) {
        display.drawText(1, 1, "%c{yellow}Javascript Roguelike")
        display.drawText(1, 2, "Press [Enter] to start")
    },
    handleInput: function (inputType, inputData) {
        if (inputType === "keydown") {
            if (inputData.keyCode === 13) {
                Game.switchScreen(Game.Screen.playScreen)
            }
        }
    },
}

Game.Screen.playScreen = {
    enter: function () {
        console.log("Entered play screen")
    },
    exit: function () {
        console.log("Exited play screen")
    },
    render: function (display) {
        display.drawText(3, 5, "%c{red}%b{white}This game is so much fun!")
        display.drawText(4, 6, "Press [Enter] to win, or [Esc] to lose!")
    },
    handleInput: function (inputType, inputData) {
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
    enter: function () {
        console.log("Entered win screen")
    },
    exit: function () {
        console.log("Exited win screen")
    },
    render: function (display) {
        for (let i = 0; i < 22; i++) {
            // should this be Math.floor instead???
            const r = Math.round(Math.random() * 255)
            const g = Math.round(Math.random() * 255)
            const b = Math.round(Math.random() * 255)
            const background = ROT.Color.toRGB([r, g, b])
            display.drawText(2, i + 1, `%b{${background}}You win!`)
        }
    },
    handleInput: function (inputType, inputData) {},
}

Game.Screen.loseScreen = {
    enter: function () {
        console.log("Entered lose screen")
    },
    exit: function () {
        console.log("Exited lose screen")
    },
    render: function (display) {
        for (let i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose!")
        }
    },
    handleInput: function (inputType, inputData) {},
}
