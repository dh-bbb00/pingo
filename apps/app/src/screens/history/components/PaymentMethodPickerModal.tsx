import React, { useMemo, useState } from 'react'
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator, SectionList } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import type { PaymentMethod } from '@/api/endpoints/paymentMethods.api'
import { makeStyles } from './PaymentMethodPickerModal.styles'

const s = strings.transactionEdit

interface Props {
  visible:    boolean
  selectedId: string  // '' = 미지정
  onSelect:   (paymentMethodId: string) => void
  onClose:    () => void
}

// 결제수단 타입 레이블 (UI 표시용)
const TYPE_LABEL: Record<string, string> = {
  CASH:      '현금',
  GIFT_CARD: '상품권',
  CARD:      '카드',
}

export default function PaymentMethodPickerModal({ visible, selectedId, onSelect, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [localSelected, setLocalSelected] = useState(selectedId)

  const { data: methods, isLoading } = usePaymentMethods()

  // CASH·GIFT_CARD → 기본 섹션, CARD → 카드 섹션
  const sections = useMemo(() => {
    if (!methods) return []
    const fixed = methods.filter(m => m.type === 'CASH' || m.type === 'GIFT_CARD')
    const cards = methods.filter(m => m.type === 'CARD')
    return [
      { title: s.paymentMethodSectionFixed, data: fixed },
      { title: s.paymentMethodSectionCard,  data: cards },
    ].filter(sec => sec.data.length > 0)
  }, [methods])

  const handleConfirm = () => {
    onSelect(localSelected)
    onClose()
  }

  const renderItem = ({ item }: { item: PaymentMethod }) => {
    const isSelected = item.id === localSelected
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => setLocalSelected(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.typeTag}>{TYPE_LABEL[item.type]}</Text>
        <Text style={[styles.itemName, isSelected && styles.itemNameSelected]} numberOfLines={1}>
          {item.name}
        </Text>
        {isSelected && <View style={styles.checkDot} />}
      </TouchableOpacity>
    )
  }

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionText}>{section.title}</Text>
    </View>
  )

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{s.paymentMethodPickerTitle}</Text>

          <View style={styles.listWrap}>
            {isLoading ? (
              <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
            ) : sections.length === 0 ? (
              <Text style={styles.emptyText}>{s.paymentMethodPickerEmpty}</Text>
            ) : (
              <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
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
