import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '@/screens/splash/SplashScreen'
import { AuthNavigator } from './AuthNavigator'
import { AdminTabNavigator } from './AdminTabNavigator'
import { UserTabNavigator } from './UserTabNavigator'
import type { RootStackParamList } from '@/types/navigation'

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
      <Stack.Screen name="Splash"     component={SplashScreen} />
      <Stack.Screen name="Auth"       component={AuthNavigator} />
      <Stack.Screen name="AdminTabs"  component={AdminTabNavigator} />
      <Stack.Screen name="UserTabs"   component={UserTabNavigator} />
    </Stack.Navigator>
  )
}
