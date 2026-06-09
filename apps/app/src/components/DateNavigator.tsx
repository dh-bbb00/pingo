import React, { useMemo, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import type { ViewStyle } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import DatePickerModal from './DatePickerModal'
import MonthPickerModal from './MonthPickerModal'
import YearPickerModal from './YearPickerModal'
import { makeStyles } from './DateNavigator.styles'
import { isSameDay, isSameMonth, isSameYear } from '@/utils/date'

const dp = strings.datePicker
const tp = strings.timePicker

interface Props {
  date:          Date | null
  onChange:      (date: Date) => void
  onPrev:        () => void
  onNext:        () => void
  onClear?:      () => void   // 제공 시 모달에 "전체 기간" 초기화 버튼 표시
  disableNext?:  boolean
  todayBadge?:   string
  mode?:         'day' | 'month' | 'year'
  showTime?:     boolean
  variant?:      'flat' | 'card'
  style?:        ViewStyle
}

export default function DateNavigator({ date, onChange, onPrev, onNext, onClear, disableNext, todayBadge, mode = 'day', showTime = false, variant = 'flat', style }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [pickerVisible, setPickerVisible] = useState(false)

  const now          = new Date()
  const resolvedDate = date ?? now
  const hasSelection = date !== null
  const isNow        = hasSelection && (mode === 'year' ? isSameYear(date!, now) : mode === 'month' ? isSameMonth(date!, now) : isSameDay(date!, now))
  const nextDisabled = !hasSelection || (disableNext ?? false)
  const prevDisabled = !hasSelection

  const baseLabel = !hasSelection
    ? dp.allPeriod
    : mode === 'year'
      ? dp.yearFormat(resolvedDate.getFullYear())
      : mode === 'month'
        ? dp.monthFormat(resolvedDate.getFullYear(), resolvedDate.getMonth() + 1)
        : dp.dateWithDowFormat(resolvedDate.getFullYear(), resolvedDate.getMonth() + 1, resolvedDate.getDate(), dp.weekdays[resolvedDate.getDay()])
  const dateLabel = hasSelection && showTime
    ? `${baseLabel}  ${tp.format(resolvedDate.getHours(), resolvedDate.getMinutes())}`
    : baseLabel

  const picker = mode === 'month' ? (
    <MonthPickerModal
      visible={pickerVisible}
      selectedYear={resolvedDate.getFullYear()}
      selectedMonth={resolvedDate.getMonth()}
      hasSelection={hasSelection}
      onSelect={(y, m) => onChange(new Date(y, m, 1))}
      onClose={() => setPickerVisible(false)}
      onClear={onClear}
    />
  ) : mode === 'year' ? (
    <YearPickerModal
      visible={pickerVisible}
      selectedYear={resolvedDate.getFullYear()}
      onSelect={(y) => onChange(new Date(y, 0, 1))}
      onClose={() => setPickerVisible(false)}
    />
  ) : (
    <DatePickerModal
      visible={pickerVisible}
      selectedDate={resolvedDate}
      onSelect={onChange}
      onClose={() => setPickerVisible(false)}
      showTime={showTime}
    />
  )

  if (variant === 'card') {
    return (
      <>
        <View style={[styles.cardContainer, style]}>
          <TouchableOpacity style={styles.cardNavBtn} onPress={onPrev} activeOpacity={prevDisabled ? 1 : 0.6} disabled={prevDisabled}>
            <Text style={[styles.cardArrow, prevDisabled && styles.arrowDisabled]}>‹</Text>
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
        <TouchableOpacity style={styles.flatNavBtn} onPress={onPrev} activeOpacity={prevDisabled ? 1 : 0.6} disabled={prevDisabled}>
          <Text style={[styles.flatArrow, prevDisabled && styles.arrowDisabled]}>‹</Text>
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
