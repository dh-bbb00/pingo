import React, { useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, Switch, RefreshControl } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import type { FixedExpenseDetail } from './types'
import { makeStyles } from './FixedExpensesScreen.styles'
import { useFixedExpenses, useUpdateFixedExpense } from '@/hooks/queries/useFixedExpenses'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { handleApiError } from '@/api/errorHandler'
import FixedExpenseItemSkeleton from './components/FixedExpenseItemSkeleton'

const SKELETON_KEYS = Array.from({ length: 5 }, (_, i) => `sk-${i}`)

type Nav = NativeStackNavigationProp<MoreStackParamList, 'FixedExpenses'>

const s = strings.fixedExpenses
const se = strings.fixedExpenseEdit

export default function FixedExpensesScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { data: items, isLoading, refetch } = useFixedExpenses()
  const { refreshing, onRefresh } = usePullToRefresh(refetch)
  const { mutate: updateItem } = useUpdateFixedExpense()

  // confirm 대기 중인 항목 id — 스위치 스냅백 방지를 위해 낙관적으로 OFF 상태 유지
  const [pendingOff, setPendingOff] = React.useState<Set<string>>(new Set())

  function handleToggleActive(item: FixedExpenseDetail) {
    if (item.isActive) {
      setPendingOff((prev) => new Set(prev).add(item.id))
      showConfirm(se.confirmDisableTitle, se.confirmDisableMsg, [
        {
          text: se.confirmDisableCancel,
          style: 'cancel',
          onPress: () => setPendingOff((prev) => { const next = new Set(prev); next.delete(item.id); return next }),
        },
        {
          text: se.confirmDisableOk,
          style: 'destructive',
          onPress: () => {
            setPendingOff((prev) => { const next = new Set(prev); next.delete(item.id); return next })
            updateItem(
              { id: item.id, payload: { isActive: false } },
              { onError: (e) => handleApiError(e) },
            )
          },
        },
      ])
    } else {
      updateItem(
        { id: item.id, payload: { isActive: true } },
        { onError: (e) => handleApiError(e) },
      )
    }
  }

  function renderItem({ item }: { item: FixedExpenseDetail }) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate(Screens.More.FixedExpenseEdit, { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrap, { backgroundColor: item.category.color }]}>
          <Text style={styles.iconEmoji}>{item.category.icon}</Text>
        </View>
        <View style={styles.itemBody}>
          <View style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>{item.merchantName}</Text>
            <Text style={styles.itemAmount}>{item.amount.toLocaleString()}원</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemSub}>{s.dayOfMonthFmt(item.dayOfMonth)}</Text>
            {item.paymentMethod && (
              <Text style={styles.itemSub}>{item.paymentMethod.name}</Text>
            )}
          </View>
        </View>
        <Switch
          value={pendingOff.has(item.id) ? false : item.isActive}
          onValueChange={() => handleToggleActive(item)}
          trackColor={{ false: theme.colors.divider, true: theme.colors.primaryLight }}
          thumbColor={(pendingOff.has(item.id) ? false : item.isActive) ? theme.colors.primary : theme.colors.text.disabled}
        />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      {isLoading && !items ? (
        <View style={styles.list}>
          {SKELETON_KEYS.map((key, i) => (
            <React.Fragment key={key}>
              <FixedExpenseItemSkeleton />
              {i < SKELETON_KEYS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      ) : (
        <FlatList<FixedExpenseDetail>
          data={items ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>{s.empty}</Text>
            </View>
          }
        />
      )}

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
