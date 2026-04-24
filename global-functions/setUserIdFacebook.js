import * as CommonPackages from '../custom-files/CommonPackages';

const setUserIdFacebook = userId => {
  try {
    const FBSdk = CommonPackages?.FBSdk;
    FBSdk.AppEventsLogger.setUserID(String(userId));
  } catch (error) {
    console.error('Error setUserIdFacebook : ', error);
  }
};

export default setUserIdFacebook;
