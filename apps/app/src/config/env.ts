import Config from 'react-native-config'

export const ENV = {
  API_URL: Config.API_URL ?? 'http://10.0.2.2:4000',
} as const
