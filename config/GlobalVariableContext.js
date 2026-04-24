import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DeviceVariables = {
  AUTH_TOKEN: '',
  CURRENT_DOWNLOAD_ID: 0,
  CURRENT_DOWNLOAD_PERCENT: 0,
  CURRENTLY_PLAYING_LESSON: '',
  CUSTOMER_INFO: null,
  DOWNLOADED_LESSONS: [],
  PLAYER_POSITON: '',
  PLAYER_STATE: '',
  PROFILE_DETAILS: '',
  APP_CONFIG: '',
  LESSON_FONT_SIZE: null,
  GUEST_PASS_URL: '',
  HIGHLIGHT_BANNER_ACKNOWLEDGED: false,
  QUIZ_ANSWERS: [],
  LISTENED_FIRST_LESSON: false,
  ANONYMOUS_ID: '',
  ONBOARDING_FIRST_LESSON: null,
  ONBOARDING_FIRST_LESSON_COMPLETED: false,
  ONBOARDING_FIRST_LESSON_POSITION: 0,
  __env__: 'Production',
};
export const AppVariables = {
  WEEKDAYS: [
    { label: 'M', value: 'Monday' },
    { label: 'T', value: 'Tuesday' },
    { label: 'W', value: 'Wednesday' },
    { label: 'T', value: 'Thursday' },
    { label: 'F', value: 'Friday' },
    { label: 'S', value: 'Saturday' },
    { label: 'S', value: 'Sunday' },
  ],
  BG_VIDEO:
    'https://xfbv-qcqq-txoe.n7c.xano.io/vault/XKQzl2Np/0fXax01sJfoIbqULfVQHj9lTGow/YPD9bw../BG_GIF.gif',
  BG_VIDEO_MP4:
    'https://xfbv-qcqq-txoe.n7c.xano.io/vault/XKQzl2Np/N9WmW25tvUCHiZ1DtptOj-hSXDk/F-Va_A../App+Logo+Sting.mp4',
  BG_VIDEO_OPACITY: 0.2,
  BUTTONS_CORNER_RADIUS: 6,
  CONTENT_PADDING: 20,
  DAILY_TRACKER_WEEK_DATA: [
    { label: 'M', selected: false },
    { label: 'T', selected: false },
    { label: 'W', selected: false },
    { label: 'T', selected: false },
    { label: 'F', selected: false },
    { label: 'S', selected: false },
    { label: 'S', selected: false },
  ],
  FEATURES: [
    'Mindset 101',
    'Micro-Goals',
    'Focus',
    'Breath Control',
    'Intentionally',
    'Choose the Wrench',
    'Stoicism',
    'Discipline',
    'Medicine',
    'Mindfulness',
    'Flip the Script',
    'Self-Talk',
    'Visualisation',
    'Start Here',
    'Trident Talks',
    'Meditation Library',
    'Advanced Training Program',
  ],
  IOS_CANCEL_SUBSCRIPTION: 'https://apps.apple.com/account/subscriptions',
  ONBOARDING_BG_VIDEO:
    'https://xfbv-qcqq-txoe.n7c.xano.io/vault/XKQzl2Np/SPvzgvTwbBAvQ2ZKlg9WSnSsLVs/vAPgTA../onboarding_video.mp4',
  ONBOARDING_BG_VIDEO_LIGHT:
    'https://xfbv-qcqq-txoe.n7c.xano.io/vault/XKQzl2Np/KgdnxdHaQXGc-6nnB33q-OHj4NE/vdBj-g../onboarding_video_light.mov',
  PRIVACY_POLICY: 'https://www.tridentmindset.com/pages/privacy-policy',
  SHOW_LESSON_PLAYER: false,
  SUCCESS_API_RESPONSE: 'success',
  TD: '[ { id: 16, created_at: 1704194445000, user_id: 1, lesson_id: 9}, { id: 17, created_at: 1704280855000, user_id: 1, lesson_id: 9}, { id: 24, created_at: 1704284747000, user_id: 1, lesson_id: 5}, { id: 19, created_at: 1704972087000, user_id: 1, lesson_id: 6}, { id: 20, created_at: 1705058487000, user_id: 1, lesson_id: 8}]',
  TERMS_OF_USE: 'https://www.tridentmindset.com/pages/terms',
  ABOUT_US: 'https://www.tridentmindset.com/about-us',
  ANDROID_CANCEL_SUBSCRIPTION:
    'https://play.google.com/store/account/subscriptions?sku=com.pikwxwpq5b1i.monthly19&package=com.pikwxwpq5b1i.plgj6rakapp',
  APP_FONT_COLOR: '#FFFFFF',
  INTERVAL_BELL_OPTIONS: [
    { label: 'No interval bell', value: 0 },
    { label: 'Every minute', value: 1 },
    { label: 'Every 2 minutes', value: 2 },
    { label: 'Every 5 minutes', value: 5 },
    { label: 'Every 10 minutes', value: 10 },
    { label: 'Halfway', value: 'halfway' },
  ],
  VISIBLE_MODAL_PAYWALL: false,
  all_tactics: [],
  APPLIED_REDEEM_CODE: null,
  feature_announcement: null,
  UPCOMING_ADVANCE_ID: null,
  SHOW_HIGHLIGTHED_TEXT: false,
  SHOW_LEFTOFF_MODAL: false,
  LAST_LEFTOFF_LESSON: null,
  INITIALIZE_HOMESCREEN: true,
  TITLE_PAYWALL: 'Unlock the full program',
  SUBTITLE_PAYWALL: 'Start Your Free Trial',
  PURCHASED_AFTER_LESSON_TITLE: null,
  NEXT_LESSON_ID: null,
  NEXT_TACTIC_ID: null,
};
const GlobalVariableContext = React.createContext();
const GlobalVariableUpdater = React.createContext();
const keySuffix = '';

// Attempt to parse a string as JSON. If the parse fails, return the string as-is.
// This is necessary to account for variables which are already present in local
// storage, but were not stored in JSON syntax (e.g. 'hello' instead of '"hello"').
function tryParseJson(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

class GlobalVariable {
  /**
   *  Filters an object of key-value pairs for those that should be
   *  persisted to storage, and persists them.
   *
   *  @param values Record<string, string>
   */
  static async syncToLocalStorage(values) {
    const update = Object.entries(values)
      .filter(([key]) => key in DeviceVariables)
      .map(([key, value]) => [key + keySuffix, JSON.stringify(value)]);

    if (update.length > 0) {
      await AsyncStorage.multiSet(update);
    }

    return update;
  }

  static async loadLocalStorage() {
    const keys = Object.keys(DeviceVariables);
    const entries = await AsyncStorage.multiGet(
      keySuffix ? keys.map(k => k + keySuffix) : keys
    );

    // If values isn't set, use the default. These will be written back to
    // storage on the next render.
    const withDefaults = entries.map(([key_, value]) => {
      // Keys only have the suffix appended in storage; strip the key
      // after they are retrieved
      const key = keySuffix ? key_.replace(keySuffix, '') : key_;
      return [key, value ? tryParseJson(value) : DeviceVariables[key]];
    });

    return Object.fromEntries(withDefaults);
  }
}

class State {
  static defaultValues = {
    ...AppVariables,
    ...DeviceVariables,
  };

  static reducer(state, { type, payload }) {
    switch (type) {
      case 'RESET':
        return { values: State.defaultValues, __loaded: true };
      case 'LOAD_FROM_ASYNC_STORAGE':
        return { values: { ...state.values, ...payload }, __loaded: true };
      case 'UPDATE':
        return state.__loaded
          ? {
              ...state,
              values: {
                ...state.values,
                [payload.key]: payload.value,
              },
            }
          : state;
      case 'ADD_CALLBACK':
        payload();
        return state;
      default:
        return state;
    }
  }

  static initialState = {
    __loaded: false,
    values: State.defaultValues,
  };
}

export function GlobalVariableProvider({ children }) {
  const [state, dispatch] = React.useReducer(State.reducer, State.initialState);

  React.useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();
  }, []);

  // This effect runs on mount to overwrite the default value of any
  // key that has a local value.
  React.useEffect(() => {
    async function initialStorageLoader() {
      try {
        const payload = await GlobalVariable.loadLocalStorage();
        if (
          payload?.__env__ &&
          DeviceVariables.__env__ &&
          payload.__env__ !== DeviceVariables.__env__
        ) {
          console.log(
            `Publication Environment changed from ${payload.__env__} to ${DeviceVariables.__env__}. Refreshing variables`
          );
          dispatch({
            type: 'LOAD_FROM_ASYNC_STORAGE',
            payload: DeviceVariables,
          });
        } else {
          dispatch({ type: 'LOAD_FROM_ASYNC_STORAGE', payload });
        }
      } catch (err) {
        console.error(err);
      }
    }
    initialStorageLoader();
  }, []);

  // This effect runs on every state update after the initial load. Gives us
  // best of both worlds: React state updates sync, but current state made
  // durable next async tick.
  React.useEffect(() => {
    async function syncToAsyncStorage() {
      try {
        await GlobalVariable.syncToLocalStorage(state.values);
      } catch (err) {
        console.error(err);
      }
    }
    if (state.__loaded) {
      syncToAsyncStorage();
    }
  }, [state]);

  const onLayoutRootView = React.useCallback(async () => {
    if (state.__loaded) {
      await SplashScreen.hideAsync();
    }
  }, [state.__loaded]);

  // We won't want an app to read a default state when there might be one
  // incoming from storage.
  if (!state.__loaded) {
    return null;
  }

  return (
    <GlobalVariableUpdater.Provider
      value={dispatch}
      onLayout={onLayoutRootView}
    >
      <GlobalVariableContext.Provider value={state.values}>
        {children}
      </GlobalVariableContext.Provider>
    </GlobalVariableUpdater.Provider>
  );
}

// Hooks
export function useSetValue() {
  const dispatch = React.useContext(GlobalVariableUpdater);
  return ({ key, value }) => {
    return new Promise(resolve => {
      dispatch({ type: 'UPDATE', payload: { key, value } });

      // Add a callback to the dispatch 'queue'
      // This guarantees that the promise is only resolved after the initial dispatch
      // has completed and allows 'awaiting' the global variable update
      const dispatchCompleteCallback = () => {
        resolve(value);
      };
      dispatch({ type: 'ADD_CALLBACK', payload: dispatchCompleteCallback });
    });
  };
}

export function useValues() {
  return React.useContext(GlobalVariableContext);
}
