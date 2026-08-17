# Pingo

카드 결제 알림을 자동으로 감지해 지출 내역을 빠르게 등록하는 **안드로이드 전용 가계부 앱**입니다.
카드사 앱 알림이 오면 Pingo가 이를 자동 파싱해 금액·가맹점·결제수단을 폼에 채워주므로, 별도 입력 없이 탭 한 번으로 내역을 등록할 수 있습니다.

---

## 메인 기능 — 카드 알림 자동 감지

```
카드사 앱 알림 수신
  └─ HeadlessTask (index.js)
       ├─ 카드 승인 알림인지 판별 (isCardUsageNotification)
       ├─ MMKV에 저장 + notificationId 발급 (saveDetectedNotification)
       ├─ 3일 뒤 예약 알림 등록 (schedulePendingReminder — Android AlarmManager)
       └─ 즉시 알림 표시, data.notificationId 포함 (displayDetectedNotification)

사용자가 알림 탭
  ├─ [포그라운드] notifee.onForegroundEvent → TransactionEditScreen으로 이동
  ├─ [백그라운드] onBackgroundEvent → 앱 전환 후 getInitialNotification이 처리
  └─ [Killed]    getInitialNotification → MMKV에 notificationId 저장
       └─ 인증 완료 후 SplashScreen.tsx / useLogin.tsx 에서 꺼내 이동

TransactionEditScreen (notificationId 파라미터)
  ├─ 알림 파싱 → 금액, 가맹점명, 카드사, 끝 4자리, 할부, 날짜 자동 세팅
  ├─ 결제수단 자동 매칭 (카드사 + 끝 4자리 → paymentMethods 비교)
  ├─ 원문 텍스트 상단 배너로 표시
  ├─ useCategoryRecommendation() — 동일 가맹점 최근 10건 기반 추천 카테고리 자동 적용
  └─ 등록 완료
       ├─ markAsRegistered() — MMKV 삭제 + 예약 알림 취소
       ├─ 미등록 알림 남아있으면 → "다음 내역 등록" 컨펌
       └─ 없으면 → PendingNotificationsScreen (미등록 목록)
```

### 카드 취소 알림 감지

카드사 앱의 취소 알림도 별도로 감지합니다.

```
카드 취소 알림 수신
  └─ HeadlessTask
       ├─ isCancelNotification() — 취소 알림 판별
       ├─ saveCancelNotification() — cancelNotificationStore에 저장
       └─ displayCancelNotification() — 즉시 알림 표시, data.cancelNotificationId 포함

사용자가 취소 알림 탭
  └─ CancelledTransactionSearchScreen → 취소된 카드번호/금액으로 원 거래 내역 검색
```

### 알림 데이터 생명주기

| 이벤트 | 처리 |
|--------|------|
| 알림 감지 즉시 | MMKV 저장, 3일 뒤 예약 알림 등록 (AlarmManager) |
| 앱 실행 시 `load()` | `filterExpired()` — 7일 지난 항목 일괄 제거 |
| 3일 미등록 | AlarmManager가 직접 발송 (앱 종료 상태에서도 동작) |
| 등록 완료 즉시 | MMKV 삭제, 예약 알림 취소 |

---

## 아키텍처

```
React Native (Android) → HTTPS → Cloudflare Tunnel → Nginx → NestJS API → PostgreSQL
```

---

## 기술 스택

### 앱 (React Native)

| 분류 | 라이브러리 | 버전 | 용도 |
|------|-----------|------|------|
| 런타임 | React Native | 0.85.3 | Android 전용, New Architecture |
| 언어 | TypeScript | ^5.8.3 | |
| 전역 상태 | Zustand | ^5.0.13 | 인증 상태, 알림 로그 등 클라이언트 상태 |
| 서버 상태 | TanStack Query | ^5.100.10 | API 캐싱·동기화 |
| HTTP | Axios | ^1.16.0 | API 통신, JWT 자동 갱신 인터셉터 |
| 네비게이션 | React Navigation | ^7.x | Stack + Bottom Tabs |
| 로컬 스토리지 | react-native-mmkv | ^4.3.1 | MMKV 키-값 스토리지 (refresh token, 알림 데이터 등) |
| 환경변수 | react-native-config | ^1.6.1 | `.env.*` 파일 로드 (APK에 번들링) |
| 기기 정보 | react-native-device-info | ^15.0.2 | 기기 고유 UID (기기 인증용) |
| 차트 | react-native-gifted-charts | ^1.4.76 | 통계 화면 바/도넛 차트 |
| 알림 | @notifee/react-native | ^9.1.8 | 앱 알림 표시, AlarmManager 예약 알림 |
| 알림 감지 | react-native-android-notification-listener | ^5.0.1 | 시스템 알림 수신 (HeadlessTask) |
| 스플래시 | react-native-bootsplash | ^7.3.1 | 부트 스플래시 화면 |
| SVG | react-native-svg | ^15.15.5 | 벡터 아이콘 렌더링 |
| 네이티브 모듈 | react-native-nitro-modules | ^0.35.6 | MMKV NitroModules 고성능 브리지 |
| 안전 영역 | react-native-safe-area-context | ^5.5.2 | SafeAreaView |

### 서버 (NestJS)

| 분류 | 라이브러리 | 버전 | 용도 |
|------|-----------|------|------|
| 프레임워크 | NestJS | ^10.x | HTTP REST API |
| 언어 | TypeScript | ^5.7.3 | |
| ORM | Prisma | ^7.0.0 | 타입 안전 DB 접근 |
| DB 드라이버 | pg (PrismaPg 어댑터) | ^8.13.3 | PostgreSQL 커넥션 풀 |
| 인증 | @nestjs/jwt + passport-jwt | ^10.x | Access / Refresh JWT 전략 |
| 유효성 검사 | class-validator + class-transformer | ^0.14 / ^0.5 | DTO 검증 |
| 스케줄러 | @nestjs/schedule | ^4.1.2 | 고정 지출 자동 생성 Cron |
| API 문서 | @nestjs/swagger + @scalar/nestjs-api-reference | ^8.x | Swagger 스펙 생성 + Scalar UI |
| 보안 | helmet | ^8.0.0 | HTTP 보안 헤더 |
| 암호화 | bcryptjs | ^2.4.3 | 비밀번호 해싱 |
| 로깅 | winston + winston-daily-rotate-file | ^3.x | 파일 로테이션 로그 |
| 환경변수 | @nestjs/config | ^3.3.0 | `.env` 로드 |

### 인프라

| 분류 | 기술 |
|------|------|
| 컨테이너 | Docker + Docker Compose |
| 리버스 프록시 | Nginx 1.27 |
| 외부 터널 | Cloudflare Tunnel (cloudflared) |
| DB | PostgreSQL 16 |

---

## 프로젝트 구조

```
pingo/
├── apps/
│   ├── app/                          # React Native (Android)
│   │   └── src/
│   │       ├── api/
│   │       │   ├── client.ts          # Axios 인스턴스 (JWT 인터셉터)
│   │       │   ├── errors.ts          # ApiErrorCode 상수 + parseApiError
│   │       │   ├── errorHandler.ts    # errorCode → 동작 매핑 (에러 처리 진입점)
│   │       │   └── endpoints/         # 도메인별 API 함수 (auth, transactions, ...)
│   │       ├── config/                # 환경변수 래퍼 (react-native-config)
│   │       ├── constants/
│   │       │   ├── endpoints.ts       # API 엔드포인트 상수
│   │       │   ├── queryKeys.ts       # TanStack Query 키 상수
│   │       │   ├── screens.ts         # 네비게이션 스크린 이름 상수
│   │       │   └── strings.ts         # UI 문구 상수
│   │       ├── components/
│   │       │   ├── containers/        # FullScreenContainer, SkeletonBox 등
│   │       │   └── icons/
│   │       ├── hooks/
│   │       │   └── queries/           # 여러 화면 공통 Query/Mutation 훅
│   │       ├── navigation/            # Root / Auth / Tab / Stack 네비게이터
│   │       ├── providers/             # QueryClient, ThemeProvider 래퍼
│   │       ├── screens/
│   │       │   ├── splash/
│   │       │   ├── auth/              # Login, ApprovalRequest, ApprovalPending, DeviceChange, RejectedAccount
│   │       │   │   └── hooks/         # useLogin, useApprovalRequest, useLoginForm
│   │       │   ├── home/
│   │       │   ├── history/           # HistoryScreen, TransactionEditScreen
│   │       │   │   └── hooks/         # useCategoryRecommendation 등
│   │       │   ├── stats/
│   │       │   ├── category/          # CategoryScreen, CategoryEditScreen
│   │       │   ├── more/
│   │       │   │   ├── fixedExpenses/
│   │       │   │   ├── myInfo/
│   │       │   │   └── pendingNotifications/   # 미등록 알림 목록
│   │       │   └── admin/             # 어드민 전용 — 기능별 서브폴더
│   │       │       ├── types.ts
│   │       │       ├── approvalManagement/     # 가입 승인 관리
│   │       │       ├── userManagement/         # 유저 관리
│   │       │       └── adminMore/
│   │       ├── store/
│   │       │   ├── authStore.ts            # Zustand 인증 상태
│   │       │   ├── notificationLogStore.ts # MMKV 기반 카드 승인 알림 스토어
│   │       │   └── cancelNotificationStore.ts  # MMKV 기반 카드 취소 알림 스토어
│   │       ├── theme/                 # 토큰(colors, spacing, typography), 라이트/다크 테마
│   │       ├── types/
│   │       │   └── navigation.ts      # 네비게이션 ParamList 타입
│   │       └── utils/
│   │           ├── cardNotificationParser.ts  # 카드 알림 판별 + 파싱
│   │           ├── notification.ts            # 알림 표시, 예약 알림 등록/취소
│   │           ├── storage.ts                 # MMKV 래퍼
│   │           └── device.ts                  # 기기 UID 조회
│   │
│   └── api/                          # NestJS REST API
│       ├── src/
│       │   ├── auth/                  # JWT 인증, 가드, 전략, DTO
│       │   ├── approvals/             # 가입 승인 관리
│       │   ├── categories/            # 카테고리 CRUD
│       │   ├── transactions/          # 소비 내역 CRUD
│       │   ├── fixed-expenses/        # 고정 지출 CRUD + 스케줄러
│       │   ├── stats/                 # 통계 집계
│       │   ├── users/                 # 사용자 관리
│       │   ├── payment-methods/       # 결제수단 CRUD
│       │   ├── common/
│       │   │   ├── constants/
│       │   │   │   ├── messages.ts          # 에러·응답 문구
│       │   │   │   ├── error-codes.ts       # ApiErrorCode 정의
│       │   │   │   └── validation-messages.ts  # DTO 유효성 메시지 (한글)
│       │   │   ├── filters/           # HttpExceptionFilter
│       │   │   ├── guards/            # RolesGuard
│       │   │   ├── interceptors/      # LoggingInterceptor
│       │   │   └── types/
│       │   │       └── response.type.ts  # BasicResponse, ListResponse, PageResponse
│       │   ├── logger/                # Winston 로거
│       │   ├── scheduler/             # 고정 지출 자동 생성 Cron
│       │   └── prisma/                # PrismaService
│       └── prisma/
│           ├── schema.prisma
│           ├── seed.ts
│           └── migrations/
│
└── packages/                         # 공유 패키지 (예정)
```

---

## API 문서

| 환경 | URL |
|------|-----|
| 로컬 | http://localhost:4000/docs |
| JSON | http://localhost:4000/docs/json |

모든 API 엔드포인트는 `/api/v1/` 로 시작합니다.

---

## 인증 플로우

### 계정 등록 및 승인

Pingo는 관리자가 승인한 사용자만 접근할 수 있습니다.

```
회원가입 요청
  └─ 이메일 + 비밀번호 + 기기 UID 전송
       └─ approvalStatus: PENDING
            └─ 관리자 승인 화면에서 승인/거절
                 ├─ APPROVED → 앱 정상 사용
                 └─ REJECTED → RejectedAccountScreen 표시
```

### JWT 인증 (Access + Refresh)

- **Access Token**: 짧은 유효기간, 모든 API 요청 헤더에 포함
- **Refresh Token**: 30일 유효, MMKV에 저장, `rolling` 방식 — 앱을 켤 때마다 30일 연장
- 앱 시작 시 `SplashScreen`이 refresh token으로 자동 로그인을 시도하고 성공하면 30일 연장

### 기기 인증

- 로그인/가입 시 `react-native-device-info`로 기기 고유 UID를 서버에 등록
- 자동 로그인 시 현재 기기 UID와 서버 저장 UID를 비교
- 기기가 다르면 `DeviceChangeScreen`으로 이동해 기기 변경 확인 절차 진행

### 역할

| 역할 | 접근 |
|------|------|
| `USER` | 가계부 기능 전체 (내역, 통계, 카테고리, 결제수단, 고정 지출) |
| `ADMIN` | 가입 승인 관리, 유저 관리 (가계부 기능 없음) |

---

## 시작하기

### 요구 사항

- Node.js 22+
- pnpm 9+
- Docker Desktop
- Android Studio (앱 빌드 및 에뮬레이터)

### 1. 의존성 설치

```bash
pnpm install
```

`postinstall` 훅으로 `prisma generate`가 자동 실행됩니다.

### 2. 환경 변수 설정

환경 변수는 루트(API/인프라)와 앱(React Native)으로 분리해서 관리합니다.
`react-native-config`는 앱 `.env.*`의 모든 변수를 APK에 직접 번들링하므로, 앱 전용 파일에는 공개해도 무방한 `API_URL`만 둡니다.

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
| `API_URL` | API 서버 주소 (에뮬레이터: `http://10.0.2.2:4000`) |

> `.env.*` 파일은 gitignore 처리되어 있습니다.

### 3. 컨테이너 실행

```bash
pnpm infra:up
```

최초 실행 시 Docker 이미지 빌드가 진행됩니다.

### 4. DB 마이그레이션

컨테이너가 모두 healthy 상태가 된 후 실행:

```bash
pnpm db:migrate
```

### 5. Admin 계정 생성

```bash
pnpm db:seed
```

`.env`의 `ADMIN_EMAIL` / `ADMIN_PASSWORD`로 관리자 계정이 생성됩니다. 이미 존재하는 계정이면 건너뜁니다.

### 6. 앱 실행

```bash
pnpm app:android
```

### 7. 동작 확인

- API Health: http://localhost:4000/health
- API 문서: http://localhost:4000/docs

---

## 앱 실행 환경별 API URL

| 환경 | API_URL | 비고 |
|------|---------|------|
| 에뮬레이터 | `http://10.0.2.2:4000` | 로컬 PC localhost |
| 실기기 + USB | `http://localhost:4000` | `adb reverse tcp:4000 tcp:4000` 먼저 실행 |
| 실기기 + 핫스팟 | `http://<PC-IP>:4000` | PC의 로컬 IP 직접 입력 |

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
pnpm app:start                         # Metro 번들러 실행
pnpm app:android                       # 에뮬레이터 실행 (개발 환경)
pnpm --filter @pingo/app android:prod  # 프로덕션 환경으로 실행
pnpm app:apk:debug                     # 디버그 APK 빌드
pnpm app:apk:release                   # 릴리즈 APK 빌드
```

### 기타

```bash
pnpm adb:reset   # ADB 서버 재시작
```

---

## 사용 메뉴얼

### 초기 설정

1. **회원가입** — 이메일 + 비밀번호로 가입 요청. 관리자 승인을 받아야 앱을 사용할 수 있습니다.
2. **알림 접근 권한 허용** — 앱 최초 실행 시 "알림 접근 권한" 허용 (설정 → 알림 접근). 카드사 알림 감지에 필수입니다.
3. **카테고리 등록** — 더보기 → 카테고리에서 소비 분류를 설정합니다. 최대 20개까지 등록할 수 있습니다.
4. **결제수단 등록** — 더보기 → 결제수단에서 카드를 등록합니다. 카드사명 + 끝 4자리로 알림 자동 매칭에 사용됩니다.
5. **고정 지출 등록** — 더보기 → 고정 지출에서 월세, 구독료 등 정기 지출을 등록합니다. 매달 지정일에 자동으로 내역이 생성됩니다.

### 카드 알림 자동 등록

1. 카드 결제 시 카드사 앱 알림이 수신됩니다.
2. Pingo 알림이 표시됩니다 — 탭하면 내역 등록 화면으로 이동합니다.
3. 금액, 가맹점명, 결제수단이 자동으로 채워집니다.
4. 이전에 같은 가맹점에서 결제한 적 있으면 추천 카테고리가 자동 적용됩니다.
5. 카테고리, 날짜, 메모를 확인/수정 후 등록합니다.
6. 미처 등록하지 못한 알림은 더보기 → 미등록 내역에서 모아볼 수 있습니다.

### 주요 화면

| 화면 | 설명 |
|------|------|
| 홈 | 이번 달 총 소비, 카테고리별 Top 3, 예산 초과 알림, 최근 거래, 6개월 추이 |
| 내역 | 날짜별 소비 내역 목록. 알림으로 수신된 미확인 내역 직접 등록 가능 |
| 통계 | 기간별·카테고리별 도넛 차트 + 막대 그래프, 지출 상위 10건 |
| 더보기 | 카테고리, 결제수단, 고정 지출, 미등록 알림 목록, 내 정보 |

### 관리자 화면

관리자 계정(`ADMIN` 역할)으로 로그인하면 어드민 전용 화면으로 진입합니다.

| 화면 | 설명 |
|------|------|
| 승인 관리 | 가입 요청 목록 확인, 승인/거절 처리 |
| 유저 관리 | 가입된 사용자 목록, 계정 비활성화 처리 |

---

## 코드 컨벤션

### 문구 관리 원칙

#### 에러 메시지 — 백엔드 단독 관리

- 정의 위치: `apps/api/src/common/constants/messages.ts`
- 프론트는 서버 응답의 `message` 필드를 그대로 표시하며 별도로 재정의하지 않습니다.

#### UI 문구 — 프론트 단독 관리

- 정의 위치: `apps/app/src/constants/strings.ts`
- 레이블, 버튼, 플레이스홀더 등 화면 구성 문구. 에러 메시지는 넣지 않습니다.

#### DTO 유효성 메시지 — 백엔드 단독 관리

- 정의 위치: `apps/api/src/common/constants/validation-messages.ts`
- class-validator 기본 영어 메시지를 사용하지 않고 한글로 관리합니다.
- 모든 DTO 데코레이터에 `{ message: VM.xxx }` 형태로 적용합니다.

### 에러 처리 흐름

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

특정 화면에서 특정 에러의 동작을 재정의해야 할 때:

```ts
handleApiError(error, {
  [ApiErrorCode.VALIDATION_ERROR]: () =>
    Toast.show({ type: 'error', text1: strings.login.invalidInput }),
})
```

### FullScreenContainer

뒤로가기 헤더가 있는 화면에서 콘텐츠를 화면 전체 기준으로 중앙정렬할 때 사용합니다.

- 위치: `apps/app/src/components/containers/FullScreenContainer.tsx`
- React Navigation은 헤더 아래 영역만 화면으로 취급하므로 `flex: 1` + `justifyContent: 'center'`만으로는 헤더 높이만큼 시각적으로 아래로 치우칩니다.
- `FullScreenContainer`는 `position: 'absolute'`로 헤더를 포함한 전체 뷰포트를 커버해 정중앙 배치를 보장합니다.

```tsx
import FullScreenContainer from '@/components/containers/FullScreenContainer'

<FullScreenContainer style={styles.container}>
  {/* 콘텐츠 */}
</FullScreenContainer>
```

### 테마 시스템

라이트/다크 모드를 지원하기 위해 모든 색상·폰트·간격 값은 테마 토큰을 통해 참조합니다.
`palette`(원시값)는 `theme/tokens/colors.ts`에만 존재하며 스타일 코드에서 직접 import하지 않습니다.

#### 스타일 작성 규칙

```ts
// [Screen].styles.ts
import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { flex: 1, backgroundColor: t.colors.background },
  button:     { backgroundColor: t.colors.primary, borderRadius: t.radius.md },
  buttonText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
})
```

```tsx
// [Screen].tsx
import { useMemo } from 'react'
import { useTheme } from '@/theme'
import { makeStyles } from './FooScreen.styles'

export default function FooScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])
}
```

- 색상 하드코딩(`'#FFFFFF'` 등) 금지 — 다크모드 대응 불가합니다.
- 스타일 파일 내에서 `useTheme` 직접 호출 불가 (Hook 규칙 위반) — 반드시 `makeStyles` 함수 형태로 작성합니다.

#### 주요 토큰

| 토큰 | light | dark | 용도 |
|------|-------|------|------|
| `colors.background` | white | gray900 | 화면 배경 |
| `colors.surface` | gray50 | gray800 | 카드 배경 |
| `colors.surfaceVariant` | gray100 | gray700 | 리스트 아이템, 중첩 카드 |
| `colors.border` | gray200 | gray700 | 입력 필드·외곽선 |
| `colors.divider` | gray100 | gray800 | 항목 구분선 |
| `colors.primary` | blue500 | blue500 | 주요 버튼·액센트 |
| `colors.text.primary` | gray900 | white | 본문 텍스트 |
| `colors.text.secondary` | gray500 | gray400 | 보조 텍스트 |
| `colors.text.disabled` | gray400 | gray500 | 비활성·힌트 텍스트 |
| `colors.text.inverse` | white | gray900 | 버튼 위 텍스트 |
| `colors.semantic.error` | red500 | red400 | UI 오류·파괴적 동작 |
| `colors.semantic.errorBackground` | red100 | red900 | 오류 tint 배경 |
| `colors.semantic.success` | green500 | green500 | UI 성공 피드백 |
| `colors.semantic.successBackground` | green100 | green900 | 성공 tint 배경 |
| `colors.semantic.income` | green500 | green500 | 수입 (도메인) |
| `colors.semantic.expense` | red500 | red400 | 지출 (도메인) |

> `semantic.success/error`는 폼 검증·토스트 등 UI 피드백용,
> `semantic.income/expense`는 가계부 금액 표시 전용으로 구분합니다.

---

## 카드 결제 알림 감지 및 등록 플로우 (상세)

### 1단계 — 알림 감지 및 저장

**파일: `apps/app/index.js`**

`react-native-android-notification-listener`가 등록한 HeadlessTask. 기기에 알림이 수신될 때마다 앱 상태(포그라운드/백그라운드/종료)와 무관하게 호출됩니다.

- **`isCardUsageNotification(title, text)`** (`utils/cardNotificationParser.ts`)
  제목에 `(1234) 승인` 패턴, 본문에 금액 패턴이 있으면 카드 승인 알림으로 판별합니다.
  제목에 `취소` 또는 `거절`이 포함된 알림은 제외합니다.

- **`saveDetectedNotification(notification)`** (`store/notificationLogStore.ts`)
  알림 데이터를 MMKV에 저장하고 고유 `notificationId`를 반환합니다.
  id 형식: `` `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` ``
  저장 포맷:
  ```ts
  {
    id:    string   // 고유 식별자
    app:   string   // 발신 앱 패키지명
    title: string   // 알림 제목
    text:  string   // 알림 본문
    time:  string   // 감지 시각 (ms 문자열)
    raw:   string   // 원본 JSON 문자열
  }
  ```

- **`schedulePendingReminder(notificationId)`** (`utils/notification.ts`)
  Notifee `TimestampTrigger`로 3일 뒤 예약 알림을 등록합니다.
  내부적으로 Android AlarmManager를 사용하므로 앱이 완전히 종료된 상태에서도 OS가 직접 발송합니다.

- **`displayDetectedNotification(app, text, notificationId)`** (`utils/notification.ts`)
  즉시 알림을 표시합니다. `data.notificationId`를 포함해 탭 시 App.tsx가 어떤 알림인지 식별합니다.

---

### 2단계 — 알림 탭 → 등록 화면 이동

**파일: `apps/app/App.tsx`**

앱 상태별로 세 가지 경로로 처리됩니다.

#### 포그라운드 (앱이 열린 상태)

```ts
notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.PRESS && detail.pressAction?.id === 'pending-notifications') {
    const notificationId = detail.notification?.data?.notificationId
    if (notificationId) navigateToTransactionEdit(notificationId)
  }
})
```

#### 백그라운드 (앱이 실행 중이나 화면에 없는 상태)

`notifee.onBackgroundEvent`가 탭 이벤트를 수신하면 앱이 포그라운드로 전환됩니다.
전환 직후 `getInitialNotification()`이 이를 잡아 포그라운드와 동일하게 처리합니다.

#### Killed (앱이 완전히 종료된 상태)

```ts
const initial = await notifee.getInitialNotification()
if (initial?.pressAction?.id === 'pending-notifications') {
  const notificationId = initial.notification?.data?.notificationId
  storage.set(StorageKeys.PENDING_DEEPLINK, notificationId ?? '')
}
```

앱이 종료 상태에서 알림을 탭하면 앱이 새로 실행되고 인증 흐름이 먼저 진행됩니다.
`notificationId`를 MMKV에 저장해두고, 인증 완료 시점에 꺼내서 이동합니다.

- **이미 로그인된 상태** → `SplashScreen.tsx`에서 자동 로그인 완료 후 처리
- **로그인 필요한 상태** → `useLogin.tsx`의 `onSuccess`에서 처리

---

### 3단계 — TransactionEditScreen 데이터 세팅

**파일: `apps/app/src/screens/history/TransactionEditScreen.tsx`**

`route.params.notificationId`가 있으면 알림 플로우임을 인식하고 추가 동작을 수행합니다.

1. `useNotificationLogStore.getState().notifications`에서 `notificationId`로 알림 데이터를 찾습니다.
2. **`parseCardNotification(title, text)`**로 가맹점명, 금액, 날짜, 카드사, 끝 4자리, 할부 여부를 파싱합니다.
3. 파싱 결과로 폼 필드(금액, 가맹점명, 날짜, 할부개월)를 세팅합니다.
4. 카드사 + 끝 4자리를 `paymentMethods` 목록과 비교해 결제수단을 자동 매칭합니다.
5. 원본 알림 텍스트를 화면 최상단 배너로 표시합니다.

**`useCategoryRecommendation(merchantName)`** (`screens/history/hooks/useCategoryRecommendation.ts`):

- 같은 가맹점명으로 등록된 최근 10건 내역을 조회합니다.
- `categoryId`별 등록 횟수를 집계해 가장 많이 쓴 카테고리를 반환합니다.
- 폼의 `categoryId`가 비어있을 때만 자동 적용하며, 적용 시 "추천 카테고리" 배지를 표시합니다.

---

### 4단계 — 등록 완료 후 흐름

```
등록 완료
  └─ markAsRegistered(notificationId)
       ├─ MMKV에서 해당 알림 데이터 삭제
       └─ cancelPendingReminder(notificationId) — 예약된 3일 알림 취소

  └─ 남은 미등록 알림 확인
       ├─ 남아있음 → Alert "다음 미등록 내역도 등록하시겠습니까?"
       │    ├─ "등록" → navigation.replace(TransactionEdit, { notificationId: 다음 id })
       │    └─ "나중에" → PendingNotificationsScreen
       └─ 없음 → PendingNotificationsScreen (빈 목록)
```

`navigation.replace`를 사용해 뒤로가기 스택에 이전 등록 화면이 쌓이지 않게 합니다.

---

### 5단계 — 미등록 알림 목록 (PendingNotificationsScreen)

**파일: `apps/app/src/screens/more/pendingNotifications/PendingNotificationsScreen.tsx`**

- **파싱 가능한 알림**: 가맹점명/금액/결제유형/카드/날짜를 파싱해 구조화된 카드로 표시. "등록" 버튼으로 TransactionEditScreen으로 이동.
- **파싱 불가능한 알림**: 원본 텍스트만 표시.
- **3일 이상 미등록**: 카드 상단에 강조 배지 표시.
- **일괄 등록**: 파싱 가능한 알림을 모두 `기타(미분류)` 카테고리로 일괄 등록.
- **만료 안내 배너**: "7일 후 자동 삭제" 안내 표시.

---

### 관련 파일 목록

| 파일 | 역할 |
|------|------|
| `apps/app/index.js` | HeadlessTask — 알림 감지, 저장, 예약 알림 등록 |
| `apps/app/App.tsx` | 포그라운드/Killed 알림 탭 처리 → TransactionEdit 이동 |
| `utils/cardNotificationParser.ts` | 카드 승인/취소 알림 판별 + 데이터 파싱 |
| `utils/notification.ts` | 알림 채널 설정, 즉시 알림 표시, 예약 알림 등록/취소 |
| `store/notificationLogStore.ts` | MMKV 기반 미등록 카드 승인 알림 스토어 |
| `store/cancelNotificationStore.ts` | MMKV 기반 카드 취소 알림 스토어 |
| `screens/history/TransactionEditScreen.tsx` | 알림 데이터 세팅, 추천 카테고리, 등록 완료 처리 |
| `screens/history/hooks/useCategoryRecommendation.ts` | 가맹점명 기반 추천 카테고리 쿼리 |
| `screens/more/pendingNotifications/PendingNotificationsScreen.tsx` | 미등록 알림 목록, 개별/일괄 등록 |
| `screens/splash/SplashScreen.tsx` | Killed 상태 딥링크 처리 (자동 로그인 경로) |
| `screens/auth/hooks/useLogin.tsx` | Killed 상태 딥링크 처리 (수동 로그인 경로) |

---

## Notes

### `DATABASE_URL` — 로컬 vs Docker

`.env`의 `DATABASE_URL`은 `localhost`를 사용합니다.

```
DATABASE_URL=postgresql://pingo:password@localhost:5432/pingo
```

`prisma migrate`, `prisma seed` 같은 로컬 명령어는 Docker 외부에서 실행되므로 `localhost:5432`로 접근해야 합니다. Docker api 컨테이너는 `docker-compose.yml`의 `environment`에서 `postgres:5432`로 덮어쓰므로 `.env`에 `localhost`로 설정해도 컨테이너 내부 동작에는 영향 없습니다.

### `.npmrc` — `shamefully-hoist=true`

pnpm은 기본적으로 패키지를 symlink 구조로 격리해서 설치합니다. 이 구조에서는 VS Code 등 IDE의 TypeScript 서버가 symlink를 따라가지 못해 `@prisma/client`, `@prisma/adapter-pg` 같은 패키지를 찾지 못하고 `TS2307` 에러가 발생합니다.

`shamefully-hoist=true`를 설정하면 모든 패키지를 루트 `node_modules`에 flat하게 설치해 IDE가 정상적으로 타입을 인식합니다. 빌드 및 런타임 동작에는 영향 없습니다.
