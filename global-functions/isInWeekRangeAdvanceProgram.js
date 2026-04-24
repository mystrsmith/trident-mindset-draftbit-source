import * as CommonPackages from '../custom-files/CommonPackages';

const isInWeekRangeAdvanceProgram = advanceProgram => {
  const moment = CommonPackages?.moment;
  const fromDate = moment(advanceProgram?.from).local();
  const toDate = moment(advanceProgram?.to).local();
  const now = moment().local();
  return now.isAfter(fromDate) && now.isBefore(toDate);
};

export default isInWeekRangeAdvanceProgram;
