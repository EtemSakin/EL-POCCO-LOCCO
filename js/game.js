let canvas;
let world;
let keyboard = new Keyboard();


function init() {
    canvas = document.getElementById("canvas, ke");
    world = new World(canvas);

    console.log('My Character is', world.character);
    
}

window.addEventListener("keypress", (e) => {
    if (e.code == 39) {
        keyboard.RIGHT = true;
    }
    if (e.code == 37) {
        keyboard.LEFT = true;
    }
    if (e.code == 38) {
        keyboard.UP = true;
    }
    if (e.code == 40) {
        keyboard.DOWN = true;
    }
    if (e.code == 32) {
        keyboard.SPACE = true;
    }

});

window.addEventListener("keyup", (e) => {
    if (e.code == 39) {
        keyboard.RIGHT = false;
    } 
    if (e.code == 37) {
        keyboard.LEFT = false;
    }  
    if (e.code == 38) {
        keyboard.UP = false;
    }  
    if (e.code == 40) {
        keyboard.DOWN = false;
    }
    if (e.code == 32) {
        keyboard.SPACE = false;
    }
});