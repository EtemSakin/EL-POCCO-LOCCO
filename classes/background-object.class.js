class BackgroundObject extends MovableObject {
  /**
   * Creates a static background tile at the given x position.
   * @param {string} imagePath - Path to the background image
   * @param {number} x - Horizontal position
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 0;
    this.width = 1440;
    this.height = 480;
  }
}
