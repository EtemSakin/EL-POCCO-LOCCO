class MovableObject {
  x = 120;
  y = 280;
  height = 150;
  width = 100;
  img;
  imgCache = {};
  curentImage = 0;
  speed = 0.15;
  othersDirection = false;
  speedY = 0;
  acceleration = 1;
  energy = 100;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    return this.y < 170;
  }

  isColliding(enemy) {
    return (
      this.x < enemy.x + enemy.width &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + this.height > enemy.y
    );
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      img.style = "transform: scaleX(-1)";
      this.imgCache[path] = img;
    });
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
