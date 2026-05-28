/**
 * 화면 UI 문구 상수.
 * 에러 메시지는 백엔드 messages.ts 에서 관리하며 프론트는 그대로 표시한다.
 * 이 파일에는 레이블·플레이스홀더·버튼 텍스트 등 화면 구성 문구만 정의한다.
 */
export const strings = {
  /** 에러 표시용 공통 — Alert 타이틀, 서버 응답 없을 때 폴백 */
  common: {
    errorTitle:       '오류',
    errorFallback:    '오류가 발생했습니다.',
    logoutConfirmTitle: '로그아웃',
    logoutConfirmMsg:   '로그아웃 하시겠습니까?',
    confirm:            '확인',
    cancel:             '취소',
  },

  splash: {
    logo:  'P',
    title: 'Pingo',
  },

  login: {
    title:        '로그인',
    email:        '이메일',
    password:     '비밀번호',
    saveEmail:    '이메일 저장',
    autoLogin:    '자동 로그인',
    submit:       '로그인',
    noAccount:    '계정이 없으신가요? 승인 요청',
    /** 유효성 오류·잘못된 자격증명 — 상세 내용 노출 없이 통합 안내 */
    invalidInput: '이메일 또는 비밀번호를 확인해주세요.',
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

  rejectedAccount: {
    title: '승인이 거절되었습니다',
    desc:  '계정 사용이 거절되었습니다.\n자세한 문의는 관리자에게 연락해주세요.',
    back:  '로그인으로 돌아가기',
  },

  deviceChange: {
    title:  '기기가 변경되었습니다',
    desc:   '현재 기기는 관리자 승인이 필요합니다.\n기존 기기는 정상적으로 사용 가능합니다.',
    submit: '승인 요청하기',
  },

  more: {
    header:        '전체',
    fixedExpenses: '고정 지출 관리',
    myInfo:        '내 정보',
  },

  myInfo: {
    header:                  '내 정보',
    emailLabel:              '이메일',
    changePassword:          '비밀번호 변경',
    logout:                  '로그아웃',
    devicesHeader:           '내 기기',
    currentDeviceBadge:      '현재 기기',
    deleteDevice:            '삭제',
    confirmDeleteOtherTitle: '기기 삭제',
    confirmDeleteOtherMsg:   '삭제하면 해당 기기에서 다시 로그인 시 승인 요청이 필요합니다. 계속하시겠습니까?',
    confirmDeleteCurrentTitle: '현재 기기 삭제',
    confirmDeleteCurrentMsg:   '삭제하면 승인 요청이 필요하고 로그아웃 처리됩니다. 계속하시겠습니까?',
  },

  passwordChange: {
    header:          '비밀번호 변경',
    currentPassword: '현재 비밀번호',
    newPassword:     '새 비밀번호',
    confirmPassword: '새 비밀번호 확인',
    submit:          '변경',
    errCurrentEmpty: '현재 비밀번호를 입력해주세요.',
    errNextEmpty:    '새 비밀번호를 입력해주세요.',
    errNextShort:    '비밀번호는 8자 이상이어야 합니다.',
    errConfirmEmpty: '비밀번호 확인을 입력해주세요.',
    errConfirmMismatch: '새 비밀번호가 일치하지 않습니다.',
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

  approvalManagement: {
    header:          '승인 관리',
    totalCount:      (n: number) => `총 ${n}건`,
    tabPending:      '대기',
    tabRejected:     '거절',
    emptyPending:    '대기 중인 승인 요청이 없습니다.',
    emptyRejected:   '거절된 승인 요청이 없습니다.',
    badgeNewUser:    '신규',
    badgeNewDevice:  '기기 추가',
    approve:         '승인',
    reject:          '거절',
    accept:          '수락',
    delete:          '삭제',
    confirmAccept: {
      title:   '수락 확인',
      message: '거절된 요청을 수락하시겠습니까?',
      ok:      '수락',
      cancel:  '취소',
    },
    confirmDelete: {
      title:   '삭제 확인',
      message: '삭제하시겠습니까?',
      ok:      '삭제',
      cancel:  '취소',
    },
  },

  categoryEdit: {
    headerCreate:     '카테고리 등록',
    headerEdit:       '카테고리 수정',
    iconLabel:        '아이콘',
    colorLabel:       '색상',
    nameLabel:        '카테고리명',
    namePlaceholder:  '예: 식비, 교통비',
    budgetLabel:      '월 예산',
    budgetPlaceholder: '미입력 시 예산 없음',
    budgetUnit:       '원',
    fixedBudget:      '매달 예산 고정',
    fixedBudgetDesc:  '매달 동일한 예산을 자동 적용합니다.',
    submit:           '등록하기',
    update:           '수정하기',
    errNameEmpty:     '카테고리명을 입력해주세요.',
    colorPickerTitle: '색상 선택',
    colorPickerConfirm: '선택',
    emojiPickerTitle: '아이콘 선택',
  },

  userManagement: {
    header:      '유저 관리',
    searchPlaceholder: '이메일 검색',
    totalCount:  (n: number) => `총 ${n}명`,
    tabActive:   '활성',
    tabSuspended: '정지',
    empty:       '유저가 없습니다.',
    emptySearch: '검색 결과가 없습니다.',
    deviceLabel: (n: number) => `기기 ${n}`,
    suspend:     '사용 정지',
    unsuspend:   '정지 해제',
    confirmSuspendTitle:   '사용 정지',
    confirmSuspendMsg:     '해당 유저를 사용 정지하면 즉시 강제 로그아웃 처리됩니다. 계속하시겠습니까?',
    confirmUnsuspendTitle: '정지 해제',
    confirmUnsuspendMsg:   '해당 유저의 정지를 해제하시겠습니까?',
  },

  userTabs: {
    home:     '홈',
    history:  '내역',
    stats:    '통계',
    category: '카테고리',
    more:     '전체',
  },
} as const
