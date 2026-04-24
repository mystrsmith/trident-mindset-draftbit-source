import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Icon, LinearProgress } from '@draftbit/ui';
import theme from '../themes/Draftbit.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Player_StopPlay from '../global-functions/Player_StopPlay';
import Player_TogglePlay from '../global-functions/Player_TogglePlay';
import Player from '../components/PlayerBlock';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  useDerivedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  goUpAudio,
  goDownAudio,
  reset,
  isPanningTextContent,
  isScrollingTextContent,
  isAllowScrollingContent,
  goDownRead,
  goUpRead,
  isFocusReadContent,
} from './PlayerAnimationValues';
import isSubscribed from '../global-functions/isSubscribed';
import stopAllForegroundTasks from '../global-functions/stopAllForegroundTasks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LINEAR_PROGRESS_THICKNESS = 3;
const MINIMIZED_PLAYER_HEIGHT = 50;
const SNAP_TOP = 0;

const springConfig = {
  mass: 1,
  damping: 40,
  stiffness: 160,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export function Component(props) {
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const Constants = GlobalVariables.useValues();
  const [isSubscribedUser, setIsSubscribedUser] = React.useState(false);
  const customerInfo = Constants['CUSTOMER_INFO'];
  const profileDetails = Constants['PROFILE_DETAILS'];
  const appConfig = Constants['APP_CONFIG'];

  const isAdvanceTab =
    props.state.routes[props.state.index].name === 'AdvanceNavigator';

  const isPlayingAdvancePlayer =
    Constants['CURRENTLY_PLAYING_LESSON']?.isAdvanceProgramLesson;

  const minimalPlayerColor = isPlayingAdvancePlayer
    ? 'rgba(210, 20, 4, 0.6)'
    : '#0177D9FF';

  const backgroundProgress = useSharedValue(isAdvanceTab ? 1 : 0);
  const isAnimating = useSharedValue(false);

  React.useEffect(() => {
    const newIsSubscribedUser = isSubscribed(Constants);
    setIsSubscribedUser(newIsSubscribedUser);
  }, [customerInfo, profileDetails]);

  React.useEffect(() => {
    backgroundProgress.value = withTiming(isAdvanceTab ? 1 : 0, {
      duration: 300,
    });
  }, [isAdvanceTab]);

  const insets = useSafeAreaInsets();

  const TABBAR_HEIGHT = React.useMemo(() => {
    if (Platform.OS === 'ios') {
      return insets.bottom + 50;
    }
    return insets.bottom + 60;
  }, [insets.bottom]);

  const SNAP_BOTTOM = React.useMemo(
    () =>
      SCREEN_HEIGHT -
      TABBAR_HEIGHT -
      MINIMIZED_PLAYER_HEIGHT -
      LINEAR_PROGRESS_THICKNESS * 2,
    [TABBAR_HEIGHT]
  );
  // When no player: sheet must be fully off-screen (top >= SCREEN_HEIGHT).
  // Using SNAP_BOTTOM + 80 left the top of the sheet visible (mini bar strip).
  const SNAP_BOTTOM_NO_PLAYER = React.useMemo(() => SCREEN_HEIGHT, []);

  const translateY = useSharedValue(SNAP_BOTTOM_NO_PLAYER);
  const { state, descriptors, navigation } = props;

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;
  const { tabBarStyle } = focusedOptions;

  const currentlyPlayingLesson = Constants['CURRENTLY_PLAYING_LESSON'];
  const audioContent = currentlyPlayingLesson?.audio_content;
  const noAudioContent = audioContent === null;

  const pan = Gesture.Pan()
    .onChange(event => {
      if (noAudioContent === true) {
        return;
      }
      if (
        isPanningTextContent.value === true ||
        isScrollingTextContent.value === true ||
        isFocusReadContent.value === true
      ) {
        return;
      }
      const newTranslateY = Math.max(
        SNAP_TOP,
        Math.min(SNAP_BOTTOM_NO_PLAYER, translateY.value + event.changeY)
      );
      translateY.value = newTranslateY;
    })
    .onFinalize(event => {
      if (noAudioContent === true) {
        return;
      }
      if (
        isPanningTextContent.value === true ||
        isScrollingTextContent.value === true ||
        isFocusReadContent.value === true
      ) {
        return;
      }
      const velocity = event.velocityY;
      const shouldSnap = Math.abs(velocity) > 500;

      if (shouldSnap) {
        if (velocity > 0) {
          translateY.value = withSpring(SNAP_BOTTOM, springConfig);
        } else {
          translateY.value = withSpring(SNAP_TOP, springConfig);
        }
      } else {
        const currentPosition = translateY.value;
        const snapPoint =
          currentPosition < SNAP_BOTTOM / 2 ? SNAP_TOP : SNAP_BOTTOM;
        translateY.value = withSpring(snapPoint, springConfig);
      }
    });

  useDerivedValue(() => {
    if (goUpAudio.value) {
      isAnimating.value = true;
      translateY.value = withSpring(SNAP_TOP, springConfig, () => {
        goUpAudio.value = false;
        isAnimating.value = false;
      });
    }
    if (goDownAudio.value) {
      isAnimating.value = true;
      translateY.value = withSpring(SNAP_BOTTOM, springConfig, () => {
        goDownAudio.value = false;
        isAnimating.value = false;
      });
    }
    if (reset.value && !isAnimating.value) {
      isAnimating.value = true;
      translateY.value = withSpring(SNAP_BOTTOM_NO_PLAYER, springConfig, () => {
        reset.value = false;
        isPanningTextContent.value = false;
        isAllowScrollingContent.value = false;
        isScrollingTextContent.value = false;
        goUpRead.value = false;
        goDownRead.value = true;
        isAnimating.value = false;
      });
    }
  });

  // Single animated style per View for Android (Reanimated 3.17): sheet + transform + opacity
  const playerSheetAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SNAP_BOTTOM_NO_PLAYER - 10, SNAP_BOTTOM_NO_PLAYER],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      transform: [{ translateY: translateY.value }],
      opacity,
    };
  }, [SNAP_BOTTOM_NO_PLAYER]);

  // Background overlay: single useAnimatedStyle
  const backgroundOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [
        SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT * 2,
        SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT,
      ],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: minimalPlayerColor,
      opacity,
      pointerEvents: 'none',
    };
  }, [SNAP_BOTTOM, minimalPlayerColor]);

  // Mini player bar: single useAnimatedStyle (opacity + layout)
  const miniPlayerBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [SNAP_TOP, SNAP_BOTTOM - MINIMIZED_PLAYER_HEIGHT * 2, SNAP_BOTTOM],
      [0, 0, 1],
      Extrapolation.CLAMP
    );
    const miniOpacity = interpolate(
      translateY.value,
      [SNAP_TOP, SNAP_BOTTOM - 100, SNAP_BOTTOM],
      [0, 0.3, 1],
      Extrapolation.CLAMP
    );
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: MINIMIZED_PLAYER_HEIGHT,
      opacity: miniOpacity,
    };
  }, [SNAP_TOP, SNAP_BOTTOM]);

  const miniPlayerAnimatedProps = useAnimatedProps(() => {
    const isAtTop = translateY.value <= SNAP_TOP + 1;
    return {
      pointerEvents: isAtTop ? 'none' : 'auto',
    };
  }, [SNAP_TOP]);

  // Tab bar container: single useAnimatedStyle for transform
  const tabBarContainerStyle = useAnimatedStyle(() => {
    const tabBarTranslateY = interpolate(
      translateY.value,
      [SNAP_TOP, SNAP_BOTTOM],
      [TABBAR_HEIGHT, 0],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY: tabBarTranslateY }],
    };
  }, [SNAP_TOP, SNAP_BOTTOM, TABBAR_HEIGHT]);

  // Tab bar background: single useAnimatedStyle for backgroundColor
  const tabBarBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundProgress.value,
      [0, 1],
      [theme.colors.background.brand, '#000000']
    );
    return {
      backgroundColor,
    };
  });

  React.useEffect(() => {
    return () => {
      translateY.value = SNAP_BOTTOM_NO_PLAYER;
      reset.value = false;
      isPanningTextContent.value = false;
      isAllowScrollingContent.value = false;
      isScrollingTextContent.value = false;
      goUpRead.value = false;
      goDownRead.value = true;
    };
  }, [SNAP_BOTTOM_NO_PLAYER]);

  return (
    <>
      <GestureDetector gesture={pan}>
        <Animated.View style={playerSheetAnimatedStyle}>
          <Player audioPan={pan} />
          <Animated.View style={backgroundOverlayStyle} />
          <Animated.View
            style={miniPlayerBarStyle}
            animatedProps={miniPlayerAnimatedProps}
          >
            <MiniPlayer minimalPlayerColor={minimalPlayerColor} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      <Animated.View style={tabBarContainerStyle}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: TABBAR_HEIGHT,
              flexDirection: 'row',
              ...tabBarStyle,
            },
            tabBarBackgroundStyle,
          ]}
        >
          {state.routes.map((route, index) => {
            if (
              isSubscribedUser === true &&
              index === 1 &&
              profileDetails?.is_test_user === false
            ) {
              return null;
            }
            if (
              appConfig?.show_advanced_tab === false &&
              route.name === 'AdvanceNavigator' &&
              profileDetails?.is_test_user === false
            ) {
              return null;
            }
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;
            const icon = options.tabBarIcon;
            const isFocused = state.index === index;
            const contentColor = isFocused ? 'white' : 'rgba(255,255,255,0.5)';
            const iconComponent = icon?.({
              focused: isFocused,
              color: contentColor,
            });
            const onPress = () => {
              if (index === 1) {
                setGlobalVariableValue({
                  key: 'VISIBLE_MODAL_PAYWALL',
                  value: true,
                });
                return;
              }
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  borderTopWidth: 1,
                  borderTopColor: 'rgba(236,240,241,0.2)',
                  paddingTop: 15,
                }}
              >
                <Icon
                  name={iconComponent?.props?.name}
                  color={contentColor}
                  size={20}
                />
                <Text
                  style={{ color: contentColor, marginTop: 3, fontSize: 12 }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </Animated.View>
    </>
  );
}

const MiniPlayer = ({ minimalPlayerColor }) => {
  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  const isPlaying = Constants['PLAYER_STATE'] === 'playing';
  const isPausing = Constants['PLAYER_STATE'] !== 'playing';
  const isBuffering = Constants['PLAYER_STATE'] === 'buffering';

  const [isClosing, setIsClosing] = React.useState(false);
  const closeTimeoutRef = React.useRef(null);
  const lastCloseAttemptRef = React.useRef(0);
  const resetTriggeredRef = React.useRef(false);

  const onPressCard = () => {
    if (resetTriggeredRef.current || isClosing) return;
    setGlobalVariableValue({
      key: 'SHOW_LESSON_PLAYER',
      value: true,
    });
    goUpAudio.value = true;
  };

  const onPressClose = async () => {
    if (resetTriggeredRef.current) return;
    const now = Date.now();
    const timeSinceLastAttempt = now - lastCloseAttemptRef.current;
    if (timeSinceLastAttempt < 400) return;
    if (isClosing) return;

    resetTriggeredRef.current = true;
    lastCloseAttemptRef.current = now;
    setIsClosing(true);

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    reset.value = true;

    closeTimeoutRef.current = setTimeout(async () => {
      setGlobalVariableValue({
        key: 'SHOW_LESSON_PLAYER',
        value: false,
      });
      await Player_StopPlay(setGlobalVariableValue);
      stopAllForegroundTasks();

      setTimeout(() => {
        setIsClosing(false);
        resetTriggeredRef.current = false;
        closeTimeoutRef.current = null;
        lastCloseAttemptRef.current = 0;
      }, 600);
    }, 100);
  };

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const onTogglePlay = async () => {
    if (Constants['PLAYER_STATE'] !== 'buffering') {
      await Player_TogglePlay(setGlobalVariableValue);
    }
  };

  const currentDuration = Constants['PLAYER_POSITON'];
  const maximumDuration = Constants['CURRENTLY_PLAYING_LESSON']?.duration;
  const percentage =
    maximumDuration > 0 ? (currentDuration / maximumDuration) * 100 : 0;

  return (
    <Pressable onPress={onPressCard}>
      <LinearProgress
        animationDuration={500}
        color={minimalPlayerColor}
        isAnimated={true}
        lineCap={'round'}
        maximumValue={100}
        showTrack={true}
        thickness={LINEAR_PROGRESS_THICKNESS}
        trackColor={'white'}
        trackLineCap={'round'}
        value={percentage}
      />
      <View
        style={[styles.audioPlayerBar, { backgroundColor: minimalPlayerColor }]}
      >
        <Pressable
          onPress={onPressClose}
          disabled={isClosing}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <Icon
            color={isClosing ? 'rgba(255,255,255,0.5)' : 'white'}
            name={'AntDesign/closecircleo'}
            size={20}
          />
        </Pressable>
        <View style={styles.row}>
          <Text style={styles.lessonName}>
            {Constants['CURRENTLY_PLAYING_LESSON']?.title ?? 'Trident Mindset'}
          </Text>
        </View>
        <Pressable
          onPress={onTogglePlay}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          {isBuffering ? (
            <ActivityIndicator
              animating={true}
              color={'white'}
              hidesWhenStopped={true}
              size={'small'}
            />
          ) : (
            <>
              {isPausing && (
                <Icon color={'white'} name={'Ionicons/play'} size={20} />
              )}
              {isPlaying && (
                <Icon color={'white'} name={'MaterialIcons/pause'} size={20} />
              )}
            </>
          )}
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  audioPlayerBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0177D9',
    paddingLeft: 14,
    paddingRight: 22,
    alignItems: 'center',
    flexDirection: 'row',
  },
  row: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lessonName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
  },
});
