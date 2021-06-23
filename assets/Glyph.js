// a glyph is a combination of character and foreground/background colors
class Glyph {
    constructor(properties = {}) {
        this._char = properties.char || ""
        this._foreground = properties.foreground || "white"
        this._background = properties.background || "black"
    }
    getChar() {
        return this._char
    }
    getBackground() {
        return this._background
    }
    getForeground() {
        return this._foreground
    }
}

// Game.Glyph = function (properties = {}) {
//     this._char = properties.char || " "
//     this._foreground = properties.foreground || "white"
//     this._background = properties.background || "black"
// }

// Game.Glyph.prototype.getChar = function () {
//     return this._char
// }
// Game.Glyph.prototype.getBackground = function () {
//     return this._background
// }
// Game.Glyph.prototype.getForeground = function () {
//     return this._foreground
// }
