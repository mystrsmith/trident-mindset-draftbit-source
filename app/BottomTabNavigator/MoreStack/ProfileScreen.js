import React from 'react';
import {
  Button,
  ExpoImage,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  Switch,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import {
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import ModalGiftSubscriptionBlock from '../../../components/ModalGiftSubscriptionBlock';
import ModalQAndABlock from '../../../components/ModalQAndABlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as CustomCode from '../../../custom-files/CustomCode';
import Player_StopPlay from '../../../global-functions/Player_StopPlay';
import getCurrentMonth from '../../../global-functions/getCurrentMonth';
import getRevCatCustomerInfo from '../../../global-functions/getRevCatCustomerInfo';
import isFreeMembership from '../../../global-functions/isFreeMembership';
import isSubscribed from '../../../global-functions/isSubscribed';
import requestOneSignalPushNotificationPermission from '../../../global-functions/requestOneSignalPushNotificationPermission';
import setUserSentry from '../../../global-functions/setUserSentry';
import showToastMessage from '../../../global-functions/showToastMessage';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import getPushTokenUtil from '../../../utils/getPushToken';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useIsOnline from '../../../utils/useIsOnline';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const ProfileScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const isOnline = useIsOnline();
  const [calData, setCalData] = React.useState([]);
  const [currentMonth, setCurrentMonth] = React.useState(0);
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingCapture, setLoadingCapture] = React.useState(false);
  const [notificationSetting, setNotificationSetting] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [pushToken, setPushToken] = React.useState('');
  const [showLogOutModal, setShowLogOutModal] = React.useState(false);
  const [visibleModalGift, setVisibleModalGift] = React.useState(false);
  const [visibleModalQAndA, setVisibleModalQAndA] = React.useState(false);
  const [switchValue, setSwitchValue] = React.useState(false);
  const onCloseModalGift = () => {
    setVisibleModalGift(false);
  };

  const onOpenModalGift = () => {
    setVisibleModalGift(true);
  };

  const onPressShareMyStreaks = async () => {
    if (viewShotRef && viewShotRef?.current) {
      setLoadingCapture(true);
      const uri = await viewShotRef?.current?.capture();
      Sharing.shareAsync(`file://${uri}`);
      setLoadingCapture(false);
    }
  };
  const viewShotRef = React.useRef();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        await requestOneSignalPushNotificationPermission();
        if (!(Platform.OS === 'web')) {
          await getRevCatCustomerInfo(setGlobalVariableValue);
        }
        const mnt = getCurrentMonth();
        setCurrentMonth(mnt);
        const api_Response = (await XanoBackendApi.authMeGET(Constants))?.json;
        await setGlobalVariableValue({
          key: 'PROFILE_DETAILS',
          value: api_Response,
        });
        const pToken = await (async () => {
          if (!api_Response?.push_token?.length) {
            return await getPushTokenUtil({
              permissionErrorMessage:
                'Sorry, we need notifications permissions to make this work.',
              deviceErrorMessage:
                'Must use physical device for Push Notifications.',
              showAlertOnPermissionError: false,
              showAlertOnDeviceError: false,
            });
          }
        })();
        setPushToken(pToken);
        (
          await XanoBackendApi.updatePushTokenPOST(Constants, {
            push_token: pToken,
          })
        )?.json;
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
      style={StyleSheet.applyWidth(
        { backgroundColor: theme.colors.background.brand },
        dimensions.width
      )}
    >
      <ImageBackground
        resizeMode={'cover'}
        {...GlobalStyles.ImageBackgroundStyles(theme)['Screen BG Image'].props}
        source={imageSource(Images['BG'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Screen BG Image'].style,
          dimensions.width
        )}
      />
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* iOS Margin View */}
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
        {/* Header */}
        <View
          {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
              {
                justifyContent: 'space-between',
                paddingLeft: 15,
                paddingRight: 15,
              }
            ),
            dimensions.width
          )}
        >
          {/* Back */}
          <Pressable
            onPress={() => {
              try {
                navigation.goBack();
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            activeOpacity={0.3}
          >
            <View>
              {/* Back Icon */}
              <Icon
                size={24}
                color={palettes.App['Custom Color']}
                name={'Ionicons/chevron-back'}
              />
            </View>
          </Pressable>
          {/* Header Text */}
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                {
                  color: Constants['APP_FONT_COLOR'],
                  fontFamily: 'Rasa_600SemiBold',
                  fontSize: 25,
                }
              ),
              dimensions.width
            )}
          >
            {'Profile'}
          </Text>
          {/* Blank View */}
          <View
            style={StyleSheet.applyWidth(
              { height: 20, width: 20 },
              dimensions.width
            )}
          />
        </View>

        <SimpleStyleKeyboardAwareScrollView
          enableAutomaticScroll={false}
          enableOnAndroid={false}
          enableResetScrollToCoords={false}
          viewIsInsideTabBar={false}
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          style={StyleSheet.applyWidth(
            { paddingBottom: 120 },
            dimensions.width
          )}
        >
          {/* Main View */}
          <View
            style={StyleSheet.applyWidth(
              { flex: 1, justifyContent: 'center', paddingTop: 15 },
              dimensions.width
            )}
          >
            {/* User */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                },
                dimensions.width
              )}
            >
              {/* Placeholder */}
              <>
                {Constants['PROFILE_DETAILS']?.avatar ? null : (
                  <ExpoImage
                    allowDownscaling={true}
                    cachePolicy={'disk'}
                    contentPosition={'center'}
                    resizeMode={'cover'}
                    transitionDuration={300}
                    transitionEffect={'cross-dissolve'}
                    transitionTiming={'ease-in-out'}
                    {...GlobalStyles.ExpoImageStyles(theme)['Image 15'].props}
                    source={imageSource(Images['Placeholder'])}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ExpoImageStyles(theme)['Image 15'].style,
                        { borderRadius: 40, height: 80, width: 80 }
                      ),
                      dimensions.width
                    )}
                  />
                )}
              </>
              <>
                {!Constants['PROFILE_DETAILS']?.avatar ? null : (
                  <ExpoImage
                    allowDownscaling={true}
                    cachePolicy={'disk'}
                    contentPosition={'center'}
                    resizeMode={'cover'}
                    transitionDuration={300}
                    transitionEffect={'cross-dissolve'}
                    transitionTiming={'ease-in-out'}
                    {...GlobalStyles.ExpoImageStyles(theme)['Image 16'].props}
                    source={imageSource(
                      `${Constants['PROFILE_DETAILS']?.avatar?.url}`
                    )}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ExpoImageStyles(theme)['Image 16'].style,
                        { borderRadius: 40, height: 80, width: 80 }
                      ),
                      dimensions.width
                    )}
                  />
                )}
              </>
              <View
                style={StyleSheet.applyWidth(
                  { marginLeft: 14 },
                  dimensions.width
                )}
              >
                {/* name */}
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
                        fontSize: 26,
                        textTransform: 'capitalize',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {Constants['PROFILE_DETAILS']?.name}
                </Text>
                {/* email */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.App['Custom Color'],
                        fontFamily: 'Rasa_300Light',
                        fontSize: 18,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {Constants['PROFILE_DETAILS']?.email}
                </Text>
              </View>
            </View>
            {/* Subscription Status */}
            <View
              style={StyleSheet.applyWidth(
                {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  marginBottom: 12,
                  marginLeft: 20,
                  marginRight: 20,
                  padding: 16,
                },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  },
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  style={StyleSheet.applyWidth(
                    {
                      color: palettes.App['Custom Color'],
                      fontFamily: 'Rasa_500Medium',
                      fontSize: 18,
                      opacity: 0.7,
                    },
                    dimensions.width
                  )}
                >
                  {'Membership'}
                </Text>
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: isSubscribed(Variables)
                        ? '#2ECC71'
                        : isFreeMembership(Variables)
                        ? 'rgba(255,255,255,0.2)'
                        : '#E67E22',
                      borderRadius: 6,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                    },
                    dimensions.width
                  )}
                >
                  <Text
                    accessible={true}
                    selectable={false}
                    style={StyleSheet.applyWidth(
                      {
                        color: palettes.App['Custom Color'],
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 13,
                        letterSpacing: 0.5,
                      },
                      dimensions.width
                    )}
                  >
                    {isSubscribed(Variables)
                      ? 'ACTIVE'
                      : isFreeMembership(Variables)
                      ? 'FREE'
                      : 'CANCELLED'}
                  </Text>
                </View>
              </View>
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: palettes.App['Custom Color'],
                    fontFamily: 'Rasa_400Regular',
                    fontSize: 16,
                  },
                  dimensions.width
                )}
              >
                {Constants['PROFILE_DETAILS']?.subscription_type === 'free'
                  ? 'Free Plan'
                  : (() => {
                      const entitlements =
                        Constants['CUSTOMER_INFO']?.entitlements?.active || {};
                      const keys = Object.keys(entitlements);
                      if (keys.length > 0) {
                        const productId =
                          entitlements[keys[0]]?.productIdentifier || '';
                        if (
                          productId.toLowerCase().includes('annual') ||
                          productId.toLowerCase().includes('yearly')
                        ) {
                          return 'Annual Plan';
                        }
                        return 'Monthly Plan';
                      }
                      return 'Premium Plan';
                    })()}
              </Text>
              <>
                {!(
                  isSubscribed(Variables) &&
                  Object.keys(
                    Constants['CUSTOMER_INFO']?.entitlements?.active || {}
                  ).length > 0 &&
                  Constants['CUSTOMER_INFO']?.entitlements?.active[
                    Object.keys(
                      Constants['CUSTOMER_INFO']?.entitlements?.active
                    )[0]
                  ]?.expirationDate
                ) ? null : (
                  <Text
                    accessible={true}
                    selectable={false}
                    style={StyleSheet.applyWidth(
                      {
                        color: palettes.App['Custom Color'],
                        fontFamily: 'Rasa_300Light',
                        fontSize: 14,
                        marginTop: 4,
                        opacity: 0.7,
                      },
                      dimensions.width
                    )}
                  >
                    {'Renews ' +
                      new Date(
                        Constants['CUSTOMER_INFO']?.entitlements?.active[
                          Object.keys(
                            Constants['CUSTOMER_INFO']?.entitlements?.active
                          )[0]
                        ]?.expirationDate
                      ).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                  </Text>
                )}
              </>
              <>
                {!(!isSubscribed(Variables) &&
                  !isFreeMembership(Variables)) ? null : (
                  <Text
                    accessible={true}
                    selectable={false}
                    style={StyleSheet.applyWidth(
                      {
                        color: '#E67E22',
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 14,
                        marginTop: 4,
                      },
                      dimensions.width
                    )}
                  >
                    {'Your subscription has ended. Resubscribe to restore access.'}
                  </Text>
                )}
              </>
            </View>
            {/* Update Profile */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('BottomTabNavigator', {
                    screen: 'MoreStack',
                    params: { screen: 'UpdateProfileScreen' },
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    GlobalStyles.TextStyles(theme)['Menu Name'].style,
                    dimensions.width
                  )}
                >
                  {'Update Profile'}
                </Text>
                {/* arrow 6 */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Share Trident Mindset  */}
            <>
              {!Constants['GUEST_PASS_URL'] ? null : (
                <Pressable
                  onPress={() => {
                    try {
                      setVisibleModalGift(true);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  activeOpacity={0.3}
                >
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: palettes.App.Outline,
                        flexDirection: 'row',
                        height: 60,
                        justifyContent: 'space-between',
                        paddingLeft: 20,
                        paddingRight: 10,
                      },
                      dimensions.width
                    )}
                  >
                    <View>
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.App['Custom Color'],
                              fontFamily: 'Rasa_400Regular',
                              fontSize: 20,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Share Trident Mindset '}
                      </Text>
                      {/* Text 2 */}
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.App['Custom Color'],
                              fontFamily: 'Rasa_400Regular',
                              fontSize: 16,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Give a free month of unlimited access'}
                      </Text>
                    </View>
                    {/* arrow 6 */}
                    <Icon
                      size={24}
                      color={palettes.App['Custom Color']}
                      name={'Feather/chevron-right'}
                      style={StyleSheet.applyWidth(
                        { opacity: 0.6 },
                        dimensions.width
                      )}
                    />
                  </View>
                </Pressable>
              )}
            </>
            {/* Re-onboarding */}
            <>
              {!(Constants['PROFILE_DETAILS']?.is_test_user === true) ? null : (
                <Pressable
                  onPress={() => {
                    try {
                      if (navigation.canGoBack()) {
                        navigation.popToTop();
                      }
                      navigation.replace('OnboardingStep4Screen', {});
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  activeOpacity={0.3}
                >
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderColor: palettes.App.Outline,
                        flexDirection: 'row',
                        height: 60,
                        justifyContent: 'space-between',
                        paddingLeft: 20,
                        paddingRight: 10,
                      },
                      dimensions.width
                    )}
                  >
                    <View>
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.App['Custom Color'],
                              fontFamily: 'Rasa_400Regular',
                              fontSize: 20,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Re-Onboarding'}
                      </Text>
                      {/* Text 2 */}
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: theme.colors.text.danger,
                              fontFamily: 'Rasa_400Regular',
                              fontSize: 16,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Tester only'}
                      </Text>
                    </View>
                    {/* arrow 6 */}
                    <Icon
                      size={24}
                      color={palettes.App['Custom Color']}
                      name={'Feather/chevron-right'}
                      style={StyleSheet.applyWidth(
                        { opacity: 0.6 },
                        dimensions.width
                      )}
                    />
                  </View>
                </Pressable>
              )}
            </>
            {/* Submit a question for Trident's Founders */}
            <Pressable
              onPress={() => {
                try {
                  setVisibleModalQAndA(true);
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {"Submit a question for Trident's Founders"}
                </Text>
                {/* arrow 6 */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Retake Quiz */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('OnboardingStep2Screen', {
                    retakeQuizFlow: true,
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'Retake Quiz'}
                </Text>
                {/* arrow 6 */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Redeem Code */}
            <>
              {Constants['PROFILE_DETAILS']?.code ? null : (
                <Pressable
                  onPress={() => {
                    try {
                      navigation.navigate('TridentForTeamsScreen', {});
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  activeOpacity={0.3}
                >
                  <View
                    {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ViewStyles(theme)['Menu View'].style,
                        { borderColor: palettes.App.Outline, height: 55 }
                      ),
                      dimensions.width
                    )}
                  >
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Menu Name'].style,
                          { marginLeft: null }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Redeem code'}
                    </Text>
                    {/* arrow 6 */}
                    <Icon
                      size={24}
                      color={palettes.App['Custom Color']}
                      name={'Feather/chevron-right'}
                      style={StyleSheet.applyWidth(
                        { opacity: 0.6 },
                        dimensions.width
                      )}
                    />
                  </View>
                </Pressable>
              )}
            </>
            {/* Favorites */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('FavoritesScreen', {});
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'Favorites'}
                </Text>
                {/* arrow */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Downloads */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('BottomTabNavigator', {
                    screen: 'MoreStack',
                    params: { screen: 'DownloadedLessonsScreen' },
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'Downloads'}
                </Text>
                {/* arrow */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Activity History */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('ActivityHistoryScreen', {});
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'Activity History'}
                </Text>
                {/* arrow */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* FAQs */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('BottomTabNavigator', {
                    screen: 'MoreStack',
                    params: { screen: 'FAQsScreen' },
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'FAQs'}
                </Text>
                {/* arrow */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Privacy Policy */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('WebPagesScreen', {
                    URL: Constants['PRIVACY_POLICY'],
                    screenHeading: 'Privacy Policy',
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'Privacy Policy'}
                </Text>
                {/* arrow */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Cancel Subscription */}
            <>
              {!(
                !isFreeMembership(Variables) && isSubscribed(Variables)
              ) ? null : (
                <Pressable
                  onPress={() => {
                    try {
                      if (Platform.OS === 'ios') {
                        Linking.openURL(
                          `${Constants['IOS_CANCEL_SUBSCRIPTION']}`
                        );
                      }
                      if (Platform.OS === 'android') {
                        Linking.openURL(
                          `${Constants['ANDROID_CANCEL_SUBSCRIPTION']}`
                        );
                      }
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  activeOpacity={0.3}
                >
                  <View
                    {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ViewStyles(theme)['Menu View'].style,
                        { borderColor: palettes.App.Outline, height: 55 }
                      ),
                      dimensions.width
                    )}
                  >
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Menu Name'].style,
                          { marginLeft: null }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Cancel Subscription'}
                    </Text>
                    {/* arrow */}
                    <Icon
                      size={24}
                      color={palettes.App['Custom Color']}
                      name={'Feather/chevron-right'}
                      style={StyleSheet.applyWidth(
                        { opacity: 0.6 },
                        dimensions.width
                      )}
                    />
                  </View>
                </Pressable>
              )}
            </>
            {/* Terms and Conditions */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('WebPagesScreen', {
                    URL: Constants['TERMS_OF_USE'],
                    screenHeading: 'Terms and Conditions',
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'Terms and Conditions'}
                </Text>
                {/* arrow */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Rate us */}
            <Pressable
              onPress={() => {
                try {
                  if (Platform.OS === 'ios') {
                    Linking.openURL(
                      'itms-apps://itunes.apple.com/app/viewContentsUserReviews/id1616593368?action=write-review'
                    );
                  } else {
                  }

                  if (Platform.OS === 'android') {
                    Linking.openURL(
                      'market://details?id=com.pikwxwpq5b1i.plgj6rakapp&showAllReviews=true'
                    );
                  } else {
                  }
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ViewStyles(theme)['Menu View'].style,
                    { borderColor: palettes.App.Outline, height: 55 }
                  ),
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Menu Name'].style,
                      { marginLeft: null }
                    ),
                    dimensions.width
                  )}
                >
                  {'Rate us'}
                </Text>
                {/* arrow */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Feather/chevron-right'}
                  style={StyleSheet.applyWidth(
                    { opacity: 0.6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
            {/* Logout */}
            <Button
              accessible={true}
              iconPosition={'left'}
              onPress={() => {
                try {
                  setShowLogOutModal(true);
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
              activeOpacity={0.3}
              icon={'AntDesign/logout'}
              iconSize={22}
              loading={Boolean(isLoading)}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                  {
                    backgroundColor: theme.colors.background.danger,
                    borderBottomLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    borderBottomRightRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    borderTopLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    borderTopRightRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 21,
                    marginLeft: 15,
                    marginRight: 15,
                    marginTop: 10,
                    paddingTop: 2,
                  }
                ),
                dimensions.width
              )}
              title={'  LOG OUT'}
            />
          </View>
        </SimpleStyleKeyboardAwareScrollView>
      </View>
      {/* Logout Modal */}
      <Modal
        animationType={'none'}
        supportedOrientations={['portrait', 'landscape']}
        presentationStyle={'overFullScreen'}
        transparent={true}
        visible={Boolean(showLogOutModal)}
      >
        <BlurView
          experimentalBlurMethod={'none'}
          intensity={50}
          tint={'default'}
          {...GlobalStyles.BlurViewStyles(theme)['Blur View'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.BlurViewStyles(theme)['Blur View'].style,
              {
                bottom: 0,
                left: 0,
                opacity: 0.8,
                position: 'absolute',
                right: 0,
                top: 0,
              }
            ),
            dimensions.width
          )}
        />
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: palettes.App['Custom Color'],
                borderRadius: 8,
                overflow: 'hidden',
                padding: 16,
                paddingBottom: 0,
                width: 300,
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
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 24,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Log Out'}
            </Text>
            {/* message */}
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    fontFamily: 'Rasa_400Regular',
                    fontSize: 18,
                    marginTop: 12,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Are you sure to log out from app?'}
            </Text>
            {/* CTAs */}
            <View
              style={StyleSheet.applyWidth(
                {
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                  flexDirection: 'row',
                  height: 50,
                  justifyContent: 'space-between',
                  marginLeft: -16,
                  marginRight: -16,
                  marginTop: 15,
                },
                dimensions.width
              )}
            >
              {/* Cancel */}
              <Pressable
                onPress={() => {
                  try {
                    setShowLogOutModal(false);
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                activeOpacity={0.3}
                style={StyleSheet.applyWidth(
                  { height: '100%', width: '50%' },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      borderRightWidth: 1,
                      height: '100%',
                      justifyContent: 'center',
                      width: '100%',
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
                        { fontFamily: 'Rasa_500Medium', fontSize: 20 }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Cancel'}
                  </Text>
                </View>
              </Pressable>
              {/* Log out */}
              <Pressable
                onPress={() => {
                  const handler = async () => {
                    try {
                      await setGlobalVariableValue({
                        key: 'APPLIED_REDEEM_CODE',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'AUTH_TOKEN',
                        value: '',
                      });
                      await setGlobalVariableValue({
                        key: 'PROFILE_DETAILS',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'ANONYMOUS_ID',
                        value: '',
                      });
                      await setGlobalVariableValue({
                        key: 'QUIZ_ANSWERS',
                        value: [],
                      });
                      await setGlobalVariableValue({
                        key: 'ONBOARDING_FIRST_LESSON',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'CUSTOMER_INFO',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'SHOW_LESSON_PLAYER',
                        value: false,
                      });
                      await Player_StopPlay(setGlobalVariableValue);
                      setShowLogOutModal(false);
                      await setGlobalVariableValue({
                        key: 'SHOW_LEFTOFF_MODAL',
                        value: false,
                      });
                      await setGlobalVariableValue({
                        key: 'GUEST_PASS_URL',
                        value: null,
                      });
                      setUserSentry(null);
                      if (navigation.canGoBack()) {
                        navigation.popToTop();
                      }
                      navigation.replace('Auth', {
                        screen: '',
                        params: { handleFromLogout: true },
                      });
                      await setGlobalVariableValue({
                        key: 'UPCOMING_ADVANCE_ID',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'INITIALIZE_HOMESCREEN',
                        value: true,
                      });
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  };
                  handler();
                }}
                activeOpacity={0.3}
                style={StyleSheet.applyWidth(
                  { height: '100%', width: '50%' },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'center',
                      width: '100%',
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
                          color: theme.colors.background.danger,
                          fontFamily: 'Rasa_600SemiBold',
                          fontSize: 20,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Log Out'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <ModalGiftSubscriptionBlock
        onClose={() => {
          try {
            setVisibleModalGift(false);
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
        visible={visibleModalGift}
      />
      <ModalQAndABlock
        onClose={() => {
          try {
            setVisibleModalQAndA(false);
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
        visible={visibleModalQAndA}
      />
    </ScreenContainer>
  );
};

export default withTheme(ProfileScreen);
