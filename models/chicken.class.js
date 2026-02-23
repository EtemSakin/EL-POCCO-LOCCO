class Chicken extends MovableObject {
    
    y = 350;
    height = 80;
    width = 100;


    constructor() {
        super();this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 300 + Math.random() * 500; 
    }
}