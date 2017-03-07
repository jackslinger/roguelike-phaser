DUNGEON_WIDTH = 50;
DUNGEON_HEIGHT = 30;
MIN_BSP_SPLIT = 6;

dungeonState = {
  create: function () {
    map = new Map(this, DUNGEON_WIDTH, DUNGEON_HEIGHT);
    map.fillWithTile('dungeon_tiles16', 'white');
    map.generate();

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
        // if (map[x][y].blocksMovement === false) {
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
