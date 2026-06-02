import React, { useMemo, useState, useEffect } from 'react'
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useCategoriesAll } from '@/hooks/queries/useCategoriesAll'
import type { Category } from '@/api/endpoints/categories.api'
import { makeStyles } from './CategoryFilterModal.styles'

const s = strings.history

interface Props {
  visible:      boolean
  committedIds: string[]
  onConfirm:    (ids: string[]) => void
  onClose:      () => void
}

export default function CategoryFilterModal({ visible, committedIds, onConfirm, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { data: categories = [], isLoading } = useCategoriesAll()

  const [localIds, setLocalIds] = useState<string[]>(committedIds)
  useEffect(() => {
    if (visible) setLocalIds(committedIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])  // visible 변화(열림) 시점 스냅샷만 사용 — committedIds 의도적 제외

  function toggle(id: string) {
    setLocalIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function handleConfirm() {
    onConfirm(localIds)
    onClose()
  }

  const renderItem = ({ item }: { item: Category }) => {
    const isSelected = localIds.includes(item.id)
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => toggle(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <Text style={[styles.itemName, isSelected && styles.itemNameSelected]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{s.filterCategoryPickerTitle}</Text>
            <TouchableOpacity onPress={() => setLocalIds([])} activeOpacity={0.7}>
              <Text style={[styles.clearBtn, localIds.length === 0 && styles.clearBtnDisabled]}>
                {s.filterAll}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listWrap}>
            {isLoading ? (
              <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
            ) : (
              <FlatList
                data={categories}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={styles.confirmText}>{s.filterPickerConfirm}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
