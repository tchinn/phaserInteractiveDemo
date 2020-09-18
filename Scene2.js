class Scene2 extends Phaser.Scene {

    constructor(){
        super("gameScreen");
        this.player;
        this.stars;
        this.greenStar;
        this.bombs;
        this.platforms;
        this.cursors;
        this.starScore = 0;
        this.gameOver = false;
        this.scoreText;
    }



    preload (){
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('greenStar', 'assets/greenStar.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('startButton', 'assets/startButton.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create (){
        this.starScore = 0;
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

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
            repeat: 10,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.greenStar = this.physics.add.group({
            key: 'greenStar',
            setXY: { x: 780, y: 20}
        });

        this.bombs = this.physics.add.group();

        var bomb = this.bombs.create(300, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

        this.scoreText = this.add.text(16, 16, 'Star Score: 0', { fontSize: '32px', fill: '#000' });

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.greenStar, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.greenStar, this.collectGreenStar, null, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
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

        if (this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-330);
        }
    }

    collectStar (player, star){
        star.disableBody(true, true);
        this.starScore += 10;
        this.scoreText.setText('Star Score: ' + this.starScore);

        if (this.stars.countActive(true) === 0){
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;

        }
    }

    collectGreenStar(player, greenStar) {
        greenStar.disableBody(true, true);
        this.scene.start("scene3", {starScore: this.starScore});
    }

    hitBomb (player, bomb){
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.starScore = 0;
        this.add.text(25, 250, 'GAME OVER! Press the button to restart!', { fontSize: '32px', fill: '#000' });
        this.add.image(375, 425, 'startButton').setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.scene.start("startScreen")
        })
    }
}
