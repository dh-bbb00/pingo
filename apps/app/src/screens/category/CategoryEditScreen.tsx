import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { CategoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { useCategoryForm } from './hooks/useCategoryForm'
import { makeStyles } from './CategoryEditScreen.styles'

type Route = RouteProp<CategoryStackParamList, 'CategoryEdit'>

export default function CategoryEditScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params } = useRoute<Route>()
  const isEdit = !!params?.id
  const title  = isEdit ? '카테고리 수정' : '카테고리 등록'

  const { form, setField, isValid } = useCategoryForm()
  // TODO: isEdit이면 params.id로 데이터 조회 후 useCategoryForm(defaultData) 전달
  // 필드: 카테고리명, 예산(optional), 예산 매달 고정 여부

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      {/* TODO: 카테고리 입력 폼 */}
    </View>
  )
}
