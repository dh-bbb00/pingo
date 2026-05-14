import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './HomeScreen.styles'

export default function HomeScreen() {
  // TODO: 홈 화면 구현

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>홈</Text>
    </SafeAreaView>
  )
}
