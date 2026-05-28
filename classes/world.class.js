class World {
  character = new Character();
  level = createLevel1();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  gameOver = false;

  statusBarHealth = new StatusBar();
  statusBarBottle = new StatusBarBottle();
  statusBarCoin = new StatusBarCoin();
  statusBarEndboss = new StatusBarEndboss();

  throwableObjects = [];
  coinsCollected = 0;
  bottlesCollected = 0;
  maxCoins = 1;
  maxBottles = 1;
  throwCooldown = false;
  paused = false;
  stopped = false;

  soundManager = new SoundManager();

  parallaxLayers = [
    new ParallaxLayer('img/5_background/layers/air.png', 0.1),
    new ParallaxLayer('img/5_background/layers/3_third_layer/full.png', 0.3),
    new ParallaxLayer('img/5_background/layers/2_second_layer/full.png', 0.5),
    new ParallaxLayer('img/5_background/layers/1_first_layer/full.png', 0.8),
  ];

  /**
   * Creates the game world and starts all loops.
   * @param {HTMLCanvasElement} canvas
   * @param {Keyboard} keyboard
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.maxCoins = this.level.coins.length || 1;
    this.maxBottles = this.level.bottles.length || 1;
    this.statusBarCoin.setPercentage(0);
    this.statusBarBottle.setPercentage(0);
    this.initSounds();
    this.setWorld();
    this.run();
    this.draw();
  }

  /**
   * Preloads all game sounds into the SoundManager.
   */
  initSounds() {
    this.soundManager.load('music', 'sounds/game/gameStart.mp3', false, 0.3);
    this.soundManager.load('walk', 'sounds/character/characterRun.mp3', true, 0.4);
    this.soundManager.load('jump', 'sounds/character/characterJump.wav', false, 0.5);
    this.soundManager.load('hurt', 'sounds/character/characterDamage.mp3', false, 0.6);
    this.soundManager.load('dead', 'sounds/character/characterDead.wav', false, 0.7);
    this.soundManager.load('snore', 'sounds/character/characterSnoring.mp3', true, 0.5);
    this.soundManager.load('chickenDead', 'sounds/chicken/chickenDead.mp3', false, 0.5);
    this.soundManager.load('bottleCollect', 'sounds/collectibles/bottleCollectSound.wav', false, 0.6);
    this.soundManager.load('coinCollect', 'sounds/collectibles/collectSound.wav', false, 0.6);
    this.soundManager.load('endboss', 'sounds/endboss/endbossApproach.wav', false, 0.7);
    this.soundManager.load('bottleBreak', 'sounds/throwable/bottleBreak.mp3', false, 0.6);
    this.soundManager.play('music');
  }

  /**
   * Links character and enemies to this world instance.
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();
    const boss = this.getEndboss();
    if (boss) boss.world = this;
  }

  /**
   * Returns the endboss from the level's enemy array.
   * @returns {Endboss}
   */
  getEndboss() {
    return this.level.enemies.find((e) => e instanceof Endboss);
  }

  /**
   * Starts the main game logic loops.
   * checkCollisions runs at 60fps to avoid missing fast-moving jump-kills.
   */
  run() {
    setInterval(() => {
      if (this.stopped || this.gameOver || this.paused) return;
      this.checkCollisions();
      this.checkThrowableHits();
    }, 1000 / 60);
    setInterval(() => {
      if (this.stopped || this.gameOver || this.paused) return;
      this.checkCoinCollisions();
      this.checkBottleCollisions();
      this.checkThrowInput();
      this.checkEndbossState();
      this.checkGameResult();
      this.removeMarkedObjects();
    }, 100);
  }

  /**
   * Handles the throw input with a short cooldown.
   */
  checkThrowInput() {
    if (this.keyboard.D && !this.throwCooldown && this.bottlesCollected > 0) {
      this.throwBottle();
      this.keyboard.D = false;
    }
  }

  /**
   * Spawns a throwable bottle from the character's position.
   */
  throwBottle() {
    const dirRight = !this.character.otherDirection;
    const xOffset = dirRight ? 80 : -30;
    const bottle = new ThrowableObject(
      this.character.x + xOffset,
      this.character.y + 100,
      dirRight,
    );
    this.throwableObjects.push(bottle);
    this.soundManager.play('bottleBreak');
    this.bottlesCollected--;
    this.throwCooldown = true;
    setTimeout(() => { this.throwCooldown = false; }, 500);
    const pct = Math.floor((this.bottlesCollected / this.maxBottles) * 100);
    this.statusBarBottle.setPercentage(Math.floor(pct / 20) * 20);
  }

  /**
   * Checks if any thrown bottle hits an enemy or endboss.
   */
  checkThrowableHits() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hasHit) return;
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead() && bottle.isCollidingNoPad(enemy)) {
          this.hitEnemy(enemy, bottle);
        }
      });
    });
  }

  /**
   * Applies hit to enemy and plays the appropriate sound.
   * @param {MovableObject} enemy
   * @param {ThrowableObject} bottle
   */
  hitEnemy(enemy, bottle) {
    bottle.playSplash();
    if (enemy instanceof Endboss) {
      enemy.hit(20);
      this.statusBarEndboss.setPercentage(enemy.energy);
    } else {
      enemy.hit(100);
      this.soundManager.play('chickenDead');
    }
  }

  /**
   * Checks character collisions with all enemies.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead() || this.character.isDead()) return;
      if (!this.character.isColliding(enemy)) return;
      const charBottom = this.character.y + this.character.height;
      const landedOnTop =
        !(enemy instanceof Endboss) &&
        this.character.speedY < 0 &&
        charBottom < enemy.y + enemy.height;
      if (landedOnTop) {
        enemy.hit(100);
        this.character.speedY = 12;
        this.soundManager.play('chickenDead');
      } else if (!this.character.isHurt()) {
        this.character.hit(10);
        this.soundManager.play('hurt');
        this.statusBarHealth.setPercentage(this.character.energy);
      }
    });
  }

  /**
   * Checks if the character collects any coins; each coin restores 5% health.
   */
  checkCoinCollisions() {
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      if (this.character.isColliding(this.level.coins[i])) {
        this.level.coins.splice(i, 1);
        this.coinsCollected++;
        this.soundManager.play('coinCollect');
        this.character.energy = Math.min(100, this.character.energy + 5);
        this.statusBarHealth.setPercentage(this.character.energy);
        const pct = Math.round((this.coinsCollected / this.maxCoins) * 100);
        this.statusBarCoin.setPercentage(Math.floor(pct / 20) * 20);
      }
    }
  }

  /**
   * Checks if the character picks up any ground bottles.
   */
  checkBottleCollisions() {
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      if (this.character.isColliding(this.level.bottles[i])) {
        this.level.bottles.splice(i, 1);
        this.bottlesCollected++;
        this.soundManager.play('bottleCollect');
        const pct = Math.floor((this.bottlesCollected / this.maxBottles) * 100);
        this.statusBarBottle.setPercentage(Math.floor(pct / 20) * 20);
      }
    }
  }

  /**
   * Updates the endboss state machine based on character position.
   */
  checkEndbossState() {
    const boss = this.getEndboss();
    if (!boss) return;
    if (!boss.alertPlayed && boss.isTriggered) {
      boss.alertPlayed = true;
      this.soundManager.play('endboss');
    }
    boss.checkState(this.character);
  }

  /**
   * Removes enemies and bottles marked for removal.
   */
  removeMarkedObjects() {
    this.level.enemies = this.level.enemies.filter((e) => !e.markedForRemoval);
    this.throwableObjects = this.throwableObjects.filter((b) => !b.markedForRemoval);
    this.level.bottles = this.level.bottles.filter((b) => !b.markedForRemoval);
  }

  /**
   * Checks win and lose conditions and triggers the correct end screen.
   */
  checkGameResult() {
    if (this.character.isDead() && this.character.deathHandled) {
      this.soundManager.play('dead');
      this.triggerGameOver(false);
    }
    const boss = this.getEndboss();
    if (boss && boss.markedForRemoval) {
      this.triggerGameOver(true);
    }
  }

  /**
   * Stops the game and shows win or lose screen.
   * @param {boolean} won - True if the player won
   */
  triggerGameOver(won) {
    if (this.gameOver) return;
    this.gameOver = true;
    this.soundManager.stopAll();
    setTimeout(() => {
      if (won) showWinScreen();
      else showLoseScreen();
    }, 1000);
  }

  /**
   * Main render loop using requestAnimationFrame.
   */
  draw() {
    if (this.stopped) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawParallaxLayers();
    this.ctx.translate(this.camera_x, 0);
    this.drawWorldObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHud();
    requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws all parallax background layers.
   */
  drawParallaxLayers() {
    this.parallaxLayers.forEach((layer) => {
      layer.update(this.camera_x);
      layer.draw(this.ctx);
    });
  }

  /**
   * Draws all world objects that scroll with the camera.
   */
  drawWorldObjects() {
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
  }

  /**
   * Draws the HUD (status bars) fixed to the screen.
   */
  drawHud() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarCoin);
    const boss = this.getEndboss();
    if (boss && boss.isTriggered) {
      this.addToMap(this.statusBarEndboss);
    }
  }

  /**
   * Draws all objects in an array onto the canvas.
   * @param {DrawableObject[]} objects
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Draws a single object, flipping it if facing left.
   * @param {DrawableObject} mO
   */
  addToMap(mO) {
    if (!mO.img || !mO.img.complete || mO.img.naturalWidth === 0) return;
    if (mO.otherDirection) {
      this.ctx.save();
      this.ctx.translate(mO.x + mO.width, mO.y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(mO.img, 0, 0, mO.width, mO.height);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(mO.img, mO.x, mO.y, mO.width, mO.height);
    }
  }
}
