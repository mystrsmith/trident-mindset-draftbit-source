import * as CommonPackages from '../custom-files/CommonPackages';

const logoutAmplitude = () => {
  CommonPackages?.amplitude?.reset();
};

export default logoutAmplitude;
