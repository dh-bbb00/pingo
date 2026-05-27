import React, { useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useApprovals, useApproveRequest, useRejectRequest } from '@/hooks/queries/useApprovals'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { ApprovalRequest } from './types'
import { makeStyles } from './ApprovalManagementScreen.styles'

const s = strings.approvalManagement

export default function ApprovalManagementScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { data = [], isLoading } = useApprovals()
  const { mutate: approve, isPending: isApproving } = useApproveRequest()
  const { mutate: reject,  isPending: isRejecting  } = useRejectRequest()

  const isMutating = isApproving || isRejecting

  function renderItem({ item }: { item: ApprovalRequest }) {
    return (
      <View style={styles.card}>
        <Text style={styles.email}>{item.user.email}</Text>
        <Text style={styles.meta}>{item.device.phoneModel} · {item.device.osVersion}</Text>
        <Text style={styles.meta}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => approve(item.id)}
            disabled={isMutating}
          >
            <Text style={styles.buttonText}>{s.approve}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => reject(item.id)}
            disabled={isMutating}
          >
            <Text style={styles.buttonText}>{s.reject}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{s.header}</Text>
        {!isLoading && <Text style={styles.count}>{s.totalCount(data.length)}</Text>}
      </View>
      {isLoading
        ? <ActivityIndicator style={styles.loader} />
        : (
          <FlatList<ApprovalRequest>
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.empty}>{s.empty}</Text>}
            contentContainerStyle={styles.list}
          />
        )
      }
    </View>
  )
}
