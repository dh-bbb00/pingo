import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { FixedExpenseDetail } from '@/api/endpoints/fixedExpenses.api'
import { makeStyles } from './FixedExpenseItem.styles'

interface Props {
  item:           FixedExpenseDetail
  pendingOff:     Set<string>
  onPress:        () => void
  onToggleActive: () => void
}

const s = strings.fixedExpenses

export default function FixedExpenseItem({ item, pendingOff, onPress, onToggleActive }: Props) {
  const { theme } = useTheme()
  const styles    = useMemo(() => makeStyles(theme), [theme])

  const isActive = pendingOff.has(item.id) ? false : item.isActive

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: item.category?.color ?? theme.colors.surfaceVariant }]}>
        <Text style={styles.iconEmoji}>{item.category?.icon ?? '•'}</Text>
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
        value={isActive}
        onValueChange={onToggleActive}
        trackColor={{ false: theme.colors.divider, true: theme.colors.primaryLight }}
        thumbColor={isActive ? theme.colors.primary : theme.colors.text.disabled}
      />
    </TouchableOpacity>
  )
}
