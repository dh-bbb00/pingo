import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AuthStackParamList } from '@/types/navigation'
import { strings } from '@/constants/strings'
import { styles } from './DeviceChangeScreen.styles'

type Nav = NativeStackNavigationProp<AuthStackParamList, 'DeviceChange'>

const s = strings.deviceChange

export default function DeviceChangeScreen() {
  const navigation = useNavigation<Nav>()

  async function handleApprovalRequest() {
    // TODO: 새 기기 승인 요청 API 연동
    navigation.navigate('ApprovalPending')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>{s.title}</Text>
      <Text style={styles.desc}>{s.desc}</Text>

      <TouchableOpacity style={styles.button} onPress={handleApprovalRequest}>
        <Text style={styles.buttonText}>{s.submit}</Text>
      </TouchableOpacity>
    </View>
  )
}
