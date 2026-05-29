import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import type { Category } from '@/api/endpoints/categories.api'
import { strings } from '@/constants/strings'
import { makeStyles } from './CategoryItem.styles'

const s = strings.category

interface Props {
  item:     Category
  isFirst?: boolean
  isLast?:  boolean
  onPress:  () => void
}

export default function CategoryItem({ item, isFirst, isLast, onPress }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const hasBudget = item.budget !== null

  return (
    <View>
      <TouchableOpacity
        style={[styles.row, isFirst && styles.rowFirst, isLast && styles.rowLast]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
          <Text style={styles.iconEmoji}>{item.icon}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={hasBudget ? styles.amount : styles.noAmount}>
          {hasBudget
            ? `${item.budget!.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`
            : s.noBudget}
        </Text>
      </TouchableOpacity>
      {!isLast && <View style={styles.sepWrap}><View style={styles.sepLine} /></View>}
    </View>
  )
}
