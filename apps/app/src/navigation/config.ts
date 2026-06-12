import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { ComponentType } from 'react'

import { strings } from '@/constants/strings'

import LoginScreen              from '@/screens/auth/LoginScreen'
import ApprovalRequestScreen    from '@/screens/auth/ApprovalRequestScreen'
import ApprovalPendingScreen    from '@/screens/auth/ApprovalPendingScreen'
import DeviceChangeScreen       from '@/screens/auth/DeviceChangeScreen'
import RejectedAccountScreen    from '@/screens/auth/RejectedAccountScreen'

import UserManagementScreen     from '@/screens/admin/userManagement/UserManagementScreen'
import ApprovalManagementScreen from '@/screens/admin/approvalManagement/ApprovalManagementScreen'
import AdminMoreScreen          from '@/screens/admin/adminMore/AdminMoreScreen'
import SchedulerManagementScreen from '@/screens/admin/schedulerManagement/SchedulerManagementScreen'
import SchedulerLogDetailScreen  from '@/screens/admin/schedulerManagement/SchedulerLogDetailScreen'

import HistoryScreen            from '@/screens/history/HistoryScreen'
import TransactionEditScreen    from '@/screens/history/TransactionEditScreen'

import CategoryScreen           from '@/screens/category/CategoryScreen'
import CategoryEditScreen       from '@/screens/category/CategoryEditScreen'

import MoreScreen                  from '@/screens/more/MoreScreen'
import PendingNotificationsScreen  from '@/screens/more/pendingNotifications/PendingNotificationsScreen'
import FixedExpensesScreen         from '@/screens/more/fixedExpenses/FixedExpensesScreen'
import FixedExpenseEditScreen      from '@/screens/more/fixedExpenses/FixedExpenseEditScreen'
import PaymentMethodsScreen        from '@/screens/more/paymentMethods/PaymentMethodsScreen'
import PaymentMethodEditScreen     from '@/screens/more/paymentMethods/PaymentMethodEditScreen'
import MyInfoScreen                from '@/screens/more/myInfo/MyInfoScreen'
import PasswordChangeScreen        from '@/screens/more/myInfo/PasswordChangeScreen'
import HomeScreen               from '@/screens/home/HomeScreen'
import StatsScreen              from '@/screens/stats/StatsScreen'
import SplashScreen             from '@/screens/splash/SplashScreen'

import { AuthNavigator }      from './AuthNavigator'
import { AdminTabNavigator }  from './AdminTabNavigator'
import { AdminMoreNavigator } from './AdminMoreNavigator'
import { UserTabNavigator }   from './UserTabNavigator'
import { HistoryNavigator }   from './HistoryNavigator'
import { CategoryNavigator }  from './CategoryNavigator'
import { MoreNavigator }      from './MoreNavigator'

export interface StackRoute {
  name: string
  component: ComponentType<any>
  options?: NativeStackNavigationOptions
}

export interface TabRoute {
  name: string
  component: ComponentType<any>
  options?: BottomTabNavigationOptions
}

const backHeader: NativeStackNavigationOptions = {
  headerShown: true,
  title: '',
  headerShadowVisible: false,
}

/** FullScreenContainer 사용 화면 전용 — 콘텐츠가 헤더 아래가 아닌 화면 최상단부터 시작 */
const backHeaderTransparent: NativeStackNavigationOptions = {
  ...backHeader,
  headerTransparent: true,
}

export const authRoutes: StackRoute[] = [
  { name: 'Login',           component: LoginScreen },
  { name: 'ApprovalRequest', component: ApprovalRequestScreen, options: backHeaderTransparent },
  { name: 'ApprovalPending', component: ApprovalPendingScreen, options: backHeaderTransparent },
  { name: 'DeviceChange',    component: DeviceChangeScreen,    options: backHeaderTransparent },
  { name: 'RejectedAccount', component: RejectedAccountScreen, options: backHeaderTransparent },
]

export const adminTabRoutes: TabRoute[] = [
  { name: 'UserManagement',     component: UserManagementScreen,     options: { title: strings.adminTabs.userManagement } },
  { name: 'ApprovalManagement', component: ApprovalManagementScreen, options: { title: strings.adminTabs.approvalManagement } },
  { name: 'AdminMore',          component: AdminMoreNavigator,       options: { title: strings.adminTabs.more } },
]

export const adminMoreRoutes: StackRoute[] = [
  { name: 'AdminMoreMain',       component: AdminMoreScreen },
  { name: 'SchedulerManagement', component: SchedulerManagementScreen, options: backHeader },
  { name: 'SchedulerLogDetail',  component: SchedulerLogDetailScreen,  options: backHeader },
]

export const historyRoutes: StackRoute[] = [
  { name: 'HistoryMain',     component: HistoryScreen },
  { name: 'TransactionEdit', component: TransactionEditScreen, options: backHeader },
]

export const categoryRoutes: StackRoute[] = [
  { name: 'CategoryMain', component: CategoryScreen },
  { name: 'CategoryEdit', component: CategoryEditScreen, options: backHeader },
]

export const moreRoutes: StackRoute[] = [
  { name: 'MoreMain',           component: MoreScreen },
  { name: 'FixedExpenses',      component: FixedExpensesScreen,      options: backHeader },
  { name: 'FixedExpenseEdit',   component: FixedExpenseEditScreen,   options: backHeader },
  { name: 'PaymentMethods',    component: PaymentMethodsScreen,     options: backHeader },
  { name: 'PaymentMethodEdit', component: PaymentMethodEditScreen,  options: backHeader },
  { name: 'MyInfo',             component: MyInfoScreen,             options: backHeader },
  { name: 'PasswordChange',     component: PasswordChangeScreen,     options: backHeader },
  { name: 'PendingNotifications', component: PendingNotificationsScreen, options: backHeader },
]

export const userTabRoutes: TabRoute[] = [
  { name: 'Home',     component: HomeScreen,        options: { title: strings.userTabs.home } },
  { name: 'History',  component: HistoryNavigator,  options: { title: strings.userTabs.history } },
  { name: 'Stats',    component: StatsScreen,       options: { title: strings.userTabs.stats } },
  { name: 'Category', component: CategoryNavigator, options: { title: strings.userTabs.category } },
  { name: 'More',     component: MoreNavigator,     options: { title: strings.userTabs.more } },
]

export const rootRoutes: StackRoute[] = [
  { name: 'Splash',    component: SplashScreen },
  { name: 'Auth',      component: AuthNavigator },
  { name: 'AdminTabs', component: AdminTabNavigator },
  { name: 'UserTabs',  component: UserTabNavigator },
]
