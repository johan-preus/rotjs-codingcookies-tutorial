Game.Map = function (tiles, player) {
    this._tiles = tiles
    this._width = tiles.length
    this._height = tiles[0].length
    this._entities = []
    this._scheduler = new ROT.Scheduler.Simple()
    this._engine = new ROT.Engine(this._scheduler)
    this.addEntityAtRandomPosition(player)
    for (let i = 0; i < 50; i++) {
        this.addEntityAtRandomPosition(new Entity(Game.FungusTemplate))
    }
}

Game.Map.prototype.getWidth = function () {
    return this._width
}
Game.Map.prototype.getHeight = function () {
    return this._height
}
Game.Map.prototype.getTile = function (x, y) {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        // return Game.Tile.nullTile
        return nullTile
    }
    // return this._tiles[x][y] || Game.Tile.nullTile
    return this._tiles[x][y] || nullTile
}
Game.Map.prototype.getEngine = function () {
    return this._engine
}
Game.Map.prototype.getEntities = function () {
    return this._entities
}
Game.Map.prototype.getEntityAt = function (x, y) {
    // should maybe use filter instead, would allow more than 1 entity in same tile
    for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i].getX() === x && this._entities[i].getY() === y) {
            return this._entities[i]
        }
    }
    return false
}

Game.Map.prototype.addEntity = function (entity) {
    if (
        entity.getX() < 0 ||
        entity.getX() >= this._width ||
        entity.getY() < 0 ||
        entity.getY() >= this._height
    ) {
        throw new Error("Adding entity out of bounds")
    }
    entity.setMap(this)
    this._entities.push(entity)

    if (entity.hasMixin("Actor")) {
        this._scheduler.add(entity, true)
    }
}

Game.Map.prototype.addEntityAtRandomPosition = function (entity) {
    const position = this.getRandomFloorPosition()
    entity.setX(position.x)
    entity.setY(position.y)
    this.addEntity(entity)
}

Game.Map.prototype.removeEntity = function (entity) {
    for (let i = 0; i < this._entities.length; i++) {
        if (this._entities[i] === entity) {
            this._entities.splice(i, 1)
            break
        }
    }
    if (entity.hasMixin("Actor")) {
        this._scheduler.remove(entity)
    }
}

Game.Map.prototype.dig = function (x, y) {
    if (this.getTile(x, y).isDiggable()) {
        this._tiles[x][y] = floorTile
    }
}

Game.Map.prototype.getRandomFloorPosition = function () {
    let x, y
    do {
        x = Math.floor(Math.random() * this._width)
        y = Math.floor(Math.random() * this._height)
    } while (!this.isEmptyFloor(x, y))
    return { x: x, y: y }
}

Game.Map.prototype.isEmptyFloor = function (x, y) {
    return this.getTile(x, y) === floorTile && !this.getEntityAt(x, y)
}

Game.Map.prototype.getEntitiesWithinRadius = function (
    centerX,
    centerY,
    radius
) {
    const results = []
    const leftX = centerX - radius
    const rightX = centerX + radius
    const topY = centerY - radius
    const bottomY = centerY + radius
    for (let i = 0; i < this._entities.length; i++) {
        if (
            this._entities[i].getX() >= leftX &&
            this._entities[i].getX() <= rightX &&
            this._entities[i].getY() >= topY &&
            this._entities[i].getY() <= bottomY
        ) {
            results.push(this._entities[i])
        }
    }
    return results
}
