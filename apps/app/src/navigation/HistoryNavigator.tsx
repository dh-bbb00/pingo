import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HistoryScreen from '@/screens/history/HistoryScreen'
import TransactionEditScreen from '@/screens/history/TransactionEditScreen'
import type { HistoryStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<HistoryStackParamList>()

export function HistoryNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistoryMain"     component={HistoryScreen} />
      <Stack.Screen name="TransactionEdit" component={TransactionEditScreen} />
    </Stack.Navigator>
  )
}
