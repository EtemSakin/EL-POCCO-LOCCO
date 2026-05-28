class ChickenSmall extends MovableObject {
  height = 50;
  width = 50;
  y = 365;
  energy = 1;
  markedForRemoval = false;
  deathTriggered = false;

  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  IMAGES_DEAD = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  constructor(x) {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = x !== undefined ? x : 800 + Math.random() * 2400;
    this.speed = 0.3 + Math.random() * 0.6;
    this.animate();
  }

  /**
   * Starts the walk and animation loops.
   */
  animate() {
    this.moveLeft();
    setInterval(() => this.playWalkOrDead(), 100);
  }

  /**
   * Plays walk animation or triggers death sequence.
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
   * Triggers death animation once, then marks for removal.
   */
  triggerDeath() {
    if (this.deathTriggered) return;
    this.deathTriggered = true;
    this.loadImage(this.IMAGES_DEAD[0]);
    setTimeout(() => { this.markedForRemoval = true; }, 500);
  }
}
