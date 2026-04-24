import React from 'react';
import {
  ExpoImage,
  Icon,
  LinearGradient,
  Pressable,
  withTheme,
} from '@draftbit/ui';
import { Image } from 'expo-image';
import { StatusBar } from 'react-native';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Text,
  View,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import TrackPlayer, { Event } from 'react-native-track-player';
import { Gesture } from 'react-native-gesture-handler';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext.js';
import Images from '../config/Images.js';
import * as CircularPlayerSlider from './CircularPlayerSlider.js';
import * as CustomPlayerSlider from './CustomPlayerSlider.js';
import * as PlayerAnimationValues from './PlayerAnimationValues.js';
import * as ReadTheLesson from './ReadTheLesson.js';
import Player_FormatMilliSeconds from '../global-functions/Player_FormatMilliSeconds.js';
import Player_SeekBy from '../global-functions/Player_SeekBy.js';
import Player_SeekTo from '../global-functions/Player_SeekTo.js';
import Player_StopPlay from '../global-functions/Player_StopPlay.js';
import Player_TogglePlay from '../global-functions/Player_TogglePlay.js';
import stopAllForegroundTasks from '../global-functions/stopAllForegroundTasks.js';
import palettes from '../themes/palettes.js';
import * as Utils from '../utils/index.js';
import * as StyleSheet from '../utils/StyleSheet.js';
import imageSource from '../utils/imageSource.js';
import useNavigation from '../utils/useNavigation.js';
import useWindowDimensions from '../utils/useWindowDimensions.js';
import * as CommonPackages from './CommonPackages.js';

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
  },
  imageCover: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  gradientOverlay: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: Platform.OS === 'ios' ? 45 : 20,
    width: '100%',
  },
  headerButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 15,
  },
  topView: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  titleText: {
    fontFamily: 'Rasa_700Bold',
    fontSize: 36,
    textAlign: 'center',
  },
  subTitleText: {
    fontFamily: 'Rasa_400Regular',
    fontSize: 23,
    marginTop: 8,
    textAlign: 'center',
  },
  middleView: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  controlsWrapper: {
    justifyContent: 'space-between',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 0,
  },
  timeStart: {
    fontFamily: 'Rasa_600SemiBold',
    fontSize: 21,
    textAlign: 'left',
  },
  timeEnd: {
    fontFamily: 'Rasa_600SemiBold',
    fontSize: 21,
    textAlign: 'right',
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-around',
  },
  controlButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  playButton: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  imageControl: {
    height: 40,
    width: 40,
  },
  bottomSpace: {},
  continueButton: {
    backgroundColor: palettes.App.Success,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: palettes.App.Studily_White,
    fontFamily: 'Rasa_600SemiBold',
    fontSize: 15,
  },
  continuingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const CustomOnboardingPlayer = props => {
  const { theme } = props;
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const noopPan = React.useRef(Gesture.Pan()).current;
  const isOnboardingPlayer = true;
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [isContinuing, setIsContinuing] = React.useState(false);
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const completionTriggeredRef = React.useRef(false);
  const onContinueRef = React.useRef(() => {});
  const setGlobalVariableValueRef = React.useRef(() => {});

  const lesson = Constants['CURRENTLY_PLAYING_LESSON'];
  setGlobalVariableValueRef.current = setGlobalVariableValue;
  React.useEffect(() => {
    completionTriggeredRef.current = false;
  }, [lesson?.id]);

  React.useEffect(() => {
    if (isContinuing) {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      overlayOpacity.setValue(0);
    }
  }, [isContinuing, overlayOpacity]);

  const customHeight = total => total - 100;

  const isMeditation = vars =>
    vars['CURRENTLY_PLAYING_LESSON']?.isMeditation === true;

  const onCloseAnimation = () => {
    PlayerAnimationValues.reset.value = true;
  };

  const onMinimizeAnimation = () => {
    PlayerAnimationValues.goDownAudio.value = true;
  };

  const handleClose = async () => {
    try {
      await setGlobalVariableValue({
        key: 'SHOW_LESSON_PLAYER',
        value: false,
      });
      await Player_StopPlay(setGlobalVariableValue);
      onCloseAnimation();
      stopAllForegroundTasks();
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  };

  const handleMinimize = async () => {
    try {
      await setGlobalVariableValue({
        key: 'SHOW_LESSON_PLAYER',
        value: false,
      });
      onMinimizeAnimation();
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  };

  const handleBackward = async () => {
    try {
      if (Constants['PLAYER_POSITON'] - 15000 < 0) {
        await setGlobalVariableValue({
          key: 'PLAYER_POSITON',
          value: 0,
        });
        await Player_SeekTo(0);
      } else {
        await setGlobalVariableValue({
          key: 'PLAYER_POSITON',
          value: Constants['PLAYER_POSITON'] - 15000,
        });
        await Player_SeekBy(-15);
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (Constants['PLAYER_STATE'] !== 'buffering') {
        await Player_TogglePlay(setGlobalVariableValue);
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  };

  // When the user listens to the entire lesson (playback ends) or seeks to the end, complete and go to BeginScreen.
  // PlaybackQueueEnded only fires when playback naturally reaches end; dragging to end does not fire it.
  React.useEffect(() => {
    if (Platform.OS === 'web') return;
    const triggerCompletionOnce = () => {
      if (completionTriggeredRef.current) return;
      completionTriggeredRef.current = true;
      onContinueRef.current();
    };
    const subEnded = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      triggerCompletionOnce
    );
    const subProgress = TrackPlayer.addEventListener(
      Event.PlaybackProgressUpdated,
      ({ position, duration }) => {
        const positionNum = Number(position);
        if (!Number.isFinite(positionNum) || positionNum < 0) return;
        const positionMs = positionNum * 1000;
        const durationNum = duration != null ? Number(duration) : NaN;
        const durationMs =
          Number.isFinite(durationNum) && durationNum > 0
            ? durationNum * 1000
            : null;
        const cappedMs =
          durationMs != null ? Math.min(positionMs, durationMs) : positionMs;
        if (!Number.isFinite(cappedMs) || cappedMs < 0) return;
        setGlobalVariableValueRef.current({
          key: 'ONBOARDING_FIRST_LESSON_POSITION',
          value: cappedMs,
        });
        if (durationNum > 0 && positionNum >= durationNum - 0.5) {
          triggerCompletionOnce();
        }
      }
    );
    return () => {
      subEnded.remove();
      subProgress.remove();
    };
  }, [navigation]);

  const handleForward = async () => {
    try {
      const duration = Constants['CURRENTLY_PLAYING_LESSON']?.duration;
      if (Constants['PLAYER_POSITON'] + 15000 > duration) {
        await setGlobalVariableValue({
          key: 'PLAYER_POSITON',
          value: duration,
        });
        await Player_SeekTo(duration);
      } else {
        await setGlobalVariableValue({
          key: 'PLAYER_POSITON',
          value: Constants['PLAYER_POSITON'] + 15000,
        });
        await Player_SeekBy(15);
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  };

  const appFontColor = Constants['APP_FONT_COLOR'];
  const isMeditationLesson = isMeditation(Variables);
  const bottomHeight = lesson?.isMeditation === true ? 50 : 145;
  const displayPosition =
    lesson?.duration != null
      ? Math.min(Constants['PLAYER_POSITON'], lesson.duration)
      : Constants['PLAYER_POSITON'];

  const onContinue = async () => {
    setIsContinuing(true);
    try {
      const anonymousId = Constants['ANONYMOUS_ID'];
      const lessonId = lesson?.id;
      await CommonPackages.XanoBackendApi.onboardingCompletedLessonPATCH(
        Constants,
        {
          anonymous_id: anonymousId,
          completed_lesson_id: lessonId,
        },
        {},
        undefined
      );
      setGlobalVariableValue({
        key: 'ONBOARDING_FIRST_LESSON_COMPLETED',
        value: true,
      });
      setGlobalVariableValue({
        key: 'ONBOARDING_FIRST_LESSON_POSITION',
        value: 0,
      });
      const rootNavigation = navigation.getParent() || navigation;
      const isAuthenticated = !!Constants['AUTH_TOKEN'];
      await Player_StopPlay(setGlobalVariableValue);
      stopAllForegroundTasks();
      if (isAuthenticated) {
        await CommonPackages.XanoBackendApi.updateUserTacticRecommendationsPATCH(
          Constants,
          {
            anonymous_id: anonymousId,
          },
          {},
          undefined
        );
        rootNavigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'BottomTabNavigator',
                params: {
                  screen: 'HomeStack',
                  params: { screen: 'HomeScreen' },
                },
              },
            ],
          })
        );
      } else {
        rootNavigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'BeginScreen',
                params: {
                  retakeQuizFlow: false,
                },
              },
            ],
          })
        );
      }
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    } finally {
      setIsContinuing(false);
    }
  };
  onContinueRef.current = onContinue;

  return (
    <View
      style={StyleSheet.applyWidth(
        StyleSheet.compose(styles.root, {
          backgroundColor: theme.colors.background.brand,
        }),
        dimensions.width
      )}
    >
      <StatusBar barStyle="light-content" />
      {!isMeditationLesson && (
        <View
          style={StyleSheet.applyWidth(styles.imageCover, dimensions.width)}
        >
          {lesson?.artwork ? (
            <Image
              source={{ uri: lesson.artwork }}
              style={StyleSheet.applyWidth(styles.imageCover, dimensions.width)}
              contentFit="cover"
              cachePolicy="disk"
              recyclingKey={lesson.artwork}
            />
          ) : null}
        </View>
      )}
      <LinearGradient
        startX={0}
        startY={0}
        {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].props}
        color1={palettes.App.Black_Alpha_80}
        color2={'rgba(0, 0, 0, 0)'}
        color3={palettes.App.Black_Alpha_80}
        endX={0}
        endY={90}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
            styles.gradientOverlay
          ),
          dimensions.width
        )}
      >
        <View style={StyleSheet.applyWidth(styles.header, dimensions.width)}>
          {!isOnboardingPlayer ? (
            <Pressable onPress={handleClose} activeOpacity={0.3}>
              <View
                style={StyleSheet.applyWidth(
                  styles.headerButton,
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes.App['Custom Color']}
                  name={'Ionicons/close'}
                  size={32}
                />
              </View>
            </Pressable>
          ) : (
            <View
              style={StyleSheet.applyWidth(
                styles.headerButton,
                dimensions.width
              )}
            />
          )}
          {isOnboardingPlayer ? (
            <Pressable
              onPress={onContinue}
              activeOpacity={0.3}
              style={StyleSheet.applyWidth(
                styles.continueButton,
                dimensions.width
              )}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleMinimize} activeOpacity={0.3}>
              <View
                style={StyleSheet.applyWidth(
                  styles.headerButton,
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes.App['Custom Color']}
                  name={'MaterialIcons/keyboard-arrow-down'}
                  size={37}
                />
              </View>
            </Pressable>
          )}
        </View>

        <View style={StyleSheet.applyWidth(styles.container, dimensions.width)}>
          <View style={StyleSheet.applyWidth(styles.topView, dimensions.width)}>
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  StyleSheet.compose(styles.titleText, {
                    color: appFontColor,
                  })
                ),
                dimensions.width
              )}
            >
              {lesson?.title}
            </Text>
            {lesson?.sub_title ? (
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    StyleSheet.compose(styles.subTitleText, {
                      color: appFontColor,
                    })
                  ),
                  dimensions.width
                )}
              >
                {lesson?.sub_title}
              </Text>
            ) : null}
          </View>

          <View
            style={StyleSheet.applyWidth(styles.middleView, dimensions.width)}
          >
            {lesson && isMeditationLesson ? (
              <Utils.CustomCodeErrorBoundary>
                <CircularPlayerSlider.Index />
              </Utils.CustomCodeErrorBoundary>
            ) : null}
          </View>

          {lesson ? (
            <View
              style={StyleSheet.applyWidth(
                styles.controlsWrapper,
                dimensions.width
              )}
            >
              {!isMeditationLesson && (
                <View>
                  <Utils.CustomCodeErrorBoundary>
                    <CustomPlayerSlider.Index theme={theme} />
                  </Utils.CustomCodeErrorBoundary>
                  <View
                    style={StyleSheet.applyWidth(
                      styles.progressRow,
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
                          StyleSheet.compose(styles.timeStart, {
                            color: appFontColor,
                          })
                        ),
                        dimensions.width
                      )}
                    >
                      {Player_FormatMilliSeconds(displayPosition)}
                    </Text>
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          StyleSheet.compose(styles.timeEnd, {
                            color: appFontColor,
                          })
                        ),
                        dimensions.width
                      )}
                    >
                      {Player_FormatMilliSeconds(lesson?.duration)}
                    </Text>
                  </View>
                </View>
              )}

              <View
                style={StyleSheet.applyWidth(
                  styles.controlsRow,
                  dimensions.width
                )}
              >
                {!isMeditationLesson && (
                  <Pressable onPress={handleBackward} activeOpacity={0.3}>
                    <View
                      style={StyleSheet.applyWidth(
                        styles.controlButton,
                        dimensions.width
                      )}
                    >
                      <ExpoImage
                        allowDownscaling={true}
                        cachePolicy={'disk'}
                        contentPosition={'center'}
                        resizeMode={'cover'}
                        transitionDuration={300}
                        transitionEffect={'cross-dissolve'}
                        transitionTiming={'ease-in-out'}
                        {...GlobalStyles.ExpoImageStyles(theme)['Image 13']
                          .props}
                        source={imageSource(Images['Backward15Seconds'])}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ExpoImageStyles(theme)['Image 13']
                              .style,
                            styles.imageControl
                          ),
                          dimensions.width
                        )}
                      />
                    </View>
                  </Pressable>
                )}

                <Pressable onPress={handlePlayPause}>
                  <View
                    style={StyleSheet.applyWidth(
                      styles.playButton,
                      dimensions.width
                    )}
                  >
                    {Constants['PLAYER_STATE'] === 'buffering' ? (
                      <ActivityIndicator
                        animating={true}
                        hidesWhenStopped={true}
                        {...GlobalStyles.ActivityIndicatorStyles(theme)[
                          'Activity Indicator'
                        ].props}
                        color={palettes.App['Custom Color']}
                        size={'large'}
                        style={StyleSheet.applyWidth(
                          GlobalStyles.ActivityIndicatorStyles(theme)[
                            'Activity Indicator'
                          ].style,
                          dimensions.width
                        )}
                      />
                    ) : (
                      <View>
                        {Constants['PLAYER_STATE'] !== 'playing' && (
                          <Icon
                            color={palettes.App['Custom Color']}
                            name={'Ionicons/play'}
                            size={55}
                          />
                        )}
                        {Constants['PLAYER_STATE'] === 'playing' && (
                          <Icon
                            color={palettes.App['Custom Color']}
                            name={'MaterialIcons/pause'}
                            size={55}
                          />
                        )}
                      </View>
                    )}
                  </View>
                </Pressable>

                {!isMeditationLesson && (
                  <Pressable onPress={handleForward} activeOpacity={0.3}>
                    <View
                      style={StyleSheet.applyWidth(
                        styles.controlButton,
                        dimensions.width
                      )}
                    >
                      <ExpoImage
                        allowDownscaling={true}
                        cachePolicy={'disk'}
                        contentPosition={'center'}
                        resizeMode={'cover'}
                        transitionDuration={300}
                        transitionEffect={'cross-dissolve'}
                        transitionTiming={'ease-in-out'}
                        {...GlobalStyles.ExpoImageStyles(theme)['Image 14']
                          .props}
                        source={imageSource(Images['Forward15Seconds'])}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ExpoImageStyles(theme)['Image 14']
                              .style,
                            styles.imageControl
                          ),
                          dimensions.width
                        )}
                      />
                    </View>
                  </Pressable>
                )}
              </View>
            </View>
          ) : null}

          {lesson?.text_content?.length > 0 ? (
            <Utils.CustomCodeErrorBoundary>
              <ReadTheLesson.Index
                theme={theme}
                audioPan={noopPan}
                isOnboarding={true}
              />
            </Utils.CustomCodeErrorBoundary>
          ) : null}

          <View
            style={StyleSheet.applyWidth(
              StyleSheet.compose(styles.bottomSpace, { height: bottomHeight }),
              dimensions.width
            )}
          />
        </View>
      </LinearGradient>
      {isContinuing ? (
        <Animated.View
          style={[styles.continuingOverlay, { opacity: overlayOpacity }]}
          pointerEvents="auto"
        >
          <ActivityIndicator
            animating={true}
            color={palettes.App['Custom Color']}
            size="large"
          />
        </Animated.View>
      ) : null}
    </View>
  );
};

const Index = withTheme(CustomOnboardingPlayer);

export { Index };
