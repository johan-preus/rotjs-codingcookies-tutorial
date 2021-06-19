// a glyph is a combination of character and foreground/background colors
Game.Glyph = function (chr = "", foreground = "white", background = "black") {
    this._char = chr
    this._foreground = foreground
    this._background = background
}

Game.Glyph.prototype.getChar = function () {
    return this._char
}
Game.Glyph.prototype.getBackground = function () {
    return this._background
}
Game.Glyph.prototype.getForeground = function () {
    return this._foreground
}