var Map = function(state, width, height) {
  this.state = state;
  this.width = width;
  this.height = height;
  this.tiles = [];
}

Map.prototype.generate = function() {
  root_container = new Container(0, 0, this.width, this.height);
  tree = splitContainer(root_container, 4);

  var containers = tree.getLeafs()
  for(var i = 0; i < containers.length; i++) {
    var room = getRoomWithinContainer(containers[i]);
    this.carveRoom(room);
  }

  this.wallEdges();

  this.generateMaze();
  this.finalise();
  // this.moo();
}

Map.prototype.carveRoom = function(room) {
  for (var col_index = room.x; col_index < (room.x + room.width); col_index++) {
    for (var row_index = room.y; row_index < (room.y + room.height); row_index++) {
      var tile = this.tiles[col_index][row_index];
      if (col_index == room.x || col_index == (room.x + room.width - 1) || row_index == room.y || row_index == (room.y + room.height - 1)) {
        tile.blocksMovement = true;
        tile.sprite.frameName = 'wall';
      } else {
        tile.sprite.frameName = 'box';
      }
    }
  }
}

Map.prototype.fillWithTile = function(tileSet, tileName) {
  for (var col_index = 0; col_index < this.width; col_index++) {
    var row = [];
    for (var row_index = 0; row_index < this.height; row_index++) {
      var sprite = this.state.add.sprite(col_index * TILE_WIDTH, row_index * TILE_HEIGHT, tileSet);
      sprite.frameName = tileName;
      var tile = new Tile(sprite, col_index, row_index, false);
      row.push(tile)
    }
    this.tiles.push(row);
  }
}

Map.prototype.wallEdges = function() {
  for (var i = 0; i < this.width; i++) {
    this.tiles[i][0].sprite.frameName = 'wall';
    this.tiles[i][0].blocksMovement = true;
    this.tiles[i][this.height - 1].sprite.frameName = 'wall';
    this.tiles[i][this.height - 1].blocksMovement = true;
  }
  for (var i = 0; i < this.height; i++) {
    this.tiles[0][i].sprite.frameName = 'wall';
    this.tiles[0][i].blocksMovement = false;
    this.tiles[this.width - 1][i].sprite.frameName = 'wall';
    this.tiles[this.width - 1][i].blocksMovement = true;
  }
}

Map.prototype.getOrthogonalNeighbours = function(tile) {
  var neighbours = [];
  if (tile.x > 0) { neighbours.push(this.tiles[tile.x - 1][tile.y]) }
  if (tile.y > 0) { neighbours.push(this.tiles[tile.x][tile.y - 1]) }
  if (tile.y < this.height) { neighbours.push(this.tiles[tile.x][tile.y + 1]) }
  if (tile.x < this.width) { neighbours.push(this.tiles[tile.x + 1][tile.y]) }
  return neighbours;
}

Map.prototype.getAllNeighbours = function(tile) {
  var neighbours = [];
  if (tile.x > 0 && tile.y > 0) { neighbours.push(this.tiles[tile.x - 1][tile.y - 1]) }
  if (tile.x > 0) { neighbours.push(this.tiles[tile.x - 1][tile.y]) }
  if (tile.x > 0 && tile.y < this.height) { neighbours.push(this.tiles[tile.x - 1][tile.y + 1]) }

  if (tile.y > 0) { neighbours.push(this.tiles[tile.x][tile.y - 1]) }
  if (tile.y < this.height) { neighbours.push(this.tiles[tile.x][tile.y + 1]) }

  if (tile.x < this.width && tile.y > 0) { neighbours.push(this.tiles[tile.x + 1][tile.y - 1]) }
  if (tile.x < this.width) { neighbours.push(this.tiles[tile.x + 1][tile.y]) }
  if (tile.x < this.width && tile.y < this.height) { neighbours.push(this.tiles[tile.x + 1][tile.y + 1]) }
  return neighbours;
}

Map.prototype.generateMaze = function() {
  var cellList = [this.tiles[1][1]];

  while (cellList.length > 0) {
  // for (var moo = 0; moo <= 97; moo++) {
    // var cell = cellList.pop();
    var cell = cellList.splice(getRandomInt(0, cellList.length - 1), 1)[0];
    cell.visited = true;
    // cell.sprite.frameName = 'box';

    var neighbours = this.getOrthogonalNeighbours(cell);
    var me = this;
    var available = neighbours.filter(function(neighbour) {
      if (!(neighbour.sprite.frameName === 'white')) {
        return false;
      }
      var doubleNeighbours = me.getOrthogonalNeighbours(neighbour);
      var exploredNeighbours = 0;
      for (var i = 0; i < doubleNeighbours.length; i++) {
        var doubleNeighbour = doubleNeighbours[i];
        if (doubleNeighbour.visited === true) {
          exploredNeighbours++;
        }
      }
      if (exploredNeighbours >= 2) {
        return false;
      }
      return true;
    });

    if (available.length > 0) {
      cell.sprite.frameName = 'cross';
      for (var i = 0; i < available.length; i++) {
        cellList.push(available[i]);
      }
    }
  }

}

Map.prototype.moo = function(tile) {
  for (var col_index = 1; col_index < DUNGEON_WIDTH; col_index += 2) {
    for (var row_index = 1; row_index < DUNGEON_HEIGHT; row_index += 2) {
      var tile = this.tiles[col_index][row_index];
      if (tile.sprite.frameName === 'white') {
        this.tiles[col_index][row_index].sprite.frameName = 'cross'
      }
    }
  }
}

Map.prototype.finalise = function() {
  for (var col_index = 0; col_index < DUNGEON_WIDTH; col_index++) {
    for (var row_index = 0; row_index < DUNGEON_HEIGHT; row_index++) {
      var tile = this.tiles[col_index][row_index];
      if (tile.sprite.frameName === 'cross') {
        tile.sprite.frameName = 'white';
      } else if (tile.sprite.frameName === 'box') {
        tile.sprite.frameName = 'white';
      } else if (tile.sprite.frameName === 'white') {
        tile.sprite.frameName = 'wall';
      }
    }
  }
}

var Tile = function(sprite, x, y, blocksMovement) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.blocksMovement = blocksMovement;
  this.visited = false;
}

var Container = function(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}

var Tree = function(leaf) {
  this.leaf = leaf;
  this.lchild = undefined;
  this.rchild = undefined;
}

Tree.prototype.getLeafs = function() {
  if (this.lchild === undefined && this.rchild === undefined)
    return [this.leaf]
  else
    return [].concat(this.lchild.getLeafs(), this.rchild.getLeafs())
}

function splitContainer(container, iteration) {
  var root = new Tree(container);
  if (iteration != 0) {
    var split = random_split(container);
    if (split) {
      root.lchild = splitContainer(split[0], iteration - 1);
      root.rchild = splitContainer(split[1], iteration - 1);
    }
  }
  return root;
}

function random_split(container) {
  var r1, r2
  if (getRandomInt(0,1) === 0) {
    // Vertical
    if (container.w <= MIN_BSP_SPLIT * 2) {
      return false;
    }
    r1 = new Container(container.x, container.y, getRandomInt(MIN_BSP_SPLIT, container.w - MIN_BSP_SPLIT), container.h)
    r2 = new Container(container.x + r1.w, container.y, container.w - r1.w, container.h)
  } else {
    // Horizontal
    if (container.h <= MIN_BSP_SPLIT * 2) {
      return false;
    }
    r1 = new Container(container.x, container.y, container.w, getRandomInt(MIN_BSP_SPLIT, container.h - MIN_BSP_SPLIT))
    r2 = new Container(container.x, container.y + r1.h, container.w, container.h - r1.h)
  }
  return [r1, r2];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRoomWithinContainer(container) {
  var room = {};
  room.width = getRandomInt(MIN_BSP_SPLIT - 2, container.w - 2);
  room.height = getRandomInt(MIN_BSP_SPLIT - 2, container.h - 2);
  room.x = getRandomInt(container.x, container.x + (container.w - room.width));
  room.y = getRandomInt(container.y, container.y + (container.h - room.height));
  return room;
}
