import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '@/screens/home/HomeScreen'
import StatsScreen from '@/screens/stats/StatsScreen'
import { HistoryNavigator } from './HistoryNavigator'
import { CategoryNavigator } from './CategoryNavigator'
import { MoreNavigator } from './MoreNavigator'
import type { UserTabParamList } from '@/types/navigation'

const Tab = createBottomTabNavigator<UserTabParamList>()

export function UserTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home"     component={HomeScreen}        options={{ title: '홈' }} />
      <Tab.Screen name="History"  component={HistoryNavigator}  options={{ title: '내역' }} />
      <Tab.Screen name="Stats"    component={StatsScreen}       options={{ title: '통계' }} />
      <Tab.Screen name="Category" component={CategoryNavigator} options={{ title: '카테고리' }} />
      <Tab.Screen name="More"     component={MoreNavigator}     options={{ title: '전체' }} />
    </Tab.Navigator>
  )
}
