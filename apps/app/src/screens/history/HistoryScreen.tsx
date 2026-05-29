import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { HistoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import type { HistoryDateTab } from './types'
import { useHistoryFilter } from './hooks/useHistoryFilter'
import { makeStyles } from './HistoryScreen.styles'

type Nav = NativeStackNavigationProp<HistoryStackParamList, 'HistoryMain'>

const s = strings.history
const DATE_TABS: HistoryDateTab[] = [s.tabDay, s.tabMonth, s.tabYear]

export default function HistoryScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { filter, setTab } = useHistoryFilter()

  // TODO: filter 값으로 내역 목록 API 연동

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

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
        ListEmptyComponent={<Text style={styles.empty}>{s.empty}</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Screens.History.TransactionEdit, {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
