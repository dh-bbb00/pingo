import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { moreRoutes } from './config'

const Stack = createNativeStackNavigator<MoreStackParamList>()

export function MoreNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {moreRoutes.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name as keyof MoreStackParamList}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  )
}
