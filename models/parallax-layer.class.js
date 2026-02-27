class ParallaxLayer extends DrawableObject {
  speedFactor = 0;

  constructor(imagePath, speedFactor, y = 0, width = 1440, height = 480) {
    super();
    this.loadImage(imagePath);
    this.speedFactor = speedFactor;
    this.y = y;
    this.width = width;
    this.height = height;

    this.offsetX = 0;
  }

  update(camera_x) {
    const scroll = -camera_x * this.speedFactor;
    this.offsetX = -(scroll % this.width);
  }

  draw(ctx) {
    if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;
    ctx.drawImage(
      this.img,
      this.offsetX - this.width,
      this.y,
      this.width,
      this.height,
    );
    ctx.drawImage(this.img, this.offsetX, this.y, this.width, this.height);
    ctx.drawImage(
      this.img,
      this.offsetX + this.width,
      this.y,
      this.width,
      this.height,
    );
  }
}
