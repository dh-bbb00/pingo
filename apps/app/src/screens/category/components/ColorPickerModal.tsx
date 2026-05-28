import React, { useState, useRef, useCallback } from 'react'
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  PanResponder, StyleSheet, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'

// ─── HSV utilities ────────────────────────────────────────────────────────────

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return '#' + [f(5), f(3), f(1)]
    .map(x => Math.round(x * 255).toString(16).padStart(2, '0'))
    .join('')
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  const v = max
  const s = max === 0 ? 0 : d / max
  let h = 0
  if (d !== 0) {
    if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else                h = ((r - g) / d + 4) / 6
  }
  return { h: h * 360, s, v }
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex)
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WIN_WIDTH  = Dimensions.get('window').width
const BOX_SIZE   = WIN_WIDTH - 64  // 32px padding each side
const HUE_H      = 26
const DOT_SIZE   = 22
const HUE_DOT    = 26

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visible:      boolean
  initialColor: string
  onSelect:     (hex: string) => void
  onClose:      () => void
}

export default function ColorPickerModal({ visible, initialColor, onSelect, onClose }: Props) {
  const { theme: t } = useTheme()
  const s = strings.categoryEdit

  const [hsv,      setHsv]      = useState(() => hexToHsv(initialColor))
  const [hexInput, setHexInput] = useState(initialColor.toUpperCase())

  const currentHex  = hsvToHex(hsv.h, hsv.s, hsv.v).toUpperCase()
  const hueOnlyHex  = hsvToHex(hsv.h, 1, 1)

  // ── SV box pan ──────────────────────────────────────────────────────────────
  const svPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (e) => updateSv(e.nativeEvent.locationX, e.nativeEvent.locationY),
    onPanResponderMove:  (e) => updateSv(e.nativeEvent.locationX, e.nativeEvent.locationY),
  })).current

  const updateSv = useCallback((x: number, y: number) => {
    const ns = Math.max(0, Math.min(1, x / BOX_SIZE))
    const nv = Math.max(0, Math.min(1, 1 - y / BOX_SIZE))
    setHsv(prev => ({ ...prev, s: ns, v: nv }))
    setHexInput(hsvToHex(hsv.h, ns, nv).toUpperCase())
  }, [hsv.h])

  // ── Hue slider pan ──────────────────────────────────────────────────────────
  const huePan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (e) => updateHue(e.nativeEvent.locationX),
    onPanResponderMove:  (e) => updateHue(e.nativeEvent.locationX),
  })).current

  const updateHue = useCallback((x: number) => {
    const nh = Math.max(0, Math.min(360, (x / BOX_SIZE) * 360))
    setHsv(prev => ({ ...prev, h: nh }))
    setHexInput(hsvToHex(nh, hsv.s, hsv.v).toUpperCase())
  }, [hsv.s, hsv.v])

  // ── Hex input ───────────────────────────────────────────────────────────────
  const handleHexChange = (text: string) => {
    const val = text.startsWith('#') ? text : `#${text}`
    setHexInput(val.toUpperCase())
    if (isValidHex(val)) setHsv(hexToHsv(val))
  }

  const handleConfirm = () => {
    onSelect(currentHex)
    onClose()
  }

  // Reset state when modal opens
  const handleShow = () => {
    const parsed = hexToHsv(initialColor)
    setHsv(parsed)
    setHexInput(initialColor.toUpperCase())
  }

  // ── Indicator positions ─────────────────────────────────────────────────────
  const dotX   = hsv.s * BOX_SIZE  - DOT_SIZE / 2
  const dotY   = (1 - hsv.v) * BOX_SIZE - DOT_SIZE / 2
  const hueX   = (hsv.h / 360) * BOX_SIZE - HUE_DOT / 2

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={handleShow}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

        <View style={[styles.sheet, { backgroundColor: t.colors.surface, borderRadius: t.radius.xl }]}>
          <Text style={[styles.title, { color: t.colors.text.primary, fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold }]}>
            {s.colorPickerTitle}
          </Text>

          {/* SV box */}
          <View style={[styles.boxWrap, { width: BOX_SIZE, height: BOX_SIZE }]}>
            <Svg width={BOX_SIZE} height={BOX_SIZE} style={StyleSheet.absoluteFill} pointerEvents="none">
              <Defs>
                <LinearGradient id="cpSat" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#ffffff" stopOpacity="1" />
                  <Stop offset="1" stopColor={hueOnlyHex} stopOpacity="1" />
                </LinearGradient>
                <LinearGradient id="cpVal" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#000000" stopOpacity="0" />
                  <Stop offset="1" stopColor="#000000" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect width={BOX_SIZE} height={BOX_SIZE} fill="url(#cpSat)" />
              <Rect width={BOX_SIZE} height={BOX_SIZE} fill="url(#cpVal)" />
            </Svg>

            {/* Touch overlay */}
            <View style={StyleSheet.absoluteFill} {...svPan.panHandlers} />

            {/* Dot indicator */}
            <View
              pointerEvents="none"
              style={[
                styles.dot,
                { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2,
                  left: dotX, top: dotY, borderColor: hsv.v > 0.5 ? '#00000066' : '#ffffff99' },
              ]}
            />
          </View>

          {/* Hue slider */}
          <View style={[styles.hueWrap, { width: BOX_SIZE, height: HUE_H, marginTop: 16 }]}>
            <Svg width={BOX_SIZE} height={HUE_H} style={StyleSheet.absoluteFill} pointerEvents="none">
              <Defs>
                <LinearGradient id="cpHue" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0"     stopColor="#ff0000" />
                  <Stop offset="0.167" stopColor="#ffff00" />
                  <Stop offset="0.333" stopColor="#00ff00" />
                  <Stop offset="0.5"   stopColor="#00ffff" />
                  <Stop offset="0.667" stopColor="#0000ff" />
                  <Stop offset="0.833" stopColor="#ff00ff" />
                  <Stop offset="1"     stopColor="#ff0000" />
                </LinearGradient>
              </Defs>
              <Rect width={BOX_SIZE} height={HUE_H} fill="url(#cpHue)" rx={HUE_H / 2} />
            </Svg>

            {/* Touch overlay */}
            <View style={StyleSheet.absoluteFill} {...huePan.panHandlers} />

            {/* Hue indicator */}
            <View
              pointerEvents="none"
              style={[
                styles.hueDot,
                { width: HUE_DOT, height: HUE_DOT, borderRadius: HUE_DOT / 2,
                  left: hueX, top: (HUE_H - HUE_DOT) / 2, backgroundColor: hueOnlyHex },
              ]}
            />
          </View>

          {/* Preview + hex input */}
          <View style={[styles.previewRow, { marginTop: 16 }]}>
            <View style={[styles.preview, { backgroundColor: currentHex, borderRadius: t.radius.md }]} />
            <View style={[styles.hexWrap, { backgroundColor: t.colors.background, borderRadius: t.radius.md }]}>
              <Text style={[styles.hexHash, { color: t.colors.text.disabled, fontSize: t.fontSize.md }]}>#</Text>
              <TextInput
                style={[styles.hexInput, { color: t.colors.text.primary, fontSize: t.fontSize.md }]}
                value={hexInput.replace('#', '')}
                onChangeText={(v) => handleHexChange(`#${v}`)}
                maxLength={6}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="5B7BFB"
                placeholderTextColor={t.colors.text.disabled}
              />
            </View>
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: t.colors.primary, borderRadius: t.radius.md, marginTop: 20 }]}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={[styles.btnText, { color: t.colors.text.inverse, fontWeight: t.fontWeight.semiBold, fontSize: t.fontSize.md }]}>
              {s.colorPickerConfirm}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay:    { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet:      { padding: 24, width: WIN_WIDTH - 32, alignItems: 'center' },
  title:      { alignSelf: 'flex-start', marginBottom: 16 },
  boxWrap:    { position: 'relative', borderRadius: 6, overflow: 'hidden' },
  dot:        { position: 'absolute', borderWidth: 2.5, borderColor: '#fff' },
  hueWrap:    { position: 'relative' },
  hueDot:     { position: 'absolute', borderWidth: 2.5, borderColor: '#fff', elevation: 2 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12, alignSelf: 'stretch' },
  preview:    { width: 44, height: 44 },
  hexWrap:    { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44 },
  hexHash:    { marginRight: 2 },
  hexInput:   { flex: 1 },
  btn:        { alignSelf: 'stretch', paddingVertical: 14, alignItems: 'center' },
  btnText:    {},
})
