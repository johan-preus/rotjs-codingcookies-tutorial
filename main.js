const Game = {
    // dunno why these variables are private
    _display: null,
    _currentScreen: null,

    init() {
        this._display = new ROT.Display({ width: 80, height: 24 })
        const bindEventToScreen = (event) => {
            window.addEventListener(event, (e) => {
                if (this._currentScreen !== null) {
                    this._currentScreen.handleInput(event, e)
                }
            })
        }
        bindEventToScreen("keydown")
        bindEventToScreen("keyup")
        bindEventToScreen("keypress")
    },
    getDisplay() {
        return this._display
    },
    switchScreen(screen) {
        if (this._currentScreen !== null) {
            this._currentScreen.exit()
        }
        this.getDisplay().clear()
        this._currentScreen = screen
        if (!this._currentScreen !== null) {
            this._currentScreen.enter()
            this._currentScreen.render(this._display)
        }
    },
}








window.onload = function () {
    Game.init()
    document.body.appendChild(Game.getDisplay().getContainer())
    Game.switchScreen(Game.Screen.startScreen)
}
