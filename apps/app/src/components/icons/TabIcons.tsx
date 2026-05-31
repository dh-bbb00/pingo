import React from 'react'
import Svg, { Path, Circle, Rect } from 'react-native-svg'

interface IconProps {
  color: string
  size?: number
}

export function HomeIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function HistoryIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path d="M9 12h6M9 16h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  )
}

export function StatsIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 20V10M12 20V4M6 20v-6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function CategoryIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function MoreIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6h16M4 12h16M4 18h16"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function UsersIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx={9} cy={7} r={4} stroke={color} strokeWidth={1.8} />
      <Path
        d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function LogoutIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 17l5-5-5-5M21 12H9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function CashIcon({ size = 22 }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" fill="#43A047" stroke="#2E7D32" strokeWidth={1.2} strokeLinejoin="round" />
      <Circle cx={5} cy={12} r={2.2} fill="#2E7D32" fillOpacity={0.5} />
      <Circle cx={19} cy={12} r={2.2} fill="#2E7D32" fillOpacity={0.5} />
      <Circle cx={12} cy={12} r={3.2} fill="#FDD835" />
      <Circle cx={12} cy={12} r={3.2} stroke="#F9A825" strokeWidth={0.8} fill="none" />
      <Circle cx={11} cy={11} r={0.8} fill="#FFEE58" fillOpacity={0.7} />
    </Svg>
  )
}

export function GiftCardIcon({ size = 22 }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12h16v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8z" fill="#E53935" stroke="#C62828" strokeWidth={1} strokeLinejoin="round" />
      <Rect x={3} y={8} width={18} height={4} rx={1} fill="#EF5350" stroke="#C62828" strokeWidth={0.8} />
      <Path d="M12 8v13" stroke="#FDD835" strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M3 10h18" stroke="#FDD835" strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M12 8C11 6 8 4.5 8 6c0 1.5 2.5 2.2 4 2z" fill="#FFC107" />
      <Path d="M12 8C13 6 16 4.5 16 6c0 1.5-2.5 2.2-4 2z" fill="#FFC107" />
    </Svg>
  )
}

export function PaymentCardIcon({ size = 22 }: Partial<IconProps>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={2} y={5} width={20} height={14} rx={2} fill="#FFB300" stroke="#F57F17" strokeWidth={0.8} />
      <Rect x={2} y={9} width={20} height={3.5} fill="#F57F17" />
      <Rect x={4.5} y={14.2} width={5} height={3} rx={0.8} fill="#FFF9C4" stroke="#F9A825" strokeWidth={0.6} />
      <Path d="M7 14.2v3M4.5 15.7h5" stroke="#F9A825" strokeWidth={0.6} />
      <Circle cx={13.5} cy={15.7} r={1} fill="white" fillOpacity={0.7} />
      <Circle cx={16.5} cy={15.7} r={1} fill="white" fillOpacity={0.7} />
      <Circle cx={19.5} cy={15.7} r={1} fill="white" fillOpacity={0.7} />
    </Svg>
  )
}

export function CheckCircleIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 11.08V12a10 10 0 11-5.93-9.14"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M22 4L12 14.01l-3-3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
