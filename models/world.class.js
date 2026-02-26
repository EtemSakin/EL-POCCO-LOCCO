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

    this.setWorld(); // zuerst
    this.draw(); // dann
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  draw() {
    // Reset Transform, damit nichts driftet
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Kamera
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

    if (mO.otherDirection) {
      mO.x = mO.x * -1;
      this.ctx.restore();
    }
  }
}
