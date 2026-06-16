import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { CategoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useCategoryForm, DEFAULT_ICON, DEFAULT_COLOR } from './hooks/useCategoryForm'
import { useCategoryById } from './hooks/useCategoryById'
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from './hooks/useCategoryEdit'
import ColorPickerModal from './components/ColorPickerModal'
import EmojiPickerModal from './components/EmojiPickerModal'
import CategoryDeleteModal from './components/CategoryDeleteModal'
import CategoryEditSkeleton from './components/CategoryEditSkeleton'
import { makeStyles } from './CategoryEditScreen.styles'

type Route = RouteProp<CategoryStackParamList, 'CategoryEdit'>

const s = strings.categoryEdit

export default function CategoryEditScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params } = useRoute<Route>()
  const isEdit             = !!params?.id
  const returnToTransaction = !!params?.returnToTransaction
  const title              = isEdit ? s.headerEdit : s.headerCreate

  const { data: categoryData, isLoading: loadingCategory } = useCategoryById(isEdit ? params?.id : undefined)
  const { form, setField, setForm, isValid } = useCategoryForm()
  const { mutate: create, isPending: creating } = useCreateCategory(returnToTransaction)
  const { mutate: update, isPending: updating } = useUpdateCategory(params?.id ?? '')
  const { mutate: deleteCat, isPending: deleting } = useDeleteCategory(params?.id ?? '')

  // edit 모드에서 기존 데이터를 폼에 1회 세팅
  const initialized = useRef(false)
  useEffect(() => {
    if (isEdit && categoryData && !initialized.current) {
      initialized.current = true
      setForm({
        name:          categoryData.name,
        icon:          categoryData.icon  || DEFAULT_ICON,
        color:         categoryData.color || DEFAULT_COLOR,
        budget:        categoryData.budget !== null ? categoryData.budget.toString() : '',
        isFixedBudget: categoryData.isBudgetFixed,
      })
    }
  }, [categoryData, isEdit, setForm])

  const [showColor,  setShowColor]  = useState(false)
  const [showEmoji,  setShowEmoji]  = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  const nameError = submitted && form.name.trim() === '' ? s.errNameEmpty : undefined

  const handleSubmit = () => {
    setSubmitted(true)
    if (!isValid()) return
    if (isEdit) update(form)
    else        create(form)
  }

  const isPending      = creating || updating || deleting
  const isToggleActive = form.isFixedBudget && form.budget !== ''
  const colorBgStyle   = { backgroundColor: form.color }

  if (isEdit && loadingCategory) {
    return <CategoryEditSkeleton title={title} />
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

        {/* ── 타이틀 ── */}
        <Text style={styles.screenTitle}>{title}</Text>

        {/* ── 아이콘 + 색상 미리보기 ── */}
        <View style={styles.previewSection}>
          <View style={[styles.previewCircle, colorBgStyle]}>
            <Text style={styles.previewEmoji}>{form.icon}</Text>
          </View>
          <View style={styles.pickerRow}>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowEmoji(true)} activeOpacity={0.7}>
              <Text style={styles.pickerIcon}>{form.icon}</Text>
              <Text style={styles.pickerBtnText}>{s.iconLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowColor(true)} activeOpacity={0.7}>
              <View style={[styles.colorSwatch, colorBgStyle]} />
              <Text style={styles.pickerBtnText}>{s.colorLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── 카테고리명 ── */}
        <Text style={styles.label}>{s.nameLabel}</Text>
        <TextInput
          style={[styles.input, nameError && styles.inputError]}
          placeholder={s.namePlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={form.name}
          onChangeText={(v) => setField('name', v)}
          returnKeyType="next"
          maxLength={20}
        />
        {nameError && <Text style={styles.errorText}>{nameError}</Text>}

        <View style={styles.sectionGap} />

        {/* ── 월 예산 ── */}
        <Text style={styles.label}>{s.budgetLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={s.budgetPlaceholder}
          placeholderTextColor={theme.colors.text.disabled}
          value={form.budget.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChangeText={(v) => setField('budget', v.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          returnKeyType="done"
        />
        <Text style={styles.hintText}>{s.budgetHint}</Text>

        <View style={styles.sectionGap} />

        {/* ── 매달 예산 고정 ── */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setField('isFixedBudget', !form.isFixedBudget)}
          activeOpacity={0.7}
          disabled={form.budget === ''}
        >
          <View style={styles.toggleLeft}>
            <Text style={[styles.toggleLabel, form.budget === '' && styles.toggleLabelDisabled]}>
              {s.fixedBudget}
            </Text>
            <Text style={styles.toggleDesc}>{s.fixedBudgetDesc}</Text>
          </View>
          <View style={[styles.toggleBtn, isToggleActive ? styles.toggleBtnOn : styles.toggleBtnOff]}>
            <View style={[styles.toggleThumb, isToggleActive ? styles.toggleThumbOn : styles.toggleThumbOff]} />
          </View>
        </TouchableOpacity>

        {/* ── 등록/수정 버튼 ── */}
        <TouchableOpacity
          style={[styles.submitBtn, isPending && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={isPending}
        >
          <Text style={styles.submitBtnText}>
            {isEdit ? s.update : s.submit}
          </Text>
        </TouchableOpacity>

        {/* ── 삭제 버튼 (수정 모드만) ── */}
        {isEdit && (
          <TouchableOpacity
            style={[styles.deleteBtn, isPending && styles.submitBtnDisabled]}
            onPress={() => setShowDelete(true)}
            activeOpacity={0.8}
            disabled={isPending}
          >
            <Text style={styles.deleteBtnText}>{s.deleteBtn}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ColorPickerModal
        visible={showColor}
        initialColor={form.color}
        onSelect={(hex) => setField('color', hex)}
        onClose={() => setShowColor(false)}
      />
      <EmojiPickerModal
        visible={showEmoji}
        selected={form.icon}
        onSelect={(emoji) => setField('icon', emoji)}
        onClose={() => setShowEmoji(false)}
      />
      {isEdit && (
        <CategoryDeleteModal
          visible={showDelete}
          excludeId={params!.id!}
          isPending={deleting}
          onConfirm={(replaceCategoryId) => deleteCat(replaceCategoryId)}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </KeyboardAvoidingView>
  )
}
