import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './RejectedAccountScreen.styles'

const s = strings.rejectedAccount

export default function RejectedAccountScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { clearAuth } = useAuthStore()

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🚫</Text>
      <Text style={styles.title}>{s.title}</Text>
      <Text style={styles.desc}>{s.desc}</Text>

      <TouchableOpacity style={styles.button} onPress={clearAuth}>
        <Text style={styles.buttonText}>{s.back}</Text>
      </TouchableOpacity>
    </View>
  )
}
