// app.js 파일 생성
// 왜 Node.js를 사용하나요?
// - JavaScript로 서버를 만들 수 있음
// - 가볍고 빠름
// - 많은 회사에서 사용 (Netflix, LinkedIn, Uber 등)

const express = require("express"); // 웹 서버를 쉽게 만들어주는 라이브러리
const app = express();
const port = 3000; // 3000번 포트 사용 (웹 서버의 문 번호라고 생각하세요)

// 환경변수에서 버전 가져오기
// 왜 환경변수를 사용하나요?
// - 코드 수정 없이 버전을 바꿀 수 있음
// - Docker 빌드 시 자동으로 버전 주입 가능
const version = process.env.APP_VERSION || "v1.0.0";
// process.env.APP_VERSION: Docker가 설정한 버전
// || 'v1.0.0': 없으면 기본값 v1.0.0 사용

// 메인 페이지 라우트
// 왜 HTML을 직접 작성하나요?
// - 별도 파일 없이 간단하게 구현 가능
// - 실습 목적이므로 단순하게 구성
app.get("/", (req, res) => {
  // 브라우저가 / 경로로 요청하면 이 HTML을 응답
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>GitOps Demo - Updated!</title>
        <style>
            body { 
                font-family: Arial;
                text-align: center;
                padding: 50px;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: white;
            }
            .container {
                background: rgba(0,0,0,0.3);
                border-radius: 20px;
                padding: 40px;
                max-width: 700px;
                margin: auto;
            }
            .new-feature {
                background: yellow;
                color: black;
                padding: 20px;
                margin: 20px 0;
                border-radius: 10px;
                font-size: 1.5em;
                animation: blink 1s infinite;
            }
            @keyframes blink {
                50% { opacity: 0.5; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 GitOps Demo App</h1>
            <div>Version: ${version}</div>
            <div>Time: ${new Date().toLocaleString()}</div>
            <div class="new-feature">
                🎉 NEW FEATURE DEPLOYED! 🎉
            </div>
            <p>This was deployed automatically with GitOps!</p>
        </div>
    </body>
    </html>
`);
});

// 헬스체크 엔드포인트
// 왜 필요한가요?
// - Kubernetes가 앱이 정상 작동하는지 주기적으로 확인
// - 비정상이면 자동으로 재시작
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    version: version,
    uptime: process.uptime(), // 앱이 실행된 시간(초)
  });
});

// 서버 시작
// 0.0.0.0을 사용하는 이유:
// - localhost(127.0.0.1)만 사용하면 컨테이너 외부에서 접속 불가
// - 0.0.0.0은 모든 네트워크 인터페이스에서 접속 허용
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 서버 시작! http://localhost:${port}`);
  console.log(`📌 버전: ${version}`);
});

// Graceful Shutdown 처리
// 왜 필요한가요?
// - Kubernetes가 Pod를 종료할 때 진행 중인 요청을 안전하게 처리
// - 데이터 손실 방지
process.on("SIGTERM", () => {
  console.log("종료 신호 받음. 안전하게 종료합니다...");
  process.exit(0);
});
