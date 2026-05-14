import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { AdminTabParamList } from '@/types/navigation'
import { adminTabRoutes } from './config'

const Tab = createBottomTabNavigator<AdminTabParamList>()

export function AdminTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {adminTabRoutes.map(({ name, component, options }) => (
        <Tab.Screen
          key={name}
          name={name as keyof AdminTabParamList}
          component={component}
          options={options}
        />
      ))}
    </Tab.Navigator>
  )
}
