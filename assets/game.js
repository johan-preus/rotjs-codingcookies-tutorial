const Game = {
    // dunno why these variables are private
    _display: null,
    _currentScreen: null,
    _screenWidth: 80,
    _screenHeight: 24,

    init() {
        this._display = new ROT.Display({
            width: this._screenWidth,
            height: this._screenHeight,
        })
        const bindEventToScreen = (event) => {
            window.addEventListener(event, (e) => {
                if (this._currentScreen !== null) {
                    this._currentScreen.handleInput(event, e)
                    // this._display.clear()
                    // this._currentScreen.render(this._display)
                    this.refresh() //is this line supposed to be here?
                }
            })
        }
        bindEventToScreen("keydown")
        bindEventToScreen("keyup")
        bindEventToScreen("keypress")
    },
    refresh(){
        this._display.clear()
        this._currentScreen.render(this._display)
    },
    getDisplay() {
        return this._display
    },
    getScreenWidth() {
        return this._screenWidth
    },
    getScreenHeight() {
        return this._screenHeight
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
