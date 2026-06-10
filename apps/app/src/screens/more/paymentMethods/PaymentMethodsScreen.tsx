import React, { useMemo } from 'react'
import { View, Text, SectionList, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { MoreStackParamList } from '@/types/navigation'
import { useTheme } from '@/theme'
import { Screens } from '@/constants/screens'
import { strings } from '@/constants/strings'
import { usePaymentMethods } from '@/hooks/queries/usePaymentMethods'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import type { PaymentMethod } from '@/api/endpoints/paymentMethods.api'
import { DATE_TAB } from '@/screens/stats/types'
import PaymentMethodItem from './components/PaymentMethodItem'
import PaymentMethodSkeleton from './components/PaymentMethodSkeleton'
import { makeStyles } from './PaymentMethodsScreen.styles'
import { navigationRef } from '@/navigation/navigationRef'

const SKELETON_KEYS = Array.from({ length: 4 }, (_, i) => `sk-${i}`)

type Nav = NativeStackNavigationProp<MoreStackParamList, 'PaymentMethods'>

const s = strings.paymentMethods

export default function PaymentMethodsScreen() {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])
  const navigation = useNavigation<Nav>()

  const { data: methods, isLoading, refetch } = usePaymentMethods()
  const { refreshing, onRefresh } = usePullToRefresh(refetch)

  const sections = useMemo(() => {
    const fixed = (methods ?? []).filter(m => m.type !== 'CARD')
    const cards = (methods ?? []).filter(m => m.type === 'CARD')
    return [
      { key: 'fixed', data: fixed },
      { key: 'cards', data: cards },
    ]
  }, [methods])

  function handleStatsPress(method: PaymentMethod) {
    navigationRef.navigate(Screens.Root.UserTabs, {
      screen: Screens.UserTab.Stats,
      params: { initialTab: 'paymentMethod', paymentMethodId: method.id, dateTab: DATE_TAB.MONTH },
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.header}>{s.header}</Text>

      {isLoading ? (
        SKELETON_KEYS.map(key => <PaymentMethodSkeleton key={key} />)
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
              onStatsPress={() => handleStatsPress(item)}
            />
          )}
          renderSectionFooter={({ section }) => {
            if (section.key !== 'fixed') return null
            return <View style={styles.divider} />
          }}
          ListEmptyComponent={null}
          renderSectionHeader={() => null}
          ListFooterComponent={
            !isLoading && (methods ?? []).filter(m => m.type === 'CARD').length === 0
              ? <View style={styles.emptyWrap}><Text style={styles.emptyText}>{s.noCards}</Text></View>
              : null
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />}
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
