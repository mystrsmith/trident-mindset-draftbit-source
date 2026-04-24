import React from 'react';
import {
  Icon,
  LinearGradient,
  Pressable,
  ScreenContainer,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import SubscriptionPricingSectionNewBlock from '../../../components/SubscriptionPricingSectionNewBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import * as CommonPackages from '../../../custom-files/CommonPackages';
import * as CustomCode from '../../../custom-files/CustomCode';
import * as OnboardingVideoPlayer from '../../../custom-files/OnboardingVideoPlayer';
import palettes from '../../../themes/palettes';
import * as Utils from '../../../utils';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import showAlertUtil from '../../../utils/showAlert';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const UpgradeNewScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [availablePackages, setAvailablePackages] = React.useState([]);
  const [isFetchingOfferings, setIsFetchingOfferings] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingFullScreen, setIsLoadingFullScreen] = React.useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] =
    React.useState(false);
  const [myDetails, setMyDetails] = React.useState({});
  const [selectedPackage, setSelectedPackage] = React.useState({});
  const [showNotificationsModal, setShowNotificationsModal] =
    React.useState(false);
  const onPressPackageItem = targetPackage => {
    setSelectedPackage(targetPackage);
  };

  const onPressPurchase = async selectedPackage => {
    try {
      setIsLoadingSubscription(true);
      await purchasePackage(selectedPackage);
      const authMeResponse = (await XanoBackendApi.authMeGET(Constants))?.json;
      setGlobalVariableValue({
        key: 'PROFILE_DETAILS',
        value: authMeResponse,
      });
      setIsLoadingSubscription(false);
    } catch (err) {
      console.error(err);
      setIsLoadingSubscription(false);
    }
  };

  const onScreenBlur = () => {
    if (videoRef && videoRef.current) {
      videoRef.current?.pause();
    }
  };

  const purchasePackage = async productPackage => {
    try {
      setIsLoadingFullScreen(true);
      const Purchases = CommonPackages.Purchases;
      const { customerInfo } = await Purchases.purchasePackage(productPackage);
      setIsLoadingSubscription(true);
      setIsLoadingFullScreen(false);
      if (customerInfo) {
        setGlobalVariableValue({
          key: 'CUSTOMER_INFO',
          value: customerInfo,
        });
        props?.navigation.navigate('BottomTabNavigator', {
          screen: 'HomeStack',
        });
      }
      const FBSdk = CommonPackages?.FBSdk;
      const appsFlyer = CommonPackages?.appsFlyer;
      const identifier = productPackage?.product?.identifier;
      const purchaseAmount = productPackage?.product?.price;
      const currencyCode = productPackage?.product?.currencyCode;
      const subscriptionPeriod = productPackage?.product?.subscriptionPeriod;

      FBSdk.AppEventsLogger.logEvent(FBSdk.AppEventsLogger.AppEvents.Subscribe);
      FBSdk.AEMReporterIOS.logAEMEvent(
        FBSdk.AppEventsLogger.AppEvents.Subscribe,
        purchaseAmount,
        currencyCode,
        { param: 'value' }
      );
      appsFlyer.logEvent('af_subscribe', {
        af_revenue: purchaseAmount,
        af_currency: currencyCode,
        af_subscription_id: identifier,
        af_subscription_period: subscriptionPeriod,
      });
    } catch (error) {
      console.log('purchasePackage error: ', error);
      setIsLoadingSubscription(false);
      setIsLoadingFullScreen(false);
    }
  };
  const videoRef = React.useRef(null);
  const xanoBackendRestorePurchasePOST =
    XanoBackendApi.useRestorePurchasePOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (isFocused) {
        return;
      }
      onScreenBlur();
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  }, [isFocused]);

  return (
    <ScreenContainer hasSafeArea={false} scrollable={false}>
      <Utils.CustomCodeErrorBoundary>
        <OnboardingVideoPlayer.Index ref={videoRef} opacity={0} />
      </Utils.CustomCodeErrorBoundary>
      {/* Option 4 - Container */}
      <View
        style={StyleSheet.applyWidth(
          { flex: 1, paddingBottom: 50 },
          dimensions.width
        )}
      >
        <LinearGradient
          color1={theme.colors.branding.primary}
          color2={theme.colors.branding.secondary}
          startX={0}
          startY={0}
          {...GlobalStyles.LinearGradientStyles(theme)['Linear'].props}
          endX={0}
          endY={90}
          style={StyleSheet.applyWidth(
            GlobalStyles.LinearGradientStyles(theme)['Linear'].style,
            dimensions.width
          )}
        >
          {/* Top Safe Area */}
          <View
            style={StyleSheet.applyWidth(
              { height: safeAreaInsets.top },
              dimensions.width
            )}
          />
          {/* Top View */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'flex-start',
                flex: 1,
                justifyContent: 'space-around',
                paddingLeft: 20,
                paddingRight: 20,
              },
              dimensions.width
            )}
          >
            {/* Header */}
            <View
              style={StyleSheet.applyWidth(
                { flexDirection: 'column', gap: 10 },
                dimensions.width
              )}
            >
              {/* Header 1 */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.Brand.Surface,
                      fontFamily: 'Poppins_300Light',
                      fontSize: 14,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Experience the full program.'}
              </Text>
              {/* Header 2 */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    { color: palettes.Brand.Surface, fontSize: 20 }
                  ),
                  dimensions.width
                )}
              >
                {'Unlock Trident Mindset for free'}
              </Text>
            </View>
            {/* Points View */}
            <View>
              {/* View 2 */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    borderColor: palettes.App.Outline,
                    borderTopWidth: 2,
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    gap: 20,
                    paddingBottom: 15,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 15,
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                <Icon
                  size={24}
                  color={palettes.App.White}
                  name={'MaterialCommunityIcons/infinity'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.7 },
                    dimensions.width
                  )}
                />
                {/* Point Text */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.App['Gold Box'],
                        flex: 1,
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 13,
                        letterSpacing: 0.1,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Unlimited free access for 7 days '}
                </Text>
              </View>
              {/* View 3 */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    borderColor: palettes.App.Outline,
                    borderTopWidth: 2,
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    gap: 20,
                    paddingBottom: 15,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 15,
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                <Icon
                  size={24}
                  color={palettes.App.White}
                  name={'Feather/book-open'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.7 },
                    dimensions.width
                  )}
                />
                {/* Point Text */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.App.Studily_Milk_White,
                        flex: 1,
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 13,
                        letterSpacing: 0.1,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    'Hundreds of lessons and practice exercises organized in a personalized journey to maximize your mental toughness and mental health'
                  }
                </Text>
              </View>
              {/* View 4 */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    borderColor: palettes.App.Outline,
                    borderTopWidth: 2,
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    gap: 20,
                    paddingBottom: 15,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 15,
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                <Icon
                  size={24}
                  color={palettes.App.White}
                  name={'Ionicons/headset-sharp'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.7 },
                    dimensions.width
                  )}
                />
                {/* Point Text */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.App.Studily_Milk_White,
                        flex: 1,
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 13,
                        letterSpacing: 0.1,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    'New content every week - interviews, guided relaxation exercises, science deep-dives, and Q&As with the team'
                  }
                </Text>
              </View>
            </View>
          </View>
          {/* Subscribe View */}
          <View
            style={StyleSheet.applyWidth(
              {
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: 15,
              },
              dimensions.width
            )}
          >
            <SubscriptionPricingSectionNewBlock />
            {/* Restore Button */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                },
                dimensions.width
              )}
            >
              {/* Restore Button */}
              <Pressable
                onPress={() => {
                  const handler = async () => {
                    try {
                      setIsLoadingFullScreen(true);
                      setIsLoadingSubscription(true);
                      const resultAPIRestorePurchase = (
                        await xanoBackendRestorePurchasePOST.mutateAsync({})
                      )?.json;
                      if (resultAPIRestorePurchase?.message) {
                        showAlertUtil({
                          title: 'Alert',
                          message: resultAPIRestorePurchase?.message,
                          buttonText: undefined,
                        });
                      } else {
                      }

                      const resultMe = (
                        await XanoBackendApi.authMeGET(Constants)
                      )?.json;
                      setIsLoadingSubscription(false);
                      setIsLoadingFullScreen(false);
                      await setGlobalVariableValue({
                        key: 'PROFILE_DETAILS',
                        value: resultMe,
                      });
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  };
                  handler();
                }}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand['Strong Inverse'],
                        fontFamily: 'Poppins_600SemiBold',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Restore'}
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(UpgradeNewScreen);
