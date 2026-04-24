import * as Media from '../custom-files/Media';

const Player_LoadAndPlayMeditation = async (
  Variables,
  setGlobalVariableValue,
  tactic,
  selectedMinutes,
  selectedBackgroundSound,
  selectedIntervalBell
) => {
  try {
    const durationMilliseconds = selectedMinutes * 60 * 1000;
    setGlobalVariableValue({
      key: 'SHOW_LESSON_PLAYER',
      value: true,
    });

    const sounds = selectedBackgroundSound?.sounds;
    const optimizeSoundUrl = sounds.find(
      item => item?.minutes_duration === selectedMinutes
    )?.sound?.url;
    const fallbackSoundUrl = selectedBackgroundSound?.sound?.url;

    await Media.loadTrack({
      id: tactic?.id,
      title: tactic?.title,
      url: optimizeSoundUrl ?? fallbackSoundUrl,
      artist: '',
      artwork: tactic?.photo?.url,
      duration: durationMilliseconds,
    });
    await Media.play();
    let info = await Media.getActiveTrack();

    // const info = {
    //   id: tactic?.id,
    //   title: tactic?.title,
    //   url: selectedBackgroundSound?.sound?.url,
    //   artist: "",
    //   artwork: tactic?.photo?.url,
    //   duration: durationMilliseconds,
    // }
    setGlobalVariableValue({
      key: 'CURRENTLY_PLAYING_LESSON',
      value: {
        ...info,
        isMeditation: true,
        selectedMinutes,
        selectedBackgroundSound,
        selectedIntervalBell,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export default Player_LoadAndPlayMeditation;
