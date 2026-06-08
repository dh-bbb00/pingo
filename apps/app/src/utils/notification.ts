import notifee, { AndroidImportance } from '@notifee/react-native'

export const CHANNEL_ID = 'pingo-default'

export async function setupNotificationChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Pingo 알림',
    importance: AndroidImportance.HIGH,
  })
}

export async function displayNotification(title: string, body: string) {
  await notifee.displayNotification({
    title,
    body,
    android: { channelId: CHANNEL_ID, pressAction: { id: 'default' } },
  })
}

export async function displayDetectedNotification(app: string, text: string) {
  await notifee.displayNotification({
    title: 'Pingo 알림감지',
    body:  `[${app}] ${text}`,
    android: {
      channelId:   CHANNEL_ID,
      pressAction: { id: 'notification-log' },
    },
  })
}
