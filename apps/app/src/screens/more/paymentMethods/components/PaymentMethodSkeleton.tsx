import React from 'react'
import { View, StyleSheet } from 'react-native'
import SkeletonBox from '@/components/containers/SkeletonBox'

export default function PaymentMethodSkeleton() {
  return (
    <View style={s.outerRow}>
      <View style={s.row}>
        <SkeletonBox width={36} height={36} radius={10} style={s.icon} />
        <View style={s.info}>
          <SkeletonBox width="50%" height={13} radius={4} style={s.line1} />
          <SkeletonBox width="32%" height={11} radius={4} />
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  outerRow: { marginHorizontal: 16, marginBottom: 6 },
  row:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  icon:     { marginRight: 10 },
  info:     { flex: 1 },
  line1:    { marginBottom: 5 },
})
