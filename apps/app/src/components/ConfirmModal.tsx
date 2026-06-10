import React, { useMemo } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { useTheme } from '@/theme'
import { useConfirmStore } from '@/store/confirmStore'
import { makeStyles } from './ConfirmModal.styles'

export default function ConfirmModal() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const { visible, title, message, buttons, hide } = useConfirmStore()

  const handlePress = (onPress?: () => void) => {
    hide()
    onPress?.()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.body}>
            <Text style={styles.title}>{title}</Text>
            {!!message && <Text style={styles.message}>{message}</Text>}
          </View>

          <View style={styles.buttonRow}>
            {buttons.map((btn, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={styles.buttonDivider} />}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handlePress(btn.onPress)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={
                      btn.style === 'cancel'
                        ? styles.buttonTextCancel
                        : btn.style === 'destructive'
                          ? styles.buttonTextDestructive
                          : styles.buttonTextDefault
                    }
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}
