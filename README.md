# Pingo

## 프로젝트 구조

```
pingo/
├── apps/
│   ├── app/                          # React Native (Android)
│   │   └── src/
│   │       ├── api/                  # Axios 클라이언트 + 엔드포인트별 API 함수
│   │       │   └── endpoints/        # auth, transactions, categories, ...
│   │       ├── config/               # 환경 변수 (react-native-config)
│   │       ├── constants/            # API 엔드포인트 상수, Query Key
│   │       ├── hooks/
│   │       │   └── queries/          # 공용 TanStack Query 훅
│   │       ├── navigation/           # Root / Auth / Tab / Stack 네비게이터
│   │       ├── providers/            # QueryClient, ThemeProvider 래퍼
│   │       ├── screens/
│   │       │   ├── splash/
│   │       │   ├── auth/             # Login, ApprovalRequest, ApprovalPending, DeviceChange
│   │       │   ├── home/
│   │       │   ├── history/          # HistoryScreen, TransactionEditScreen
│   │       │   ├── stats/
│   │       │   ├── category/         # CategoryScreen, CategoryEditScreen
│   │       │   ├── more/
│   │       │   │   ├── fixedExpenses/
│   │       │   │   └── myInfo/
│   │       │   └── admin/            # UserManagement, ApprovalManagement
│   │       ├── store/                # Zustand 전역 상태 (authStore)
│   │       ├── theme/                # 토큰(colors, spacing, typography), 라이트/다크 테마
│   │       ├── types/                # 네비게이션 타입
│   │       └── utils/                # storage(MMKV), device, notification
│   │
│   └── api/                          # NestJS REST API
│       ├── src/
│       │   ├── auth/                 # JWT 인증, 가드, 전략, DTO
│       │   ├── approvals/            # 가입 승인 관리
│       │   ├── categories/           # 카테고리 CRUD
│       │   ├── transactions/         # 소비 내역 CRUD
│       │   ├── fixed-expenses/       # 고정 지출 CRUD + 스케줄러
│       │   ├── stats/                # 통계 집계
│       │   ├── devices/              # 기기 등록 / 검증
│       │   ├── common/               # 전역 필터, 가드, 인터셉터, 데코레이터
│       │   ├── logger/               # Winston 로거
│       │   └── prisma/               # PrismaService
│       └── prisma/
│           ├── schema.prisma
│           ├── seed.ts
│           └── migrations/
│
└── packages/                         # 공유 패키지 (예정)
```

---

## 스택

### 앱 (React Native)

| 분류 | 기술 |
|------|------|
| 프레임워크 | React Native 0.85 (New Architecture) |
| 언어 | TypeScript |
| 상태관리 | Zustand (클라이언트), TanStack Query (서버) |
| 서버통신 | Axios + JWT 자동 갱신 인터셉터 |
| 로컬저장 | MMKV (react-native-mmkv v4 / NitroModules) |
| 차트 | react-native-gifted-charts |
| 알림 | notifee |
| 카드알림 감지 | react-native-android-notification-listener |
| 고유 기기 ID | react-native-device-info |
| 환경변수 | react-native-config |
| 네비게이션 | React Navigation (Stack + BottomTab) |

### 서버 (NestJS)

| 분류 | 기술 |
|------|------|
| 프레임워크 | NestJS 10 |
| 언어 | TypeScript |
| ORM | Prisma 7 |
| 데이터베이스 | PostgreSQL 16 |
| 인증 | JWT (Access + Refresh Token, Passport) |
| 유효성 검사 | class-validator / class-transformer |
| API 문서 | Scalar (Swagger로 스펙 생성 → Scalar UI로 렌더링) |
| 로깅 | Winston + winston-daily-rotate-file |
| 스케줄러 | @nestjs/schedule (고정 지출 자동 생성) |
| 보안 | Helmet |

### 인프라

| 분류 | 기술 |
|------|------|
| 컨테이너 | Docker + Docker Compose |
| 리버스 프록시 | Nginx 1.27 |
| 외부 터널 | Cloudflare Tunnel (cloudflared) |

---

## API 문서

| 환경 | URL |
|------|-----|
| 로컬 | http://localhost:3000/docs |
| JSON | http://localhost:3000/docs/json |

모든 API 엔드포인트는 `/api/v1/` 로 시작합니다.

---

## 아키텍처

```
React Native → HTTPS → Cloudflare Tunnel → Nginx → NestJS API → PostgreSQL
```

---

## 시작하기

### 요구 사항

- Node.js 22+
- pnpm 9.0.0
- Docker Desktop
- Android Studio (앱 빌드 및 에뮬레이터)

### 1. 의존성 설치

```bash
pnpm install
```

`postinstall` 훅으로 `prisma generate`가 자동 실행됩니다.

### 2. 환경 변수 설정

환경 변수는 루트(API/인프라)와 앱(React Native)으로 분리해서 관리한다.  
`react-native-config`가 앱 `.env.*`의 모든 변수를 APK에 직접 번들링하기 때문에, APK를 압축 해제하면 누구든 그 값을 읽을 수 있다. 루트 `.env`의 DB 비밀번호·JWT 키·관리자 계정이 노출되면 안 되므로 앱 전용 파일에는 공개해도 무방한 `API_URL`만 둔다.

#### 루트 `.env` — API 서버 / 인프라

```bash
cp .env.example .env
```

| 항목 | 설명 |
|------|------|
| `POSTGRES_USER` | DB 사용자명 |
| `POSTGRES_PASSWORD` | DB 비밀번호 |
| `POSTGRES_DB` | DB 이름 |
| `DATABASE_URL` | `postgresql://<USER>:<PASSWORD>@localhost:5432/<DB>` (로컬용, `postgres` 아님) |
| `JWT_SECRET` | JWT 액세스 토큰 서명 키 |
| `JWT_REFRESH_SECRET` | JWT 리프레시 토큰 서명 키 |
| `ADMIN_EMAIL` | 초기 관리자 계정 이메일 |
| `ADMIN_PASSWORD` | 초기 관리자 계정 비밀번호 |

#### 앱 `.env.*` — React Native

```bash
cp apps/app/.env.example apps/app/.env.development
cp apps/app/.env.example apps/app/.env.production
```

| 파일 | 용도 |
|------|------|
| `.env.development` | 에뮬레이터 / 개발 |
| `.env.production` | 릴리즈 빌드 |

| 항목 | 설명 |
|------|------|
| `API_URL` | API 서버 주소 (에뮬레이터: `http://10.0.2.2:3000`) |

> `.env.*` 파일은 gitignore 처리되어 있습니다.

### 3. 컨테이너 실행

```bash
pnpm infra:up
```

최초 실행 시 Docker 이미지 빌드가 진행됩니다. 이후부터는 바로 실행됩니다.

### 4. DB 마이그레이션

컨테이너가 모두 healthy 상태가 된 후 실행:

```bash
pnpm db:migrate
```

### 5. Admin 계정 생성

```bash
pnpm db:seed
```

`.env`의 `ADMIN_EMAIL` / `ADMIN_PASSWORD`로 관리자 계정이 생성됩니다.  
이미 존재하는 계정이면 건너뜁니다.

### 6. 동작 확인

- API Health: http://localhost:3000/health
- API 문서: http://localhost:3000/docs

---

## 주요 명령어

### 인프라

```bash
pnpm infra:up        # 컨테이너 백그라운드 실행
pnpm infra:up-dev    # 컨테이너 포그라운드 실행 (로그 출력)
pnpm infra:down      # 컨테이너 종료
pnpm infra:build     # 이미지 빌드
pnpm infra:logs      # 로그 스트리밍
pnpm infra:restart   # 컨테이너 재시작
```

### DB

```bash
pnpm db:migrate      # 마이그레이션 실행 (테이블 생성)
pnpm db:seed         # Admin 계정 생성
pnpm db:generate     # Prisma Client 재생성
```

### 앱

```bash
pnpm app:start                        # Metro 번들러 실행
pnpm app:android                      # 에뮬레이터 실행 (개발 환경)
pnpm --filter @pingo/app android:prod # 프로덕션 환경으로 실행
```

---

## Cloudflare Tunnel 설정

React Native 앱에서 HTTPS로 접근하기 위한 외부 터널 설정입니다.  
Cloudflare에 등록된 도메인이 필요합니다.

### 1. cloudflared 설치

```bash
brew install cloudflared
```

### 2. Cloudflare 로그인

```bash
cloudflared tunnel login
```

브라우저가 열리면 Cloudflare 계정으로 로그인 후 도메인 선택.  
`~/.cloudflared/cert.pem` 파일이 생성됩니다.

### 3. 터널 생성

```bash
cloudflared tunnel create pingo
```

터널 ID와 `<터널ID>.json` credentials 파일이 `~/.cloudflared/`에 생성됩니다.

### 4. 파일 복사

```bash
cp ~/.cloudflared/cert.pem ./cloudflared/
cp ~/.cloudflared/<터널ID>.json ./cloudflared/
```

### 5. config.yml 수정

`cloudflared/config.yml`에서 터널 ID와 도메인 교체:

```yaml
tunnel: <터널ID>
credentials-file: /etc/cloudflared/<터널ID>.json

ingress:
  - hostname: api.yourdomain.com
    service: http://nginx:80
  - service: http_status:404
```

### 6. DNS 등록

```bash
cloudflared tunnel route dns pingo api.yourdomain.com
```

### 7. docker-compose.yml에서 cloudflared 주석 해제

`docker-compose.yml`의 `cloudflared` 서비스 주석을 풀고:

```bash
pnpm infra:down && pnpm infra:up
```

---

## 앱 실행 환경별 API URL

| 환경 | API_URL | 비고 |
|------|---------|------|
| 에뮬레이터 | `http://10.0.2.2:3000` | 로컬 PC localhost |
| 실기기 + USB | `http://localhost:3000` | `adb reverse tcp:3000 tcp:3000` 먼저 실행 |
| 실기기 + 핫스팟 | `http://<PC-IP>:3000` | PC의 로컬 IP 직접 입력 |

---

## 문구 관리 원칙

### 에러 메시지
사용자에게 보여주는 에러 문구는 **백엔드에서 단독 관리**한다.

- 정의 위치: `apps/api/src/common/constants/messages.ts`
- 프론트는 서버 응답의 `message` 필드를 그대로 표시하며 별도로 재정의하지 않는다.

### UI 문구
레이블, 버튼, 플레이스홀더 등 화면 구성 문구는 **프론트에서 단독 관리**한다.

- 정의 위치: `apps/app/src/constants/strings.ts`
- 에러 메시지를 이 파일에 추가하지 않는다.

### DTO 유효성 메시지
class-validator 기본 영어 메시지를 사용하지 않고 **한글로 관리**한다.

- 정의 위치: `apps/api/src/common/constants/validation-messages.ts`
- 모든 DTO 데코레이터에 `{ message: VM.xxx }` 형태로 적용한다.

---

## 에러 처리 흐름

```
화면 catch (error)
  └─ handleApiError(error)         apps/app/src/api/errorHandler.ts
       ├─ parseApiError()           errorCode, message 추출
       └─ switch(errorCode)
            ├─ 화면 이동 케이스      navigationRef 사용 (DeviceChange, ApprovalPending 등)
            ├─ 토스트 케이스         Toast.show({ text1: message })
            └─ default              Alert.alert('오류', message)
```

서버 에러 응답 형태:
```json
{ "success": false, "errorCode": "INVALID_CREDENTIALS", "message": "이메일 또는 비밀번호가 올바르지 않습니다." }
```

에러 코드 목록 및 설명: `apps/api/src/common/constants/error-codes.ts`

### 화면별 동작 override

글로벌 동작 대신 화면 수준에서 특정 에러 코드의 처리를 바꿔야 할 때는 `handleApiError` 두 번째 인자로 `overrides` 를 전달한다.

```ts
handleApiError(error, {
  [ApiErrorCode.VALIDATION_ERROR]: () =>
    Toast.show({ type: 'error', text1: strings.login.invalidInput }),
})
```

- override 에 없는 코드는 `errorHandler.ts` 의 기본 switch 가 처리한다.
- override 용 문구는 `strings.ts` 에 추가한다 (UI 결정이므로 FE 관리).
- 예시: 로그인 화면에서 유효성 오류와 자격증명 오류를 동일한 generic 메시지로 통합.

---

## Notes

### `DATABASE_URL` — 로컬 vs Docker

`.env`의 `DATABASE_URL`은 `localhost`를 사용한다.

```
DATABASE_URL=postgresql://pingo:password@localhost:5432/pingo
```

`prisma migrate`, `prisma seed` 같은 로컬 명령어는 Docker 외부에서 실행되므로 `localhost:5432`로 접근해야 한다. Docker api 컨테이너는 `docker-compose.yml`의 `environment`에서 `postgres:5432`로 덮어쓰므로 `.env`에 `localhost`로 설정해도 컨테이너 내부 동작에는 영향 없다.

---

### `.npmrc` — `shamefully-hoist=true`

pnpm은 기본적으로 패키지를 symlink 구조로 격리해서 설치한다. 이 구조에서는 VS Code 등 IDE의 TypeScript 서버가 symlink를 따라가지 못해 `@prisma/client`, `@prisma/adapter-pg` 같은 패키지를 찾지 못하고 `TS2307` 에러가 발생한다.

`shamefully-hoist=true`를 설정하면 모든 패키지를 루트 `node_modules`에 flat하게 설치해 IDE가 정상적으로 타입을 인식한다. 빌드 및 런타임 동작에는 영향 없음.
