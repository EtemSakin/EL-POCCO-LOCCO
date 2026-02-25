class World { 
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);  


        this.addObjectstoMap(this.level.backgroundObjects);
       this.addtoMap(this.character); 
       this.addObjectstoMap(this.level.enemies);
       this.addObjectstoMap(this.level.clouds);
       this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectstoMap(objects) {
        objects.forEach(o => {
            this.addtoMap(o);
        });
    }

    addtoMap(mO) {
        if (mO.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mO.width, 0);
            this.ctx.scale(-1, 1);
            mO.x = mO.x * -1;
        }
        this.ctx.drawImage(mO.img, mO.x, mO.y, mO.width, mO.height);
        if (mO.otherDirection) {
            mO.x = mO.x * -1;
            this.ctx.restore();
        }
    }
}
