import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AdminMoreStackParamList } from '@/types/navigation'
import { adminMoreRoutes } from './config'

const Stack = createNativeStackNavigator<AdminMoreStackParamList>()

export function AdminMoreNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {adminMoreRoutes.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name as keyof AdminMoreStackParamList}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  )
}
