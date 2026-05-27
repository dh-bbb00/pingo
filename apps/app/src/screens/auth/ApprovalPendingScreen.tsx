import React, { useMemo } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import FullScreenContainer from '@/components/containers/FullScreenContainer'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './ApprovalPendingScreen.styles'

const s = strings.approvalPending

export default function ApprovalPendingScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { clearAuth } = useAuthStore()

  return (
    <FullScreenContainer style={styles.container}>
      <Text style={styles.emoji}>⏳</Text>
      <Text style={styles.title}>{s.title}</Text>
      <Text style={styles.desc}>{s.desc}</Text>

      <TouchableOpacity style={styles.button} onPress={clearAuth}>
        <Text style={styles.buttonText}>{s.back}</Text>
      </TouchableOpacity>
    </FullScreenContainer>
  )
}
