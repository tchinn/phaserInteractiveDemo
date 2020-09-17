// http://localhost/phaser/phaser.js
// http://localhost/phaser/games/game.js
//"//cdn.jsdelivr.net/npm/phaser@3.11.0/dist/phaser.js"
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Scene1, Scene2, Scene3]
//    scene: {
//        preload: preload,
//        create: create,
//        update: update
//    }
};

var game = new Phaser.Game(config);


