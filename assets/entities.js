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

Game.Mixins.MessageRecipient = {
    name: "MessageRecipient",
    init:  function (template) {
        // console.log('hi')
        // console.log(this)
        this._messages = []
    },
    receiveMessage: function (message) {
        // console.log('hi')
        // console.log(this)
        this._messages.push(message)
    },
    getMessages: function () {
        return this._messages
    },
    clearMessages: function () {
        // console.log('hi')
        // console.log(this);
        this._messages = []
    },
}

// args param is probably unnecessary with template literals
Game.sendMessage = function (recipient, message, args) {
    if (recipient.hasMixin(Game.Mixins.MessageRecipient)) {
        if (args) {
            message = vsprintf(message, args)
        }
        recipient.receiveMessage(message)
    }
}

Game.sendMessageNearby = function (map, centerX, centerY, message, args) {
    if (args) {
        message = vsprintf(message, args)
    }
    // hardcoded as 5 for now
    const entities = map.getEntitiesWithinRadius(centerX, centerY, 5)
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
            entities[i].receiveMessage(message)
        }
    }
}

Game.Mixins.PlayerActor = {
    name: "PlayerActor",
    groupName: "Actor",
    act: function () {
        Game.refresh()
        this.getMap().getEngine().lock()
        this.clearMessages()
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

                        Game.sendMessageNearby(
                            this.getMap(),
                            entity.getX(),
                            entity.getY(),
                            "The fungus is spreading!"
                        )
                    }
                }
            }
        }
    },
}

Game.Mixins.Destructible = {
    name: "Destructible",
    init: function (obj, template) {
        this._maxHp = template.maxHp || 10
        // template has hp to allow starting with different value than max
        this._hp = template.hp || this._maxHp
        this._defenseValue = template.defenseValue || 0
    },
    getHp: function () {
        return this._hp
    },
    getMaxHp: function () {
        return this._maxHp
    },
    getDefenseValue: function () {
        return this._defenseValue
    },
    takeDamage: function (attacker, damage) {
        this._hp -= damage
        if (this._hp <= 0) {
            Game.sendMessage(attacker, "You kill the %s!", [this.getName()])
            Game.sendMessage(this, "You die!")
            this.getMap().removeEntity(this)
        }
    },
}

Game.Mixins.Attacker = {
    name: "Attacker",
    groupName: "Attacker",
    init: function (obj, template) {
        // console.log(template.attackValue)
        // console.log(template)
        this._attackValue = template.attackValue || 1
    },
    getAttackValue: function () {
        return this._attackValue
    },
    attack: function (target) {
        if (target.hasMixin("Destructible")) {
            const attack = this.getAttackValue()
            const defense = target.getDefenseValue()
            const max = Math.max(0, attack - defense)
            // Deal random damage between 1 and max (inclusive)
            const damage = 1 + Math.floor(Math.random() * max)
            Game.sendMessage(this, "You strike the %s for %d damage!", [
                target.getName(),
                damage,
            ])
            Game.sendMessage(target, "The %s strikes you for %d damage!", [
                this.getName(),
                damage,
            ])
            target.takeDamage(this, damage)
        }
    },
}

Game.FungusTemplate = {
    name: "fungus",
    char: "F",
    foreground: "green",
    maxHp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible],
}

Game.PlayerTemplate = {
    char: "@",
    foreground: "white",
    background: "black",
    maxHp: 40,
    attackValue: 10,
    mixins: [
        Game.Mixins.moveable,
        Game.Mixins.PlayerActor,
        Game.Mixins.Attacker,
        Game.Mixins.Destructible,
        Game.Mixins.MessageRecipient,
    ],
}
