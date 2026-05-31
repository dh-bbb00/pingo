import React, { useMemo } from 'react'
import { View, Text, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import type { PaymentMethod } from '@/api/endpoints/paymentMethods.api'
import PaymentMethodItem from './components/PaymentMethodItem'
import { makeStyles } from './PaymentMethodsScreen.styles'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'PaymentMethods'>

const s = strings.paymentMethods

export default function PaymentMethodsScreen() {
  const { theme } = useTheme()
  const styles    = useMemo(() => makeStyles(theme), [theme])
  const navigation = useNavigation<Nav>()

  const { data: methods, isLoading } = usePaymentMethods()

  const sections = useMemo(() => {
    const fixed = (methods ?? []).filter(m => m.type !== 'CARD')
    const cards = (methods ?? []).filter(m => m.type === 'CARD')
    return [
      { key: 'fixed', data: fixed },
      { key: 'cards', data: cards },
    ]
  }, [methods])

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.header}>{s.header}</Text>

      {isLoading ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: PaymentMethod }) => (
            <PaymentMethodItem
              item={item}
              onPress={item.type === 'CARD'
                ? () => navigation.navigate(Screens.More.PaymentMethodEdit, { id: item.id })
                : undefined
              }
            />
          )}
          renderSectionFooter={({ section }) => {
            // fixed 섹션 아래에만 구분선 표시
            if (section.key !== 'fixed') return null
            return <View style={styles.divider} />
          }}
          ListEmptyComponent={null}
          renderSectionHeader={() => null}
          // 카드 섹션이 비어있을 때 안내 문구
          ListFooterComponent={
            !isLoading && (methods ?? []).filter(m => m.type === 'CARD').length === 0
              ? <View style={styles.emptyWrap}><Text style={styles.emptyText}>{s.noCards}</Text></View>
              : null
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(Screens.More.PaymentMethodEdit, {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
