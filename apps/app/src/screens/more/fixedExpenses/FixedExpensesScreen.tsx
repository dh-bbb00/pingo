import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { Screens } from '@/constants/screens'
import type { FixedExpensesViewTab, FixedExpenseDetail } from './types'
import { useFixedExpensesView } from './hooks/useFixedExpensesView'
import { styles } from './FixedExpensesScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'FixedExpenses'>

const VIEW_TABS: FixedExpensesViewTab[] = ['리스트', '달력']

export default function FixedExpensesScreen() {
  const navigation = useNavigation<Nav>()
  const { activeTab, setActiveTab } = useFixedExpensesView()

  // TODO: 고정 지출 목록 API 연동

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>고정 지출 관리</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(Screens.More.FixedExpenseEdit, {})}
        >
          <Text style={styles.addButtonText}>+ 추가</Text>
        </TouchableOpacity>
      </View>

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
        ListEmptyComponent={<Text style={styles.empty}>등록된 고정 지출이 없습니다.</Text>}
      />
    </View>
  )
}
