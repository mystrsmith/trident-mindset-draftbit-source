import * as CommonPackages from '../custom-files/CommonPackages';

const loginOneSignal = userId => {
  try {
    const OneSignal = CommonPackages?.OneSignal;
    OneSignal.login(String(userId));
  } catch (error) {
    console.error(error);
  }
};

export default loginOneSignal;
