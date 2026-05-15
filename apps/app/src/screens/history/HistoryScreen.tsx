import React from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { HistoryStackParamList } from '@/types/navigation'
import { Screens } from '@/constants/screens'
import type { HistoryDateTab } from './types'
import { useHistoryFilter } from './hooks/useHistoryFilter'
import { styles } from './HistoryScreen.styles'

type Nav = NativeStackNavigationProp<HistoryStackParamList, 'HistoryMain'>

const DATE_TABS: HistoryDateTab[] = ['일', '월', '년']

export default function HistoryScreen() {
  const navigation = useNavigation<Nav>()
  const { filter, setTab } = useHistoryFilter()

  // TODO: filter 값으로 내역 목록 API 연동

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>내역</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(Screens.History.TransactionEdit, {})}
        >
          <Text style={styles.addButtonText}>+ 추가</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {DATE_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter.tab === tab && styles.tabActive]}
            onPress={() => setTab(tab)}
          >
            <Text style={[styles.tabText, filter.tab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>내역이 없습니다.</Text>}
      />
    </SafeAreaView>
  )
}
