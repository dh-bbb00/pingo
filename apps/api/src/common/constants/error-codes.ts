/**
 * API 에러 코드 상수.
 *
 * 변경 규칙
 * - 코드 추가/삭제/변경 시 FE apps/app/src/api/errors.ts 와 반드시 동기화.
 * - 기존 코드 문자열 값은 클라이언트 의존성이 있으므로 변경 금지.
 *   (변경이 필요하면 BE·FE 동시 배포 필요)
 *
 * 프론트 처리 위치: apps/app/src/api/errorHandler.ts
 */
export const ApiErrorCode = {

  // ─────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────

  /**
   * 이메일·비밀번호 불일치.
   * - 발생: 존재하지 않는 이메일 or 비밀번호 틀림 (보안상 두 케이스 통일)
   * - HTTP: 401
   * - FE: "등록되지 않은 사용자예요" 토스트 + 승인요청 안내
   */
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  /**
   * 계정 승인 대기 중.
   * - 발생: 로그인 시 user.status === 'PENDING'
   * - HTTP: 403
   * - FE: 승인 대기 화면으로 이동
   */
  PENDING_APPROVAL: 'PENDING_APPROVAL',

  /**
   * 계정 승인 거절.
   * - 발생: 로그인 시 user.status === 'REJECTED'
   * - HTTP: 403
   * - FE: 거절 안내 토스트
   */
  REJECTED: 'REJECTED',

  /**
   * 미등록 기기에서 로그인 시도.
   * - 발생: 해당 deviceUid로 등록된 기기 레코드 없음
   * - HTTP: 403
   * - FE: 기기 변경(승인요청) 화면으로 이동
   */
  NEW_DEVICE: 'NEW_DEVICE',

  /**
   * 기기 승인 대기 중.
   * - 발생: 기기 레코드는 있으나 device.isTrusted === false
   * - HTTP: 403
   * - FE: 승인 대기 화면으로 이동
   */
  DEVICE_PENDING: 'DEVICE_PENDING',

  /**
   * 승인요청 중복.
   * - 발생: 이미 APPROVED 상태인 계정으로 승인요청 재시도
   * - HTTP: 409
   * - FE: "이미 승인된 계정" 토스트
   */
  ALREADY_APPROVED: 'ALREADY_APPROVED',

  /**
   * 거절된 계정으로 승인요청 시도.
   * - 발생: user.status === 'REJECTED'인 이메일로 requestApproval 재시도
   * - HTTP: 403
   * - FE: 거절된 계정 화면으로 이동
   */
  REJECTED_ACCOUNT: 'REJECTED_ACCOUNT',

  /**
   * 유효하지 않은 refresh token.
   * - 발생: DB에 없거나 만료된 refresh token으로 재발급 시도
   * - HTTP: 401
   * - FE: 인터셉터에서 로그아웃 처리 (errorHandler 호출 불필요)
   */
  INVALID_REFRESH_TOKEN: 'INVALID_REFRESH_TOKEN',

  /**
   * 승인요청 요청 횟수 초과.
   * - 발생: 동일 IP·deviceUid 기준 10분 내 3회 초과
   * - HTTP: 429
   * - FE: "잠시 후 다시 시도" 토스트
   */
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // ─────────────────────────────────────────────
  // Common — GlobalExceptionFilter 자동 부여
  // ─────────────────────────────────────────────

  /**
   * DTO 유효성 검사 실패.
   * - 발생: class-validator 오류 (400 Bad Request)
   * - FE: 서버 메시지 그대로 Alert
   */
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  /**
   * 인증 토큰 없음 or 만료.
   * - 발생: JwtGuard 통과 실패 (errorCode 없이 던진 401)
   * - FE: 인터셉터에서 재발급 시도 → 실패 시 로그아웃
   */
  UNAUTHORIZED: 'UNAUTHORIZED',

  /**
   * 권한 없음.
   * - 발생: RolesGuard 통과 실패 (errorCode 없이 던진 403)
   * - FE: 기본 Alert
   */
  FORBIDDEN: 'FORBIDDEN',

  /**
   * 리소스 없음.
   * - 발생: DB 조회 결과 없음 (404)
   * - FE: 기본 Alert
   */
  NOT_FOUND: 'NOT_FOUND',

  /**
   * 서버 내부 오류.
   * - 발생: 예상치 못한 예외 (500)
   * - FE: "서버 오류" 토스트
   */
  INTERNAL_ERROR: 'INTERNAL_ERROR',

} as const

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode]
