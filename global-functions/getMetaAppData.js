import { Dimensions, Platform } from 'react-native';
import * as CommonPackages from '../custom-files/CommonPackages';

const getMetaAppData = async () => {
  const FBSdk = CommonPackages?.FBSdk;
  const Application = CommonPackages?.Application;
  const Device = CommonPackages?.Device;
  const Localization = CommonPackages?.Localization;

  let advertiserTrackingEnabled = 1;
  if (Platform.OS === 'ios') {
    const trackingStatus = await FBSdk.Settings.getAdvertiserTrackingEnabled();
    advertiserTrackingEnabled = trackingStatus ? 1 : 0;
  }

  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  const scale = Dimensions.get('window').scale;

  const calendars = await Localization.getCalendars();
  const timezone = calendars[0]?.timeZone;

  // Build extinfo array
  const extinfo = [
    Platform.OS === 'ios' ? 'i2' : 'a2', // version
    Application.applicationId || '', // package name
    Application.nativeApplicationVersion || '', // short version
    Application.nativeBuildVersion || '', // long version
    Device.osVersion || '', // OS version (required)
    Device.modelName || '', // device model
    Localization.locale || '', // locale
    Localization.timezone || '', // timezone abbr
    Device.carrier || '', // carrier
    width.toString(), // screen width
    height.toString(), // screen height
    scale.toString(), // screen density
    Device.totalMemory
      ? Math.round(Device.totalMemory / (1024 * 1024 * 1024)).toString()
      : '2', // CPU cores
    '0', // external storage size (not available in React Native directly)
    '0', // free space (not available in React Native directly)
    timezone || '', // device timezone
  ];

  return {
    advertiser_tracking_enabled: advertiserTrackingEnabled,
    application_tracking_enabled: 1, // Default to enabled, you may want to add a setting to control this
    extinfo,
  };
};

export default getMetaAppData;
