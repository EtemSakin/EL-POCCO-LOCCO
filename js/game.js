let canvas;
let world;
let keyboard = new Keyboard();

window.addEventListener('load', () => {
  canvas = document.getElementById('canvas');
  bindKeyboardEvents();
  bindButtonEvents();
  bindMobileEvents();
});

/**
 * Starts the game by hiding the start screen and creating the world.
 */
function startGame() {
  window.gamePaused = false;
  document.getElementById('startScreen').style.display = 'none';
  world = new World(canvas, keyboard);
}

/**
 * Restarts the game without reloading the page.
 */
function restartGame() {
  if (world) world.stopped = true;
  window.gamePaused = false;
  hideAllScreens();
  world = new World(canvas, keyboard);
}

/**
 * Shows the start screen and hides all other overlays.
 */
function goHome() {
  hideAllScreens();
  document.getElementById('startScreen').style.display = 'flex';
}

/** Hides all overlay screens. */
function hideAllScreens() {
  ['winScreen', 'loseScreen', 'controlsDialog', 'pauseScreen'].forEach((id) => {
    document.getElementById(id).classList.add('hidden');
  });
}

/** Opens the pause menu and freezes the game. */
function openPauseMenu() {
  if (!world || world.gameOver) return;
  world.paused = true;
  window.gamePaused = true;
  world.soundManager.pauseAll();
  document.getElementById('pauseScreen').classList.remove('hidden');
}

/** Closes the pause menu and resumes the game. */
function closePauseMenu() {
  if (!world) return;
  document.getElementById('pauseScreen').classList.add('hidden');
  world.paused = false;
  window.gamePaused = false;
  world.soundManager.resumeLooping();
}

/** Shows the win screen overlay. */
function showWinScreen() {
  document.getElementById('winScreen').classList.remove('hidden');
}

/** Shows the lose screen overlay. */
function showLoseScreen() {
  document.getElementById('loseScreen').classList.remove('hidden');
}

/**
 * Binds all UI button click events.
 */
function bindButtonEvents() {
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('restartBtnWin').addEventListener('click', restartGame);
  document.getElementById('restartBtnLose').addEventListener('click', restartGame);
  document.getElementById('homeBtnWin').addEventListener('click', goHome);
  document.getElementById('homeBtnLose').addEventListener('click', goHome);
  document.getElementById('controlsBtn').addEventListener('click', openControls);
  document.getElementById('closeControls').addEventListener('click', closeControls);
  document.getElementById('muteBtn').addEventListener('click', toggleMute);
  if (localStorage.getItem('muted') === 'true') {
    document.getElementById('muteBtn').textContent = '🔇';
  }
  document.getElementById('controlsDialog').addEventListener('click', (e) => {
    if (e.target === document.getElementById('controlsDialog')) closeControls();
  });
  document.getElementById('pauseBtn').addEventListener('click', openPauseMenu);
  document.getElementById('resumeBtn').addEventListener('click', closePauseMenu);
  document.getElementById('restartBtnPause').addEventListener('click', restartGame);
  document.getElementById('homeBtnPause').addEventListener('click', goHome);
}

/** Opens the controls dialog. */
function openControls() {
  document.getElementById('controlsDialog').classList.remove('hidden');
}

/** Closes the controls dialog. */
function closeControls() {
  document.getElementById('controlsDialog').classList.add('hidden');
}

/**
 * Toggles sound mute state and updates the mute button icon.
 */
function toggleMute() {
  if (!world) return;
  const muted = world.soundManager.toggleMute();
  document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
}

/**
 * Binds keyboard keydown and keyup events to the keyboard state object.
 */
function bindKeyboardEvents() {
  window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowRight') keyboard.RIGHT = true;
    if (e.code === 'ArrowLeft') keyboard.LEFT = true;
    if (e.code === 'ArrowUp') keyboard.UP = true;
    if (e.code === 'ArrowDown') keyboard.DOWN = true;
    if (e.code === 'Space') { e.preventDefault(); keyboard.SPACE = true; }
    if (e.code === 'KeyD') keyboard.D = true;
    if (e.code === 'Escape') {
      if (world && !world.gameOver) {
        if (world.paused) closePauseMenu();
        else openPauseMenu();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowRight') keyboard.RIGHT = false;
    if (e.code === 'ArrowLeft') keyboard.LEFT = false;
    if (e.code === 'ArrowUp') keyboard.UP = false;
    if (e.code === 'ArrowDown') keyboard.DOWN = false;
    if (e.code === 'Space') keyboard.SPACE = false;
    if (e.code === 'KeyD') keyboard.D = false;
  });
}

/**
 * Binds touch events for mobile control buttons.
 */
function bindMobileEvents() {
  bindTouchBtn('btnLeft', 'LEFT');
  bindTouchBtn('btnRight', 'RIGHT');
  bindTouchBtn('btnJump', 'SPACE');
  bindTouchBtn('btnThrow', 'D');
}

/**
 * Binds touchstart and touchend to a keyboard key for a mobile button.
 * @param {string} btnId - Button element ID
 * @param {string} key - Keyboard state key to toggle
 */
function bindTouchBtn(btnId, key) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard[key] = true; });
  btn.addEventListener('touchend', (e) => { e.preventDefault(); keyboard[key] = false; });
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
}
