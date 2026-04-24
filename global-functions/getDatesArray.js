import * as CustomCode from '../custom-files/CustomCode';

const getDatesArray = resData => {
  if (resData === null || resData === undefined) {
    return {};
  }
  if (resData?.length === 0) {
    return {};
  }

  var datesObj = {};
  resData.forEach(item => {
    let tempItem = CustomCode.moment(item.created_at).format('yyyy-MM-DD');
    datesObj[tempItem] = { selected: true };
  });

  return datesObj;
};

export default getDatesArray;
