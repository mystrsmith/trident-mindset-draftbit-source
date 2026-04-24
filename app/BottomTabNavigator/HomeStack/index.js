import React from 'react';
import {
  CircularProgress,
  Icon,
  IconButton,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  SimpleStyleScrollView,
  TextInput,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import CommonLoadingBlock from '../../../components/CommonLoadingBlock';
import DashboardInfoBlock from '../../../components/DashboardInfoBlock';
import ModalGiftSubscriptionBlock from '../../../components/ModalGiftSubscriptionBlock';
import ModalQAndABlock from '../../../components/ModalQAndABlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as CommonPackages from '../../../custom-files/CommonPackages';
import * as CustomCode from '../../../custom-files/CustomCode';
import * as CustomHighlightText from '../../../custom-files/CustomHighlightText';
import * as CustomStarRating from '../../../custom-files/CustomStarRating';
import * as CustomStatusBar from '../../../custom-files/CustomStatusBar';
import * as CustomTacticsList from '../../../custom-files/CustomTacticsList';
import * as DismissKeyboardView from '../../../custom-files/DismissKeyboardView';
import * as ExpoImage from '../../../custom-files/ExpoImage';
import calculateTacticProgress from '../../../global-functions/calculateTacticProgress';
import delaySeconds from '../../../global-functions/delaySeconds';
import getCurrentAppVersion from '../../../global-functions/getCurrentAppVersion';
import getLastSessionAtUTC from '../../../global-functions/getLastSessionAtUTC';
import getMetaAppData from '../../../global-functions/getMetaAppData';
import getPlatformOS from '../../../global-functions/getPlatformOS';
import getRevCatCustomerInfo from '../../../global-functions/getRevCatCustomerInfo';
import getTimezone from '../../../global-functions/getTimezone';
import loginOneSignal from '../../../global-functions/loginOneSignal';
import loginRevenueCat from '../../../global-functions/loginRevenueCat';
import requestOneSignalPushNotificationPermission from '../../../global-functions/requestOneSignalPushNotificationPermission';
import setAppsflyerUserId from '../../../global-functions/setAppsflyerUserId';
import setUserDataFacebook from '../../../global-functions/setUserDataFacebook';
import setUserIdFacebook from '../../../global-functions/setUserIdFacebook';
import setUserSentry from '../../../global-functions/setUserSentry';
import palettes from '../../../themes/palettes';
import * as Utils from '../../../utils';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import getPushTokenUtil from '../../../utils/getPushToken';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const HomeScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [dailyTrackers, setDailyTrackers] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [feedbackContent, setFeedbackContent] = React.useState('');
  const [feedbackStarRating, setFeedbackStarRating] = React.useState(0);
  const [isFocusSearchInput, setIsFocusSearchInput] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastLeftOff, setLastLeftOff] = React.useState(null);
  const [password, setPassword] = React.useState('');
  const [refreshingIndex, setRefreshingIndex] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTermDebounce, setSearchTermDebounce] = React.useState('');
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const [showLogOutModal, setShowLogOutModal] = React.useState(false);
  const [visibleFeedackModal, setVisibleFeedackModal] = React.useState(false);
  const [visibleModalCollectQAndA, setVisibleModalCollectQAndA] =
    React.useState(false);
  const [visibleModalDailyTracker, setVisibleModalDailyTracker] =
    React.useState(false);
  const [visibleModalFeedback, setVisibleModalFeedback] = React.useState(false);
  const [visibleModalGiftSubscription, setVisibleModalGiftSubscription] =
    React.useState(false);
  const [visibleModalPickUpLeftOff, setVisibleModalPickUpLeftOff] =
    React.useState(false);
  const [visibleModalSearchLessons, setVisibleModalSearchLessons] =
    React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState('');
  const getCoreProgramTactics = data => {
    return data.filter(item => item?.type === 'core_program');
  };

  const getNormalProgramTactics = data => {
    return data.filter(item => item?.type !== 'core_program');
  };

  const onPressCloseModalDailyTracker = () => {
    setVisibleModalDailyTracker(false);
    setDailyTrackers([]);

    if (
      Variables?.LAST_LEFTOFF_LESSON?.last_lesson != null &&
      Variables?.LAST_LEFTOFF_LESSON?.next_lesson != null
    ) {
      // setVisibleModalPickUpLeftOff(true)
      setGlobalVariableValue({
        key: 'SHOW_LEFTOFF_MODAL',
        value: true,
      });
    }

    // if (lastLeftOff?.last_lesson != null && lastLeftOff?.next_lesson != null) {
    //     // setVisibleModalPickUpLeftOff(true)
    //       setGlobalVariableValue({
    //         key: "SHOW_LEFTOFF_MODAL",
    //         value: true,
    //       });
    // }
  };

  const shouldShowDailyTracker = dailyTrackers => {
    if (dailyTrackers === null || dailyTrackers === undefined) {
      return false;
    }
    if (dailyTrackers?.length === 0) {
      return true;
    }
    const moment = CommonPackages?.moment;

    const currentLocalDate = moment();
    const currentLocalDay = currentLocalDate.format('ddd');

    for (const item of dailyTrackers) {
      const createdAtDate = moment(item?.created_at);
      const createdAtLocalDay = createdAtDate.format('ddd');
      if (currentLocalDay === createdAtLocalDay) {
        return false;
      }
    }
    return true;
  };
  React.useEffect(() => {
    async function requestTrackingPermission() {
      const ExpoTrackingTransparency = CommonPackages?.ExpoTrackingTransparency;
      const result =
        await ExpoTrackingTransparency?.requestTrackingPermissionsAsync();
      if (result?.status === 'granted') {
        console.log('Yay! I have user permission to track data');
        const FBSdk = CommonPackages?.FBSdk;
        FBSdk.Settings.setAutoLogAppEventsEnabled(true);
        FBSdk.Settings.setAdvertiserIDCollectionEnabled(true);
        FBSdk.Settings.setAdvertiserTrackingEnabled(true);
      }
    }

    requestTrackingPermission();

    const Application = CommonPackages?.Application;
    const semver = CommonPackages?.semver;
    const Linking = CommonPackages?.Linking;

    async function checkLastLeftOff() {
      const resultLastLeftOff = (
        await XanoBackendApi.checkLastLeftOffGET(Constants)
      )?.json;
      setGlobalVariableValue({
        key: 'LAST_LEFTOFF_LESSON',
        value: resultLastLeftOff,
      });
      await delaySeconds(1000);
      if (
        resultLastLeftOff?.last_lesson != null &&
        resultLastLeftOff?.next_lesson != null
      ) {
        setGlobalVariableValue({
          key: 'SHOW_LEFTOFF_MODAL',
          value: true,
        });
      }
    }

    async function checkAppVersion() {
      const resultVersions = (
        await XanoBackendApi.getPlatformVersionsGET(Constants)
      )?.json;
      if (!resultVersions) {
        return;
      }
      const currentAppVersion = Application.nativeApplicationVersion;
      const currentPlatformLog = resultVersions.find(
        version => version.platform === Platform.OS
      );
      if (currentPlatformLog) {
        const storeUrl = currentPlatformLog?.store_url;
        const needCheckVersion = currentPlatformLog?.version;
        const releasedType = semver.diff(currentAppVersion, needCheckVersion);
        const needUpdate = semver.lt(currentAppVersion, needCheckVersion);

        if (needUpdate === false) {
          const resultCheckFeatureAnnouncement = (
            await XanoBackendApi.checkFeatureAnnouncementPOST(Constants, {
              current_version: currentAppVersion,
              platform: Platform.OS,
            })
          )?.json;
          if (resultCheckFeatureAnnouncement !== null) {
            setGlobalVariableValue({
              key: 'feature_announcement',
              value: resultCheckFeatureAnnouncement,
            });
          } else {
            checkLastLeftOff();
            setGlobalVariableValue({
              key: 'INITIALIZE_HOMESCREEN',
              value: false,
            });
          }
          return;
        } else {
          checkLastLeftOff();
          setGlobalVariableValue({
            key: 'INITIALIZE_HOMESCREEN',
            value: false,
          });
        }
        if (releasedType === 'major') {
          return Alert.alert(
            'Update Available',
            'We released a new version of the app. Please update for an improved experience.',
            [
              {
                text: 'Update Now',
                onPress: () => Linking.openURL(storeUrl),
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert(
            'Update Available',
            'We released a new version of the app. Please update for an improved experience.',
            [
              {
                text: 'Update Now',
                onPress: () => Linking.openURL(storeUrl),
              },
              {
                text: 'Later',
                onPress: () => console.log('Later Pressed'),
                style: 'cancel',
              },
            ]
          );
        }
      } else {
        console.warn('Platform version not found');
      }
    }
    checkAppVersion();
  }, []);
  const xanoBackendSetUserAttributePOST =
    XanoBackendApi.useSetUserAttributePOST();
  const xanoBackendUpdateTimezonePATCH =
    XanoBackendApi.useUpdateTimezonePATCH();
  const xanoBackendUpdateUserMetaAppDataPATCH =
    XanoBackendApi.useUpdateUserMetaAppDataPATCH();
  const xanoBackendSkipFeedbackPATCH = XanoBackendApi.useSkipFeedbackPATCH();
  const xanoBackendCreateFeedbackPOST = XanoBackendApi.useCreateFeedbackPOST();
  React.useEffect(() => {
    const handler = async () => {
      try {
        await requestOneSignalPushNotificationPermission();
        const newPushToken = await getPushTokenUtil({
          permissionErrorMessage:
            'Sorry, we need notifications permissions to make this work.',
          deviceErrorMessage:
            'Must use physical device for Push Notifications.',
          showAlertOnPermissionError: false,
          showAlertOnDeviceError: false,
        });

        loginOneSignal(Constants['PROFILE_DETAILS']?.id);
        (
          await XanoBackendApi.updatePushTokenPOST(Constants, {
            push_token: newPushToken,
          })
        )?.json;
        (
          await xanoBackendSetUserAttributePOST.mutateAsync({
            key: 'last_session_at',
            value: getLastSessionAtUTC(),
          })
        )?.json;
        (
          await xanoBackendSetUserAttributePOST.mutateAsync({
            key: 'device_type',
            value: getPlatformOS(),
          })
        )?.json;
        (
          await xanoBackendSetUserAttributePOST.mutateAsync({
            key: 'app_version ',
            value: getCurrentAppVersion(),
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
        const resultMeData = (await XanoBackendApi.authMeGET(Constants))?.json;
        if (resultMeData?.message?.length > 0) {
          await setGlobalVariableValue({
            key: 'AUTH_TOKEN',
            value: '',
          });
          await setGlobalVariableValue({
            key: 'PROFILE_DETAILS',
            value: null,
          });
          if (navigation.canGoBack()) {
            navigation.popToTop();
          }
          navigation.replace('Auth', { screen: '' });
          if (true) {
            return;
          }
        } else {
        }

        setRefreshingIndex(refreshingIndex + 1);
        await setGlobalVariableValue({
          key: 'PROFILE_DETAILS',
          value: resultMeData,
        });
        const shouldShowOnboarding = (
          await XanoBackendApi.checkShouldShowOnboardingGET(Constants)
        )?.json;
        if (shouldShowOnboarding === true) {
          if (Constants['ONBOARDING_FIRST_LESSON'] !== null) {
            navigation.push('OnboardingPlayerScreen', {});
            if (true) {
              return;
            }
          } else {
          }

          if (Constants['QUIZ_ANSWERS']?.length) {
            navigation.push('OnboardingStep3Screen', { retakeQuizFlow: false });
            if (true) {
              return;
            }
          } else {
          }

          navigation.push('OnboardingStep2Screen', {
            retakeQuizFlow: false,
            displayStep4: true,
            hideCloseButton: true,
          });
          if (true) {
            return;
          }
        } else {
        }

        const timezone = getTimezone();
        (
          await xanoBackendUpdateTimezonePATCH.mutateAsync({
            timezone: timezone,
          })
        )?.json;
        const getGuestPassUrl = (
          await XanoBackendApi.guestPassCodeLinkGET(Constants)
        )?.json;
        const status = getGuestPassUrl?.status;
        if (status === 'success') {
          await setGlobalVariableValue({
            key: 'GUEST_PASS_URL',
            value: getGuestPassUrl?.url,
          });
        } else {
        }

        setUserIdFacebook(resultMeData?.id);
        setUserDataFacebook(resultMeData);
        setUserSentry(resultMeData?.id);
        setAppsflyerUserId(resultMeData?.id);
        const resultAppConfig = (
          await XanoBackendApi.getAppConfigGET(Constants, {
            user_id: resultMeData?.id,
          })
        )?.json;
        const should_show_collect_q_and_a =
          resultAppConfig?.show_collect_q_and_a;
        console.log(resultAppConfig);
        await setGlobalVariableValue({
          key: 'APP_CONFIG',
          value: resultAppConfig,
        });
        await loginRevenueCat(setGlobalVariableValue, resultMeData?.id);
        loginOneSignal(resultMeData?.id);
        await getRevCatCustomerInfo(setGlobalVariableValue);
        if (should_show_collect_q_and_a === true) {
          setVisibleModalCollectQAndA(true);
        } else {
        }

        const resultFeedback = (
          await XanoBackendApi.checkFeedbackGET(Constants)
        )?.json;
        if (resultFeedback === true) {
          setVisibleModalFeedback(true);
        } else {
        }

        const metaAppData = await getMetaAppData();
        (
          await xanoBackendUpdateUserMetaAppDataPATCH.mutateAsync({
            meta_app_data: metaAppData,
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
      <Utils.CustomCodeErrorBoundary>
        <CustomStatusBar.Component theme={theme} />
      </Utils.CustomCodeErrorBoundary>
      <ImageBackground
        resizeMode={'cover'}
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        source={imageSource(Images['BG'])}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
            {
              bottom: 0,
              left: 0,
              opacity: 0.5,
              position: 'absolute',
              right: 0,
              top: 0,
            }
          ),
          dimensions.width
        )}
      />
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* Header */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: safeAreaInsets.top + 5,
            },
            dimensions.width
          )}
        >
          {/* Search Button */}
          <IconButton
            onPress={() => {
              try {
                setSearchTerm('');
                setVisibleModalSearchLessons(true);
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            color={palettes.Brand.Surface}
            icon={'Feather/search'}
            size={28}
          />
          <IconButton
            onPress={() => {
              try {
                navigation.navigate('InformationScreen', {});
                /* hidden 'Navigate' action */
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            color={palettes.Brand.Surface}
            icon={'Entypo/info-with-circle'}
            size={25}
          />
        </View>
        <Utils.CustomCodeErrorBoundary>
          <CustomTacticsList.Index
            Constants={Constants}
            dimensions={dimensions}
            getNormalProgramTactics={getNormalProgramTactics}
            navigation={navigation}
            refreshingIndex={refreshingIndex}
            setGlobalVariableValue={setGlobalVariableValue}
            setVisibleModalGiftSubscription={setVisibleModalGiftSubscription}
            theme={theme}
          />
        </Utils.CustomCodeErrorBoundary>
      </View>
      <ModalQAndABlock
        onClose={() => {
          try {
            setVisibleModalCollectQAndA(false);
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
        visible={visibleModalCollectQAndA}
      />
      {/* Modal Search Lessons */}
      <>
        {!visibleModalSearchLessons ? null : (
          <View
            style={StyleSheet.applyWidth(
              { height: '100%', position: 'absolute', width: '100%' },
              dimensions.width
            )}
          >
            {/* Overlay */}
            <View
              style={StyleSheet.applyWidth(
                {
                  backgroundColor: palettes.Brand.Background,
                  height: '100%',
                  position: 'absolute',
                  width: '100%',
                },
                dimensions.width
              )}
            />
            {/* Container */}
            <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
              {/* Header */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 20,
                    paddingTop: safeAreaInsets.top + 5,
                  },
                  dimensions.width
                )}
              >
                {/* Back */}
                <IconButton
                  onPress={() => {
                    try {
                      setVisibleModalSearchLessons(false);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  color={palettes.Brand.Surface}
                  icon={'Ionicons/chevron-back'}
                  size={28}
                />
                {/* Search Bar */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      borderColor: palettes.App.Outline,
                      borderRadius: 12,
                      borderWidth: 1,
                      flex: 1,
                      flexDirection: 'row',
                      marginLeft: 10,
                      opacity: 1,
                      paddingBottom: 8,
                      paddingLeft: 15,
                      paddingRight: 15,
                      paddingTop: 8,
                    },
                    dimensions.width
                  )}
                >
                  <View
                    style={StyleSheet.applyWidth(
                      { flex: 1, gap: 1 },
                      dimensions.width
                    )}
                  >
                    {/* Search Input */}
                    <TextInput
                      onBlur={() => {
                        const textInputValue = undefined;
                        try {
                          setIsFocusSearchInput(false);
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      onChangeText={newSearchInputValue => {
                        const textInputValue = newSearchInputValue;
                        try {
                          if (!newSearchInputValue) {
                            setSearchTermDebounce('');
                          } else {
                          }

                          setSearchTerm(newSearchInputValue);
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      onChangeTextDelayed={newSearchInputValue => {
                        const textInputValue = newSearchInputValue;
                        try {
                          setSearchTermDebounce(newSearchInputValue);
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      onFocus={() => {
                        const textInputValue = undefined;
                        try {
                          setIsFocusSearchInput(true);
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      onSubmitEditing={() => {
                        const textInputValue = undefined;
                        try {
                          if (searchTerm?.length === 0) {
                            if (true) {
                              return;
                            }
                          } else {
                          }
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      webShowOutline={true}
                      {...GlobalStyles.TextInputStyles(theme)['Text Input']
                        .props}
                      autoCapitalize={'none'}
                      autoComplete={'off'}
                      autoCorrect={false}
                      autoFocus={true}
                      changeTextDelay={250}
                      placeholder={'Search'}
                      placeholderTextColor={palettes.Brand.Surface}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextInputStyles(theme)['Text Input']
                            .style,
                          {
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            borderBottomWidth: 0,
                            borderLeftWidth: 0,
                            borderRadius: 0,
                            borderRightWidth: 0,
                            color: palettes.Brand.Surface,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 20,
                            paddingBottom: 6,
                            paddingLeft: 4,
                            paddingTop: 6,
                          }
                        ),
                        dimensions.width
                      )}
                      value={searchTerm}
                    />
                  </View>
                  <>
                    {!(searchTerm?.length > 0) ? null : (
                      <IconButton
                        onPress={() => {
                          try {
                            setSearchTerm('');
                            setSearchTermDebounce('');
                            setIsFocusSearchInput(false);
                          } catch (err) {
                            Sentry.captureException(err);
                            console.error(err);
                          }
                        }}
                        color={palettes.Brand.Surface}
                        hitSlop={10}
                        icon={'EvilIcons/close-o'}
                        size={32}
                        style={StyleSheet.applyWidth(
                          { position: 'absolute', right: 7 },
                          dimensions.width
                        )}
                      />
                    )}
                  </>
                </View>
              </View>
              <Utils.CustomCodeErrorBoundary>
                <DismissKeyboardView.Index style={{ flex: 1 }}>
                  <>
                    {!(searchTerm?.length > 0) ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          { flex: 1 },
                          dimensions.width
                        )}
                      >
                        <XanoBackendApi.FetchSearchLessonsGET
                          search_term={searchTerm}
                        >
                          {({ loading, error, data, refetchSearchLessons }) => {
                            const fetchData = data?.json;
                            if (loading) {
                              return <CommonLoadingBlock />;
                            }

                            if (
                              error ||
                              data?.status < 200 ||
                              data?.status >= 300
                            ) {
                              return <ActivityIndicator />;
                            }

                            return (
                              <SimpleStyleFlatList
                                data={fetchData?.items}
                                decelerationRate={'normal'}
                                horizontal={false}
                                inverted={false}
                                keyExtractor={(listData, index) =>
                                  listData?.id ??
                                  listData?.uuid ??
                                  index?.toString() ??
                                  JSON.stringify(listData)
                                }
                                keyboardShouldPersistTaps={'never'}
                                listKey={
                                  'Modal Search Lessons->Container->Custom Code->View->Fetch->List'
                                }
                                nestedScrollEnabled={false}
                                numColumns={1}
                                onEndReachedThreshold={0.5}
                                pagingEnabled={false}
                                renderItem={({ item, index }) => {
                                  const listData = item;
                                  return (
                                    <>
                                      <View />
                                      {/* Lesson Note Item */}
                                      <Pressable
                                        onPress={() => {
                                          try {
                                            navigation.navigate(
                                              'LessonDetailsScreen',
                                              { lesson_id: listData?.id }
                                            );
                                          } catch (err) {
                                            Sentry.captureException(err);
                                            console.error(err);
                                          }
                                        }}
                                      >
                                        <View
                                          {...GlobalStyles.ViewStyles(theme)[
                                            'Menu View'
                                          ].props}
                                          style={StyleSheet.applyWidth(
                                            StyleSheet.compose(
                                              GlobalStyles.ViewStyles(theme)[
                                                'Menu View'
                                              ].style,
                                              {
                                                borderColor:
                                                  palettes.App.Outline,
                                                height: null,
                                                paddingBottom: 15,
                                                paddingTop: 15,
                                              }
                                            ),
                                            dimensions.width
                                          )}
                                        >
                                          {/* Image Wrapper */}
                                          <View
                                            style={StyleSheet.applyWidth(
                                              {
                                                borderColor:
                                                  palettes.App[
                                                    'App Buttons Color'
                                                  ],
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                height: 60,
                                                overflow: 'hidden',
                                                width: 60,
                                              },
                                              dimensions.width
                                            )}
                                          >
                                            <Utils.CustomCodeErrorBoundary>
                                              <ExpoImage.Index
                                                source={imageSource(
                                                  `${item?.tactic?.photo?.url}`
                                                )}
                                                contentFit="cover"
                                                transition={1000}
                                                borderRadius={15}
                                              />
                                            </Utils.CustomCodeErrorBoundary>
                                          </View>

                                          <View
                                            style={StyleSheet.applyWidth(
                                              {
                                                flex: 1,
                                                gap: 3,
                                                paddingLeft: 15,
                                                paddingRight: 15,
                                              },
                                              dimensions.width
                                            )}
                                          >
                                            {/* Tactic title */}
                                            <Text
                                              accessible={true}
                                              selectable={false}
                                              {...GlobalStyles.TextStyles(
                                                theme
                                              )['Menu Name'].props}
                                              style={StyleSheet.applyWidth(
                                                StyleSheet.compose(
                                                  GlobalStyles.TextStyles(
                                                    theme
                                                  )['Menu Name'].style,
                                                  {
                                                    fontFamily:
                                                      'Rasa_600SemiBold',
                                                    fontSize: 22,
                                                    marginLeft: null,
                                                    paddingTop: 3,
                                                  }
                                                ),
                                                dimensions.width
                                              )}
                                            >
                                              {listData?.tactic?.title}
                                            </Text>
                                            {/* Lesson Title */}
                                            <Text
                                              accessible={true}
                                              selectable={false}
                                              {...GlobalStyles.TextStyles(
                                                theme
                                              )['Menu Name'].props}
                                              style={StyleSheet.applyWidth(
                                                StyleSheet.compose(
                                                  GlobalStyles.TextStyles(
                                                    theme
                                                  )['Menu Name'].style,
                                                  {
                                                    fontFamily:
                                                      'Rasa_600SemiBold',
                                                    fontSize: 22,
                                                    marginLeft: null,
                                                  }
                                                ),
                                                dimensions.width
                                              )}
                                            >
                                              {listData?.title}
                                            </Text>
                                            <Utils.CustomCodeErrorBoundary>
                                              <CustomHighlightText.Index
                                                searchTerm={searchTerm}
                                                textContent={
                                                  listData?.text_content
                                                }
                                              />
                                            </Utils.CustomCodeErrorBoundary>
                                          </View>
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
                                    </>
                                  );
                                }}
                                showsHorizontalScrollIndicator={true}
                                showsVerticalScrollIndicator={true}
                                snapToAlignment={'start'}
                                style={StyleSheet.applyWidth(
                                  { flex: 1, paddingBottom: 100 },
                                  dimensions.width
                                )}
                              />
                            );
                          }}
                        </XanoBackendApi.FetchSearchLessonsGET>
                      </View>
                    )}
                  </>
                </DismissKeyboardView.Index>
              </Utils.CustomCodeErrorBoundary>
            </View>
          </View>
        )}
      </>
      <ModalGiftSubscriptionBlock
        onClose={() => {
          try {
            setVisibleModalGiftSubscription(false);
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
        visible={visibleModalGiftSubscription}
      />
      {/* Modal Feedback 2 */}
      <Modal
        animationType={'none'}
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={Boolean(visibleModalFeedback)}
      >
        {/* Overlay */}
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: palettes.App.Overlay,
              height: '100%',
              position: 'absolute',
              width: '100%',
            },
            dimensions.width
          )}
        />
        <BlurView
          experimentalBlurMethod={'none'}
          {...GlobalStyles.BlurViewStyles(theme)['Blur View'].props}
          intensity={25}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.BlurViewStyles(theme)['Blur View'].style,
              { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }
            ),
            dimensions.width
          )}
          tint={'dark'}
        />
        <SimpleStyleKeyboardAwareScrollView
          enableAutomaticScroll={false}
          enableOnAndroid={false}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps={'never'}
          showsVerticalScrollIndicator={true}
          viewIsInsideTabBar={false}
          style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
        >
          {/* Content */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                top: -100,
              },
              dimensions.width
            )}
          >
            <>
              {showFeedbackForm ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: theme.colors.background.brand,
                      borderColor: palettes.App['App Buttons Color'],
                      borderRadius: 8,
                      borderWidth: 1,
                      justifyContent: 'center',
                      overflow: 'hidden',
                      paddingTop: 20,
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
                          color: palettes.Brand.Surface,
                          fontFamily: 'Poppins_600SemiBold',
                          fontSize: 19,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Is Trident Mindset helping you?'}
                  </Text>

                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        justifyContent: 'center',
                        marginBottom: 10,
                        marginTop: 15,
                      },
                      dimensions.width
                    )}
                  >
                    <Utils.CustomCodeErrorBoundary>
                      <CustomStarRating.Index
                        {...{
                          theme,
                          feedbackStarRating,
                          setFeedbackStarRating,
                        }}
                      />
                    </Utils.CustomCodeErrorBoundary>
                  </View>
                  {/* CTA */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        borderColor: palettes.App['App Buttons Color'],
                        borderTopWidth: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 25,
                      },
                      dimensions.width
                    )}
                  >
                    {/* Not Now */}
                    <Pressable
                      onPress={() => {
                        const handler = async () => {
                          try {
                            setVisibleModalFeedback(false);
                            (
                              await xanoBackendCreateFeedbackPOST.mutateAsync({
                                rating: -1,
                              })
                            )?.json;
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
                            borderColor: palettes.App['App Buttons Color'],
                            borderRightWidth: 1,
                            justifyContent: 'center',
                            paddingBottom: 15,
                            paddingTop: 15,
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
                                textAlign: 'center',
                                textTransform: 'uppercase',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Not now'}
                        </Text>
                      </View>
                    </Pressable>
                    {/* Confirm */}
                    <Pressable
                      onPress={() => {
                        const handler = async () => {
                          try {
                            if (feedbackStarRating === 5) {
                              (
                                await xanoBackendCreateFeedbackPOST.mutateAsync(
                                  { content: '', rating: 5 }
                                )
                              )?.json;
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

                              setVisibleModalFeedback(false);
                            } else {
                              setShowFeedbackForm(true);
                            }
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
                            borderColor: theme.colors.border.brand,
                            justifyContent: 'center',
                            paddingBottom: 15,
                            paddingTop: 15,
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
                                textAlign: 'center',
                                textTransform: 'uppercase',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Confirm'}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              )}
            </>
            {/* Feedback Form */}
            <>
              {!showFeedbackForm ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: palettes.App['Custom Color'],
                      borderRadius: 8,
                      overflow: 'hidden',
                      padding: 15,
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
                    {'How can do better?'}
                  </Text>

                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                        marginTop: 15,
                      },
                      dimensions.width
                    )}
                  >
                    <TextInput
                      autoCorrect={true}
                      changeTextDelay={500}
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={newTextAreaValue => {
                        const textInputValue = newTextAreaValue;
                        try {
                          setFeedbackContent(newTextAreaValue);
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      textAlignVertical={'top'}
                      webShowOutline={true}
                      {...GlobalStyles.TextInputStyles(theme)['Text Area']
                        .props}
                      placeholder={'Add your feedback here'}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextInputStyles(theme)['Text Area']
                            .style,
                          { height: 150, width: '100%' }
                        ),
                        dimensions.width
                      )}
                      value={feedbackContent}
                    />
                  </View>
                  {/* CTA */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        borderColor: theme.colors.border.brand,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 25,
                      },
                      dimensions.width
                    )}
                  >
                    {/* Not Now */}
                    <Pressable
                      onPress={() => {
                        try {
                          setVisibleModalFeedback(false);
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
                            borderColor: theme.colors.border.brand,
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
                                fontFamily: 'Rasa_500Medium',
                                fontSize: 21,
                                textAlign: 'center',
                                textTransform: 'uppercase',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Not now'}
                        </Text>
                      </View>
                    </Pressable>
                    {/* Confirm */}
                    <Pressable
                      onPress={() => {
                        const handler = async () => {
                          try {
                            const result = (
                              await xanoBackendCreateFeedbackPOST.mutateAsync({
                                content: feedbackContent,
                                rating: feedbackStarRating,
                              })
                            )?.json;
                            setVisibleModalFeedback(false);
                            setFeedbackStarRating(0);
                            setFeedbackContent('');
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
                            borderColor: theme.colors.border.brand,
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
                                fontFamily: 'Rasa_500Medium',
                                fontSize: 21,
                                textAlign: 'center',
                                textTransform: 'uppercase',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Confirm'}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              )}
            </>
          </View>
        </SimpleStyleKeyboardAwareScrollView>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(HomeScreen);
