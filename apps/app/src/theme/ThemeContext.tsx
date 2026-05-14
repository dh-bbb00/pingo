import React, { createContext, useContext, useState } from 'react'
import { lightTheme } from './themes/light'
import { darkTheme } from './themes/dark'
import { storage, StorageKeys } from '@/utils/storage'
import type { Theme, ThemeMode } from './types'

interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    (storage.getString(StorageKeys.THEME) as ThemeMode) ?? 'light',
  )

  const toggleTheme = () => {
    const next: ThemeMode = mode === 'light' ? 'dark' : 'light'
    storage.set(StorageKeys.THEME, next)
    setMode(next)
  }

  const theme = mode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
