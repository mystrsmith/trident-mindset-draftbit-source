import React from 'react';
import {
  Button,
  Divider,
  ExpoImage,
  Icon,
  LinearGradient,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  Slider,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import * as CustomGlowingTextInput from '../custom-files/CustomGlowingTextInput';
import * as CustomRangeSlider from '../custom-files/CustomRangeSlider';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import hapticFeedbackUtil from '../utils/hapticFeedback';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const NightlyIntentionalityCheckInScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [checkInAnswers, setCheckInAnswers] = React.useState([]);
  const [happinessRating, setHappinessRating] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingButton, setIsLoadingButton] = React.useState(false);
  const [stressRating, setStressRating] = React.useState(0);
  const [visibleModalAddJournal, setVisibleModalAddJournal] =
    React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);
  const getQuestionsArray = Variables => {
    return (
      Variables['APP_CONFIG']?.nightly_intentionality_check_in_questions || []
    );
  };

  const hasAnyAnswer = answers => {
    return answers?.some(answer => answer && answer.trim() !== '');
  };

  const initializeCheckInAnswers = questions => {
    if (questions && questions.length > 0) {
      const currentAnswers = Array.isArray(checkInAnswers)
        ? checkInAnswers
        : [];
      if (currentAnswers.length !== questions.length) {
        const initialAnswers = new Array(questions.length).fill('');
        return initialAnswers;
      }
    }
    return checkInAnswers || [];
  };

  const onChangeCheckInAnswer = (index, newText) => {
    const currentAnswers = Array.isArray(checkInAnswers) ? checkInAnswers : [];
    const updatedAnswers = [...currentAnswers];
    while (updatedAnswers.length <= index) {
      updatedAnswers.push('');
    }
    updatedAnswers[index] = newText || '';
    setCheckInAnswers(updatedAnswers);
  };
  // Reset all check-in inputs when user navigates away from this screen
  React.useEffect(() => {
    if (!isFocused) {
      setCheckInAnswers([]);
    }
  }, [isFocused]);
  const xanoBackendCreateCheckinNotePOST =
    XanoBackendApi.useCreateCheckinNotePOST();
  const xanoBackendCreateEmotionalMetricPOST =
    XanoBackendApi.useCreateEmotionalMetricPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setCheckInAnswers(
          initializeCheckInAnswers(
            Constants['APP_CONFIG']?.nightly_intentionality_check_in_questions
          )
        );
        const res = (await XanoBackendApi.getAppConfigGET(Constants, {}))?.json;
        await setGlobalVariableValue({
          key: 'APP_CONFIG',
          value: res,
        });
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
    <ScreenContainer hasSafeArea={false} scrollable={false}>
      {/* Container */}
      <View
        style={StyleSheet.applyWidth(
          {
            backgroundColor: palettes.App.Black,
            flex: 1,
            paddingBottom: safeAreaInsets.bottom,
            paddingTop: safeAreaInsets.top,
          },
          dimensions.width
        )}
      >
        <LinearGradient
          startX={0}
          startY={0}
          {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].props}
          color1={palettes.App.Black_Alpha_80}
          color2={palettes.App['Background 90 Opacity']}
          color3={palettes.App.Black_Alpha_80}
          endX={0}
          endY={90}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
              { height: '100%', opacity: 1, width: '100%' }
            ),
            dimensions.width
          )}
        >
          {/* Completed State */}
          <View
            style={StyleSheet.applyWidth(
              { flex: 1, position: 'relative' },
              dimensions.width
            )}
          >
            {/* Header */}
            <View
              style={StyleSheet.applyWidth(
                { paddingLeft: 20, paddingRight: 20 },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  { flexDirection: 'row', justifyContent: 'flex-end' },
                  dimensions.width
                )}
              >
                <Pressable
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                >
                  <View>
                    <Icon
                      color={palettes.App.Studily_White}
                      name={'Feather/x'}
                      size={32}
                    />
                  </View>
                </Pressable>
              </View>
            </View>

            <SimpleStyleKeyboardAwareScrollView
              enableOnAndroid={false}
              enableResetScrollToCoords={false}
              keyboardShouldPersistTaps={'never'}
              showsVerticalScrollIndicator={true}
              viewIsInsideTabBar={false}
              enableAutomaticScroll={true}
              style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
            >
              {/* View 2 */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    gap: 8,
                    justifyContent: 'center',
                    marginTop: 20,
                    paddingLeft: 20,
                    paddingRight: 20,
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
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 32,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Nightly Intentionality\nCheck-In'}
                </Text>
                {/* Text 2 */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 20,
                        marginTop: 5,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'What gets measured gets improved'}
                </Text>
                {/* Text 3 */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 15,
                        marginTop: 5,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    'You can view your completed entries in the Notebook section of the app.'
                  }
                </Text>
              </View>
              {/* Slider */}
              <View
                style={StyleSheet.applyWidth(
                  { paddingTop: 10 },
                  dimensions.width
                )}
              >
                {/* Happy */}
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
                          color: palettes.Brand.Surface,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 18,
                          marginTop: 5,
                          textAlign: 'left',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'How happy are you? '}
                  </Text>
                  <Utils.CustomCodeErrorBoundary>
                    <CustomRangeSlider.Index
                      maximumValue={100}
                      minimumTrackColor={palettes.App['True Blue']}
                      minimumValue={0}
                      onValueChange={newSliderValue => {
                        setHappinessRating(newSliderValue);
                      }}
                      step={10}
                      thumbColor={palettes.App['True Blue']}
                      trackColor={palettes.Brand.Surface}
                      value={happinessRating}
                    />
                  </Utils.CustomCodeErrorBoundary>
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      },
                      dimensions.width
                    )}
                  >
                    {/* 0 */}
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.Brand.Surface,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 13,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'0'}
                    </Text>
                    {/* Very happy */}
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.Brand.Surface,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 13,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'100 (Very happy)'}
                    </Text>
                  </View>
                </View>
                {/* Stress */}
                <View
                  style={StyleSheet.applyWidth(
                    { marginTop: 30, paddingLeft: 20, paddingRight: 20 },
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
                          fontSize: 18,
                          marginTop: 5,
                          textAlign: 'left',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'How stressed do you feel?'}
                  </Text>
                  {/* Custom Code 2 */}
                  <Utils.CustomCodeErrorBoundary>
                    <CustomRangeSlider.Index
                      maximumValue={100}
                      minimumTrackColor={palettes.App['True Blue']}
                      minimumValue={0}
                      onValueChange={newSliderValue => {
                        setStressRating(newSliderValue);
                      }}
                      step={10}
                      thumbColor={palettes.App['True Blue']}
                      trackColor={palettes.Brand.Surface}
                      value={stressRating}
                    />
                  </Utils.CustomCodeErrorBoundary>
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      },
                      dimensions.width
                    )}
                  >
                    {/* 0 */}
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.Brand.Surface,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 13,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'0 (Not at all)'}
                    </Text>
                    {/* Very happy */}
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.Brand.Surface,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 13,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'100'}
                    </Text>
                  </View>
                </View>
                <Divider
                  {...GlobalStyles.DividerStyles(theme)['Divider'].props}
                  color={palettes.App.Outline}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.DividerStyles(theme)['Divider'].style,
                      { marginBottom: 15, marginTop: 40 }
                    ),
                    dimensions.width
                  )}
                />
                <SimpleStyleFlatList
                  data={
                    Constants['APP_CONFIG']
                      ?.nightly_intentionality_check_in_questions
                  }
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
                    'Container->Linear Gradient->Completed State->Keyboard Aware Scroll View->Slider->List'
                  }
                  nestedScrollEnabled={false}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  pagingEnabled={false}
                  renderItem={({ item, index }) => {
                    const listData = item;
                    return (
                      <>
                        {/* Question */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              marginTop: 25,
                              paddingLeft: 20,
                              paddingRight: 20,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Row */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginBottom: 10,
                              },
                              dimensions.width
                            )}
                          >
                            <ExpoImage
                              allowDownscaling={true}
                              cachePolicy={'disk'}
                              contentPosition={'center'}
                              transitionDuration={300}
                              transitionEffect={'cross-dissolve'}
                              transitionTiming={'ease-in-out'}
                              {...GlobalStyles.ExpoImageStyles(theme)['Image 2']
                                .props}
                              resizeMode={'contain'}
                              source={imageSource(Images['IcBrain'])}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.ExpoImageStyles(theme)['Image 2']
                                    .style,
                                  { height: 25, width: 25 }
                                ),
                                dimensions.width
                              )}
                            />
                            {/* Text 2 */}
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
                                    fontFamily: 'Rasa_500Medium',
                                    fontSize: 18,
                                    paddingLeft: 10,
                                  }
                                ),
                                dimensions.width
                              )}
                            >
                              {listData}
                            </Text>
                          </View>
                          <Utils.CustomCodeErrorBoundary>
                            <CustomGlowingTextInput.Index
                              onChangeText={newTextAreaValue => {
                                onChangeCheckInAnswer(index, newTextAreaValue);
                              }}
                              value={checkInAnswers[index] || ''}
                            />
                          </Utils.CustomCodeErrorBoundary>
                        </View>
                      </>
                    );
                  }}
                  showsHorizontalScrollIndicator={true}
                  showsVerticalScrollIndicator={true}
                  snapToAlignment={'start'}
                />
              </View>
              {/* Bottom */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    marginTop: 16,
                  },
                  dimensions.width
                )}
              >
                {/* Complete */}
                <Button
                  accessible={true}
                  iconPosition={'left'}
                  onPress={() => {
                    const handler = async () => {
                      try {
                        await hapticFeedbackUtil({
                          feedbackIntensity: 'medium',
                        });

                        setIsLoadingButton(true);
                        const resultEmotionalMetric = (
                          await xanoBackendCreateEmotionalMetricPOST.mutateAsync(
                            {
                              happiness_rating: happinessRating,
                              stress_rating: stressRating,
                            }
                          )
                        )?.json;
                        if (hasAnyAnswer(checkInAnswers)) {
                          const resultCheckInNotes = (
                            await xanoBackendCreateCheckinNotePOST.mutateAsync({
                              answers: checkInAnswers,
                              questions:
                                Constants['APP_CONFIG']
                                  ?.nightly_intentionality_check_in_questions,
                            })
                          )?.json;
                        } else {
                        }

                        setHappinessRating(0);
                        setStressRating(0);
                        setIsLoadingButton(false);
                        navigation.navigate('CelebrationScreen', {});
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    };
                    handler();
                  }}
                  {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                  disabled={Boolean(isLoadingButton)}
                  disabledOpacity={0.7}
                  loading={Boolean(isLoadingButton)}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.ButtonStyles(theme)['Button'].style,
                      {
                        backgroundColor: palettes.App['True Blue'],
                        borderRadius: 100,
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 16,
                        paddingTop: 2,
                        width: 200,
                      }
                    ),
                    dimensions.width
                  )}
                  title={'Complete Check-In'}
                />
              </View>
            </SimpleStyleKeyboardAwareScrollView>
          </View>
        </LinearGradient>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(NightlyIntentionalityCheckInScreen);
