import * as CommonPackages from '../custom-files/CommonPackages';

const logCompletedRegistration = () => {
  try {
    const FBSdk = CommonPackages?.FBSdk;
    FBSdk.AppEventsLogger.logEvent(
      FBSdk.AppEventsLogger.AppEvents.CompletedRegistration,
      {
        [FBSdk.AppEventsLogger.AppEventParams.RegistrationMethod]: 'email',
      }
    );
  } catch (error) {
    console.error('Error logCompletedRegistration : ', error);
  }
};

export default logCompletedRegistration;
