import React, { useMemo } from 'react'
import { Alert, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { AdminMoreStackParamList } from '@/types/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { Screens } from '@/constants/screens'
import { makeStyles } from './AdminMoreScreen.styles'

const s = strings.adminMore

type Nav = NativeStackNavigationProp<AdminMoreStackParamList, 'AdminMoreMain'>

export default function AdminMoreScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { logout } = useAuthStore()

  function handleLogout() {
    Alert.alert(s.logout, strings.common.logoutConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, style: 'destructive', onPress: logout },
    ])
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{s.header}</Text>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate(Screens.AdminMore.SchedulerManagement)}
        >
          <Text style={styles.menuText}>{s.schedulerManagement}</Text>
          <Text style={styles.menuChevron}>{'›'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{s.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
