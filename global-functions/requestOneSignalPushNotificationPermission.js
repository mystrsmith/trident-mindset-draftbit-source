import * as CommonPackages from '../custom-files/CommonPackages';

const requestOneSignalPushNotificationPermission = async () => {
  const OneSignal = CommonPackages?.OneSignal;
  const canRequestPermission =
    await OneSignal.Notifications.canRequestPermission();
  if (!canRequestPermission) {
    return;
  }
  await OneSignal.Notifications.requestPermission(false);
};

export default requestOneSignalPushNotificationPermission;
