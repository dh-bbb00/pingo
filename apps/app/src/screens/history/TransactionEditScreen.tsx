import React from 'react'
import { View, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { HistoryStackParamList } from '@/types/navigation'
import { useTransactionForm } from './hooks/useTransactionForm'
import { styles } from './TransactionEditScreen.styles'

type Route = RouteProp<HistoryStackParamList, 'TransactionEdit'>

export default function TransactionEditScreen() {
  const { params } = useRoute<Route>()
  const isEdit = !!params?.id
  const title  = isEdit ? '내역 수정' : '내역 추가'

  const { form, setField, isValid } = useTransactionForm()
  // TODO: isEdit이면 params.id로 데이터 조회 후 useTransactionForm(defaultData) 전달

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      {/* TODO: 내역 입력 폼 */}
    </View>
  )
}
