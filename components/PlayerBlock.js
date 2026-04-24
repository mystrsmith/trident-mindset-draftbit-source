import React from 'react';
import {
  ExpoImage,
  Icon,
  LinearGradient,
  Pressable,
  Slider,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CircularPlayerSlider from '../custom-files/CircularPlayerSlider';
import * as CommonPackages from '../custom-files/CommonPackages';
import * as CustomCode from '../custom-files/CustomCode';
import * as CustomPlayerSlider from '../custom-files/CustomPlayerSlider';
import * as PlayerAnimationValues from '../custom-files/PlayerAnimationValues';
import * as ReadTheLesson from '../custom-files/ReadTheLesson';
import Player_FormatMilliSeconds from '../global-functions/Player_FormatMilliSeconds';
import Player_Pause from '../global-functions/Player_Pause';
import Player_Play from '../global-functions/Player_Play';
import Player_SeekBy from '../global-functions/Player_SeekBy';
import Player_SeekTo from '../global-functions/Player_SeekTo';
import Player_StopPlay from '../global-functions/Player_StopPlay';
import Player_TogglePlay from '../global-functions/Player_TogglePlay';
import stopAllForegroundTasks from '../global-functions/stopAllForegroundTasks';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const PlayerBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const customHeight = total => {
    return total - 100;
  };

  const isMeditation = Variables => {
    return Variables['CURRENTLY_PLAYING_LESSON']?.isMeditation === true;
  };

  const onCloseAnimation = () => {
    PlayerAnimationValues.reset.value = true;
  };

  const onMinimizeAnimation = () => {
    PlayerAnimationValues.goDownAudio.value = true;
  };
  // React.useEffect(() => {
  // const handler = async () => {
  //     try {
  //         const getImageColors = CommonPackages?.getImageColors;
  //         const darkenHexColor = CommonPackages?.darkenHexColor;
  //         const resultImageColors = await getImageColors(
  //             Constants["CURRENTLY_PLAYING_LESSON"]?.artwork,
  //         );
  //         setImageColor1(darkenHexColor(resultImageColors?.colorThree, 30));
  //         setImageColor2(darkenHexColor(resultImageColors?.colorThree, 85));
  //     } catch (err) {
  //         console.error(err);
  //     }
  // };
  // handler();
  // }, [Constants["CURRENTLY_PLAYING_LESSON"]?.artwork]);

  return (
    <View
      style={StyleSheet.applyWidth(
        {
          alignItems: 'stretch',
          backgroundColor: theme.colors.background.brand,
          flex: 1,
          justifyContent: 'space-between',
        },
        dimensions.width
      )}
    >
      <>
        {isMeditation(Variables) ? null : (
          <ExpoImage
            allowDownscaling={true}
            cachePolicy={'disk'}
            contentPosition={'center'}
            resizeMode={'cover'}
            transitionEffect={'cross-dissolve'}
            {...GlobalStyles.ExpoImageStyles(theme)['Image 2'].props}
            source={imageSource(
              `${
                isMeditation(Variables)
                  ? ''
                  : Constants['CURRENTLY_PLAYING_LESSON']?.artwork
              }`
            )}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ExpoImageStyles(theme)['Image 2'].style,
                { height: '100%', position: 'absolute', width: '100%' }
              ),
              dimensions.width
            )}
            transitionDuration={1000}
            transitionTiming={'linear'}
          />
        )}
      </>
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
            { height: '100%', position: 'absolute', width: '100%' }
          ),
          dimensions.width
        )}
      >
        {/* Header */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: Platform.OS === 'ios' ? 45 : 20,
              width: '100%',
            },
            dimensions.width
          )}
        >
          {/* Close */}
          <Pressable
            onPress={() => {
              const handler = async () => {
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
                size={32}
              />
            </View>
          </Pressable>
          {/* Minimize */}
          <Pressable
            onPress={() => {
              const handler = async () => {
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
                name={'MaterialIcons/keyboard-arrow-down'}
                size={37}
              />
            </View>
          </Pressable>
        </View>
        {/* Container */}
        <View
          style={StyleSheet.applyWidth(
            { flex: 1, justifyContent: 'space-between', marginTop: 15 },
            dimensions.width
          )}
        >
          {/* Top View */}
          <View
            style={StyleSheet.applyWidth(
              { paddingLeft: 20, paddingRight: 20 },
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
                    color: Constants['APP_FONT_COLOR'],
                    fontFamily: 'Rasa_700Bold',
                    fontSize: 36,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {Constants['CURRENTLY_PLAYING_LESSON']?.title}
            </Text>
            <>
              {!Constants['CURRENTLY_PLAYING_LESSON']?.sub_title ? null : (
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: Constants['APP_FONT_COLOR'],
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 23,
                        marginTop: 8,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {Constants['CURRENTLY_PLAYING_LESSON']?.sub_title}
                </Text>
              )}
            </>
          </View>
          {/* Middle View */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                marginLeft: 20,
                marginRight: 20,
              },
              dimensions.width
            )}
          >
            <>
              {!(
                Constants['CURRENTLY_PLAYING_LESSON'] && isMeditation(Variables)
              ) ? null : (
                <Utils.CustomCodeErrorBoundary>
                  <CircularPlayerSlider.Index />
                </Utils.CustomCodeErrorBoundary>
              )}
            </>
          </View>
          {/* Controls */}
          <>
            {!Constants['CURRENTLY_PLAYING_LESSON'] ? null : (
              <View
                style={StyleSheet.applyWidth(
                  { justifyContent: 'space-between' },
                  dimensions.width
                )}
              >
                {/* Progress */}
                <>
                  {isMeditation(Variables) ? null : (
                    <View>
                      <Utils.CustomCodeErrorBoundary>
                        <CustomPlayerSlider.Index {...{ theme }} />
                      </Utils.CustomCodeErrorBoundary>
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
                          selectable={false}
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
                          {Player_FormatMilliSeconds(
                            Constants['PLAYER_POSITON']
                          )}
                        </Text>
                        {/* end */}
                        <Text
                          accessible={true}
                          selectable={false}
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
                  )}
                </>
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
                  <>
                    {isMeditation(Variables) ? null : (
                      <Pressable
                        onPress={() => {
                          const handler = async () => {
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
                                { height: 40, width: 40 }
                              ),
                              dimensions.width
                            )}
                          />
                        </View>
                      </Pressable>
                    )}
                  </>
                  <Pressable
                    onPress={() => {
                      const handler = async () => {
                        try {
                          if (Constants['PLAYER_STATE'] !== 'buffering') {
                            await Player_TogglePlay(setGlobalVariableValue);
                          } else {
                          }
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                  >
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          height: 50,
                          justifyContent: 'center',
                          width: 50,
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
                              {!(
                                Constants['PLAYER_STATE'] !== 'playing'
                              ) ? null : (
                                <Icon
                                  color={palettes.App['Custom Color']}
                                  name={'Ionicons/play'}
                                  size={55}
                                />
                              )}
                            </>
                            {/* PauseIcon */}
                            <>
                              {!(
                                Constants['PLAYER_STATE'] === 'playing'
                              ) ? null : (
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
                  <>
                    {isMeditation(Variables) ? null : (
                      <Pressable
                        onPress={() => {
                          const handler = async () => {
                            try {
                              if (
                                Constants['PLAYER_POSITON'] + 15000 >
                                Constants['CURRENTLY_PLAYING_LESSON']?.duration
                              ) {
                                await setGlobalVariableValue({
                                  key: 'PLAYER_POSITON',
                                  value:
                                    Constants['CURRENTLY_PLAYING_LESSON']
                                      ?.duration,
                                });
                                await Player_SeekTo(
                                  Constants['CURRENTLY_PLAYING_LESSON']
                                    ?.duration
                                );
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
                                { height: 40, width: 40 }
                              ),
                              dimensions.width
                            )}
                          />
                        </View>
                      </Pressable>
                    )}
                  </>
                </View>
              </View>
            )}
          </>
          <>
            {!(
              Constants['CURRENTLY_PLAYING_LESSON']?.text_content?.length > 0
            ) ? null : (
              <Utils.CustomCodeErrorBoundary>
                <ReadTheLesson.Index theme={theme} audioPan={props?.audioPan} />
              </Utils.CustomCodeErrorBoundary>
            )}
          </>
          {/* Bottom Space */}
          <View
            style={StyleSheet.applyWidth(
              {
                height:
                  Constants['CURRENTLY_PLAYING_LESSON']?.isMeditation === true
                    ? 50
                    : 145,
              },
              dimensions.width
            )}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default withTheme(PlayerBlock);
