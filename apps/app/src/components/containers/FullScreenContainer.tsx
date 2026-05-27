import React from 'react'
import { View, StyleSheet, type ViewStyle } from 'react-native'

interface Props {
  children: React.ReactNode
  style?: ViewStyle
}

/**
 * 헤더가 있는 화면에서 전체 화면 기준으로 콘텐츠를 배치할 때 사용.
 * navigation 옵션에 headerTransparent: true를 설정하면 콘텐츠가 화면 최상단부터 시작하므로
 * justifyContent: 'center'가 헤더 높이에 영향받지 않고 정중앙에 위치한다.
 * → config.ts의 backHeaderTransparent 옵션과 함께 사용.
 */
export default function FullScreenContainer({ children, style }: Props) {
  return (
    <View style={[s.base, style]}>
      {children}
    </View>
  )
}

const s = StyleSheet.create({
  base: { flex: 1, justifyContent: 'center', padding: 24 },
})
