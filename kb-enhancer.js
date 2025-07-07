// 완전 자동화된 검색 시스템
// 버튼 한 번 클릭으로 클릭→전체선택→붙여넣기→엔터 자동 실행
console.log('🤖 완전 자동화 검색 시스템 활성화');

const AUTO_SEARCH_COORDS = {
    x: 314,
    y: 23
};

let fullyAutomatedSearch = {
    isRunning: false,
    
    init: function() {
        console.log('🚀 완전 자동화 시스템 초기화');
        this.addUI();
        this.setupKeyboard();
    },
    
    addUI: function() {
        const panel = document.createElement('div');
        panel.id = 'auto-search-panel';
        panel.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 15px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.4); font-family: 'Noto Sans KR', sans-serif; min-width: 280px;">
                
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 18px;">🤖 완전 자동화</h3>
                    <button id="close-auto-panel" style="margin-left: auto; background: rgba(255,255,255,0.2); border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 16px;">×</button>
                </div>
                
                <div id="auto-status" style="background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin-bottom: 15px; font-size: 13px; min-height: 50px;">
                    <div id="auto-status-text" style="font-weight: 600;">준비 완료</div>
                    <div id="auto-status-step" style="font-size: 11px; opacity: 0.9; margin-top: 5px;">원클릭 자동 검색</div>
                    <div id="auto-progress-bar" style="width: 0%; height: 3px; background: #fff; margin-top: 8px; border-radius: 2px; transition: width 0.3s ease;"></div>
                </div>
                
                <div id="auto-clipboard-search" style="width: 100%; margin-bottom: 12px; padding: 15px; background: rgba(255,255,255,0.2); color: white; border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; cursor: pointer; font-weight: 700; text-align: center; transition: all 0.3s ease; font-size: 16px;">
                    🚀 자동 검색 실행
                </div>
                
                <div id="manual-auto-search" style="width: 100%; margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer; font-weight: 600; text-align: center;">
                    ⌨️ 텍스트 입력 후 자동 실행
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <div id="test-auto-position" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 11px; text-align: center;">
                        🎯 위치 테스트
                    </div>
                    <div id="demo-auto-mode" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 11px; text-align: center;">
                        🎬 데모 모드
                    </div>
                </div>
                
            </div>
        `;
        
        document.body.appendChild(panel);
        this.setupEvents();
    },
    
    setupEvents: function() {
        const self = this;
        
        document.getElementById('auto-clipboard-search').onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (self.isRunning) return;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
            self.executeFullyAutomaticSearch();
        };
        
        document.getElementById('manual-auto-search').onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
            self.manualThenAutoSearch();
        };
        
        document.getElementById('test-auto-position').onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
            self.testPosition();
        };
        
        document.getElementById('demo-auto-mode').onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => { this.style.transform = 'scale(1)'; }, 100);
            self.demoMode();
        };
        
        document.getElementById('close-auto-panel').onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('auto-search-panel').remove();
        };
    },
    
    updateStatus: function(text, step, progress) {
        const statusText = document.getElementById('auto-status-text');
        const statusStep = document.getElementById('auto-status-step');
        const progressBar = document.getElementById('auto-progress-bar');
        
        if (statusText) statusText.textContent = text;
        if (statusStep && step) statusStep.textContent = step;
        if (progressBar && progress !== undefined) {
            progressBar.style.width = progress + '%';
        }
        
        console.log('🤖', text, step || '');
    },
    
    // 완전 자동 검색 실행
    executeFullyAutomaticSearch: async function() {
        if (this.isRunning) {
            console.log('⚠️ 이미 실행 중입니다');
            return;
        }
        
        this.isRunning = true;
        
        try {
            // 클립보드 확인
            this.updateStatus('클립보드 확인...', '데이터 읽는 중', 10);
            const clipboardText = await navigator.clipboard.readText();
            
            if (!clipboardText || !clipboardText.trim()) {
                this.updateStatus('클립보드가 비어있음', '데이터 없음', 0);
                this.resetStatus();
                this.isRunning = false;
                return;
            }
            
            console.log('📋 클립보드 내용:', clipboardText);
            
            // 자동 시퀀스 실행
            await this.runAutomaticSequence(clipboardText.trim());
            
        } catch (error) {
            console.error('자동 검색 실행 오류:', error);
            this.updateStatus('클립보드 오류', '권한 확인 필요', 0);
            
            // 수동 입력으로 대체
            setTimeout(() => {
                this.manualThenAutoSearch();
            }, 1000);
        }
        
        this.isRunning = false;
    },
    
    // 자동 시퀀스 실행 (핵심 기능)
    runAutomaticSequence: async function(searchText) {
        console.log('🎯 자동 시퀀스 시작:', searchText);
        
        // 1단계: 클릭
        this.updateStatus('1단계: 위치 클릭', `좌표 (${AUTO_SEARCH_COORDS.x}, ${AUTO_SEARCH_COORDS.y}) 클릭`, 25);
        await this.autoClick();
        await this.delay(800); // 클릭 후 충분한 대기
        
        // 2단계: 전체 선택
        this.updateStatus('2단계: 전체 선택', 'Ctrl+A 실행', 50);
        await this.autoSelectAll();
        await this.delay(300);
        
        // 3단계: 붙여넣기
        this.updateStatus('3단계: 붙여넣기', 'Ctrl+V 실행', 75);
        await this.autoPaste();
        await this.delay(500);
        
        // 4단계: 엔터
        this.updateStatus('4단계: 검색 실행', 'Enter 키 실행', 90);
        await this.autoEnter();
        await this.delay(1000);
        
        // 완료
        this.updateStatus('검색 완료!', '자동 시퀀스 완료', 100);
        console.log('✅ 자동 시퀀스 완료');
        
        this.resetStatus();
    },
    
    // 1단계: 자동 클릭
    autoClick: async function() {
        console.log('🖱️ 1단계: 자동 클릭 실행');
        
        const x = AUTO_SEARCH_COORDS.x;
        const y = AUTO_SEARCH_COORDS.y;
        
        // 해당 위치의 요소 찾기
        const element = document.elementFromPoint(x - window.scrollX, y - window.scrollY);
        
        if (element) {
            console.log('✅ 클릭 대상 요소:', element.tagName, element.className);
            
            // 포커스 먼저
            if (element.focus) {
                element.focus();
            }
            
            // 마우스 이벤트 시뮬레이션
            const events = [
                new MouseEvent('mousedown', {
                    bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0
                }),
                new MouseEvent('mouseup', {
                    bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0
                }),
                new MouseEvent('click', {
                    bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0
                })
            ];
            
            events.forEach(event => element.dispatchEvent(event));
            
            // 직접 클릭도 실행
            element.click();
            
            console.log('🖱️ 클릭 완료');
        } else {
            console.log('❌ 클릭할 요소 없음');
            throw new Error('클릭 대상 없음');
        }
    },
    
    // 2단계: 자동 전체 선택
    autoSelectAll: async function() {
        console.log('🎯 2단계: 자동 전체 선택 실행');
        
        const activeElement = document.activeElement;
        
        if (activeElement) {
            // Ctrl+A 키 이벤트
            const ctrlA = new KeyboardEvent('keydown', {
                key: 'a',
                code: 'KeyA',
                keyCode: 65,
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            });
            
            activeElement.dispatchEvent(ctrlA);
            
            // input/textarea라면 직접 선택도 실행
            if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                activeElement.select();
            }
            
            console.log('🎯 전체 선택 완료');
        } else {
            console.log('⚠️ 활성 요소 없음');
        }
    },
    
    // 3단계: 자동 붙여넣기
    autoPaste: async function() {
        console.log('📋 3단계: 자동 붙여넣기 실행');
        
        const activeElement = document.activeElement;
        
        if (activeElement) {
            // Ctrl+V 키 이벤트
            const ctrlV = new KeyboardEvent('keydown', {
                key: 'v',
                code: 'KeyV',
                keyCode: 86,
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            });
            
            activeElement.dispatchEvent(ctrlV);
            
            // 직접 값 설정도 시도
            try {
                const clipboardText = await navigator.clipboard.readText();
                if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                    activeElement.value = clipboardText;
                    
                    // input 이벤트 발생
                    const inputEvent = new Event('input', { bubbles: true });
                    activeElement.dispatchEvent(inputEvent);
                    
                    // change 이벤트도 발생
                    const changeEvent = new Event('change', { bubbles: true });
                    activeElement.dispatchEvent(changeEvent);
                }
                console.log('📋 붙여넣기 완료:', clipboardText.slice(0, 20));
            } catch (e) {
                console.log('⚠️ 직접 붙여넣기 실패, 키 이벤트만 실행');
            }
        } else {
            console.log('⚠️ 활성 요소 없음');
        }
    },
    
    // 4단계: 자동 엔터
    autoEnter: async function() {
        console.log('⏎ 4단계: 자동 엔터 실행');
        
        const activeElement = document.activeElement;
        
        if (activeElement) {
            // 다양한 엔터 키 이벤트
            const enterEvents = [
                new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true
                }),
                new KeyboardEvent('keypress', {
                    key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true
                }),
                new KeyboardEvent('keyup', {
                    key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true, cancelable: true
                })
            ];
            
            enterEvents.forEach(event => activeElement.dispatchEvent(event));
            
            // 폼 제출도 시도
            if (activeElement.form) {
                try {
                    activeElement.form.submit();
                    console.log('📝 폼 제출도 실행');
                } catch (e) {
                    console.log('⚠️ 폼 제출 실패');
                }
            }
            
            console.log('⏎ 엔터 완료');
        } else {
            console.log('⚠️ 활성 요소 없음');
        }
    },
    
    // 수동 입력 후 자동 실행
    manualThenAutoSearch: function() {
        const text = prompt('검색할 주소나 지역을 입력하세요:');
        if (text && text.trim()) {
            // 클립보드에 복사 후 자동 실행
            navigator.clipboard.writeText(text.trim()).then(() => {
                this.runAutomaticSequence(text.trim());
            }).catch(() => {
                alert('클립보드 권한이 필요합니다.');
            });
        }
    },
    
    // 위치 테스트
    testPosition: function() {
        this.updateStatus('위치 테스트...', '요소 확인 중', 50);
        
        const element = document.elementFromPoint(
            AUTO_SEARCH_COORDS.x - window.scrollX,
            AUTO_SEARCH_COORDS.y - window.scrollY
        );
        
        if (element) {
            element.style.border = '5px solid lime';
            element.style.boxShadow = '0 0 20px lime';
            
            console.log('🎯 테스트 결과:', element);
            alert(`위치 테스트 결과:\n\n좌표: (${AUTO_SEARCH_COORDS.x}, ${AUTO_SEARCH_COORDS.y})\n태그: ${element.tagName}\n클래스: ${element.className}\nID: ${element.id}\n\n초록색으로 하이라이트된 요소가 검색창인가요?`);
            
            setTimeout(() => {
                element.style.border = '';
                element.style.boxShadow = '';
            }, 3000);
            
            this.updateStatus('테스트 완료', '요소 확인됨', 100);
        } else {
            alert('해당 위치에 요소가 없습니다.');
            this.updateStatus('요소 없음', '위치 확인 필요', 0);
        }
        
        this.resetStatus();
    },
    
    // 데모 모드 (느린 실행)
    demoMode: async function() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        try {
            // 데모용 텍스트
            const demoText = '강남구 역삼동';
            await navigator.clipboard.writeText(demoText);
            
            this.updateStatus('데모 모드 시작', '느린 실행으로 시연', 0);
            await this.delay(1000);
            
            // 느린 자동 시퀀스
            await this.runSlowSequence(demoText);
            
        } catch (error) {
            console.error('데모 모드 오류:', error);
            this.updateStatus('데모 오류', error.message, 0);
        }
        
        this.isRunning = false;
    },
    
    // 느린 시퀀스 (데모용)
    runSlowSequence: async function(searchText) {
        // 각 단계를 2초씩 대기하며 실행
        this.updateStatus('데모: 클릭', '2초 후 실행', 25);
        await this.delay(2000);
        await this.autoClick();
        
        this.updateStatus('데모: 전체선택', '2초 후 실행', 50);
        await this.delay(2000);
        await this.autoSelectAll();
        
        this.updateStatus('데모: 붙여넣기', '2초 후 실행', 75);
        await this.delay(2000);
        await this.autoPaste();
        
        this.updateStatus('데모: 엔터', '2초 후 실행', 90);
        await this.delay(2000);
        await this.autoEnter();
        
        this.updateStatus('데모 완료!', '시퀀스 완료', 100);
        this.resetStatus();
    },
    
    // 상태 리셋
    resetStatus: function() {
        setTimeout(() => {
            this.updateStatus('준비 완료', '원클릭 자동 검색', 0);
        }, 3000);
    },
    
    // 지연 함수
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // 키보드 단축키
    setupKeyboard: function() {
        const self = this;
        
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'V') {
                e.preventDefault();
                e.stopPropagation();
                self.executeFullyAutomaticSearch();
            }
        });
    }
};

// KB부동산에서만 초기화
if (window.location.hostname.includes('https://kbland.kr/map?xy=37.5205559,126.9265729,16')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => fullyAutomatedSearch.init(), 2000);
        });
    } else {
        setTimeout(() => fullyAutomatedSearch.init(), 2000);
    }
    
    console.log('✅ 완전 자동화 검색 시스템 로드됨');
}
