import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import type { ComponentType } from 'react'

import { strings } from '@/constants/strings'

import LoginScreen              from '@/screens/auth/LoginScreen'
import ApprovalRequestScreen    from '@/screens/auth/ApprovalRequestScreen'
import ApprovalPendingScreen    from '@/screens/auth/ApprovalPendingScreen'
import DeviceChangeScreen       from '@/screens/auth/DeviceChangeScreen'

import UserManagementScreen     from '@/screens/admin/UserManagementScreen'
import ApprovalManagementScreen from '@/screens/admin/ApprovalManagementScreen'

import HistoryScreen            from '@/screens/history/HistoryScreen'
import TransactionEditScreen    from '@/screens/history/TransactionEditScreen'

import CategoryScreen           from '@/screens/category/CategoryScreen'
import CategoryEditScreen       from '@/screens/category/CategoryEditScreen'

import MoreScreen               from '@/screens/more/MoreScreen'
import FixedExpensesScreen      from '@/screens/more/fixedExpenses/FixedExpensesScreen'
import FixedExpenseDetailScreen from '@/screens/more/fixedExpenses/FixedExpenseDetailScreen'
import FixedExpenseEditScreen   from '@/screens/more/fixedExpenses/FixedExpenseEditScreen'
import MyInfoScreen             from '@/screens/more/myInfo/MyInfoScreen'
import PasswordChangeScreen     from '@/screens/more/myInfo/PasswordChangeScreen'
import HomeScreen               from '@/screens/home/HomeScreen'
import StatsScreen              from '@/screens/stats/StatsScreen'
import SplashScreen             from '@/screens/splash/SplashScreen'

import { AuthNavigator }     from './AuthNavigator'
import { AdminTabNavigator } from './AdminTabNavigator'
import { UserTabNavigator }  from './UserTabNavigator'
import { HistoryNavigator }  from './HistoryNavigator'
import { CategoryNavigator } from './CategoryNavigator'
import { MoreNavigator }     from './MoreNavigator'

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

export const authRoutes: StackRoute[] = [
  { name: 'Login',           component: LoginScreen },
  { name: 'ApprovalRequest', component: ApprovalRequestScreen, options: backHeader },
  { name: 'ApprovalPending', component: ApprovalPendingScreen, options: backHeader },
  { name: 'DeviceChange',    component: DeviceChangeScreen,    options: backHeader },
]

export const adminTabRoutes: TabRoute[] = [
  { name: 'UserManagement',     component: UserManagementScreen,     options: { title: strings.adminTabs.userManagement } },
  { name: 'ApprovalManagement', component: ApprovalManagementScreen, options: { title: strings.adminTabs.approvalManagement } },
]

export const historyRoutes: StackRoute[] = [
  { name: 'HistoryMain',     component: HistoryScreen },
  { name: 'TransactionEdit', component: TransactionEditScreen },
]

export const categoryRoutes: StackRoute[] = [
  { name: 'CategoryMain', component: CategoryScreen },
  { name: 'CategoryEdit', component: CategoryEditScreen },
]

export const moreRoutes: StackRoute[] = [
  { name: 'MoreMain',           component: MoreScreen },
  { name: 'FixedExpenses',      component: FixedExpensesScreen },
  { name: 'FixedExpenseDetail', component: FixedExpenseDetailScreen },
  { name: 'FixedExpenseEdit',   component: FixedExpenseEditScreen },
  { name: 'MyInfo',             component: MyInfoScreen },
  { name: 'PasswordChange',     component: PasswordChangeScreen },
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
