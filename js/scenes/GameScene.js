class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // No external assets for now, we draw everything with Graphics
        // But we could load images if provided.
        // We will generate simple textures for performance.
    }

    create() {
        // --- GAME VARIABLES ---
        this.gameWidth = this.scale.width;
        this.gameHeight = this.scale.height;
        this.score = 0;
        this.ammo = 0;
        this.powerLevel = 1;
        this.monstersKilled = 0;
        this.shakeIntensity = 0;

        this.wordList = [];
        this.currentWord = "";
        this.startIndex = 0;
        this.typedIndex = 0;

        this.isAiming = false;
        this.playerAngle = -Math.PI / 2;

        // --- GROUPS ---
        this.bullets = this.physics.add.group({
            defaultKey: null
        });

        this.enemies = this.add.group({ runChildUpdate: true });
        this.particles = this.add.group({ runChildUpdate: true });

        // --- PLAYER ---
        this.playerContainer = this.add.container(this.gameWidth / 2, this.gameHeight - 100);
        this.createPlayerGraphics();

        // --- INPUT ---
        this.input.on('pointerdown', this.startAim, this);
        this.input.on('pointermove', this.updateAim, this);
        this.input.on('pointerup', this.fire, this);
        // We also need to handle touch cancels or outside clicks
        this.input.on('gameout', () => { this.isAiming = false; });

        // --- AIM LINE ---
        this.aimLine = this.add.graphics();
        this.aimLine.visible = false;

        // --- INIT UI ---
        // We don't start the game loop logic until startGame is called
        this.isPlaying = false;

        // Resize handling
        this.scale.on('resize', this.resize, this);
    }

    createPlayerGraphics() {
        this.playerContainer.removeAll(true);

        const g = this.add.graphics();

        // Barrel
        const barrelWidth = 12 + (this.powerLevel * 2);
        g.fillStyle(0xcccccc);
        g.fillRect(-17.5, -barrelWidth / 2, 35, barrelWidth); // centered y

        // Blue Stripe
        g.fillStyle(0x00d2ff);
        g.fillRect(-12.5, -2, 25, 4);

        // Gold Stripes for Power >= 3
        if (this.powerLevel >= 3) {
            g.fillStyle(0xffcc00);
            g.fillRect(-7.5, -barrelWidth / 2 - 4, 10, 4);
            g.fillRect(-7.5, barrelWidth / 2, 10, 4);
        }

        // Body
        g.fillStyle(0x444444);
        g.fillCircle(0, 0, 25);

        // Glow (using a circle with alpha)
        if (this.powerLevel > 1) {
            const glow = this.add.circle(0, 0, 35, 0x00ffff, 0.1 + (this.powerLevel * 0.05));
            this.playerContainer.add(glow);

            // Twin on create
            this.tweens.add({
                targets: glow,
                scaleX: 1.1,
                scaleY: 1.1,
                yoyo: true,
                repeat: -1,
                duration: 500
            });
        }

        this.playerContainer.add(g);
    }

    startGame(wordList) {
        this.wordList = wordList;
        this.isPlaying = true;
        this.score = 0;
        this.ammo = 0;
        this.powerLevel = 1;
        this.monstersKilled = 0;
        this.globalEnemySpeed = 0.05;
        this.bullets.clear(true, true);
        this.enemies.clear(true, true);
        this.particles.clear(true, true);

        // Reset Player Position just in case
        this.playerContainer.setPosition(this.gameWidth / 2, this.gameHeight - 80);
        this.createPlayerGraphics();

        this.nextWord();
        this.spawnEnemy();

        window.uiManager.updateHUD(this.score, this.powerLevel, this.ammo);
    }

    nextWord() {
        if (!this.isPlaying) return;

        this.currentWord = Phaser.Utils.Array.GetRandom(this.wordList);
        // Sanitize
        let cleanWord = this.currentWord.replace(/[^a-zA-Z]/g, '');

        // Difficulty Logic
        let lettersToHide = 1 + Math.floor(this.monstersKilled / 3);
        if (lettersToHide > cleanWord.length) lettersToHide = cleanWord.length;

        this.startIndex = this.currentWord.length - lettersToHide;
        this.typedIndex = this.startIndex;

        // UI
        window.uiManager.updateWordDisplay(this.currentWord, this.startIndex, this.typedIndex);
        window.uiManager.generateKeyboard(this.currentWord, (char) => this.handleKeyInput(char));

        this.time.delayedCall(100, () => this.speakCurrentWord());
    }

    speakCurrentWord() {
        if (window.AudioUtils) window.AudioUtils.speakWord(this.currentWord);
    }

    handleKeyInput(char) {
        if (!this.isPlaying) return;

        // Handle spaces
        let targetChar = this.currentWord[this.typedIndex];
        if (targetChar === ' ') {
            this.typedIndex++;
            targetChar = this.currentWord[this.typedIndex];
        }

        if (char === targetChar.toUpperCase()) {
            this.typedIndex++;
            this.ammo++;

            window.uiManager.updateWordDisplay(this.currentWord, this.startIndex, this.typedIndex);
            window.uiManager.updateHUD(this.score, this.powerLevel, this.ammo);
            window.AudioUtils.playSound('load');

            if (this.typedIndex >= this.currentWord.length) {
                this.time.delayedCall(100, () => this.nextWord());
            }
        }
    }

    spawnEnemy() {
        if (!this.isPlaying) return;

        const x = Phaser.Math.Between(50, this.gameWidth - 50);
        const enemy = this.add.container(x, -80);

        // Enemy hitbox for physics
        const size = 60;
        const hitbox = this.add.rectangle(0, 0, size, size, 0x000000, 0); // invisible
        this.physics.add.existing(hitbox);
        enemy.add(hitbox);
        enemy.body = hitbox.body; // Map container body to hitbox body for ease, or just use hitbox in overlap
        // Actually, container physics is tricky in Phaser 3. 
        // Better to add the hitbox to a physics group and link it to the container.
        // OR simpler: Just manually check distance or bounds. 
        // Since we initialized physics, let's try to use it correctly.
        // We'll put the hitbox in a separate physics group for collision.

        // Enemy Graphics
        const g = this.add.graphics();

        g.fillStyle(0xff4444);
        // Draw nice shape (semi circle top, jagged bottom)
        g.beginPath();
        g.arc(0, 0, size / 2, Math.PI, 0); // Top half
        g.lineTo(size / 2, size / 2);
        // Jagged bottom
        for (let i = 0; i <= size; i += size / 4) {
            g.lineTo(size / 2 - i, size / 2 + (i % 20 == 0 ? 5 : 0));
        }
        g.lineTo(-size / 2, 0);
        g.fillPath();

        // Eyes
        g.fillStyle(0xffffff);
        g.fillCircle(-15, -10, 8);
        g.fillCircle(15, -10, 8);
        g.fillStyle(0x000000);
        g.fillCircle(-15, -10, 3);
        g.fillCircle(15, -10, 3);

        // Health Bar BG
        g.fillStyle(0x550000);
        g.fillRect(-size / 2, -size / 2 - 15, size, 6);

        enemy.add(g);

        // Health Bar FG (Dynamic)
        const hpBar = this.add.graphics();
        enemy.add(hpBar);
        enemy.hpBar = hpBar;

        // Stats
        let baseMaxHp = 1 + (0.5 + (this.powerLevel * 0.5)) * this.monstersKilled; // Simple scaling
        if (this.monstersKilled === 0) baseMaxHp = 1; // First start easy

        enemy.maxHp = Math.max(1, Math.floor(1 + (this.monstersKilled * 0.5)));
        enemy.hp = enemy.maxHp;

        this.updateEnemyHpBar(enemy);

        this.enemies.add(enemy);

        // Movement Logic
        enemy.update = function () {
            this.y += this.scene.globalEnemySpeed;
            this.y += Math.sin(this.scene.time.now * 0.005) * 0.5; // Bobbing

            // Sync hitbox position (if we used separate hitbox)
            // But since we just want simple overlap, let's stick to simple rectangle check in Update

            if (this.y > this.scene.gameHeight + 50) {
                this.scene.gameOver();
            }
        };
    }

    updateEnemyHpBar(enemy) {
        enemy.hpBar.clear();
        enemy.hpBar.fillStyle(0x00ff00);
        const size = 60;
        const pct = enemy.hp / enemy.maxHp;
        enemy.hpBar.fillRect(-size / 2, -size / 2 - 15, size * pct, 6);
    }

    startAim(pointer) {
        // Ignore if clicking UI (Phaser doesn't capture UI clicks if they stop prop, which we did)
        if (!this.isPlaying) return;
        this.isAiming = true;
        this.updateAim(pointer);
    }

    updateAim(pointer) {
        if (!this.isAiming) return;

        // Calculate angle from player to pointer
        this.playerAngle = Phaser.Math.Angle.Between(
            this.playerContainer.x, this.playerContainer.y,
            pointer.x, pointer.y
        );
        this.playerContainer.rotation = this.playerAngle + Math.PI / 2;

        // Draw line
        this.aimLine.clear();
        this.aimLine.visible = true;
        this.aimLine.lineStyle(2, 0x00d2ff, 0.3);
        this.aimLine.beginPath();
        this.aimLine.moveTo(this.playerContainer.x, this.playerContainer.y);

        const endX = this.playerContainer.x + Math.cos(this.playerAngle) * 1000;
        const endY = this.playerContainer.y + Math.sin(this.playerAngle) * 1000;

        this.aimLine.lineTo(endX, endY);
        this.aimLine.strokePath();
    }

    fire() {
        if (!this.isPlaying || !this.isAiming) return;
        this.isAiming = false;
        this.aimLine.visible = false;

        if (this.ammo <= 0) return;

        const count = this.ammo;
        this.ammo = 0;
        window.uiManager.updateHUD(this.score, this.powerLevel, this.ammo);
        window.AudioUtils.playSound('shoot');

        // Burst fire
        let i = 0;
        const event = this.time.addEvent({
            delay: 60,
            callback: () => {
                this.createBullet();
                i++;
            },
            repeat: count - 1
        });
    }

    createBullet() {
        // Create the bullet visual
        const b = this.add.circle(this.playerContainer.x, this.playerContainer.y, 6 + (this.powerLevel * 2), this.getPowerColor());

        // Add to physics group (this automatically creates the physics body)
        this.bullets.add(b);

        // Ensure body property interactions work
        if (b.body) {
            b.body.setCircle(b.radius); // Match physics body to visual circle
            b.body.collideWorldBounds = false; // Or true if we want bounce, but we destroy on OOB

            // Set Velocity
            const speed = 1080;
            this.physics.velocityFromRotation(this.playerAngle, speed, b.body.velocity);

            // Store damage on the game object for collision logic
            b.dmg = this.powerLevel;
        }

        // Cleanup after 2 seconds
        this.time.delayedCall(2000, () => {
            if (b.active) b.destroy();
        });
    }

    getPowerColor() {
        if (this.powerLevel === 1) return 0xffffaa;
        if (this.powerLevel === 2) return 0xffcc00;
        if (this.powerLevel === 3) return 0xff4444;
        if (this.powerLevel === 4) return 0xd200ff;
        return 0x00ffff;
    }

    update(time, delta) {
        if (!this.isPlaying) return;

        // Run updates on groups
        this.enemies.children.each(e => {
            if (e.active) e.update();
        });

        // Manual Collision Check for Simplicity and Reliability with Containers
        this.bullets.children.each(b => {
            if (b.active) {
                this.enemies.children.each(e => {
                    if (e.active) {
                        // Simple circle/box check
                        // Enemy is 60x60 approx
                        const dist = Phaser.Math.Distance.Between(b.x, b.y, e.x, e.y);
                        if (dist < 40) { // 30 is radius of enemy, + bullet size
                            this.handleHit(b, e);
                        }
                    }
                });
            }
        });
    }

    handleHit(bullet, enemy) {
        if (!bullet.active || !enemy.active) return;

        enemy.hp -= bullet.dmg;
        this.updateEnemyHpBar(enemy);
        bullet.destroy();

        this.createParticles(bullet.x, bullet.y, this.getPowerColor());
        window.AudioUtils.playSound('hit');

        if (enemy.hp <= 0) {
            this.killMonster(enemy);
        }
    }

    createParticles(x, y, color) {
        // Simple Graphics Particles
        for (let i = 0; i < 5; i++) {
            const p = this.add.rectangle(x, y, 4, 4, color);
            const vx = Phaser.Math.Between(-100, 100);
            const vy = Phaser.Math.Between(-100, 100);
            this.tweens.add({
                targets: p,
                x: x + vx * 0.5,
                y: y + vy * 0.5,
                alpha: 0,
                duration: 300,
                onComplete: () => p.destroy()
            });
        }
    }

    killMonster(enemy) {
        const x = enemy.x;
        const y = enemy.y;
        enemy.destroy();

        this.score += 100 * this.powerLevel;
        this.monstersKilled++;

        window.AudioUtils.playSound('explode');
        this.cameras.main.shake(200, 0.01);

        this.showFloatingText("+" + (100 * this.powerLevel), x, y);

        // Power Up Logic
        if (this.monstersKilled % 5 === 0) {
            this.powerLevel++;
            window.AudioUtils.playSound('powerup');
            window.uiManager.showPowerUpEffect();
            this.showFloatingText("POWER UP!", this.playerContainer.x, this.playerContainer.y - 50, 0xffff00);

            // Redraw player
            this.createPlayerGraphics();
        }

        // Increase Speed
        if (this.globalEnemySpeed < 2.5) this.globalEnemySpeed += 0.02;

        window.uiManager.updateHUD(this.score, this.powerLevel, this.ammo);

        this.time.delayedCall(1000, () => this.spawnEnemy());
    }

    showFloatingText(text, x, y, color = 0xffffff) {
        const t = this.add.text(x, y, text, {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        t.setOrigin(0.5);
        t.setTint(color);

        this.tweens.add({
            targets: t,
            y: y - 50,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            onComplete: () => t.destroy()
        });
    }

    gameOver() {
        this.isPlaying = false;
        this.bullets.clear(true, true);
        window.uiManager.showGameOver(this.score);
    }

    resize(gameSize) {
        this.gameWidth = gameSize.width;
        this.gameHeight = gameSize.height;
        this.cameras.main.setViewport(0, 0, this.gameWidth, this.gameHeight);
        if (this.playerContainer) {
            this.playerContainer.setPosition(this.gameWidth / 2, this.gameHeight - 60);
        }
    }
}

window.GameScene = GameScene;
