import * as CommonPackages from '../custom-files/CommonPackages';

const formatDateTime = (dateValue, format) => {
  const moment = CommonPackages?.moment;
  const result = moment(dateValue).format(format);
  return result;
};

export default formatDateTime;
