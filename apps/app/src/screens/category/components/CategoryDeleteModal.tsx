import React, { useMemo, useState } from 'react'
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useCategories } from '@/hooks/queries/useCategories'
import type { Category } from '@/api/endpoints/categories.api'
import { makeStyles } from './CategoryDeleteModal.styles'

const s = strings.categoryEdit

interface Props {
  visible:         boolean
  excludeId:       string        // 삭제 대상 카테고리 — 목록에서 제외
  onConfirm:       (replaceCategoryId?: string) => void
  onCancel:        () => void
  isPending:       boolean
}

const NO_CATEGORY_ID = '__none__'

export default function CategoryDeleteModal({ visible, excludeId, onConfirm, onCancel, isPending }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [selectedId, setSelectedId] = useState<string>(NO_CATEGORY_ID)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCategories('date_desc')

  const categories = useMemo(
    () => data?.pages.flatMap(p => p.data).filter(c => c.id !== excludeId) ?? [],
    [data, excludeId],
  )

  const handleConfirm = () => {
    onConfirm(selectedId === NO_CATEGORY_ID ? undefined : selectedId)
  }

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = item.id === selectedId
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.itemIcon, { backgroundColor: item.color }]}>
          <Text style={styles.itemEmoji}>{item.icon}</Text>
        </View>
        <Text style={[styles.itemName, isSelected && styles.itemNameSelected]} numberOfLines={1}>
          {item.name}
        </Text>
        {isSelected && <View style={styles.checkDot} />}
      </TouchableOpacity>
    )
  }

  const NoneItem = (
    <TouchableOpacity
      style={[styles.item, styles.noneItem, selectedId === NO_CATEGORY_ID && styles.itemSelected]}
      onPress={() => setSelectedId(NO_CATEGORY_ID)}
      activeOpacity={0.7}
    >
      <View style={[styles.itemIcon, styles.noneIcon]}>
        <Text style={styles.itemEmoji}>—</Text>
      </View>
      <Text style={[styles.itemName, selectedId === NO_CATEGORY_ID && styles.itemNameSelected]}>
        {s.deleteNoCategory}
      </Text>
      {selectedId === NO_CATEGORY_ID && <View style={styles.checkDot} />}
    </TouchableOpacity>
  )

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <Text style={styles.title}>{s.deleteTitle}</Text>
          <Text style={styles.message}>{s.deleteMessage}</Text>

          <View style={styles.listWrap}>
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListHeaderComponent={NoneItem}
              ListFooterComponent={
                isFetchingNextPage
                  ? <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
                  : null
              }
              onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
              onEndReachedThreshold={0.3}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onCancel} activeOpacity={0.7}>
              <Text style={styles.cancelText}>{strings.common.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.confirmBtn, isPending && styles.btnDisabled]}
              onPress={handleConfirm}
              activeOpacity={0.7}
              disabled={isPending}
            >
              <Text style={styles.confirmText}>{s.deleteConfirm}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  )
}
