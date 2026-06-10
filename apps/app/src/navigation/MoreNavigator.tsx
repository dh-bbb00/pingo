import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { moreRoutes } from './config'

const Stack = createNativeStackNavigator<MoreStackParamList>()

export function MoreNavigator() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.text.primary,
      contentStyle: { backgroundColor: theme.colors.background },
    }}>
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
