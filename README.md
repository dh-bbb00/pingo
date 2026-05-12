# Pingo

## Notes

### `.npmrc` — `shamefully-hoist=true`

pnpm은 기본적으로 패키지를 symlink 구조로 격리해서 설치한다. 이 구조에서는 VS Code 등 IDE의 TypeScript 서버가 symlink를 따라가지 못해 `@prisma/client`, `@prisma/adapter-pg` 같은 패키지를 찾지 못하고 `TS2307` 에러가 발생한다.

`shamefully-hoist=true`를 설정하면 모든 패키지를 루트 `node_modules`에 flat하게 설치해 IDE가 정상적으로 타입을 인식한다. 빌드 및 런타임 동작에는 영향 없음.
