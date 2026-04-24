import React from 'react';
import { Platform } from 'react-native';
import { Touchable } from '@draftbit/ui';
import * as AppleAuthentication from 'expo-apple-authentication';
import { CommonActions } from '@react-navigation/native';
import * as GlobalVariables from '../config/GlobalVariableContext';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import jwtDecode from 'jwt-decode';
import loginRevenueCat from '../global-functions/loginRevenueCat';
import loginOneSignal from '../global-functions/loginOneSignal';
import waitUtil from '../utils/wait';
import * as XanoBackendApi from '../apis/XanoBackendApi';

// Configure Google Sign-In once (uses same client IDs as previous expo-auth-session setup)
GoogleSignin.configure({
  webClientId:
    '117560079638-qc2aa104bomuttpc0t918jfmojlpetki.apps.googleusercontent.com',
  iosClientId:
    '117560079638-ae3qfccpiht3cvfkraj1hrephsibk9fk.apps.googleusercontent.com',
  offlineAccess: false,
});

export function GoogleWrapper({
  children,
  isLoading,
  setIsLoading,
  navigation,
  setErrorMessage,
}) {
  const variables = GlobalVariables.useValues();
  const appliedRedeemCode = variables['APPLIED_REDEEM_CODE'];
  const anonymousId = variables['ANONYMOUS_ID'];
  const codeId = appliedRedeemCode?.id ?? 0;
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      if (response?.type === 'cancelled' || !response?.data) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens?.accessToken ?? response?.data?.idToken;
      if (!accessToken) {
        setErrorMessage?.('Could not get Google sign-in token');
        setIsLoading(false);
        return;
      }
      await signupwithGmail(
        {
          gmail_token: accessToken,
          device_type: Platform.OS === 'ios' ? 'iOS' : 'Android',
          code_id: codeId,
          anonymous_id: anonymousId,
        },
        navigation,
        setGlobalVariableValue,
        setErrorMessage,
        setIsLoading
      );
    } catch (error) {
      console.log('Error signing in with Google:', error);
      setIsLoading(false);
      if (error?.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
        setErrorMessage?.('Google Play Services not available');
      } else if (error?.code !== statusCodes?.SIGN_IN_CANCELLED) {
        setErrorMessage?.('Google sign-in failed');
      }
    }
  };

  return (
    <Touchable onPress={handleGoogleSignIn} disabled={isLoading}>
      {children}
    </Touchable>
  );
}

export function AppleWrapper({
  children,
  isLoading,
  setIsLoading,
  setErrorMessage,
  navigation,
}) {
  const variables = GlobalVariables.useValues();
  const appliedRedeemCode = variables['APPLIED_REDEEM_CODE'];
  const codeId = appliedRedeemCode?.id ?? 0;
  const anonymousId = variables['ANONYMOUS_ID'];
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  const [appleAuthAvailable, setAppleAuthAvailable] = React.useState(false);

  React.useEffect(() => {
    const checkAvailable = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isAvailable);
    };
    checkAvailable();
  }, []);

  const login = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      setIsLoading(true);
      const decoded = jwtDecode(credential?.identityToken);
      signupWithApple(
        {
          email: decoded?.email,
          first_name: credential?.fullName?.givenName,
          last_name: credential?.fullName?.familyName,
          device_type: 'iOS',
          user_id: credential?.user,
          code_id: codeId,
          anonymous_id: anonymousId,
        },
        navigation,
        setGlobalVariableValue,
        setErrorMessage,
        setIsLoading
      );
    } catch (e) {
      setIsLoading(false);
    }
  };

  if (appleAuthAvailable) {
    return (
      <Touchable onPress={login} disabled={!appleAuthAvailable || isLoading}>
        {children}
      </Touchable>
    );
  }
  return null;
}

/**
 * Shared post-auth handler for both Apple and Google sign-in.
 * - Syncs tactic recommendations when we have anonymous_id + token.
 * - Calls checkShouldShowOnboarding to decide navigation destination.
 */
const handleAuthSuccess = async ({
  token,
  user,
  anonymous_id: initialAnonymousId,
  setGlobalVariableValue,
  navigation,
  setIsLoading,
}) => {
  const authConstants = { AUTH_TOKEN: 'Bearer ' + token };

  setGlobalVariableValue({
    key: 'AUTH_TOKEN',
    value: authConstants.AUTH_TOKEN,
  });
  await waitUtil({ milliseconds: 1000 });
  setGlobalVariableValue({ key: 'PROFILE_DETAILS', value: user });

  if (initialAnonymousId && token) {
    try {
      await XanoBackendApi.updateUserTacticRecommendationsPATCH(
        authConstants,
        { anonymous_id: initialAnonymousId },
        {},
        undefined
      );
    } catch (error) {
      console.log('Error updating tactic recommendations:', error);
    }
  }
  await waitUtil({ milliseconds: 500 });

  let shouldShowOnboarding = false;
  try {
    const onboardingResult = await XanoBackendApi.checkShouldShowOnboardingGET(
      authConstants,
      {},
      {},
      undefined
    );
    shouldShowOnboarding = onboardingResult?.json === true;
  } catch (error) {
    console.log('Error checking onboarding status:', error);
  }

  setIsLoading(false);
  const rootNavigation = navigation.getParent() || navigation;

  if (shouldShowOnboarding) {
    rootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'OnboardingStep2Screen',
            params: { hideCloseButton: true },
          },
        ],
      })
    );
    await loginRevenueCat(setGlobalVariableValue, user?.id ?? '');
    loginOneSignal(user?.id);
    return;
  }

  rootNavigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'BottomTabNavigator',
          params: {
            screen: 'HomeStack',
            params: { screen: 'HomeScreen' },
          },
        },
      ],
    })
  );
  await loginRevenueCat(setGlobalVariableValue, user?.id ?? '');
  loginOneSignal(user?.id);
};

const signupWithApple = async (
  data,
  navigation,
  setGlobalVariableValue,
  setErrorMessage,
  setIsLoading
) => {
  const {
    first_name,
    last_name,
    email,
    device_type,
    user_id,
    code_id,
    anonymous_id,
  } = data;

  let apiUrl = `https://xfbv-qcqq-txoe.n7c.xano.io/api:yD33oprV/auth/apple?email=${email}&device_type=${device_type}&first_name=${first_name}&last_name=${last_name}&user_id=${user_id}`;
  if (code_id) {
    apiUrl += `&code_id=${code_id}`;
  }

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const responseData = await response.json();
  const token = responseData?.auth_token;
  const user = responseData?.user;

  if (responseData?.message) {
    setIsLoading(false);
    setErrorMessage(responseData.message);
    return;
  }
  if (!token) {
    setIsLoading(false);
    return;
  }

  await handleAuthSuccess({
    token,
    user,
    anonymous_id: anonymous_id,
    setGlobalVariableValue,
    navigation,
    setIsLoading,
  });
};

const signupwithGmail = async (
  data,
  navigation,
  setGlobalVariableValue,
  setErrorMessage,
  setIsLoading
) => {
  const { gmail_token, device_type, code_id, anonymous_id } = data;

  let apiUrl = `https://xfbv-qcqq-txoe.n7c.xano.io/api:yD33oprV/auth/google?token=${gmail_token}&device_type=${device_type}`;

  if (code_id) {
    apiUrl += `&code_id=${code_id}`;
  }

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseData = await response.json();
  const token = responseData?.auth_token;
  const user = responseData?.user;

  if (responseData?.message) {
    setIsLoading(false);
    setErrorMessage(responseData.message);
    return;
  }
  if (!token) {
    setIsLoading(false);
    return;
  }

  await handleAuthSuccess({
    token,
    user,
    anonymous_id: anonymous_id,
    setGlobalVariableValue,
    navigation,
    setIsLoading,
  });
};
