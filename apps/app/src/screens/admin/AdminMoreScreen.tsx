import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './AdminMoreScreen.styles'

const s = strings.adminMore

export default function AdminMoreScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { logout } = useAuthStore()

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>{s.logout}</Text>
      </TouchableOpacity>
    </View>
  )
}
