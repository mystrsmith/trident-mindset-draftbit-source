import * as CommonPackages from '../custom-files/CommonPackages';

const logEvent = (eventName, eventValues) => {
  try {
    const appsFlyer = CommonPackages?.appsFlyer;
    appsFlyer.logEvent(
      eventName,
      eventValues,
      res => {},
      err => {
        console.error(err);
      }
    );
  } catch (error) {
    console.error('logEvent error : ', error);
  }
};

export default logEvent;
