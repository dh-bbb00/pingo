import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { Transaction } from '@/api/endpoints/transactions.api'
import { makeStyles } from './TransactionItem.styles'

interface Props {
  item:    Transaction
  onPress: () => void
}

export default function TransactionItem({ item, onPress }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const cat = item.category

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: cat?.color ?? theme.colors.surfaceVariant }]}>
        <Text style={styles.iconEmoji}>{cat?.icon ?? '•'}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.merchant} numberOfLines={1}>{item.merchantName}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {[cat?.name ?? strings.history.noCategory, item.paymentMethod?.name].filter(Boolean).join(' · ')}
        </Text>
      </View>
      <Text style={styles.amount}>{item.amount.toLocaleString()}원</Text>
    </TouchableOpacity>
  )
}
