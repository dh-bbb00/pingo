import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { styles } from './MoreScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'MoreMain'>

const MENU_ITEMS: { label: string; screen: keyof MoreStackParamList }[] = [
  { label: '고정 지출 관리', screen: 'FixedExpenses' },
  { label: '내 정보',       screen: 'MyInfo' },
]

export default function MoreScreen() {
  const navigation = useNavigation<Nav>()

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>전체</Text>

      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.screen as any)}
        >
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  )
}
