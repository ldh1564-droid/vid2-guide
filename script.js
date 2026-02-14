// 가이드 화면 순서
const guideScreens = [
    'guide-title',      // 필독 타이틀
    'guide-1',          // 전자기기 반입금지
    'guide-2',          // 폐쇄공포증/임산부
    'guide-3',          // 개인정보 동의서
    'guide-4',          // 중도포기 환불불가
    'notice-title',     // 주의사항 타이틀
    'notice-1',         // 반입금지
    'notice-2',         // 힘으로 X
    'notice-3',         // 천장/벽
    'notice-4',         // 폐쇄공포증/임산부
    'notice-5',         // 힌트
    'notice-6',         // 보안유지
    'notice-7',         // 인터폰
    'notice-8',         // CCTV
    'notice-9',         // 진행률
    'notice-10',        // 직원용 자물쇠
    'hint-title',       // 힌트시스템 타이틀
    'hint-1',           // 힌트폰 화면 소개
    'hint-2',           // QR Code 버튼
    'hint-3',           // QR 스캔
    'hint-4',           // 메시지 보내기
    'hint-5',           // 힌트 무제한
    'hint-6',           // 사진 촬영 영향 없음
    'hint-7',           // 기본 사진 안내
    'hint-8',           // 빠른 응답
    'hint-9',           // 구체적 질문
    'hint-10',          // 마무리
    'lock-title',       // 자물쇠 안내 타이틀
    'lock-1',           // 방향 자물쇠
    'lock-2',           // 숫자 자물쇠
    'lock-3',           // 마스터 자물쇠
    'lock-4',           // 4버튼 자물쇠
    'lock-5',           // 금고
    'lock-6',           // 도어락
    'guide-end'         // 완료
];

// 각 화면 표시 시간 (ms)
const screenDurations = [
    3000,   // 필독 타이틀
    5000,   // 전자기기
    6000,   // 폐쇄공포증
    6000,   // 동의서
    5000,   // 환불
    3000,   // 주의사항 타이틀
    5000,   // 반입금지
    5000,   // 힘으로 X
    5000,   // 천장/벽
    4000,   // 폐쇄공포증
    6000,   // 힌트
    5000,   // 보안유지
    5000,   // 인터폰
    4000,   // CCTV
    5000,   // 진행률
    5000,   // 자물쇠
    3000,   // 힌트시스템 타이틀
    5000,   // 힌트폰 화면 소개
    5000,   // QR Code 버튼
    5000,   // QR 스캔
    5000,   // 메시지 보내기
    5000,   // 힌트 무제한
    5000,   // 사진 촬영 영향 없음
    5000,   // 기본 사진 안내
    4000,   // 빠른 응답
    5000,   // 구체적 질문
    5000,   // 마무리
    3000,   // 자물쇠 안내 타이틀
    7000,   // 방향 자물쇠
    6000,   // 숫자 자물쇠
    6000,   // 마스터 자물쇠
    6000,   // 4버튼 자물쇠
    7000,   // 금고
    5000,   // 도어락
    0       // 완료 (수동)
];

let currentGuideIndex = 0;
let guideTimer = null;
let isPaused = false;
let pausedTimeRemaining = 0;
let pausedStartTime = 0;

// TTS (음성 합성) 설정
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

// 각 화면별 읽을 텍스트
const screenTexts = {
    'guide-title': '필독. 입장 전 꼭 확인해주세요.',
    'guide-1': '결제 전 안내. 휴대폰 및 전자기기는 반입금지 물품입니다. 이 점을 고려하여 입장 결정해 주시기 바랍니다.',
    'guide-2': '결제 전 안내. 폐쇄공포증이 있거나 임산부이신 분은 주의해주세요. 방탈출카페 특성상 한 공간 안에 갇혀 있으며 놀랄 수 있습니다.',
    'guide-3': '입장 전 안내. 개인정보 동의서를 작성해주세요. 첫째, 입장과 테마 내용 보안 유지에 대한 동의. 둘째, 테마 내부 기물 파손 및 분실 시 연락처 제공.',
    'guide-4': '플레이 중 안내. 중도 포기 시 환불이 불가능합니다. 고객님의 자의에 의한 중도 포기에 해당됩니다.',
    'notice-title': '주의사항 안내. 플레이 전 꼭 숙지해주세요.',
    'notice-1': '반입 금지. 휴대폰, 스마트워치, 화기류는 반입 금지입니다. 휴대폰은 무음으로 사물함에 보관해주세요.',
    'notice-2': '플레이 방법. 힘으로 하는게 없어요! 테마 파손 시 손해배상할 수도 있어요!',
    'notice-3': '플레이 방법. 천장, 옆 벽면 가격 시 옆방에 피해가 가요! 지나친 소음 또는 장난은 자제 부탁드립니다.',
    'notice-4': '사전 안내. 폐쇄공포증이 있거나 임산부이신 분은 직원에게 미리 말해주세요!',
    'notice-5': '힌트 시스템. 힌트는 힌트폰으로 무제한! 힌트 개수 상관없이 인화사진 촬영 가능. 기본 1장, 4인 이상은 2장 제공.',
    'notice-6': '특급 기밀! 테마 내용 보안유지. 방탈출이 끝나면 홀 내부에서도 보안유지 부탁드립니다!',
    'notice-7': '문의사항. 방 안 인터폰 이용해주세요. 수화기를 들고 버튼이 있다면 눌러주세요.',
    'notice-8': '안전 안내. 씨씨티비 녹화 중입니다. 손님의 안전을 위해 녹화하고 있어요!',
    'notice-9': '진행률 안내. 진행률 60% 이하 시 테마 종료 시점 기준 뒷 내용 설명이 불가능합니다.',
    'notice-10': '자물쇠 안내. 금지 표시가 있는 건 직원용 자물쇠입니다. 풀지 말아주세요!',
    'hint-title': '힌트시스템 안내. 큐알코드로 힌트를 받아보세요.',
    'hint-1': '스텝 1. 힌트폰 화면은 이렇게 생겼어요. 게임 시작 시 타이머가 작동합니다.',
    'hint-2': '스텝 2. 큐알코드 버튼을 눌러주세요. 큐알코드로 힌트를 요청할 수 있어요.',
    'hint-3': '스텝 3. 방 안의 큐알코드를 스캔하세요! 힌트폰 카메라로 큐알코드를 스캔하면 힌트 채팅방에 연결됩니다.',
    'hint-4': '스텝 4. 막힌 곳을 메시지로 보내주세요. 어디서 막혔는지 알려주시면 맞춤 힌트를 드려요!',
    'hint-5': '스텝 5. 힌트는 무제한! 부담 갖지 마시고 편하게 물어보세요.',
    'hint-6': '스텝 6. 힌트 개수와 사진 촬영은 무관해요! 힌트를 많이 써도 인화사진 촬영은 동일해요.',
    'hint-7': '스텝 7. 인화사진 기본 제공. 기본 1장, 4인 이상은 2장 제공됩니다.',
    'hint-8': '스텝 8. 힌트는 빠르게 답변드려요. 보통 1분 이내로 답변합니다. 조금만 기다려주세요.',
    'hint-9': '스텝 9. 구체적으로 물어보세요. 이 자물쇠 어떻게 열어요? 처럼 구체적으로 질문하면 더 정확해요!',
    'hint-10': '스텝 10. 힌트 시스템 준비 완료! 이제 즐거운 탈출을 시작하세요! 막히면 언제든 힌트를 요청하세요.',
    'lock-title': '자물쇠 안내. 자물쇠 여는 방법을 알려드릴게요.',
    'lock-1': '방향 자물쇠. 상하좌우 방향을 순서대로 입력하세요. 자물쇠를 아래로 당기면 열려요. 은색 고리 3번 누르면 초기화됩니다. 튕기면 안돼요!',
    'lock-2': '숫자 자물쇠. 빨간색 선에 숫자를 맞춰주세요. 위쪽부터 아래로 숫자를 맞추세요. 당기면서 돌리면 안 돌아가요!',
    'lock-3': '마스터 자물쇠. 마스터 써있는 부분을 찾으세요. 왼쪽에서 오른쪽으로 맞추고 당기세요. 옆이나 위로 당겨도 잘 열려요.',
    'lock-4': '4버튼 자물쇠. 숫자 버튼을 누르고 아래 튀어나온 부분을 옆으로 밀어 열어주세요.',
    'lock-5': '금고 사용법. 비밀번호를 입력 후 이 버튼을 누르세요. 초록색 불이 들어오면 손잡이를 오른쪽으로 돌려 열어주세요. 씨 버튼으로 초기화 가능합니다. 주의! 3회 초과 시 5분간 잠깁니다.',
    'lock-6': '도어락 사용법. 비밀번호를 입력 후 샵 버튼을 누르세요. 횟수 제한은 없습니다.',
    'guide-end': '안전하고 즐거운 방탈출 문화를 위해 최선을 다하겠습니다. 큐브 이스케이프 수유점.'
};

// 텍스트 읽기 함수
function speakText(text) {
    // 이전 음성 중지
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    // 새 음성 생성
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'ko-KR';
    currentUtterance.rate = 1.0;  // 속도 (0.1 ~ 10)
    currentUtterance.pitch = 1.0; // 음높이 (0 ~ 2)
    currentUtterance.volume = 1.0; // 볼륨 (0 ~ 1)

    // 한국어 음성 찾기
    const voices = speechSynthesis.getVoices();
    const koreanVoice = voices.find(voice => voice.lang.includes('ko'));
    if (koreanVoice) {
        currentUtterance.voice = koreanVoice;
    }

    speechSynthesis.speak(currentUtterance);
}

// 음성 중지 함수
function stopSpeech() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}

// 섹션 탭 정보
const sectionTabs = [
    { name: '주의사항', start: 'notice-title', prefix: 'notice' },
    { name: '힌트시스템', start: 'hint-title', prefix: 'hint' },
    { name: '자물쇠 안내', start: 'lock-title', prefix: 'lock' }
];

// 현재 섹션 확인
function getCurrentSection(screenId) {
    if (screenId.startsWith('notice')) return 'notice';
    if (screenId.startsWith('hint')) return 'hint';
    if (screenId.startsWith('lock')) return 'lock';
    return null;
}

// 탭 생성 함수
function createTabs(screenId) {
    const currentSection = getCurrentSection(screenId);
    if (!currentSection) return '';

    let tabsHtml = '<div class="section-tabs">';

    sectionTabs.forEach(tab => {
        const isActive = tab.prefix === currentSection ? 'active' : '';
        tabsHtml += `<button class="section-tab ${isActive}" onclick="goToSection('${tab.start}')">${tab.name}</button>`;
    });

    tabsHtml += '</div>';
    return tabsHtml;
}

// 섹션으로 이동
function goToSection(screenId) {
    const index = guideScreens.indexOf(screenId);
    if (index !== -1) {
        stopGuide();
        isPaused = false;
        currentGuideIndex = index;
        showGuideScreen();
    }
}

// 탭 업데이트 함수
function updateTabs(screenId) {
    // 기존 탭 제거
    document.querySelectorAll('.section-tabs').forEach(tab => tab.remove());

    // 새 탭 추가
    const screen = document.getElementById(screenId);
    if (screen) {
        const tabsHtml = createTabs(screenId);
        if (tabsHtml) {
            screen.insertAdjacentHTML('afterbegin', tabsHtml);
        }
    }
}

// 구글폼 URL
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScsKxOIhB1bLY5W7WLLn0FCP41Q6X_NGpx_9r1UXLS5ozjgkA/viewform';

// 구글폼으로 이동
function goToForm() {
    window.location.href = GOOGLE_FORM_URL;
}

// 화면 전환 함수
function goToScreen(screenId) {
    stopGuide();

    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.getElementById(screenId).classList.add('active');
}

// 가이드 시작
function startGuide() {
    currentGuideIndex = 0;
    showGuideScreen();
}

// 가이드 화면 표시
function showGuideScreen() {
    const screenId = guideScreens[currentGuideIndex];
    const duration = screenDurations[currentGuideIndex];

    // 모든 화면 비활성화
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // 현재 화면 활성화
    const currentScreen = document.getElementById(screenId);
    currentScreen.classList.add('active');

    // 탭 업데이트
    updateTabs(screenId);

    // 음성 읽기
    if (screenTexts[screenId]) {
        speakText(screenTexts[screenId]);
    }

    // 프로그레스 바 업데이트
    const progressBar = currentScreen.querySelector('.progress');
    if (progressBar && duration > 0) {
        progressBar.style.width = '0%';
        progressBar.style.transition = 'none';

        // 섹션별 프로그레스 바 색상
        if (screenId.startsWith('notice')) {
            progressBar.style.background = '#D4A853';  // 주의사항: 머스타드
        } else if (screenId.startsWith('hint')) {
            progressBar.style.background = '#3366FF';  // 힌트시스템: 파란색
        } else if (screenId.startsWith('lock')) {
            progressBar.style.background = '#2D5A4A';  // 자물쇠: 딥그린
        } else {
            progressBar.style.background = '#2D5A4A';  // 필독: 딥그린
        }

        setTimeout(() => {
            progressBar.style.transition = `width ${duration}ms linear`;
            progressBar.style.width = '100%';
        }, 50);
    }

    // 다음 화면으로 자동 전환
    if (duration > 0 && currentGuideIndex < guideScreens.length - 1) {
        pausedStartTime = Date.now();
        pausedTimeRemaining = duration;
        guideTimer = setTimeout(() => {
            currentGuideIndex++;
            showGuideScreen();
        }, duration);
    }
}

// 일시정지
function pauseGuide() {
    if (guideTimer) {
        clearTimeout(guideTimer);
        guideTimer = null;
        pausedTimeRemaining = pausedTimeRemaining - (Date.now() - pausedStartTime);
        isPaused = true;

        // 프로그레스 바 일시정지
        const activeScreen = document.querySelector('.screen.active');
        const progressBar = activeScreen?.querySelector('.progress');
        if (progressBar) {
            const computedWidth = getComputedStyle(progressBar).width;
            progressBar.style.transition = 'none';
            progressBar.style.width = computedWidth;
        }
    }
}

// 재개
function resumeGuide() {
    if (isPaused && pausedTimeRemaining > 0) {
        isPaused = false;
        pausedStartTime = Date.now();

        // 프로그레스 바 재개
        const activeScreen = document.querySelector('.screen.active');
        const progressBar = activeScreen?.querySelector('.progress');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.transition = `width ${pausedTimeRemaining}ms linear`;
                progressBar.style.width = '100%';
            }, 50);
        }

        guideTimer = setTimeout(() => {
            currentGuideIndex++;
            showGuideScreen();
        }, pausedTimeRemaining);
    }
}

// 가이드 중지
function stopGuide() {
    if (guideTimer) {
        clearTimeout(guideTimer);
        guideTimer = null;
    }
    // 음성도 중지
    stopSpeech();
}

// 클릭으로 화면 전환 (가이드 중일 때)
// 왼쪽 터치: 이전, 오른쪽 터치: 다음
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn')) return;
    if (e.target.closest('.section-tab')) return;

    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && guideScreens.includes(activeScreen.id)) {
        stopGuide();
        isPaused = false;

        // 화면 너비의 절반 기준으로 왼쪽/오른쪽 판단
        const screenWidth = window.innerWidth;
        const clickX = e.clientX;

        if (clickX < screenWidth / 2) {
            // 왼쪽 터치: 이전 화면
            if (currentGuideIndex > 0) {
                currentGuideIndex--;
                showGuideScreen();
            }
        } else {
            // 오른쪽 터치: 다음 화면
            if (currentGuideIndex < guideScreens.length - 1) {
                currentGuideIndex++;
                showGuideScreen();
            }
        }
    }
});

// 음성 목록 로딩 (브라우저마다 비동기로 로드됨)
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        goToScreen('screen-intro');
    }
    // 스페이스바: 일시정지/재개 토글
    if (e.key === ' ') {
        e.preventDefault();
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && guideScreens.includes(activeScreen.id)) {
            if (isPaused) {
                resumeGuide();
            } else {
                pauseGuide();
            }
        }
    }
    if (e.key === 'ArrowRight') {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && guideScreens.includes(activeScreen.id)) {
            stopGuide();
            isPaused = false;
            if (currentGuideIndex < guideScreens.length - 1) {
                currentGuideIndex++;
                showGuideScreen();
            }
        }
    }
    if (e.key === 'ArrowLeft') {
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && guideScreens.includes(activeScreen.id)) {
            stopGuide();
            isPaused = false;
            if (currentGuideIndex > 0) {
                currentGuideIndex--;
                showGuideScreen();
            }
        }
    }
});
