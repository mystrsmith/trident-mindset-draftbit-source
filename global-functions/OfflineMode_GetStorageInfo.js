import * as DownloadManager from '../custom-files/DownloadManager';

const OfflineMode_GetStorageInfo = async () => {
  return await DownloadManager.getDeviceStorageInfo();
};

export default OfflineMode_GetStorageInfo;
