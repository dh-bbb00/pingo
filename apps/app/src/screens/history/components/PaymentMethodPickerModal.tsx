import React, { useMemo, useState, useEffect } from 'react'
import { View, Text, Modal, TouchableOpacity, ActivityIndicator, SectionList } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import type { PaymentMethod } from '@/api/endpoints/paymentMethods.api'
import { PAYMENT_METHOD_EMOJI } from '@/constants/emojis'
import { makeStyles } from './PaymentMethodPickerModal.styles'

const s = strings.transactionEdit
const sf = strings.history

type SingleProps = {
  mode:      'single'
  selectedId: string
  onSelect:  (id: string) => void
  onAddCard: () => void
}

type MultiProps = {
  mode:         'multi'
  committedIds: string[]
  onConfirm:    (ids: string[]) => void
}

type Props = { visible: boolean; onClose: () => void } & (SingleProps | MultiProps)

export default function PaymentMethodPickerModal(props: Props) {
  const { visible, onClose } = props
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { data: methods, isLoading } = usePaymentMethods()

  // 멀티 모드 전용 로컬 상태
  const [localIds, setLocalIds] = useState<string[]>([])
  useEffect(() => {
    if (visible && props.mode === 'multi') setLocalIds(props.committedIds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const sections = useMemo(() => {
    if (!methods) return []
    const fixed = methods.filter(m => m.type === 'CASH' || m.type === 'GIFT_CARD')
    const cards = methods.filter(m => m.type === 'CARD')
    const result = []
    if (fixed.length > 0) result.push({ title: s.paymentMethodSectionFixed, data: fixed })
    result.push({ title: s.paymentMethodSectionCard, data: cards })
    return result
  }, [methods])

  function handleItemPress(id: string) {
    if (props.mode === 'single') {
      props.onSelect(id)
      onClose()
    } else {
      setLocalIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }
  }

  function handleConfirm() {
    if (props.mode === 'multi') props.onConfirm(localIds)
    onClose()
  }

  const renderItem = ({ item }: { item: PaymentMethod }) => {
    const isSelected = props.mode === 'single'
      ? item.id === props.selectedId
      : localIds.includes(item.id)

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.itemSelected]}
        onPress={() => handleItemPress(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.typeTag}>{PAYMENT_METHOD_EMOJI[item.type]}</Text>
        <Text style={[styles.itemName, isSelected && styles.itemNameSelected]} numberOfLines={1}>
          {item.name}
          {item.cardNumber ? <Text style={styles.cardNumber}> ({item.cardNumber})</Text> : null}
        </Text>
        {props.mode === 'single'
          ? isSelected && <View style={styles.checkDot} />
          : <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
        }
      </TouchableOpacity>
    )
  }

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionText}>{section.title}</Text>
    </View>
  )

  const renderSectionFooter = ({ section }: { section: { title: string; data: PaymentMethod[] } }) => {
    if (props.mode !== 'single') return null
    if (section.title !== s.paymentMethodSectionCard || section.data.length > 0) return null
    return (
      <View style={styles.noCardWrap}>
        <Text style={styles.emptyText}>{strings.paymentMethods.noCards}</Text>
      </View>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
          {props.mode === 'single' ? (
            <Text style={styles.title}>{s.paymentMethodPickerTitle}</Text>
          ) : (
            <View style={styles.header}>
              <Text style={styles.title}>{sf.filterPaymentPickerTitle}</Text>
              <TouchableOpacity onPress={() => setLocalIds([])} activeOpacity={0.7}>
                <Text style={[styles.clearBtn, localIds.length === 0 && styles.clearBtnDisabled]}>
                  {sf.filterAll}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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

          {props.mode === 'single' && (
            <TouchableOpacity style={styles.addPaymentMethodBtn} onPress={() => { onClose(); props.onAddCard() }} activeOpacity={0.8}>
              <Text style={styles.addPaymentMethodText}>{strings.paymentMethods.addPaymentMethod}</Text>
            </TouchableOpacity>
          )}

          {props.mode === 'multi' && (
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.8}>
              <Text style={styles.confirmText}>{sf.filterPickerConfirm}</Text>
            </TouchableOpacity>
          )}
        </View>
    </Modal>
  )
}
