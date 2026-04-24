import * as CommonPackages from '../custom-files/CommonPackages';

const logEventSignUp = registrationMethod => {
  try {
    const FBSdk = CommonPackages?.FBSdk;
    FBSdk.AppEventsLogger.logEvent(
      FBSdk.AppEventsLogger.AppEvents.CompletedRegistration,
      {
        [FBSdk.AppEventsLogger.AppEventParams.RegistrationMethod]:
          registrationMethod || 'email',
      }
    );
  } catch (error) {
    console.error('Error logEventSignUp : ', error);
  }
};

export default logEventSignUp;
