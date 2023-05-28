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
    isJumpHeld: boolean

    //constants. modify these to tweak 
    static GRAVITY: number = 50;
    static X_INC: number = 60;
    static TOP_SPEED: number = 600;
    static JUMP_HEIGHT: number = -1500;
    static MAX_JUMPS: number = 2;
    static WALL_SLIDE_SPEED: number = 100;
    static WALL_FRICTION: number = 2;
    static TERMINAL_VELOCITY: number = 1700;

    constructor(scene: Phaser.Scene, x: number, y: number, image: string) {
        super(scene, x, y, image)
        this.jumpCount = Player.MAX_JUMPS;
        this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this)
        this.state = PlayerState.IN_AIR;
        this.movingLeft = false;
        this.movingRight = false;
        this.isJumpHeld = false;
    }

    private jump() {
        if (this.jumpCount) {
            this.setVelocityY(Player.JUMP_HEIGHT);
            this.jumpCount--;
            // make the player "bounce" off the wall when jumping when sliding
            if (this.state == PlayerState.LEFT_SLIDE) {
                this.setVelocityX(Player.TOP_SPEED);
            } else if (this.state == PlayerState.RIGHT_SLIDE) {
                this.setVelocityX(-Player.TOP_SPEED);
            }
        }
    }
    private setPlayerState(){
        if (this.body.touching.down || this.body.touching.left || this.body.touching.right ){
            if (this.body.touching.down ) {
                this.state = PlayerState.ON_GROUND;
            }
            if (this.body.touching.left  ) {
                this.state = PlayerState.LEFT_SLIDE;
            }
            if (this.body.touching.right ) {
                this.state = PlayerState.RIGHT_SLIDE;
            }
        } else {
            this.state = PlayerState.IN_AIR;
        }
    }
    update() {
        this.setPlayerState();
        //xor the moving because if youre pressing both we want 0 velocity
        switch (this.state) {
            case PlayerState.LEFT_SLIDE:
                if(this.movingLeft ){
                    //we want the player to slide down the wall slower hence the /2
                    this.setVelocityX(Math.max(this.body.velocity.x -Player.X_INC, -Player.TOP_SPEED));
                    let v = this.body.velocity.y + Player.GRAVITY/Player.WALL_FRICTION;
                    this.setVelocityY(Math.min(v, Player.WALL_SLIDE_SPEED));
                } else  {
                    this.setVelocityY(Math.min(this.body.velocity.y + Player.GRAVITY, Player.TERMINAL_VELOCITY));
                }
                break;

            case PlayerState.RIGHT_SLIDE:
                if(this.movingRight){
                    this.setVelocityX(Math.min(this.body.velocity.x +Player.X_INC, Player.TOP_SPEED));
                    let v = this.body.velocity.y + Player.GRAVITY/Player.WALL_FRICTION;
                    this.setVelocityY(Math.min(v, Player.WALL_SLIDE_SPEED));
                } else {
                    this.setVelocityY(Math.min(this.body.velocity.y + Player.GRAVITY, Player.TERMINAL_VELOCITY));

                }
                break;

            case PlayerState.IN_AIR:
                if(this.movingLeft){
                    this.setVelocityX(Math.max(this.body.velocity.x -Player.X_INC/2, -Player.TOP_SPEED));
                }
                if(this.movingRight){
                    this.setVelocityX(Math.min(this.body.velocity.x +Player.X_INC/2, Player.TOP_SPEED));
                }
                this.setVelocityY(Math.min(this.body.velocity.y + Player.GRAVITY, Player.TERMINAL_VELOCITY));
                break;

            case PlayerState.ON_GROUND:
                if(this.movingLeft){
                    this.setVelocityX(Math.max(this.body.velocity.x -Player.X_INC, -Player.TOP_SPEED));
                } else if(this.movingRight){
                    this.setVelocityX(Math.min(this.body.velocity.x +Player.X_INC, Player.TOP_SPEED));
                } else {
                    this.setVelocityX(0);
                }
                this.setVelocityY(Math.min(this.body.velocity.y + Player.GRAVITY, Player.TERMINAL_VELOCITY));
                break;

        }

        if(this.isJumpHeld){
            this.jump();
            this.isJumpHeld = false;
        }
        if (this.state != PlayerState.IN_AIR) {
            this.jumpCount = Player.MAX_JUMPS;
        }
    }
}