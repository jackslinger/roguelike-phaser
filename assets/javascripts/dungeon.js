function carveRoom(x, y, width, height) {
  for (var col_index = x; col_index < (x + width); col_index++) {
    for (var row_index = y; row_index < (y + height); row_index++) {
      if (col_index == x || col_index == (x + width - 1) || row_index == y || row_index == (y + height - 1)) {
        var tile = game.map[col_index][row_index].blocksMovement = true;
        game.map[col_index][row_index].frameName = 'wall32';
      }
    }
  }
}

dungeonState = {
  create: function () {
    game.map = [];
    for (var col_index = 0; col_index < SCREEN_WIDTH_TILES; col_index++) {
      var row = [];
      for (var row_index = 0; row_index < SCREEN_HEIGHT_TILES; row_index++) {
        var sprite = this.add.sprite(col_index * TILE_WIDTH, row_index * TILE_HEIGHT, 'dungeon_tiles');
        sprite.blocksMovement = false;
        sprite.frameName = 'white32';
        row.push(sprite);
      }
      game.map.push(row);
    }

    carveRoom(2, 2, 6, 8);
    carveRoom(30, 10, 6, 6);
    // carveRoom(10, 13, 4, 4);

    // These global variables probably need linking to the state
    player = this.add.sprite((3 * TILE_WIDTH), (3 * TILE_HEIGHT), 'face32');
    keyboard = this.input.keyboard.createCursorKeys();
    blocking = 0;
    blocking_timeout = 15;
    input_mode = 'movement';

    // inventoryItems = game.add.group();
    // PopulateInventory(["Hoe", "Seeds"]);
    // inventoryItems.visible = false;
  },
  update: function () {
    function movePlayer(x, y) {
      if (x > 0 && x < SCREEN_WIDTH_TILES && y > 0 && y < SCREEN_HEIGHT_TILES) {
        if (game.map[x][y].blocksMovement === false) {
          player.x = x * TILE_WIDTH;
          player.y = y * TILE_HEIGHT;
          return true;
        }
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
          if (player.x < (SCREEN_WIDTH_TILES - 1) * TILE_WIDTH) {
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
          if (player.y < (SCREEN_HEIGHT_TILES - 1) * TILE_HEIGHT) {
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
