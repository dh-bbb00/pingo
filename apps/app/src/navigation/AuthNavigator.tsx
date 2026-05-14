import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AuthStackParamList } from '@/types/navigation'
import { authRoutes } from './config'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authRoutes.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name as keyof AuthStackParamList}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  )
}
