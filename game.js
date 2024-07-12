import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const database = getDatabase();

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    let nickname = '';
    let score = 0;
    let timeLeft = 0;
    let timeIncrement = 0;
    let correctCount = 0;
    let lastCorrectTime = 0;
    let isGameActive = false;

    function resetAllVariables() {
        nickname = '';
        resetGameVariables();
    }

    function resetGameVariables() {
        score = 0;
        timeLeft = gameConfig.initialTimeLeft;
        timeIncrement = gameConfig.initialTimeIncrement;
        correctCount = 0;
        lastCorrectTime = 0;
        isGameActive = false;
    }

    function saveRanking(nickname, score) {
        const rankingRef = ref(database, 'rankings');
        push(rankingRef, {
            nickname: nickname,
            score: score
        }).then(() => {
            console.log('Ranking saved successfully');
        }).catch((error) => {
            console.error('Error saving ranking:', error);
        });
    }

    function getRankings(callback) {
        const rankingRef = ref(database, 'rankings');
        const rankingQuery = query(rankingRef, orderByChild('score'), limitToLast(5));
        onValue(rankingQuery, (snapshot) => {
            const rankings = [];
            snapshot.forEach((childSnapshot) => {
                rankings.push(childSnapshot.val());
            });
            rankings.reverse(); // 높은 점수가 먼저 오도록 역순 정렬
            callback(rankings);
        }, (error) => {
            console.error('Error getting rankings:', error);
            callback([]);
        });
    }

    function updateRankingDisplay() {
        console.log("Updating ranking display");
        getRankings((rankings) => {
            console.log("Rankings received:", rankings);
            const rankingList = document.querySelector('.ranking-list');
            if (rankingList) {
                if (rankings.length > 0) {
                    rankingList.innerHTML = rankings.map((rank, index) => {
                        const isCurrentPlayer = (rank.nickname === nickname && rank.score === score);
                        const highlightClass = isCurrentPlayer ? 'highlight' : '';
                        return `<li class="ranking-item ${highlightClass}">${index + 1}. ${rank.nickname} - ${rank.score} pts</li>`;
                    }).join('');
                } else {
                    rankingList.innerHTML = "<li class='ranking-item'>No rankings available yet</li>";
                }
            } else {
                console.error("Ranking list element not found");
            }
        });
    }


    function createLoginScene() {
        console.log("Creating login scene");
        gameContainer.className = 'login-scene';
        gameContainer.innerHTML = `
            <div class="scene-title">Login</div>
            <div class="game-content">
                <h1 class="game-title">Arrow Input Game</h1>
                <div class="arrow-container">
                    <img src="images/press_arrow.png" alt="Press Arrow" class="press-arrow-image">
                    <img src="images/arrow_left.png" alt="Left Arrow" class="arrow-image">
                    <img src="images/arrow_down.png" alt="Down Arrow" class="arrow-image">
                    <img src="images/arrow_right.png" alt="Right Arrow" class="arrow-image">
                </div>
                <input type="text" id="nickname" placeholder="Enter your nickname">
                <button id="start-button">Start</button>
            </div>
            <div class="ranking-container">
                <h3 class="ranking-title">Top 5 Rankings</h3>
                <ul class="ranking-list"></ul>
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
    
        // 랭킹 표시 업데이트
        document.querySelector('.ranking-container').style.display = 'flex';
        updateRankingDisplay();
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
                <ul class="ranking-list"></ul>
            </div>
        `;

        document.querySelector('.ranking-container').style.display = 'flex';
        updateRankingDisplay();
        document.getElementById('game-start-button').addEventListener('click', createPlayScene);
        document.querySelector('.logout').addEventListener('click', () => {
            resetAllVariables();
            createLoginScene();
        });
    }

    function createPlayScene() {
        resetGameVariables();
        window.addEventListener('resize', updateArrowSequence);
        gameContainer.className = 'other-scene';
        gameContainer.innerHTML = `
            <div class="nickname">${nickname}</div>
            <div class="scene-title">Game Play</div>
            <button class="logout" style="display: none;">Log out</button>
            <div class="game-content">
                <div id="countdown">3</div>
                <div id="result-text" style="display: none;"></div>
                <div id="arrow-sequence" style="display: none;"></div>
                <div id="time-bar-container" style="display: none;">
                    <div id="time-bar"></div>
                    <div id="time-left"></div>
                </div>
            </div>
            <div class="arrow-buttons">
                <button class="arrow-button" id="left-arrow"><img src="images/arrow_left.png" alt="Left"></button>
                <button class="arrow-button" id="down-arrow"><img src="images/arrow_down.png" alt="Down"></button>
                <button class="arrow-button" id="right-arrow"><img src="images/arrow_right.png" alt="Right"></button>
            </div>
            <div id="overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; pointer-events: none;"></div>
        `;

        document.querySelector('.logout').addEventListener('click', () => {
            resetAllVariables();
            createLoginScene();
        });

        let countdown = 3;
        const countdownElement = document.getElementById('countdown');
        const arrowSequenceElement = document.getElementById('arrow-sequence');
        const resultTextElement = document.getElementById('result-text');
        const timeBarElement = document.getElementById('time-bar');
        const timeLeftElement = document.getElementById('time-left');
        const timeBarContainerElement = document.getElementById('time-bar-container');

        const countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;

            if (countdown === 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = 'none';
                arrowSequenceElement.style.display = 'flex';
                resultTextElement.style.display = 'block';
                startGame();
            }
        }, 1000);

        let timerInterval;

        function startGame() {
            generateArrowSequence();
            updateArrowSequence
            timeBarContainerElement.style.display = 'block';
            
            isGameActive = true;
            
            document.addEventListener('keydown', handleKeyDown);
            document.getElementById('left-arrow').addEventListener('click', () => {
                if (isGameActive) handleArrowInput('arrow_left.png');
            });
            document.getElementById('down-arrow').addEventListener('click', () => {
                if (isGameActive) handleArrowInput('arrow_down.png');
            });
            document.getElementById('right-arrow').addEventListener('click', () => {
                if (isGameActive) handleArrowInput('arrow_right.png');
            });

            timerInterval = setInterval(() => {
                timeLeft -= 0.01;
                updateTimeBar();
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    endGame();
                }
            }, 10);

            window.addEventListener('resize', updateArrowSequence);
        }

        function handleKeyDown(event) {
            if (isGameActive) {
                if (event.key === 'ArrowLeft') handleArrowInput('arrow_left.png');
                if (event.key === 'ArrowDown') handleArrowInput('arrow_down.png');
                if (event.key === 'ArrowRight') handleArrowInput('arrow_right.png');
            }
        }

        function updateTimeBar() {
            const percentage = (timeLeft / gameConfig.initialTimeLeft) * 100;
            timeBarElement.style.width = `${percentage}%`;
            timeLeftElement.textContent = timeLeft.toFixed(2);

            if (timeLeft > 6) {
                gameContainer.style.backgroundColor = 'white';
            } else if (timeLeft > 4) {
                gameContainer.style.backgroundColor = gameConfig.bgColor5To3Sec;
            } else if (timeLeft > 1) {
                gameContainer.style.backgroundColor = gameConfig.bgColor3To1Sec;
            } else {
                gameContainer.style.backgroundColor = gameConfig.bgColorUnder1Sec;
            }
        }

        let arrowSequence = [];

        function generateArrowSequence() {
            const arrows = ['arrow_left.png', 'arrow_down.png', 'arrow_right.png'];
            arrowSequence = [];
            
            for (let i = 0; i < gameConfig.arrowSequenceLength; i++) {
                const randomArrow = arrows[Math.floor(Math.random() * arrows.length)];
                arrowSequence.push(randomArrow);
            }
            
            updateArrowSequence();
        }
        
        function updateArrowSequence() {
            const containerWidth = gameContainer.offsetWidth;
            const imageCount = gameConfig.arrowSequenceLength + 1; // +1 for the 'press arrow' image
            const imageWidth = Math.floor(containerWidth / imageCount) - 10; // 10px for margin
        
            let sequence = `<img src="images/press_arrow.png" alt="Press Arrow" class="sequence-image" style="width:${imageWidth}px;height:${imageWidth}px;margin:0 5px;">`;
            arrowSequence.forEach(arrow => {
                sequence += `<img src="images/${arrow}" alt="Arrow" class="sequence-image" style="width:${imageWidth}px;height:${imageWidth}px;margin:0 5px;">`;
            });
            
            arrowSequenceElement.innerHTML = sequence;
        }

        function handleArrowInput(input) {
            if (isGameActive && arrowSequence.length > 0) {
                if (input === arrowSequence[0]) {
                    resultTextElement.textContent = "Correct";
                    resultTextElement.style.color = "green";
                    arrowSequence.shift();
                    const newArrow = ['arrow_left.png', 'arrow_down.png', 'arrow_right.png'][Math.floor(Math.random() * 3)];
                    arrowSequence.push(newArrow);
                    updateArrowSequence();
                    score++;
                    correctCount++;
        
                    const currentTime = Date.now() / 1000;
                    if (currentTime - lastCorrectTime <= 1 && correctCount >= gameConfig.requiredCorrectCount) {
                        timeLeft += timeIncrement;
                        if (timeLeft < 1.5) {
                            timeIncrement += gameConfig.timeIncrementReductionOnAdd * gameConfig.timeIncrementMultiplierUnder1Sec;
                        } else {
                            timeIncrement = Math.max(0, timeIncrement - gameConfig.timeIncrementReductionOnAdd);
                        }
                        correctCount = 0;
                    }
                    lastCorrectTime = currentTime;
                } else {
                    resultTextElement.textContent = "Wrong";
                    resultTextElement.style.color = "red";
                    timeLeft = Math.max(0, timeLeft - gameConfig.timeDecrement);
                    timeIncrement = Math.max(0, timeIncrement - gameConfig.timeIncrementDecrement);
                    correctCount = 0;

                    const overlay = document.getElementById('overlay');
                    overlay.style.transition = 'none';
                    overlay.style.backgroundColor = gameConfig.bgColorUnder1Sec;
                    overlay.style.opacity = '1';
                    
                    overlay.offsetHeight;

                    overlay.style.transition = 'opacity 0.3s';
                    setTimeout(() => {
                        overlay.style.opacity = '0';
                    }, 10);
                }
                updateTimeBar();
            }
        }

        function endGame() {
            clearInterval(timerInterval);
            isGameActive = false;
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', updateArrowSequence);
            gameContainer.style.backgroundColor = 'white';
            document.querySelector('.logout').style.display = 'block';
            saveRanking(nickname, score);
            createEndScene();
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
                <p>Your score: ${score}</p>
                <button id="restart-button">Restart</button>
            </div>
            <div class="ranking-container">
                <h3>Ranking</h3>
                <ul class="ranking-list"></ul>
            </div>
        `;

        document.querySelector('.ranking-container').style.display = 'flex';

        updateRankingDisplay();
        document.getElementById('restart-button').addEventListener('click', () => {
            resetGameVariables();
            createPlayScene();
        });
        document.querySelector('.logout').addEventListener('click', () => {
            resetAllVariables();
            createLoginScene();
        });
    }

    createLoginScene();
});