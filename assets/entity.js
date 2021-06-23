class Entity extends Glyph {
    constructor(properties = {}) {
        super(properties)
        this._name = properties.name || ""
        this._x = properties.x || 0
        this._y = properties.y || 0
        this._attachedMixins = {}
        const mixins = properties.mixins || []
        for (let i = 0; i < mixins.length; i++) {
            for (let key in mixins[i]) {
                if (
                    key !== "init" &&
                    key !== "init" &&
                    !this.hasOwnProperty(key)
                ) {
                    this[key] = mixins[i][key]
                }
            }
            this._attachedMixins[mixins[i].name] = true
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
        return this._attachedMixins[obj]
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

    getName() {
        return this._name
    }

    getX() {
        return this._x
    }

    getY() {
        return this._y
    }
}
