import React, { useMemo, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import type { RouteProp } from '@react-navigation/native'
import type { CategoryStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { useCategoryForm } from './hooks/useCategoryForm'
import { useCreateCategory, useUpdateCategory } from './hooks/useCategoryEdit'
import ColorPickerModal from './components/ColorPickerModal'
import EmojiPickerModal from './components/EmojiPickerModal'
import { makeStyles } from './CategoryEditScreen.styles'

type Route = RouteProp<CategoryStackParamList, 'CategoryEdit'>

const s = strings.categoryEdit

export default function CategoryEditScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { params } = useRoute<Route>()
  const isEdit  = !!params?.id
  const title   = isEdit ? s.headerEdit : s.headerCreate

  const { form, setField, isValid } = useCategoryForm()
  const { mutate: create, isPending: creating } = useCreateCategory()
  const { mutate: update, isPending: updating } = useUpdateCategory(params?.id ?? '')

  const [showColor, setShowColor] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const nameError = submitted && form.name.trim() === '' ? s.errNameEmpty : undefined

  const handleSubmit = () => {
    setSubmitted(true)
    if (!isValid()) return
    if (isEdit) update(form)
    else        create(form)
  }

  const isPending = creating || updating

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* ── 타이틀 ── */}
        <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text.primary, marginBottom: 28 }}>
          {title}
        </Text>

        {/* ── 아이콘 + 색상 미리보기 ── */}
        <View style={styles.previewSection}>
          <View style={[styles.previewCircle, { backgroundColor: form.color }]}>
            <Text style={styles.previewEmoji}>{form.icon}</Text>
          </View>
          <View style={styles.pickerRow}>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowEmoji(true)} activeOpacity={0.7}>
              <Text style={{ fontSize: 18 }}>{form.icon}</Text>
              <Text style={styles.pickerBtnText}>{s.iconLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowColor(true)} activeOpacity={0.7}>
              <View style={[styles.colorSwatch, { backgroundColor: form.color }]} />
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
          value={form.budget}
          onChangeText={(v) => setField('budget', v.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          returnKeyType="done"
        />
        <Text style={styles.hintText}>
          예산을 설정하면 차트에서 카테고리별 사용 현황을 확인할 수 있습니다.
        </Text>

        <View style={styles.sectionGap} />

        {/* ── 매달 예산 고정 ── */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setField('isFixedBudget', !form.isFixedBudget)}
          activeOpacity={0.7}
          disabled={form.budget === ''}
        >
          <View style={styles.toggleLeft}>
            <Text style={[styles.toggleLabel, form.budget === '' && { color: theme.colors.text.disabled }]}>
              {s.fixedBudget}
            </Text>
            <Text style={styles.toggleDesc}>{s.fixedBudgetDesc}</Text>
          </View>
          <View style={[
            styles.toggleBtn,
            { backgroundColor: form.isFixedBudget && form.budget !== '' ? theme.colors.primary : theme.colors.border },
          ]}>
            <View style={[
              styles.toggleThumb,
              { alignSelf: form.isFixedBudget && form.budget !== '' ? 'flex-end' : 'flex-start' },
            ]} />
          </View>
        </TouchableOpacity>

        {/* ── 등록 버튼 ── */}
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
    </KeyboardAvoidingView>
  )
}
