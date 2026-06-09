import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StackActions } from '@react-navigation/native'
import type { AdminTabParamList } from '@/types/navigation'
import { adminTabRoutes } from './config'
import { AppTabBar } from './AppTabBar'

const Tab = createBottomTabNavigator<AdminTabParamList>()

export function AdminTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={AppTabBar}
      screenOptions={{ headerShown: false }}
    >
      {adminTabRoutes.map(({ name, component, options }) => (
        <Tab.Screen
          key={name}
          name={name as keyof AdminTabParamList}
          component={component}
          options={options}
          listeners={name === 'AdminMore' ? ({ navigation, route }) => ({
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
  )
}
