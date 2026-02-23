class Cloud extends MovableObject {
    y = 50  
    height = 250;
    width = 500;

    constructor(x, y) {
        super().loadImage('img/5_background/layers/4_clouds/full.png');
        this.x = 0 + Math.random() * 500;
    }
}