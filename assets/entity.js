class Entity extends Glyph {
    constructor(properties = {}) {
        super(properties)
        this._name = properties.name || ""
        this._x = properties.x || 0
        this._y = properties.y || 0
        this._map = null

        this._attachedMixins = {}
        this._attachedMixinGroups = {}

        const mixins = properties.mixins || []

        // if this has an undefined error, make sure entities are in correct order
        for (let i = 0; i < mixins.length; i++) {
            for (let key in mixins[i]) {
                if (
                    key !== "init" &&
                    key !== "name" &&
                    !this.hasOwnProperty(key)
                ) {
                    this[key] = mixins[i][key]
                }
            }
            this._attachedMixins[mixins[i].name] = true

            // If a group name is present, add it
            if (mixins[i].groupName) {
                this._attachedMixinGroups[mixins[i].groupName] = true
            }

            if (mixins[i].init) {
                mixins[i].init(this, properties)
            }
        }
    }

    // for some reason the param is given as obj even though it can be a string
    hasMixin(obj) {
        if (typeof obj === "object") {
            return this._attachedMixins[obj.name]
        }
        return this._attachedMixins[obj] || this._attachedMixinGroups[obj]
    }

    setName(name) {
        this._name = name
    }

    setX(x) {
        this._x = x
    }

    setY(y) {
        this._y = y
    }

    setMap(map) {
        this._map = map
    }

    getName() {
        return this._name
    }

    getX() {
        return this._x
    }

    getY() {
        return this._y
    }

    getMap() {
        return this._map
    }
}
