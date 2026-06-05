import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { StatsDateTab } from '../types'

const TABS: StatsDateTab[] = ['일', '월', '년', '기간']
const s = strings.stats

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
            {tab === '일' ? s.tabDay : tab === '월' ? s.tabMonth : tab === '년' ? s.tabYear : s.tabRange}
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
