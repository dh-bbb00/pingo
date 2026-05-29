import React from 'react'
import Svg, { Path } from 'react-native-svg'

interface Props {
  direction: 'asc' | 'desc'
  color:     string
  size?:     number
}

export default function SortArrowIcon({ direction, color, size = 10 }: Props) {
  const d = direction === 'asc'
    ? 'M5 9 L5 1 M2 4 L5 1 L8 4'   // 축 + 위쪽 화살촉
    : 'M5 1 L5 9 M2 6 L5 9 L8 6'   // 축 + 아래쪽 화살촉

  return (
    <Svg width={size * 0.9} height={size} viewBox="0 0 10 10">
      <Path d={d} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}
