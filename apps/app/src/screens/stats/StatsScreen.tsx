import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { StatsDateTab } from './types'
import { useStatsFilter } from './hooks/useStatsFilter'
import { makeStyles } from './StatsScreen.styles'

const s = strings.stats
const DATE_TABS: StatsDateTab[] = [s.tabDay, s.tabMonth, s.tabYear]

export default function StatsScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { filter, setTab } = useStatsFilter()

  // TODO: filter 값으로 통계 API 연동
  // - 일: 시간대별 Line Chart, 카테고리 Pie Chart, TOP10, 전일 대비
  // - 월: 날짜별 Line Chart, 카테고리 Pie Chart, TOP10, 전월 대비
  // - 년: 최근 5년, 카테고리 Pie Chart, TOP10, 전년 대비

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <View style={styles.tabBar}>
        {DATE_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter.tab === tab && styles.tabActive]}
            onPress={() => setTab(tab)}
          >
            <Text style={[styles.tabText, filter.tab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>{s.placeholder(filter.tab)}</Text>
      </View>
    </SafeAreaView>
  )
}
