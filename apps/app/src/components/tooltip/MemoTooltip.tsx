import React, { useEffect, useRef } from 'react'
import { Modal, View, Text, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'

interface Props {
  memo:    string
  visible: boolean
  bottom:  number
  onDismiss: () => void
}

export default function MemoTooltip({ memo, visible, bottom, onDismiss }: Props) {
  const { theme } = useTheme()
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (!visible) return
    anim.setValue(0)
    Animated.spring(anim, {
      toValue:         1,
      useNativeDriver: true,
      damping:         18,
      stiffness:       300,
    }).start()
  }, [visible, anim])

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onDismiss}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={ss.backdrop}>
          <Animated.View
            style={[
              ss.bubble,
              {
                bottom,
                backgroundColor: theme.colors.surface,
                borderColor:     theme.colors.border,
                opacity:         anim,
                transform:       [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
              },
            ]}
          >
            <Text style={[ss.label, { color: theme.colors.text.disabled }]}>
              {strings.common.memo}
            </Text>
            <Text style={[ss.text, { color: theme.colors.text.primary }]}>{memo}</Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const ss = StyleSheet.create({
  backdrop: { flex: 1 },
  bubble: {
    position:          'absolute',
    left:              16,
    right:             16,
    borderRadius:      16,
    borderWidth:       1,
    paddingHorizontal: 18,
    paddingVertical:   16,
    elevation:         12,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 6 },
    shadowOpacity:     0.18,
    shadowRadius:      14,
  },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 6, letterSpacing: 0.3 },
  text:  { fontSize: 16, lineHeight: 26 },
})
