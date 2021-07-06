Game.Builder = function (width, height, depth) {
    this._width = width
    this._height = height
    this._depth = depth
    // array constructor new Array(num) will create an array with length of num
    // if array constructor is given a variable or more than 1 number, instead makes an array like normal
    this._tiles = new Array(depth)
    this._regions = new Array(depth)

    for (let z = 0; z < depth; z++) {
        // make new cave at each level
        this._tiles[z] = this._generateLevel()
        this._regions[z] = new Array(width)
        for (let x = 0; x < width; x++) {
            this._regions[z][x] = new Array(height)
            // fill with 0's
            for (let y = 0; y < height; y++) {
                this._regions[z][x][y] = 0
            }
        }
    }
}

Game.Builder.prototype._generateLevel = function () {
    const map = new Array(this._width)
    for (let w = 0; w < this._width; w++) {
        map[w] = new Array(this._height)
    }
    const generator = new ROT.Map.Cellular(this._width, this._height)
    generator.randomize(0.5)
    const totalIterations = 3
    // Iteratively smoothen the map
    for (let i = 0; i < totalIterations - 1; i++) {
        generator.create()
    }
    // Smoothen it one last time and then update our map
    generator.create(function (x, y, v) {
        if (v === 1) {
            map[x][y] = floorTile
        } else {
            map[x][y] = wallTile
        }
    })
    return map
}

Game.Builder.prototype._canFillRegion = function (x, y, z) {
    // make sure tile within bounds
    if (
        x < 0 ||
        y < 0 ||
        z < 0 ||
        x >= this._width ||
        y >= this._height ||
        z >= this._depth
    ) {
        return false
    }
    // make sure tile doesnt already have region
    if (this._regions[z][x][y] !== 0) {
        return false
    }
    return this._tiles[z][x][y].isWalkable()
}

Game.Builder.prototype._fillRegion = function (region, x, y, z) {
    let tilesFilled = 1
    const tiles = [{ x: x, y: y }]
    let tile, neighbors
    this._regions[z][x][y] = region
    while (tiles.length > 0) {
        tile = tiles.pop()
        neighbors = Game.getNeighborPositions(tile.x, tile.y)
        while (neighbors.length > 0) {
            tile = neighbors.pop()
            if (this._canFillRegion(tile.x, tile.y, z)) {
                this._regions[z][tile.x][tile.y] = region
                tiles.push(tile)
                tilesFilled++
            }
        }
    }
    return tilesFilled
}

// This removes all tiles at a given depth level with a region number.
// It fills the tiles with a wall tile.
Game.Builder.prototype._removeRegion = function (region, z) {
    for (let x = 0; x < this._width; x++) {
        for (let y = 0; y < this._height; y++) {
            if (this._regions[z][x][y] === region) {
                this._regions[z][x][y] = 0
                this._tiles[z][x][y] = wallTile
            }
        }
    }
}

Game.Builder.prototype._setupRegions = function (z) {
    let region = 1
    let tilesFilled
    for (let x = 0; x < this._width; x++) {
        for (let y = 0; y < this._height; y++) {
            if (this._canFillRegion(x, y, z)) {
                tilesFilled = this._fillRegion(region, x, y, z)
                // if too small remove it
                if (tilesFilled <= 20) {
                    this._removeRegion(region, z)
                } else {
                    region++
                }
            }
        }
    }
}

// This fetches a list of points that overlap between one
// region at a given depth level and a region at a level beneath it.
Game.Builder.prototype._findRegionOverlaps = function (z, r1, r2) {
    const matches = []
    // Iterate through all tiles, checking if they respect
    // the region constraints and are floor tiles. We check
    // that they are floor to make sure we don't try to
    // put two stairs on the same tile.
    for (let x = 0; x < this._width; x++) {
        for (let y = 0; y < this._height; y++) {
            if (
                this._tiles[z][x][y] === floorTile &&
                this._tiles[z + 1][x][y] === floorTile &&
                this._regions[z][x][y] === r1 &&
                this._regions[z + 1][x][y] === r2
            ) {
                matches.push({ x: x, y: y })
            }
        }
    }
    return matches.randomize()
}
