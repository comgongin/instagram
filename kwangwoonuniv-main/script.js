//건물 카드 데이터
const data = [
    {
        place:'광운대학교',
        title:'참',
        title2:'빛',
        description:'융합의 중심, Collaboration',
        image:'./img/kwu.jpg'
    },
    {
        place:'',
        title:'새빛관',
        title2:'',
        description:'주로 인공지능융합대학 학생들이 사용하는 건물',
        image:'./img/saebit.png'
    },
    {
        place:'',
        title:'비마관',
        title2:'',
        description:'주로 공과대학 및 전자정보공과대학 학생들이 사용하는 건물',
        image:'./img/bima.png'
    },
    {
        place:'',
        title:'옥의관',
        title2:'',
        description:'주로 자연과학대학 학생들이 사용하는 건물',
        image:'./img/okui.png'
    },
    {
        place:'',
        title:'참빛관',
        title2:'',
        description:'주로 공과대학 및 전자정보공과대학 학생들이 사용하는 건물',
        image:'./img/chambit.png'
    },
    {
      place:'',
      title:'한울관',
      title2:'',
      description:'주로 문과대학 학생들이 사용하는 건물',
      image:'./img/hanul.png'
  },
]

//헬퍼 함수 정의
const _ = (id)=>document.getElementById(id) 

//카드 요소 생성
const cards = data.map((i, index)=>`<div class="card" id="card${index}" style="background-image:url(${i.image})"  ></div>`).join('')


//카드 콘텐츠 생성
const cardContents = data.map((i, index)=>`<div class="card-content" id="card-content-${index}">
<div class="content-start"></div>
<div class="content-place">${i.place}</div>
<div class="content-title-1">${i.title}</div>
<div class="content-title-2">${i.title2}</div>

</div>`).join('')

//슬라이드 번호 생성
const sildeNumbers = data.map((_, index)=>`<div class="item" id="slide-item-${index}" >${index+1}</div>`).join('')

//동적 컨텐츠 추가
_('demo').innerHTML =  cards + cardContents
_('slide-numbers').innerHTML =  sildeNumbers

//범위 생성 함수
const range = (n) =>
  Array(n)
    .fill(0)
    .map((i, j) => i + j);

//GSAP 설정 함수
const set = gsap.set;

//요소 가져오는 함수 정의
function getCard(index) {
  return `#card${index}`;
}
function getCardContent(index) {
  return `#card-content-${index}`;
}
function getSliderItem(index) {
  return `#slide-item-${index}`;
}

//애니메이션 함수 정의
function animate(target, duration, properties) {
  return new Promise((resolve) => {
    gsap.to(target, {
      ...properties,
      duration: duration,
      onComplete: resolve,
    });
  });
}

//초기 변수 설정
let order = data.map((_, index) => index);
let detailsEven = true;

let offsetTop = 200;
let offsetLeft = 700;
let cardWidth = 200;
let cardHeight = 300;
let gap = 40;
let numberSize = 50;
const ease = "sine.inOut";

//초기화 함수
function init() {
  const [active, ...rest] = order;
  const detailsActive = detailsEven ? "#details-even" : "#details-odd";
  const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
  const { innerHeight: height, innerWidth: width } = window;
  offsetTop = height - 430;
  offsetLeft = width - 830;

  gsap.set("#pagination", {
    top: offsetTop + 330,
    left: offsetLeft,
    y: 200,
    opacity: 0,
    zIndex: 60,
  });
  gsap.set("nav", { y: -200, opacity: 0 });

  gsap.set(getCard(active), {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
  gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
  gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
  gsap.set(`${detailsInactive} .text`, { y: 100 });
  gsap.set(`${detailsInactive} .title-1`, { y: 100 });
  gsap.set(`${detailsInactive} .title-2`, { y: 100 });
  gsap.set(`${detailsInactive} .desc`, { y: 50 });
  gsap.set(`${detailsInactive} .cta`, { y: 60 });

  gsap.set(".progress-sub-foreground", {
    width: 500 * (1 / order.length) * (active + 1),
  });

  rest.forEach((i, index) => {
    gsap.set(getCard(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      y: offsetTop,
      width: cardWidth,
      height: cardHeight,
      zIndex: 30,
      borderRadius: 10,
    });
    gsap.set(getCardContent(i), {
      x: offsetLeft + 400 + index * (cardWidth + gap),
      zIndex: 40,
      y: offsetTop + cardHeight - 100,
    });
    gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
  });

  gsap.set(".indicator", { x: -window.innerWidth });

  const startDelay = 0.6;

  gsap.to(".cover", {
    x: width + 400,
    delay: 0.5,
    ease,
    onComplete: () => {
      setTimeout(() => {
        loop();
      }, 500);
    },
  });
  rest.forEach((i, index) => {
    gsap.to(getCard(i), {
      x: offsetLeft + index * (cardWidth + gap),
      zIndex: 30,
      delay: 0.25 * index,
      ease,
      delay: startDelay,
    });
    gsap.to(getCardContent(i), {
      x: offsetLeft + index * (cardWidth + gap),
      zIndex: 40,
      delay: 0.05 * index,
      ease,
      delay: startDelay,
    });
  });
  gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to("nav", { y: 0, opacity: 1, ease, delay: startDelay });
  gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
}

let clicks = 0;

//한 스텝 진행 함수
function step() {
  return new Promise((resolve) => {
    order.push(order.shift());
    detailsEven = !detailsEven;

    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

    //디테일 정보 업데이트
    document.querySelector(`${detailsActive} .place-box .text`).textContent =
      data[order[0]].place;
    document.querySelector(`${detailsActive} .title-1`).textContent =
      data[order[0]].title;
    document.querySelector(`${detailsActive} .title-2`).textContent =
      data[order[0]].title2;
    document.querySelector(`${detailsActive} .desc`).textContent =
      data[order[0]].description;


    const rest = order.slice(1);
    rest.forEach((i, index) => {
      if (i !== prv) {
        const xNew = offsetLeft + index * (cardWidth + gap);
        gsap.set(getCard(i), { zIndex: 30 });
        gsap.to(getCard(i), {
          x: xNew,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          ease,
          delay: 0.1 * (index + 1),
        });

        gsap.to(getCardContent(i), {
          x: xNew,
          y: offsetTop + cardHeight - 100,
          opacity: 1,
          zIndex: 40,
          ease,
          delay: 0.1 * (index + 1),
        });
        gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
      }
    });
    resolve();
  });
}

//루프 함수
async function loop() {
  await animate(".indicator", 2, { x: 0 });
  await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
  set(".indicator", { x: -window.innerWidth });
  await step();
  loop();
}

//이미지 로드 함수
async function loadImage(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

//모든 이미지 로드 함수
async function loadImages() {
  const promises = data.map(({ image }) => loadImage(image));
  return Promise.all(promises);
}

//진행 표시기 업데이트 함수 (노란색 바)
function updateProgressIndicator() {
  const progress = document.querySelector('.progress-sub-foreground');
  const totalWidth = document.querySelector('.progress-sub-background').clientWidth;
  const progressWidth = (order.indexOf(fixedCardIndex) / (order.length - 1)) * totalWidth;
  gsap.to(progress, {
    width: progressWidth,
    ease: "power1.out",
    duration: 0.75
  });
}

//이전 스텝
function stepBackward() {
  if (order.length > 1) {
    const last = order.pop();
    order.unshift(last);
    updateCards();
    updateProgressIndicator(); //진행바 업데이트 추가
  }
}

//다음 스텝
function stepForward() {
  if (order.length > 1) {
    const first = order.shift();
    order.push(first);
    updateCards();
    updateProgressIndicator(); //진행바 업데이트 유지
  }
}


// 슬라이드 업데이트 함수
const fixedCardIndex = data.findIndex(item => item.place === '광운대학교'); //카드 고정 (배경)

function updateCards() {
  const cardWidthWithGap = cardWidth + gap;
  let nonFixedCards = [];

  order.forEach((item, index) => {
    const card = document.getElementById(`card${item}`);
    const cardContent = document.getElementById(`card-content-${item}`);

    if (item === fixedCardIndex) {
      //고정 카드의 스타일과 위치를 변경하지 않음
      gsap.set(card, {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        zIndex: -1
      });
      gsap.set(cardContent, {
        opacity: 0
      });
    } else {
      nonFixedCards.push({ card, cardContent, index });
    }
  });

  nonFixedCards.forEach(({ card, cardContent, index }) => {
    let positionX = offsetLeft + index * cardWidthWithGap;
    gsap.to(card, {
      x: positionX,
      ease: "power1.out",
      duration: 0.75
    });

    gsap.to(cardContent, {
      x: positionX,
      ease: "power1.out",
      duration: 0.75
    });
  });
}


function updateProgressIndicator() {
  const progress = document.querySelector('.progress-sub-foreground');
  const totalWidth = document.querySelector('.progress-sub-background').clientWidth;
  const progressWidth = (order.indexOf(fixedCardIndex) / (order.length - 1)) * totalWidth;

  gsap.to(progress, {
    width: progressWidth,
    ease: "power1.out",
    duration: 0.75
  });
}

//로그인 상태 확인 및 UI 업데이트
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; //로그인 상태

document.addEventListener('DOMContentLoaded', function() {
  const mypageTitle = _('mypage-title');
  const mypageContent = _('mypage-content');

  //로그인 상태에 따른 UI 업데이트
  function updateUI() {
    if (isLoggedIn) {
      mypageTitle.innerHTML = 'ㅇㅇㅇ님';  //실제 사용자명으로 변경 필요
      mypageContent.innerHTML = `
          <p><a href="/edit-profile">내 정보 수정</a></p>
          <p><a href="/add-friend">친구 추가</a></p>
          <p><a href="#" id="logout">로그아웃</a></p>
          <hr>
          <p>친구1</p>  <!-- 실제 친구 이름으로 변경 필요-->
          <p>친구2</p>
          <p>친구3</p>
      `;
    } else {
      mypageTitle.innerHTML = '<a href="login.html" id="login-link">로그인 후 이용 가능합니다</a>';
      mypageContent.innerHTML = '';
    }
  }

  //초기 UI 업데이트
  updateUI();

  //로그아웃 버튼 클릭 이벤트
  mypageContent.addEventListener('click', async function(event) {
    if (event.target.id === 'logout') {
      await logoutUser();
      isLoggedIn = false;
      localStorage.setItem('isLoggedIn', 'false'); // 로컬 스토리지에 로그아웃 상태 저장
      updateUI();
    }
  });

  // 로그인 링크 클릭 이벤트
  mypageTitle.addEventListener('click', function(event) {
    if (event.target.id === 'login-link') {
      window.location.href = 'login.html'; // 로그인 페이지 URL로 변경 필요
    }
  });

    // 카드 클릭 이벤트 추가
    data.forEach((item, index) => {
      const cardElement = document.getElementById(`card${index}`);
      if (item.place !== '광운대학교') {
        cardElement.addEventListener('click', () => {
          window.location.href = `https://www.kw.ac.kr/ko/tour/${item.title}.jsp`; //URL 수정 필요
        });
      }
    });
  
  //사용자 아이콘 클릭 이벤트 리스너 설정
  const userIconContainer = document.querySelectorAll('.svg-container')[1]; // 사용자 아이콘은 두 번째 svg-container
  userIconContainer.addEventListener('click', toggleMypage);

    // 이벤트 리스너 설정
    document.getElementById('search-icon').addEventListener('click', toggleSearch);
    document.getElementById('close-search').addEventListener('click', closeSearch);
    document.getElementById('user-icon').addEventListener('click', toggleMypage);
    document.getElementById('closeMypage').addEventListener('click', closeMypage);
});



//마이페이지 토글 함수
function toggleMypage() {
  const mypage = document.getElementById('mypage');
  if (mypage.style.right === '0px') {
    mypage.style.right = '-20%';
  } else {
    mypage.style.right = '0';
  }
}

//마이페이지 닫기 함수
function closeMypage() {
  document.getElementById('mypage').style.right = '-20%';
}


//페이지 시작 함수 정의
async function start() {
  try {
    await loadImages();
    init();
    document.querySelector('.arrow-left').addEventListener('click', stepBackward);
    document.querySelector('.arrow-right').addEventListener('click', stepForward);
  } catch (error) {
    console.error("One or more images failed to load", error);
  }
}

start();