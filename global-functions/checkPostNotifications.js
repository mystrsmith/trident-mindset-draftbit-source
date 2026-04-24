import { Platform } from 'react-native';
import * as CommonPackages from '../custom-files/CommonPackages';

const checkPostNotifications = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const PermissionsAndroid = CommonPackages?.PermissionsAndroid;
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }
};

export default checkPostNotifications;
