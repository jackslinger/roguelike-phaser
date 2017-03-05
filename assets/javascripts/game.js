TILE_WIDTH = 16;
TILE_HEIGHT = 16;
SCREEN_WIDTH_TILES = 50;
SCREEN_HEIGHT_TILES = 35;

var game = new Phaser.Game(TILE_WIDTH * SCREEN_WIDTH_TILES, TILE_HEIGHT * SCREEN_HEIGHT_TILES, Phaser.AUTO, 'phaser', {});

game_state = {
  create: function() {
    game.stage.backgroundColor = "#FFFFFF";

    var map = [];
    for (var col_index = 0; col_index < SCREEN_WIDTH_TILES; col_index++) {
      var row = [];
      for (var row_index = 0; row_index < SCREEN_HEIGHT_TILES; row_index++) {
        row.push(null);
      }
      map.push(row);
    }

    map[0][0] = 'box';

    for (var col_index = 0; col_index < map.length; col_index++) {
      for (var row_index = 0; row_index < map[row_index].length; row_index++) {
        var tile = map[col_index][row_index];
        if (!(tile === null)) {
          this.add.sprite(col_index * TILE_WIDTH, row_index * TILE_HEIGHT, map[col_index][row_index]);
        }
      }
    }

    player = this.add.sprite(16, 16, 'face');
    keyboard = this.input.keyboard.createCursorKeys();
    blocking = false;
  },
  update: function() {
    if (keyboard.left.isDown) {
      if (!blocking) {
        player.x -= 16;
        blocking = true;
      }
    }
    else if (keyboard.right.isDown) {
      if (!blocking) {
        player.x += 16;
        blocking = true;
      }
    }
    else if (keyboard.up.isDown) {
      if (!blocking) {
        player.y -= 16;
        blocking = true;
      }
    }
    else if (keyboard.down.isDown) {
      if (!blocking) {
        player.y += 16;
        blocking = true;
      }
    } else {
      blocking = false;
    }
  },
  render: function() {

  }
}

game.state.add('game_state', game_state);
game.state.add('home_state', homeState);
game.state.add('preloader', preloaderState);
game.state.start('preloader');
