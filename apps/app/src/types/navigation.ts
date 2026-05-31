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
  AdminMore:          undefined
}

// ────────────────────────────────────────────────
// User Tabs
// ────────────────────────────────────────────────
export type UserTabParamList = {
  Home:     undefined
  History:  NavigatorScreenParams<HistoryStackParamList>
  Stats:    undefined
  Category: NavigatorScreenParams<CategoryStackParamList>
  More:     NavigatorScreenParams<MoreStackParamList>
}

export type HistoryStackParamList = {
  HistoryMain:     undefined
  TransactionEdit: { id?: string }
}

export type CategoryStackParamList = {
  CategoryMain: undefined
  CategoryEdit: { id?: string }
}

export type MoreStackParamList = {
  MoreMain:            undefined
  FixedExpenses:       undefined
  FixedExpenseDetail:  { id: string }
  FixedExpenseEdit:    { id?: string }
  PaymentMethods:      undefined
  PaymentMethodEdit:   { id?: string; returnToTransaction?: boolean }
  MyInfo:              undefined
  PasswordChange:      undefined
}
