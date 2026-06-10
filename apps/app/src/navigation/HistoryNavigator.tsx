import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { HistoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { historyRoutes } from './config'

const Stack = createNativeStackNavigator<HistoryStackParamList>()

export function HistoryNavigator() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.text.primary,
      contentStyle: { backgroundColor: theme.colors.background },
    }}>
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
