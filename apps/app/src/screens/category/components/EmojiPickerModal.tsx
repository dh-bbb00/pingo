import React, { useMemo, useState } from 'react'
import { Modal, View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles, NUM_COLS } from './EmojiPickerModal.styles'

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

      <View style={styles.sheet}>
        <Text style={styles.title}>{strings.categoryEdit.emojiPickerTitle}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContent}
        >
          {EMOJI_CATEGORIES.map((cat, i) => {
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
