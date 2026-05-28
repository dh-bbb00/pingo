import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '@/store/authStore'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { useMyInfo } from './hooks/useMyInfo'
import { makeStyles } from './MyInfoScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'MyInfo'>

const s = strings.myInfo

export default function MyInfoScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { logout } = useAuthStore()
  const { data } = useMyInfo()

  function handleLogout() {
    Alert.alert(s.logout, strings.common.logoutConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, style: 'destructive', onPress: logout },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{s.emailLabel}</Text>
        <Text style={styles.value}>{data?.email ?? '-'}</Text>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate(Screens.More.PasswordChange)}
      >
        <Text style={styles.menuLabel}>{s.changePassword}</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{s.logout}</Text>
      </TouchableOpacity>
    </View>
  )
}
