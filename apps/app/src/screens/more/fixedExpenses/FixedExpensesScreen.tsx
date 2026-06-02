import React, { useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, Switch, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import type { FixedExpenseDetail } from './types'
import { makeStyles } from './FixedExpensesScreen.styles'
import { useFixedExpenses, useUpdateFixedExpense } from '@/hooks/queries/useFixedExpenses'
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
  const { data: items, isLoading } = useFixedExpenses()
  const { mutate: updateItem } = useUpdateFixedExpense()

  function handleToggleActive(item: FixedExpenseDetail) {
    if (item.isActive) {
      Alert.alert(se.confirmDisableTitle, se.confirmDisableMsg, [
        { text: se.confirmDisableCancel, style: 'cancel' },
        {
          text: se.confirmDisableOk,
          style: 'destructive',
          onPress: () => updateItem(
            { id: item.id, payload: { isActive: false } },
            { onError: (e) => handleApiError(e) },
          ),
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
        <View style={[styles.categoryDot, { backgroundColor: item.category.color }]} />
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
          value={item.isActive}
          onValueChange={() => handleToggleActive(item)}
          trackColor={{ false: theme.colors.divider, true: theme.colors.primaryLight }}
          thumbColor={item.isActive ? theme.colors.primary : theme.colors.text.disabled}
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
