const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    transparent: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [window.GameScene]
};

window.onload = function () {
    window.game = new Phaser.Game(config);

    // Listen for resize to update internal dimensions if needed
    window.addEventListener('resize', () => {
        if (window.game) window.game.scale.resize(document.getElementById('game-container').clientWidth, document.getElementById('game-container').clientHeight);
    });
};
