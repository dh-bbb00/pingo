import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV()

export const StorageKeys = {
  REFRESH_TOKEN: 'refresh_token',
  SAVED_EMAIL:   'saved_email',
  AUTO_LOGIN:    'auto_login',
  THEME:         'theme',
} as const
