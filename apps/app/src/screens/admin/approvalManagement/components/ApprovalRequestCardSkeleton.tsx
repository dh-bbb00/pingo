import React from 'react'
import { View, StyleSheet } from 'react-native'
import SkeletonBox from '@/components/containers/SkeletonBox'
import { useTheme } from '@/theme'

export default function ApprovalRequestCardSkeleton() {
  const { theme } = useTheme()
  return (
    <View style={[s.card, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg }]}>
      <View style={s.headerRow}>
        <SkeletonBox width="55%" height={14} radius={4} />
        <SkeletonBox width={60}  height={20} radius={10} />
      </View>
      <SkeletonBox width="70%" height={11} radius={4} style={s.meta} />
      <SkeletonBox width="45%" height={11} radius={4} style={s.meta} />
      <View style={s.actions}>
        <SkeletonBox width="48%" height={36} radius={8} />
        <SkeletonBox width="48%" height={36} radius={8} />
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  card:      { padding: 16, marginBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  meta:      { marginBottom: 6 },
  actions:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
})
