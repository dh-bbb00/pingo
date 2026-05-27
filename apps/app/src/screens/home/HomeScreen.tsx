import React, { useMemo } from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/theme'
import { makeStyles } from './HomeScreen.styles'

export default function HomeScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  // TODO: 홈 화면 구현

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>홈</Text>
    </SafeAreaView>
  )
}
