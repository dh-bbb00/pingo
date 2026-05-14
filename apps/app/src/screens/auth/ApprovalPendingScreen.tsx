import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { styles } from './ApprovalPendingScreen.styles'

export default function ApprovalPendingScreen() {
  const { clearAuth } = useAuthStore()

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⏳</Text>
      <Text style={styles.title}>승인 대기 중</Text>
      <Text style={styles.desc}>관리자가 계정을 검토 중입니다.{'\n'}승인 후 이용 가능합니다.</Text>

      <TouchableOpacity style={styles.button} onPress={clearAuth}>
        <Text style={styles.buttonText}>로그인으로 돌아가기</Text>
      </TouchableOpacity>
    </View>
  )
}
