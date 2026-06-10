class Bottle extends MovableObject {
  width = 60;
  height = 70;
  y = 360;
  markedForRemoval = false;

  IMAGES = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  /**
   * Creates a collectible bottle on the ground at the given x position.
   * @param {number} x - Horizontal position
   */
  constructor(x) {
    super();
    this.x = x;
    this.loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.animate();
  }

  /**
   * Plays a slow glimmer animation.
   */
  animate() {
    setInterval(() => this.playAnimation(this.IMAGES), 500);
  }
}
