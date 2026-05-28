class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 50;
  x = 8800;
  speed = 1.5;
  energy = 100;
  state = 'walking';
  isTriggered = false;
  markedForRemoval = false;
  deathTriggered = false;
  world = null;

  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  IMAGES_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  /**
   * Starts the animation and movement update loops.
   */
  animate() {
    setInterval(() => this.updateAnimation(), 120);
    setInterval(() => this.updateMovement(), 1000 / 60);
  }

  /**
   * Selects and plays the animation frame for the current state.
   */
  updateAnimation() {
    if (window.gamePaused) return;
    if (this.state === 'dead') {
      this.playDeadAnimation();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.state === 'attacking') {
      this.playAnimation(this.IMAGES_ATTACK);
    } else if (this.state === 'alert') {
      this.playAnimation(this.IMAGES_ALERT);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Plays the death animation sequence once, then marks for removal.
   */
  playDeadAnimation() {
    if (this.deathTriggered) return;
    this.deathTriggered = true;
    let frame = 0;
    const interval = setInterval(() => {
      this.loadImage(this.IMAGES_DEAD[frame]);
      frame++;
      if (frame >= this.IMAGES_DEAD.length) {
        clearInterval(interval);
        setTimeout(() => { this.markedForRemoval = true; }, 500);
      }
    }, 200);
  }

  /**
   * Moves the boss toward the character during attacking state.
   */
  updateMovement() {
    if (window.gamePaused || this.state !== 'attacking' || !this.world) return;
    const charX = this.world.character.x;
    this.x += charX < this.x ? -this.speed : this.speed;
  }

  /**
   * Updates the boss state based on character distance.
   * @param {Character} character - The player character
   */
  checkState(character) {
    if (this.state === 'dead') return;
    const distance = Math.abs(character.x - this.x);
    if (distance < 600 && this.state === 'walking') {
      this.state = 'alert';
      this.isTriggered = true;
    }
    if (distance < 400 && this.state === 'alert') {
      this.state = 'attacking';
    }
    if (this.isDead()) this.state = 'dead';
  }

  /**
   * Applies damage to the boss and temporarily enters hurt state.
   * @param {number} damage - Damage to deal
   */
  hit(damage = 20) {
    super.hit(damage);
    if (this.isDead()) {
      this.state = 'dead';
      return;
    }
    const prevState = this.state;
    this.state = 'hurt';
    setTimeout(() => {
      if (this.state === 'hurt') this.state = prevState;
    }, 800);
  }
}
