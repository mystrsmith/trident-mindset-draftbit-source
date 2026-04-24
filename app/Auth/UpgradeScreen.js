import React from 'react';
import {
  AccordionGroup,
  Circle,
  Icon,
  Pressable,
  ScreenContainer,
  StarRating,
  Swiper,
  SwiperItem,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../GlobalStyles.js';
import * as XanoBackendApi from '../../apis/XanoBackendApi.js';
import SubscriptionPricingSectionBlock from '../../components/SubscriptionPricingSectionBlock';
import * as GlobalVariables from '../../config/GlobalVariableContext';
import Images from '../../config/Images';
import * as CommonPackages from '../../custom-files/CommonPackages';
import * as CustomCode from '../../custom-files/CustomCode';
import * as CustomUpgradeScrollView from '../../custom-files/CustomUpgradeScrollView';
import * as UpgradeSnapCarousel from '../../custom-files/UpgradeSnapCarousel';
import getRevCatCustomerInfo from '../../global-functions/getRevCatCustomerInfo';
import isSubscribed from '../../global-functions/isSubscribed';
import loginRevenueCat from '../../global-functions/loginRevenueCat';
import relativeTime from '../../global-functions/relativeTime';
import restorePurchase from '../../global-functions/restorePurchase';
import palettes from '../../themes/palettes';
import * as Utils from '../../utils';
import Breakpoints from '../../utils/Breakpoints';
import * as StyleSheet from '../../utils/StyleSheet';
import imageSource from '../../utils/imageSource';
import showAlertUtil from '../../utils/showAlert';
import useIsFocused from '../../utils/useIsFocused';
import useNavigation from '../../utils/useNavigation';
import useParams from '../../utils/useParams';
import useWindowDimensions from '../../utils/useWindowDimensions';

const UpgradeScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [availablePackages, setAvailablePackages] = React.useState([]);
  const [isFetchingOfferings, setIsFetchingOfferings] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingFullScreen, setIsLoadingFullScreen] = React.useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] =
    React.useState(false);
  const [myDetails, setMyDetails] = React.useState({});
  const [selectedPackage, setSelectedPackage] = React.useState(null);
  const [showNotificationsModal, setShowNotificationsModal] =
    React.useState(false);
  const getButtonPurchaseLabel = () => {
    const firstAvailablePackage = getFirstAvailablePackage();

    let label = 'Unlock full access';
    if (firstAvailablePackage) {
      label = `Unlock full access ${
        firstAvailablePackage?.product?.priceString
      }/${firstAvailablePackage?.packageType.toLowerCase()}`;
    }
    return label;
  };

  const getFirstAvailablePackage = () => {
    if (availablePackages && availablePackages?.length > 0) {
      return availablePackages[0];
    }
    return null;
  };

  const getOfferings = async user => {
    try {
      const offerings = await CommonPackages.Purchases.getOfferings();
      // Display discounted
      if (user?.show_discount_subscription == true) {
        if (
          offerings?.all?.default_discount !== null &&
          offerings?.all?.default_discount?.availablePackages?.length !== 0
        ) {
          setAvailablePackages(
            offerings?.all?.default_discount?.availablePackages
          );
          setSelectedPackage(
            offerings?.all?.default_discount?.availablePackages[0]
          );
        }
      }
      // Normal
      else {
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setAvailablePackages(offerings.current.availablePackages);
          setSelectedPackage(offerings.current.availablePackages[0]);
        }
      }
    } catch (e) {
      console.error('error getOfferings', JSON.stringify(e.message));
    }
  };

  const onPressPackageItem = targetPackage => {
    setSelectedPackage(targetPackage);
  };

  const onPressPurchase = async () => {
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
      setIsLoadingSubscription(false);
      setIsLoadingFullScreen(false);
    }
  };
  const xanoBackendRestorePurchasePOST =
    XanoBackendApi.useRestorePurchasePOST();
  const xanoBackendReadAllNotificationsPOST =
    XanoBackendApi.useReadAllNotificationsPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setIsFetchingOfferings(true);
        setIsLoadingSubscription(true);
        const resultMe = (await XanoBackendApi.authMeGET(Constants))?.json;
        await setGlobalVariableValue({
          key: 'PROFILE_DETAILS',
          value: resultMe,
        });
        await getOfferings(resultMe);
        setIsFetchingOfferings(false);
        setIsLoadingSubscription(false);
        await loginRevenueCat(setGlobalVariableValue, resultMe?.id);
        await getRevCatCustomerInfo(setGlobalVariableValue);
        if (resultMe?.auto_trigger_restore_purchase === true) {
          if (!Constants['AUTH_TOKEN']) {
            return;
          }
          const resultRestoreData = await restorePurchase();
          (
            await xanoBackendRestorePurchasePOST.mutateAsync({
              restore_data: resultRestoreData,
            })
          )?.json;
          const resultAuthMe = (await XanoBackendApi.authMeGET(Constants))
            ?.json;
          await setGlobalVariableValue({
            key: 'PROFILE_DETAILS',
            value: resultAuthMe,
          });
        } else {
        }
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
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      hasTopSafeArea={false}
    >
      <ImageBackground
        resizeMode={'cover'}
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        source={imageSource(Images['OceanFinisherStory'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
          dimensions.width
        )}
      >
        {/* iOS Safe Area */}
        <>
          {!(Platform.OS === 'ios') ? null : (
            <View
              style={StyleSheet.applyWidth({ height: 35 }, dimensions.width)}
            />
          )}
        </>
        {/* Header */}
        <View
          style={StyleSheet.applyWidth(
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 10,
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 15,
            },
            dimensions.width
          )}
        >
          {/* Left */}
          <View
            style={StyleSheet.applyWidth({ width: 80 }, dimensions.width)}
          />
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={imageSource(Images['Logo1'])}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 48, width: 130 }
              ),
              dimensions.width
            )}
          />
          {/* Right */}
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'flex-end', justifyContent: 'center', width: 80 },
              dimensions.width
            )}
          >
            <Pressable
              onPress={() => {
                const handler = async () => {
                  try {
                    setIsLoadingFullScreen(true);
                    setIsLoadingSubscription(true);
                    const resultRestore = await restorePurchase();
                    const resultAPIRestorePurchase = (
                      await xanoBackendRestorePurchasePOST.mutateAsync({
                        restore_data: resultRestore,
                      })
                    )?.json;
                    if (resultAPIRestorePurchase?.message) {
                      showAlertUtil({
                        title: 'Alert',
                        message: resultAPIRestorePurchase?.message,
                        buttonText: undefined,
                      });
                    } else {
                    }

                    const resultMe = (await XanoBackendApi.authMeGET(Constants))
                      ?.json;
                    setIsLoadingSubscription(false);
                    setIsLoadingFullScreen(false);
                    await setGlobalVariableValue({
                      key: 'PROFILE_DETAILS',
                      value: resultMe,
                    });
                    await getRevCatCustomerInfo(setGlobalVariableValue);
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
        <Utils.CustomCodeErrorBoundary>
          <CustomUpgradeScrollView.Index
            {...{
              isFetchingOfferings,
              availablePackages,
              selectedPackage,
              theme,
              isLoadingSubscription,
              onPressPackageItem,
              onPressPurchase,
            }}
          />
        </Utils.CustomCodeErrorBoundary>
      </ImageBackground>
      {/* Modal Loading Purchase */}
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'fade'}
        transparent={true}
        visible={Boolean(isLoadingFullScreen)}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: palettes.App.Overlay,
              bottom: 0,
              flex: 1,
              height: '100%',
              justifyContent: 'center',
              left: 0,
              position: 'absolute',
              right: 0,
              top: 0,
              width: '100%',
            },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                backgroundColor: palettes.Brand.Surface,
                borderRadius: 12,
                height: 50,
                justifyContent: 'center',
                padding: 10,
                width: 50,
              },
              dimensions.width
            )}
          >
            <ActivityIndicator
              animating={true}
              hidesWhenStopped={true}
              size={'small'}
              {...GlobalStyles.ActivityIndicatorStyles(theme)[
                'Activity Indicator'
              ].props}
              style={StyleSheet.applyWidth(
                GlobalStyles.ActivityIndicatorStyles(theme)[
                  'Activity Indicator'
                ].style,
                dimensions.width
              )}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(UpgradeScreen);
