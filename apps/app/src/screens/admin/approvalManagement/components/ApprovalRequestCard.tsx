import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { ApprovalRequest } from '../../types'
import type { ApprovalStatus } from '@/api/endpoints/approvals.api'
import { makeStyles } from '../ApprovalManagementScreen.styles'

const s = strings.approvalManagement

interface Props {
  item:      ApprovalRequest
  tab:       ApprovalStatus
  disabled:  boolean
  onApprove: (id: string) => void
  onReject:  (id: string) => void
  onAccept:  (id: string) => void
  onDelete:  (id: string) => void
}

export default function ApprovalRequestCard({ item, tab, disabled, onApprove, onReject, onAccept, onDelete }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  return (
    <View style={styles.card}>
      <Text style={styles.email}>{item.user.email}</Text>
      <Text style={styles.meta}>{item.device.phoneModel} · {item.device.osVersion}</Text>
      <Text style={styles.meta}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
      <View style={styles.actions}>
        {tab === 'PENDING' ? (
          <>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => onApprove(item.id)}
              disabled={disabled}
            >
              <Text style={styles.buttonText}>{s.approve}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => onReject(item.id)}
              disabled={disabled}
            >
              <Text style={styles.buttonText}>{s.reject}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => onAccept(item.id)}
              disabled={disabled}
            >
              <Text style={styles.buttonText}>{s.accept}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => onDelete(item.id)}
              disabled={disabled}
            >
              <Text style={styles.buttonText}>{s.delete}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}
