import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import BootSplash from 'react-native-bootsplash'
import { RootNavigator } from './src/navigation/RootNavigator'
import { AppProviders } from './src/providers'

export default function App() {
  useEffect(() => {
    BootSplash.hide({ fade: true })
  }, [])

  return (
    <AppProviders>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProviders>
  )
}
