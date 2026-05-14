import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { strings } from '@/constants/strings'
import { styles } from './ApprovalPendingScreen.styles'

const s = strings.approvalPending

export default function ApprovalPendingScreen() {
  const { clearAuth } = useAuthStore()

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⏳</Text>
      <Text style={styles.title}>{s.title}</Text>
      <Text style={styles.desc}>{s.desc}</Text>

      <TouchableOpacity style={styles.button} onPress={clearAuth}>
        <Text style={styles.buttonText}>{s.back}</Text>
      </TouchableOpacity>
    </View>
  )
}
