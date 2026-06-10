import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { DATE_TAB } from '@/api/endpoints/stats.api'
import type { StatsDateTab } from '@/api/endpoints/stats.api'

const TABS: StatsDateTab[] = [DATE_TAB.DAY, DATE_TAB.MONTH, DATE_TAB.YEAR, DATE_TAB.RANGE]

const TAB_LABEL: Record<StatsDateTab, string> = {
  [DATE_TAB.DAY]:   strings.stats.tabDay,
  [DATE_TAB.MONTH]: strings.stats.tabMonth,
  [DATE_TAB.YEAR]:  strings.stats.tabYear,
  [DATE_TAB.RANGE]: strings.stats.tabRange,
}

interface Props {
  activeTab: StatsDateTab
  onTabChange: (tab: StatsDateTab) => void
}

export default function DateSubTabs({ activeTab, onTabChange }: Props) {
  const { theme } = useTheme()
  return (
    <View style={[ss.tabBar, { backgroundColor: theme.colors.surfaceVariant }]}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[ss.tab, activeTab === tab && { backgroundColor: theme.colors.surface }]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[
            ss.tabText,
            { color: activeTab === tab ? theme.colors.text.primary : theme.colors.text.secondary },
            activeTab === tab && { fontWeight: '600' },
          ]}>
            {TAB_LABEL[tab]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const ss = StyleSheet.create({
  tabBar: { flexDirection: 'row', marginHorizontal: 16, borderRadius: 10, padding: 3 },
  tab:    { flex: 1, paddingVertical: 7, alignItems: 'center', borderRadius: 8 },
  tabText:{ fontSize: 13 },
})
