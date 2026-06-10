import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AuthStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { authRoutes } from './config'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      headerTintColor: theme.colors.text.primary,
    }}>
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
