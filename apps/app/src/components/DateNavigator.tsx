import React, { useMemo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import DatePickerModal from './DatePickerModal'
import MonthPickerModal from './MonthPickerModal'
import YearPickerModal from './YearPickerModal'
import { makeStyles } from './DateNavigator.styles'

const dp = strings.datePicker

interface Props {
  date:          Date
  onChange:      (date: Date) => void
  onPrev:        () => void
  onNext:        () => void
  disableNext?:  boolean
  todayBadge?:   string
  mode?:         'day' | 'month' | 'year'
  showTime?:     boolean
  variant?:      'flat' | 'card'
  style?:        ViewStyle
}

function isSameDate(a: Date, b: Date, mode: 'day' | 'month' | 'year') {
  if (mode === 'year')  return a.getFullYear() === b.getFullYear()
  if (mode === 'month') return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export default function DateNavigator({ date, onChange, onPrev, onNext, disableNext, todayBadge, mode = 'day', showTime = false, variant = 'flat', style }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [pickerVisible, setPickerVisible] = useState(false)

  const isNow        = isSameDate(date, new Date(), mode)
  const nextDisabled = disableNext ?? false

  const dateLabel = mode === 'year'
    ? dp.yearFormat(date.getFullYear())
    : mode === 'month'
      ? dp.monthFormat(date.getFullYear(), date.getMonth() + 1)
      : dp.dateWithDowFormat(date.getFullYear(), date.getMonth() + 1, date.getDate(), dp.weekdays[date.getDay()])

  const picker = mode === 'month' ? (
    <MonthPickerModal
      visible={pickerVisible}
      selectedYear={date.getFullYear()}
      selectedMonth={date.getMonth()}
      onSelect={(y, m) => onChange(new Date(y, m, 1))}
      onClose={() => setPickerVisible(false)}
    />
  ) : mode === 'year' ? (
    <YearPickerModal
      visible={pickerVisible}
      selectedYear={date.getFullYear()}
      onSelect={(y) => onChange(new Date(y, 0, 1))}
      onClose={() => setPickerVisible(false)}
    />
  ) : (
    <DatePickerModal
      visible={pickerVisible}
      selectedDate={date}
      onSelect={onChange}
      onClose={() => setPickerVisible(false)}
      showTime={showTime}
    />
  )

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
        {picker}
      </>
    )
  }

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
          {todayBadge && isNow && mode === 'day' && (
            <Text style={styles.todayBadge}>{todayBadge}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.flatNavBtn} onPress={onNext} activeOpacity={nextDisabled ? 1 : 0.6} disabled={nextDisabled}>
          <Text style={[styles.flatArrow, nextDisabled && styles.arrowDisabled]}>›</Text>
        </TouchableOpacity>
      </View>
      {picker}
    </>
  )
}
