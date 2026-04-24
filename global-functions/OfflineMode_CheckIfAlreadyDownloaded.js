import * as DownloadManager from '../custom-files/DownloadManager';

// This function checks if a lesson has already been downloaded and return the downloaded one.
const OfflineMode_CheckIfAlreadyDownloaded = (Variables, lesson) => {
  //Added by Sefa-Draftbit 2024-01-08 to convert relative urls to base urls

  // clone the downloaded lessonss array
  const downloaded_lessons =
    JSON.parse(JSON.stringify(Variables.DOWNLOADED_LESSONS)) || [];

  // const downloaded_lessons= Variables.downloaded_lessons||[];
  const found = downloaded_lessons.find(d => d.id === lesson.id);

  //convert uri to file path
  if (found !== null && found !== undefined) {
    if (found.audio_content?.url)
      found.audio_content.url =
        DownloadManager.FileSystem.documentDirectory + found.audio_content.url;

    if (found.video_content?.url)
      found.video_content.url =
        DownloadManager.FileSystem.documentDirectory + found.video_content.url;

    if (found?.tactic?.photo?.url)
      found.tactic.photo.url =
        DownloadManager.FileSystem.documentDirectory + found.tactic.photo.url;

    return {
      ...found,
      text_content: lesson?.text_content ?? '',
    };
  }
  return lesson;
};

export default OfflineMode_CheckIfAlreadyDownloaded;
