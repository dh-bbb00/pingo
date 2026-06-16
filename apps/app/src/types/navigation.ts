import type { NavigatorScreenParams } from '@react-navigation/native'

// ────────────────────────────────────────────────
// Root
// ────────────────────────────────────────────────
export type RootStackParamList = {
  Splash:     undefined
  Auth:       NavigatorScreenParams<AuthStackParamList>
  AdminTabs:  NavigatorScreenParams<AdminTabParamList>
  UserTabs:   NavigatorScreenParams<UserTabParamList>
}

// ────────────────────────────────────────────────
// Auth Stack
// ────────────────────────────────────────────────
export type AuthStackParamList = {
  Login:              undefined
  ApprovalRequest:    undefined
  ApprovalPending:    undefined
  DeviceChange:       undefined
  RejectedAccount:    undefined
}

// ────────────────────────────────────────────────
// Admin Tabs
// ────────────────────────────────────────────────
export type AdminTabParamList = {
  UserManagement:     undefined
  ApprovalManagement: undefined
  AdminMore:          NavigatorScreenParams<AdminMoreStackParamList>
}

export type AdminMoreStackParamList = {
  AdminMoreMain:       undefined
  SchedulerManagement: undefined
  SchedulerLogDetail:  { id: string } | { type: string; year: number; month: number }
}

// ────────────────────────────────────────────────
// User Tabs
// ────────────────────────────────────────────────
export type UserTabParamList = {
  Home:     undefined
  History:  NavigatorScreenParams<HistoryStackParamList>
  Stats:    { initialTab?: 'period' | 'category' | 'paymentMethod'; dateTab?: '일' | '월' | '년' | '기간'; categoryId?: string; paymentMethodId?: string } | undefined
  Category: NavigatorScreenParams<CategoryStackParamList>
  More:     NavigatorScreenParams<MoreStackParamList>
}

export type HistoryStackParamList = {
  HistoryMain:                 undefined
  TransactionEdit:             { id?: string; notificationId?: string }
  CancelledTransactionSearch:  { cancelNotificationId: string }
}

export type CategoryStackParamList = {
  CategoryMain: undefined
  CategoryEdit: { id?: string; returnToTransaction?: boolean }
}

export type MoreStackParamList = {
  MoreMain:               undefined
  FixedExpenses:          undefined
  FixedExpenseEdit:       { id?: string }
  PaymentMethods:         undefined
  PaymentMethodEdit:      { id?: string; returnToTransaction?: boolean }
  MyInfo:                 undefined
  PasswordChange:         undefined
  PendingNotifications:   undefined
}
