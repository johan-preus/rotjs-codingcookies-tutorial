Game.Mixins = {}

Game.Mixins.moveable = {
    name: "Moveable",
    tryMove: function (x, y, map) {
        const tile = map.getTile(x, y)
        if (tile.isWalkable()) {
            this._x = x
            this._y = y
            return true
        } else if (tile.isDiggable()) {
            map.dig(x, y)
            return true
        }
        return false
    },
}

Game.PlayerTemplate = {
    char: "@",
    foreground: "white",
    background: "black",
    mixins: [Game.Mixins.moveable],
}
