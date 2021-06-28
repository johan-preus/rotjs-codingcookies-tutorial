Game.Map = function(tiles){
    this._tiles = tiles
    this._width = tiles.length
    this._height = tiles[0].length
    this._entities = []
    this._scheduler = new ROT.Scheduler.Simple()
    this._engine = new ROT.Engine(this._scheduler)
}

Game.Map.prototype.getWidth = function(){
    return this._width
}
Game.Map.prototype.getHeight = function(){
    return this._height
}
Game.Map.prototype.getTile = function(x, y){
    if(x < 0 || x >= this._width || y < 0 || y >= this._height){
        // return Game.Tile.nullTile
        return nullTile
    }
    // return this._tiles[x][y] || Game.Tile.nullTile
    return this._tiles[x][y] || nullTile
}
Game.Map.prototype.getEngine = function(){
    return this._engine
}
Game.Map.prototype.getEntities = function() {
    return this._entities;
}
Game.Map.prototype.getEntityAt = function(x, y){
    // should maybe use filter instead, would allow more than 1 entity in same tile
    for(let i = 0; i < this._entities.length; i++){
        if(this._entities[i].getX() === x && this._entities[i].getY() === y){
            return this._entities[i]
        }
    }
    return false
}

Game.Map.prototype.dig = function(x, y){
    if(this.getTile(x, y).isDiggable()){
        this._tiles[x][y] = floorTile
    }
}

Game.Map.prototype.getRandomFloorPosition = function(){
    let x, y
    do {
        x = Math.floor(Math.random() * this._width)
        y = Math.floor(Math.random() * this._height)
    } while(this.getTile(x, y) != floorTile)
    return {x: x, y: y}
}