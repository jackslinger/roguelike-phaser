preloaderState = {
  preload: function() {
    this.load.atlasJSONHash('home_tiles', 'assets/images/home_tiles.png', 'assets/images/home_tiles.json');
    this.load.atlasJSONHash('dungeon_tiles', 'assets/images/dungeon.png', 'assets/images/dungeon.json');

    this.load.image('box', 'assets/images/box.png');
    this.load.image('cross', 'assets/images/cross.png');
    this.load.image('face', 'assets/images/face.png');
    this.load.image('face32', 'assets/images/face_32.png');
  },
  create: function() {
    this.state.start('dungeon_state');
  }
}
