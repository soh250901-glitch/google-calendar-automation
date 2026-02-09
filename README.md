# 📅 Google Calendar API Test Automation Project

> **Playwright와 GitHub Actions를 활용한 구글 캘린더 API 자동화 테스트 및 CI/CD 구축**

이 프로젝트는 구글 캘린더 API의 일정 생성, 수정, 삭제 과정을 자동화하고, 이를 GitHub Actions와 연동하여 안정적인 CI(지속적 통합) 환경을 구축한 QA 엔지니어링 프로젝트입니다.

---

## 🛠 Tech Stack

| 분류 | 기술 도구 | 활용 목적 |
| :--- | :--- | :--- |
| **Language** | JavaScript (Node.js) | 테스트 스크립트 작성 및 비동기 로직 처리 |
| **Framework** | Playwright | API 테스트 수행 및 HTML 리포트 생성 |
| **CI/CD** | GitHub Actions | 테스트 자동화 파이프라인 구축 및 정기 실행 |
| **Auth** | OAuth 2.0 | Google API 보안 인증 및 토큰 자동 갱신 |
| **Monitoring** | Slack | 테스트 결과 실시간 알림 시스템 구축 |

---

## 🌟 Key Features

### 1. Data-Driven Testing (DDT)
* 하나의 테스트 코드로 다양한 데이터 셋(특수문자 포함, 최대 글자 수 제목 등)을 반복 검증하여 테스트 커버리지를 효율적으로 확보했습니다.

### 2. Automated Auth Workflow
* `auth.setup.ts`를 구현하여 테스트 실행 전 자동으로 Access Token을 갱신(Refresh)하도록 설계했습니다. 이를 통해 로컬 및 CI 환경에서 인증 중단 없는 테스트가 가능합니다.

### 3. CI/CD & Real-time Monitoring
* **GitHub Actions**: 매일 정해진 시간(KST 오전 9시)에 클라우드 환경에서 자동 테스트를 수행합니다.
* **Slack Integration**: 테스트 성공/실패 여부를 슬랙 채널로 즉시 전송하여 이슈 대응 속도를 높였습니다.



---

## 📂 Project Structure

```text
.
├── .github/workflows/      # CI 설정 파일 (playwright.yml)
├── .auth/                  # 인증 토큰 저장 경로 (보안을 위해 Git 제외)
├── tests/
│   ├── auth.setup.ts       # OAuth 2.0 인증 자동화 로직
│   └── calendar.spec.ts    # 캘린더 API DDT 테스트 스크립트
├── playwright.config.ts    # 프로젝트 전역 설정
└── package.json            # 의존성 관리

```
---

🔧 Setup & Configuration
Environment Variables (GitHub Secrets)
보안을 위해 아래 변수들을 GitHub Secrets에 등록하여 관리합니다.

CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, SLACK_WEBHOOK_URL

📈 Troubleshooting (성장 기록)
1. CI 환경 내 파일 참조 시점 이슈 (ENOENT)
* 문제: GitHub Actions의 테스트 발견(Discovery) 단계에서 아직 생성되지 않은 인증 파일을 참조하여 에러 발생.

* 해결: 파일을 읽는 로직을 전역이 아닌 test.beforeEach 블록으로 이동시켜, 인증 절차가 완료된 후 파일을 읽도록 실행 시점을 제어했습니다.

2. Google OAuth 7일 만료 정책 해결
* 문제: 테스트 모드 앱의 리프레시 토큰이 7일 후 무효화되는 현상.

* 해결: Google Cloud Console에서 앱 게시 상태를 **'Production'**으로 변경하고, 권한 범위를 최소화하여 토큰의 영속성을 확보했습니다.

3. GitHub Secrets 보안 설정 및 권한 관리
* 문제: invalid_client 에러로 인한 인증 실패.

* 해결: 깃허브 자격 증명 관리자 초기화 및 Secrets 값 재설정을 통해 보안과 환경 변수 주입 프로세스를 정상화했습니다.