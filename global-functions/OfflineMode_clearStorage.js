import * as DownloadManager from '../custom-files/DownloadManager';

const OfflineMode_clearStorage = async setGlobalVariableValue => {
  let result = await DownloadManager.clearStorage();

  if (result) {
    setGlobalVariableValue({
      key: 'DOWNLOADED_LESSONS',
      value: [],
    });
    return true;
  } else {
    return false;
  }
};

export default OfflineMode_clearStorage;
