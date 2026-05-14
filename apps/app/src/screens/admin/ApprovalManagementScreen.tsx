import React from 'react'
import { View, Text, FlatList } from 'react-native'
import type { ApprovalRequest } from './types'
import { styles } from './ApprovalManagementScreen.styles'

export default function ApprovalManagementScreen() {
  // TODO: 승인 요청 목록 API 연동 + 승인/거절 처리

  return (
    <View style={styles.container}>
      <Text style={styles.header}>승인 관리</Text>
      <FlatList<ApprovalRequest>
        data={[]}
        keyExtractor={(item) => item.id}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>대기 중인 승인 요청이 없습니다.</Text>}
      />
    </View>
  )
}
