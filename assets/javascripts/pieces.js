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
  this.map.board = this;
  this.player = player;
  this.monsters = [];
}

Board.prototype.processMonsterTurns = function() {
  for (var i = 0; i < this.monsters.length; i++) {
    var monster = this.monsters[i];
    var dx = this.player.x - monster.x;
    var dy = this.player.y - monster.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dx = getRandomInt(-1, 1);
      dy = getRandomInt(-1, 1);
    } else {
      dx = Math.sign(dx);
      dy = Math.sign(dy);
    }

    if (dx != 0 && dy != 0) {
      if (getRandomInt(0, 1)){
        dx = 0;
      } else {
        dy = 0;
      }
    }

    this.movePiece(monster, dx, dy);
  }
}

Board.prototype.movePiece = function(piece, dx, dy) {
  if (dx == 0 && dy == 0) {
    return true;
  }
  var newX = piece.x + dx;
  var newY = piece.y + dy;
  if (this.map.tileClear(newX, newY)) {
    var blockingActor = this.blockedByActor(newX, newY);
    if (blockingActor) {
      // Attack
      this.removeActor(blockingActor);
    } else {
      // Move
      piece.x = newX;
      piece.y = newY;
      return true;
    }
  }
  return false;
}

Board.prototype.blockedByActor = function(x, y) {
  for (var i = 0; i < this.monsters.length; i++) {
    var monster = this.monsters[i];
    if (monster.x == x && monster.y == y) {
      return monster;
    }
  }
  return false;
}

Board.prototype.addActor = function(spriteName, x, y) {
  var sprite = this.game.add.sprite(0, 0, spriteName);
  var actor = new Actor(sprite, x, y);
  this.monsters.push(actor);
}

Board.prototype.removeActor = function(actor) {
  var index = this.monsters.indexOf(actor);
  if (index > -1) {
    this.monsters.splice(index, 1);
    actor.sprite.destroy();
  }
}
