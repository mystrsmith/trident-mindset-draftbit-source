import * as DownloadManager from '../custom-files/DownloadManager';

// This function deletes multiple lesson items from the downloaded storage
const OfflineMode_deleteMultipleSongs = async (
  Variables,
  setGlobalVariableValue,
  lessons
) => {
  if (!lessons) return;
  if (!lessons?.length === 0) return;

  const downloaded_lessons = Variables.DOWNLOADED_LESSONS || [];
  // const currentPlay = Variables.currently_playing || []

  // check if any of the lessons to remove from downloads match the currently playing lesson

  try {
    // // do not delete the lesson if it's currently playing a downloaded item. Will crash player
    // if ( lessons.some(e => e.id === currentPlay.id) && currentPlay.audio.url.startsWith('file://') ){
    //     return false
    // } else {

    for (let lesson of lessons) {
      const lessonDeleted = await DownloadManager.deleteLesson(lesson.id);
    }

    setGlobalVariableValue({
      key: 'DOWNLOADED_LESSONS',
      value: downloaded_lessons.filter(
        ds => !lessons.map(s => s.id).includes(ds.id)
      ),
    });

    return true;

    // }
  } catch (error) {
    console.error(error);
  }
};

export default OfflineMode_deleteMultipleSongs;
