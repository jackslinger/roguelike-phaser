var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser', {});

game_state = {
  preload: function() {

  },
  create: function() {

  },
  update: function() {

  },
  render: function() {

  }
}

game.state.add('game_state', game_state);
game.state.start('game_state')
