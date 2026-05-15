export const strings = {
  splash: {
    logo:  'P',
    title: 'Pingo',
  },

  login: {
    title:      '로그인',
    email:      '이메일',
    password:   '비밀번호',
    saveEmail:  '이메일 저장',
    autoLogin:  '자동 로그인',
    submit:     '로그인',
    noAccount:  '계정이 없으신가요? 승인 요청',
    errorTitle: '로그인 실패',
    errorFallback: '오류가 발생했습니다.',
  },

  approvalRequest: {
    title:    '승인 요청',
    desc:     '관리자 승인 후 사용 가능합니다.',
    email:    '이메일',
    password: '비밀번호',
    submit:   '신청',
  },

  approvalPending: {
    title:  '승인 대기 중',
    desc:   '관리자가 계정을 검토 중입니다.\n승인 후 이용 가능합니다.',
    back:   '로그인으로 돌아가기',
  },

  deviceChange: {
    title:  '새로운 기기 감지',
    desc:   '새로운 기기입니다.\n관리자 승인이 필요합니다.',
    submit: '승인 요청하기',
  },

  more: {
    header:        '전체',
    fixedExpenses: '고정 지출 관리',
    myInfo:        '내 정보',
  },

  myInfo: {
    header:         '내 정보',
    emailLabel:     '이메일',
    changePassword: '비밀번호 변경',
    logout:         '로그아웃',
  },

  passwordChange: {
    header:          '비밀번호 변경',
    currentPassword: '현재 비밀번호',
    newPassword:     '새 비밀번호',
    confirmPassword: '새 비밀번호 확인',
    submit:          '변경',
  },

  adminTabs: {
    userManagement:     '유저 관리',
    approvalManagement: '승인 관리',
    more:               '전체',
  },

  adminMore: {
    header: '전체',
    logout: '로그아웃',
  },

  userTabs: {
    home:     '홈',
    history:  '내역',
    stats:    '통계',
    category: '카테고리',
    more:     '전체',
  },

  error: {
    title:    '오류',
    fallback: '오류가 발생했습니다.',
  },

  toast: {
    unregisteredUser:   '등록되지 않은 사용자예요.',
    pleaseRequestApproval: '처음 사용하신다면 승인 요청을 먼저 해주세요.',
    rejected:           '승인이 거절된 계정이에요.',
    alreadyApproved:    '이미 승인된 계정이에요.',
    rateLimitExceeded:  '잠시 후 다시 시도해주세요. (10분 3회 제한)',
    serverError:        '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
  },

  /** 서버 응답 메시지 — 에러 분기 비교용 */
  apiMessage: {
    newDevice:          'NEW_DEVICE',
    pendingApproval:    '승인 대기 중입니다.',
    invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  },
} as const
