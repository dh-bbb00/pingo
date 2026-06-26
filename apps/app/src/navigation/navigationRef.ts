import { createNavigationContainerRef, CommonActions } from '@react-navigation/native'
import type { RootStackParamList } from '@/types/navigation'
import { Screens } from '@/constants/screens'

export const navigationRef = createNavigationContainerRef<RootStackParamList>()

// 탭 안의 중첩 화면으로 navigate하면 초기 라우트가 스택에 포함되지 않아 뒤로가기가 없어짐.
// reset으로 탭 + 스택 상태를 직접 구성해 HistoryMain/MoreMain을 항상 포함시킨다.


export function resetToTransactionEdit(notificationId: string) {
  navigationRef.dispatch(
    CommonActions.reset({
      routes: [{
        name: Screens.Root.UserTabs,
        state: {
          index: 1,
          routes: [
            { name: Screens.UserTab.Home },
            {
              name: Screens.UserTab.History,
              state: {
                index: 1,
                routes: [
                  { name: Screens.History.HistoryMain },
                  { name: Screens.History.TransactionEdit, params: { notificationId } },
                ],
              },
            },
            { name: Screens.UserTab.Stats },
            { name: Screens.UserTab.Category },
            { name: Screens.UserTab.More },
          ],
        },
      }],
    }),
  )
}

export function resetToCancelSearch(cancelNotificationId: string) {
  navigationRef.dispatch(
    CommonActions.reset({
      routes: [{
        name: Screens.Root.UserTabs,
        state: {
          index: 1,
          routes: [
            { name: Screens.UserTab.Home },
            {
              name: Screens.UserTab.History,
              state: {
                index: 1,
                routes: [
                  { name: Screens.History.HistoryMain },
                  { name: Screens.History.CancelledTransactionSearch, params: { cancelNotificationId } },
                ],
              },
            },
            { name: Screens.UserTab.Stats },
            { name: Screens.UserTab.Category },
            { name: Screens.UserTab.More },
          ],
        },
      }],
    }),
  )
}

export function resetToPendingNotifications() {
  navigationRef.dispatch(
    CommonActions.reset({
      routes: [{
        name: Screens.Root.UserTabs,
        state: {
          index: 4,
          routes: [
            { name: Screens.UserTab.Home },
            { name: Screens.UserTab.History },
            { name: Screens.UserTab.Stats },
            { name: Screens.UserTab.Category },
            {
              name: Screens.UserTab.More,
              state: {
                index: 1,
                routes: [
                  { name: Screens.More.MoreMain },
                  { name: Screens.More.PendingNotifications },
                ],
              },
            },
          ],
        },
      }],
    }),
  )
}
