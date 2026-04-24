import React from 'react';
import { Circle, Icon, Link, Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Platform, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import Player_LoadAndPlay from '../global-functions/Player_LoadAndPlay';
import checkPostNotifications from '../global-functions/checkPostNotifications';
import onAnimateFullScreenPlayer from '../global-functions/onAnimateFullScreenPlayer';
import startMediaForegroundServiceTask from '../global-functions/startMediaForegroundServiceTask';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import hapticFeedbackUtil from '../utils/hapticFeedback';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = {
  isDayCompleted: false,
  item: null,
  onPressCircleComplete: () => {},
};

const AdvanceProgramLessonItemBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation(props.navigation);
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [isActivityCompleted, setIsActivityCompleted] = React.useState(
    (props.item ?? defaultProps.item)?.is_completed
  );
  const [visibleCollapsible, setVisibleCollapsible] = React.useState(false);
  const handleShouldisable = (isDayCompleted, isActionCompleted) => {
    if (isDayCompleted) {
      return true;
    }
    return isActionCompleted;
  };

  return (
    <View
      onLayout={event => {
        try {
          console.log((props.item ?? defaultProps.item)?.type);
        } catch (err) {
          Sentry.captureException(err);
          console.error(err);
        }
      }}
    >
      {/* Container */}
      <View
        style={StyleSheet.applyWidth(
          {
            backgroundColor: palettes.App['Advance Card'],
            borderRadius: 20,
            paddingBottom: 15,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 15,
            position: 'relative',
          },
          dimensions.width
        )}
      >
        <Pressable
          onPress={() => {
            const handler = async () => {
              try {
                await hapticFeedbackUtil({
                  feedbackIntensity: 'medium',
                });

                if (
                  (props.item ?? defaultProps.item)?.type === 'AUDIO_WRITTEN'
                ) {
                  if (Platform.OS === 'android') {
                    await checkPostNotifications();
                  }
                  await onAnimateFullScreenPlayer(
                    props.item ?? defaultProps.item
                  );
                  await Player_LoadAndPlay(
                    Variables,
                    setGlobalVariableValue,
                    props.item ?? defaultProps.item
                  );
                  if (Platform.OS === 'android') {
                    startMediaForegroundServiceTask();
                  }
                } else {
                }

                if ((props.item ?? defaultProps.item)?.type === 'COLLAPSIBLE') {
                  setVisibleCollapsible(!visibleCollapsible);
                } else {
                }

                if ((props.item ?? defaultProps.item)?.type === 'MEDITATION') {
                  setVisibleCollapsible(!visibleCollapsible);
                } else {
                }
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            };
            handler();
          }}
          activeOpacity={1}
          disabled={Boolean(
            (props.item ?? defaultProps.item)?.type === 'TEXT_ONLY'
          )}
          disabledOpacity={1}
        >
          {/* Card Visible */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
              dimensions.width
            )}
          >
            {/* Points Wrapper */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', flex: 1, flexDirection: 'row' },
                dimensions.width
              )}
            >
              {/* Complete Circle */}
              <Pressable
                onPress={() => {
                  const handler = async () => {
                    try {
                      await hapticFeedbackUtil({
                        feedbackIntensity: 'medium',
                      });

                      setIsActivityCompleted(!isActivityCompleted);
                      props.onPressCircleComplete?.();
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  };
                  handler();
                }}
                disabled={Boolean(
                  props.isDayCompleted ?? defaultProps.isDayCompleted
                )}
                disabledOpacity={1}
              >
                <Circle
                  {...GlobalStyles.CircleStyles(theme)['Circle'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.CircleStyles(theme)['Circle'].style,
                      {
                        backgroundColor: [
                          { minWidth: Breakpoints.Mobile, value: null },
                          {
                            minWidth: Breakpoints.Mobile,
                            value: isActivityCompleted
                              ? palettes.Brand['Red 1']
                              : palettes.App.Black,
                          },
                        ],
                        borderColor: [
                          {
                            minWidth: Breakpoints.Mobile,
                            value: palettes.App.Black,
                          },
                          {
                            minWidth: Breakpoints.Mobile,
                            value: isActivityCompleted
                              ? palettes.Brand['Red 1']
                              : undefined,
                          },
                        ],
                        borderWidth: 1,
                        height: 40,
                        width: 40,
                      }
                    ),
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
                          color: palettes.App.White,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 16,
                          paddingTop: 2,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {(props.item ?? defaultProps.item)?.points}
                  </Text>
                </Circle>
              </Pressable>
              {/* Title */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.Brand.Surface,
                      flex: 1,
                      fontFamily: 'Rasa_400Regular',
                      fontSize: 18,
                      paddingLeft: 15,
                      paddingRight: 15,
                    }
                  ),
                  dimensions.width
                )}
              >
                {(props.item ?? defaultProps.item)?.title}
              </Text>
            </View>
            {/* Drop Icon */}
            <>
              {!(props.item ?? defaultProps.item)?.show_arrow_icon ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    { paddingLeft: 10 },
                    dimensions.width
                  )}
                >
                  <Icon
                    color={palettes.App.White}
                    name={
                      (props.item ?? defaultProps.item)?.type ===
                      'AUDIO_WRITTEN'
                        ? 'Entypo/controller-play'
                        : 'Entypo/chevron-down'
                    }
                    size={20}
                  />
                </View>
              )}
            </>
          </View>
        </Pressable>
        {/* Collapsible Wrapper */}
        <>
          {!visibleCollapsible ? null : (
            <View
              style={StyleSheet.applyWidth(
                { paddingTop: 10, width: '100%' },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  { paddingBottom: 8, paddingTop: 8 },
                  dimensions.width
                )}
              >
                <>
                  {!(
                    (props.item ?? defaultProps.item)?.type === 'COLLAPSIBLE'
                  ) ? null : (
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.App.White,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 17,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {(props.item ?? defaultProps.item)?.description}
                    </Text>
                  )}
                </>
                {/* Meditation Text */}
                <>
                  {!(
                    (props.item ?? defaultProps.item)?.type === 'MEDITATION'
                  ) ? null : (
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.App.White,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 17,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Click '}
                      <Link
                        accessible={true}
                        onPress={() => {
                          try {
                            navigation.navigate(
                              'DesignYourMeditationScreen',
                              {}
                            );
                          } catch (err) {
                            Sentry.captureException(err);
                            console.error(err);
                          }
                        }}
                        selectable={false}
                        {...GlobalStyles.LinkStyles(theme)['Link'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.LinkStyles(theme)['Link'].style,
                            {
                              color: palettes.Brand['Red 1'],
                              fontFamily: 'Rasa_400Regular',
                              fontSize: 17,
                              textDecorationLine: 'underline',
                            }
                          ),
                          dimensions.width
                        )}
                        title={'here'}
                      />
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.App.White,
                              fontFamily: 'Rasa_400Regular',
                              fontSize: 17,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {' to use the Meditation timer.'}
                      </Text>
                    </Text>
                  )}
                </>
              </View>
            </View>
          )}
        </>
      </View>
    </View>
  );
};

export default withTheme(AdvanceProgramLessonItemBlock);
