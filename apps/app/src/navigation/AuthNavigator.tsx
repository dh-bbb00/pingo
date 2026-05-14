import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '@/screens/auth/LoginScreen'
import ApprovalRequestScreen from '@/screens/auth/ApprovalRequestScreen'
import ApprovalPendingScreen from '@/screens/auth/ApprovalPendingScreen'
import DeviceChangeScreen from '@/screens/auth/DeviceChangeScreen'
import type { AuthStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"           component={LoginScreen} />
      <Stack.Screen name="ApprovalRequest" component={ApprovalRequestScreen} options={{ headerShown: true, title: '', headerShadowVisible: false }} />
      <Stack.Screen name="ApprovalPending" component={ApprovalPendingScreen} options={{ headerShown: true, title: '', headerShadowVisible: false }} />
      <Stack.Screen name="DeviceChange"    component={DeviceChangeScreen}    options={{ headerShown: true, title: '', headerShadowVisible: false }} />
    </Stack.Navigator>
  )
}
