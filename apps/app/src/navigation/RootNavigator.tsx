import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { RootStackParamList } from '@/types/navigation'
import { rootRoutes } from './config'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      {rootRoutes.map(({ name, component }) => (
        <Stack.Screen
          key={name}
          name={name as keyof RootStackParamList}
          component={component}
        />
      ))}
    </Stack.Navigator>
  )
}
