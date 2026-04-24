import * as CommonPackages from '../custom-files/CommonPackages';

const isValidAccessAdvanceDay = (Variables, weekday, from_history) => {
  const moment = CommonPackages?.moment;
  const profileDetails = Variables['PROFILE_DETAILS'];

  if (from_history || profileDetails.is_test_user === true) {
    return true;
  }

  const currentDayOfWeek = moment().local().day();
  if (weekday === 0) {
    return currentDayOfWeek === 0;
  }
  return weekday <= currentDayOfWeek;
};

export default isValidAccessAdvanceDay;
