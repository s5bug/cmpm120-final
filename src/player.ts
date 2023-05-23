export class Player extends Phaser.Physics.Arcade.Sprite {
    jumpCount: number
    body: Phaser.Physics.Arcade.Body
    inAir: boolean

    constructor(scene: Phaser.Scene,x: number, y: number,  image: string ) {
        super(scene, x, y, image)
        this.jumpCount = 2;
        this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this)
        this.inAir = false;
    }

    jump() {
        if (this.jumpCount) {
            this.setVelocityY(-1000);
            this.jumpCount--;
        }
    }
    update() {
        if (this.body.bottom != this.scene.game.config.height) {
            this.inAir = true;
        } else {
            this.inAir = false;
            this.jumpCount = 2;
        }
    }





}