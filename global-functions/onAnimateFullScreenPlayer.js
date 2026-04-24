import * as CommonPackages from '../custom-files/CommonPackages';

const onAnimateFullScreenPlayer = async currentLesson => {
  const PlayerAnimationValues = CommonPackages?.PlayerAnimationValues;
  // No audio content
  if (currentLesson?.audio_content === null) {
    PlayerAnimationValues.isAllowScrollingContent.value = true;
    await new Promise(resolve => setTimeout(resolve, 50));
    PlayerAnimationValues.goUpRead.value = true;
    PlayerAnimationValues.goUpAudio.value = true;
  } else {
    PlayerAnimationValues.goDownRead.value = true;
    PlayerAnimationValues.goUpAudio.value = true;
  }
};

export default onAnimateFullScreenPlayer;
