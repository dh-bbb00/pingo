import React, { useMemo, useState, useRef, useEffect } from 'react'
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  PanResponder, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles, COLOR_PICKER_BOX_SIZE, COLOR_PICKER_HUE_H, COLOR_PICKER_DOT_SIZE, COLOR_PICKER_HUE_DOT } from './ColorPickerModal.styles'

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

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  visible:      boolean
  initialColor: string
  onSelect:     (hex: string) => void
  onClose:      () => void
}

export default function ColorPickerModal({ visible, initialColor, onSelect, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const s = strings.categoryEdit

  const [hsv,      setHsv]      = useState(() => hexToHsv(initialColor))
  const [hexInput, setHexInput] = useState(initialColor.toUpperCase())

  const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v).toUpperCase()
  const hueOnlyHex = hsvToHex(hsv.h, 1, 1)

  // PanResponder는 초기 1회만 생성되어 hsv가 stale하게 캡처됨.
  // hsvRef로 항상 최신값 참조.
  const hsvRef = useRef(hsv)
  useEffect(() => { hsvRef.current = hsv }, [hsv])

  // 드래그 시작 위치 — Move에서 gestureState.dx/dy와 합산해 영역 밖 이탈 시에도 끝 위치 유지
  const svGrantPos = useRef({ x: 0, y: 0 })
  const hueGrantX  = useRef(0)

  // ── SV box pan ──────────────────────────────────────────────────────────────
  const svPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (e) => {
      svGrantPos.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }
      const ns = Math.max(0, Math.min(1, e.nativeEvent.locationX / COLOR_PICKER_BOX_SIZE))
      const nv = Math.max(0, Math.min(1, 1 - e.nativeEvent.locationY / COLOR_PICKER_BOX_SIZE))
      setHsv(prev => ({ ...prev, s: ns, v: nv }))
      setHexInput(hsvToHex(hsvRef.current.h, ns, nv).toUpperCase())
    },
    onPanResponderMove: (_e, gs) => {
      const x  = svGrantPos.current.x + gs.dx
      const y  = svGrantPos.current.y + gs.dy
      const ns = Math.max(0, Math.min(1, x / COLOR_PICKER_BOX_SIZE))
      const nv = Math.max(0, Math.min(1, 1 - y / COLOR_PICKER_BOX_SIZE))
      setHsv(prev => ({ ...prev, s: ns, v: nv }))
      setHexInput(hsvToHex(hsvRef.current.h, ns, nv).toUpperCase())
    },
  })).current

  // ── Hue slider pan ──────────────────────────────────────────────────────────
  const huePan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (e) => {
      hueGrantX.current = e.nativeEvent.locationX
      const nh = Math.max(0, Math.min(360, (e.nativeEvent.locationX / COLOR_PICKER_BOX_SIZE) * 360))
      setHsv(prev => ({ ...prev, h: nh }))
      setHexInput(hsvToHex(nh, hsvRef.current.s, hsvRef.current.v).toUpperCase())
    },
    onPanResponderMove: (_e, gs) => {
      const x  = hueGrantX.current + gs.dx
      const nh = Math.max(0, Math.min(360, (x / COLOR_PICKER_BOX_SIZE) * 360))
      setHsv(prev => ({ ...prev, h: nh }))
      setHexInput(hsvToHex(nh, hsvRef.current.s, hsvRef.current.v).toUpperCase())
    },
  })).current

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

  const handleShow = () => {
    const parsed = hexToHsv(initialColor)
    setHsv(parsed)
    setHexInput(initialColor.toUpperCase())
  }

  // ── 드래그로 바뀌는 런타임 위치값 — StyleSheet에 넣을 수 없음
  const dotX  = hsv.s * COLOR_PICKER_BOX_SIZE - COLOR_PICKER_DOT_SIZE / 2
  const dotY  = (1 - hsv.v) * COLOR_PICKER_BOX_SIZE - COLOR_PICKER_DOT_SIZE / 2
  const hueX  = (hsv.h / 360) * COLOR_PICKER_BOX_SIZE - COLOR_PICKER_HUE_DOT / 2
  const dotBorderColor = hsv.v > 0.5 ? '#00000066' : '#ffffff99'

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

        <View style={styles.sheet}>
          <Text style={styles.title}>{s.colorPickerTitle}</Text>

          {/* SV box */}
          <View style={styles.boxWrap}>
            <Svg width={COLOR_PICKER_BOX_SIZE} height={COLOR_PICKER_BOX_SIZE} style={StyleSheet.absoluteFill} pointerEvents="none">
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
              <Rect width={COLOR_PICKER_BOX_SIZE} height={COLOR_PICKER_BOX_SIZE} fill="url(#cpSat)" />
              <Rect width={COLOR_PICKER_BOX_SIZE} height={COLOR_PICKER_BOX_SIZE} fill="url(#cpVal)" />
            </Svg>

            <View style={StyleSheet.absoluteFill} {...svPan.panHandlers} />

            {/* 드래그 위치에 따라 실시간 변경 — inline 불가피 */}
            <View
              pointerEvents="none"
              style={[styles.dot, { left: dotX, top: dotY, borderColor: dotBorderColor }]}
            />
          </View>

          {/* Hue slider */}
          <View style={styles.hueWrap}>
            <Svg width={COLOR_PICKER_BOX_SIZE} height={COLOR_PICKER_HUE_H} style={StyleSheet.absoluteFill} pointerEvents="none">
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
              <Rect width={COLOR_PICKER_BOX_SIZE} height={COLOR_PICKER_HUE_H} fill="url(#cpHue)" rx={COLOR_PICKER_HUE_H / 2} />
            </Svg>

            <View style={StyleSheet.absoluteFill} {...huePan.panHandlers} />

            {/* 드래그 위치에 따라 실시간 변경 — inline 불가피 */}
            <View
              pointerEvents="none"
              style={[styles.hueDot, { left: hueX, backgroundColor: hueOnlyHex }]}
            />
          </View>

          {/* Preview + hex input */}
          <View style={styles.previewRow}>
            {/* 선택 색상 실시간 반영 — inline 불가피 */}
            <View style={[styles.preview, { backgroundColor: currentHex }]} />
            <View style={styles.hexWrap}>
              <Text style={styles.hexHash}>#</Text>
              <TextInput
                style={styles.hexInput}
                value={hexInput.replace('#', '')}
                onChangeText={(v) => handleHexChange(`#${v}`)}
                maxLength={6}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="5B7BFB"
                placeholderTextColor={theme.colors.text.disabled}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleConfirm} activeOpacity={0.8}>
            <Text style={styles.btnText}>{s.colorPickerConfirm}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
