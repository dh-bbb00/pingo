import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import type { NavigationState, PartialState } from '@react-navigation/native'
import { useTheme } from '@/theme'
import {
  HomeIcon,
  HistoryIcon,
  StatsIcon,
  CategoryIcon,
  MoreIcon,
  UsersIcon,
  CheckCircleIcon,
} from '@/components/icons/TabIcons'

type IconFn = (props: { color: string }) => React.JSX.Element

const ICONS: Record<string, IconFn> = {
  Home:               ({ color }) => <HomeIcon color={color} />,
  History:            ({ color }) => <HistoryIcon color={color} />,
  Stats:              ({ color }) => <StatsIcon color={color} />,
  Category:           ({ color }) => <CategoryIcon color={color} />,
  More:               ({ color }) => <MoreIcon color={color} />,
  UserManagement:     ({ color }) => <UsersIcon color={color} />,
  ApprovalManagement: ({ color }) => <CheckCircleIcon color={color} />,
  AdminMore:          ({ color }) => <MoreIcon color={color} />,
}

function isDeepNested(state: NavigationState | PartialState<NavigationState>): boolean {
  const index = state.index ?? 0
  const activeRoute = state.routes[index]
  const nested = activeRoute?.state
  return !!(nested && (nested.index ?? 0) > 0)
}

const BOTTOM_PADDING = Platform.OS === 'ios' ? 20 : 4

/**
 * React Navigation은 tabBar prop을 tabBar({...props}) 형태로 직접 호출하므로
 * 훅을 사용하려면 내부 컴포넌트(AppTabBarContent)로 분리해야 한다.
 */
export function AppTabBar(props: BottomTabBarProps) {
  return <AppTabBarContent {...props} />
}

function AppTabBarContent({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme()

  if (isDeepNested(state)) return null

  return (
    <View style={[
      styles.container,
      {
        paddingBottom: BOTTOM_PADDING,
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.divider,
      },
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label = (options.title ?? route.name) as string
        const focused = state.index === index
        const color = focused ? theme.colors.text.primary : theme.colors.text.disabled
        const Icon = ICONS[route.name]

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            {Icon && <Icon color={color} />}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
})
