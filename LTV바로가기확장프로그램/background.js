// background.js - LTV + KB시세 완전 버전
chrome.runtime.onInstalled.addListener(function() {
    // KB시세 바로가기 메뉴 (텍스트 선택 시)
    chrome.contextMenus.create({
        id: "kb-auto-search",
        title: "KB시세 바로가기",
        contexts: ["selection"]
    });
    
    // LTV계산기 바로가기 메뉴 (항상 표시)
    chrome.contextMenus.create({
        id: "ltv-calculator",
        title: "LTV계산기 바로가기",
        contexts: ["page", "frame", "link", "image"]
    });
    
    console.log('LTV계산기 + KB시세 바로가기 시스템 설치 완료');
});

// 우클릭 메뉴 클릭 이벤트
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "kb-auto-search") {
        const selectedText = info.selectionText;
        
        if (selectedText && selectedText.trim()) {
            console.log('KB시세 검색:', selectedText);
            
            // KB시세 자동화 실행
            copyToClipboard(selectedText.trim());
            openKBAndExecuteAutomation(selectedText.trim());
        }
    } else if (info.menuItemId === "ltv-calculator") {
        console.log('LTV계산기 바로가기');
        
        // LTV계산기 사이트로 바로가기
        openLTVCalculator();
    }
});

// LTV계산기 열기
function openLTVCalculator() {
    const ltvUrl = "https://ltv-flask-young.onrender.com/";
    
    // 기존 LTV 탭 확인
    chrome.tabs.query({}, function(tabs) {
        let ltvTab = null;
        
        for (let tab of tabs) {
            if (tab.url && tab.url.includes('ltv-flask-young.onrender.com')) {
                ltvTab = tab;
                break;
            }
        }
        
        if (ltvTab) {
            // 기존 탭 활성화
            chrome.tabs.update(ltvTab.id, { active: true });
            chrome.windows.update(ltvTab.windowId, { focused: true });
        } else {
            // 새 탭으로 열기
            chrome.tabs.create({
                url: ltvUrl,
                active: true
            });
        }
    });
}

// 클립보드에 복사
function copyToClipboard(text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            code: `
                try {
                    navigator.clipboard.writeText('${text.replace(/'/g, "\\'")}').then(() => {
                        console.log('클립보드 복사 완료: ${text}');
                    });
                } catch(e) {
                    console.error('클립보드 복사 실패:', e);
                }
            `
        });
    });
}

// KB사이트 열고 자동화 실행
function openKBAndExecuteAutomation(searchText) {
    const kbUrl = "https://kbland.kr/map?xy=37.5205559,126.9265729,16";
    
    chrome.tabs.query({}, function(tabs) {
        let kbTab = null;
        
        for (let tab of tabs) {
            if (tab.url && tab.url.includes('kbland.kr')) {
                kbTab = tab;
                break;
            }
        }
        
        if (kbTab) {
            chrome.tabs.update(kbTab.id, { 
                url: kbUrl,
                active: true 
            }, function() {
                chrome.windows.update(kbTab.windowId, { focused: true });
                waitForPageLoadAndExecute(kbTab.id, searchText);
            });
        } else {
            chrome.tabs.create({
                url: kbUrl,
                active: true
            }, function(newTab) {
                waitForPageLoadAndExecute(newTab.id, searchText);
            });
        }
    });
}

// 페이지 로딩 대기 후 자동화 실행
function waitForPageLoadAndExecute(tabId, searchText) {
    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            
            setTimeout(() => {
                chrome.tabs.sendMessage(tabId, {
                    action: 'executeFullAutomation',
                    searchText: searchText
                });
            }, 3000);
        }
    });
}

// 키보드 단축키 지원
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'ltv-shortcut') {
        openLTVCalculator();
    } else if (command === 'kb-shortcut') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: 'window.getSelection().toString().trim();'
            }, function(result) {
                if (result && result[0]) {
                    copyToClipboard(result[0]);
                    openKBAndExecuteAutomation(result[0]);
                }
            });
        });
    }
});
