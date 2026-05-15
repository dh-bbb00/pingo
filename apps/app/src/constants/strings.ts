/**
 * 화면 UI 문구 상수.
 * 에러 메시지는 백엔드 messages.ts 에서 관리하며 프론트는 그대로 표시한다.
 * 이 파일에는 레이블·플레이스홀더·버튼 텍스트 등 화면 구성 문구만 정의한다.
 */
export const strings = {
  /** 에러 표시용 공통 — Alert 타이틀, 서버 응답 없을 때 폴백 */
  common: {
    errorTitle:    '오류',
    errorFallback: '오류가 발생했습니다.',
  },

  splash: {
    logo:  'P',
    title: 'Pingo',
  },

  login: {
    title:     '로그인',
    email:     '이메일',
    password:  '비밀번호',
    saveEmail: '이메일 저장',
    autoLogin: '자동 로그인',
    submit:    '로그인',
    noAccount: '계정이 없으신가요? 승인 요청',
  },

  approvalRequest: {
    title:    '승인 요청',
    desc:     '관리자 승인 후 사용 가능합니다.',
    email:    '이메일',
    password: '비밀번호',
    submit:   '신청',
  },

  approvalPending: {
    title: '승인 대기 중',
    desc:  '관리자가 계정을 검토 중입니다.\n승인 후 이용 가능합니다.',
    back:  '로그인으로 돌아가기',
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
} as const
