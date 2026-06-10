import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import type { CategoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { categoryRoutes } from './config'

const Stack = createNativeStackNavigator<CategoryStackParamList>()

export function CategoryNavigator() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.text.primary,
      contentStyle: { backgroundColor: theme.colors.background },
    }}>
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
