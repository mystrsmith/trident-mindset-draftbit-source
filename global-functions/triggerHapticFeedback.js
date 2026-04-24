import * as CommonPackages from '../custom-files/CommonPackages';

const triggerHapticFeedback = () => {
  const Haptics = CommonPackages?.Haptics;

  Haptics?.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export default triggerHapticFeedback;
