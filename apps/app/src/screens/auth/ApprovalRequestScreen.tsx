import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { styles } from './ApprovalRequestScreen.styles'

export default function ApprovalRequestScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleRequest() {
    // TODO: 승인 요청 API 연동 + deviceId, deviceModel 포함
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>승인 요청</Text>
      <Text style={styles.desc}>관리자 승인 후 사용 가능합니다.</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRequest}>
        <Text style={styles.buttonText}>신청</Text>
      </TouchableOpacity>
    </View>
  )
}
