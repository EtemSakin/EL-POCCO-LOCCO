class DrawableObject {
  img;
  imgCache = {};
  curentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads a single image and sets it as the current image.
   * @param {string} path - Path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads an array of images into the image cache.
   * @param {string[]} arr - Array of image paths
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imgCache[path] = img;
    });
  }

  /**
   * Draws the current image onto the canvas context.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
