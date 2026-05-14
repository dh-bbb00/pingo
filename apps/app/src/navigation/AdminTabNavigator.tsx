import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UserManagementScreen from '@/screens/admin/UserManagementScreen'
import ApprovalManagementScreen from '@/screens/admin/ApprovalManagementScreen'
import type { AdminTabParamList } from '@/types/navigation'

const Tab = createBottomTabNavigator<AdminTabParamList>()

export function AdminTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="UserManagement"     component={UserManagementScreen}     options={{ title: '유저 관리' }} />
      <Tab.Screen name="ApprovalManagement" component={ApprovalManagementScreen} options={{ title: '승인 관리' }} />
    </Tab.Navigator>
  )
}
