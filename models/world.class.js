class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBarHealth = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  statusBarCoin = new StatusBarCoin();
  throwableObject = [];
  parallaxLayers = [
    new ParallaxLayer("img/5_background/layers/air.png", 0.1),
    new ParallaxLayer("img/5_background/layers/3_third_layer/full.png", 0.3),
    new ParallaxLayer("img/5_background/layers/2_second_layer/full.png", 0.5),
    new ParallaxLayer("img/5_background/layers/1_first_layer/full.png", 0.8),
    new ParallaxLayer("img/5_background/layers/front_cactus.png", 1.0),
  ];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.setWorld();
    this.draw();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObject();
    }, 100);
  }

  checkThrowableObject() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100,
      );
      this.throwableObject.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.parallaxLayers.forEach((layer) => {
      layer.update(this.camera_x);
      layer.draw(this.ctx);
    });

    this.ctx.translate(this.camera_x, 0);

    this.addtoMap(this.character);
    this.addObjectstoMap(this.level.enemies);
    this.addObjectstoMap(this.level.clouds);
    this.addObjectstoMap(this.throwableObject);

    this.ctx.translate(-this.camera_x, 0);

    this.addtoMap(this.statusBarHealth);
    this.addtoMap(this.statusBarBottle);
    this.addtoMap(this.statusBarCoin);

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
