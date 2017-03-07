var Actor = function(sprite, x, y) {
  this.sprite = sprite;
  this.sprite.x = x * TILE_WIDTH;
  this.sprite.y = y * TILE_HEIGHT;
}

Object.defineProperty(Actor.prototype, 'x', {
  get: function()       { return this.sprite.x / TILE_WIDTH },
  set: function(value)  { this.sprite.x = value * TILE_WIDTH }
});

Object.defineProperty(Actor.prototype, 'y', {
  get: function()       { return this.sprite.y / TILE_HEIGHT },
  set: function(value)  { this.sprite.y = value * TILE_HEIGHT }
});

var Board = function(game, map, player) {
  this.game = game;
  this.map = map;
  this.player = player;
  this.monsters = [];
}

Board.prototype.movePiece = function(piece, dx, dy) {
  var newX = piece.x + dx;
  var newY = piece.y + dy;
  if (newX >= 0 && newX < DUNGEON_WIDTH && newY >= 0 && newY < DUNGEON_HEIGHT) {
    if (this.map.tiles[newX][newY].blocksMovement === false && !this.blockedByPiece(newX, newY)) {
      piece.x = newX;
      piece.y = newY;
      return true;
    }
  }
  return false;
}

Board.prototype.blockedByPiece = function(x, y) {
  for (var i = 0; i < this.monsters.length; i++) {
    var monster = this.monsters[i];
    if (monster.x == x && monster.y == y) {
      return true;
    }
  }
  return false;
}
