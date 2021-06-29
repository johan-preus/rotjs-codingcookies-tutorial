Game.Mixins = {}

Game.Mixins.moveable = {
    name: "Moveable",
    tryMove: function (x, y, map) {
        const tile = map.getTile(x, y)
        const target = map.getEntityAt(x, y)
        if (target) return false
        if (tile.isWalkable()) {
            this._x = x
            this._y = y
            return true
        }
        if (tile.isDiggable()) {
            map.dig(x, y)
            return true
        }
        return false
    },
}

Game.Mixins.PlayerActor = {
    name: "PlayerActor",
    groupName: "Actor",
    act: function () {
        Game.refresh()
        this.getMap().getEngine().lock()
    },
}

Game.PlayerTemplate = {
    char: "@",
    foreground: "white",
    background: "black",
    mixins: [Game.Mixins.moveable, Game.Mixins.PlayerActor],
}

Game.Mixins.FungusActor = {
    name: "FungusActor",
    groupName: "Actor",
    act: function () {},
}

Game.FungusTemplate = {
    char: "F",
    foreground: "green",
    mixins: [Game.Mixins.FungusActor],
}
