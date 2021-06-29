Game.Mixins = {}

Game.Mixins.moveable = {
    name: "Moveable",
    tryMove: function (x, y, map) {
        const tile = map.getTile(x, y)
        const target = map.getEntityAt(x, y)
        if (target) {
            if (this.hasMixin("Attacker")) {
                this.attack(target)
                return true
            }
            return false
        }
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

Game.Mixins.FungusActor = {
    name: "FungusActor",
    groupName: "Actor",
    init: function () {
        this._growthsRemaining = 5
    },
    act: function () {
        if (this._growthsRemaining) {
            // check if we try growing this turn
            if (Math.random() <= 0.02) {
                const xOffset = Math.floor(Math.random() * 3) - 1
                const yOffset = Math.floor(Math.random() * 3) - 1
                // check we aren't spawning on ourself
                if (xOffset !== 0 || yOffset !== 0) {
                    const x = this.getX() + xOffset
                    const y = this.getY() + yOffset
                    if (this.getMap().isEmptyFloor(x, y)) {
                        const entity = new Entity(Game.FungusTemplate)
                        entity.setX(x)
                        entity.setY(y)
                        this.getMap().addEntity(entity)
                        this._growthsRemaining--
                    }
                }
            }
        }
    },
}

Game.Mixins.Destructible = {
    name: "Destructible",
    init: function () {
        this._hp = 1
    },
    takeDamage: function (attacker, damage) {
        this._hp -= damage
        if (this._hp <= 0) {
            this.getMap().removeEntity(this)
        }
    },
}

Game.Mixins.SimpleAttacker = {
    name: "SimpleAttacker",
    groupName: "Attacker",
    attack: function (target) {
        if (target.hasMixin("Destructible")) {
            target.takeDamage(this, 1)
        }
    },
}

Game.FungusTemplate = {
    char: "F",
    foreground: "green",
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible],
}

Game.PlayerTemplate = {
    char: "@",
    foreground: "white",
    background: "black",
    mixins: [
        Game.Mixins.moveable,
        Game.Mixins.PlayerActor,
        Game.Mixins.SimpleAttacker,
        Game.Mixins.Destructible,
    ],
}
