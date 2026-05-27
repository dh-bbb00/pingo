import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { useFixedExpenseForm } from './hooks/useFixedExpenseForm'
import { makeStyles } from './FixedExpenseEditScreen.styles'

type Route = RouteProp<MoreStackParamList, 'FixedExpenseEdit'>

export default function FixedExpenseEditScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params } = useRoute<Route>()
  const isEdit = !!params?.id
  const title  = isEdit ? '고정 지출 수정' : '고정 지출 추가'

  const { form, setField, isValid } = useFixedExpenseForm()
  // TODO: isEdit이면 params.id로 데이터 조회 후 useFixedExpenseForm(defaultData) 전달

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      {/* TODO: 고정 지출 입력 폼 */}
    </View>
  )
}
