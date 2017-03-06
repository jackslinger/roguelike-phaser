DUNGEON_WIDTH = 50;
DUNGEON_HEIGHT = 30;
MAX_ROOM_WIDTH = 7;
MAX_ROOM_HEIGHT = 7;
MIN_ROOM_WIDTH = 3;
MIN_ROOM_HEIGHT = 3;
MIN_BSP_SPLIT = 6;

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

function carveRoom(x, y, width, height) {
  for (var col_index = x; col_index < (x + width); col_index++) {
    for (var row_index = y; row_index < (y + height); row_index++) {
      if (col_index == x || col_index == (x + width - 1) || row_index == y || row_index == (y + height - 1)) {
        var tile = game.map[col_index][row_index].blocksMovement = true;
        game.map[col_index][row_index].frameName = 'wall';
      }
    }
  }
}

function roomsOverlap(room1, room2) {
  if (room1.x === room2.x || room1.y === room2.y) {
    return true;
  }
  var left_room;
  var right_room;
  if (room1.x < room2.x) {
    left_room = room1;
    right_room = room2;
  } else {
    left_room = room2;
    right_room = room1;
  }
  var top_room;
  var bottom_room;
  if (room1.y < room2.y) {
    top_room = room1;
    bottom_room = room2;
  } else {
    top_room = room2;
    bottom_room = room1;
  }
  if (right_room.x < left_room.x + left_room.width || bottom_room.y < top_room.y + top_room.height) {
    return true;
  }
  return false;
}

function generateRooms(attempts) {
  var rooms = [];
  for (var i = 0; i < attempts; i++) {
    var new_room = {};
    new_room.width = getRandomInt(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH);
    new_room.height = getRandomInt(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT);
    new_room.x = getRandomInt(0, DUNGEON_WIDTH - new_room.width);
    new_room.y = getRandomInt(0, DUNGEON_HEIGHT - new_room.height);
    var overlap = false;
    for (var index = 0; index < rooms.length; index++) {
      var room = rooms[index];
      if (roomsOverlap(new_room, room)) {
        overlap = true;
        // break;
      }
    }
    if (!overlap) {
      rooms.push(new_room);
      carveRoom(new_room.x, new_room.y, new_room.width, new_room.height);
    }
  }
}

dungeonState = {
  create: function () {
    game.map = [];
    for (var col_index = 0; col_index < DUNGEON_WIDTH; col_index++) {
      var row = [];
      for (var row_index = 0; row_index < DUNGEON_HEIGHT; row_index++) {
        var sprite = this.add.sprite(col_index * TILE_WIDTH, row_index * TILE_HEIGHT, 'dungeon_tiles16');
        sprite.blocksMovement = false;
        sprite.frameName = 'white';
        row.push(sprite);
      }
      game.map.push(row);
    }

    root_container = new Container(0, 0, DUNGEON_WIDTH, DUNGEON_HEIGHT);
    tree = splitContainer(root_container, 4);

    var rooms = tree.getLeafs()
    for(var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      carveRoom(room.x, room.y, room.w, room.h);
    }

    this.world.setBounds(0, 0, DUNGEON_WIDTH * TILE_WIDTH, DUNGEON_HEIGHT * TILE_HEIGHT);

    // These global variables probably need linking to the state
    player = this.add.sprite((3 * TILE_WIDTH), (3 * TILE_HEIGHT), 'face');
    game.camera.follow(player);
    keyboard = this.input.keyboard.createCursorKeys();
    blocking = 0;
    blocking_timeout = 5;
    input_mode = 'movement';
  },
  update: function () {
    function movePlayer(x, y) {
      if (x >= 0 && x < DUNGEON_WIDTH && y >= 0 && y < DUNGEON_HEIGHT) {
        // if (game.map[x][y].blocksMovement === false) {
        player.x = x * TILE_WIDTH;
        player.y = y * TILE_HEIGHT;
        return true;
        // }
      }
      return false;
    }

    function processMovementInput() {
      if (keyboard.left.isDown) {
        if (blocking == 0) {
          if (player.x >= TILE_WIDTH) {
            movePlayer((player.x / TILE_WIDTH) - 1, player.y / TILE_HEIGHT);
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else if (keyboard.right.isDown) {
        if (blocking == 0) {
          if (player.x < (DUNGEON_WIDTH - 1) * TILE_WIDTH) {
            movePlayer((player.x / TILE_WIDTH) + 1, player.y / TILE_HEIGHT);
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else if (keyboard.up.isDown) {
        if (blocking == 0) {
          if (player.y >= TILE_HEIGHT) {
            movePlayer(player.x / TILE_WIDTH, (player.y / TILE_HEIGHT) - 1);
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else if (keyboard.down.isDown) {
        if (blocking == 0) {
          if (player.y < (DUNGEON_HEIGHT - 1) * TILE_HEIGHT) {
            movePlayer(player.x / TILE_WIDTH, (player.y / TILE_HEIGHT) + 1);
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else {
        blocking = 0;
      }
    }

    processMovementInput();
  },
  render: function() {

  }
}
