import * as FileSystem from 'expo-file-system';

const downloadLesson = async (lesson, callback) => {
  try {
    if (!lesson) return false;
    if (!lesson.id) return false;

    // console.log('DownloadManager.downloadLesson', lesson)

    //commented out for the future referance
    const imgUrl = lesson?.tactic?.photo?.url;
    const audioUrl = lesson?.audio_content?.url;
    const videoUrl = lesson?.video_content?.url;

    const imageFileFormat = imgUrl.split('.').pop();

    const folderPath = lesson.id + '/';
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + folderPath,
      { intermediates: true }
    );

    const imageInfo = await FileSystem.downloadAsync(
      imgUrl,
      FileSystem.documentDirectory + folderPath + 'image.' + imageFileFormat
    );

    if (audioUrl) {
      await FileSystem.createDownloadResumable(
        audioUrl,
        FileSystem.documentDirectory + folderPath + 'audio.mp3',
        {
          sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        },
        progress => {
          // console.log('%',(progress.totalBytesWritten/progress.totalBytesExpectedToWrite*100).toFixed(2));
          if (callback)
            callback(
              parseInt(
                (progress.totalBytesWritten /
                  progress.totalBytesExpectedToWrite) *
                  100
              ),
              progress.totalBytesWritten,
              progress.totalBytesExpectedToWrite
            );
        }
      ).downloadAsync();

      return {
        ...lesson,
        tactic: {
          ...lesson?.tactic,
          photo: {
            ...lesson?.tactic?.photo,
            url: folderPath + 'image.' + imageFileFormat,
          },
        },
        audio_content: {
          ...lesson.audio_content,
          url: folderPath + 'audio.mp3',
        },
      };
    }

    if (videoUrl) {
      await FileSystem.createDownloadResumable(
        videoUrl,
        FileSystem.documentDirectory + folderPath + 'video.mp4',
        {
          sessionType: FileSystem.FileSystemSessionType.BACKGROUND,
        },
        progress => {
          // console.log('%',(progress.totalBytesWritten/progress.totalBytesExpectedToWrite*100).toFixed(2));
          if (callback)
            callback(
              parseInt(
                (progress.totalBytesWritten /
                  progress.totalBytesExpectedToWrite) *
                  100
              ),
              progress.totalBytesWritten,
              progress.totalBytesExpectedToWrite
            );
        }
      ).downloadAsync();

      return {
        ...lesson,
        tactic: {
          ...lesson?.tactic,
          photo: {
            ...lesson?.tactic?.photo,
            url: folderPath + 'image.' + imageFileFormat,
          },
        },
        video_content: {
          ...lesson.video_content,
          url: folderPath + 'video.mp4',
        },
      };
    }
  } catch (error) {
    console.error('Error downloading media:', error);
  }
};

const deleteLesson = async id => {
  try {
    const folderPath = FileSystem.documentDirectory + id + '/';
    await FileSystem.deleteAsync(folderPath, { idempotent: true });

    // console.log('Media deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting media:', error);
    return false;
  }
};

const getDeviceStorageInfo = async () => {
  const totalStorage = await FileSystem.getTotalDiskCapacityAsync();
  const freeStorage = await FileSystem.getFreeDiskStorageAsync();
  const appStorage = await FileSystem.getInfoAsync(
    FileSystem.documentDirectory
  );
  const info = {
    totalStorage,
    freeStorage,
    appStorage,
  };

  return info;
};

const clearStorage = async () => {
  try {
    // await FileSystem.deleteAsync(FileSystem.documentDirectory, {
    //   idempotent: false,
    // });
    if (FileSystem.documentDirectory) {
      const directoryContents = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      await Promise.all(
        directoryContents.map(async item => {
          const path = `${FileSystem.documentDirectory}/${item}`;
          await FileSystem.deleteAsync(path, { idempotent: true });
        })
      );
      // console.log('All files in the FileSystem.documentDirectory have been deleted');
    }
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};
export {
  downloadLesson,
  deleteLesson,
  getDeviceStorageInfo,
  clearStorage,
  FileSystem,
};
