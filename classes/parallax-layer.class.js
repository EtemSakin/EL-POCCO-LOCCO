class ParallaxLayer extends DrawableObject {
  speedFactor = 0;
  offsetX = 0;

  /**
   * Creates a parallax background layer.
   * @param {string} imagePath - Path to the layer image
   * @param {number} speedFactor - Scroll speed relative to camera (0 = static, 1 = 1:1)
   * @param {number} y - Vertical offset
   * @param {number} width - Layer width in pixels
   * @param {number} height - Layer height in pixels
   */
  constructor(imagePath, speedFactor, y = 0, width = 1440, height = 480) {
    super();
    this.loadImage(imagePath);
    this.speedFactor = speedFactor;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Recalculates the scroll offset based on camera position.
   * @param {number} camera_x - Current camera x offset
   */
  update(camera_x) {
    const scroll = -camera_x * this.speedFactor;
    this.offsetX = -(scroll % this.width);
  }

  /**
   * Draws three tiles of the layer to cover any scroll position.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (!this.img || !this.img.complete || this.img.naturalWidth === 0) return;
    ctx.drawImage(this.img, this.offsetX - this.width, this.y, this.width, this.height);
    ctx.drawImage(this.img, this.offsetX, this.y, this.width, this.height);
    ctx.drawImage(this.img, this.offsetX + this.width, this.y, this.width, this.height);
  }
}
