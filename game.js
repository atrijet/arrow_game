document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let nickname = '';

    function createLoginScene() {
        gameContainer.className = 'login-scene';
        gameContainer.innerHTML = `
            <div class="scene-title">Login</div>
            <div class="game-content">
                <h1>Arrow Input Game</h1>
                <div class="arrow-container">
                    <img src="images/press_arrow.png" alt="Press Arrow" class="press-arrow-image">
                    <img src="images/arrow_left.png" alt="Left Arrow" class="arrow-image">
                    <img src="images/arrow_down.png" alt="Down Arrow" class="arrow-image">
                    <img src="images/arrow_right.png" alt="Right Arrow" class="arrow-image">
                </div>
                <input type="text" id="nickname" placeholder="Enter your nickname">
                <button id="start-button">Start</button>
            </div>
        `;

        document.getElementById('start-button').addEventListener('click', () => {
            nickname = document.getElementById('nickname').value.trim();
            if (nickname !== '') {
                createReadyScene();
            } else {
                alert('Please enter a nickname.');
            }
        });
    }

    function createReadyScene() {
        gameContainer.className = 'other-scene';
        gameContainer.innerHTML = `
            <div class="nickname">${nickname}</div>
            <div class="scene-title">Game Ready</div>
            <button class="logout">Log out</button>
            <div class="game-content">
                <h2>Get Ready</h2>
                <button id="game-start-button">Start Game</button>
            </div>
            <div class="ranking-container">
                <h3>Ranking</h3>
                <ul class="ranking-list">
                    <li>1. Player1 - 1000 pts</li>
                    <li>2. Player2 - 900 pts</li>
                    <li>3. Player3 - 800 pts</li>
                </ul>
            </div>
        `;

        document.querySelector('.ranking-container').style.display = 'flex';
        document.getElementById('game-start-button').addEventListener('click', createPlayScene);
        document.querySelector('.logout').addEventListener('click', createLoginScene);
    }

    function createPlayScene() {
        gameContainer.className = 'other-scene';
        gameContainer.innerHTML = `
            <div class="nickname">${nickname}</div>
            <div class="scene-title">Game Play</div>
            <button class="logout">Log out</button>
            <div class="game-content">
                <div id="countdown">3</div>
                <h2 id="game-status" style="display: none;">Game in progress</h2>
                <button id="end-game-button" style="display: none;">End Game</button>
            </div>
        `;

        document.querySelector('.logout').addEventListener('click', createLoginScene);

        let countdown = 3;
        const countdownElement = document.getElementById('countdown');
        const gameStatusElement = document.getElementById('game-status');
        const endGameButton = document.getElementById('end-game-button');

        const countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;

            if (countdown === 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = 'none';
                gameStatusElement.style.display = 'block';
                endGameButton.style.display = 'block';
                startGame();
            }
        }, 1000);

        function startGame() {
            // Add game start logic here
            endGameButton.addEventListener('click', createEndScene);
        }
    }

    function createEndScene() {
        gameContainer.className = 'other-scene';
        gameContainer.innerHTML = `
            <div class="nickname">${nickname}</div>
            <div class="scene-title">Game Over</div>
            <button class="logout">Log out</button>
            <div class="game-content">
                <h2>Game Over</h2>
                <button id="restart-button">Restart</button>
            </div>
            <div class="ranking-container">
                <h3>Ranking</h3>
                <ul class="ranking-list">
                    <li>1. Player1 - 1000 pts</li>
                    <li>2. Player2 - 900 pts</li>
                    <li>3. Player3 - 800 pts</li>
                </ul>
            </div>
        `;

        document.querySelector('.ranking-container').style.display = 'flex';
        document.getElementById('restart-button').addEventListener('click', createPlayScene);
        document.querySelector('.logout').addEventListener('click', createLoginScene);
    }

    // Initial scene setup
    createLoginScene();
});