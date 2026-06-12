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
│   │       │   └── queries/          # 공용 TanStack Query 훅 (여러 화면 공통)
│   │       ├── navigation/           # Root / Auth / Tab / Stack 네비게이터
│   │       ├── providers/            # QueryClient, ThemeProvider 래퍼
│   │       ├── screens/
│   │       │   ├── splash/
│   │       │   ├── auth/             # Login, ApprovalRequest, ApprovalPending, DeviceChange, RejectedAccount
│   │       │   │   └── hooks/        # 화면 전용 훅 (useLogin, useApprovalRequest, useLoginForm)
│   │       │   ├── home/
│   │       │   ├── history/          # HistoryScreen, TransactionEditScreen
│   │       │   ├── stats/
│   │       │   ├── category/         # CategoryScreen, CategoryEditScreen
│   │       │   ├── more/
│   │       │   │   ├── fixedExpenses/
│   │       │   │   └── myInfo/
│   │       │   └── admin/            # 어드민 전용 — 기능별 서브폴더
│   │       │       ├── types.ts      # 어드민 공유 타입
│   │       │       ├── approvalManagement/
│   │       │       │   ├── hooks/    # useApprovals
│   │       │       │   └── components/  # ApprovalRequestCard
│   │       │       ├── userManagement/
│   │       │       └── adminMore/
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
| 로컬 | http://localhost:4000/docs |
| JSON | http://localhost:4000/docs/json |

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
| `API_URL` | API 서버 주소 (에뮬레이터: `http://10.0.2.2:4000`) |

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

- API Health: http://localhost:4000/health
- API 문서: http://localhost:4000/docs

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
| 에뮬레이터 | `http://10.0.2.2:4000` | 로컬 PC localhost |
| 실기기 + USB | `http://localhost:4000` | `adb reverse tcp:4000 tcp:4000` 먼저 실행 |
| 실기기 + 핫스팟 | `http://<PC-IP>:4000` | PC의 로컬 IP 직접 입력 |

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

## FullScreenContainer (FE)

뒤로가기 헤더가 있는 화면에서 콘텐츠를 전체 화면 기준으로 중앙정렬할 때 사용하는 컨테이너 컴포넌트.

- 위치: `apps/app/src/components/containers/FullScreenContainer.tsx`
- React Navigation은 헤더 아래 영역만 화면으로 취급하므로 `flex: 1` + `justifyContent: 'center'`를 써도 헤더 높이만큼 시각적으로 아래로 치우친다.
- `FullScreenContainer`는 `position: 'absolute'`로 헤더를 포함한 전체 뷰포트를 커버해 정중앙 배치를 보장한다.
- **헤더(`headerShown: true`)가 있고 중앙정렬이 필요한 화면은 반드시 이 컴포넌트로 루트를 감싼다.**

```tsx
import FullScreenContainer from '@/components/containers/FullScreenContainer'

<FullScreenContainer style={styles.container}>
  {/* 콘텐츠 */}
</FullScreenContainer>
```

---

## 테마 시스템 (FE)

라이트/다크 모드를 지원하기 위해 모든 색상·폰트·간격 값은 테마 토큰을 통해 참조한다.  
`palette`(원시값)는 `theme/tokens/colors.ts`에만 존재하며 스타일 코드에서 직접 import하지 않는다.

### 스타일 작성 규칙

```ts
// [Screen].styles.ts — makeStyles(t: Theme) 함수로 export
import { StyleSheet } from 'react-native'
import type { Theme } from '@/theme'

export const makeStyles = (t: Theme) => StyleSheet.create({
  container:  { flex: 1, backgroundColor: t.colors.background },
  button:     { backgroundColor: t.colors.primary, borderRadius: t.radius.md },
  buttonText: { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold },
})
```

```tsx
// [Screen].tsx — useTheme + useMemo로 스타일 생성
import { useMemo } from 'react'
import { useTheme } from '@/theme'
import { makeStyles } from './FooScreen.styles'

export default function FooScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])
  // ...
}
```

- 색상 하드코딩(`'#FFFFFF'`, `'#4F6CF7'` 등) 금지 — 다크모드 대응 불가.
- 스타일 파일 내에서 `useTheme` 직접 호출 불가 (Hook 규칙 위반) — 반드시 `makeStyles` 함수 형태.

### 주요 토큰

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
> `semantic.income/expense`는 가계부 금액 표시 전용으로 구분한다.

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

---

## 카드 결제 알림 감지 및 등록 플로우 (FE)

카드사 앱에서 결제 승인 알림이 오면 Pingo가 이를 감지해 자동으로 지출 내역 등록 화면으로 안내하는 플로우다.

### 전체 흐름 요약

```
카드사 앱 알림 수신
  └─ HeadlessTask (index.js)
       ├─ isCardUsageNotification() — 카드 승인 알림인지 판별
       ├─ saveDetectedNotification() — MMKV에 저장, notificationId 반환
       ├─ schedulePendingReminder() — 3일 뒤 예약 알림 등록 (AlarmManager)
       └─ displayDetectedNotification() — 즉시 알림 표시 (data에 notificationId 포함)

사용자가 알림 탭
  ├─ [포그라운드] onForegroundEvent (App.tsx)
  ├─ [백그라운드] onBackgroundEvent → getInitialNotification (App.tsx)
  └─ [Killed] getInitialNotification → MMKV에 notificationId 저장
       └─ 인증 완료 후 SplashScreen.tsx / useLogin.tsx 에서 꺼내 이동

TransactionEditScreen (notificationId 파라미터)
  ├─ 스토어에서 알림 데이터 읽어 폼 자동 세팅
  ├─ 원문 텍스트 상단 배너로 표시
  ├─ useCategoryRecommendation() — 가맹점명 기반 추천 카테고리 적용
  └─ 등록 완료
       ├─ markAsRegistered() — MMKV에서 해당 알림 삭제 + 예약 알림 취소
       ├─ 미등록 알림 남아있으면 → "다음 내역 등록" 컨펌
       │    ├─ 등록 → 다음 TransactionEditScreen으로 replace
       │    └─ 나중에 → PendingNotificationsScreen (미등록 목록)
       └─ 미등록 알림 없으면 → PendingNotificationsScreen (빈 목록)
```

---

### 1단계 — 알림 감지 및 저장

**파일: `apps/app/index.js`**

`react-native-android-notification-listener`가 등록한 HeadlessTask. 기기에 알림이 수신될 때마다 앱 상태(포그라운드/백그라운드/종료)와 무관하게 호출된다.

- **`isCardUsageNotification(title, text)`** (`utils/cardNotificationParser.ts`)  
  제목에 `(1234) 승인` 패턴, 본문에 금액 패턴이 있으면 카드 승인 알림으로 판별.  
  제목에 `취소` 또는 `거절`이 포함된 알림은 제외한다.

- **`saveDetectedNotification(notification)`** (`store/notificationLogStore.ts`)  
  알림 데이터를 MMKV에 저장하고 고유 `notificationId`를 반환한다.  
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
  Notifee `TimestampTrigger`로 3일 뒤 예약 알림을 등록한다.  
  내부적으로 Android AlarmManager를 사용하므로 앱이 완전히 종료된 상태에서도 OS가 직접 발송한다.  
  예약 알림 id는 `` `pending-reminder-${notificationId}` `` 형태로 저장해 나중에 정확히 취소할 수 있게 한다.

- **`displayDetectedNotification(app, text, notificationId)`** (`utils/notification.ts`)  
  즉시 알림을 표시한다. Notifee notification의 `data.notificationId`에 id를 실어서  
  탭 시 App.tsx가 어떤 알림인지 식별하고 바로 등록 화면으로 이동할 수 있게 한다.

---

### 2단계 — 알림 탭 → 등록 화면 이동

**파일: `apps/app/App.tsx`**

앱 상태별로 세 가지 경로로 처리된다.

#### 포그라운드 (앱이 열린 상태)

```ts
notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.PRESS && detail.pressAction?.id === 'pending-notifications') {
    const notificationId = detail.notification?.data?.notificationId
    if (notificationId) navigateToTransactionEdit(notificationId)
  }
})
```

`navigateToTransactionEdit()`는 `navigationRef`를 사용해 History 탭의 TransactionEditScreen으로 크로스탭 이동한다.

#### 백그라운드 (앱이 실행 중이나 화면에 없는 상태)

`notifee.onBackgroundEvent`가 탭 이벤트를 수신하면 앱이 포그라운드로 전환된다.  
전환 직후 `getInitialNotification()`이 이를 잡아 포그라운드와 동일하게 처리한다.

#### Killed (앱이 완전히 종료된 상태)

```ts
const initial = await notifee.getInitialNotification()
if (initial?.pressAction?.id === 'pending-notifications') {
  const notificationId = initial.notification?.data?.notificationId
  storage.set(StorageKeys.PENDING_DEEPLINK, notificationId ?? '')
}
```

앱이 종료 상태에서 알림을 탭하면 앱이 새로 실행되고 인증 흐름이 먼저 진행된다.  
`notificationId`를 MMKV(`StorageKeys.PENDING_DEEPLINK`)에 저장해두고, 인증 완료 시점에 꺼내서 이동한다.

- **이미 로그인된 상태** → `SplashScreen.tsx`에서 자동 로그인 완료 후 처리
- **로그인 필요한 상태** → `useLogin.tsx`의 `onSuccess`에서 처리

두 곳 모두 동일한 로직:
```ts
const pendingNotificationId = storage.getString(StorageKeys.PENDING_DEEPLINK)
if (pendingNotificationId) {
  storage.remove(StorageKeys.PENDING_DEEPLINK)
  navigation.replace(Screens.Root.UserTabs, {
    screen: Screens.UserTab.History,
    params: { screen: Screens.History.TransactionEdit, params: { notificationId: pendingNotificationId } },
  })
}
```

---

### 3단계 — TransactionEditScreen 데이터 세팅

**파일: `apps/app/src/screens/history/TransactionEditScreen.tsx`**

`route.params.notificationId`가 있으면 알림 플로우임을 인식하고 추가 동작을 수행한다.

#### 폼 자동 세팅

`paymentMethods` 목록이 로드된 후 1회 실행(`notifInitialized` ref로 중복 방지):

1. `useNotificationLogStore.getState().notifications`에서 `notificationId`로 알림 데이터를 찾는다.
2. **`parseCardNotification(title, text)`** (`utils/cardNotificationParser.ts`)로 가맹점명, 금액, 날짜, 카드사, 끝 4자리, 할부 여부를 파싱한다.
3. 파싱 결과로 폼 필드(금액, 가맹점명, 날짜, 할부개월)를 세팅한다.
4. 카드사 + 끝 4자리를 `paymentMethods` 목록과 비교해 결제수단을 자동 매칭한다.
5. 원본 알림 텍스트를 `notificationText` 상태에 저장 → 화면 최상단 배너로 표시한다.

#### 추천 카테고리

**`useCategoryRecommendation(merchantName)`** (`screens/history/hooks/useCategoryRecommendation.ts`):

- 같은 가맹점명으로 등록된 최근 10건의 내역을 조회한다.
- `categoryId`별 등록 횟수를 집계해 가장 많이 쓴 카테고리 1개를 반환한다.
- 폼의 `categoryId`가 비어있을 때만 자동 적용하며, 적용 시 초록색 "추천 카테고리" 배지를 표시한다.
- 사용자가 카테고리를 직접 변경하면 배지는 사라진다.

---

### 4단계 — 등록 완료 후 흐름

**파일: `apps/app/src/screens/history/TransactionEditScreen.tsx` — `handleAfterNotificationCreate()`**

알림 플로우(`notificationId` 있을 때)에서만 `useCreateTransaction`의 성공 콜백으로 호출된다.

```
등록 완료
  └─ markAsRegistered(notificationId)
       ├─ MMKV에서 해당 알림 데이터 삭제
       └─ cancelPendingReminder(notificationId) — 예약된 3일 알림 취소

  └─ store.notifications 에서 남은 미등록 알림 확인
       ├─ 남아있음 → Alert "다음 미등록 내역도 등록하시겠습니까?"
       │    ├─ "등록" → navigation.replace(TransactionEdit, { notificationId: 다음 id })
       │    └─ "나중에" → PendingNotificationsScreen (미등록 목록)
       └─ 없음 → PendingNotificationsScreen (빈 목록)
```

`navigation.replace`를 사용하는 이유: 뒤로가기 스택에 이전 등록 화면이 쌓이지 않게 하기 위함.

---

### 5단계 — 미등록 알림 목록 (PendingNotificationsScreen)

**파일: `apps/app/src/screens/more/pendingNotifications/PendingNotificationsScreen.tsx`**

More 탭 메뉴에서 직접 진입하거나 등록 완료 후 자동으로 이동되는 화면.  
`notificationLogStore`의 `notifications` 배열을 그대로 표시한다 — 등록된 항목은 즉시 삭제되므로 리스트에는 미등록 건만 남는다.

- **파싱 가능한 알림**: 가맹점명/금액/결제유형/카드/날짜를 파싱해 구조화된 카드로 표시. "등록" 버튼으로 해당 TransactionEditScreen으로 이동.
- **파싱 불가능한 알림**: 원본 텍스트만 표시. 등록 버튼 없음 (필수 정보 부재).
- **3일 이상 미등록**: 카드 상단에 강조 배지 표시.
- **일괄 등록**: 파싱 가능한 알림을 모두 `기타(미분류)` 카테고리로 일괄 등록. 실패 건은 목록에 유지.
- **만료 안내 배너**: 목록이 비어있지 않을 때 "7일 후 자동 삭제" 안내 표시.

---

### 데이터 생명주기

| 이벤트 | 시점 | 처리 |
|--------|------|------|
| 알림 저장 | 감지 즉시 | MMKV에 추가, 3일 뒤 예약 알림 등록 |
| 7일 만료 삭제 | 앱 실행 시 `load()` 호출 | `filterExpired()`가 7일 지난 항목 일괄 제거 |
| 3일 미등록 알림 | AlarmManager가 직접 발송 | 앱 종료 상태에서도 동작 |
| 등록 완료 | 등록 즉시 | MMKV에서 즉시 삭제, 예약 알림 취소 |

7일 만료 정리는 별도 백그라운드 작업 없이 앱 실행 시점(`load()`)에만 실행된다.  
평소 미등록 상태로 7일을 넘기는 경우는 드물고, 앱을 켤 때 정리해도 충분하기 때문이다.

---

### 관련 파일 목록

| 파일 | 역할 |
|------|------|
| `apps/app/index.js` | HeadlessTask — 알림 감지, 저장, 예약 알림 등록 |
| `apps/app/App.tsx` | 포그라운드/Killed 알림 탭 처리 → TransactionEdit 이동 |
| `utils/cardNotificationParser.ts` | 카드 승인 알림 판별 + 데이터 파싱 |
| `utils/notification.ts` | 알림 채널 설정, 즉시 알림 표시, 예약 알림 등록/취소 |
| `store/notificationLogStore.ts` | MMKV 기반 미등록 알림 스토어 (저장/삭제/만료 처리) |
| `screens/history/TransactionEditScreen.tsx` | 알림 데이터 세팅, 추천 카테고리, 등록 완료 후 다음 알림 처리 |
| `screens/history/hooks/useCategoryRecommendation.ts` | 가맹점명 기반 추천 카테고리 쿼리 |
| `screens/more/pendingNotifications/PendingNotificationsScreen.tsx` | 미등록 알림 목록, 개별/일괄 등록 |
| `screens/splash/SplashScreen.tsx` | Killed 상태 딥링크 처리 (자동 로그인 경로) |
| `screens/auth/hooks/useLogin.tsx` | Killed 상태 딥링크 처리 (수동 로그인 경로) |
