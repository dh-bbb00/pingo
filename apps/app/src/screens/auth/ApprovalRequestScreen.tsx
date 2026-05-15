import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { handleApiError } from '@/api/errorHandler'
import { useApprovalRequest } from '@/hooks/queries/useApprovalRequest'
import { strings } from '@/constants/strings'
import type { AuthStackParamList } from '@/types/navigation'
import { styles } from './ApprovalRequestScreen.styles'

const s = strings.approvalRequest

export default function ApprovalRequestScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'ApprovalRequest'>>()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  const { mutate: requestApproval, isPending } = useApprovalRequest()

  function handleRequest() {
    requestApproval(
      { email, password },
      {
        onSuccess: () => navigation.replace('ApprovalPending'),
        onError:   (error) => handleApiError(error),
      },
    )
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

      <TouchableOpacity style={styles.button} onPress={handleRequest} disabled={isPending}>
        {isPending
          ? <ActivityIndicator color="#FFFFFF" />
          : <Text style={styles.buttonText}>{s.submit}</Text>
        }
      </TouchableOpacity>
    </View>
  )
}
