import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import BarChartIcon from '@/components/icons/BarChartIcon'
import type { Category } from '@/api/endpoints/categories.api'
import { strings } from '@/constants/strings'
import { makeStyles } from './CategoryItem.styles'

const s = strings.category


interface Props {
  item:          Category
  onPress:       () => void
  onStatsPress?: () => void
}

export default function CategoryItem({ item, onPress, onStatsPress }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const hasBudget = item.budget !== null

  return (
    <View style={styles.outerRow}>

      {/* 카드 (수정) */}
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
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

      {/* 통계 아이콘 (카드 바깥) */}
      <TouchableOpacity style={styles.statsBtn} onPress={onStatsPress} activeOpacity={0.5}>
        <BarChartIcon color={theme.colors.text.disabled} />
      </TouchableOpacity>

    </View>
  )
}
