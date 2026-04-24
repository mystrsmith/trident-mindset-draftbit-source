import * as CommonPackages from '../custom-files/CommonPackages';

const setUserDataFacebook = user => {
  try {
    if (!user) {
      console.warn('setUserDataFacebook: No user data provided');
      return;
    }

    const FBSdk = CommonPackages?.FBSdk;
    if (!FBSdk?.AppEventsLogger) {
      console.warn('setUserDataFacebook: Facebook SDK not available');
      return;
    }

    // Extract user data from different sources
    let email = '';
    let firstName = '';
    let lastName = '';
    let name = '';

    // Priority order: OAuth data first, then fallback to main user fields
    if (user?.google_oauth) {
      // Google OAuth data
      email = user.google_oauth?.email;
      name = user.google_oauth?.name || '';
    } else if (user?.apple_oauth) {
      // Apple OAuth data
      email = user.apple_oauth?.email;
      name = user.apple_oauth?.name || '';
    } else {
      // Fallback to main user fields (normal email/password registration)
      email = user?.email || '';
      name = user?.name || '';
    }

    // Parse name into first and last name
    if (name) {
      const nameArray = name.split(' ').filter(part => part.trim().length > 0);
      firstName = nameArray[0] || '';
      lastName = nameArray.slice(1).join(' ') || '';
    }

    // Set user data in Facebook SDK
    FBSdk.AppEventsLogger.setUserData({
      email: email,
      firstName: firstName,
      lastName: lastName,
    });
  } catch (error) {
    console.error('Error setUserDataFacebook:', error);
  }
};

export default setUserDataFacebook;
