import React, { useMemo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import DatePickerModal from './DatePickerModal'
import { makeStyles } from './DateNavigator.styles'

interface Props {
  date:          Date
  onChange:      (date: Date) => void  // 달력에서 날짜 선택 시
  onPrev:        () => void            // 왼쪽 화살표
  onNext:        () => void            // 오른쪽 화살표
  disableNext?:  boolean               // 오른쪽 화살표 비활성화
  todayBadge?:   string                // 오늘 배지 텍스트 (설정 시 오늘이면 배지 표시)
  variant?:      'flat' | 'card'       // flat=HistoryScreen, card=TransactionEdit
  style?:        ViewStyle
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function DateNavigator({ date, onChange, onPrev, onNext, disableNext, todayBadge, variant = 'flat', style }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [pickerVisible, setPickerVisible] = useState(false)

  const isToday    = isSameDay(date, new Date())
  const dateLabel  = strings.datePicker.dateFormat(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const nextDisabled = disableNext ?? false

  if (variant === 'card') {
    return (
      <>
        <View style={[styles.cardContainer, style]}>
          <TouchableOpacity style={styles.cardNavBtn} onPress={onPrev} activeOpacity={0.6}>
            <Text style={styles.cardArrow}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => setPickerVisible(true)} activeOpacity={0.7}>
            <Text style={styles.cardDateText}>{dateLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardNavBtn} onPress={onNext} activeOpacity={nextDisabled ? 1 : 0.6} disabled={nextDisabled}>
            <Text style={[styles.cardArrow, nextDisabled && styles.arrowDisabled]}>›</Text>
          </TouchableOpacity>
        </View>
        <DatePickerModal
          visible={pickerVisible}
          selectedDate={date}
          onSelect={onChange}
          onClose={() => setPickerVisible(false)}
        />
      </>
    )
  }

  // flat variant
  return (
    <>
      <View style={[styles.flatContainer, style]}>
        <TouchableOpacity style={styles.flatNavBtn} onPress={onPrev} activeOpacity={0.6}>
          <Text style={styles.flatArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.flatCenter}>
          <TouchableOpacity onPress={() => setPickerVisible(true)} activeOpacity={0.7}>
            <Text style={styles.flatDateText}>{dateLabel}</Text>
          </TouchableOpacity>
          {todayBadge && isToday && (
            <Text style={styles.todayBadge}>{todayBadge}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.flatNavBtn} onPress={onNext} activeOpacity={nextDisabled ? 1 : 0.6} disabled={nextDisabled}>
          <Text style={[styles.flatArrow, nextDisabled && styles.arrowDisabled]}>›</Text>
        </TouchableOpacity>
      </View>
      <DatePickerModal
        visible={pickerVisible}
        selectedDate={date}
        onSelect={onChange}
        onClose={() => setPickerVisible(false)}
      />
    </>
  )
}
