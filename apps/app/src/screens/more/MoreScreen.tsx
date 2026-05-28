import React, { useMemo } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { makeStyles } from './MoreScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'MoreMain'>

const s = strings.more

const MENU_ITEMS: { label: string; screen: keyof MoreStackParamList }[] = [
  { label: s.fixedExpenses, screen: Screens.More.FixedExpenses },
  { label: s.myInfo,        screen: Screens.More.MyInfo },
]

export default function MoreScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const navigation = useNavigation<Nav>()

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{s.header}</Text>

      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.screen as any)}
        >
          <Text style={styles.menuLabel}>{item.label}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  )
}
