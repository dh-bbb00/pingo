import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { Transaction } from '@/api/endpoints/transactions.api'
import { makeStyles } from './TransactionItem.styles'
import { useMemoTooltip } from '@/hooks/useMemoTooltip'
import MemoTooltip from '@/components/MemoTooltip'

interface Props {
  item:    Transaction
  onPress: () => void
}

export default function TransactionItem({ item, onPress }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])
  const { rowRef, visible, bottom, show, hide } = useMemoTooltip(item.memo)

  const cat = item.category

  return (
    <>
      {item.memo && (
        <MemoTooltip memo={item.memo} visible={visible} bottom={bottom} onDismiss={hide} />
      )}
      <TouchableOpacity
        ref={rowRef}
        style={styles.row}
        onPress={onPress}
        onLongPress={show}
        onPressOut={hide}
        delayLongPress={300}
        activeOpacity={0.7}
      >
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
    </>
  )
}
