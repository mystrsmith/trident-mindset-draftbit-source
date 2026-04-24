// return true or false whether item is downloaded
const OfflineMode_isDownloaded = (Variables, id) => {
  const downloaded_lessons = Variables.DOWNLOADED_LESSONS || [];
  return downloaded_lessons.filter(ds => ds.id === id).length > 0; // return true if downloaded
};

export default OfflineMode_isDownloaded;
