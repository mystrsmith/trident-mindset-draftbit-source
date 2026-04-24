import { Platform } from 'react-native';
import * as CommonPackages from '../custom-files/CommonPackages';

const startMediaForegroundServiceTask = () => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      console.log('startMediaForegroundServiceTask');
      const { ReactNativeForegroundService } = CommonPackages;
      ReactNativeForegroundService.start({
        ServiceType: 'mediaPlayback',
        id: 1,
        button: false,
        button2: false,
        setOnlyAlertOnce: true,
        vibration: false,
        visibility: false,
      }).catch(e => console.log('Error starting task:', e));
    }
  } catch (e) {
    console.log('Error starting media foreground service task:', e);
  }
};

export default startMediaForegroundServiceTask;
