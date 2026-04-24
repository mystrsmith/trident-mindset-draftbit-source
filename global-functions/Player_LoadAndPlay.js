import * as Media from '../custom-files/Media';

const Player_LoadAndPlay = async (
  Variables,
  setGlobalVariableValue,
  lessonItem
) => {
  const lessonType = lessonItem?.type;
  const appConfig = Variables?.APP_CONFIG;
  const advanceProgramPortraitUrl = appConfig?.advance_program_portrait_url;

  setGlobalVariableValue({
    key: 'SHOW_LESSON_PLAYER',
    value: true,
  });
  const isCategoryLesson =
    lessonItem?.category !== null &&
    lessonItem?.category !== undefined &&
    lessonItem?.category == 0;

  if (
    lessonItem.audio_content ||
    lessonType === 'INFORMATION_ADVANCE_PROGRAM_AUDIO'
  ) {
    // If it's category lesson
    if (lessonItem?.category) {
      await Media.loadTrack({
        id: lessonItem?.id,
        url: lessonItem?.audio_content?.url,
        title: lessonItem?.title,
        artist: lessonItem?.sub_title,
        artwork: lessonItem?.category?.portrait_photo?.url,
        duration: lessonItem?.audio_content?.meta?.duration * 1000,
      });
    }
    // If it's a advance program lesson
    else if (lessonType === 'AUDIO_WRITTEN') {
      await Media.loadTrack({
        id: lessonItem?.id,
        url: lessonItem?.audio_content?.url,
        title: lessonItem?.title,
        artist: lessonItem?.sub_title,
        artwork: advanceProgramPortraitUrl ?? '',
        duration: lessonItem?.audio_content?.meta?.duration * 1000,
      });
    }
    // If information advance program lesson
    else if (lessonType === 'INFORMATION_ADVANCE_PROGRAM_AUDIO') {
      await Media.loadTrack({
        id: 'INFORMATION_ADVANCE_PROGRAM_AUDIO',
        url: lessonItem?.audio_content?.url,
        title: lessonItem?.title,
        artist: lessonItem?.sub_title,
        artwork: advanceProgramPortraitUrl ?? '',
        duration: lessonItem?.audio_content?.meta?.duration * 1000,
      });
    }
    // If it's normal tactic lesson
    else {
      await Media.loadTrack({
        id: lessonItem?.id,
        url: lessonItem?.audio_content?.url,
        title: lessonItem?.title,
        artist: lessonItem?.sub_title,
        artwork: lessonItem?.tactic?.portrait_image?.url,
        duration: lessonItem?.audio_content?.meta?.duration * 1000,
      });
    }
    await Media.play();
    let info = await Media.getActiveTrack();
    setGlobalVariableValue({
      key: 'CURRENTLY_PLAYING_LESSON',
      value: {
        ...info,
        text_content: lessonItem?.text_content ?? '',
        isCategoryLesson: isCategoryLesson,
        isAdvanceProgramLesson:
          lessonType === 'AUDIO_WRITTEN' ||
          lessonType === 'INFORMATION_ADVANCE_PROGRAM_AUDIO',
      },
    });
  } else {
    setGlobalVariableValue({
      key: 'CURRENTLY_PLAYING_LESSON',
      value: {
        ...lessonItem,
      },
    });
  }
};

export default Player_LoadAndPlay;
