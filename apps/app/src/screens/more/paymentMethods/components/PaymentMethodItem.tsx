import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import type { PaymentMethod } from '@/api/endpoints/paymentMethods.api'
import { PAYMENT_METHOD_EMOJI } from '@/constants/emojis'
import { makeStyles } from './PaymentMethodItem.styles'

interface Props {
  item:     PaymentMethod
  onPress?: () => void
}

export default function PaymentMethodItem({ item, onPress }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const inner = (
    <>
      <View style={styles.iconWrap}>
        <Text style={styles.iconEmoji}>{PAYMENT_METHOD_EMOJI[item.type]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
          {item.cardNumber ? <Text style={styles.cardNumber}> ({item.cardNumber})</Text> : null}
        </Text>
      </View>
      {item.isDefault && <Text style={styles.defaultTag}>기본</Text>}
    </>
  )

  if (onPress) {
    return (
      <View style={styles.outerRow}>
        <TouchableOpacity style={[styles.card, { flex: 1 }]} onPress={onPress} activeOpacity={0.7}>
          {inner}
        </TouchableOpacity>
      </View>
    )
  }

  // 비활성 항목(현금·상품권): 카드 배경 없이 플랫 행으로 표시
  return (
    <View style={styles.outerRow}>
      <View style={styles.flatRow}>{inner}</View>
    </View>
  )
}
