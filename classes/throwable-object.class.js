class ThrowableObject extends MovableObject {
  hasHit = false;
  markedForRemoval = false;
  splashPlaying = false;
  directionRight = true;

  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  /**
   * Creates a bottle thrown from the given position.
   * @param {number} x - Start x position
   * @param {number} y - Start y position
   * @param {boolean} directionRight - True if thrown to the right
   */
  constructor(x, y, directionRight = true) {
    super();
    this.loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.directionRight = directionRight;
    this.throw();
  }

  /**
   * Starts the throw physics and rotation animation.
   */
  throw() {
    this.speedY = 10;
    this.applyGravity();
    const rotationInterval = setInterval(() => {
      if (this.hasHit) { clearInterval(rotationInterval); return; }
      this.playAnimation(this.IMAGES_ROTATION);
    }, 50);
    const moveInterval = setInterval(() => {
      if (this.hasHit) { clearInterval(moveInterval); return; }
      this.x += this.directionRight ? 10 : -10;
    }, 25);
  }

  /**
   * Triggers the splash animation and marks the bottle for removal.
   */
  playSplash() {
    if (this.splashPlaying) return;
    this.splashPlaying = true;
    this.hasHit = true;
    this.speedY = 0;
    let frame = 0;
    const interval = setInterval(() => {
      this.loadImage(this.IMAGES_SPLASH[frame]);
      frame++;
      if (frame >= this.IMAGES_SPLASH.length) {
        clearInterval(interval);
        this.markedForRemoval = true;
      }
    }, 60);
  }
}
