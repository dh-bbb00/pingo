import React, { useMemo, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { CategoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { useCategories } from '@/hooks/queries/useCategories'
import CategoryItem from './components/CategoryItem'
import type { CategorySort } from './types'
import { makeStyles } from './CategoryScreen.styles'

type Nav = NativeStackNavigationProp<CategoryStackParamList, 'CategoryMain'>

const s = strings.category

type SortGroup = 'budget' | 'name' | 'date'

const SORT_GROUPS: { key: SortGroup; label: string }[] = [
  { key: 'date',   label: s.sortDate },
  { key: 'name',   label: s.sortName },
  { key: 'budget', label: s.sortBudget },
]

export default function CategoryScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const [sort, setSort] = useState<CategorySort>('date_desc')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCategories(sort)

  const handleSortPress = (key: SortGroup) => {
    const activeGroup = sort.split('_')[0] as SortGroup
    const activeDir   = sort.split('_')[1] as 'asc' | 'desc'
    if (key === activeGroup) {
      setSort(`${key}_${activeDir === 'desc' ? 'asc' : 'desc'}` as CategorySort)
    } else {
      setSort(`${key}_desc` as CategorySort)
    }
  }

  const categories = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])
  const meta        = data?.pages[0]?.pagination

  const ListHeader = (
    <View style={styles.sortRow}>
      {SORT_GROUPS.map(({ key, label }) => {
        const isActive = sort.startsWith(key)
        const arrow    = isActive ? (sort.endsWith('desc') ? ' ↓' : ' ↑') : ''
        return (
          <TouchableOpacity key={key} onPress={() => handleSortPress(key)} activeOpacity={0.6}>
            <Text style={[styles.sortText, isActive && styles.sortTextActive]}>
              {label}{arrow}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>

      {/* 헤더 — 스크롤 밖 고정 */}
      <View style={styles.headerWrap}>
        <Text style={styles.title}>{s.header}</Text>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>{s.statCountLabel}</Text>
            <Text style={styles.statNum}>{s.countFmt(meta?.total ?? 0)}</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>{s.statBudgetLabel}</Text>
            <Text style={styles.statNum}>{s.budgetFmt(meta?.totalBudget ?? 0)}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CategoryItem
            item={item}
            isFirst={index === 0}
            isLast={index === categories.length - 1}
            onPress={() => navigation.navigate(Screens.Category.CategoryEdit, { id: item.id })}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>{s.empty}</Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator style={styles.footer} color={theme.colors.primary} />
            : null
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
        onEndReachedThreshold={0.3}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Screens.Category.CategoryEdit, {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
