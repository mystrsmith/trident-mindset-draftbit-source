import * as CommonPackages from '../custom-files/CommonPackages';

const getCurrentDayIndex = () => {
  const moment = CommonPackages?.moment;

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDate = moment();
  const currentDay = currentDate.format('ddd');
  return daysOfWeek.indexOf(currentDay);
};

export default getCurrentDayIndex;
