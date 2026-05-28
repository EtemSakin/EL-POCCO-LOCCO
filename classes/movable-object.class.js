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
    const myT = this.y + (this.offset?.top ?? 20);
    const myB = this.y + this.height - (this.offset?.bottom ?? 20);
    const myL = this.x + (this.offset?.left ?? 20);
    const myR = this.x + this.width - (this.offset?.right ?? 20);
    const oT = other.y + (other.offset?.top ?? 20);
    const oB = other.y + other.height - (other.offset?.bottom ?? 20);
    const oL = other.x + (other.offset?.left ?? 20);
    const oR = other.x + other.width - (other.offset?.right ?? 20);
    return myL < oR && myR > oL && myT < oB && myB > oT;
  }

  /**
   * AABB collision without padding — used for projectile vs small enemies.
   * @param {DrawableObject} other
   * @returns {boolean}
   */
  isCollidingNoPad(other) {
    const oL = other.x + (other.offset?.left ?? 0);
    const oR = other.x + other.width - (other.offset?.right ?? 0);
    const oT = other.y + (other.offset?.top ?? 0);
    const oB = other.y + other.height - (other.offset?.bottom ?? 0);
    return (
      this.x < oR &&
      this.x + this.width > oL &&
      this.y < oB &&
      this.y + this.height > oT
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
