import React from 'react';
import { Icon, Pressable, Slider, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
  Text,
  View,
} from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import Player_FormatMilliSeconds from '../global-functions/Player_FormatMilliSeconds';
import Player_SeekBy from '../global-functions/Player_SeekBy';
import Player_SeekTo from '../global-functions/Player_SeekTo';
import Player_StopPlay from '../global-functions/Player_StopPlay';
import Player_TogglePlay from '../global-functions/Player_TogglePlay';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const PlayLessonModalBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const customHeight = total => {
    return total - 100;
  };

  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      transparent={false}
      animationType={'slide'}
      visible={Boolean(Constants['SHOW_LESSON_PLAYER'])}
    >
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'stretch',
            backgroundColor: theme.colors.background.brand,
            flex: 1,
            justifyContent: 'space-between',
            paddingBottom: 40,
          },
          dimensions.width
        )}
      >
        {/* Dynamic BG */}
        <ImageBackground
          {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background']
            .props}
          resizeMode={'stretch'}
          source={imageSource(
            `${Constants['CURRENTLY_PLAYING_LESSON']?.artwork}`
          )}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ImageBackgroundStyles(theme)['Image Background']
                .style,
              {
                bottom: 0,
                left: 0,
                opacity: 1,
                position: 'absolute',
                right: 0,
                top: 0,
              }
            ),
            dimensions.width
          )}
        />
        {/* Header */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 40,
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
                name={'Entypo/cross'}
                size={35}
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
                size={35}
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
          <View>
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: Constants['APP_FONT_COLOR'],
                    fontFamily: 'Inter_700Bold',
                    fontSize: 28,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {Constants['CURRENTLY_PLAYING_LESSON']?.title}
            </Text>

            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: Constants['APP_FONT_COLOR'],
                    fontFamily: 'Inter_300Light',
                    fontSize: 18,
                    marginTop: 8,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {Constants['CURRENTLY_PLAYING_LESSON']?.sub_title}
            </Text>
          </View>
          {/* Middle View */}
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'center', flex: 1, justifyContent: 'center' },
              dimensions.width
            )}
          />
          {/* Controls */}
          <View
            style={StyleSheet.applyWidth(
              { flex: 0.4, justifyContent: 'space-between' },
              dimensions.width
            )}
          >
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
                  <Image
                    resizeMode={'cover'}
                    {...GlobalStyles.ImageStyles(theme)['Image'].props}
                    source={imageSource(Images['Backward15Seconds'])}
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
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  };
                  handler();
                }}
              >
                <View
                  style={StyleSheet.applyWidth(
                    { height: 50, width: 50 },
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
                  <Image
                    resizeMode={'cover'}
                    {...GlobalStyles.ImageStyles(theme)['Image'].props}
                    source={imageSource(Images['Forward15Seconds'])}
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
            {/* Progress */}
            <View>
              <Slider
                onValueChange={newSliderValue => {
                  const handler = async () => {
                    try {
                      await Player_SeekTo(newSliderValue);
                    } catch (err) {
                      Sentry.captureException(err);
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
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: Constants['APP_FONT_COLOR'],
                        fontFamily: 'Inter_600SemiBold',
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
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: Constants['APP_FONT_COLOR'],
                        fontFamily: 'Inter_600SemiBold',
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
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default withTheme(PlayLessonModalBlock);
