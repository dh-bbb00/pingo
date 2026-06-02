import React, { useMemo, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { CATEGORY_EMOJIS } from '@/constants/emojis'
import { makeStyles, NUM_COLS } from './EmojiPickerModal.styles'

interface Props {
  visible:   boolean
  selected:  string
  onSelect:  (emoji: string) => void
  onClose:   () => void
}

export default function EmojiPickerModal({ visible, selected, onSelect, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [activeTab, setActiveTab] = useState(0)

  const currentEmojis = (CATEGORY_EMOJIS[activeTab]?.emojis ?? []) as unknown as string[]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

      <View style={styles.sheet}>
        <Text style={styles.title}>{strings.categoryEdit.emojiPickerTitle}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContent}
        >
          {CATEGORY_EMOJIS.map((cat, i) => {
            const isActive = i === activeTab
            return (
              <TouchableOpacity
                key={cat.label}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(i)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        <FlatList
          key={activeTab}
          data={currentEmojis}
          numColumns={NUM_COLS}
          keyExtractor={(item, i) => `${item}-${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.cell, item === selected && styles.cellActive]}
              onPress={() => { onSelect(item); onClose() }}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      </View>
    </Modal>
  )
}
