import * as CommonPackages from '../custom-files/CommonPackages';

const alreadyTrackedDaily = dailyTrackers => {
  const moment = CommonPackages?.moment;

  const currentLocalDate = moment();
  const currentLocalDay = currentLocalDate.format('ddd');

  for (const item of dailyTrackers) {
    const createdAtDate = moment(item?.created_at);
    const createdAtLocalDay = createdAtDate.format('ddd');

    if (currentLocalDay === createdAtLocalDay) {
      return true;
    }
  }

  return false;
};

export default alreadyTrackedDaily;
