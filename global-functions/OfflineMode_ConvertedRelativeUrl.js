import * as DownloadManager from '../custom-files/DownloadManager';

const OfflineMode_ConvertedRelativeUrl = url => {
  //Updated by Sefa-Draftbit 2024-01-08 to convert relateive urls to base urls
  //check if url starts with http or file
  if (url.startsWith('http') || url.startsWith('file')) {
    return url;
  } else return DownloadManager.FileSystem.documentDirectory + '/' + url;
};

export default OfflineMode_ConvertedRelativeUrl;
