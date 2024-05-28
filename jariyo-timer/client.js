const URL = "./my_model/"; //수정 필요
let webcame = [];
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    //각 의자에 대한 웹캠 인스턴스 생성
    for (let i = 1; i <= 4; i++) {
        webcam = new tmImage.Webcam(200, 200, true);
        await webcam.setup();
        await webcam.play();
        webcams.push(webcam);
        document.getElementById(`webcam-container${i}`).appendChild(webcam.canvas);
    }

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    window.requestAnimationFrame(loop);
}


async function loop() {
    for (let webcamIndex = 0; webcamIndex < webcams.length; webcamIndex++) {
        webcams[webcamIndex].update(); // 각 웹캠 업데이트
        await predict(webcams[webcamIndex], webcamIndex + 1); // 각 웹캠과 의자 ID를 넘겨 예측 실행
    }
    window.requestAnimationFrame(loop);
}

async function predict(webcam, chairId) {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;

        //'있음' 상태: 붉은색 배경, 하얀색 글씨, 타이머x
        const chair = document.getElementById(`chair${chairId}`);
        const timer = document.getElementById(`timer${chairId}`);

        if (prediction[i].className === '있음' && prediction[i].probability > 0.5) {
            if (chair.classList.contains('gray')) {
                clearInterval(chair.timerInterval); //타이머 중지
                timer.textContent = '';
            }
            chair.classList.add('red');
            chair.classListclassList.remove('gray', 'transparent');
        }
        else if (prediction[i].className === '없음' && prediction[i].probability > 0.5) {
            //'있음'->'없음' (자리비움) 상태: 회색 배경, 검정색 글씨, 타이머o
            if (chair.classList.contains('red')) {
                chair.classList.add('gray');
                chair.classList.remove('red', 'transparent');
                startTimer(chair, timer);
            }
        //'없음' 상태: 투명 배경, 검정색 글씨, 타이머o/x
            else {
                chair.classList.add('transparent');
                chair.classList.remove('red', 'gray');
                clearInterval(chair.timerInterval);
                timer.textContent = '';
            }
        }
    }
}


function startTimer(chair, timer) {
    let timeLeft = 600; //10분
    timer.textContent = '10:00';
    chair.timerInterval = setInterval(() => {
        timeLeft -= 1; //1초씩 감소
        let minutes = Math.floor(timeLeft / 60); //분 계산
        let seconds = timeLeft % 60; //초 계산
        timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        //타이머가 끝나면 (0초가 되면)
        if (timeLeft <= 0) {
            clearInterval(chair.timerInterval); //타이머 종료
            //'없음' 상태로 변경
            chair.classList.remove('gray');
            chair.style.backgroundColor = 'transparent';
            chair.style.color = 'black';
            timer.textContent = '';
        }
    }, 1000);
}