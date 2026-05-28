class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 1;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity by reducing speedY each frame until object lands.
   */
  applyGravity() {
    setInterval(() => {
      if (window.gamePaused) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  /**
   * Returns true if the object is above its ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    return this.y < 170;
  }

  /**
   * AABB collision check with inner padding against another object.
   * @param {DrawableObject} other
   * @returns {boolean}
   */
  isColliding(other) {
    return (
      this.x + 20 < other.x + other.width - 20 &&
      this.x + this.width - 20 > other.x + 20 &&
      this.y + 20 < other.y + other.height &&
      this.y + this.height > other.y + 20
    );
  }

  /**
   * AABB collision without padding — used for projectile vs small enemies.
   * @param {DrawableObject} other
   * @returns {boolean}
   */
  isCollidingNoPad(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  /**
   * Returns true if this object is landing on top of another (jump kill).
   * @param {DrawableObject} other
   * @returns {boolean}
   */
  isCollidingFromTop(other) {
    const myBottom = this.y + this.height;
    return (
      myBottom > other.y &&
      myBottom < other.y + 30 &&
      this.x + this.width - 15 > other.x + 15 &&
      this.x + 15 < other.x + other.width - 15 &&
      this.speedY < 0
    );
  }

  /**
   * Reduces energy by the given damage amount.
   * @param {number} damage - Amount of damage
   */
  hit(damage = 5) {
    this.energy -= damage;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Returns true if the object was recently hit.
   * @returns {boolean}
   */
  isHurt() {
    const timepassed = (new Date().getTime() - this.lastHit) / 1000;
    return timepassed < 1;
  }

  /**
   * Returns true if energy has reached zero.
   * @returns {boolean}
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Cycles through an image array for sprite animation.
   * @param {string[]} images - Array of image paths
   */
  playAnimation(images) {
    const i = this.curentImage % images.length;
    this.img = this.imgCache[images[i]];
    this.curentImage++;
  }

  /**
   * Moves the object continuously to the left.
   */
  moveLeft() {
    setInterval(() => { if (!window.gamePaused) this.x -= this.speed; }, 1000 / 60);
  }

  /**
   * Moves the object continuously to the right.
   */
  moveRight() {
    setInterval(() => { if (!window.gamePaused) this.x += this.speed; }, 1000 / 60);
  }
}
