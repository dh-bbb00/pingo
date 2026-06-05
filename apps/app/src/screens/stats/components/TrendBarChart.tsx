import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'

interface BarDataItem {
  value: number
  label?: string
}

interface Props {
  data:    BarDataItem[]
  title?:  string
}

const SCREEN_W = Dimensions.get('window').width
const CHART_W  = SCREEN_W - 32

export default function TrendBarChart({ data, title }: Props) {
  const { theme } = useTheme()

  const hasData = data.some(d => d.value > 0)
  const count   = data.length
  const spacing = count > 20 ? 2 : count > 10 ? 4 : 8
  const barW    = Math.max(5, Math.floor((CHART_W - spacing * (count + 1)) / count))

  if (!hasData) {
    return (
      <View style={ss.emptyWrap}>
        <Text style={[ss.emptyText, { color: theme.colors.text.disabled }]}>
          {strings.stats.noData}
        </Text>
      </View>
    )
  }

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      {title && <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>}
      <BarChart
        data={data}
        barWidth={barW}
        spacing={spacing}
        barBorderRadius={3}
        frontColor={theme.colors.primary}
        noOfSections={3}
        maxValue={Math.max(...data.map(d => d.value)) * 1.2}
        width={CHART_W - 24}
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: theme.colors.text.disabled, fontSize: 9 }}
        xAxisLabelTextStyle={{ color: theme.colors.text.disabled, fontSize: 9 }}
        isAnimated
      />
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:      { borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  title:     { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  emptyWrap: { height: 80, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16 },
  emptyText: { fontSize: 13 },
})
