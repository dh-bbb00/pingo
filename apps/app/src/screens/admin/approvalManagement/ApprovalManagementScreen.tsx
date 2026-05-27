import React, { useMemo, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import {
  useApprovals,
  useApproveRequest,
  useRejectRequest,
  useAcceptRequest,
  useDeleteApprovalRequest,
} from '@/hooks/queries/useApprovals'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { ApprovalRequest } from '../types'
import type { ApprovalStatus } from '@/api/endpoints/approvals.api'
import { makeStyles } from './ApprovalManagementScreen.styles'
import ApprovalRequestCard from './components/ApprovalRequestCard'

const s = strings.approvalManagement

export default function ApprovalManagementScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [activeTab, setActiveTab] = useState<ApprovalStatus>('PENDING')

  const { data = [], isLoading } = useApprovals(activeTab)
  const { mutate: approve, isPending: isApproving } = useApproveRequest()
  const { mutate: reject,  isPending: isRejecting  } = useRejectRequest()
  const { mutate: accept,  isPending: isAccepting  } = useAcceptRequest()
  const { mutate: remove,  isPending: isDeleting   } = useDeleteApprovalRequest()

  const isMutating = isApproving || isRejecting || isAccepting || isDeleting

  function confirmAccept(id: string) {
    Alert.alert(s.confirmAccept.title, s.confirmAccept.message, [
      { text: s.confirmAccept.cancel, style: 'cancel' },
      { text: s.confirmAccept.ok, onPress: () => accept(id) },
    ])
  }

  function confirmDelete(id: string) {
    Alert.alert(s.confirmDelete.title, s.confirmDelete.message, [
      { text: s.confirmDelete.cancel, style: 'cancel' },
      { text: s.confirmDelete.ok, style: 'destructive', onPress: () => remove(id) },
    ])
  }

  const emptyText = activeTab === 'PENDING' ? s.emptyPending : s.emptyRejected

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{s.header}</Text>
        {!isLoading && <Text style={styles.count}>{s.totalCount(data.length)}</Text>}
      </View>

      <View style={styles.tabBar}>
        {(['PENDING', 'REJECTED'] as ApprovalStatus[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'PENDING' ? s.tabPending : s.tabRejected}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading
        ? <ActivityIndicator style={styles.loader} />
        : (
          <FlatList<ApprovalRequest>
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ApprovalRequestCard
                item={item}
                tab={activeTab}
                disabled={isMutating}
                onApprove={approve}
                onReject={reject}
                onAccept={confirmAccept}
                onDelete={confirmDelete}
              />
            )}
            ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
            contentContainerStyle={styles.list}
          />
        )
      }
    </View>
  )
}
