import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuthStore } from '@/store/authStore'
import type { MoreStackParamList } from '@/types/navigation'
import type { MyDevice } from '@/api/endpoints/users.api'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { useMyInfo } from './hooks/useMyInfo'
import { useMyDevices } from './hooks/useMyDevices'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { useDeleteDevice } from './hooks/useDeleteDevice'
import { makeStyles } from './MyInfoScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'MyInfo'>

const s = strings.myInfo

export default function MyInfoScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()
  const { logout } = useAuthStore()
  const { data: myInfo, refetch: refetchMyInfo } = useMyInfo()
  const { data: devices, refetch: refetchDevices } = useMyDevices()
  const { refreshing, onRefresh } = usePullToRefresh(() => Promise.all([refetchMyInfo(), refetchDevices()]))
  const { mutate: deleteDevice } = useDeleteDevice()

  function handleLogout() {
    Alert.alert(s.logout, strings.common.logoutConfirmMsg, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.confirm, style: 'destructive', onPress: logout },
    ])
  }

  function handleDeleteDevice(device: MyDevice) {
    const title = device.isCurrent ? s.confirmDeleteCurrentTitle : s.confirmDeleteOtherTitle
    const msg   = device.isCurrent ? s.confirmDeleteCurrentMsg   : s.confirmDeleteOtherMsg
    Alert.alert(title, msg, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: strings.common.confirm,
        style: 'destructive',
        onPress: () => deleteDevice({ deviceId: device.id, isCurrent: device.isCurrent }),
      },
    ])
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
    >
      <Text style={styles.header}>{s.header}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{s.emailLabel}</Text>
        <Text style={styles.value}>{myInfo?.email ?? '-'}</Text>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate(Screens.More.PasswordChange)}
      >
        <Text style={styles.menuLabel}>{s.changePassword}</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {devices && devices.length > 0 && (
        <>
          <Text style={styles.devicesHeader}>{s.devicesHeader}</Text>
          {devices.map((device) => (
            <View key={device.id} style={device.isCurrent ? styles.deviceItemCurrent : styles.deviceItem}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.deviceName}</Text>
                <Text style={styles.deviceModel}>{device.phoneModel}</Text>
                {device.isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>{s.currentDeviceBadge}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteDevice(device)}>
                <Text style={styles.deleteBtnText}>{s.deleteDevice}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{s.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
