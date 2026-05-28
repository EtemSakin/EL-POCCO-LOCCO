class Coin extends MovableObject {
  width = 70;
  height = 70;
  markedForRemoval = false;

  /**
   * Creates a collectible coin at the given position.
   * @param {number} x - Horizontal position
   * @param {number} y - Vertical position
   */
  constructor(x, y = 330) {
    super();
    this.loadImage('img/7_statusbars/3_icons/icon_coin.png');
    this.x = x;
    this.y = y;
  }
}
