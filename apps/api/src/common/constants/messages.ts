export const MSG = {
  auth: {
    approvalSubmitted: '승인 요청이 접수되었습니다.',
    alreadyApproved: '이미 승인된 계정입니다.',
    invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
    pendingApproval: '승인 대기 중입니다.',
    rejected: '승인이 거절된 계정입니다.',
    /** 클라이언트가 이 값 수신 시 기기변경 화면으로 이동 */
    newDevice: 'NEW_DEVICE',
    devicePending: '기기 승인 대기 중입니다.',
    invalidRefreshToken: '유효하지 않은 refresh token입니다.',
    rateLimitExceeded: '잠시 후 다시 시도해주세요. (10분 3회 제한)',
    unauthorized: '인증이 필요합니다.',
    forbidden: '접근 권한이 없습니다.',
  },
  user: {
    wrongPassword: '현재 비밀번호가 올바르지 않습니다.',
    passwordChanged: '비밀번호가 변경되었습니다.',
  },
  common: {
    notFound: '요청한 리소스를 찾을 수 없습니다.',
    internalError: 'Internal server error',
  },
} as const;
