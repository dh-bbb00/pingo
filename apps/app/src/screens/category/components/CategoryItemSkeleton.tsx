import React, { useMemo } from 'react'
import { View } from 'react-native'
import { useTheme } from '@/theme'
import SkeletonBox from '@/components/containers/SkeletonBox'
import { makeStyles } from './CategoryItemSkeleton.styles'

export default function CategoryItemSkeleton() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  return (
    <View style={styles.outerRow}>
      <View style={styles.card}>
        <SkeletonBox width={36} height={36} radius={11} style={styles.iconGap} />
        <View style={styles.textGroup}>
          <SkeletonBox width="55%" height={13} radius={4} style={styles.nameLine} />
          <SkeletonBox width="30%" height={11} radius={4} />
        </View>
      </View>
      <SkeletonBox width={24} height={24} radius={6} style={styles.statsIcon} />
    </View>
  )
}
