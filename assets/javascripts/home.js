homeState = {
  create: function () {
    game.map = [];
    for (var col_index = 0; col_index < SCREEN_WIDTH_TILES; col_index++) {
      var row = [];
      for (var row_index = 0; row_index < SCREEN_HEIGHT_TILES; row_index++) {
        var sprite = this.add.sprite(col_index * TILE_WIDTH, row_index * TILE_HEIGHT, 'home_tiles');
        sprite.frameName = 'radiation';
        row.push(sprite);
      }
      game.map.push(row);
    }

    game.map[39][30].frameName = 'water';
    game.map[39][31].frameName = 'water';
    game.map[40][29].frameName = 'water';
    game.map[40][30].frameName = 'water';
    game.map[40][31].frameName = 'water';
    game.map[41][29].frameName = 'water';
    game.map[41][30].frameName = 'water';
    game.map[41][31].frameName = 'water';

    this.stage.backgroundColor = "#FFFFFF";

    player = this.add.sprite((35 * TILE_WIDTH), (25 * TILE_HEIGHT), 'face');
    keyboard = this.input.keyboard.createCursorKeys();
    keyboard.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    blocking = 0;
    blocking_timeout = 15;
    input_mode = 'movement';
  },
  update: function () {
    function processMovementInput() {
      if (keyboard.spacebar.isDown) {
        input_mode = 'hoe';
      } if (keyboard.left.isDown) {
        if (blocking == 0) {
          if (player.x >= TILE_WIDTH) {
            player.x -= TILE_WIDTH;
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      }
      else if (keyboard.right.isDown) {
        if (blocking == 0) {
          if (player.x < (SCREEN_WIDTH_TILES - 1) * TILE_WIDTH) {
            player.x += TILE_WIDTH;
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      }
      else if (keyboard.up.isDown) {
        if (blocking == 0) {
          if (player.y >= TILE_HEIGHT) {
            player.y -= TILE_HEIGHT;
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      }
      else if (keyboard.down.isDown) {
        if (blocking == 0) {
          if (player.y < (SCREEN_HEIGHT_TILES - 1) * TILE_HEIGHT) {
            player.y += TILE_HEIGHT;
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else {
        blocking = 0;
      }
    }

    function hoeGround(x, y) {
      if (x >= 0 && x < SCREEN_WIDTH_TILES && y >= 0 && y < SCREEN_HEIGHT_TILES) {
        if (game.map[x][y].frameName === 'radiation') {
          game.map[x][y].frameName = 'crop0';
          return true;
        }
      }
      return false;
    }

    function processHoeInput() {
      if (keyboard.left.isDown) {
        if (player.x >= TILE_WIDTH) {
          hoeGround((player.x / TILE_WIDTH) - 1, player.y / TILE_HEIGHT)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      } else if (keyboard.right.isDown) {
        if (player.x < (SCREEN_WIDTH_TILES - 1) * TILE_WIDTH) {
          hoeGround((player.x / TILE_WIDTH) + 1, player.y / TILE_HEIGHT)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      } else if (keyboard.up.isDown) {
        if (player.y >= TILE_HEIGHT) {
          hoeGround(player.x / TILE_WIDTH, (player.y / TILE_HEIGHT) - 1)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      } else if (keyboard.down.isDown) {
        if (player.y < (SCREEN_HEIGHT_TILES - 1) * TILE_HEIGHT) {
          hoeGround(player.x / TILE_WIDTH, (player.y / TILE_HEIGHT) + 1)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      }
    }

    if (input_mode === 'movement') {
      processMovementInput();
    } else if (input_mode === 'hoe') {
      processHoeInput();
    }
  },
  render: function() {

  }
}
