import DeviceInfo from 'react-native-device-info'

export const getDeviceId = () => DeviceInfo.getUniqueId()

/** 승인 요청 DTO에 필요한 기기 정보를 한 번에 수집 */
export async function getDeviceInfo() {
  const [deviceUid, deviceName] = await Promise.all([
    DeviceInfo.getUniqueId(),
    DeviceInfo.getDeviceName(),
  ])
  return {
    deviceUid,
    deviceName,
    phoneModel: DeviceInfo.getModel(),
    osVersion:  DeviceInfo.getSystemVersion(),
    appVersion: DeviceInfo.getVersion(),
  }
}
