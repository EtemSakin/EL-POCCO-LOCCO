class SoundManager {
  sounds = {};
  muted = false;
  throwAudioContext = null;

  constructor() {
    this.muted = localStorage.getItem('muted') === 'true';
    this.initThrowAudio();
  }

  /**
   * Prepares a WebAudio context for procedural throw sounds.
   */
  initThrowAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    this.throwAudioContext = new AudioContextClass();
  }

  /**
   * Loads an audio file and registers it under the given name.
   * @param {string} name - Identifier for the sound
   * @param {string} path - File path to the audio
   * @param {boolean} loop - Whether the sound should loop
   * @param {number} volume - Volume between 0.0 and 1.0
   */
  load(name, path, loop = false, volume = 1.0) {
    const audio = new Audio(path);
    audio.loop = loop;
    audio.volume = volume;
    this.sounds[name] = audio;
  }

  /**
   * Plays a loaded sound if not muted.
   * @param {string} name - Identifier of the sound to play
   */
  play(name) {
    if (this.muted || !this.sounds[name]) return;
    this.sounds[name].currentTime = 0;
    this.sounds[name].play().catch(() => {});
  }

  /**
   * Plays a short procedural whoosh for bottle throws.
   */
  playThrow() {
    if (this.muted || !this.throwAudioContext) return;
    const ctx = this.throwAudioContext;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(520, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.17);
  }

  /**
   * Stops a currently playing sound.
   * @param {string} name - Identifier of the sound to stop
   */
  stop(name) {
    if (!this.sounds[name]) return;
    this.sounds[name].pause();
    this.sounds[name].currentTime = 0;
  }

  /**
   * Stops all loaded sounds.
   */
  stopAll() {
    Object.values(this.sounds).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Pauses all currently playing sounds and records which ones were active.
   */
  pauseAll() {
    this._pausedWhilePlaying = [];
    Object.entries(this.sounds).forEach(([name, audio]) => {
      if (!audio.paused) {
        this._pausedWhilePlaying.push(name);
        audio.pause();
      }
    });
  }

  /**
   * Resumes only the sounds that were playing before pauseAll() was called.
   */
  resumeLooping() {
    if (this.muted) return;
    (this._pausedWhilePlaying || []).forEach((name) => {
      if (this.sounds[name]) this.sounds[name].play().catch(() => {});
    });
    this._pausedWhilePlaying = [];
  }

  /**
   * Toggles mute state and persists it in localStorage.
   * @returns {boolean} New muted state
   */
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('muted', this.muted);
    if (this.muted) {
      this.pauseAll();
    } else {
      this.resumeLooping();
    }
    return this.muted;
  }
}
