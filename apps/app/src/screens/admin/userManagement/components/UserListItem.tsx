import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { showConfirm } from '@/store/confirmStore'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { AdminUserDetail } from '../../types'
import { useSuspendUser, useUnsuspendUser } from '../hooks/useSuspendUser'
import { makeStyles } from './UserListItem.styles'

interface Props {
  item:     AdminUserDetail
  expanded: boolean
  onToggle: (id: string) => void
}

const s = strings.userManagement

export default function UserListItem({ item, expanded, onToggle }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { mutate: suspend }   = useSuspendUser()
  const { mutate: unsuspend } = useUnsuspendUser()

  const isSuspended = item.status === 'SUSPENDED'

  const handleSuspendPress = () => {
    if (isSuspended) {
      showConfirm(s.confirmUnsuspendTitle, s.confirmUnsuspendMsg, [
        { text: strings.common.cancel, style: 'cancel' },
        { text: s.unsuspend, onPress: () => unsuspend(item.id) },
      ])
    } else {
      showConfirm(s.confirmSuspendTitle, s.confirmSuspendMsg, [
        { text: strings.common.cancel, style: 'cancel' },
        { text: s.suspend, style: 'destructive', onPress: () => suspend(item.id) },
      ])
    }
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.row} onPress={() => onToggle(item.id)} activeOpacity={0.7}>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.devices}>
          {item.devices.length === 0 ? (
            <Text style={styles.noDevice}>{s.noDevice}</Text>
          ) : (
            item.devices.map((d, i) => (
              <View key={d.id} style={styles.deviceRow}>
                <Text style={styles.deviceNum}>{i + 1}.</Text>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{d.deviceName}</Text>
                  <Text style={styles.deviceMeta}>{d.phoneModel} · {d.osVersion} · v{d.appVersion}</Text>
                </View>
              </View>
            ))
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, isSuspended ? styles.actionBtnSuspended : styles.actionBtnActive]}
              onPress={handleSuspendPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionBtnText, isSuspended ? styles.actionBtnTextSuspended : styles.actionBtnTextActive]}>
                {isSuspended ? s.unsuspend : s.suspend}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}
