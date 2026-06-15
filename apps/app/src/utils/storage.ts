import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV()

export const StorageKeys = {
  REFRESH_TOKEN:          'refresh_token',
  SAVED_EMAIL:            'saved_email',
  AUTO_LOGIN:             'auto_login',
  THEME:                  'theme',
  DETECTED_NOTIFICATIONS:          'detected_notifications',
  CANCEL_NOTIFICATIONS:            'cancel_notifications',
  BATTERY_OPT_PROMPTED:            'battery_opt_prompted',
  PENDING_DEEPLINK:                'pending_deeplink',
  PENDING_CANCEL_DEEPLINK:         'pending_cancel_deeplink',
} as const
