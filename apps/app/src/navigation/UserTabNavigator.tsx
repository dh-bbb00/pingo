import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StackActions } from '@react-navigation/native'
import type { UserTabParamList } from '@/types/navigation'
import { userTabRoutes } from './config'
import { AppTabBar } from './AppTabBar'

const Tab = createBottomTabNavigator<UserTabParamList>()

export function UserTabNavigator() {
  return (
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
              if ((route.state?.index ?? 0) > 0 && route.state?.key) {
                navigation.dispatch({ ...StackActions.popToTop(), target: route.state.key })
              }
            },
          }) : undefined}
        />
      ))}
    </Tab.Navigator>
  )
}
