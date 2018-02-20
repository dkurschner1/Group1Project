//= require phaser
(function($){
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamecontainer', { preload: preload, create: create, update: update });
    var spaceship;
    var bullets;
    var fireButton;
    var bulletTime = 0;
    
    function preload() {
        game.load.image('spaceship', '../spaceship.png');
        game.load.image('bullet', '../torpedo2.png');
    }

    function create() {
        //spaceship.scale.setTo(2,2);
        spaceship = game.add.sprite(0, 0, 'spaceship');
        //  We need to enable physics on the player
        game.physics.arcade.enable(spaceship);
        
        //  Our two animations, walking left and right.
        spaceship.animations.add('left', [0, 1, 2, 3], 10, true);
        spaceship.animations.add('right', [5, 6, 7, 8], 10, true);
        
        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function update() {
        var cursors = game.input.keyboard.createCursorKeys();
        //  Reset the players velocity (movement)
        spaceship.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            spaceship.body.velocity.x = -150;

            spaceship.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            spaceship.body.velocity.x = 150;

            spaceship.animations.play('right');
        }
        else
        {
            //  Stand still
            spaceship.animations.stop();

            spaceship.frame = 4;
        }
        
        //  Firing?
        if (fireButton.isDown)
        {
            fireBullet();
        }
        
        function fireBullet () {

            //  To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > bulletTime)
            {
                //  Grab the first bullet we can from the pool
                bullet = bullets.getFirstExists(false);

                if (bullet)
                {
                    //  And fire it
                    bullet.reset(spaceship.x, spaceship.y + 8);
                    bullet.body.velocity.y = -400;
                    bulletTime = game.time.now + 200;
                }
            }

        }

        function resetBullet (bullet) {

            //  Called if the bullet goes out of the screen
            bullet.kill();

        }
    }
})(jQuery);