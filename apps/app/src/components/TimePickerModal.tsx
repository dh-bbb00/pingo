import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles, ITEM_HEIGHT, VISIBLE, PAD } from './TimePickerModal.styles'

const tp = strings.timePicker

const HOURS   = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

function fmt2(n: number) { return String(n).padStart(2, '0') }

interface PickerColumnProps {
  items:    number[]
  selected: number
  onChange: (v: number) => void
}

function PickerColumn({ items, selected, onChange }: PickerColumnProps) {
  const ref = useRef<FlatList>(null)
  // null padding으로 첫/마지막 항목도 중앙 정렬 가능하게
  const data = useMemo(
    () => [...Array(PAD).fill(null), ...items, ...Array(PAD).fill(null)],
    [items],
  )

  useEffect(() => {
    const idx = items.indexOf(selected)
    if (idx < 0) return
    setTimeout(() => {
      ref.current?.scrollToOffset({ offset: idx * ITEM_HEIGHT, animated: false })
    }, 0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScrollEnd = useCallback((e: any) => {
    const offset = e.nativeEvent.contentOffset.y
    const idx    = Math.round(offset / ITEM_HEIGHT)
    const clamped = Math.max(0, Math.min(idx, items.length - 1))
    onChange(items[clamped])
  }, [items, onChange])

  return (
    <View style={{ position: 'relative' }}>
      <ColumnHighlight />
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => {
          const realIdx    = index - PAD
          const isSelected = realIdx >= 0 && realIdx < items.length && items[realIdx] === selected
          return (
            <View style={{ height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
              {item !== null && (
                <Text style={[
                  { fontSize: 18, includeFontPadding: false },
                  isSelected ? { fontSize: 22, fontWeight: '700' } : { opacity: 0.35 },
                ]}>
                  {fmt2(item)}
                </Text>
              )}
            </View>
          )
        }}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        style={{ height: ITEM_HEIGHT * VISIBLE }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      />
    </View>
  )
}

// 선택 영역 하이라이트 오버레이 (포인터 이벤트 차단 없음)
function ColumnHighlight() {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top:    ITEM_HEIGHT * PAD,
        height: ITEM_HEIGHT,
        left: 0, right: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(0,0,0,0.12)',
        backgroundColor: 'rgba(0,0,0,0.04)',
      }}
    />
  )
}

interface Props {
  visible:  boolean
  hour:     number
  minute:   number
  onSelect: (hour: number, minute: number) => void
  onClose:  () => void
}

export default function TimePickerModal({ visible, hour, minute, onSelect, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  // 스크롤 도중 변경된 값을 실시간 추적
  const pendingHour   = useRef(hour)
  const pendingMinute = useRef(minute)

  useEffect(() => {
    if (visible) {
      pendingHour.current   = hour
      pendingMinute.current = minute
    }
  }, [visible, hour, minute])

  const handleClose = () => {
    onSelect(pendingHour.current, pendingMinute.current)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{tp.title}</Text>

          <View style={styles.columns}>
            <View style={styles.column}>
              <PickerColumn
                items={HOURS}
                selected={hour}
                onChange={(v) => { pendingHour.current = v }}
              />
              <Text style={styles.unit}>{tp.hour}</Text>
            </View>

            <Text style={styles.colon}>:</Text>

            <View style={styles.column}>
              <PickerColumn
                items={MINUTES}
                selected={minute}
                onChange={(v) => { pendingMinute.current = v }}
              />
              <Text style={styles.unit}>{tp.minute}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
