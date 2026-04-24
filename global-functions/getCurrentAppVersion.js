import * as CommonPackages from '../custom-files/CommonPackages';

const getCurrentAppVersion = () => {
  const Application = CommonPackages?.Application;
  const currentAppVersion = Application.nativeApplicationVersion;
  return currentAppVersion;
};

export default getCurrentAppVersion;
