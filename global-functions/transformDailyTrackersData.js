import * as CommonPackages from '../custom-files/CommonPackages';

const transformDailyTrackersData = dailyTrackers => {
  const moment = CommonPackages?.moment;

  if (
    dailyTrackers === null ||
    dailyTrackers === undefined ||
    dailyTrackers?.length === 0
  ) {
    return [
      { label: 'M', selected: false },
      { label: 'T', selected: false },
      { label: 'W', selected: false },
      { label: 'T', selected: false },
      { label: 'F', selected: false },
      { label: 'S', selected: false },
      { label: 'S', selected: false },
    ];
  }

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const output = daysOfWeek.map(day => ({
    label: day.charAt(0),
    selected: false,
  }));

  if (dailyTrackers?.length > 0) {
    dailyTrackers?.forEach(item => {
      const createdDate = moment(item.created_at);
      const localDayOfWeek = createdDate.format('ddd');
      const index = daysOfWeek.indexOf(localDayOfWeek);
      if (index !== -1) {
        output[index].selected = true;
      }
    });
  }

  return output;
};

export default transformDailyTrackersData;
