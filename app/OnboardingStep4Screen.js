import React from 'react';
import { ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { ImageBackground, Platform, StatusBar, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import CommonLoadingBlock from '../components/CommonLoadingBlock';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import * as OnboardingPaginationAnimation from '../custom-files/OnboardingPaginationAnimation';
import logEvent from '../global-functions/logEvent';
import loginOneSignal from '../global-functions/loginOneSignal';
import requestOneSignalPushNotificationPermission from '../global-functions/requestOneSignalPushNotificationPermission';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import getPushTokenUtil from '../utils/getPushToken';
import imageSource from '../utils/imageSource';
import showAlertUtil from '../utils/showAlert';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const OnboardingStep4Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [headerText, setHeaderText] = React.useState(
    'How Trident Mindset Works'
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const onPressNext = () => {
    try {
      if (swiperRef && swiperRef?.current) {
        const newIndex = currentIndex + 1;
        swiperRef.current.scrollBy(newIndex, true);
      }
    } catch (error) {
      console.error('error swiperRef ', error);
    }
  };
  const swiperRef = React.useRef(null);
  const xanoBackendCheckGuestPassRedemptionsPOST =
    XanoBackendApi.useCheckGuestPassRedemptionsPOST();
  React.useEffect(() => {
    const handler = async () => {
      try {
        await requestOneSignalPushNotificationPermission();
        const pushTokenValue = await getPushTokenUtil({
          permissionErrorMessage:
            'Sorry, we need notifications permissions to make this work.',
          deviceErrorMessage:
            'Must use physical device for Push Notifications.',
          showAlertOnPermissionError: true,
          showAlertOnDeviceError: true,
        });

        (
          await XanoBackendApi.updatePushTokenPOST(Constants, {
            push_token: pushTokenValue,
          })
        )?.json;
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, []);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setIsLoading(true);
        logEvent('ob_step4_view', null);
        logEvent('ob_step4_swipe_slide1', null);
        loginOneSignal(Constants['PROFILE_DETAILS']?.id);
        /* hidden 'Run a Custom Function' action */
        /* hidden 'Get Expo Push Token' action */
        /* hidden 'API Request' action */
        const resultGuestPass = (
          await xanoBackendCheckGuestPassRedemptionsPOST.mutateAsync()
        )?.json;
        if (resultGuestPass?.status === Constants['SUCCESS_API_RESPONSE']) {
          navigation.navigate('GuestPassAppliedInformationScreen', {});
          if (true) {
            return;
          }
        } else {
        }

        if (resultGuestPass?.status === 'error') {
          showAlertUtil({
            title: 'Alert',
            message: resultGuestPass?.message,
            buttonText: undefined,
          });
        } else {
        }

        setIsLoading(false);
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, [isFocused]);

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    const entry = StatusBar.pushStackEntry?.({ barStyle: 'light-content' });
    return () => StatusBar.popStackEntry?.(entry);
  }, [isFocused]);

  return (
    <ScreenContainer scrollable={false} hasSafeArea={false}>
      <ImageBackground
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        resizeMode={'cover'}
        source={imageSource(Images['OceanFinisherStory'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
          dimensions.width
        )}
      >
        {/* iOS Safe Area  */}
        <>
          {!(Platform.OS === 'ios') ? null : (
            <View
              {...GlobalStyles.ViewStyles(theme)['iOS Margin View'].props}
              style={StyleSheet.applyWidth(
                GlobalStyles.ViewStyles(theme)['iOS Margin View'].style,
                dimensions.width
              )}
            />
          )}
        </>
        {/* Loaded Content */}
        <>
          {isLoading ? null : (
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'space-between',
                },
                dimensions.width
              )}
            >
              <Utils.CustomCodeErrorBoundary>
                <OnboardingPaginationAnimation.Index />
              </Utils.CustomCodeErrorBoundary>
            </View>
          )}
        </>
        <>
          {!isLoading ? null : (
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', flex: 1, justifyContent: 'center' },
                dimensions.width
              )}
            >
              <CommonLoadingBlock />
            </View>
          )}
        </>
      </ImageBackground>
    </ScreenContainer>
  );
};

export default withTheme(OnboardingStep4Screen);
