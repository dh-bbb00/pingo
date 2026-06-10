import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { AdminMoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { adminMoreRoutes } from './config'

const Stack = createNativeStackNavigator<AdminMoreStackParamList>()

export function AdminMoreNavigator() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.text.primary,
      contentStyle: { backgroundColor: theme.colors.background },
    }}>
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
