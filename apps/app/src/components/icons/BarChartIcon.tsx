import React from 'react'
import Svg, { Rect } from 'react-native-svg'

interface Props {
  color: string
  size?: number
}

export default function BarChartIcon({ color, size = 16 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Rect x={0}  y={8} width={4} height={8}  rx={1.5} fill={color} />
      <Rect x={6}  y={2} width={4} height={14} rx={1.5} fill={color} />
      <Rect x={12} y={5} width={4} height={11} rx={1.5} fill={color} />
    </Svg>
  )
}
