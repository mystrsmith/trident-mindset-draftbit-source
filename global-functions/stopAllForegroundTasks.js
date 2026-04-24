import { Platform } from 'react-native';
import * as CommonPackages from '../custom-files/CommonPackages';

const stopAllForegroundTasks = () => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      console.log('stopAllForegroundTasks');
      const { ReactNativeForegroundService } = CommonPackages;
      ReactNativeForegroundService.stopAll();
    }
  } catch (e) {
    console.log('Error stopping all foreground tasks:', e);
  }
};

export default stopAllForegroundTasks;
