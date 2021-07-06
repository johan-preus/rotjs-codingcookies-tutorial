class Tile extends Glyph {
    constructor(properties = {}) {
        super(properties)
        this._isWalkable = properties._isWalkable || false
        this._isDiggable = properties._isDiggable || false
    }
    isWalkable() {
        return this._isWalkable
    }
    isDiggable() {
        return this._isDiggable
    }
}

const nullTile = new Tile({})
const floorTile = new Tile({
    char: ".",
    _isWalkable: true,
})
const wallTile = new Tile({
    char: "#",
    foreground: "goldenrod",
    _isDiggable: true,
})
const stairsUpTile = new Tile({
    char: "<",
    foreground: "white",
    _isWalkable: "true",
})
const stairsDownTile = new Tile({
    char: ">",
    foreground: "white",
    _isWalkable: "true",
})

Game.getNeighborPositions = function (x, y) {
    const tiles = []
    for (let dX = -1; dX < 2; dX++) {
        for (let dY = -1; dY < 2; dY++) {
            if (dX === 0 && dY === 0) {
                continue
            }
            tiles.push({ x: x + dX, y: y + dY })
        }
    }
    // randomized to prevent bias when choosing neighbor tile
    return tiles.randomize()
}

// Game.Tile = function (glyph) {
//     this._glyph = glyph
// }

// Game.Tile.prototype.getGlyph = function () {
//     return this._glyph
// }

// Game.Tile.nullTile = new Game.Tile(new Glyph())
// Game.Tile.floorTile = new Game.Tile(new Glyph({ chr: "." }))
// Game.Tile.wallTile = new Game.Tile(
//     new Glyph({
//         chr: "#",
//         foreground: "goldenrod",
//         isDiggable: true,
//     })
// )
