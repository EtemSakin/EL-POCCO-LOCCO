class Character extends MovableObject {
  y = 80;
  height = 250;
  width = 120;
  speed = 5;
  bottlesCollected = 0;
  lastMoveTime = Date.now();
  deathHandled = false;
  deathFrame = 0;
  walkSoundPlaying = false;
  snoreSoundPlaying = false;

  IMAGES_IDLE = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  IMAGES_SLEEPING = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];

  world;

  constructor() {
    super();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
  }

  /**
   * Returns true if the character has been idle for more than 15 seconds.
   * @returns {boolean}
   */
  isSleeping() {
    return Date.now() - this.lastMoveTime > 15000;
  }

  /**
   * Returns true if any movement key is currently pressed.
   * @returns {boolean}
   */
  isMoving() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Starts movement and animation loops.
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimation(), 80);
  }

  /**
   * Handles keyboard input, movement, and camera follow.
   */
  handleMovement() {
    if (!this.world || this.isDead() || this.world.paused) return;
    const kb = this.world.keyboard;
    const levelEnd = this.world.level ? this.world.level.level_end_x : Infinity;
    const moved = this.applyKeyboardMovement(kb, levelEnd);
    if (moved) this.lastMoveTime = Date.now();
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Moves character left/right and handles jump input.
   * @param {Keyboard} kb - Keyboard state
   * @param {number} levelEnd - Maximum x coordinate
   * @returns {boolean} Whether the character moved this frame
   */
  applyKeyboardMovement(kb, levelEnd) {
    let moved = false;
    if (kb.RIGHT && this.x < levelEnd) {
      this.x += this.speed;
      this.otherDirection = false;
      moved = true;
    }
    if (kb.LEFT && this.x > 0) {
      this.x -= this.speed;
      this.otherDirection = true;
      moved = true;
    }
    if ((kb.SPACE || kb.UP) && !this.isAboveGround()) {
      this.jump();
      moved = true;
    }
    return moved;
  }

  /**
   * Selects and plays the correct animation for the current state.
   */
  handleAnimation() {
    if (!this.world || this.world.paused) return;
    if (this.isDead()) {
      this.handleDeathAnimation();
    } else if (this.isHurt()) {
      this.stopSnoreSound();
      this.playAnimation(this.IMAGES_HURT);
      this.playSoundOnce('hurt');
    } else if (this.isAboveGround()) {
      this.stopSnoreSound();
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.isMoving()) {
      this.playAnimation(this.IMAGES_WALKING);
      this.handleWalkSound();
    } else if (this.isSleeping()) {
      this.playAnimation(this.IMAGES_SLEEPING);
      this.handleSnoreSound();
    } else {
      this.playAnimation(this.IMAGES_IDLE);
      this.stopWalkSound();
      this.stopSnoreSound();
    }
  }

  /**
   * Plays the dead animation once frame-by-frame, then freezes the character.
   */
  handleDeathAnimation() {
    if (this.deathHandled) return;
    this.stopWalkSound();
    this.stopSnoreSound();
    const frame = Math.min(this.deathFrame, this.IMAGES_DEAD.length - 1);
    this.loadImage(this.IMAGES_DEAD[frame]);
    this.deathFrame++;
    if (this.deathFrame >= this.IMAGES_DEAD.length) {
      this.deathHandled = true;
    }
  }

  /**
   * Plays the walk sound loop if not already playing.
   */
  handleWalkSound() {
    if (!this.world.soundManager || this.walkSoundPlaying) return;
    this.walkSoundPlaying = true;
    this.world.soundManager.play('walk');
    this.stopSnoreSound();
  }

  /**
   * Stops the walk sound loop.
   */
  stopWalkSound() {
    if (!this.world || !this.world.soundManager || !this.walkSoundPlaying) return;
    this.walkSoundPlaying = false;
    this.world.soundManager.stop('walk');
  }

  /**
   * Plays the snore sound loop if not already playing.
   */
  handleSnoreSound() {
    if (!this.world.soundManager || this.snoreSoundPlaying) return;
    this.snoreSoundPlaying = true;
    this.world.soundManager.play('snore');
  }

  /**
   * Stops the snore sound.
   */
  stopSnoreSound() {
    if (!this.world || !this.world.soundManager || !this.snoreSoundPlaying) return;
    this.snoreSoundPlaying = false;
    this.world.soundManager.stop('snore');
  }

  /**
   * Plays a sound only when it hasn't been played recently.
   * @param {string} name - Sound identifier
   */
  playSoundOnce(name) {
    if (!this.world || !this.world.soundManager) return;
    if (!this.lastSoundTime || Date.now() - this.lastSoundTime > 800) {
      this.world.soundManager.play(name);
      this.lastSoundTime = Date.now();
    }
  }

  /**
   * Makes the character jump by setting vertical speed.
   */
  jump() {
    this.speedY = 15;
    if (this.world && this.world.soundManager) {
      this.world.soundManager.play('jump');
    }
  }
}
