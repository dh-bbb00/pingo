import React, { useMemo } from 'react'
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, SectionList, StyleSheet } from 'react-native'
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
  onAddCard:  () => void  // 카드 없을 때 "등록하기" 콜백
}

const TYPE_EMOJI: Record<string, string> = {
  CASH:      '💰',
  GIFT_CARD: '🎁',
  CARD:      '💳',
}

export default function PaymentMethodPickerModal({ visible, selectedId, onSelect, onClose, onAddCard }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { data: methods, isLoading } = usePaymentMethods()

  // CASH·GIFT_CARD → 기본 섹션, CARD → 카드 섹션 (카드 없으면 빈 섹션으로 헤더만 표시)
  const sections = useMemo(() => {
    if (!methods) return []
    const fixed = methods.filter(m => m.type === 'CASH' || m.type === 'GIFT_CARD')
    const cards = methods.filter(m => m.type === 'CARD')
    const result = []
    if (fixed.length > 0) result.push({ title: s.paymentMethodSectionFixed, data: fixed })
    // 카드가 없어도 섹션은 항상 표시 (빈 상태 안내를 위해)
    result.push({ title: s.paymentMethodSectionCard, data: cards })
    return result
  }, [methods])


  const renderItem = ({ item }: { item: PaymentMethod }) => {
    const isSelected = item.id === selectedId
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => { onSelect(item.id); onClose() }}
        activeOpacity={0.7}
      >
        <Text style={styles.typeTag}>{TYPE_EMOJI[item.type]}</Text>
        <Text style={[styles.itemName, isSelected && styles.itemNameSelected]} numberOfLines={1}>
          {item.name}
          {item.cardNumber ? <Text style={styles.cardNumber}> ({item.cardNumber})</Text> : null}
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

  const renderSectionFooter = ({ section }: { section: { title: string; data: PaymentMethod[] } }) => {
    if (section.title !== s.paymentMethodSectionCard || section.data.length > 0) return null
    return (
      <View style={styles.noCardWrap}>
        <Text style={styles.emptyText}>{strings.paymentMethods.noCards}</Text>
        <TouchableOpacity style={styles.addCardBtn} onPress={() => { onClose(); onAddCard() }} activeOpacity={0.7}>
          <Text style={styles.addCardText}>{strings.paymentMethods.addCard}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{s.paymentMethodPickerTitle}</Text>

          <View style={styles.listWrap}>
            {isLoading ? (
              <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
            ) : (
              <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                renderSectionFooter={renderSectionFooter}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

        </View>
      </View>
    </Modal>
  )
}
