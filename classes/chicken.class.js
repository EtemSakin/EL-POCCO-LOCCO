class Chicken extends MovableObject {
  height = 80;
  width = 80;
  y = 335;
  energy = 1;
  markedForRemoval = false;
  deathTriggered = false;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];

  IMAGES_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  constructor(x) {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x !== undefined ? x : 400 + Math.random() * 2200;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Starts the movement and animation loops.
   */
  animate() {
    this.moveLeft();
    setInterval(() => this.playWalkOrDead(), 100);
  }

  /**
   * Plays the walk animation or triggers the death sequence.
   */
  playWalkOrDead() {
    if (window.gamePaused) return;
    if (this.isDead()) {
      this.triggerDeath();
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Shows the dead frame once, then marks the object for removal.
   */
  triggerDeath() {
    if (this.deathTriggered) return;
    this.deathTriggered = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    setTimeout(() => { this.markedForRemoval = true; }, 500);
  }
}
