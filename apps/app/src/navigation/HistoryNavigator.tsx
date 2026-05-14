import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { HistoryStackParamList } from '@/types/navigation'
import { historyRoutes } from './config'

const Stack = createNativeStackNavigator<HistoryStackParamList>()

export function HistoryNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {historyRoutes.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name as keyof HistoryStackParamList}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  )
}
