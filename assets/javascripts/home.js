function PopulateInventory(items) {
  inventoryItems.removeChildren();

  var style = { font: "16px Arial", fill: "#fff", boundsAlignH: "left", boundsAlignV: "middle" };
  for (var i = 0; i < items.length; i++) {
    var letter = String.fromCharCode("a".charCodeAt(0) + i)
    var text = game.add.text(0, 0, letter + ". " + items[i], style);
    inventoryItems.add(text);
    text.setTextBounds(0, i * TILE_WIDTH, SCREEN_WIDTH_TILES * TILE_WIDTH, 32);
  }
}

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
    keyboard.e = game.input.keyboard.addKey(Phaser.Keyboard.E);
    keyboard.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    keyboard.b = game.input.keyboard.addKey(Phaser.Keyboard.B);
    keyboard.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    blocking = 0;
    blocking_timeout = 15;
    input_mode = 'movement';

    inventoryItems = game.add.group();
    PopulateInventory(["Hoe", "Seeds"]);
    inventoryItems.visible = false;
  },
  update: function () {
    function processMovementInput() {
      if (keyboard.spacebar.isDown) {
        input_mode = 'hoe';
      } else if (keyboard.e.isDown) {
        input_mode = 'inventory';
        inventoryItems.visible = true;
      } else if (keyboard.left.isDown) {
        if (blocking == 0) {
          if (player.x >= TILE_WIDTH) {
            player.x -= TILE_WIDTH;
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else if (keyboard.right.isDown) {
        if (blocking == 0) {
          if (player.x < (SCREEN_WIDTH_TILES - 1) * TILE_WIDTH) {
            player.x += TILE_WIDTH;
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else if (keyboard.up.isDown) {
        if (blocking == 0) {
          if (player.y >= TILE_HEIGHT) {
            player.y -= TILE_HEIGHT;
          }
          blocking = blocking_timeout;
        } else {
          blocking -= 1;
        }
      } else if (keyboard.down.isDown) {
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

    function processInventoryInput() {
      if (keyboard.a.isDown) {
        input_mode = 'hoe';
        inventoryItems.visible = false;
      } else if (keyboard.b.isDown) {
        input_mode = 'seeds';
        inventoryItems.visible = false;
      } else if (keyboard.esc.isDown) {
        input_mode = 'movement';
        inventoryItems.visible = false;
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

    function plantSeeds(x, y) {
      if (x >= 0 && x < SCREEN_WIDTH_TILES && y >= 0 && y < SCREEN_HEIGHT_TILES) {
        if (game.map[x][y].frameName === 'crop0') {
          game.map[x][y].frameName = 'crop1';
          return true;
        }
      }
      return false;
    }

    function processActionInput(action) {
      if (keyboard.esc.isDown) {
        input_mode = 'movement'
      } else if (keyboard.left.isDown) {
        if (player.x >= TILE_WIDTH) {
          action((player.x / TILE_WIDTH) - 1, player.y / TILE_HEIGHT)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      } else if (keyboard.right.isDown) {
        if (player.x < (SCREEN_WIDTH_TILES - 1) * TILE_WIDTH) {
          action((player.x / TILE_WIDTH) + 1, player.y / TILE_HEIGHT)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      } else if (keyboard.up.isDown) {
        if (player.y >= TILE_HEIGHT) {
          action(player.x / TILE_WIDTH, (player.y / TILE_HEIGHT) - 1)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      } else if (keyboard.down.isDown) {
        if (player.y < (SCREEN_HEIGHT_TILES - 1) * TILE_HEIGHT) {
          action(player.x / TILE_WIDTH, (player.y / TILE_HEIGHT) + 1)
          input_mode = 'movement';
          blocking = blocking_timeout;
        }
      }
    }

    if (input_mode === 'movement') {
      processMovementInput();
    } else if (input_mode === 'hoe') {
      processActionInput(hoeGround);
    } else if (input_mode === 'seeds') {
      processActionInput(plantSeeds);
    } else if (input_mode === 'inventory') {
      processInventoryInput();
    }
  },
  render: function() {

  }
}
