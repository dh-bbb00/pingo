import Config from 'react-native-config'

export const ENV = {
  API_URL: Config.API_URL ?? 'http://10.0.2.2:3000',
} as const
