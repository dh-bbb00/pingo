# Pingo — Claude 작업 가이드

## 공통 규칙
- 답변은 무조건 **한글**로.
- 문구는 **하드코딩 금지** — FE: `strings` 상수, BE: `messages.ts` 상수 사용.
- 상태값·함수에 **WHY가 불명확한 경우** 간결한 주석 필수.
- 불필요한 추상화·에러 핸들링·하위 호환 코드 금지.

---

## 모노레포 구조

```
pingo/
├── apps/
│   ├── api/          # NestJS 백엔드
│   └── app/          # React Native 앱 (Android 전용)
├── packages/         # 공유 패키지 (현재 미사용)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

패키지 매니저: `pnpm` / 모노레포 빌드: `turbo`

### 주요 루트 스크립트
| 명령 | 설명 |
|------|------|
| `pnpm infra:up-dev` | Docker (개발용, 포그라운드) |
| `pnpm infra:up` | Docker (운영용, 백그라운드) |
| `pnpm db:migrate` | Prisma 마이그레이션 |
| `pnpm db:seed` | 시드 실행 |
| `pnpm app:android` | 앱 안드로이드 실행 |

---

## [FE] apps/app

### 기술 스택

| 분류 | 라이브러리 | 버전 | 용도 |
|------|-----------|------|------|
| 런타임 | React Native | 0.85.3 | Android 전용 |
| 언어 | TypeScript | ^5.8.3 | |
| UI 프레임워크 | React | 19.2.3 | |
| 전역 상태 | Zustand | ^5.0.13 | 인증 상태 등 클라이언트 전역 상태 |
| 서버 상태 | TanStack Query | ^5.100.10 | API 캐싱·동기화 |
| HTTP | Axios | ^1.16.0 | API 통신, 토큰 인터셉터 |
| 네비게이션 | React Navigation | ^7.x | Stack + Bottom Tabs |
| 로컬 스토리지 | react-native-mmkv | ^4.3.1 | 빠른 키-값 스토리지 (refresh token 등) |
| 환경변수 | react-native-config | ^1.6.1 | `.env.*` 파일 로드 |
| 기기 정보 | react-native-device-info | ^15.0.2 | 기기 UID 등 |
| 차트 | react-native-gifted-charts | ^1.4.76 | 통계 화면 그래프 |
| 알림 | @notifee/react-native | ^9.1.8 | 로컬 푸시 알림 |
| 알림 리스너 | react-native-android-notification-listener | ^5.0.1 | 시스템 알림 수신 |
| 스플래시 | react-native-bootsplash | ^7.3.1 | 부트 스플래시 화면 |
| SVG | react-native-svg | ^15.15.5 | 벡터 아이콘 렌더링 |
| 네이티브 모듈 | react-native-nitro-modules | ^0.35.6 | 고성능 네이티브 브리지 |
| 안전 영역 | react-native-safe-area-context | ^5.5.2 | SafeAreaView |
| 테스트 | Jest | ^29.6.3 | |

### 폴더 구조
```
src/
├── api/
│   ├── client.ts              # Axios 인스턴스 (토큰 인터셉터 포함)
│   └── endpoints/             # 도메인별 API 함수 모음
│       └── [domain].api.ts    # 인터페이스 + apiClient 호출
├── assets/                    # 이미지·스플래시 등 정적 파일
├── components/                # 공유 컴포넌트
│   └── icons/
├── config/
│   └── env.ts                 # 환경변수 래퍼
├── constants/
│   ├── endpoints.ts           # API 엔드포인트 상수
│   ├── queryKeys.ts           # TanStack Query 키 상수
│   └── strings.ts             # UI 문구 상수 (하드코딩 대신 여기서 참조)
├── hooks/
│   └── queries/               # 전역 공유 Query/Mutation 훅
├── navigation/                # 네비게이터 정의 + navigationRef
├── providers/                 # 전역 Provider 조합 (index.tsx)
├── screens/                   # 화면 단위 폴더
│   └── [domain]/
│       ├── [Screen].tsx            # 화면 컴포넌트
│       ├── [Screen].styles.ts      # StyleSheet (항상 분리)
│       ├── types.ts                # 해당 도메인 타입
│       └── hooks/                  # 화면 전용 훅
├── store/
│   └── authStore.ts           # Zustand 전역 인증 상태
├── theme/
│   ├── tokens/                # colors, spacing, typography 원시값
│   ├── themes/                # light.ts / dark.ts (토큰 조합)
│   ├── ThemeContext.tsx        # 테마 Context + Provider
│   ├── types.ts               # Theme 타입
│   └── index.ts               # useTheme 훅 등 export
├── types/
│   └── navigation.ts          # 네비게이션 ParamList 타입
└── utils/                     # device, notification, storage 유틸
```

### 코드 패턴

#### 화면 (Screen)
```tsx
// [Screen].tsx — 로직은 hooks/로 분리, 스타일은 .styles.ts로 분리
export default function FooScreen() {
  const { data, setTab } = useFooFilter()   // 화면 전용 훅
  return <SafeAreaView style={styles.container}>...</SafeAreaView>
}
```

#### 스타일
```ts
// [Screen].styles.ts — StyleSheet.create 단일 export
export const styles = StyleSheet.create({ ... })
```

#### API 엔드포인트
```ts
// api/endpoints/[domain].api.ts
export interface Foo { id: string; ... }

export const fooApi = {
  getList: (filter?: FooFilter) => apiClient.get<Foo[]>(endpoints.foo.base, { params: filter }),
  create:  (payload: Omit<Foo, 'id'>) => apiClient.post<Foo>(endpoints.foo.base, payload),
  update:  (id: string, payload: Partial<Foo>) => apiClient.patch<Foo>(endpoints.foo.detail(id), payload),
  delete:  (id: string) => apiClient.delete(endpoints.foo.detail(id)),
}
```

#### Query 훅
```ts
// hooks/queries/useFoo.ts
export function useFoos(filter?: FooFilter) {
  return useQuery({
    queryKey: queryKeys.foo.list(filter),
    queryFn:  () => fooApi.getList(filter).then((r) => r.data),
  })
}

export function useDeleteFoo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => fooApi.delete(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: queryKeys.foo.all }),
  })
}
```

#### QueryKey 등록 규칙
```ts
// constants/queryKeys.ts — 추가 시 항상 여기에 등록
export const queryKeys = {
  foo: {
    all:    ['foo'] as const,
    list:   (filter?: unknown) => ['foo', 'list', filter] as const,
    detail: (id: string)       => ['foo', id] as const,
  },
} as const
```

#### 문구 사용
```ts
// constants/strings.ts에 추가 후 참조
import { strings } from '@/constants/strings'
<Text>{strings.foo.title}</Text>   // 인라인 문자열 절대 금지
```

#### 전역 인증 상태 (Zustand)
- `useAuthStore` — `accessToken`, `role`, `approvalStatus`
- 로그아웃은 항상 `useAuthStore().logout()` 호출 (서버 + 로컬 동시 클리어)

---

## [BE] apps/api

### 기술 스택

| 분류 | 라이브러리 | 버전 | 용도 |
|------|-----------|------|------|
| 프레임워크 | NestJS | ^10.x | HTTP 서버 |
| 언어 | TypeScript | ^5.7.3 | |
| ORM | Prisma | ^7.0.0 | 타입 안전 DB 접근 |
| DB 드라이버 | pg (PrismaPg 어댑터) | ^8.13.3 | PostgreSQL 연결 (Connection Pool) |
| 인증 | @nestjs/jwt + passport-jwt | ^10.x | access/refresh JWT 전략 |
| 유효성 검사 | class-validator + class-transformer | ^0.14 / ^0.5 | DTO 검증 |
| 스케줄러 | @nestjs/schedule | ^4.1.2 | 고정 지출 자동 처리 등 Cron 작업 |
| API 문서 | @nestjs/swagger + @scalar/nestjs-api-reference | ^8.x | Swagger UI |
| 보안 | helmet | ^8.0.0 | HTTP 보안 헤더 |
| 암호화 | bcryptjs | ^2.4.3 | 비밀번호 해싱 |
| 로깅 | winston + winston-daily-rotate-file | ^3.x | 파일 로테이션 로그 |
| 환경변수 | @nestjs/config | ^3.3.0 | `.env` 로드 |

### 폴더 구조
```
src/
├── main.ts
├── app.module.ts
├── common/
│   ├── constants/
│   │   └── messages.ts        # 서버 응답 메시지 상수
│   ├── decorators/            # @CurrentUser, @Roles
│   ├── filters/               # HttpExceptionFilter
│   ├── guards/                # RolesGuard
│   ├── interceptors/          # LoggingInterceptor
│   └── types/
│       └── response.type.ts   # BasicResponse, ListResponse, PageResponse
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts      # PrismaClient 래퍼
├── auth/                      # JWT 인증 (guards, strategies, dto)
└── [domain]/                  # 도메인별 모듈
    ├── [domain].module.ts
    ├── [domain].controller.ts
    ├── [domain].service.ts
    └── dto/
        ├── create-[domain].dto.ts
        └── update-[domain].dto.ts
```

### 코드 패턴

#### 모듈 구조 (도메인 추가 시 동일 패턴 반복)
```ts
// [domain].controller.ts
@ApiTags('Domain')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('domain')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get()
  @ApiOperation({ summary: '목록 조회' })
  async findAll(@CurrentUser() user: { id: string }): Promise<ListResponse<unknown>> {
    const data = await this.domainService.findAll(user.id)
    return { success: true, data }
  }
}
```

#### 응답 타입 — 항상 `common/types/response.type.ts` 사용
```ts
BasicResponse<T>  // 단건: { success, data, message? }
ListResponse<T>   // 목록: { success, data[], message? }
PageResponse<T>   // 페이지네이션: { success, data[], pagination: { page, pageSize, total, totalPages } }
```

#### 메시지 상수
```ts
// common/constants/messages.ts에 추가 후 참조 (인라인 문자열 금지)
return { success: false, message: messages.foo.notFound }
```

#### Prisma 사용
- `PrismaService`를 주입해 사용; 직접 `PrismaClient` 인스턴스화 금지.
- 마이그레이션: `pnpm db:migrate` → `pnpm db:generate` 순서.

#### 역할 기반 접근
```ts
@Roles('ADMIN')
@UseGuards(JwtGuard, RolesGuard)
```

---

## 인프라

| 파일 | 역할 |
|------|------|
| `docker-compose.yml` | 운영 기본 구성 (PostgreSQL, API, Nginx) |
| `docker-compose.override.yml` | 개발 오버라이드 (볼륨 마운트, 핫리로드) |
| `nginx/default.conf` | Nginx 리버스 프록시 설정 |
| `cloudflared/config.yml` | Cloudflare 터널 설정 |
