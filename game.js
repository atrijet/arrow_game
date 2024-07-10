document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let nickname = '';

    function createLoginScene() {
        gameContainer.className = 'login-scene';
        gameContainer.innerHTML = `
            <div class="scene-title">로그인</div>
            <div class="game-content">
                <h1>Arrow Input Game</h1>
                <div class="arrow-container">
                    <img src="images/arrow_left.png" alt="Left Arrow" class="arrow-image">
                    <img src="images/arrow_down.png" alt="Down Arrow" class="arrow-image">
                    <img src="images/arrow_right.png" alt="Right Arrow" class="arrow-image">
                </div>
                <input type="text" id="nickname" placeholder="닉네임을 입력하세요">
                <button id="start-button">시작</button>
            </div>
        `;

        document.getElementById('start-button').addEventListener('click', () => {
            nickname = document.getElementById('nickname').value.trim();
            if (nickname !== '') {
                createReadyScene();
            } else {
                alert('닉네임을 입력해주세요.');
            }
        });
    }

    function createReadyScene() {
        gameContainer.className = 'other-scene';
        gameContainer.innerHTML = `
            <div class="nickname">${nickname}</div>
            <div class="scene-title">게임 준비</div>
            <button class="logout">Log out</button>
            <div class="game-content">
                <h2>게임 준비</h2>
                <button id="game-start-button">게임 시작</button>
            </div>
            <div class="ranking-container">
                <h3>랭킹</h3>
                <ul class="ranking-list">
                    <li>1. Player1 - 1000점</li>
                    <li>2. Player2 - 900점</li>
                    <li>3. Player3 - 800점</li>
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
            <div class="scene-title">게임 플레이</div>
            <button class="logout">Log out</button>
            <div class="game-content">
                <div id="countdown">3</div>
                <h2 id="game-status" style="display: none;">게임이 진행중입니다</h2>
                <button id="end-game-button" style="display: none;">게임 종료</button>
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
            // 여기에 게임 시작 로직을 추가하세요
            endGameButton.addEventListener('click', createEndScene);
        }
    }

    function createEndScene() {
        gameContainer.className = 'other-scene';
        gameContainer.innerHTML = `
            <div class="nickname">${nickname}</div>
            <div class="scene-title">게임 종료</div>
            <button class="logout">Log out</button>
            <div class="game-content">
                <h2>게임이 종료되었습니다</h2>
                <button id="restart-button">재시작</button>
            </div>
            <div class="ranking-container">
                <h3>랭킹</h3>
                <ul class="ranking-list">
                    <li>1. Player1 - 1000점</li>
                    <li>2. Player2 - 900점</li>
                    <li>3. Player3 - 800점</li>
                </ul>
            </div>
        `;

        document.querySelector('.ranking-container').style.display = 'flex';
        document.getElementById('restart-button').addEventListener('click', createPlayScene);
        document.querySelector('.logout').addEventListener('click', createLoginScene);
    }

    // 초기 씬 설정
    createLoginScene();
});