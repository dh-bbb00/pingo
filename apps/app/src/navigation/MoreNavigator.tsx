import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MoreScreen from '@/screens/more/MoreScreen'
import FixedExpensesScreen from '@/screens/more/fixedExpenses/FixedExpensesScreen'
import FixedExpenseDetailScreen from '@/screens/more/fixedExpenses/FixedExpenseDetailScreen'
import FixedExpenseEditScreen from '@/screens/more/fixedExpenses/FixedExpenseEditScreen'
import MyInfoScreen from '@/screens/more/myInfo/MyInfoScreen'
import PasswordChangeScreen from '@/screens/more/myInfo/PasswordChangeScreen'
import type { MoreStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<MoreStackParamList>()

export function MoreNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreMain"           component={MoreScreen} />
      <Stack.Screen name="FixedExpenses"      component={FixedExpensesScreen} />
      <Stack.Screen name="FixedExpenseDetail" component={FixedExpenseDetailScreen} />
      <Stack.Screen name="FixedExpenseEdit"   component={FixedExpenseEditScreen} />
      <Stack.Screen name="MyInfo"             component={MyInfoScreen} />
      <Stack.Screen name="PasswordChange"     component={PasswordChangeScreen} />
    </Stack.Navigator>
  )
}
