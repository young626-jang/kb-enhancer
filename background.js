// background.js - scripting API 오류 수정 버전

// Service Worker 설치/활성화
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// 확장프로그램 설치 시 메뉴 생성
chrome.runtime.onInstalled.addListener(() => {
    createContextMenus();
});

// 우클릭 메뉴 생성
function createContextMenus() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "kb-auto-search",
            title: "🏠 KB시세 바로가기",
            contexts: ["selection"]
        });
        
        chrome.contextMenus.create({
            id: "ltv-calculator", 
            title: "📊 LTV계산기 바로가기",
            contexts: ["page", "frame", "link", "image"]
        });
    });
}

// 우클릭 메뉴 클릭 이벤트
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "kb-auto-search" && info.selectionText?.trim()) {
        // 클립보드 복사 없이 바로 자동화 실행
        await openKBAndExecuteAutomationMV3(info.selectionText.trim());
    } else if (info.menuItemId === "ltv-calculator") {
        await openLTVCalculatorMV3();
    }
});

// LTV계산기 열기
async function openLTVCalculatorMV3() {
    const ltvUrl = "https://ltv-flask-young.onrender.com/";
    const tabs = await chrome.tabs.query({});
    let ltvTab = tabs.find(tab => tab.url?.includes('ltv-flask-young.onrender.com'));
    
    if (ltvTab) {
        await chrome.tabs.update(ltvTab.id, { active: true });
        await chrome.windows.update(ltvTab.windowId, { focused: true });
    } else {
        await chrome.tabs.create({ url: ltvUrl, active: true });
    }
}

// KB사이트 열고 자동화 실행
async function openKBAndExecuteAutomationMV3(searchText) {
    const kbUrl = "https://kbland.kr/map?xy=37.5205559,126.9265729,16";
    const tabs = await chrome.tabs.query({});
    let kbTab = tabs.find(tab => tab.url?.includes('kbland.kr'));
    
    let targetTabId;
    if (kbTab) {
        await chrome.tabs.update(kbTab.id, { url: kbUrl, active: true });
        await chrome.windows.update(kbTab.windowId, { focused: true });
        targetTabId = kbTab.id;
    } else {
        const newTab = await chrome.tabs.create({ url: kbUrl, active: true });
        targetTabId = newTab.id;
    }
    
    // 페이지 로딩 대기 후 자동화 실행
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
        if (tabId === targetTabId && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            
            setTimeout(async () => {
                try {
                    await chrome.tabs.sendMessage(targetTabId, {
                        action: 'executeFullAutomation',
                        searchText: searchText
                    });
                } catch (error) {
                    console.log('메시지 전송 실패, 재시도:', error);
                    // 재시도
                    setTimeout(() => {
                        chrome.tabs.sendMessage(targetTabId, {
                            action: 'executeFullAutomation',
                            searchText: searchText
                        }).catch(() => {});
                    }, 2000);
                }
            }, 3500); // 대기 시간 증가
        }
    });
}

// 키보드 단축키 - scripting API 사용 제거
chrome.commands.onCommand.addListener(async (command) => {
    if (command === 'ltv-shortcut') {
        await openLTVCalculatorMV3();
    } else if (command === 'kb-shortcut') {
        // 현재 탭의 선택된 텍스트를 직접 가져오는 대신
        // 사용자에게 입력받도록 변경
        const tabs = await chrome.tabs.query({active: true, currentWindow: true});
        if (tabs[0]) {
            // content script에 선택된 텍스트 요청
            try {
                const response = await chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'getSelectedText'
                });
                
                if (response && response.text && response.text.trim()) {
                    await openKBAndExecuteAutomationMV3(response.text);
                } else {
                    console.log('선택된 텍스트가 없습니다');
                }
            } catch (error) {
                console.log('선택된 텍스트 가져오기 실패:', error);
            }
        }
    }
});

// 팝업과의 통신 - scripting API 제거
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        if (request.action === 'openLTV') {
            await openLTVCalculatorMV3();
            sendResponse({success: true});
        } else if (request.action === 'openKB') {
            if (request.text && request.text.trim()) {
                await openKBAndExecuteAutomationMV3(request.text);
            } else {
                // 텍스트가 없으면 기본 KB 사이트만 열기
                const kbUrl = "https://kbland.kr/map?xy=37.5205559,126.9265729,16";
                await chrome.tabs.create({ url: kbUrl, active: true });
            }
            sendResponse({success: true});
        }
    } catch (error) {
        console.error('메시지 처리 오류:', error);
        sendResponse({success: false, error: error.message});
    }
    return true;
});

chrome.runtime.onStartup.addListener(createContextMenus);