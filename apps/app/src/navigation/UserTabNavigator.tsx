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
          listeners={name === 'More' ? ({ navigation, route }) => ({
            tabPress: () => {
              // route.state는 중첩 네비게이터 상태로 런타임에만 존재 — RouteProp 타입에 미포함
              const nestedState = (route as { state?: { index?: number; key?: string } }).state
              if ((nestedState?.index ?? 0) > 0 && nestedState?.key) {
                navigation.dispatch({ ...StackActions.popToTop(), target: nestedState.key })
              }
            },
          }) : undefined}
        />
      ))}
      </Tab.Navigator>
    </View>
  )
}
