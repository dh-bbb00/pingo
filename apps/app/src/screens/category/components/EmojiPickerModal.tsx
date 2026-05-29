import React, { useState } from 'react'
import { Modal, View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'

const EMOJI_CATEGORIES = [
  { label: '식비', emojis: [
    '🍽️','🍔','🍕','🍜','🍱','🍣','🥗','🍗','🥘','🍲','🥙','🌮',
    '🌯','🥪','🧆','🍳','🥩','🍖','🥓','🍛','🥟','🍤','🦞','🦐',
    '🫕','🥨','🍚','🍙','🍘','🥫','🏪','🏬','🛒','🫔','🫓','🍝',
  ]},
  { label: '카페', emojis: [
    '☕','🧋','🍵','🥤','🍹','🍷','🍺','🥃','🍾','🍸','🫖','🧃',
    '🥛','🍶','🧊','🍫','🍬','🍭','🍩','🧁','🎂','🍰','🥐','🥖',
    '🍞','🧈','🍮','🍯','🥧','🍦','🍧','🍨','🍿','🧇','🌰','🫘',
  ]},
  { label: '교통', emojis: [
    '🚗','🚕','🚌','🚂','🚇','✈️','🚲','🛵','🏍️','🛻','🚁','🛳️',
    '⛵','🚜','🚛','⛽','🅿️','🚦','🚧','🛞','🗺️','🛣️','🏎️','🚐',
    '🚃','🚄','🚅','🚈','🚊','🚝','🚞','🛺','🚠','🚡','🚟','🛥️',
  ]},
  { label: '주거', emojis: [
    '🏠','🏡','🏢','🏣','🏤','🏨','🔑','💡','⚡','💧','🔥','🌡️',
    '🛋️','🛏️','🪑','🚿','🛁','🪞','🚪','🪟','🧹','🧺','🧻','🪣',
    '🧴','🔧','🔩','🪚','🧰','🪜','🔌','🔋','📺','🎛️','🪴','📦',
  ]},
  { label: '쇼핑', emojis: [
    '🛍️','🛒','👕','👗','👔','👖','🧥','👚','🧣','🧤','🧢','👒',
    '🎩','👠','👟','🥾','👞','👢','🩴','👜','🧳','💍','💎','💄',
    '🧴','🪡','🧵','👓','🕶️','💅','💈','🏷️','🎀','🪮','🧸','🪆',
  ]},
  { label: '여가', emojis: [
    '🎬','🎮','🎵','🎨','📚','🎭','🎤','🎸','🎻','🎹','🥁','🎺',
    '🎷','🎲','🧩','♟️','🃏','🎯','🎱','🎫','🎟️','🎡','🎢','🎠',
    '🏖️','🎪','🪆','🎽','🛹','🪃','🏹','🎣','🤿','🪂','🏄','🚴',
  ]},
  { label: '운동', emojis: [
    '🏋️','⚽','🏀','⚾','🎾','🏸','🏓','🥊','🤸','🧗','🏊','🏇',
    '⛷️','🏂','🤺','🥋','⛳','🏌️','🤼','🏃','🧘','🤾','🏐','🏈',
    '🏉','🎿','🛷','🥌','🏒','🥅','⛸️','🛼','🚵','🧜','🏄','🤽',
  ]},
  { label: '의료', emojis: [
    '💊','🏥','💉','🩺','🩹','🩻','🫀','🧠','🦷','🦴','🩸','🔬',
    '🧪','🧬','🌡️','🚑','🩼','🦯','🦽','🦼','👁️','👂','💆','💇',
    '🧖','🧴','🧼','🪥','🌿','🍃','🌱','💪','🤧','😷','🧑‍⚕️','👶',
  ]},
  { label: '교육', emojis: [
    '📚','📖','📝','✏️','🖊️','📓','📔','📒','📕','📗','📘','📙',
    '📃','📊','📈','📉','🗂️','📁','🎓','🏫','💻','🖥️','📱','⌨️',
    '🖨️','📡','🔭','🔬','🧮','🗒️','📋','🖋️','🗃️','📌','📍','🗝️',
  ]},
  { label: '여행', emojis: [
    '✈️','🗺️','🧳','🏨','🏕️','🏖️','🏝️','🏔️','🗻','🌋','🏜️','🌅',
    '🌄','🌇','🌆','🌃','🌌','🎑','🗼','🗽','🗿','🏛️','⛩️','🕌',
    '🕍','🏯','🏰','🌉','🌁','🧭','📸','🛂','🛃','🛄','🛅','🎡',
  ]},
  { label: '반려', emojis: [
    '🐶','🐱','🐰','🐹','🐭','🐮','🐷','🐸','🐔','🐧','🦜','🐠',
    '🐟','🐡','🦎','🐢','🐇','🐈','🐕','🦮','🐩','🐈‍⬛','🐕‍🦺','🪺',
    '🐾','🦴','🎾','🧸','🌿','🌱','🌾','🍖','🏡','🛁','💊','🩺',
  ]},
  { label: '경조', emojis: [
    '🎁','🎉','🎊','🎈','🎀','🎂','🍰','🥂','🍾','💐','🌹','💍',
    '💒','👰','🤵','👶','🎓','🏆','🥇','🎖️','🏅','🪙','💰','🧧',
    '🪔','🕯️','🎋','🎑','🎆','🎇','✨','🌟','⭐','💫','🌈','🌠',
  ]},
] as const

const WIN_WIDTH  = Dimensions.get('window').width
const WIN_HEIGHT = Dimensions.get('window').height
const NUM_COLS  = 7
const CELL_SIZE = Math.floor((WIN_WIDTH - 64) / NUM_COLS)

interface Props {
  visible:   boolean
  selected:  string
  onSelect:  (emoji: string) => void
  onClose:   () => void
}

export default function EmojiPickerModal({ visible, selected, onSelect, onClose }: Props) {
  const { theme: t } = useTheme()
  const s = strings.categoryEdit

  const [activeTab, setActiveTab] = useState(0)

  const currentEmojis = (EMOJI_CATEGORIES[activeTab]?.emojis ?? []) as unknown as string[]

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: t.colors.surface }]}>
        <Text style={[styles.title, { color: t.colors.text.primary, fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold }]}>
          {s.emojiPickerTitle}
        </Text>

        {/* 카테고리 탭 — 가로 스크롤 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.tabScroll, { borderBottomColor: t.colors.divider }]}
          contentContainerStyle={styles.tabContent}
        >
          {EMOJI_CATEGORIES.map((cat, i) => {
            const isActive = i === activeTab
            return (
              <TouchableOpacity
                key={cat.label}
                style={[styles.tab, isActive && styles.tabActive, isActive && { borderBottomColor: t.colors.primary }]}
                onPress={() => setActiveTab(i)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.tabText,
                  { color: isActive ? t.colors.primary : t.colors.text.disabled,
                    fontSize: t.fontSize.xs,
                    fontWeight: isActive ? t.fontWeight.bold : t.fontWeight.medium },
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* 이모지 그리드 — 고정 높이로 스크롤 */}
        <FlatList
          key={activeTab}
          data={currentEmojis}
          numColumns={NUM_COLS}
          keyExtractor={(item, i) => `${item}-${i}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.cell,
                { width: CELL_SIZE, height: CELL_SIZE },
                item === selected && { backgroundColor: t.colors.primaryLight, borderRadius: t.radius.sm },
              ]}
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

const styles = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:      { height: WIN_HEIGHT * 0.3, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20, paddingHorizontal: 20 },
  title:      { marginBottom: 12 },
  tabScroll:  { borderBottomWidth: 1, marginBottom: 8, flexGrow: 0 },
  tabContent: { gap: 4 },
  tab:        { paddingHorizontal: 10, paddingVertical: 8 },
  tabActive:  { borderBottomWidth: 2 },
  tabText:    {},
  list:       { flex: 1 },
  grid:       { paddingBottom: 24 },
  cell:       { alignItems: 'center', justifyContent: 'center' },
  emoji:      { fontSize: 26 },
})
