import type {
  RootStackParamList,
  AuthStackParamList,
  AdminTabParamList,
  AdminMoreStackParamList,
  UserTabParamList,
  HistoryStackParamList,
  CategoryStackParamList,
  MoreStackParamList,
} from '@/types/navigation'

/** 네비게이션 스크린 이름 상수 — 하드코딩 대신 여기서 참조 */
export const Screens = {
  Root: {
    Splash:    'Splash',
    Auth:      'Auth',
    AdminTabs: 'AdminTabs',
    UserTabs:  'UserTabs',
  } satisfies Record<string, keyof RootStackParamList>,

  Auth: {
    Login:           'Login',
    ApprovalRequest: 'ApprovalRequest',
    ApprovalPending: 'ApprovalPending',
    DeviceChange:    'DeviceChange',
    RejectedAccount: 'RejectedAccount',
  } satisfies Record<string, keyof AuthStackParamList>,

  AdminTab: {
    UserManagement:     'UserManagement',
    ApprovalManagement: 'ApprovalManagement',
    AdminMore:          'AdminMore',
  } satisfies Record<string, keyof AdminTabParamList>,

  AdminMore: {
    AdminMoreMain:       'AdminMoreMain',
    SchedulerManagement: 'SchedulerManagement',
    SchedulerLogDetail:  'SchedulerLogDetail',
  } satisfies Record<string, keyof AdminMoreStackParamList>,

  UserTab: {
    Home:     'Home',
    History:  'History',
    Stats:    'Stats',
    Category: 'Category',
    More:     'More',
  } satisfies Record<string, keyof UserTabParamList>,

  History: {
    HistoryMain:     'HistoryMain',
    TransactionEdit: 'TransactionEdit',
  } satisfies Record<string, keyof HistoryStackParamList>,

  Category: {
    CategoryMain: 'CategoryMain',
    CategoryEdit: 'CategoryEdit',
  } satisfies Record<string, keyof CategoryStackParamList>,

  More: {
    MoreMain:           'MoreMain',
    FixedExpenses:      'FixedExpenses',
    FixedExpenseEdit:   'FixedExpenseEdit',
    PaymentMethods:     'PaymentMethods',
    PaymentMethodEdit:  'PaymentMethodEdit',
    MyInfo:             'MyInfo',
    PasswordChange:     'PasswordChange',
    NotificationLog:    'NotificationLog',
  } satisfies Record<string, keyof MoreStackParamList>,
} as const
