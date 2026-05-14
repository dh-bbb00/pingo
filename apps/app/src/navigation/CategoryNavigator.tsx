import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { CategoryStackParamList } from '@/types/navigation'
import { categoryRoutes } from './config'

const Stack = createNativeStackNavigator<CategoryStackParamList>()

export function CategoryNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {categoryRoutes.map(({ name, component, options }) => (
        <Stack.Screen
          key={name}
          name={name as keyof CategoryStackParamList}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  )
}
