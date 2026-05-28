class StatusBarCoin extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 135;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Updates the coin bar image to match the given percentage.
   * @param {number} percentage - Value between 0 and 100
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imgCache[path];
  }

  /**
   * Maps the percentage to an image array index.
   * @returns {number} Index 0–5
   */
  resolveImageIndex() {
    if (this.percentage === 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
}
