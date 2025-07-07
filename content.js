// content.js - Manifest V3 버전
// KB사이트에서 완전 자동화 실행

const SEARCH_COORDINATES = {
    x: 314,
    y: 23
};

// KB부동산에서만 실행
if (window.location.hostname.includes('kbland.kr')) {
    
    // Service Worker로부터 자동화 명령 수신
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'executeFullAutomation') {
            console.log('🤖 MV3 자동화 시작:', request.searchText);
            
            executeCompleteAutomationMV3(request.searchText).then(() => {
                sendResponse({success: true});
            }).catch(error => {
                console.error('MV3 자동화 오류:', error);
                sendResponse({success: false, error: error.message});
            });
            
            return true; // 비동기 응답
        }
    });
    
    console.log('MV3 KB사이트 자동화 시스템 준비 완료');
}

// MV3 완전 자동화 실행
async function executeCompleteAutomationMV3(searchText) {
    try {
        console.log('🚀 MV3 5단계 자동화 시작');
        
        // 페이지 준비 상태 확인
        await waitForPageReadyMV3();
        
        // 1단계: 클립보드에 재복사
        await ensureClipboardMV3(searchText);
        await delayMV3(600);
        
        // 2단계: 좌표 더블클릭
        await doubleClickAtCoordinatesMV3(SEARCH_COORDINATES.x, SEARCH_COORDINATES.y);
        await delayMV3(900);
        
        // 3단계: 클립보드 붙여넣기
        await pasteFromClipboardMV3();
        await delayMV3(600);
        
        // 4단계: 엔터키
        await pressEnterKeyMV3();
        await delayMV3(1000);
        
        console.log('✅ MV3 완전 자동화 완료!');
        
        // 성공 알림 (이미지 없이)
        notifySuccessMV3('KB사이트 자동화 완료');
        
    } catch (error) {
        console.error('MV3 자동화 실행 오류:', error);
        throw error;
    }
}

// 지연 함수 (MV3)
function delayMV3(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 페이지 준비 상태 대기 (MV3)
function waitForPageReadyMV3() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            const handler = () => {
                if (document.readyState === 'complete') {
                    document.removeEventListener('readystatechange', handler);
                    resolve();
                }
            };
            document.addEventListener('readystatechange', handler);
            
            // 최대 5초 대기
            setTimeout(resolve, 5000);
        }
    });
}

// 1단계: MV3 클립보드 복사
async function ensureClipboardMV3(text) {
    console.log('📋 1단계: MV3 클립보드 재복사');
    
    try {
        await navigator.clipboard.writeText(text);
        console.log('✅ MV3 Clipboard API 복사 완료:', text);
    } catch (error) {
        console.log('⚠️ MV3 Clipboard API 실패, execCommand 사용');
        
        // 폴백: execCommand 사용
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
            const success = document.execCommand('copy');
            if (success) {
                console.log('✅ MV3 execCommand 복사 완료:', text);
            } else {
                console.log('❌ MV3 execCommand 복사 실패');
            }
        } catch (e) {
            console.error('MV3 모든 복사 방법 실패:', e);
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

// 2단계: MV3 더블클릭
async function doubleClickAtCoordinatesMV3(x, y) {
    console.log(`🖱️ 2단계: MV3 좌표 (${x}, ${y}) 더블클릭`);
    
    const element = document.elementFromPoint(x - window.scrollX, y - window.scrollY);
    
    if (element) {
        console.log('🎯 MV3 클릭 대상:', element.tagName, element.className);
        
        // 포커스
        if (element.focus) {
            element.focus();
        }
        
        // MV3 최적화된 이벤트 옵션
        const mouseEventOptions = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            button: 0,
            buttons: 1,
            composed: true // MV3에서 중요
        };
        
        // 더블클릭 이벤트 시퀀스
        const events = [
            new MouseEvent('mousedown', {...mouseEventOptions, detail: 1}),
            new MouseEvent('mouseup', {...mouseEventOptions, detail: 1}),
            new MouseEvent('click', {...mouseEventOptions, detail: 1}),
            new MouseEvent('mousedown', {...mouseEventOptions, detail: 2}),
            new MouseEvent('mouseup', {...mouseEventOptions, detail: 2}),
            new MouseEvent('click', {...mouseEventOptions, detail: 2}),
            new MouseEvent('dblclick', {...mouseEventOptions, detail: 2})
        ];
        
        // 이벤트 순차 실행
        for (let i = 0; i < events.length; i++) {
            element.dispatchEvent(events[i]);
            await delayMV3(80);
        }
        
        // 직접 클릭도 실행
        element.click();
        
        console.log('✅ MV3 더블클릭 완료');
    } else {
        console.log('❌ MV3: 해당 좌표에 요소 없음');
        throw new Error('MV3: 클릭할 요소를 찾을 수 없음');
    }
}

// 3단계: MV3 붙여넣기
async function pasteFromClipboardMV3() {
    console.log('📝 3단계: MV3 클립보드 붙여넣기 (Ctrl+V)');
    
    const activeElement = document.activeElement;
    
    if (activeElement) {
        // MV3 Ctrl+V 이벤트
        const ctrlVEvent = new KeyboardEvent('keydown', {
            key: 'v',
            code: 'KeyV',
            keyCode: 86,
            which: 86,
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
            composed: true // MV3에서 중요
        });
        
        activeElement.dispatchEvent(ctrlVEvent);
        
        // 직접 붙여넣기도 시도
        try {
            const clipboardText = await navigator.clipboard.readText();
            
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                // 기존 값 지우고 새 값 입력
                activeElement.value = '';
                await delayMV3(100);
                activeElement.value = clipboardText;
                
                // MV3 최적화된 이벤트들
                const inputEvents = [
                    new Event('input', { bubbles: true, composed: true }),
                    new Event('change', { bubbles: true, composed: true }),
                    new KeyboardEvent('keyup', { bubbles: true, composed: true }),
                    new InputEvent('input', { 
                        bubbles: true, 
                        composed: true,
                        data: clipboardText,
                        inputType: 'insertText'
                    })
                ];
                
                for (let event of inputEvents) {
                    activeElement.dispatchEvent(event);
                    await delayMV3(50);
                }
            }
            console.log('✅ MV3 붙여넣기 완료:', clipboardText);
        } catch (e) {
            console.log('⚠️ MV3 직접 붙여넣기 실패, 키 이벤트만 실행');
        }
    } else {
        console.log('❌ MV3: 활성 요소 없음');
    }
}

// 4단계: MV3 엔터키
async function pressEnterKeyMV3() {
    console.log('⏎ 4단계: MV3 엔터키 실행');
    
    const activeElement = document.activeElement;
    
    if (activeElement) {
        // MV3 최적화된 엔터 키 이벤트들
        const enterEvents = [
            new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                composed: true // MV3에서 중요
            }),
            new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                composed: true
            }),
            new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
                composed: true
            })
        ];
        
        // 모든 엔터 이벤트 실행
        for (let event of enterEvents) {
            activeElement.dispatchEvent(event);
            await delayMV3(100);
        }
        
        // 폼 제출도 시도
        if (activeElement.form) {
            try {
                activeElement.form.submit();
                console.log('📋 MV3 폼 제출 시도');
            } catch (e) {
                console.log('⚠️ MV3 폼 제출 실패');
            }
        }
        
        // 추가 검색 방법들
        await delayMV3(200);
        await tryAlternativeSubmitMV3(activeElement);
        
        console.log('✅ MV3 엔터키 완료');
    } else {
        console.log('❌ MV3: 활성 요소 없음');
    }
}

// MV3 추가 검색 방법들
async function tryAlternativeSubmitMV3(element) {
    console.log('🔄 MV3 추가 검색 방법 시도');
    
    // Tab + Space
    const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        keyCode: 9,
        bubbles: true,
        composed: true
    });
    element.dispatchEvent(tabEvent);
    
    await delayMV3(300);
    
    const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        keyCode: 32,
        bubbles: true,
        composed: true
    });
    
    if (document.activeElement) {
        document.activeElement.dispatchEvent(spaceEvent);
    }
    
    // 검색 버튼 찾기
    await delayMV3(200);
    const searchButton = findSearchButtonMV3();
    if (searchButton) {
        console.log('🔘 MV3 검색 버튼 클릭');
        searchButton.click();
    }
}

// MV3 검색 버튼 찾기
function findSearchButtonMV3() {
    const selectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button[aria-label*="검색"]',
        '.search-btn',
        '.btn-search',
        '#searchBtn',
        'button:contains("검색")',
        '[onclick*="search"]'
    ];
    
    for (let selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) { // 보이는 요소만
            return element;
        }
    }
    
    // 텍스트로 검색 버튼 찾기
    const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
    for (let button of buttons) {
        if (button.textContent && button.textContent.includes('검색')) {
            return button;
        }
        if (button.value && button.value.includes('검색')) {
            return button;
        }
    }
    
    return null;
}

// MV3 안전한 알림 처리
function notifySuccessMV3(message) {
    // Service Worker에 알림 요청 (이미지 문제 방지)
    try {
        chrome.runtime.sendMessage({
            action: 'showNotification',
            message: message,
            type: 'success'
        });
    } catch (error) {
        console.log('알림 전송 실패:', error);
        // 폴백: 콘솔 로그만
        console.log('🎉', message);
    }
}

// MV3 오류 알림 처리
function notifyErrorMV3(message) {
    try {
        chrome.runtime.sendMessage({
            action: 'showNotification',
            message: message,
            type: 'error'
        });
    } catch (error) {
        console.error('❌', message);
    }
}

// 요소가 나타날 때까지 대기 (MV3 추가 유틸리티)
function waitForElementMV3(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);
        
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

// 검색 입력 필드 찾기 (MV3 추가 유틸리티)
function findSearchInputMV3() {
    const selectors = [
        'input[type="search"]',
        'input[placeholder*="검색"]',
        'input[name*="search"]',
        '#searchInput',
        '.search-input',
        'input[aria-label*="검색"]'
    ];
    
    for (let selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null) { // 보이는 요소만
            return element;
        }
    }
    
    return null;
}