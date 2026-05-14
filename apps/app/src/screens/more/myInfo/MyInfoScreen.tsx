import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '@/store/authStore'
import type { MoreStackParamList } from '@/types/navigation'
import { styles } from './MyInfoScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'MyInfo'>

export default function MyInfoScreen() {
  const navigation = useNavigation<Nav>()
  const { clearAuth } = useAuthStore()

  // TODO: 내 정보 API 연동 (이메일, 기기 정보)

  return (
    <View style={styles.container}>
      <Text style={styles.header}>내 정보</Text>

      <View style={styles.section}>
        <Text style={styles.label}>이메일</Text>
        <Text style={styles.value}>user@example.com</Text>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('PasswordChange')}
      >
        <Text style={styles.menuLabel}>비밀번호 변경</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* TODO: 현재 기기 상태 표시 + 삭제 */}

      <TouchableOpacity style={styles.logoutButton} onPress={clearAuth}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  )
}
