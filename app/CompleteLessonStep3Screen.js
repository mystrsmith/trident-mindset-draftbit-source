import React from 'react';
import {
  Button,
  Divider,
  IconButton,
  LinearGradient,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  Slider,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, Modal, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import * as DismissKeyboardView from '../custom-files/DismissKeyboardView';
import generateCheckinNotesQuestionAnswer from '../global-functions/generateCheckinNotesQuestionAnswer';
import getTodayDate from '../global-functions/getTodayDate';
import showToastMessage from '../global-functions/showToastMessage';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { lessonDetailResponseParam: null };

const CompleteLessonStep3Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
  const forceSmallestCoinPercentage = percentage => {
    if (percentage === 0) {
      return 0.01;
    }
    return percentage;
  };

  const initializeCheckInAnswers = () => {
    return Array(Constants['APP_CONFIG']?.checkin_questions?.length || 0).fill(
      ''
    );
  };
  const [checkInAnswers, setCheckInAnswers] = React.useState(
    initializeCheckInAnswers()
  );
  const [happinessRating, setHappinessRating] = React.useState(50);
  const [isLoadingAddJournal, setIsLoadingAddJournal] = React.useState(false);
  const [isLoadingButton, setIsLoadingButton] = React.useState(false);
  const [lessonDetailResponse, setLessonDetailResponse] = React.useState(
    params?.lessonDetailResponseParam ?? defaultProps.lessonDetailResponseParam
  );
  const [stressRating, setStressRating] = React.useState(50);
  const [todayCheckInNote, setTodayCheckInNote] = React.useState(null);
  const [visibleModalAddJournal, setVisibleModalAddJournal] =
    React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);
  const checkInAnswersAtIndex = (checkInAnswers, index) => {
    return checkInAnswers[index];
  };

  const onChangeCheckInAnswer = (checkInAnswers, newTextAreaValue, index) => {
    const updatedAnswers = [...checkInAnswers];
    updatedAnswers[index] = newTextAreaValue;
    setCheckInAnswers(updatedAnswers);
  };
  const xanoBackendCreateEmotionalMetricPOST =
    XanoBackendApi.useCreateEmotionalMetricPOST();
  const xanoBackendUpdateCheckInNotePATCH =
    XanoBackendApi.useUpdateCheckInNotePATCH();
  const xanoBackendCreateCheckinNotePOST =
    XanoBackendApi.useCreateCheckinNotePOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        const resultLessonDetail = (
          await XanoBackendApi.getLessonDetailsGET(Constants, {
            lesson_id: (
              params?.lessonDetailResponseParam ??
              defaultProps.lessonDetailResponseParam
            )?.current_lesson?.id,
          })
        )?.json;
        setLessonDetailResponse(resultLessonDetail);
        const todayCheckInNote = (
          await XanoBackendApi.getTodayCheckinNoteGET(Constants)
        )?.json;
        if (todayCheckInNote) {
          const generatedQuestionsAnswersArray =
            generateCheckinNotesQuestionAnswer(todayCheckInNote);
          setCheckInAnswers(todayCheckInNote?.answers);
          setTodayCheckInNote(todayCheckInNote);
        } else {
        }
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
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
          <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
            {/* Header */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', flex: 0.2, justifyContent: 'center' },
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
                      fontSize: 36,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Check In'}
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
                      fontSize: 16,
                      marginTop: 5,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'What gets measured gets improved'}
              </Text>
            </View>
            {/* Center */}
            <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
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
                <Slider
                  onValueChange={newSliderValue => {
                    const sliderValue = newSliderValue;
                    try {
                      setHappinessRating(newSliderValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  {...GlobalStyles.SliderStyles(theme)['Slider'].props}
                  maximumTrackTintColor={palettes.Brand.Surface}
                  maximumValue={100}
                  minimumTrackTintColor={palettes.App['True Blue']}
                  minimumValue={0}
                  step={10}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.SliderStyles(theme)['Slider'].style,
                      { marginLeft: -12, marginRight: -12 }
                    ),
                    dimensions.width
                  )}
                  thumbTintColor={palettes.App['True Blue']}
                  value={happinessRating}
                />
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
                <Slider
                  onValueChange={newSliderValue => {
                    try {
                      setStressRating(newSliderValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  {...GlobalStyles.SliderStyles(theme)['Slider'].props}
                  maximumTrackTintColor={palettes.Brand.Surface}
                  maximumValue={100}
                  minimumTrackTintColor={palettes.App['True Blue']}
                  minimumValue={0}
                  step={10}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.SliderStyles(theme)['Slider'].style,
                      { marginLeft: -12, marginRight: -12 }
                    ),
                    dimensions.width
                  )}
                  thumbTintColor={palettes.App['True Blue']}
                  value={stressRating}
                />
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
                data={Constants['APP_CONFIG']?.checkin_questions}
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
                  'Container->Linear Gradient->Completed State->Center->List'
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
                          { marginTop: 25, paddingLeft: 20, paddingRight: 20 },
                          dimensions.width
                        )}
                      >
                        {/* Row */}
                        <View
                          style={StyleSheet.applyWidth(
                            { alignItems: 'flex-start', flexDirection: 'row' },
                            dimensions.width
                          )}
                        >
                          <Image
                            {...GlobalStyles.ImageStyles(theme)['Image'].props}
                            resizeMode={'contain'}
                            source={imageSource(Images['IcBrain'])}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.ImageStyles(theme)['Image'].style,
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
                                  textAlign: 'left',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {listData}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => {
                            try {
                              setVisibleModalAddJournal(true);
                            } catch (err) {
                              Sentry.captureException(err);
                              console.error(err);
                            }
                          }}
                        >
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
                                  fontFamily: 'Rasa_300Light_Italic',
                                  fontSize: 18,
                                  paddingLeft: 30,
                                  paddingTop: 20,
                                  textAlign: 'left',
                                  textDecorationLine: 'underline',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {"Click here if you'd like to journal"}
                          </Text>
                        </Pressable>
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
                { alignItems: 'center', flex: 0.2, justifyContent: 'center' },
                dimensions.width
              )}
            >
              {/* Continue */}
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  const handler = async () => {
                    try {
                      setIsLoadingButton(true);
                      (
                        await xanoBackendCreateEmotionalMetricPOST.mutateAsync({
                          happiness_rating: happinessRating,
                          stress_rating: stressRating,
                        })
                      )?.json;
                      setIsLoadingButton(false);
                      const currentLesson =
                        lessonDetailResponse?.current_lesson;
                      if (navigation.canGoBack()) {
                        navigation.popToTop();
                      }
                      navigation.replace('BottomTabNavigator', {
                        screen: 'HomeStack',
                        params: { screen: '' },
                      });
                      if (currentLesson?.category_id !== 0) {
                        navigation.navigate('MoreStack', {});
                        navigation.navigate('LessonsScreen', {
                          category_id: currentLesson?.category_id,
                          tactic_prop: currentLesson?.category,
                          tactic_id: null,
                          screen_title: currentLesson?.category?.title,
                        });
                      } else {
                        navigation.navigate('HomeStack', {});
                        navigation.navigate('LessonsScreen', {
                          category_id: null,
                          tactic_prop: currentLesson?.tactic,
                          tactic_id: currentLesson?.tactic_id,
                          screen_title: 'Lessons',
                        });
                      }
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
                      width: 130,
                    }
                  ),
                  dimensions.width
                )}
                title={'Onward'}
              />
            </View>
          </View>
        </LinearGradient>
      </View>

      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'slide'}
        transparent={true}
        visible={Boolean(visibleModalAddJournal)}
      >
        {/* Overlay */}
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: palettes.App.Overlay,
              height: '100%',
              position: 'absolute',
              width: '100%',
            },
            dimensions.width
          )}
        />
        <SimpleStyleKeyboardAwareScrollView
          enableOnAndroid={false}
          keyboardShouldPersistTaps={'never'}
          showsVerticalScrollIndicator={true}
          viewIsInsideTabBar={false}
          enableAutomaticScroll={true}
          enableResetScrollToCoords={true}
          style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
        >
          <Utils.CustomCodeErrorBoundary>
            <DismissKeyboardView.Index style={{ flex: 1 }}>
              {/* Container */}
              <View
                style={StyleSheet.applyWidth(
                  { flex: 1, marginTop: safeAreaInsets.top + 5 },
                  dimensions.width
                )}
              >
                {/* Card */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: palettes.App['Custom Color 3'],
                      borderRadius: 12,
                      marginLeft: 20,
                      marginRight: 20,
                      paddingBottom: 25,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 25,
                    },
                    dimensions.width
                  )}
                >
                  {/* Header */}
                  <View
                    style={StyleSheet.applyWidth(
                      { alignItems: 'center', justifyContent: 'center' },
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
                            fontSize: 25,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Journal Entry'}
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
                            fontFamily: 'Rasa_500Medium',
                            fontSize: 20,
                            marginTop: 5,
                            textAlign: 'center',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {getTodayDate()}
                      {' Check-In'}
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
                            fontFamily: 'Rasa_300Light_Italic',
                            fontSize: 12,
                            marginTop: 5,
                            paddingLeft: 15,
                            paddingRight: 15,
                            textAlign: 'center',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        'You can view your journal entries in the Notebook page of the app'
                      }
                    </Text>
                    <IconButton
                      onPress={() => {
                        try {
                          setVisibleModalAddJournal(false);
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      color={palettes.Brand.Surface}
                      icon={'MaterialCommunityIcons/window-close'}
                      size={24}
                      style={StyleSheet.applyWidth(
                        { position: 'absolute', right: 0, top: -5 },
                        dimensions.width
                      )}
                    />
                  </View>
                  <SimpleStyleFlatList
                    data={Constants['APP_CONFIG']?.checkin_questions}
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
                      'Modal->Keyboard Aware Scroll View->Custom Code->Container->Card->List'
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
                              { marginTop: 25 },
                              dimensions.width
                            )}
                          >
                            {/* Row */}
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'flex-start',
                                  flexDirection: 'row',
                                },
                                dimensions.width
                              )}
                            >
                              <Image
                                {...GlobalStyles.ImageStyles(theme)['Image']
                                  .props}
                                resizeMode={'contain'}
                                source={imageSource(Images['IcBrain'])}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ImageStyles(theme)['Image']
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
                                {...GlobalStyles.TextStyles(theme)['Text']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text']
                                      .style,
                                    {
                                      color: palettes.Brand.Surface,
                                      flex: 1,
                                      fontFamily: 'Rasa_500Medium',
                                      fontSize: 18,
                                      paddingLeft: 10,
                                      textAlign: 'left',
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {listData}
                              </Text>
                            </View>
                            <TextInput
                              autoCorrect={true}
                              changeTextDelay={500}
                              multiline={true}
                              onChangeText={newTextAreaValue => {
                                try {
                                  onChangeCheckInAnswer(
                                    checkInAnswers,
                                    newTextAreaValue,
                                    index
                                  );
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              }}
                              textAlignVertical={'top'}
                              webShowOutline={true}
                              {...GlobalStyles.TextInputStyles(theme)[
                                'Text Area'
                              ].props}
                              defaultValue={checkInAnswersAtIndex(
                                checkInAnswers,
                                index
                              )}
                              numberOfLines={5}
                              placeholder={'Answer here'}
                              placeholderTextColor={palettes.App.Overlay}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.TextInputStyles(theme)[
                                    'Text Area'
                                  ].style,
                                  {
                                    backgroundColor: palettes.Brand.Surface,
                                    color: theme.colors.background.brand,
                                    fontFamily: 'Rasa_400Regular',
                                    fontSize: 14,
                                    height: 65,
                                    marginLeft: 30,
                                    marginTop: 20,
                                  }
                                ),
                                dimensions.width
                              )}
                            />
                          </View>
                        </>
                      );
                    }}
                    showsHorizontalScrollIndicator={true}
                    showsVerticalScrollIndicator={true}
                    snapToAlignment={'start'}
                  />
                  {/* Bottom */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 25,
                      },
                      dimensions.width
                    )}
                  >
                    {/* Journal CTA */}
                    <Button
                      accessible={true}
                      iconPosition={'left'}
                      onPress={() => {
                        const handler = async () => {
                          try {
                            setIsLoadingAddJournal(true);
                            if (todayCheckInNote) {
                              (
                                await xanoBackendUpdateCheckInNotePATCH.mutateAsync(
                                  {
                                    answers: checkInAnswers,
                                    id: todayCheckInNote?.id,
                                  }
                                )
                              )?.json;
                            } else {
                              const addedCheckInNote = (
                                await xanoBackendCreateCheckinNotePOST.mutateAsync(
                                  {
                                    answers: checkInAnswers,
                                    questions:
                                      Constants['APP_CONFIG']
                                        ?.checkin_questions,
                                  }
                                )
                              )?.json;
                              setTodayCheckInNote(addedCheckInNote);
                            }

                            setIsLoadingAddJournal(false);
                            showToastMessage(
                              'Success',
                              todayCheckInNote
                                ? 'Update journal successfully'
                                : 'Add journal successfully'
                            );
                            setVisibleModalAddJournal(false);
                          } catch (err) {
                            Sentry.captureException(err);
                            console.error(err);
                          }
                        };
                        handler();
                      }}
                      {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                      disabled={Boolean(isLoadingAddJournal)}
                      loading={Boolean(isLoadingAddJournal)}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.ButtonStyles(theme)['Button'].style,
                          {
                            backgroundColor: palettes.App['True Blue'],
                            borderRadius: 100,
                            fontFamily: 'Rasa_600SemiBold',
                            fontSize: 16,
                            paddingTop: 2,
                            width: 160,
                          }
                        ),
                        dimensions.width
                      )}
                      title={`${
                        todayCheckInNote ? 'Update journal' : 'Add to journal'
                      }`}
                    />
                  </View>
                </View>
              </View>
            </DismissKeyboardView.Index>
          </Utils.CustomCodeErrorBoundary>
        </SimpleStyleKeyboardAwareScrollView>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(CompleteLessonStep3Screen);
