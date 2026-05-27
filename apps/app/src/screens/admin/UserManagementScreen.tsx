import React, { useMemo } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useTheme } from '@/theme'
import type { AdminUser } from './types'
import { makeStyles } from './UserManagementScreen.styles'

export default function UserManagementScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  // TODO: 유저 목록 API 연동

  return (
    <View style={styles.container}>
      <Text style={styles.header}>유저 관리</Text>
      <FlatList<AdminUser>
        data={[]}
        keyExtractor={(item) => item.id}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>사용 중인 유저가 없습니다.</Text>}
      />
    </View>
  )
}
