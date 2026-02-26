class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.setWorld();
    this.draw();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.energy -= 2;
          console.log(
            "Collision with Character, Energy ",
            this.character.energy,
            " Enemy Energy ",
            enemy.energy,
          );
        }
      });
    }, 100);
  }

  draw() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectstoMap(this.level.backgroundObjects);
    this.addtoMap(this.character);
    this.addObjectstoMap(this.level.enemies);
    this.addObjectstoMap(this.level.clouds);

    requestAnimationFrame(() => this.draw());
  }

  addObjectstoMap(objects) {
    objects.forEach((o) => this.addtoMap(o));
  }

  addtoMap(mO) {
    if (!mO.img || !mO.img.complete || mO.img.naturalWidth === 0) return;

    if (mO.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mO.width, 0);
      this.ctx.scale(-1, 1);
      mO.x = mO.x * -1;
    }

    this.ctx.drawImage(mO.img, mO.x, mO.y, mO.width, mO.height);

    this.ctx.beginPath();
    this.ctx.lineWidth = "1";
    this.ctx.strokeStyle = "red";
    this.ctx.rect(mO.x, mO.y, mO.width, mO.height);
    this.ctx.stroke();

    if (mO.otherDirection) {
      mO.x = mO.x * -1;
      this.ctx.restore();
    }
  }
}
