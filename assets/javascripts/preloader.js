preloaderState = {
  preload: function() {
    this.load.atlasJSONHash('home_tiles', 'assets/images/home_tiles.png', 'assets/images/home_tiles.json');

    this.load.image('box', 'assets/images/box.png');
    this.load.image('cross', 'assets/images/cross.png');
    this.load.image('face', 'assets/images/face.png');
  },
  create: function() {
    this.state.start('home_state');
  }
}
