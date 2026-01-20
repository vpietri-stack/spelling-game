const uiManager = {
    currentSelection: {
        book: "PU1",
        unit: "Unit 1",
        session: "Session 1"
    },

    init: function () {
        // Initialize dropdowns
        this.populateBookDropdown();
        this.populateUnitDropdown();
        this.populateSessionDropdown();

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-wrapper')) {
                this.closeAllDropdowns();
            }
        });

        // Replay button logic
        document.getElementById('replay-btn').addEventListener('mousedown', (e) => e.stopPropagation());
        document.getElementById('replay-btn').addEventListener('touchstart', (e) => e.stopPropagation());
        document.getElementById('replay-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            // Access the current word from logic - we'll get it from the game state if running
            // or potentially store it locally.
            // Ideally GameScene should expose a "replayWord" method.
            const scene = this.getGameScene();
            if (scene) scene.speakCurrentWord();
        });
    },

    getGameScene: function () {
        if (window.game && window.game.scene && window.game.scene.getScene('GameScene')) {
            return window.game.scene.getScene('GameScene');
        }
        return null;
    },

    // --- DROPDOWN LOGIC ---
    toggleDropdown: function (type) {
        const menuId = type + '-menu';
        const btnId = type + '-dropdown';
        const menu = document.getElementById(menuId);
        const btn = document.getElementById(btnId);

        // Close all other dropdowns
        ['book', 'unit', 'session'].forEach(t => {
            if (t !== type) {
                document.getElementById(t + '-menu').classList.remove('show');
                document.getElementById(t + '-dropdown').classList.remove('open');
            }
        });

        // Toggle current dropdown
        menu.classList.toggle('show');
        btn.classList.toggle('open');
    },

    closeAllDropdowns: function () {
        ['book', 'unit', 'session'].forEach(t => {
            document.getElementById(t + '-menu').classList.remove('show');
            document.getElementById(t + '-dropdown').classList.remove('open');
        });
    },

    selectDropdownItem: function (type, value) {
        this.currentSelection[type] = value;
        document.getElementById(type + '-label').innerText = value;
        this.closeAllDropdowns();

        // Update dependent dropdowns
        if (type === 'book') {
            const units = Object.keys(window.vocabData[value]);
            this.currentSelection.unit = units[0] || "Unit 1";
            document.getElementById('unit-label').innerText = this.currentSelection.unit;

            const sessions = Object.keys(window.vocabData[value][this.currentSelection.unit]);
            this.currentSelection.session = sessions[0] || "Session 1";
            document.getElementById('session-label').innerText = this.currentSelection.session;

            this.populateUnitDropdown();
            this.populateSessionDropdown();
        } else if (type === 'unit') {
            if (value === "全部单词") {
                this.currentSelection.session = "All";
                document.getElementById('session-label').innerText = "All";
                document.getElementById('session-menu').innerHTML = "";
            } else {
                const sessions = Object.keys(window.vocabData[this.currentSelection.book][value]);
                this.currentSelection.session = sessions[0] || "Session 1";
                document.getElementById('session-label').innerText = this.currentSelection.session;
                this.populateSessionDropdown();
            }
        }
    },

    populateBookDropdown: function () {
        const menu = document.getElementById('book-menu');
        menu.innerHTML = '';
        Object.keys(window.vocabData).forEach(book => {
            const item = document.createElement('div');
            item.className = 'dropdown-item' + (book === this.currentSelection.book ? ' selected' : '');
            item.innerText = book;
            item.onclick = (e) => {
                e.stopPropagation();
                this.selectDropdownItem('book', book);
            };
            menu.appendChild(item);
        });
    },

    populateUnitDropdown: function () {
        const menu = document.getElementById('unit-menu');
        menu.innerHTML = '';
        const units = window.vocabData[this.currentSelection.book];

        const allItem = document.createElement('div');
        allItem.className = 'dropdown-item' + ('全部单词' === this.currentSelection.unit ? ' selected' : '');
        allItem.innerText = "全部单词";
        allItem.onclick = (e) => {
            e.stopPropagation();
            this.selectDropdownItem('unit', "全部单词");
        };
        menu.appendChild(allItem);

        Object.keys(units).forEach(unit => {
            const item = document.createElement('div');
            item.className = 'dropdown-item' + (unit === this.currentSelection.unit ? ' selected' : '');
            item.innerText = unit;
            item.onclick = (e) => {
                e.stopPropagation();
                this.selectDropdownItem('unit', unit);
            };
            menu.appendChild(item);
        });
    },

    populateSessionDropdown: function () {
        const menu = document.getElementById('session-menu');
        menu.innerHTML = '';
        if (this.currentSelection.unit === "全部单词") return;

        const sessions = window.vocabData[this.currentSelection.book][this.currentSelection.unit];
        Object.keys(sessions).forEach(sess => {
            const item = document.createElement('div');
            item.className = 'dropdown-item' + (sess === this.currentSelection.session ? ' selected' : '');
            item.innerText = sess;
            item.onclick = (e) => {
                e.stopPropagation();
                this.selectDropdownItem('session', sess);
            };
            menu.appendChild(item);
        });
    },

    // --- GAME CONTROL ---
    startFromDropdowns: function () {
        let finalWordList = [];
        if (this.currentSelection.unit === "全部单词") {
            const bookData = window.vocabData[this.currentSelection.book];
            let allWords = [];
            Object.values(bookData).forEach(unitData => {
                Object.values(unitData).forEach(sessionWords => {
                    allWords = allWords.concat(sessionWords);
                });
            });
            finalWordList = [...new Set(allWords)];
        } else {
            finalWordList = window.vocabData[this.currentSelection.book][this.currentSelection.unit][this.currentSelection.session];
        }

        if (!finalWordList || finalWordList.length === 0) finalWordList = ["apple", "banana", "error"];

        // Hide Menu
        document.getElementById('menu-screen').style.display = 'none';

        // Update Lesson Info Title
        document.getElementById('selected-lesson-info').innerText = `${this.currentSelection.book} > ${this.currentSelection.unit} > ${this.currentSelection.session}`;

        // Show Start Screen
        document.getElementById('start-screen').style.display = 'flex';

        // Store temp list for game start
        this.pendingWordList = finalWordList;
    },

    initAudioAndStart: function () {
        window.AudioUtils.init();

        // Hide Start Screen
        document.getElementById('start-screen').style.display = 'none';

        // Start Phaser Scene
        const scene = this.getGameScene();
        if (scene) {
            scene.startGame(this.pendingWordList);
        } else {
            console.error("Game Scene not ready!");
        }
    },

    resetGame: function () {
        document.getElementById('game-over-screen').style.display = 'none';
        const scene = this.getGameScene();
        if (scene) {
            scene.startGame(this.pendingWordList);
        }
    },

    // --- UI UPDATES FROM GAME ---
    updateWordDisplay: function (currentWord, startIndex, typedIndex) {
        let html = "";
        for (let i = 0; i < currentWord.length; i++) {
            let char = currentWord[i];
            if (char === ' ') {
                html += `&nbsp;&nbsp;`;
            } else if (i < startIndex) {
                html += `<span style="color:#888; text-shadow:none">${char}</span>`;
            } else if (i < typedIndex) {
                html += `<span style="color:#00e676; text-shadow: 0 0 10px #00e676;">${char}</span>`;
            } else {
                html += `<span style="color:#555">_</span>`;
            }
        }
        document.getElementById('word-display').innerHTML = html;

        // Pop effect
        const el = document.getElementById('word-display');
        el.style.transform = "scale(1.2)";
        setTimeout(() => el.style.transform = "scale(1)", 150);
    },

    generateKeyboard: function (word, onKeyPress) {
        const container = document.getElementById('keyboard-container');
        container.innerHTML = '';
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const wordUpper = word.toUpperCase();
        let lettersSet = new Set(wordUpper.split('').filter(c => c.match(/[A-Z]/)));
        let lettersArr = Array.from(lettersSet);

        while (lettersArr.length < 10) {
            const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (!lettersArr.includes(randomChar)) lettersArr.push(randomChar);
        }
        lettersArr.sort();

        lettersArr.forEach(char => {
            const btn = document.createElement('button');
            btn.className = 'key-btn';
            btn.innerText = char;

            const hitKey = (e) => {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                onKeyPress(char); // Callback to game logic

                // Visual feedback
                btn.classList.add('active');
                setTimeout(() => btn.classList.remove('active'), 100);
            };
            btn.addEventListener('touchstart', hitKey, { passive: false });
            btn.addEventListener('mousedown', hitKey);
            container.appendChild(btn);
        });
    },

    updateHUD: function (score, powerLevel, ammo) {
        document.getElementById('score').innerText = score;
        document.getElementById('power-level').innerText = powerLevel;
        document.getElementById('ammo').innerText = ammo;

        const plEl = document.getElementById('power-level');
        // Simple scale effect if needed, usually handled by game logic trigger, but we can do reactive here?
        // Let's stick to simple updates.
    },

    showPowerUpEffect: function () {
        const powerLevelEl = document.getElementById('power-level');
        powerLevelEl.style.transform = "scale(1.5)";
        setTimeout(() => powerLevelEl.style.transform = "scale(1)", 300);
    },

    showGameOver: function (score) {
        document.getElementById('final-score').innerText = score;
        document.getElementById('game-over-lesson-info').innerText = document.getElementById('selected-lesson-info').innerText;
        document.getElementById('game-over-screen').style.display = 'flex';
    },

    showFloatingText: function (text, x, y) {
        // Since Phaser is handling the game world, we should probably do this in Phaser?
        // But the original had it in DOM. DOM overlays are fine for text.
        // We need to convert World Coordinates to Screen Coordinates?
        // OR better: Just do it in Phaser Text objects. It's much smoother.
        // I will omit this from UIManager and do it in GameScene with Phaser Text.
    }
};

window.uiManager = uiManager;

// Init immediately
window.addEventListener('load', () => uiManager.init());
