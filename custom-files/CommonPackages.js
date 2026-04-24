import { Platform, Image, PermissionsAndroid } from 'react-native';
import Purchases from 'react-native-purchases';
import * as Application from 'expo-application';
import semver from 'semver';
import * as Linking from 'expo-linking';
import moment from 'moment';
import * as Haptics from 'expo-haptics';
const ExpoTrackingTransparency =
  Platform.OS !== 'web' ? require('expo-tracking-transparency') : null;
import * as XanoBackendApi from '../apis/XanoBackendApi';
import * as Localization from 'expo-localization';
const FBSdk = Platform.OS !== 'web' ? require('react-native-fbsdk-next') : null;
import appsFlyer from 'react-native-appsflyer';
import * as PlayerAnimationValues from '../custom-files/PlayerAnimationValues';
import { Audio } from 'expo-av';
import { OneSignal } from 'react-native-onesignal';
import * as Device from 'expo-device';

const ReactNativeForegroundService =
  Platform.OS === 'android'
    ? require('@supersami/rn-foreground-service').default
    : {
        register: async () => {
          return Promise.resolve();
        },
        add_task: async () => {
          return Promise.resolve();
        },
        start: async () => {
          return Promise.resolve();
        },
        stop_all: async () => {
          return Promise.resolve();
        },
      };

export {
  Purchases,
  ExpoTrackingTransparency,
  Application,
  semver,
  Linking,
  moment,
  Haptics,
  XanoBackendApi,
  Localization,
  FBSdk,
  appsFlyer,
  Image,
  PlayerAnimationValues,
  Audio,
  OneSignal,
  ReactNativeForegroundService,
  PermissionsAndroid,
  Device,
};
