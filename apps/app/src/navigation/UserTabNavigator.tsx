import React from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StackActions } from '@react-navigation/native'
import type { UserTabParamList } from '@/types/navigation'
import { userTabRoutes } from './config'
import { AppTabBar } from './AppTabBar'
import PendingNotificationsBanner from '@/components/banner/PendingNotificationsBanner'

const Tab = createBottomTabNavigator<UserTabParamList>()

export function UserTabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <PendingNotificationsBanner />
      <Tab.Navigator
        tabBar={AppTabBar}
        screenOptions={{ headerShown: false }}
      >
      {userTabRoutes.map(({ name, component, options }) => (
        <Tab.Screen
          key={name}
          name={name as keyof UserTabParamList}
          component={component}
          options={options}
          listeners={({ navigation, route }) => {
            // route.state는 중첩 네비게이터 상태로 런타임에만 존재 — RouteProp 타입에 미포함
            const popToTopIfNested = () => {
              const nestedState = (route as { state?: { index?: number; key?: string } }).state
              if ((nestedState?.index ?? 0) > 0 && nestedState?.key) {
                navigation.dispatch({ ...StackActions.popToTop(), target: nestedState.key })
              }
            }
            if (name === 'History') {
              // 같은 탭 재탭 시 스택 초기화
              // 다른 탭 이탈 시 초기화는 HistoryNavigator 내부의 useIsFocused로 처리
              // (CommonActions.reset 후 route.state에 key가 없어 blur 리스너가 동작하지 않는 문제 우회)
              return { tabPress: popToTopIfNested }
            }
            if (name === 'More') {
              return { tabPress: popToTopIfNested }
            }
            return {}
          }}
        />
      ))}
      </Tab.Navigator>
    </View>
  )
}
