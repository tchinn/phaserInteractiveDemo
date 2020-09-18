class Scene1 extends Phaser.Scene {
    constructor(){
        super("startScreen");
    }
    
    preload() {
        this.load.image('startButton', 'assets/startButton.png');
    }
    
    create() {
        this.add.text(20,20, "Phaser Interactive Demo by Tyler Chinn");
        this.add.text(20,40, "Instructions:\nTo start the Game and scene 1 click the START button.\nOnce the game starts collect yellow stars to score star points and collect the \ngreen star to go to scene 2. In scene 2 survive the bombs as long as possible\nwhile continuing to collect starts. The longer you survive the higher\nyour survival score! If you die press the button that shows up to restart!");
        this.add.image(400, 300, 'startButton').setInteractive().on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            this.scene.start("gameScreen")
        })
    }
}