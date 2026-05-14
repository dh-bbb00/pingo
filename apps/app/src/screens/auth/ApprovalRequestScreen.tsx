import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { strings } from '@/constants/strings'
import { styles } from './ApprovalRequestScreen.styles'

const s = strings.approvalRequest

export default function ApprovalRequestScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleRequest() {
    // TODO: 승인 요청 API 연동 + deviceId, deviceModel 포함
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{s.title}</Text>
      <Text style={styles.desc}>{s.desc}</Text>

      <TextInput
        style={styles.input}
        placeholder={s.email}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={s.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRequest}>
        <Text style={styles.buttonText}>{s.submit}</Text>
      </TouchableOpacity>
    </View>
  )
}
