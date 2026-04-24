import * as CommonPackages from '../custom-files/CommonPackages';

const playMeditationBellSound = async () => {
  const Audio = CommonPackages?.Audio;
  const { sound } = await Audio.Sound.createAsync(
    require('../assets/bell.mp3'),
    { shouldPlay: true }
  );
  await sound.playAsync();
};

export default playMeditationBellSound;
