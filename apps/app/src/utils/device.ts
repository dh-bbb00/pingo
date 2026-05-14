import DeviceInfo from 'react-native-device-info'

export const getDeviceId = () => DeviceInfo.getUniqueId()
export const getDeviceModel = () => DeviceInfo.getModel()
export const getDeviceBrand = () => DeviceInfo.getBrand()
