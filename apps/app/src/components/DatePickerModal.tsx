import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles, TIME_ITEM_H, TIME_PAD, TIME_VISIBLE } from './DatePickerModal.styles'

const dp = strings.datePicker

const HOURS   = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
function fmt2(n: number) { return String(n).padStart(2, '0') }

// ── 드럼롤 피커 컬럼 ────────────────────────────────────────────
interface ColumnProps {
  items:    number[]
  selected: number
  onChange: (v: number) => void
  colors:   { text: string; selected: string; highlight: string; border: string }
}

function PickerColumn({ items, selected, onChange, colors }: ColumnProps) {
  const ref  = useRef<FlatList>(null)
  const data = useMemo(
    () => [...Array(TIME_PAD).fill(null), ...items, ...Array(TIME_PAD).fill(null)],
    [items],
  )

  useEffect(() => {
    const idx = items.indexOf(selected)
    if (idx < 0) return
    setTimeout(() => {
      ref.current?.scrollToOffset({ offset: idx * TIME_ITEM_H, animated: false })
    }, 16)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEnd = useCallback((e: any) => {
    const idx     = Math.round(e.nativeEvent.contentOffset.y / TIME_ITEM_H)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    onChange(items[clamped])
  }, [items, onChange])

  return (
    <View style={{ height: TIME_ITEM_H * TIME_VISIBLE, overflow: 'hidden' }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: TIME_ITEM_H * TIME_PAD, height: TIME_ITEM_H,
          left: 0, right: 0,
          backgroundColor: colors.highlight,
          borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border,
        }}
      />
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => {
          const realIdx = index - TIME_PAD
          const isSel   = realIdx >= 0 && realIdx < items.length && items[realIdx] === selected
          return (
            <View style={{ height: TIME_ITEM_H, width: 64, alignItems: 'center', justifyContent: 'center' }}>
              {item !== null && (
                <Text style={{
                  fontSize: isSel ? 22 : 17,
                  fontWeight: isSel ? '700' : '400',
                  color: isSel ? colors.selected : colors.text,
                  opacity: isSel ? 1 : 0.35,
                  includeFontPadding: false,
                }}>
                  {fmt2(item)}
                </Text>
              )}
            </View>
          )
        }}
        getItemLayout={(_, i) => ({ length: TIME_ITEM_H, offset: TIME_ITEM_H * i, index: i })}
        snapToInterval={TIME_ITEM_H}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleEnd}
      />
    </View>
  )
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
interface Props {
  visible:      boolean
  selectedDate: Date
  onSelect:     (date: Date) => void
  onClose:      () => void
  showTime?:    boolean
}

export default function DatePickerModal({ visible, selectedDate, onSelect, onClose, showTime = false }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [viewYear,  setViewYear]  = useState(selectedDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth())

  // showTime 모드: 로컬 날짜 + 시간 state
  const [localYear,   setLocalYear]   = useState(selectedDate.getFullYear())
  const [localMonth,  setLocalMonth]  = useState(selectedDate.getMonth())
  const [localDay,    setLocalDay]    = useState(selectedDate.getDate())
  const [localHour,   setLocalHour]   = useState(selectedDate.getHours())
  const [localMinute, setLocalMinute] = useState(selectedDate.getMinutes())

  useEffect(() => {
    if (visible) {
      setViewYear(selectedDate.getFullYear())
      setViewMonth(selectedDate.getMonth())
      setLocalYear(selectedDate.getFullYear())
      setLocalMonth(selectedDate.getMonth())
      setLocalDay(selectedDate.getDate())
      setLocalHour(selectedDate.getHours())
      setLocalMinute(selectedDate.getMinutes())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const today  = new Date()
  const selY   = selectedDate.getFullYear()
  const selM   = selectedDate.getMonth()
  const selD   = selectedDate.getDate()

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay()

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const handleDayPress = (day: number) => {
    if (showTime) {
      setLocalYear(viewYear)
      setLocalMonth(viewMonth)
      setLocalDay(day)
    } else {
      onSelect(new Date(viewYear, viewMonth, day))
      onClose()
    }
  }

  const handleClose = () => {
    if (showTime) {
      onSelect(new Date(localYear, localMonth, localDay, localHour, localMinute))
    }
    onClose()
  }

  const pickerColors = {
    text:      theme.colors.text.primary,
    selected:  theme.colors.primary,
    highlight: theme.colors.primaryLight,
    border:    theme.colors.primary,
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />

        <View style={styles.sheet}>
          {/* 월 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.monthBtn} onPress={prevMonth} activeOpacity={0.6}>
              <Text style={styles.monthArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{dp.monthFormat(viewYear, viewMonth + 1)}</Text>
            <TouchableOpacity style={styles.monthBtn} onPress={nextMonth} activeOpacity={0.6}>
              <Text style={styles.monthArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekRow}>
            {dp.weekdays.map(d => (
              <Text key={d} style={styles.weekday}>{d}</Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (!day) return <View key={i} style={styles.cell} />
              const isSelected = showTime
                ? (viewYear === localYear && viewMonth === localMonth && day === localDay)
                : (viewYear === selY && viewMonth === selM && day === selD)
              const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()
              return (
                <TouchableOpacity key={i} style={styles.cell} onPress={() => handleDayPress(day)} activeOpacity={0.7}>
                  <View style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleSelected,
                    !isSelected && isToday && styles.dayCircleToday,
                  ]}>
                    <Text style={[
                      styles.dayText,
                      isSelected  && styles.dayTextSelected,
                      !isSelected && isToday && styles.dayTextToday,
                    ]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* 시간 피커 */}
          {showTime && (
            <>
              <View style={styles.timeDivider} />
              <View style={styles.timeRow}>
                <PickerColumn
                  items={HOURS}
                  selected={localHour}
                  onChange={setLocalHour}
                  colors={pickerColors}
                />
                <Text style={styles.timeColon}>:</Text>
                <PickerColumn
                  items={MINUTES}
                  selected={localMinute}
                  onChange={setLocalMinute}
                  colors={pickerColors}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}
