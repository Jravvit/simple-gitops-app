// app.js 파일 생성
// 왜 Node.js를 사용하나요?
// - JavaScript로 서버를 만들 수 있음
// - 가볍고 빠름
// - 많은 회사에서 사용 (Netflix, LinkedIn, Uber 등)

const express = require('express');  // 웹 서버를 쉽게 만들어주는 라이브러리
const app = express();
const port = 3000;  // 3000번 포트 사용 (웹 서버의 문 번호라고 생각하세요)

// 환경변수에서 버전 가져오기
// 왜 환경변수를 사용하나요?
// - 코드 수정 없이 버전을 바꿀 수 있음
// - Docker 빌드 시 자동으로 버전 주입 가능
const version = process.env.APP_VERSION || 'v1.0.0';
// process.env.APP_VERSION: Docker가 설정한 버전
// || 'v1.0.0': 없으면 기본값 v1.0.0 사용

// 메인 페이지 라우트
// 왜 HTML을 직접 작성하나요?
// - 별도 파일 없이 간단하게 구현 가능
// - 실습 목적이므로 단순하게 구성
app.get('/', (req, res) => {
    // 브라우저가 / 경로로 요청하면 이 HTML을 응답
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>GitOps Demo</title>
            <style>
                /* CSS로 페이지를 예쁘게 꾸미기 */
                body { 
                    font-family: Arial, sans-serif; 
                    text-align: center;
                    padding: 50px;
                    /* 그라데이션 배경 - 시각적 효과 */
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container {
                    background: rgba(255,255,255,0.1);  /* 반투명 배경 */
                    border-radius: 20px;  /* 둥근 모서리 */
                    padding: 30px;
                    max-width: 600px;
                    margin: 0 auto;  /* 가운데 정렬 */
                }
                h1 { font-size: 3em; }
                .version { 
                    font-size: 2em; 
                    color: #FFD700;  /* 금색 */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 GitOps Demo App</h1>
                <div class="version">Version: ${version}</div>
                <div>현재 시간: ${new Date().toLocaleString('ko-KR')}</div>
                <p>이 앱은 GitOps로 자동 배포됩니다!</p>
            </div>
        </body>
        </html>
    `);
});

// 헬스체크 엔드포인트
// 왜 필요한가요?
// - Kubernetes가 앱이 정상 작동하는지 주기적으로 확인
// - 비정상이면 자동으로 재시작
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        version: version,
        uptime: process.uptime()  // 앱이 실행된 시간(초)
    });
});

// 서버 시작
// 0.0.0.0을 사용하는 이유:
// - localhost(127.0.0.1)만 사용하면 컨테이너 외부에서 접속 불가
// - 0.0.0.0은 모든 네트워크 인터페이스에서 접속 허용
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 서버 시작! http://localhost:${port}`);
    console.log(`📌 버전: ${version}`);
});

// Graceful Shutdown 처리
// 왜 필요한가요?
// - Kubernetes가 Pod를 종료할 때 진행 중인 요청을 안전하게 처리
// - 데이터 손실 방지
process.on('SIGTERM', () => {
    console.log('종료 신호 받음. 안전하게 종료합니다...');
    process.exit(0);
});
