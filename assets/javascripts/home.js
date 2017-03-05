homeState = {
  create: function () {
    this.stage.backgroundColor = "#FFFFFF";
    this.add.sprite(2 * TILE_WIDTH, 1 * TILE_HEIGHT, 'crop0');

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
