import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { makeStyles } from './FixedExpenseDetailScreen.styles'

type Nav   = NativeStackNavigationProp<MoreStackParamList, 'FixedExpenseDetail'>
type Route = RouteProp<MoreStackParamList, 'FixedExpenseDetail'>

export default function FixedExpenseDetailScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { params } = useRoute<Route>()

  // TODO: params.id로 고정 지출 상세 API 연동

  function handleEdit() {
    navigation.navigate(Screens.More.FixedExpenseEdit, { id: params.id })
  }

  function handleDelete() {
    // TODO: 삭제 API 연동 후 목록으로 이동
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>고정 지출 상세</Text>

      {/* TODO: 상세 데이터 표시 */}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
