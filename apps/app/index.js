/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { RNAndroidNotificationListenerHeadlessJsName } from 'react-native-android-notification-listener';
import notifee from '@notifee/react-native';
import { saveDetectedNotification } from './src/store/notificationLogStore';
import { setupNotificationChannel, displayDetectedNotification } from './src/utils/notification';

AppRegistry.registerComponent(appName, () => App);

const PINGO_PACKAGE = 'com.pingo';
const PINGO_NOTIFICATION_TITLE = 'Pingo 알림감지';

// 알림 감지 헤드리스 태스크 — 앱이 백그라운드/종료 상태에서도 호출됨
AppRegistry.registerHeadlessTask(
  RNAndroidNotificationListenerHeadlessJsName,
  () => async (notification) => {
    // 자기 앱 알림 무시 — 패키지명 또는 제목으로 이중 필터링 (무한 루프 방지)
    if (
      notification.app === PINGO_PACKAGE ||
      String(notification.title ?? '') === PINGO_NOTIFICATION_TITLE
    ) return;

    await setupNotificationChannel();
    saveDetectedNotification(notification);
    await displayDetectedNotification(
      String(notification.app  ?? '알 수 없음'),
      String(notification.text ?? ''),
    );
  },
);

// notifee 백그라운드 이벤트 — 알림 탭 시 처리 (앱이 백그라운드일 때)
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { EventType } = await import('@notifee/react-native');
  if (type === EventType.PRESS && detail.pressAction?.id === 'notification-log') {
    // 백그라운드 탭은 앱 실행 후 getInitialNotification으로 처리
  }
});
