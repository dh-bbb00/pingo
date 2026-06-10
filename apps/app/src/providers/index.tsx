import React from 'react'
import { StatusBar } from 'react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { ThemeProvider, useTheme } from '@/theme'
import ConfirmModal from '@/components/modals/ConfirmModal'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function AppStatusBar() {
  const { mode } = useTheme()
  return (
    <StatusBar barStyle={mode === 'light' ? 'dark-content' : 'light-content'} />
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppStatusBar />
        {children}
        <ConfirmModal />
      </ThemeProvider>
      <Toast />
    </QueryClientProvider>
  )
}
