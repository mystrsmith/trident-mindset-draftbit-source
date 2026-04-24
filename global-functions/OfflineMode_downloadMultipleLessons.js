import * as DownloadManager from '../custom-files/DownloadManager';

const OfflineMode_downloadMultipleLessons = async (
  Variables,
  setGlobalVariableValue,
  lessons
) => {
  //Added by Sefa-Draftbit 2024-01-08
  //Edited by Sefa-Draftbit 2024-01-31

  if (!lessons) return;
  if (!lessons?.length === 0) return;

  const downloaded_lessons = Variables.DOWNLOADED_LESSONS || [];

  try {
    let new_downloaded_lessons = [];
    const totalSize = lessons.reduce((acc, cur) => {
      acc = acc + cur?.audio?.size || 0;
      return acc;
    }, 0);

    let downloadedSofar = 0;
    let totalDownloaded = 0;

    for (let lesson of lessons) {
      setGlobalVariableValue({
        key: 'CURRENT_DOWNLOAD_ID',
        value: lesson?.id,
      });

      // console.log('Downloading lesson id', lesson.id)
      const downloadedLesson = await DownloadManager.downloadLesson(
        lesson,
        (progress, totalBytesWritten) => {
          totalDownloaded = downloadedSofar + totalBytesWritten;

          // console.log('%', parseInt((totalDownloaded/ totalSize) * 100)) //
          setGlobalVariableValue({
            key: 'CURRENT_DOWNLOAD_PERCENT',
            value: parseInt((totalDownloaded / totalSize) * 100),
          });
        }
      );
      downloadedSofar = totalDownloaded;

      if (downloadedLesson) {
        new_downloaded_lessons.push(downloadedLesson);
      }
    }

    setGlobalVariableValue({
      key: 'DOWNLOADED_LESSONS',
      value: [...downloaded_lessons, ...new_downloaded_lessons],
    });
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

export default OfflineMode_downloadMultipleLessons;
