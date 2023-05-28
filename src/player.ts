export enum PlayerState {
    ON_GROUND,
    IN_AIR,
    LEFT_SLIDE,
    RIGHT_SLIDE
}
export class Player extends Phaser.Physics.Arcade.Sprite {
    jumpCount: number
    body: Phaser.Physics.Arcade.Body
    state: PlayerState
    movingLeft: boolean
    movingRight: boolean
    //constants. modify these to tweak 
    static GRAVITY: number = 50;
    static X_INC: number = 60;
    static TOP_SPEED: number = 600;

    constructor(scene: Phaser.Scene, x: number, y: number, image: string) {
        super(scene, x, y, image)
        this.jumpCount = 2;
        this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this)
        this.state = PlayerState.IN_AIR;
        this.movingLeft = false;
        this.movingRight = false;
    }

    jump() {
        if (this.jumpCount) {
            this.setVelocityY(-1000);
            this.jumpCount--;
            if (this.state == PlayerState.LEFT_SLIDE) {
                this.setVelocityX(Player.TOP_SPEED);
            } else if (this.state == PlayerState.RIGHT_SLIDE) {
                this.setVelocityX(-Player.TOP_SPEED);
            }


        }
    }
    update() {
        //xor the moving because if youre pressing both we want 0 velocity
        if ((this.movingLeft && !this.movingRight) || (this.movingRight && !this.movingLeft)) {
            if(this.movingLeft && this.state == PlayerState.LEFT_SLIDE){
                this.setVelocityX(Math.max(this.body.velocity.x -Player.X_INC, -Player.TOP_SPEED));
                this.setVelocityY(this.body.velocity.y/2 + Player.GRAVITY);
            } 
            if(this.movingLeft && this.state == PlayerState.IN_AIR){
                this.setVelocityX(Math.max(this.body.velocity.x -Player.X_INC/2, -Player.TOP_SPEED));
                this.setVelocityY(this.body.velocity.y + Player.GRAVITY);
            }
            if(this.movingLeft && this.state == PlayerState.ON_GROUND){
                this.setVelocityX(Math.max(this.body.velocity.x -Player.X_INC, -Player.TOP_SPEED));
                this.setVelocityY(this.body.velocity.y + Player.GRAVITY);
            } 
            if(this.movingRight && this.state == PlayerState.RIGHT_SLIDE){
                this.setVelocityX(Math.min(this.body.velocity.x +Player.X_INC, Player.TOP_SPEED));
 
                this.setVelocityY(this.body.velocity.y/2 + Player.GRAVITY);
            }
            if(this.movingRight && this.state == PlayerState.IN_AIR){
                this.setVelocityX(Math.min(this.body.velocity.x +Player.X_INC/2, Player.TOP_SPEED));
                this.setVelocityY(this.body.velocity.y + Player.GRAVITY);
            }
            if(this.movingRight && this.state == PlayerState.ON_GROUND){
                this.setVelocityX(Math.min(this.body.velocity.x +Player.X_INC, Player.TOP_SPEED));
 
                this.setVelocityY(this.body.velocity.y + Player.GRAVITY);
            }

        } else {
            this.setVelocityY(this.body.velocity.y + Player.GRAVITY);
            this.setVelocityX(0);
        }

        if (this.state == PlayerState.ON_GROUND || this.state == PlayerState.LEFT_SLIDE || this.state == PlayerState.RIGHT_SLIDE) {
            this.jumpCount = 2;
        }
    }
}