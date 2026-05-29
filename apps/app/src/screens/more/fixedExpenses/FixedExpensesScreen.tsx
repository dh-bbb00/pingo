import React, { useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import type { FixedExpensesViewTab, FixedExpenseDetail } from './types'
import { useFixedExpensesView } from './hooks/useFixedExpensesView'
import { makeStyles } from './FixedExpensesScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'FixedExpenses'>

const s = strings.fixedExpenses
const VIEW_TABS: FixedExpensesViewTab[] = [s.tabList, s.tabCalendar]

export default function FixedExpensesScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { activeTab, setActiveTab } = useFixedExpensesView()

  // TODO: 고정 지출 목록 API 연동

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <View style={styles.tabBar}>
        {VIEW_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList<FixedExpenseDetail>
        data={[]}
        keyExtractor={(item) => item.id}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>{s.empty}</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Screens.More.FixedExpenseEdit, {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}
