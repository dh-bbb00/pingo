import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useApprovalRequest } from '@/hooks/queries/useApprovalRequest'
import { strings } from '@/constants/strings'
import { styles } from './ApprovalRequestScreen.styles'

const s = strings.approvalRequest

export default function ApprovalRequestScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const { mutate: requestApproval, isPending } = useApprovalRequest()

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => requestApproval({ email, password })}
        disabled={isPending}
      >
        {isPending
          ? <ActivityIndicator color="#FFFFFF" />
          : <Text style={styles.buttonText}>{s.submit}</Text>
        }
      </TouchableOpacity>
    </View>
  )
}
