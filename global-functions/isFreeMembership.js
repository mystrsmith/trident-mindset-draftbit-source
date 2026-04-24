const isFreeMembership = Variables => {
  const profileDetails = Variables['PROFILE_DETAILS'];
  if (
    profileDetails?.subscription_type === 'free' &&
    profileDetails?.status === 'active'
  ) {
    return true;
  }
  return false;
};

export default isFreeMembership;
