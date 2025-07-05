// 팝업 스크립트

document.addEventListener('DOMContentLoaded', function() {
    // LTV계산기 버튼 클릭 이벤트
    document.getElementById('ltvBtn').addEventListener('click', function() {
        chrome.runtime.sendMessage({
            action: 'openLTV'
        });
        window.close();
    });
    
    // KB시세 버튼 클릭 이벤트
    document.getElementById('kbBtn').addEventListener('click', function() {
        // 현재 활성 탭에서 선택된 텍스트 가져오기
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {
                code: 'window.getSelection().toString().trim();'
            }, function(result) {
                if (result && result[0]) {
                    chrome.runtime.sendMessage({
                        action: 'openKB',
                        text: result[0]
                    });
                } else {
                    // 선택된 텍스트가 없으면 기본 KB시세 사이트로 이동
                    chrome.runtime.sendMessage({
                        action: 'openKB',
                        text: ''
                    });
                }
                window.close();
            });
        });
    });
});

// 백그라운드 스크립트로부터 메시지 수신
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'openLTV') {
        openOrFocusTab('https://ltv-flask-young.onrender.com/');
    } else if (request.action === 'openKB') {
        const baseUrl = 'https://kbland.kr/map?xy=37.5205559,126.9265729,16';
        const finalUrl = request.text ? 
            baseUrl + '&search=' + encodeURIComponent(request.text) : 
            baseUrl;
        openOrFocusTab(finalUrl);
    }
});

// 탭 열기 또는 기존 탭으로 포커스 이동
function openOrFocusTab(url) {
    chrome.tabs.query({}, function(tabs) {
        let targetTab = null;
        
        // 기존에 열린 탭 중에서 같은 도메인이 있는지 확인
        for (let tab of tabs) {
            if (url.includes('ltv-flask-young.onrender.com') && 
                tab.url.includes('ltv-flask-young.onrender.com')) {
                targetTab = tab;
                break;
            } else if (url.includes('kbland.kr') && 
                       tab.url.includes('kbland.kr')) {
                targetTab = tab;
                break;
            }
        }
        
        if (targetTab) {
            // 기존 탭이 있으면 해당 탭으로 이동하고 URL 업데이트
            chrome.tabs.update(targetTab.id, {
                url: url,
                active: true
            });
            chrome.windows.update(targetTab.windowId, {focused: true});
        } else {
            // 새 탭으로 열기
            chrome.tabs.create({
                url: url,
                active: true
            });
        }
    });
}