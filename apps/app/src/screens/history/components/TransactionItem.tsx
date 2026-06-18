import React, { useMemo, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
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

  const [tooltipVisible, setTooltipVisible] = useState(false)
  const fadeAnim      = useRef(new Animated.Value(0)).current
  const activeRef     = useRef(false)

  const handleLongPress = () => {
    if (!item.memo) return
    activeRef.current = true
    setTooltipVisible(true)
    Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start()
  }

  const handlePressOut = () => {
    if (!activeRef.current) return
    activeRef.current = false
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setTooltipVisible(false)
    })
  }

  const cat = item.category

  return (
    <View>
      {tooltipVisible && item.memo && (
        <Animated.View style={[styles.tooltip, { backgroundColor: theme.colors.surfaceVariant, opacity: fadeAnim }]}>
          <Text style={[styles.tooltipText, { color: theme.colors.text.secondary }]} numberOfLines={3}>
            {item.memo}
          </Text>
        </Animated.View>
      )}
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
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
    </View>
  )
}
