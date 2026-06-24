/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { saveDetectedNotification } from './src/store/notificationLogStore';
import { saveCancelNotification } from './src/store/cancelNotificationStore';
import { setupNotificationChannel, displayDetectedNotification, schedulePendingReminder, displayCancelNotification } from './src/utils/notification';
import { isCardUsageNotification, isCancelNotification } from './src/utils/cardNotificationParser';

AppRegistry.registerComponent(appName, () => App);

// 알림 감지 헤드리스 태스크 — 앱이 백그라운드/종료 상태에서도 호출됨
// 라이브러리가 실제 알림 데이터를 rawTask.notification 키에 JSON 문자열로 래핑해서 전달
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => async (rawTask) => {
    let notification = {};
    try { notification = JSON.parse(String(rawTask.notification ?? '{}')); } catch { return; }

    const app   = String(notification.app   ?? '');
    const title = String(notification.title ?? '');
    const text  = String(notification.text  ?? '');

    // 자기 앱 알림 무시 — 패키지명·앱명 체크 (무한 루프 방지)
    if (app.includes('com.pingo') || app === 'Pingo') return;

    // 불필요한 알림 제외
    if (title.includes('95%') || text.includes('95%')) return;

    // 카드 취소 알림 처리
    if (isCancelNotification(title, text)) {
      await setupNotificationChannel();
      const cancelId = saveCancelNotification(notification);
      await displayCancelNotification(app || '알 수 없음', text, cancelId);
      return;
    }

    // 카드 승인 알림만 처리
    if (!isCardUsageNotification(title, text)) return;

    await setupNotificationChannel();
    const notificationId = saveDetectedNotification(notification);
    await schedulePendingReminder(notificationId);
    await displayDetectedNotification(
      app || '알 수 없음',
      String(notification.text ?? ''),
      notificationId,
    );
  },
);

// notifee 백그라운드 이벤트 — 알림 탭 시 처리 (앱이 백그라운드일 때)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { EventType } = await import('@notifee/react-native');
  if (type === EventType.PRESS && detail.pressAction?.id === 'pending-notifications') {
    // 백그라운드 탭은 앱 실행 후 getInitialNotification으로 처리
  }
});

// FCM 백그라운드/종료 상태 메시지 핸들러 — 앱이 꺼져 있어도 Notifee로 알림 표시
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await setupNotificationChannel();
  const title = remoteMessage.notification?.title ?? '';
  const body  = remoteMessage.notification?.body  ?? '';
  if (title || body) {
    await notifee.displayNotification({
      title,
      body,
      android: { channelId: 'pingo-default', pressAction: { id: 'default' } },
    });
  }
});

// FCM 포그라운드 메시지 핸들러 — 앱이 열려 있을 때도 Notifee로 알림 표시
messaging().onMessage(async (remoteMessage) => {
  await setupNotificationChannel();
  const title = remoteMessage.notification?.title ?? '';
  const body  = remoteMessage.notification?.body  ?? '';
  if (title || body) {
    await notifee.displayNotification({
      title,
      body,
      android: { channelId: 'pingo-default', pressAction: { id: 'default' } },
    });
  }
});
