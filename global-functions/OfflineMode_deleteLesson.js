import * as DownloadManager from '../custom-files/DownloadManager';

const OfflineMode_deleteLesson = async (
  Variables,
  setGlobalVariableValue,
  id
) => {
  //Added by Sefa-Draftbit 2024-01-08
  const downloaded_lessons = Variables.DOWNLOADED_LESSONS || [];
  //In the future, we have to check if the file is currently playing or not.
  // const currentPlay = Variables.currently_playing || []

  try {
    // do not delete the lesson if it's currently playing a downloaded item. Will crash player
    // if (currentPlay.id === id && currentPlay.audio.url.startsWith('file://') ){
    //     // console.log('do not delete item that is playing if downloaded already')
    //     return false
    // } else {

    const lessonDeleted = await DownloadManager.deleteLesson(id);

    if (lessonDeleted) {
      setGlobalVariableValue({
        key: 'DOWNLOADED_LESSONS',
        value: downloaded_lessons.filter(ds => ds.id !== id),
      });
      return true;
    }
    // }
  } catch (error) {
    console.error(error);
  }
};

export default OfflineMode_deleteLesson;
