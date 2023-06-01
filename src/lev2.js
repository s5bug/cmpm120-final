class Level2 extends Phaser.Scene {
    constructor() {
        super('level2');
        //this.map = null;
    }

    preload() {
        this.load.path = "./assets/";
        // map made with Tiled in JSON format
        this.load.tilemapTiledJSON('lab2', 'lab2.json');
        // tiles in spritesheet 
        this.load.spritesheet('tileset', 'lab.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('player', 'dashstill.png');
        this.load.image('flag', 'portal.png');
        this.load.image('pause', 'pause.png');
    }

    create() {
        previousScene = this.scene.key;

        const camera = this.cameras.main;

        this.pause = this.add.image(camera.width * 4 - 500, camera.height * 4 - 500, 'pause')
        console.log(this.pause);
        console.log(camera.width);
        console.log(camera.height);
        this.pause.setDepth(1)
            .setInteractive()
            .on('pointerover', () => this.pause.setAlpha(0.4))
            .on('pointerout', () => this.pause.setAlpha(1))
            .on('pointerdown', () => {
                this.scene.start('pause')
            });
        this.pause.setScale(1);
        this.pause.setOrigin(1, 0); // Set the origin to the top right corner

        // Keep the image anchored to the top right corner during camera scroll
        this.cameras.main.scrollX = 0; // Set the initial scroll position to 0
        this.cameras.main.scrollY = 0;
        this.cameras.main.setScroll(this.pause.width, 0);
        // this.rectangleGroup = this.physics.add.group([
        //     this.add.rectangle(100, 800, 4000, 100, 0xFF0000)
        //         .setDepth(1)
        //         .setVisible(false),

        //     this.add.rectangle(225, 660, 60, 60, 0xFF0000)
        //         .setDepth(1)
        //         .setVisible(false),
        // ]);
        // this.rectangleGroup.getChildren().forEach(rectangle => {
        //     rectangle.body.setAllowGravity(false);
        // });

        this.flagob = this.physics.add.image(1600, 4690, 'flag');
        this.flagob.body.allowGravity = false;
        this.flagob.setDepth(1);
        this.flagob.setScale(4);
        this.flagob.setImmovable(true);

        this.physics.world.gravity.y = 500;
        // load the map 
        map = this.make.tilemap({ key: 'lab2' });

        // tiles for the ground layer
        var groundTiles = map.addTilesetImage('tileset');
        // create the ground layer
        wallLayer = map.createLayer('walls', groundTiles, 0, 0).setScale(4);
        // wallLayer.setDepth(0);
        miscLayer = map.createLayer('misc', groundTiles, 0, 0).setScale(4);
        // wallLayer.setDepth(2);
        groundLayer = map.createLayer('Ground', groundTiles, 0, 0).setScale(4);
        // groundLayer.setDepth(1);
        // the player will collide with this layer
        groundLayer.setCollisionByExclusion([-1]);

        // set the boundaries of our game world
        this.physics.world.bounds.width = groundLayer.width * 4;
        this.physics.world.bounds.height = groundLayer.height * 4;

        // create the player sprite    
        player = this.physics.add.sprite(200 * 4, 200 * 4, 'player');
        player.setBounce(0.2); // our player will bounce from items
        player.setScale(4);
        player.setDepth(2);
        player.setCollideWorldBounds(true); // don't go out of the map   

        const duration = 2000; // Duration in milliseconds
        const numFlashes = 4; // Number of times the sprite will flash
        // Define the tween animation
        this.tweens.add({
            targets: player,
            alpha: 0, // Make the sprite transparent
            ease: 'Linear',
            duration: duration / (2 * numFlashes), // Divide the duration evenly across the number of flashes
            repeat: numFlashes - 1, // Number of additional flashes (subtracting the initial state)
            yoyo: true, // Make the tween reverse back to its initial state
            onComplete: () => {
                // Reset the sprite's alpha to 1 (fully opaque) after the tween is complete
                player.alpha = 1;
            }
        });


        var objectLayer = map.getObjectLayer('objs');
        var start = objectLayer.objects.find(obj => obj.name === 'start');
        player.setPosition(start.x * 4, start.y * 4);
        //console.log(player);

        var win = objectLayer.objects.find(obj => obj.name === 'finish');
        // Create a new Phaser 3 Rectangle object using the found object's properties
        // this.winrect = new Phaser.Geom.Rectangle(win.x * 3, win.y * 3, win.width * 3, win.height * 3);


        // small fix to our player images, we resize the physics body object slightly
        player.body.setSize(player.width, player.height - 8);

        // player will collide with the level tiles 
        this.physics.add.collider(groundLayer, player);

        var spikeob = objectLayer.objects.find(obj => obj.name === 'spike');
        this.physics.add.overlap(player, spikeob, this.handleSpikeCollision, null, this);

        // // player walk animation
        // this.anims.create({
        //     key: 'walk',
        //     frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        //     frameRate: 10,
        //     repeat: -1
        // });
        // // idle with only one frame, so repeat is not neaded
        // this.anims.create({
        //     key: 'idle',
        //     frames: [{key: 'player', frame: 'p1_stand'}],
        //     frameRate: 10,
        // });

        cursors = this.input.keyboard.createCursorKeys();

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, map.widthInPixels * 4, map.heightInPixels * 4);
        // make the camera follow the player
        this.cameras.main.startFollow(player);

        // set background color, so the sky is not black    
        this.cameras.main.setBackgroundColor('#ccccff');
    }

    update(time, delta) {
        const camera = this.cameras.main;
        const margin = 10; // Margin from the edge of the camera view

        // Calculate the new position of the pause image
        const newX = camera.worldView.right - this.pause.width * this.pause.scaleX - margin;
        const newY = camera.worldView.top + margin;

        // Set the new position of the pause image
        this.pause.setPosition(newX + 50, newY);
        this.physics.add.collider(player, this.flagob, nextsce, null, this);
            // Collision callback function
            function nextsce() {
                // Trigger the scene change here
                // For example:
                this.scene.start('level3');
            }
        // this.physics.add.collider(player, this.rectangleGroup, redo, null, this);
        //     // Collision callback function
        //     function redo() {
        //         // Trigger the scene change here
        //         // For example:
        //         this.scene.start('level1');
        //     }

        // if (Phaser.Geom.Rectangle.ContainsPoint(this.winrect, { x: player.width, y: player.height })) {
        //     //this.scene.start('cut3');
        // }

        if (cursors.left.isDown) {
            player.body.setVelocityX(-500);
            //player.anims.play('walk', true); // walk left
            player.flipX = true; // flip the sprite to the left
        }
        else if (cursors.down.isDown) {
            //player.body.setVelocityY(-500); 
            player.body.allowGravity = false;
        }
        else if (cursors.space.isDown) {
            //player.body.setVelocityY(-500); 
            player.body.allowGravity = true;
        }
        else if (cursors.right.isDown) {
            player.body.setVelocityX(500);
            //player.anims.play('walk', true);
            player.flipX = false; // use the original sprite looking to the right
        } else {
            player.body.setVelocityX(0);
            //player.anims.play('idle', true);
        }
        // jump 
        if (cursors.up.isDown && player.body.onFloor()) {
            player.body.setVelocityY(-500);
        }
    }
}