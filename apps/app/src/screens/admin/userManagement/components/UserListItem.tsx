import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import type { AdminUserDetail } from '../../types'

interface Props {
  item:     AdminUserDetail
  expanded: boolean
  onToggle: (id: string) => void
}

export default function UserListItem({ item, expanded, onToggle }: Props) {
  const { theme: t } = useTheme()

  return (
    <View style={[styles.card, { backgroundColor: t.colors.surface, borderRadius: t.radius.lg }]}>
      <TouchableOpacity style={styles.row} onPress={() => onToggle(item.id)} activeOpacity={0.7}>
        <Text style={[styles.email, { color: t.colors.text.primary, fontSize: t.fontSize.md, fontWeight: t.fontWeight.medium }]}>
          {item.email}
        </Text>
        <Text style={[styles.chevron, { color: t.colors.text.secondary }]}>
          {expanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.devices, { borderTopColor: t.colors.divider }]}>
          {item.devices.length === 0 ? (
            <Text style={[styles.noDevice, { color: t.colors.text.disabled, fontSize: t.fontSize.sm }]}>
              등록된 기기 없음
            </Text>
          ) : (
            item.devices.map((d, i) => (
              <View key={d.id} style={styles.deviceRow}>
                <Text style={[styles.deviceNum, { color: t.colors.primary, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semiBold }]}>
                  {i + 1}.
                </Text>
                <View style={styles.deviceInfo}>
                  <Text style={[styles.deviceName, { color: t.colors.text.primary, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium }]}>
                    {d.deviceName}
                  </Text>
                  <Text style={[styles.deviceMeta, { color: t.colors.text.secondary, fontSize: t.fontSize.xs }]}>
                    {d.phoneModel} · {d.osVersion} · v{d.appVersion}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card:       { marginBottom: 8, overflow: 'hidden' },
  row:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  email:      { flex: 1 },
  chevron:    { fontSize: 10, marginLeft: 8 },
  devices:    { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  noDevice:   { textAlign: 'center', paddingVertical: 4 },
  deviceRow:  { flexDirection: 'row', gap: 8 },
  deviceNum:  { width: 18 },
  deviceInfo: { flex: 1 },
  deviceName: { marginBottom: 2 },
  deviceMeta: {},
})
