class Character extends MovableObject {
  y = 80;
  height = 250;
  width = 120;
  speed = 5;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  world;

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);

    this.groundY = 170;

    this.applyGravity();
  }

  setWorld(world) {
    this.world = world;
  }

  animate() {
    setInterval(() => {
      if (!this.world || !this.world.keyboard) return;

      const levelEnd =
        this.world.level && this.world.level.level_end_x !== undefined
          ? this.world.level.level_end_x
          : Infinity;

      const movingRight = this.world.keyboard.RIGHT && this.x < levelEnd;
      const movingLeft = this.world.keyboard.LEFT && this.x > 0;

      if (movingRight) {
        this.x += this.speed;
        this.otherDirection = false;
      }

      if (movingLeft) {
        this.x -= this.speed;
        this.otherDirection = true;
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }

      if (this.world.keyboard.UP && !this.isAboveGround()) {
        this.jump();
      }

      if (this.world) {
        this.world.camera_x = -this.x + 100;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.world || !this.world.keyboard) return;

      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else {
          this.loadImage(this.IMAGES_WALKING[0]);
        }
      }
    }, 80);
  }

  jump() {
    if (!this.isAboveGround()) {
      this.speedY = 15;
    }
  }
}
