homeState = {
  create: function () {
    var map = [];
    for (var col_index = 0; col_index < SCREEN_WIDTH_TILES; col_index++) {
      var row = [];
      for (var row_index = 0; row_index < SCREEN_HEIGHT_TILES; row_index++) {
        var sprite = this.add.sprite(col_index * TILE_WIDTH, row_index * TILE_HEIGHT, 'home_tiles');
        sprite.frameName = 'radiation';
        row.push(sprite);
      }
      map.push(row);
    }

    map[2][3].frameName = 'crop0';
    map[2][4].frameName = 'crop0';


    this.stage.backgroundColor = "#FFFFFF";

    player = this.add.sprite(16, 16, 'face');
    keyboard = this.input.keyboard.createCursorKeys();
    blocking = 0;
    blocking_timeout = 15;
  },
  update: function () {
    if (keyboard.left.isDown) {
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
  },
  render: function() {

  }
}
