import 'phaser';
import player from './assets/player.png';

class TestScene extends Phaser.Scene {
    player: Phaser.Physics.Arcade.Sprite;
    constructor() {
        super('test');
    }
    preload() {

        this.load.image('player', player);
    }
    jump() {
        if (this.player.jumpCount) {
            this.player.setVelocityY(-1000);
            this.player.jumpCount--;
        }
    }
    create() {
        this.physics.world.setBounds(0, 0, this.game.config.width, this.game.config.height, true, true, true, true);
        this.cursors = this.input.keyboard?.createCursorKeys();
        // this.wall = this.matter.add.rectangle(this.game.config.width * 0.5, this.game.config.height * 0.5, this.game.config.width * 0.8, 100, { isStatic: true });

        this.player = this.physics.add.sprite(this.game.config.width * 0.5, this.game.config.height * 0.5, 'player').setScale(0.4).setCollideWorldBounds(true, 0, 0, true);
        console.log(this.player)
        this.player.jumpCount = 2;
        this.player.setBounce(0.5, 0)
        // this.player.
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {

            if(!up) {
                this.player.jumpCount = 2;
            } else {
                console.log("up")
            }
        });

        this.cursors.up.on('down', (event: KeyboardEvent) => {
            console.log("up")
            this.jump();
        })
        this.cursors.space.on('down', (event: KeyboardEvent) => {
            this.jump();
        })
    }
    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        } else {
            this.player.setVelocityX(0);
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
            gravity: { y: 2000 },
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
