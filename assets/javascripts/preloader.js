preloaderState = {
  preload: function() {
    this.load.image('box', 'assets/images/box.png');
    this.load.image('cross', 'assets/images/cross.png');
    this.load.image('face', 'assets/images/face.png');
    this.load.image('crop0', 'assets/images/crop0.png');
    this.load.image('crop1', 'assets/images/crop1.png');
    this.load.image('crop2', 'assets/images/crop2.png');
    this.load.image('crop3', 'assets/images/crop3.png');
  },
  create: function() {
    this.state.start('home_state');
  }
}
