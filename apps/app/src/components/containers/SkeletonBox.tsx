import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, type ViewStyle } from 'react-native'
import { useTheme } from '@/theme'

interface Props {
  width?:  number | `${number}%`
  height?: number
  radius?: number
  style?:  ViewStyle
}

export default function SkeletonBox({ width = '100%', height = 16, radius = 4, style }: Props) {
  const { theme } = useTheme()
  const opacity   = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ]),
    ).start()
  }, [opacity])

  return (
    <Animated.View
      style={[
        s.base,
        { width, height, borderRadius: radius, backgroundColor: theme.colors.surfaceVariant, opacity },
        style,
      ]}
    />
  )
}

const s = StyleSheet.create({
  base: {},
})
