class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 3400;

  /**
   * Creates a level with all its entities.
   * @param {MovableObject[]} enemies - Enemy objects
   * @param {Cloud[]} clouds - Cloud objects
   * @param {BackgroundObject[]} backgroundObjects - Background tiles
   * @param {Coin[]} coins - Collectible coins
   * @param {Bottle[]} bottles - Collectible ground bottles
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles || [];
  }
}
