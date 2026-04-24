import * as CommonPackages from '../custom-files/CommonPackages';

const setAppsflyerUserId = userId => {
  try {
    const appsFlyer = CommonPackages?.appsFlyer;
    appsFlyer.setCustomerUserId(String(userId));
  } catch (error) {
    console.error('Error setAppsflyerUserId : ', error);
  }
};

export default setAppsflyerUserId;
