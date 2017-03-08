DUNGEON_WIDTH = 50;
DUNGEON_HEIGHT = 30;
MIN_BSP_SPLIT = 6;

dungeonState = {
  create: function () {
    this.world.setBounds(0, 0, DUNGEON_WIDTH * TILE_WIDTH, DUNGEON_HEIGHT * TILE_HEIGHT);

    var map = new Map(this, DUNGEON_WIDTH, DUNGEON_HEIGHT);
    map.fillWithTile('dungeon_tiles16', 'wall', true);
    // map.fillWithTile('dungeon_tiles16', 'white', false);
    map.wallEdges();

    var player = new Actor(this.add.sprite(0, 0, 'face'), 3, 3);
    game.camera.follow(player.sprite);

    game.dungeon = new Board(game, map, player);

    map.generate(player);

    keyboard = this.input.keyboard.createCursorKeys();
    keyboard.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    blocking = 0;
    blocking_timeout = 10;
    input_mode = 'movement';
  },
  update: function () {
    function processMovementInput() {
      if (keyboard.spacebar.isDown) {
        if (blocking <= 0) {
          game.dungeon.processMonsterTurns();
          blocking = blocking_timeout;
        }
      } else if (keyboard.left.isDown) {
        if (blocking <= 0) {
          game.dungeon.movePiece(game.dungeon.player, -1, 0);
          game.dungeon.processMonsterTurns();
          blocking = blocking_timeout;
        }
      } else if (keyboard.right.isDown) {
        if (blocking <= 0) {
          game.dungeon.movePiece(game.dungeon.player, 1, 0);
          game.dungeon.processMonsterTurns();
          blocking = blocking_timeout;
        }
      } else if (keyboard.up.isDown) {
        if (blocking <= 0) {
          game.dungeon.movePiece(game.dungeon.player, 0, -1);
          game.dungeon.processMonsterTurns();
          blocking = blocking_timeout;
        }
      } else if (keyboard.down.isDown) {
        if (blocking <= 0) {
          game.dungeon.movePiece(game.dungeon.player, 0, 1);
          game.dungeon.processMonsterTurns();
          blocking = blocking_timeout;
        }
      } else {
        blocking = 0;
      }
      blocking -= 1;
    }

    processMovementInput();
  },
  render: function() {

  }
}
