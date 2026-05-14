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
    android: { channelId: CHANNEL_ID },
  })
}
