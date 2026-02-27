class MovableObject extends DrawableObject {
  speed = 0.15;
  othersDirection = false;
  speedY = 0;
  acceleration = 1;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 170;
    }
  }

  isColliding(enemy) {
    return (
      this.x < enemy.x + enemy.width &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + this.height > enemy.y
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy === 0;
  }

  playAnimation(images) {
    let i = this.curentImage % images.length;
    let path = images[i];
    this.img = this.imgCache[path];
    this.curentImage++;
  }

  moveRight() {
    console.log("Move Right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
