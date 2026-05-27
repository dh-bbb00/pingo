import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AuthStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { makeStyles } from './DeviceChangeScreen.styles'

type Nav = NativeStackNavigationProp<AuthStackParamList, 'DeviceChange'>

const s = strings.deviceChange

export default function DeviceChangeScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()

  async function handleApprovalRequest() {
    // TODO: 새 기기 승인 요청 API 연동
    navigation.navigate(Screens.Auth.ApprovalPending)
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
