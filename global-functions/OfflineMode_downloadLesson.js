import * as DownloadManager from '../custom-files/DownloadManager';

const OfflineMode_downloadLesson = async (
  Variables,
  setGlobalVariableValue,
  lesson
) => {
  //Added by Sefa-Draftbit 2024-01-08
  //Edited by Sefa-Draftbit 2024-01-31

  const downloaded_lessons = Variables.DOWNLOADED_LESSONS || [];

  try {
    setGlobalVariableValue({
      key: 'CURRENT_DOWNLOAD_ID',
      value: lesson?.id,
    });

    const downloadedLesson = await DownloadManager.downloadLesson(
      lesson,
      progress => {
        setGlobalVariableValue({
          key: 'CURRENT_DOWNLOAD_PERCENT',
          value: progress,
        });
      }
    );

    if (downloadedLesson) {
      setGlobalVariableValue({
        key: 'DOWNLOADED_LESSONS',
        value: [downloadedLesson, ...downloaded_lessons],
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    setGlobalVariableValue({
      key: 'CURRENT_DOWNLOAD_ID',
      value: 0,
    });
    setGlobalVariableValue({
      key: 'CURRENT_DOWNLOAD_PERCENT',
      value: 0,
    });
  }
};

export default OfflineMode_downloadLesson;
