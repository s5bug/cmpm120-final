import 'phaser';
import player from './assets/player.png';
import { Player } from './player';
type Keys = {
    jump: Phaser.Input.Keyboard.Key | null,
    left: Phaser.Input.Keyboard.Key | null,
    right: Phaser.Input.Keyboard.Key | null,
}
class TestScene extends Phaser.Scene {
    player: null | Player;
    ghost: null | Phaser.GameObjects.Sprite;
    w: number
    h: number
    keys: Keys
    
    //constants. modify these to tweak 
    static GRAVITY: number = 50;
    static X_INC: number = 600;
    
    constructor() {
        super('test');
        this.w = 0;
        this.h = 0;
        this.player = null;
        this.ghost = null;
        this.keys = {
            jump: null,
            left: null,
            right: null,
        };
    }
    preload() {
        this.load.image('player', player);
    }
    addKeys(){
        this.keys.jump = this.input.keyboard!.addKey('W');
        this.keys.left = this.input.keyboard!.addKey('A');
        this.keys.right = this.input.keyboard!.addKey('D');
        this.keys.jump?.on('down', () => {
            this.player?.jump();
        })
    }
    setUp(){
        this.addKeys();
        this.w = this.game.config.width as number;
        this.h = this.game.config.height as number;
        this.player = new Player(this, this.w / 2, this.h / 2, 'player').setScale(0.5);
        this.add.existing(this.player);
        this.physics.add.existing(this.player);
        this.physics.world.setBounds(0, 0, this.w, this.h);
        this.player.setCollideWorldBounds(true);
    }
    addGhost(){
        this.ghost = this.add.sprite(this.w / 2, this.h / 2, 'player').setScale(0.5).setAlpha(0.25);
        this.time.addEvent({
            delay: 1,
            callback: () => {
                let x = this.player?.x;
                let y = this.player?.y;
                this.time.delayedCall(500, () => {
                    this.ghost!.x = x as number;
                    this.ghost!.y = y as number;
                })
            },
            loop: true
        })
    }
    create() {
        this.setUp();

        //get rid of this if you don't want the ghost
        this.addGhost();
        

    }
    update() {
        //call the update function of the player
        //which checks for Player.inAir and Player.jumpCount
        this.player?.update();
        if(this.player?.inAir){
            this.player?.setVelocityY(this.player?.body.velocity.y + TestScene.GRAVITY);
        } else {
            this.player?.setVelocityY(TestScene.GRAVITY);
        }

        if(this.keys.left?.isDown||this.keys.right?.isDown){
            if(this.keys.left?.isDown){
                this.player?.setVelocityX(-TestScene.X_INC);
            }
            if(this.keys.right?.isDown){
                this.player?.setVelocityX(TestScene.X_INC);
            }
        } else  {
            this.player?.setVelocityX(0);
        }

    }
}

let game = new Phaser.Game({
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    input: {
        keyboard: true,
    },
    parent: 'app',
    title: "CMPM120 Final",
    scene: [TestScene]
})

declare global {
    interface Window { game: Phaser.Game }
}

window.game = game;
