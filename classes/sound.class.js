class SoundManager {
  sounds = {};
  muted = false;

  constructor() {
    this.muted = localStorage.getItem('muted') === 'true';
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
