import React, { useState, useMemo } from 'react'
import { Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import FullScreenContainer from '@/components/containers/FullScreenContainer'
import { useApprovalRequest } from './hooks/useApprovalRequest'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './ApprovalRequestScreen.styles'

const s = strings.approvalRequest

export default function ApprovalRequestScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const { mutate: requestApproval, isPending } = useApprovalRequest()

  return (
    <FullScreenContainer style={styles.container}>
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
          ? <ActivityIndicator color={theme.colors.text.inverse} />
          : <Text style={styles.buttonText}>{s.submit}</Text>
        }
      </TouchableOpacity>
    </FullScreenContainer>
  )
}
