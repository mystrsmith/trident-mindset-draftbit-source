import palettes from '../themes/palettes';
import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  Dimensions,
  Platform,
  Modal,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  ScrollView,
} from 'react-native-gesture-handler';
import {
  goDownRead,
  goUpRead,
  isAllowScrollingContent,
  isPanningTextContent,
  isScrollingTextContent,
  reset,
  isFocusReadContent,
} from './PlayerAnimationValues';
import * as CustomMarkdown from '../custom-files/CustomMarkdown';
import useWindowDimensions from '../utils/useWindowDimensions';
import * as StyleSheet from '../utils/StyleSheet';
import * as GlobalVariables from '../config/GlobalVariableContext';
import { Icon, Pressable, Slider } from '@draftbit/ui';
import Images from '../config/Images';
import Player_FormatMilliSeconds from '../global-functions/Player_FormatMilliSeconds';
import Player_SeekBy from '../global-functions/Player_SeekBy';
import Player_SeekTo from '../global-functions/Player_SeekTo';
import Player_StopPlay from '../global-functions/Player_StopPlay';
import Player_TogglePlay from '../global-functions/Player_TogglePlay';
import SwipeUpRead from './SwipeUpRead';
import * as XanoBackendApi from '../apis/XanoBackendApi';
import showToastMessage from '../global-functions/showToastMessage';
import stopAllForegroundTasks from '../global-functions/stopAllForegroundTasks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ANDROID_OFFSET = Platform.select({
  ios: 0,
  android: StatusBar.currentHeight || 0,
});

const SNAP_TOP = SCREEN_HEIGHT + ANDROID_OFFSET;
const SNAP_BOTTOM = 0;
const PRE_EXPAND_HEIGHT = 120;

const springConfig = {
  mass: 1,
  damping: 40,
  stiffness: 160,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};
const Index = ({ theme, audioPan, isOnboarding = false }) => {
  const dimensions = useWindowDimensions();
  const translateY = useSharedValue(0);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showHighlightBanner, setShowHighlightBanner] = useState(true);
  const fontSizes = {
    ExtraLarge: 28,
    Large: 23,
    Medium: 18,
    Small: 14,
  };

  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  const currentlyPlayingLesson = Constants['CURRENTLY_PLAYING_LESSON'];
  const textContent = currentlyPlayingLesson?.text_content ?? '';
  const audioContent = currentlyPlayingLesson?.audio_content;
  const noAudioContent = audioContent === null;
  const isCategoryLesson = currentlyPlayingLesson?.isCategoryLesson;

  const xanoBackendCreateNotePOST = XanoBackendApi.useCreateNotePOST();

  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const screenHeight = Dimensions.get('screen').height;

  const ANDROID_OFFSET = Platform.select({
    ios: 0,
    android:
      (StatusBar.currentHeight || 0) +
      (screenHeight - windowHeight - (StatusBar.currentHeight || 0)),
  });

  const [selectedTextInfo, setSelectedTextInfo] = useState(null);
  const markdownRef = useRef(null);

  const handleTextSelection = async event => {
    if (Platform.OS === 'ios') {
      if (event.type === 'select') {
        setSelectedTextInfo({ content: event.content });
      } else {
        setSelectedTextInfo(null);
      }
    }
  };

  const handleSaveHighlight = async () => {
    if (Platform.OS === 'ios' && selectedTextInfo) {
      await onSelectionHighlight(selectedTextInfo.content);
      setSelectedTextInfo(null);
      if (markdownRef.current) {
        markdownRef.current.clearSelection();
      }
    }
  };

  const handleCancelHighlight = () => {
    if (Platform.OS === 'ios') {
      setSelectedTextInfo(null);
      if (markdownRef.current) {
        markdownRef.current.clearSelection();
      }
    }
  };

  const onSelectionHighlight = async event => {
    console.log('onSelectionHighlight', event);
    if (Platform.OS === 'ios') {
      showToastMessage(
        'Saved',
        'Your highlight has been saved to your Notebook'
      );
      await xanoBackendCreateNotePOST.mutateAsync({
        content: event,
        lesson_id: currentlyPlayingLesson?.id,
        type: 'lesson_note',
      })?.json;
    } else if (Platform.OS === 'android') {
      // Cancel or no content
      if (event?.eventType === 'Cancel' || !event?.content) {
        return;
      }
      showToastMessage(
        'Saved',
        'Your highlight has been saved to your Notebook'
      );
      await xanoBackendCreateNotePOST.mutateAsync({
        content: event?.content,
        lesson_id: currentlyPlayingLesson?.id,
        type: 'lesson_note',
      })?.json;
    }
  };

  const handleFontSizeChange = size => {
    setGlobalVariableValue({
      key: 'LESSON_FONT_SIZE',
      value: fontSizes[size],
    });
    setShowFontMenu(false);
  };

  const gesture = Gesture.Pan()
    // .enabled(translateY.value * -1 < SNAP_TOP - PRE_EXPAND_HEIGHT - 30)
    .simultaneousWithExternalGesture(audioPan)
    .onChange(event => {
      if (noAudioContent === true) {
        return;
      }
      if (isScrollingTextContent.value == true) {
        return;
      }
      if (isFocusReadContent.value === true) {
        return;
      }
      // Only allow upward movement (negative changeY)
      if (event.changeY < 0) {
        translateY.value += event.changeY;
      }
    })
    .onBegin(() => {
      isPanningTextContent.value = true;
    })
    .onEnd(() => {
      isPanningTextContent.value = false;
    })
    .onFinalize(event => {
      if (noAudioContent === true) {
        return;
      }
      // If is scrolling content, don't do anything
      if (isScrollingTextContent.value == true) {
        return;
      }
      // Prevent conflict with tap
      if (event.translationY === 0) {
        return;
      }

      if (isFocusReadContent.value === true) {
        return;
      }

      // Remove the logic for dragging down
      // Only handle upward movement
      if (event.translationY < 0) {
        translateY.value = withSpring(
          -SNAP_TOP + PRE_EXPAND_HEIGHT,
          springConfig,
          () => {
            isPanningTextContent.value = false;
            isFocusReadContent.value = true;
          }
        );
      } else {
        // If there's any downward movement, snap back to the current position
        translateY.value = withSpring(translateY.value, springConfig);
      }
    });

  useDerivedValue(() => {
    if (goUpRead.value) {
      translateY.value = withSpring(
        -SNAP_TOP + PRE_EXPAND_HEIGHT,
        springConfig,
        () => {
          goUpRead.value = false;
        }
      );
    }
    if (goDownRead.value) {
      translateY.value = withSpring(SNAP_BOTTOM, springConfig, () => {
        goDownRead.value = false;
      });
    }
  }, [goUpRead, goDownRead]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const contentOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [0, -SCREEN_HEIGHT + PRE_EXPAND_HEIGHT],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const readTheLessonOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateY.value,
        [0, -SCREEN_HEIGHT + PRE_EXPAND_HEIGHT],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const [isScrolling, setIsScrolling] = useState(false);

  const renderHeaderActions = () => {
    return (
      <Animated.View style={contentOpacity}>
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 6,
              paddingVertical: 10,
            },
            dimensions.width
          )}
        >
          {isOnboarding ? (
            <View style={{ width: 48, height: 48 }} />
          ) : (
            <Pressable
              onPress={() => {
                const handler = async () => {
                  try {
                    setGlobalVariableValue({
                      key: 'SHOW_LESSON_PLAYER',
                      value: false,
                    });
                    await Player_StopPlay(setGlobalVariableValue);
                    reset.value = true;
                    goDownRead.value = true;
                    isPanningTextContent.value = false;
                    isAllowScrollingContent.value = false;
                    isFocusReadContent.value = false;
                    isScrollingTextContent.value = false;
                    stopAllForegroundTasks();
                  } catch (err) {
                    console.error(err);
                  }
                };
                handler();
              }}
              activeOpacity={0.3}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    height: 48,
                    justifyContent: 'center',
                    width: 48,
                  },
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes.App['Custom Color']}
                  name={'Ionicons/close'}
                  size={30}
                />
              </View>
            </Pressable>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ position: 'relative' }}>
              <Pressable
                onPress={() => setShowFontMenu(!showFontMenu)}
                activeOpacity={0.3}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      height: 48,
                      justifyContent: 'center',
                      width: 48,
                    },
                    dimensions.width
                  )}
                >
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'MaterialCommunityIcons/format-letter-case'}
                    size={28}
                  />
                </View>
              </Pressable>
            </View>
            {!noAudioContent ? (
              <Pressable
                onPress={() => {
                  try {
                    setGlobalVariableValue({
                      key: 'SHOW_LESSON_PLAYER',
                      value: false,
                    });
                    goDownRead.value = true;
                    isPanningTextContent.value = false;
                    isAllowScrollingContent.value = false;
                    isFocusReadContent.value = false;
                    isScrollingTextContent.value = false;
                  } catch (err) {
                    console.error(err);
                  }
                }}
                activeOpacity={0.3}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      height: 48,
                      justifyContent: 'center',
                      width: 48,
                    },
                    dimensions.width
                  )}
                >
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'MaterialIcons/keyboard-arrow-down'}
                    size={36}
                  />
                </View>
              </Pressable>
            ) : null}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderReadTheLesson = () => {
    return (
      <Animated.View
        style={[styles.readTheLessonWrapper, readTheLessonOpacity]}
      >
        <View style={styles.readTheLessonRow}>
          <View style={{ width: 25 }} />
          <Text style={styles.readTheLessonText}>
            {isCategoryLesson ? 'Read the Episode Notes' : 'Read the lesson'}
          </Text>
          <Pressable
            onPress={() => {
              goUpRead.value = true;
              isAllowScrollingContent.value = true;
              isFocusReadContent.value = true;
            }}
          >
            <Icon
              color={palettes.App['Custom Color']}
              name={'Foundation/arrows-expand'}
              size={23}
            />
          </Pressable>
        </View>
        <SwipeUpRead />
      </Animated.View>
    );
  };

  const renderAudioActions = () => {
    if (noAudioContent) return null;
    return (
      <View
        style={StyleSheet.applyWidth(
          { flex: 0.35, justifyContent: 'center' },
          dimensions.width
        )}
      >
        {/* Progress */}
        <View>
          <Slider
            onValueChange={newSliderValue => {
              const handler = async () => {
                try {
                  await Player_SeekTo(newSliderValue);
                } catch (err) {
                  console.error(err);
                }
              };
              handler();
            }}
            {...GlobalStyles.SliderStyles(theme)['Slider'].props}
            defaultValue={Constants['PLAYER_POSITON']}
            maximumValue={Constants['CURRENTLY_PLAYING_LESSON']?.duration}
            minimumTrackTintColor={palettes.App['App Buttons Color']}
            style={StyleSheet.applyWidth(
              GlobalStyles.SliderStyles(theme)['Slider'].style,
              dimensions.width
            )}
            thumbTintColor={palettes.App['App Buttons Color']}
          />
          <View
            style={StyleSheet.applyWidth(
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 15,
                paddingTop: 0,
              },
              dimensions.width
            )}
          >
            {/* start */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: Constants['APP_FONT_COLOR'],
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 21,
                    textAlign: 'left',
                  }
                ),
                dimensions.width
              )}
            >
              {Player_FormatMilliSeconds(Constants['PLAYER_POSITON'])}
            </Text>
            {/* end */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: Constants['APP_FONT_COLOR'],
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 21,
                    textAlign: 'right',
                  }
                ),
                dimensions.width
              )}
            >
              {Player_FormatMilliSeconds(
                Constants['CURRENTLY_PLAYING_LESSON']?.duration
              )}
            </Text>
          </View>
        </View>
        {/* Controls */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flexDirection: 'row',
              height: 55,
              justifyContent: 'space-around',
            },
            dimensions.width
          )}
        >
          {/* Backward */}
          <Pressable
            onPress={() => {
              const handler = async () => {
                try {
                  await Player_SeekBy(-15);
                } catch (err) {
                  console.error(err);
                }
              };
              handler();
            }}
            activeOpacity={0.3}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  height: 48,
                  justifyContent: 'center',
                  width: 48,
                },
                dimensions.width
              )}
            >
              <Image
                resizeMode={'cover'}
                {...GlobalStyles.ImageStyles(theme)['Image'].props}
                source={Images.Backward15Seconds}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ImageStyles(theme)['Image'].style,
                    { height: 40, width: 40 }
                  ),
                  dimensions.width
                )}
              />
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              const handler = async () => {
                try {
                  if (Constants['PLAYER_STATE'] !== 'buffering') {
                    await Player_TogglePlay(setGlobalVariableValue);
                  } else {
                  }
                } catch (err) {
                  console.error(err);
                }
              };
              handler();
            }}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                dimensions.width
              )}
            >
              {/* Buffering */}
              <>
                {!(Constants['PLAYER_STATE'] === 'buffering') ? null : (
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
                )}
              </>
              {/* Not Buffering */}
              <>
                {!(Constants['PLAYER_STATE'] !== 'buffering') ? null : (
                  <View>
                    {/* PlayIcon */}
                    <>
                      {!(Constants['PLAYER_STATE'] !== 'playing') ? null : (
                        <Icon
                          color={palettes.App['Custom Color']}
                          name={'Ionicons/play'}
                          size={55}
                        />
                      )}
                    </>
                    {/* PauseIcon */}
                    <>
                      {!(Constants['PLAYER_STATE'] === 'playing') ? null : (
                        <Icon
                          color={palettes.App['Custom Color']}
                          name={'MaterialIcons/pause'}
                          size={55}
                        />
                      )}
                    </>
                  </View>
                )}
              </>
            </View>
          </Pressable>
          {/* Forward */}
          <Pressable
            onPress={() => {
              const handler = async () => {
                try {
                  await Player_SeekBy(15);
                } catch (err) {
                  console.error(err);
                }
              };
              handler();
            }}
            activeOpacity={0.3}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  height: 48,
                  justifyContent: 'center',
                  width: 48,
                },
                dimensions.width
              )}
            >
              <Image
                resizeMode={'cover'}
                {...GlobalStyles.ImageStyles(theme)['Image'].props}
                source={Images.Forward15Seconds}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ImageStyles(theme)['Image'].style,
                    { height: 40, width: 40 }
                  ),
                  dimensions.width
                )}
              />
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderFontSizeModal = () => {
    if (!showFontMenu) return null;

    const currentFontSize =
      Constants['LESSON_FONT_SIZE'] || fontSizes['Medium'];

    return (
      <>
        {/* Overlay */}
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
          }}
          onPress={() => setShowFontMenu(false)}
        />

        <View
          style={{
            position: 'absolute',
            top: 100,
            right: 15,
            backgroundColor: '#001166',
            borderRadius: 12,
            width: 180,
            zIndex: 9999,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: -8,
              right: 20,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: '#001166',
              zIndex: 10000,
            }}
          />

          {Object.keys(fontSizes).map((size, index) => {
            const fontSizeLabelDisplay =
              size === 'ExtraLarge' ? 'Extra Large' : size;
            return (
              <Pressable
                key={size}
                onPress={() => handleFontSizeChange(size)}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 18,
                  borderBottomWidth:
                    index === Object.keys(fontSizes).length - 1 ? 0 : 1,
                  borderBottomColor: 'rgba(255, 255, 255, 0.15)',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    fontFamily: 'Rasa_600SemiBold',
                    textAlign: 'left',
                  }}
                >
                  {fontSizeLabelDisplay}
                </Text>
                {currentFontSize === fontSizes[size] && (
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'Feather/check'}
                    size={20}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </>
    );
  };

  const renderHighlightBanner = () => {
    if (!showHighlightBanner || Constants['HIGHLIGHT_BANNER_ACKNOWLEDGED'])
      return null;

    return (
      <Animated.View style={[styles.highlightBanner, contentOpacity]}>
        <View style={styles.highlightBannerContent}>
          <Text style={styles.highlightBannerText}>
            Tap on text to save it to your Notebook
          </Text>
          <Pressable
            hitSlop={10}
            onPress={() => {
              setGlobalVariableValue({
                key: 'HIGHLIGHT_BANNER_ACKNOWLEDGED',
                value: true,
              });
              setShowHighlightBanner(false);
            }}
            style={styles.highlightBannerCloseButton}
          >
            <Icon
              color={palettes.App['Custom Color']}
              name={'Ionicons/close'}
              size={20}
            />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const renderSelectionBox = () => {
    if (!selectedTextInfo || Platform.OS !== 'ios') return null;

    return (
      <Animated.View style={[styles.selectionBox, contentOpacity]}>
        <View style={styles.selectionBoxContent}>
          <TouchableOpacity onPress={handleSaveHighlight}>
            <Text style={styles.selectionAction}>Save highlighted text</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelHighlight}>
            <Text style={styles.selectionAction}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        {renderReadTheLesson()}
        {renderHeaderActions()}
        {renderHighlightBanner()}
        {renderFontSizeModal()}
        {Platform.OS === 'ios' && renderSelectionBox()}
        <Animated.View style={[{ flex: 1 }, contentOpacity]}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
            style={{ flex: 0.65 }}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {
              setIsScrolling(true);
            }}
            onMomentumScrollEnd={() => {
              setIsScrolling(false);
              isScrollingTextContent.value = false;
            }}
            onScroll={({ nativeEvent }) => {
              isScrollingTextContent.value = true;
            }}
          >
            <CustomMarkdown.Component
              ref={markdownRef}
              content={textContent}
              selectable={true}
              isScrolling={isScrolling}
              onSelectionHighlight={
                Platform.OS === 'ios'
                  ? handleTextSelection
                  : React.useCallback(onSelectionHighlight, [])
              }
              fontSize={Constants['LESSON_FONT_SIZE'] || fontSizes['Medium']}
            />
          </ScrollView>
          {renderAudioActions()}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    zIndex: 9999,
    position: 'absolute',
    bottom: -SCREEN_HEIGHT + PRE_EXPAND_HEIGHT,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000F52',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  readTheLessonWrapper: {
    flexDirection: 'column',
    paddingHorizontal: 25,
  },
  readTheLessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  readTheLessonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Rasa_600SemiBold',
    textAlign: 'center',
  },
  highlightBanner: {
    backgroundColor: '#001D99',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  highlightBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightBannerText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Rasa_500Medium',
    paddingTop: 5,
  },
  highlightBannerCloseButton: {
    paddingTop: 2,
  },
  selectionBox: {
    position: 'absolute',
    top: 105,
    left: 0,
    right: 0,
    zIndex: 9999,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 15,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  selectionBoxContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectionAction: {
    fontSize: 16,
    fontFamily: 'Rasa_600SemiBold',
    color: '#007AFF',
    fontWeight: '600',
    paddingTop: 2,
  },
});

export { Index };
