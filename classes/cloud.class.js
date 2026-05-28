class Cloud extends MovableObject {
  y = 50;
  height = 250;
  width = 500;
  speed = 0.15;

  constructor() {
    super();
    this.loadImage('img/5_background/layers/4_clouds/full.png');
    this.x = 200 + Math.random() * 1000;
    this.animate();
  }

  /**
   * Starts the continuous leftward drift.
   */
  animate() {
    this.moveLeft();
  }
}
