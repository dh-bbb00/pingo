# Pingo

## API 문서

| 환경 | URL |
|------|-----|
| 로컬 | http://localhost:3000/docs |
| JSON | http://localhost:3000/docs/json |

---

## 아키텍처

```
React Native → HTTPS → Cloudflare Tunnel → Nginx → NestJS API → PostgreSQL
```

---

## 시작하기

### 요구 사항

- Node.js 18+
- pnpm 9.0.0
- Docker Desktop

### 1. 의존성 설치

```bash
pnpm install
```

`postinstall` 훅으로 `prisma generate`가 자동 실행됩니다.

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env`를 열어 아래 항목 설정:

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
