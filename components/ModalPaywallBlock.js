import React from 'react';
import {
  Icon,
  IconButton,
  LinearGradient,
  Pressable,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import SubscriptionPricingSectionNewBlock from '../components/SubscriptionPricingSectionNewBlock';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CommonPackages from '../custom-files/CommonPackages';
import * as CustomCode from '../custom-files/CustomCode';
import * as OnboardingVideoPlayer from '../custom-files/OnboardingVideoPlayer';
import getRevCatCustomerInfo from '../global-functions/getRevCatCustomerInfo';
import loginRevenueCat from '../global-functions/loginRevenueCat';
import restorePurchase from '../global-functions/restorePurchase';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import showAlertUtil from '../utils/showAlert';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const ModalPaywallBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [availablePackages, setAvailablePackages] = React.useState([]);
  const [isEligibleForTrial, setIsEligibleForTrial] = React.useState(false);
  const [isFetchingOfferings, setIsFetchingOfferings] = React.useState(false);
  const [isLoadingCTA, setIsLoadingCTA] = React.useState(false);
  const [isLoadingFullScreen, setIsLoadingFullScreen] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(null);
  const [visibleErrorGetOfferings, setVisibleErrorGetOfferings] =
    React.useState(false);
  const checkEligibleForTrial = async () => {
    const user = Variables['PROFILE_DETAILS'];
    const isGuestPassRedemption = user?.guest_pass_redemption;
    const isTestUser = user?.is_test_user;

    if (isTestUser) {
      return true;
    }

    // First check guest pass redemption since it's a business rule
    if (isGuestPassRedemption) {
      return false;
    }

    const customerInfo = await CommonPackages.Purchases.getCustomerInfo();

    // Check if user has any active or expired entitlements
    // This is the recommended cross-platform way to check trial eligibility
    if (Object.keys(customerInfo?.entitlements?.all || {}).length > 0) {
      // User has had access to entitlements before, not eligible for trial
      return false;
    }

    // If we get here, user has never had any entitlements
    return true;
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
          if (offerings.current.availablePackages?.length > 1) {
            setSelectedPackage(offerings.current.availablePackages[1]);
          } else {
            setSelectedPackage(offerings.current.availablePackages[0]);
          }
        }
      }
    } catch (e) {
      console.error(e);
      showAlertUtil('Error', `Failed to fetch offerings: ${e?.message}`);
      setVisibleErrorGetOfferings(true);
    }
  };

  const onPressPackageItem = targetPackage => {
    setSelectedPackage(targetPackage);
  };

  const onScreenBlur = () => {
    if (videoRef && videoRef.current) {
      videoRef.current?.pause();
    }
  };

  const purchasePackage = async (setGlobalVariableValue, productPackage) => {
    try {
      setIsLoadingFullScreen(true);
      const Purchases = CommonPackages.Purchases;
      const { customerInfo } = await Purchases.purchasePackage(productPackage);
      setGlobalVariableValue({
        key: 'CUSTOMER_INFO',
        value: customerInfo,
      });

      const FBSdk = CommonPackages?.FBSdk;
      const appsFlyer = CommonPackages?.appsFlyer;
      const identifier = productPackage?.product?.identifier;
      const purchaseAmount = productPackage?.product?.price;
      const currencyCode = productPackage?.product?.currencyCode;
      const subscriptionPeriod = productPackage?.product?.subscriptionPeriod;

      FBSdk.AppEventsLogger.logPurchase(purchaseAmount, currencyCode);
      FBSdk.AppEventsLogger.logEvent(FBSdk.AppEventsLogger.AppEvents.Subscribe);

      FBSdk.AEMReporterIOS.logAEMEvent(
        FBSdk.AppEventsLogger.AppEvents.Subscribe,
        purchaseAmount,
        currencyCode
      );
      FBSdk.AEMReporterIOS.logAEMEvent(
        FBSdk.AppEventsLogger.AppEvents.Purchased,
        purchaseAmount,
        currencyCode
      );

      appsFlyer.logEvent('af_subscribe', {
        af_revenue: purchaseAmount,
        af_currency: currencyCode,
        af_subscription_id: identifier,
        af_subscription_period: subscriptionPeriod,
      });

      await waitUtil({ milliseconds: 500 });
      const authMeResponse = (await XanoBackendApi.authMeGET(Constants))?.json;
      setGlobalVariableValue({
        key: 'PROFILE_DETAILS',
        value: authMeResponse,
      });
      await waitUtil({ milliseconds: 500 });
      setIsLoadingFullScreen(false);
      setGlobalVariableValue({
        key: 'VISIBLE_MODAL_PAYWALL',
        value: false,
      });
      setGlobalVariableValue({
        key: 'PURCHASED_AFTER_LESSON_TITLE',
        value: '',
      });
    } catch (error) {
      setIsLoadingFullScreen(false);
      if (Number(error?.code) === 1) {
        return;
      }
      console.error('purchasePackage error', JSON.stringify(error, null, 2));
      Alert.alert(
        'Error',
        `Purchase failed: ${error?.message || 'Unknown error'}`
      );
    } finally {
      setIsLoadingFullScreen(false);
    }
  };
  const videoRef = React.useRef(null);
  const isVisibleModalPaywall = Constants['VISIBLE_MODAL_PAYWALL'];

  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isVisibleModalPaywall) {
          return;
        }
        setVisibleErrorGetOfferings(false);
        setIsFetchingOfferings(true);
        if (Constants['AUTH_TOKEN']?.length > 0) {
          const resultMe = (await XanoBackendApi.authMeGET(Constants))?.json;
          setGlobalVariableValue({
            key: 'PROFILE_DETAILS',
            value: resultMe,
          });
          await loginRevenueCat(setGlobalVariableValue, resultMe?.id);
          await getRevCatCustomerInfo(setGlobalVariableValue);
          await getOfferings(resultMe);
          const isEligibleForTrial = await checkEligibleForTrial();
          setIsEligibleForTrial(isEligibleForTrial);
        } else {
          await getOfferings({});
          const isEligibleForTrial = await checkEligibleForTrial();
          setIsEligibleForTrial(isEligibleForTrial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingOfferings(false);
      }
    };
    handler();
  }, [isVisibleModalPaywall]);
  const xanoBackendRestorePurchasePOST =
    XanoBackendApi.useRestorePurchasePOST();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (Constants['AUTH_TOKEN']) {
          const resultMe = (await XanoBackendApi.authMeGET(Constants))?.json;
          await setGlobalVariableValue({
            key: 'PROFILE_DETAILS',
            value: resultMe,
          });
          await loginRevenueCat(setGlobalVariableValue, resultMe?.id);
          await waitUtil({ milliseconds: 100 });
          await getOfferings(resultMe);
        } else {
        }
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, []);

  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      animationType={'slide'}
      transparent={true}
      visible={Boolean(Constants['VISIBLE_MODAL_PAYWALL'] === true)}
    >
      {/* Container */}
      <>
        {!(
          Constants['AUTH_TOKEN']?.length > 0 &&
          Constants['VISIBLE_MODAL_PAYWALL'] === true
        ) ? null : (
          <View
            style={StyleSheet.applyWidth(
              { backgroundColor: theme.colors.background.brand, flex: 1 },
              dimensions.width
            )}
          >
            <Utils.CustomCodeErrorBoundary>
              <OnboardingVideoPlayer.Index
                ref={videoRef}
                opacity={0}
                isFocused={isVisibleModalPaywall}
              />
            </Utils.CustomCodeErrorBoundary>
            <LinearGradient
              startX={0}
              startY={0}
              {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                .props}
              color1={palettes.App.Black_Alpha_80}
              color2={palettes.App['Background 90 Opacity']}
              color3={palettes.App.Black_Alpha_80}
              endX={0}
              endY={90}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                    .style,
                  { height: '100%', opacity: 1, width: '100%' }
                ),
                dimensions.width
              )}
            >
              {/* Header */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    flexDirection: 'row',
                    gap: 10,
                    justifyContent: 'space-between',
                    paddingBottom: 10,
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: safeAreaInsets.top + 15,
                  },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    { flex: 1, gap: 5 },
                    dimensions.width
                  )}
                >
                  {/* Title */}
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: palettes.Brand.Surface,
                          fontFamily: 'Rasa_300Light',
                          fontSize: 20,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {Constants['TITLE_PAYWALL']}
                  </Text>
                  {/* Sub Title */}
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: palettes.Brand.Surface,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 19,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {isEligibleForTrial
                      ? Constants['SUBTITLE_PAYWALL']
                      : 'Subscribe to Start Mastering Your Mind'}
                  </Text>
                </View>
                <IconButton
                  onPress={() => {
                    const handler = async () => {
                      try {
                        await setGlobalVariableValue({
                          key: 'PURCHASED_AFTER_LESSON_TITLE',
                          value: null,
                        });
                        await setGlobalVariableValue({
                          key: 'TITLE_PAYWALL',
                          value: 'Unlock the full program',
                        });
                        await setGlobalVariableValue({
                          key: 'SUBTITLE_PAYWALL',
                          value: 'Start Your Free Trial',
                        });
                        await setGlobalVariableValue({
                          key: 'VISIBLE_MODAL_PAYWALL',
                          value: false,
                        });
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    };
                    handler();
                  }}
                  color={palettes.Brand.Surface}
                  icon={'AntDesign/closecircleo'}
                  size={27}
                />
              </View>

              <SimpleStyleScrollView
                bounces={true}
                horizontal={false}
                keyboardShouldPersistTaps={'never'}
                nestedScrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={StyleSheet.applyWidth(
                  {
                    flex: 1,
                    marginTop: isEligibleForTrial === true ? 10 : 20,
                    paddingLeft: 15,
                    paddingRight: 15,
                  },
                  dimensions.width
                )}
              >
                {/* Points View */}
                <View>
                  {/* View 2 */}
                  <>
                    {!isEligibleForTrial ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            borderColor: palettes.App.Outline,
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                            gap: 20,
                            paddingBottom: 10,
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 10,
                            width: '100%',
                          },
                          dimensions.width
                        )}
                      >
                        <Icon
                          color={palettes.App.White}
                          name={'MaterialCommunityIcons/infinity'}
                          size={20}
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
                                fontFamily: 'Rasa_400Regular',
                                fontSize: 17,
                                letterSpacing: 0.1,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Unlimited free access for 7 days '}
                        </Text>
                      </View>
                    )}
                  </>
                  {/* View 3 */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        borderColor: palettes.App.Outline,
                        borderTopWidth: [
                          { minWidth: Breakpoints.Mobile, value: 1 },
                          {
                            minWidth: Breakpoints.Mobile,
                            value: isEligibleForTrial ? 1 : 0,
                          },
                        ],
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        gap: 20,
                        paddingBottom: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 10,
                        width: '100%',
                      },
                      dimensions.width
                    )}
                  >
                    <Icon
                      color={palettes.App.White}
                      name={'Feather/book-open'}
                      size={20}
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
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 17,
                            letterSpacing: 0.1,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        'Learn the 12 most effective mental toughness tactics for being calm, effective, and content in any situation'
                      }
                    </Text>
                  </View>
                  {/* View 4 */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        borderColor: palettes.App.Outline,
                        borderTopWidth: 1,
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        gap: 20,
                        paddingBottom: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 10,
                        width: '100%',
                      },
                      dimensions.width
                    )}
                  >
                    <Icon
                      color={palettes.App.White}
                      name={'Ionicons/headset-sharp'}
                      size={20}
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
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 17,
                            letterSpacing: 0.1,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        'Master each tactic with daily lessons and practice exercises taught by Navy SEALs and neuroscientists'
                      }
                    </Text>
                  </View>
                  {/* View 5 */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        borderColor: palettes.App.Outline,
                        borderTopWidth: 1,
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        gap: 20,
                        paddingBottom: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 10,
                        width: '100%',
                      },
                      dimensions.width
                    )}
                  >
                    <Icon
                      color={palettes.App.White}
                      name={'MaterialCommunityIcons/account'}
                      size={20}
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
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 17,
                            letterSpacing: 0.1,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        'Get new long-form content every week: expert interviews, Q&As, science deep-dives, & more'
                      }
                    </Text>
                  </View>
                </View>
                {/* Rating */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      gap: 5,
                      justifyContent: 'center',
                      marginBottom: 30,
                      marginTop: 25,
                    },
                    dimensions.width
                  )}
                >
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 5,
                        justifyContent: 'center',
                      },
                      dimensions.width
                    )}
                  >
                    <Icon
                      color={palettes.App['Custom Color']}
                      name={'FontAwesome/star'}
                      size={18}
                    />
                    {/* Icon 5 */}
                    <Icon
                      color={palettes.App['Custom Color']}
                      name={'FontAwesome/star'}
                      size={18}
                    />
                    {/* Icon 4 */}
                    <Icon
                      color={palettes.App['Custom Color']}
                      name={'FontAwesome/star'}
                      size={18}
                    />
                    {/* Icon 3 */}
                    <Icon
                      color={palettes.App['Custom Color']}
                      name={'FontAwesome/star'}
                      size={18}
                    />
                    {/* Icon 2 */}
                    <Icon
                      color={palettes.App['Custom Color']}
                      name={'FontAwesome/star'}
                      size={18}
                    />
                  </View>

                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: palettes.App['Custom Color'],
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 16,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'4.9 Star Rating in the App Store'}
                  </Text>
                </View>
                {/* Subscribe View */}
                <>
                  {!(
                    isFetchingOfferings === false &&
                    visibleErrorGetOfferings === false
                  ) ? null : (
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          justifyContent: 'flex-start',
                          marginTop: 30,
                          paddingBottom: safeAreaInsets.bottom,
                          width: '100%',
                        },
                        dimensions.width
                      )}
                    >
                      <SubscriptionPricingSectionNewBlock
                        availablePackages={availablePackages}
                        isEligibleForTrial={isEligibleForTrial}
                        onPressPackage={targetPackage =>
                          onPressPackageItem(targetPackage)
                        }
                        onPressPurchasePackage={productPackage =>
                          purchasePackage(
                            setGlobalVariableValue,
                            productPackage
                          )
                        }
                        selectedPackage={selectedPackage}
                      />
                      {/* Restore Button */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 15,
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
                                const resultRestorePurchase =
                                  await restorePurchase();
                                const resultAPIRestorePurchase = (
                                  await xanoBackendRestorePurchasePOST.mutateAsync(
                                    { restore_data: resultRestorePurchase }
                                  )
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
                                await setGlobalVariableValue({
                                  key: 'PROFILE_DETAILS',
                                  value: resultMe,
                                });
                                await getRevCatCustomerInfo(
                                  setGlobalVariableValue
                                );
                                setIsLoadingFullScreen(false);
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
                                  fontFamily: 'Rasa_600SemiBold',
                                  fontSize: 18,
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
                  )}
                </>
                {/* Loading View */}
                <>
                  {!isFetchingOfferings ? null : (
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'center',
                          marginTop: 30,
                        },
                        dimensions.width
                      )}
                    >
                      <ActivityIndicator
                        animating={true}
                        hidesWhenStopped={true}
                        {...GlobalStyles.ActivityIndicatorStyles(theme)[
                          'Activity Indicator'
                        ].props}
                        color={palettes.Brand.Surface}
                        size={'small'}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ActivityIndicatorStyles(theme)[
                              'Activity Indicator'
                            ].style,
                            { height: 25, width: 25 }
                          ),
                          dimensions.width
                        )}
                      />
                    </View>
                  )}
                </>
              </SimpleStyleScrollView>
              {/* Error Get Offerings */}
              <>
                {!visibleErrorGetOfferings ? null : (
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                      },
                      dimensions.width
                    )}
                  >
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.Brand.Surface,
                            fontFamily: 'Rasa_500Medium',
                            fontSize: 21,
                            paddingBottom: 15,
                            paddingLeft: 30,
                            paddingRight: 30,
                            paddingTop: 15,
                            textAlign: 'center',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        'Please sign in to AppStore/PlayStore to able to make subscription'
                      }
                    </Text>
                  </View>
                )}
              </>
            </LinearGradient>
          </View>
        )}
      </>
      {/* Modal Fullscreen Loading */}
      <>
        {!isLoadingFullScreen ? null : (
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
        )}
      </>
    </Modal>
  );
};

export default withTheme(ModalPaywallBlock);
