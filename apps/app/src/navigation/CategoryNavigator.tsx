import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CategoryScreen from '@/screens/category/CategoryScreen'
import CategoryEditScreen from '@/screens/category/CategoryEditScreen'
import type { CategoryStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<CategoryStackParamList>()

export function CategoryNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoryMain" component={CategoryScreen} />
      <Stack.Screen name="CategoryEdit" component={CategoryEditScreen} />
    </Stack.Navigator>
  )
}
