const gameConfig = {
    initialTimeLeft: 10, // Initial time limit
    timeDecrement: 0.3, // Time decrease on wrong input
    initialTimeIncrement: 1, // Initial time increment on correct inputs
    timeIncrementDecrement: 0.1, // Decrease in time increment per incorrect input
    timeIncrementReductionOnAdd: 0.02, // Decrease in time increment per correct series addition
    requiredCorrectCount: 5, // Number of correct inputs required for time increment
    correctSoundUrl: "https://www.soundjay.com/buttons/beep-08b.mp3", // Correct sound URL
    wrongSoundUrl: "https://www.soundjay.com/buttons/beep-03.mp3", // Wrong sound URL
    bgColorOver5Sec: 'white', // Background color for time > 5s
    bgColor5To3Sec: 'rgb(255, 234, 234)', // Background color for 5s > time >= 3s
    bgColor3To1Sec: 'rgb(252, 179, 179)', // Background color for 3s > time >= 1s
    bgColorUnder1Sec: 'rgb(252, 130, 130)', // Background color for time < 1s
    bgColorGameOver: 'rgb(20, 0, 0)', // Background color for game over
    arrowSequenceLength: 5,  // 새로 추가된 변수
    timeIncrementMultiplierUnder1Sec: 2, // 1초 미만일 때 적용할 승수

    // 이전에 정의한 설정들도 유지합니다
    countdownTime: 3,
    sequenceLength: 7,
    arrowTypes: ['arrow_left.png', 'arrow_down.png', 'arrow_right.png'],
    pressArrowImage: 'press_arrow.png',
    correctText: 'Correct',
    wrongText: 'Wrong',
    correctColor: 'green',
    wrongColor: 'red'
};