import React, { useMemo } from 'react'
import { Alert, View, Text, TouchableOpacity } from 'react-native'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './AdminMoreScreen.styles'

const s = strings.adminMore

export default function AdminMoreScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { logout } = useAuthStore()

  function handleLogout() {
    Alert.alert(s.logout, strings.common.logoutConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, style: 'destructive', onPress: logout },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{s.logout}</Text>
      </TouchableOpacity>
    </View>
  )
}
