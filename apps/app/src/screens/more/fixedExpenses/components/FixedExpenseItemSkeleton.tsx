import React from 'react'
import { View, StyleSheet } from 'react-native'
import SkeletonBox from '@/components/containers/SkeletonBox'

export default function FixedExpenseItemSkeleton() {
  return (
    <View style={s.row}>
      <SkeletonBox width={10} height={10} radius={5} style={s.dot} />
      <View style={s.body}>
        <View style={s.topRow}>
          <SkeletonBox width="42%" height={13} radius={4} />
          <SkeletonBox width={60} height={13} radius={4} />
        </View>
        <View style={s.bottomRow}>
          <SkeletonBox width="28%" height={11} radius={4} />
        </View>
      </View>
      <SkeletonBox width={44} height={24} radius={12} />
    </View>
  )
}

const s = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  dot:       { marginRight: 12 },
  body:      { flex: 1, marginRight: 8 },
  topRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  bottomRow: { flexDirection: 'row' },
})
