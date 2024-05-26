var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var cats;

function preload() {
    this.load.image('sky', 'assets/images/Sky.png');
    this.load.image('Ground', 'assets/images/platform.png');
    this.load.image('cat', 'assets/images/cat.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('catcher', 'assets/images/catcher.png');
}

function create() {
    var sky = this.add.image(0, 0, 'sky');
    sky.setOrigin(0, 0);
    sky.setScale(config.width / sky.width, config.height / sky.height);

    var platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, 'Ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 400, 'catcher');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(0.3);

    cats = this.physics.add.group({
        key: 'cat',
        repeat: 0,
        setXY: { x: 500, y: 0, stepX: 70 }
    });

    cats.children.iterate(function (child) {
        child.setScale(0.3);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    function collectCat(player, cat) {
        cat.disableBody(true, true);
        
        score += 10;
        scoreText.setText('Score: ' + score);
    }

    var score = 0;
    var scoreText;
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(cats, platforms);
    this.physics.add.collider(player, platforms);

    this.physics.add.overlap(player, cats, collectCat, null, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (!player) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        // Assuming you have animations defined for left and right
        // player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        // player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        // player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
