import * as CommonPackages from '../custom-files/CommonPackages';

const getTimezone = () => {
  const timezone = CommonPackages?.Localization?.timezone;
  return timezone;
};

export default getTimezone;
