// content.js - KB사이트에서 완전 자동화 실행
// 좌표 더블클릭 → 붙여넣기 → 엔터

const SEARCH_COORDINATES = {
    x: 314,
    y: 23
};

// KB부동산에서만 실행
if (window.location.hostname.includes('kbland.kr')) {
    
    // background.js로부터 자동화 명령 수신
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'executeFullAutomation') {
            console.log('🤖 완전 자동화 시작:', request.searchText);
            
            executeCompleteAutomation(request.searchText);
            sendResponse({success: true});
        }
    });
    
    console.log('KB사이트 자동화 시스템 준비 완료');
}

// 완전 자동화 실행 함수
async function executeCompleteAutomation(searchText) {
    try {
        console.log('🚀 5단계 자동화 시작');
        
        // 1단계: 클립보드에 재복사 (확실하게)
        await ensureClipboard(searchText);
        await delay(500);
        
        // 2단계: 좌표 (314, 23)에 더블클릭
        await doubleClickAtCoordinates(SEARCH_COORDINATES.x, SEARCH_COORDINATES.y);
        await delay(800);
        
        // 3단계: 클립보드 붙여넣기 (Ctrl+V)
        await pasteFromClipboard();
        await delay(500);
        
        // 4단계: 엔터키
        await pressEnterKey();
        await delay(1000);
        
        console.log('✅ 완전 자동화 완료!');
        
    } catch (error) {
        console.error('자동화 실행 오류:', error);
    }
}

// 1단계: 클립보드 확실히 복사
async function ensureClipboard(text) {
    console.log('📋 1단계: 클립보드 재복사');
    
    try {
        await navigator.clipboard.writeText(text);
        console.log('✅ 클립보드 복사 완료:', text);
    } catch (error) {
        console.log('⚠️ 클립보드 복사 실패, 대안 방법 사용');
        
        // 대안: 임시 textarea 사용
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// 2단계: 지정된 좌표에 더블클릭
async function doubleClickAtCoordinates(x, y) {
    console.log(`🖱️ 2단계: 좌표 (${x}, ${y})에 더블클릭`);
    
    // 해당 좌표의 요소 찾기
    const element = document.elementFromPoint(x - window.scrollX, y - window.scrollY);
    
    if (element) {
        console.log('🎯 클릭 대상 요소:', element.tagName, element.className);
        
        // 포커스 먼저
        if (element.focus) {
            element.focus();
        }
        
        // 더블클릭 이벤트 시뮬레이션
        const clickEvents = [
            new MouseEvent('mousedown', {
                bubbles: true, 
                cancelable: true, 
                clientX: x, 
                clientY: y, 
                button: 0,
                detail: 1
            }),
            new MouseEvent('mouseup', {
                bubbles: true, 
                cancelable: true, 
                clientX: x, 
                clientY: y, 
                button: 0,
                detail: 1
            }),
            new MouseEvent('click', {
                bubbles: true, 
                cancelable: true, 
                clientX: x, 
                clientY: y, 
                button: 0,
                detail: 1
            }),
            new MouseEvent('mousedown', {
                bubbles: true, 
                cancelable: true, 
                clientX: x, 
                clientY: y, 
                button: 0,
                detail: 2
            }),
            new MouseEvent('mouseup', {
                bubbles: true, 
                cancelable: true, 
                clientX: x, 
                clientY: y, 
                button: 0,
                detail: 2
            }),
            new MouseEvent('click', {
                bubbles: true, 
                cancelable: true, 
                clientX: x, 
                clientY: y, 
                button: 0,
                detail: 2
            }),
            new MouseEvent('dblclick', {
                bubbles: true, 
                cancelable: true, 
                clientX: x, 
                clientY: y, 
                button: 0,
                detail: 2
            })
        ];
        
        // 모든 이벤트 순차 실행
        for (let event of clickEvents) {
            element.dispatchEvent(event);
            await delay(50);
        }
        
        // 직접 클릭도 실행
        element.click();
        
        console.log('✅ 더블클릭 완료');
    } else {
        console.log('❌ 해당 좌표에 요소 없음');
        throw new Error('클릭할 요소를 찾을 수 없음');
    }
}

// 3단계: 클립보드 붙여넣기 (Ctrl+V)
async function pasteFromClipboard() {
    console.log('📝 3단계: 클립보드 붙여넣기 (Ctrl+V)');
    
    const activeElement = document.activeElement;
    
    if (activeElement) {
        // Ctrl+V 키 이벤트
        const ctrlVEvent = new KeyboardEvent('keydown', {
            key: 'v',
            code: 'KeyV',
            keyCode: 86,
            which: 86,
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        });
        
        activeElement.dispatchEvent(ctrlVEvent);
        
        // 직접 붙여넣기도 시도
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                // 기존 값 지우고 새 값 입력
                activeElement.value = '';
                activeElement.value = clipboardText;
                
                // Vue.js 대응 이벤트들
                const events = ['input', 'change', 'keyup'];
                events.forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    activeElement.dispatchEvent(event);
                });
                
                // InputEvent 추가
                const inputEvent = new InputEvent('input', { 
                    bubbles: true,
                    data: clipboardText 
                });
                activeElement.dispatchEvent(inputEvent);
            }
            console.log('✅ 붙여넣기 완료:', clipboardText);
        } catch (e) {
            console.log('⚠️ 직접 붙여넣기 실패, 키 이벤트만 실행');
        }
    } else {
        console.log('❌ 활성 요소 없음');
    }
}

// 4단계: 엔터키
async function pressEnterKey() {
    console.log('⏎ 4단계: 엔터키 실행');
    
    const activeElement = document.activeElement;
    
    if (activeElement) {
        // 다양한 엔터 키 이벤트들
        const enterEvents = [
            new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            }),
            new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            }),
            new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            })
        ];
        
        // 모든 엔터 이벤트 실행
        enterEvents.forEach(event => {
            activeElement.dispatchEvent(event);
        });
        
        // 폼 제출도 시도
        if (activeElement.form) {
            try {
                activeElement.form.submit();
                console.log('📋 폼 제출도 시도');
            } catch (e) {
                console.log('⚠️ 폼 제출 실패');
            }
        }
        
        console.log('✅ 엔터키 완료');
    } else {
        console.log('❌ 활성 요소 없음');
    }
}

// 지연 함수
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 페이지 로딩 완료 확인
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ KB사이트 DOM 로딩 완료');
});

// 추가 대기 시간 후 준비 완료
setTimeout(() => {
    console.log('✅ KB사이트 자동화 시스템 완전 준비됨');
}, 2000);
