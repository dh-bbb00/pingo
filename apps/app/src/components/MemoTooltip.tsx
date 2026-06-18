import React, { useEffect, useState } from 'react'
import { Modal, View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'

interface Props {
  memo:      string
  visible:   boolean
  bottom:    number
  onDismiss: () => void
}

export default function MemoTooltip({ memo, visible, bottom, onDismiss }: Props) {
  const { theme } = useTheme()
  // 롱프레스 직후 손 뗄 때 즉시 닫히는 현상 방지 — 350ms 후 backdrop 활성화
  const [dismissable, setDismissable] = useState(false)

  useEffect(() => {
    if (!visible) { setDismissable(false); return }
    const t = setTimeout(() => setDismissable(true), 350)
    return () => clearTimeout(t)
  }, [visible])

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss}>
      <TouchableWithoutFeedback onPress={() => { if (dismissable) onDismiss() }}>
        <View style={ss.backdrop}>
          <View style={[ss.bubble, { bottom, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[ss.text, { color: theme.colors.text.primary }]}>
              {memo}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const ss = StyleSheet.create({
  backdrop: { flex: 1 },
  bubble: {
    position:  'absolute',
    left:      16,
    right:     16,
    borderRadius:     12,
    borderWidth:      1,
    paddingHorizontal: 14,
    paddingVertical:   12,
    elevation:        8,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 4 },
    shadowOpacity:    0.15,
    shadowRadius:     10,
  },
  text: { fontSize: 14, lineHeight: 22 },
})
