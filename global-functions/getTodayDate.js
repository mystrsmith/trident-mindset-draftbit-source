import * as CommonPackages from '../custom-files/CommonPackages';

const getTodayDate = () => {
  const moment = CommonPackages?.moment;
  const todayDate = moment().format('YYYY-MM-DD');
  return todayDate;
};

export default getTodayDate;
