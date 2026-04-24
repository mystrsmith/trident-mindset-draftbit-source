import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

async function triggerHapticFeedback({ feedbackIntensity }) {
  if (Platform.OS === 'web') {
    console.warn(
      'Warning: Haptic feedback is not supported in the web version. This feature works only on mobile devices.'
    );
    return;
  }
  switch (feedbackIntensity) {
    case Haptics.NotificationFeedbackType.Success:
    case Haptics.NotificationFeedbackType.Error:
    case Haptics.NotificationFeedbackType.Warning:
      await Haptics.notificationAsync(feedbackIntensity);
      break;
    case Haptics.ImpactFeedbackStyle.Light:
    case Haptics.ImpactFeedbackStyle.Medium:
    case Haptics.ImpactFeedbackStyle.Heavy:
      await Haptics.impactAsync(feedbackIntensity);
      break;
    default:
      await Haptics.selectionAsync();
      break;
  }
}
export default triggerHapticFeedback;
