import React from 'react';
import {
  Icon,
  Provider as ThemeProvider,
  Touchable,
  useTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { useNavigationContainerRef } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import {
  ActivityIndicator,
  AppState,
  Appearance,
  I18nManager,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaFrameContext,
  SafeAreaProvider,
  initialWindowMetrics,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { systemWeights } from 'react-native-typography';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import Fonts from '../config/Fonts.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import cacheAssetsAsync from '../config/cacheAssetsAsync';
import * as CommonPackages from '../custom-files/CommonPackages';
import * as CustomAnimatedSplash from '../custom-files/CustomAnimatedSplash';
import Player_LoadAndPlay from '../global-functions/Player_LoadAndPlay';
import Player_SeekTo from '../global-functions/Player_SeekTo';
import checkPostNotifications from '../global-functions/checkPostNotifications';
import generateCheckinNotesQuestionAnswer from '../global-functions/generateCheckinNotesQuestionAnswer';
import getCompletedPart from '../global-functions/getCompletedPart';
import isNullOrUndefined from '../global-functions/isNullOrUndefined';
import Draftbit from '../themes/Draftbit';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import showAlertUtil from '../utils/showAlert';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

SplashScreen.preventAutoHideAsync();

export const sentryNavigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: 'https://0cc6f49da9285193593a0cf40d09291e:79c7da34c5e15f82ba13fc9492fd1713@o4507707119042560.ingest.us.sentry.io/4507707296907264',
  enableInExpoDevelopment: true,
  integrations: [sentryNavigationIntegration],
  attachScreenshot: true,
  tracesSampleRate: 1,
  _experiments: {
    profilesSampleRate: 1,
  },
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const queryClient = new QueryClient();

// On web, Appearance.setColorScheme is not implemented
// See https://github.com/necolas/react-native-web/issues/2703
//
// This reimplementation is a workaround to allow the app to switch between light and dark schemes
// by storing the selection in the data-theme attribute of the document element.
if (Platform.OS === 'web') {
  Appearance.setColorScheme = scheme => {
    document.documentElement.setAttribute('data-theme', scheme);
  };

  Appearance.getColorScheme = () => {
    const systemValue = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const userValue = document.documentElement.getAttribute('data-theme');
    return userValue && userValue !== 'null' ? userValue : systemValue;
  };

  Appearance.addChangeListener = listener => {
    // Listen for changes of system value
    const systemValueListener = e => {
      const newSystemValue = e.matches ? 'dark' : 'light';
      const userValue = document.documentElement.getAttribute('data-theme');
      listener({
        colorScheme:
          userValue && userValue !== 'null' ? userValue : newSystemValue,
      });
    };
    const systemValue = window.matchMedia('(prefers-color-scheme: dark)');
    systemValue.addEventListener('change', systemValueListener);

    // Listen for changes of user set value
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === 'data-theme') {
          listener({ colorScheme: Appearance.getColorScheme() });
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    function remove() {
      systemValue.removeEventListener('change', systemValueListener);
      observer.disconnect();
    }

    return { remove };
  };
}

function DefaultAndroidBackIcon({ tintColor }) {
  return (
    <View style={[styles.headerContainer, styles.headerContainerLeft]}>
      <Icon
        name="AntDesign/arrowleft"
        size={24}
        color={tintColor}
        style={[styles.headerIcon, styles.headerIconLeft]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

import FlashMessage from 'react-native-flash-message';
import { TrackPlayer } from './custom-files/Media';
import { MediaPlayer } from './custom-files/Media';
import ModalFeatureAnnouncement from './custom-files/ModalFeatureAnnouncement';
import appsFlyer from 'react-native-appsflyer';
import ModalPaywallBlock from './components/ModalPaywallBlock';
import { OneSignal } from 'react-native-onesignal';
import * as NavigationBar from 'expo-navigation-bar';
import * as ExpoStatusBar from 'expo-status-bar';
import TesterBanner from './custom-files/TesterBanner';

if (Platform.OS === 'android' && Platform.Version >= 33) {
  CommonPackages.ReactNativeForegroundService.register({
    config: {
      alert: false,
      onServiceErrorCallBack: () => {
        console.log('Service error');
      },
    },
  });
}

if (Platform.OS !== 'web') {
  TrackPlayer.registerPlaybackService(() => require('./custom-files/services'));
}

const App = () => {
  const [areAssetsCached, setAreAssetsCached] = React.useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular: Fonts.Inter_400Regular,
    Inter_500Medium: Fonts.Inter_500Medium,
    Inter_600SemiBold: Fonts.Inter_600SemiBold,
    Inter_700Bold: Fonts.Inter_700Bold,
    Inter_300Light: Fonts.Inter_300Light,
    Poppins_600SemiBold: Fonts.Poppins_600SemiBold,
    Poppins_300Light: Fonts.Poppins_300Light,
    Poppins_400Regular: Fonts.Poppins_400Regular,
    Poppins_500Medium: Fonts.Poppins_500Medium,
    Poppins_700Bold: Fonts.Poppins_700Bold,
    Poppins_900Black: Fonts.Poppins_900Black,
    Poppins_500Medium_Italic: Fonts.Poppins_500Medium_Italic,
    Rasa_300Light_Italic: Fonts.Rasa_300Light_Italic,
    Rasa_400Regular: Fonts.Rasa_400Regular,
    Rasa_500Medium: Fonts.Rasa_500Medium,
    Rasa_600SemiBold: Fonts.Rasa_600SemiBold,
    Rasa_300Light: Fonts.Rasa_300Light,
    Rasa_700Bold: Fonts.Rasa_700Bold,
    Rasa_500Medium_Italic: Fonts.Rasa_500Medium_Italic,
    Rasa_400Regular_Italic: Fonts.Rasa_400Regular_Italic,
    Rasa_700Bold_Italic: Fonts.Rasa_700Bold_Italic,
  });

  React.useEffect(() => {
    async function prepare() {
      try {
        await cacheAssetsAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setAreAssetsCached(true);
      }
    }

    prepare();
  }, []);

  const dimensions = useWindowDimensions();
  const colorScheme = useColorScheme();

  // SafeAreaProvider sets the 'frame' once and does not update when the window size changes (on web).
  // This is particularly problematic for drawer navigators that depend on the frame size to render the drawer.
  // This overrides the value of the frame to match the current window size which addresses the issue.
  //
  // The Drawer snippet that relies on useSafeAreaFrame: https://github.com/react-navigation/react-navigation/blob/bddcc44ab0e0ad5630f7ee0feb69496412a00217/packages/drawer/src/views/DrawerView.tsx#L112
  // Issue regarding broken useSafeAreaFrame: https://github.com/th3rdwave/react-native-safe-area-context/issues/184
  const SafeAreaFrameContextProvider =
    Platform.OS === 'web' ? SafeAreaFrameContext.Provider : React.Fragment;

  const isReady = areAssetsCached && fontsLoaded;
  const onLayoutRootView = React.useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  const theme = useTheme();

  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  const navigationContainerRef = useNavigationContainerRef();
  React.useEffect(() => {
    if (navigationContainerRef) {
      sentryNavigationIntegration.registerNavigationContainer(
        navigationContainerRef
      );
    }
  }, [navigationContainerRef]);

  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      await Notifications.dismissAllNotificationsAsync();
      await Notifications.setBadgeCountAsync(0);
    }
    init();
  }, []);

  React.useEffect(() => {
    async function initRevenueCat() {
      const Purchases = CommonPackages.Purchases;
      if (Platform.OS == 'android') {
        await Purchases.configure({
          apiKey: 'goog_ocokPXilJFBFEGkhLsONcOfvtbP',
        });
      } else {
        await Purchases.configure({
          apiKey: 'appl_NxZIWHgkBESyiDksRzrmLnqVahO',
        });
      }
    }

    initRevenueCat();
  }, []);

  React.useEffect(() => {
    function initAppflyer() {
      appsFlyer.initSdk(
        {
          devKey: 'oCbqtntXBozRrdAfgwigBG',
          isDebug: false,
          appId: 'id1616593368',
          onInstallConversionDataListener: true,
          onDeepLinkListener: true,
          timeToWaitForATTUserAuthorization: 10,
        },
        result => {},
        error => {
          console.error(error);
        }
      );
    }
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      initAppflyer();
    }
  }, []);

  React.useEffect(() => {
    try {
      CommonPackages?.FBSdk?.Settings.initializeSDK();
    } catch (error) {
      console.error('Error init FBSDK : ', error);
    }
  }, []);

  React.useEffect(() => {
    OneSignal.initialize('79d6e723-a4d4-4b0a-a3f7-62c01fa12952');
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1500);
  }, []);

  React.useEffect(() => {
    const FBSdk = CommonPackages?.FBSdk;
    if (FBSdk) {
      FBSdk.Settings.initializeSDK();
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <CustomAnimatedSplash.Index
      preload={true}
      logoWidht={120}
      logoHeight={120}
      isLoaded={isLoaded}
      backgroundColor={'#000F52'}
    >
      <>
        {Platform.OS === 'ios' ? (
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          />
        ) : null}
        {Platform.OS === 'android' ? (
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          />
        ) : null}
        <ThemeProvider
          themes={[Draftbit]}
          breakpoints={{}}
          initialThemeName={'Draftbit'}
        >
          <SafeAreaProvider
            initialMetrics={initialWindowMetrics}
            onLayout={onLayoutRootView}
          >
            <SafeAreaFrameContextProvider
              value={{
                x: 0,
                y: 0,
                width: dimensions.width,
                height: dimensions.height,
              }}
            >
              <GlobalVariables.GlobalVariableProvider>
                <QueryClientProvider client={queryClient}>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <Stack
                      screenOptions={{
                        cardStyle: { flex: 1 },
                        gestureEnabled: false,
                        headerBackImage:
                          Platform.OS === 'android'
                            ? DefaultAndroidBackIcon
                            : null,
                        headerShown: false,
                      }}
                      presentation={'card'}
                      initialRouteName={'index'}
                    >
                      <Stack.Screen
                        name="ActivityHistoryScreen"
                        options={{
                          title: 'Activity History',
                        }}
                      />

                      <Stack.Screen
                        name="AdvanceProgramCompleteStep1Screen"
                        options={{
                          title: 'Advance Program Complete Step 1',
                        }}
                      />

                      <Stack.Screen
                        name="AdvanceProgramCompleteStep2Screen"
                        options={{
                          title: 'Advance Program Complete Step 2',
                        }}
                      />

                      <Stack.Screen
                        name="BeginScreen"
                        options={{
                          title: 'Begin',
                        }}
                      />

                      <Stack.Screen
                        name="CategoriesScreen"
                        options={{
                          title: 'Categories',
                        }}
                      />

                      <Stack.Screen
                        name="CelebrationScreen"
                        options={{
                          title: 'Celebration',
                        }}
                      />

                      <Stack.Screen
                        name="CheckInNoteDetailScreen"
                        options={{
                          title: 'Check In Note Detail',
                        }}
                      />

                      <Stack.Screen
                        name="CompleteLessonStep1Screen"
                        options={{
                          title: 'Complete Lesson Step 1',
                        }}
                      />

                      <Stack.Screen
                        name="CompleteLessonStep2Screen"
                        options={{
                          title: 'Complete Lesson Step 2',
                        }}
                      />

                      <Stack.Screen
                        name="CompleteLessonStep3Screen"
                        options={{
                          title: 'Complete Lesson Step 3',
                        }}
                      />

                      <Stack.Screen
                        name="DesignYourMeditationScreen"
                        options={{
                          title: 'Design Your Meditation',
                        }}
                      />

                      <Stack.Screen
                        name="FavoritesScreen"
                        options={{
                          title: 'Favorites',
                        }}
                      />

                      <Stack.Screen
                        name="FontsCollectionScreen"
                        options={{
                          title: 'Fonts Collection',
                        }}
                      />

                      <Stack.Screen
                        name="GuestPassAppliedInformationScreen"
                        options={{
                          title: 'Guest Pass Applied Information',
                        }}
                      />

                      <Stack.Screen
                        name="InformationScreen"
                        options={{
                          title: 'Information',
                        }}
                      />

                      <Stack.Screen
                        name="LessonDetailsScreen"
                        options={{
                          title: 'Lesson Details',
                        }}
                      />

                      <Stack.Screen
                        name="LessonsScreen"
                        options={{
                          title: 'Lessons',
                        }}
                      />

                      <Stack.Screen
                        name="NightlyIntentionalityCheckInScreen"
                        options={{
                          title: 'Nightly Intentionality Check-In',
                        }}
                      />

                      <Stack.Screen
                        name="NoteDetailScreen"
                        options={{
                          title: 'Note Detail',
                        }}
                      />

                      <Stack.Screen
                        name="NotificationPermissionsScreen"
                        options={{
                          title: 'Notification Permissions',
                        }}
                      />

                      <Stack.Screen
                        name="OnboardingPlayerScreen"
                        options={{
                          title: 'Onboarding Player',
                        }}
                      />

                      <Stack.Screen
                        name="index"
                        options={{
                          title: 'Onboarding Step 1',
                        }}
                      />

                      <Stack.Screen
                        name="OnboardingStep2Screen"
                        options={{
                          title: 'Onboarding Step 2',
                        }}
                      />

                      <Stack.Screen
                        name="OnboardingStep3Screen"
                        options={{
                          title: 'Onboarding Step 3',
                        }}
                      />

                      <Stack.Screen
                        name="OnboardingStep4Screen"
                        options={{
                          title: 'Onboarding Step 4',
                        }}
                      />

                      <Stack.Screen
                        name="ResetPasswordScreen"
                        options={{
                          title: 'Reset Password ',
                        }}
                      />

                      <Stack.Screen
                        name="TridentForTeamsScreen"
                        options={{
                          title: 'Trident For Teams',
                        }}
                      />

                      <Stack.Screen
                        name="WebPagesScreen"
                        options={{
                          title: 'Web Pages',
                        }}
                      />

                      <Stack.Screen
                        name="WelcomeScreen"
                        options={{
                          title: 'Welcome',
                        }}
                      />

                      <Stack.Screen
                        name="BottomTabNavigator"
                        options={{
                          title: 'Bottom Tab Navigator',
                        }}
                      />
                      <Stack.Screen
                        name="Auth"
                        options={{
                          title: 'Auth',
                        }}
                      />
                    </Stack>
                  </GestureHandlerRootView>

                  <>
                    <FlashMessage position="top" />
                    <MediaPlayer />
                    <ModalPaywallBlock />
                    <ModalFeatureAnnouncement />
                    <TesterBanner />
                  </>
                </QueryClientProvider>
              </GlobalVariables.GlobalVariableProvider>
            </SafeAreaFrameContextProvider>
          </SafeAreaProvider>
        </ThemeProvider>
      </>
    </CustomAnimatedSplash.Index>
  );
};

export default Sentry.wrap(App);
