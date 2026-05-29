import React, { useMemo } from 'react'
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import { useTheme } from '@/theme'
import SkeletonBox from '@/components/containers/SkeletonBox'
import { makeStyles } from './CategoryEditSkeleton.styles'

interface Props {
  title: string
}

export default function CategoryEditSkeleton({ title }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <Text style={styles.screenTitle}>{title}</Text>

        {/* 아이콘 + 색상 미리보기 */}
        <View style={styles.previewSection}>
          <SkeletonBox width={96} height={96} radius={48} style={styles.previewGap} />
          <View style={styles.pickerRow}>
            <SkeletonBox width={90} height={40} radius={theme.radius.md} />
            <SkeletonBox width={90} height={40} radius={theme.radius.md} />
          </View>
        </View>

        {/* 카테고리명 */}
        <SkeletonBox width={60} height={13} radius={4} style={styles.labelGap} />
        <SkeletonBox width="100%" height={50} radius={theme.radius.md} style={styles.fieldGap} />

        <View style={styles.sectionGap} />

        {/* 이번 달 예산 */}
        <SkeletonBox width={80} height={13} radius={4} style={styles.labelGap} />
        <SkeletonBox width="100%" height={50} radius={theme.radius.md} style={styles.fieldGap} />
        <SkeletonBox width="75%" height={11} radius={4} />

        <View style={styles.sectionGap} />

        {/* 매달 예산 고정 토글 */}
        <SkeletonBox width="100%" height={64} radius={theme.radius.md} style={styles.fieldGap} />

        {/* 수정 버튼 */}
        <SkeletonBox width="100%" height={52} radius={theme.radius.md} style={styles.submitGap} />

      </ScrollView>
    </KeyboardAvoidingView>
  )
}
