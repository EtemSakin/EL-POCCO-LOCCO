class StatusBarEndboss extends DrawableObject {
  IMAGES = [
    'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
    'img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 430;
    this.y = 5;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the displayed bar to match the given percentage.
   * @param {number} percentage - Value between 0 and 100
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imgCache[path];
  }

  /**
   * Returns the image array index for the current percentage.
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
