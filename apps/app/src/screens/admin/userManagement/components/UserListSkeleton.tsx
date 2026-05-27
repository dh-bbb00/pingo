import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import SkeletonBox from '@/components/containers/SkeletonBox'

const ITEM_COUNT = 8

export default function UserListSkeleton() {
  const { theme: t } = useTheme()

  return (
    <View style={styles.container}>
      {Array.from({ length: ITEM_COUNT }).map((_, i) => (
        <View key={i} style={[styles.item, { backgroundColor: t.colors.surface, borderRadius: t.radius.lg }]}>
          <SkeletonBox width="60%" height={14} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 8, gap: 8 },
  item:      { paddingHorizontal: 16, paddingVertical: 18 },
})
