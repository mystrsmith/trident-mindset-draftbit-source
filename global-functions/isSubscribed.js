import * as CommonPackages from '../custom-files/CommonPackages';

const isSubscribed = Variables => {
  const moment = CommonPackages?.moment;

  // Check RevenueCat
  const customerInfo = Variables['CUSTOMER_INFO'];
  if (customerInfo !== null && customerInfo !== undefined) {
    if (Object.entries(customerInfo?.entitlements?.active)?.length > 0) {
      return true;
    }
  }

  const profileDetails = Variables['PROFILE_DETAILS'];
  if (
    profileDetails?.status === 'active' ||
    profileDetails?.status === 'cancelled'
  ) {
    return true;
  }

  return false;
};

export default isSubscribed;
