import React, { useMemo, useState, useCallback } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, LayoutAnimation, Platform, UIManager, RefreshControl } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { AdminUserDetail } from '../types'
import { useAdminUsers } from './hooks/useAdminUsers'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import UserListItem from './components/UserListItem'
import UserListSkeleton from './components/UserListSkeleton'
import PaginationBar from './components/PaginationBar'
import { makeStyles } from './UserManagementScreen.styles'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

const PAGE_SIZE = 20
const s = strings.userManagement

type Tab = 'APPROVED' | 'SUSPENDED'

export default function UserManagementScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [activeTab,       setActiveTab]   = useState<Tab>('APPROVED')
  const [search,          setSearch]      = useState('')
  const [debouncedSearch, setDebounced]   = useState('')
  const [page,            setPage]        = useState(1)
  const [expandedId,      setExpandedId]  = useState<string | null>(null)

  // 검색 디바운스 — 입력 후 400ms 대기
  const searchTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearch = useCallback((text: string) => {
    setSearch(text)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setDebounced(text)
      setPage(1)
    }, 400)
  }, [])

  const clearSearch = useCallback(() => {
    setSearch('')
    setDebounced('')
    setPage(1)
  }, [])

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setSearch('')
    setDebounced('')
    setPage(1)
    setExpandedId(null)
  }, [])

  const { data, isLoading, refetch } = useAdminUsers({
    search:   debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
    status:   activeTab,
  })

  const { refreshing, onRefresh } = usePullToRefresh(refetch)

  const users      = data?.data ?? []
  const pagination = data?.pagination

  const handleToggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  const emptyText = debouncedSearch ? s.emptySearch : s.empty

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>{s.header}</Text>
        {!isLoading && pagination && (
          <Text style={styles.count}>{s.totalCount(pagination.total)}</Text>
        )}
      </View>

      <View style={styles.tabBar}>
        {(['APPROVED', 'SUSPENDED'] as Tab[]).map((tab) => {
          const isActive = activeTab === tab
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handleTabChange(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab === 'APPROVED' ? s.tabActive : s.tabSuspended}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder={s.searchPlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={search}
          onChangeText={handleSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity style={styles.searchClear} onPress={clearSearch}>
            <Text style={styles.searchClearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <UserListSkeleton />
      ) : (
        <FlatList<AdminUserDetail>
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserListItem
              item={item}
              expanded={expandedId === item.id}
              onToggle={handleToggle}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
          ListFooterComponent={
            pagination ? (
              <PaginationBar
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            ) : null
          }
        />
      )}
    </View>
  )
}
