import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AuthStackParamList } from '@/types/navigation'
import { styles } from './DeviceChangeScreen.styles'

type Nav = NativeStackNavigationProp<AuthStackParamList, 'DeviceChange'>

export default function DeviceChangeScreen() {
  const navigation = useNavigation<Nav>()

  async function handleApprovalRequest() {
    // TODO: 새 기기 승인 요청 API 연동
    navigation.navigate('ApprovalPending')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>새로운 기기 감지</Text>
      <Text style={styles.desc}>새로운 기기입니다.{'\n'}관리자 승인이 필요합니다.</Text>

      <TouchableOpacity style={styles.button} onPress={handleApprovalRequest}>
        <Text style={styles.buttonText}>승인 요청하기</Text>
      </TouchableOpacity>
    </View>
  )
}
