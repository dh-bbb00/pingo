import React from 'react'
import { View, StyleSheet } from 'react-native'
import SkeletonBox from '@/components/containers/SkeletonBox'

export default function TransactionItemSkeleton() {
  return (
    <View style={s.row}>
      <SkeletonBox width={38} height={38} radius={12} style={s.icon} />
      <View style={s.middle}>
        <SkeletonBox width="52%" height={13} radius={4} style={s.line1} />
        <SkeletonBox width="36%" height={11} radius={4} />
      </View>
      <SkeletonBox width={62} height={13} radius={4} />
    </View>
  )
}

const s = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  icon:   { marginRight: 12 },
  middle: { flex: 1, marginRight: 8 },
  line1:  { marginBottom: 5 },
})
