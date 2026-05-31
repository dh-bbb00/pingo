import React, { useMemo, useState } from 'react'
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useCategories } from '@/hooks/queries/useCategories'
import type { Category } from '@/api/endpoints/categories.api'
import { makeStyles } from './CategoryPickerModal.styles'

const s = strings.transactionEdit

const NO_CATEGORY_ID = ''

interface Props {
  visible:    boolean
  selectedId: string   // '' = 기타
  onSelect:   (categoryId: string) => void
  onClose:    () => void
}

export default function CategoryPickerModal({ visible, selectedId, onSelect, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [localSelected, setLocalSelected] = useState(selectedId)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useCategories('name_asc')
  const categories = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data])

  const handleConfirm = () => {
    onSelect(localSelected)
    onClose()
  }

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = item.id === localSelected
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => setLocalSelected(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
          <Text style={styles.iconEmoji}>{item.icon}</Text>
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
      style={[styles.item, styles.noneItem, localSelected === NO_CATEGORY_ID && styles.itemSelected]}
      onPress={() => setLocalSelected(NO_CATEGORY_ID)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrap, styles.noneIcon]}>
        <Text style={styles.iconEmoji}>—</Text>
      </View>
      <Text style={[styles.itemName, localSelected === NO_CATEGORY_ID && styles.itemNameSelected]}>
        {s.noCategoryLabel}
      </Text>
      {localSelected === NO_CATEGORY_ID && <View style={styles.checkDot} />}
    </TouchableOpacity>
  )

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{s.categoryPickerTitle}</Text>

          <View style={styles.listWrap}>
            {isLoading ? (
              <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={NoneItem}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>{s.categoryPickerEmpty}</Text>
                }
                ListFooterComponent={
                  isFetchingNextPage
                    ? <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
                    : null
                }
                onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }}
                onEndReachedThreshold={0.3}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>{strings.common.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={handleConfirm} activeOpacity={0.7}>
              <Text style={styles.confirmText}>{strings.common.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
