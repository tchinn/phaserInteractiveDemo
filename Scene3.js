class Scene3 extends Phaser.Scene {

    constructor(){
        super("scene3");
        this.player;
        this.stars;
        this.bombs;
        this.platforms;
        this.cursors;
        this.starScore;
        this.survivalScore = 0;
        this.gameOver = false;
        this.starScoreText;
        this.survivalScoreText;
        this.survivalTimer;
        this.dropTimer;
    }

    init(data){
        this.starScore = data.starScore;
    }

    preload (){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('startButton', 'assets/startButton.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create (){
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 5,
            setXY: { x: 12, y: 0, stepX: 140 }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.bombs = this.physics.add.group();

        for (var i = 0; i < 5; i++){
            var bomb = this.bombs.create(20 + (140 * i), 16, 'bomb');
            bomb.body.setCollideWorldBounds(true);
            bomb.body.onWorldBounds = true;
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }

        this.physics.world.on('worldbounds', this.hitWorldBounds,this);

        this.starScoreText = this.add.text(16, 16, 'Star Score: ' + this.starScore, { fontSize: '32px', fill: '#000' });
        this.survivalScoreText = this.add.text(400, 16, 'Survival Score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.survivalTimer = this.time.addEvent({
            delay: 500,
            callback: this.updateSurvivalScore,
            callbackScope: this,
            loop: true
        });

        this.dropTimer = this.time.addEvent({
            delay: 1500,
            callback: this.dropBombsAndStars,
            callbackScope: this,
            loop: true
        });
    }

    update (){
        if (this.gameOver){
            return;
        }

        if (this.cursors.left.isDown){
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown){
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else{
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }

    collectStar (player, star){
        star.destroy();

        this.starScore += 10;
        this.starScoreText.setText('Star Score: ' + this.starScore);
    }



    hitBomb (player, bomb){
        this.survivalTimer.paused = true;
        this.dropTimer.paused = true;
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.starScore = 0;
        this.survivalScore = 0;
        this.add.text(25, 250, 'GAME OVER! Press the button to restart!', { fontSize: '32px', fill: '#000' });
        this.add.image(375, 425, 'startButton').setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.scene.start("startScreen")
        })
    }

    updateSurvivalScore(){
        this.survivalScore+=10
        this.survivalScoreText.setText('Survival Score: ' + this.survivalScore);
    }

    dropBombsAndStars(){
        for (var i = 0; i < 6; i++){
            var bomb = this.bombs.create(Phaser.Math.Between(0, 800), 16, 'bomb');
            bomb.body.setCollideWorldBounds(true);
            bomb.body.onWorldBounds = true;
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
            if(i % 2 == 0){
                var star = this.stars.create(Phaser.Math.Between(0, 800), 0, 'star');
                star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            }
        }
    }

    hitWorldBounds(body){
        body.gameObject.destroy();
    }
}
