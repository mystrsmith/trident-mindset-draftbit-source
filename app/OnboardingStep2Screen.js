import React from 'react';
import {
  Button,
  ExpoImage,
  IconButton,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import * as ProgressSteps from '../custom-files/ProgressSteps';
import logEvent from '../global-functions/logEvent';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const defaultProps = {
  displayStep4: false,
  hideCloseButton: false,
  retakeQuizFlow: false,
};

const OnboardingStep2Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [checkinSetId, setCheckinSetId] = React.useState(0);
  const [currentQuesionIndex, setCurrentQuesionIndex] = React.useState(0);
  const [mostLikeAccomplish, setMostLikeAccomplish] = React.useState(null);
  const [multiAnswerIds, setMultiAnswerIds] = React.useState([]);
  const [quizAnswers, setQuizAnswers] = React.useState([]);
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [shouldUpdateAnswers, setShouldUpdateAnswers] = React.useState(true);
  const [step, setStep] = React.useState(0);
  const cookQuizQuestions = quizQuestions => {
    if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
      return quizQuestions.slice();
    }
    const newQuizQuestions = [
      quizQuestions[0],
      {
        ...quizQuestions[0],
        title:
          'Which benefits are also important to you (select all that apply)?',
        sub_title: '',
        is_multiple_choice: true,
      },
      ...quizQuestions.slice(1),
    ];
    return newQuizQuestions;
  };

  const filterOutMostAccomplish = (
    quizAnswers,
    mostLikeAccomplish,
    currentQuestionIndex
  ) => {
    if (currentQuestionIndex === 1) {
      return quizAnswers.filter(
        item => item?.answer_text !== mostLikeAccomplish
      );
    }
    return quizAnswers;
  };

  const getQuizQuestion = (quizQuestions, currentQuestionIndex) => {
    const quizQuestion = quizQuestions[currentQuestionIndex];
    return quizQuestion;
  };

  const isSelectedAnswer = (multiAnswerIds, answerId) => {
    if (multiAnswerIds.includes(answerId)) {
      return true;
    }
    return false;
  };

  const onToggleMultiAnswer = answer => {
    setMultiAnswerIds(prevMultiAnswerIds => {
      if (prevMultiAnswerIds.some(prevId => prevId === answer?.id)) {
        return prevMultiAnswerIds.filter(t => t !== answer?.id);
      } else {
        return [...prevMultiAnswerIds, answer?.id];
      }
    });
  };

  const updateQuizAnswer = (list, answer, question) => {
    var updatedList = list;
    updatedList.push({
      quiz_question_id: question?.id,
      quiz_answer_id: answer?.id,
    });
    return updatedList;
  };
  const xanoBackendSubmitUserTacticRecommendationV2POST =
    XanoBackendApi.useSubmitUserTacticRecommendationV2POST();
  const xanoBackendGenerateAnonymousIDPOST =
    XanoBackendApi.useGenerateAnonymousIDPOST();
  const xanoBackendUpdateUserTacticRecommendationsPATCH =
    XanoBackendApi.useUpdateUserTacticRecommendationsPATCH();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      logEvent('ob_step2_view', null);
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    const entry = StatusBar.pushStackEntry?.({ barStyle: 'light-content' });
    return () => StatusBar.popStackEntry?.(entry);
  }, [isFocused]);

  return (
    <ScreenContainer scrollable={false} hasSafeArea={false}>
      <ImageBackground
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        resizeMode={'cover'}
        source={imageSource(Images['OceanFinisherStory'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
          dimensions.width
        )}
      >
        {/* iOS Safe Area  */}
        <>
          {!(Platform.OS === 'ios') ? null : (
            <View
              {...GlobalStyles.ViewStyles(theme)['iOS Margin View'].props}
              style={StyleSheet.applyWidth(
                GlobalStyles.ViewStyles(theme)['iOS Margin View'].style,
                dimensions.width
              )}
            />
          )}
        </>
        {/* Header */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flexDirection: 'row',
              height: 40,
              justifyContent: 'flex-end',
              paddingLeft: 20,
              paddingRight: 20,
              width: '100%',
            },
            dimensions.width
          )}
        >
          <>
            {!(
              (params?.hideCloseButton ?? defaultProps.hideCloseButton) ===
              false
            ) ? null : (
              <IconButton
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                size={32}
                color={palettes.Brand.Surface}
                icon={'Ionicons/close'}
              />
            )}
          </>
        </View>

        <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
          <XanoBackendApi.FetchGetQuizSetsV3GET
            handlers={{
              onData: fetchData => {
                try {
                  console.log(fetchData);
                  setQuizQuestions(
                    cookQuizQuestions(fetchData?.quiz_questions)
                  );
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              },
            }}
            quiz_set_id={1}
          >
            {({ loading, error, data, refetchGetQuizSetsV3 }) => {
              const fetchData = data?.json;
              if (loading) {
                return <ActivityIndicator />;
              }

              if (error || data?.status < 200 || data?.status >= 300) {
                return <ActivityIndicator />;
              }

              return (
                <>
                  <Utils.CustomCodeErrorBoundary>
                    <ProgressSteps.Index
                      step={step}
                      quizQuestions={quizQuestions?.map(item => ({
                        id: item.id,
                      }))}
                    />
                  </Utils.CustomCodeErrorBoundary>
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
                          fontSize: 21,
                          marginLeft: Constants['CONTENT_PADDING'],
                          marginRight: Constants['CONTENT_PADDING'],
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {
                      getQuizQuestion(
                        cookQuizQuestions(fetchData?.quiz_questions),
                        currentQuesionIndex
                      )?.title
                    }
                  </Text>
                  {/* Sub Title */}
                  <>
                    {!getQuizQuestion(
                      cookQuizQuestions(fetchData?.quiz_questions),
                      currentQuesionIndex
                    )?.sub_title ? null : (
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.Brand.Surface,
                              fontFamily: 'Rasa_300Light',
                              fontSize: 16,
                              marginLeft: Constants['CONTENT_PADDING'],
                              marginRight: Constants['CONTENT_PADDING'],
                              marginTop: 12,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {
                          getQuizQuestion(
                            cookQuizQuestions(fetchData?.quiz_questions),
                            currentQuesionIndex
                          )?.sub_title
                        }
                      </Text>
                    )}
                  </>
                  <SimpleStyleFlatList
                    data={filterOutMostAccomplish(
                      getQuizQuestion(quizQuestions, currentQuesionIndex)
                        ?.quiz_answers,
                      mostLikeAccomplish,
                      currentQuesionIndex
                    )}
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
                    listKey={'Image Background->View->Fetch->List'}
                    nestedScrollEnabled={false}
                    numColumns={1}
                    onEndReachedThreshold={0.5}
                    pagingEnabled={false}
                    renderItem={({ item, index }) => {
                      const listData = item;
                      return (
                        <Pressable
                          onPress={() => {
                            const handler = async () => {
                              try {
                                if (currentQuesionIndex === 1) {
                                  onToggleMultiAnswer(listData);
                                  if (true) {
                                    return;
                                  }
                                } else {
                                }

                                if (currentQuesionIndex === 0) {
                                  setMostLikeAccomplish(listData?.answer_text);
                                } else {
                                }

                                if (listData?.next_quiz_question_id === 0) {
                                  setShouldUpdateAnswers(false);
                                } else {
                                }

                                const question = getQuizQuestion(
                                  quizQuestions,
                                  currentQuesionIndex
                                );
                                if (shouldUpdateAnswers === true) {
                                  const newQuizAnswers = updateQuizAnswer(
                                    quizAnswers,
                                    listData,
                                    question
                                  );
                                  setQuizAnswers(newQuizAnswers);
                                } else {
                                }

                                setCurrentQuesionIndex(currentQuesionIndex + 1);
                                setStep(step + 1);
                                if (
                                  currentQuesionIndex ===
                                  quizQuestions?.length - 1
                                ) {
                                  if (
                                    (params?.retakeQuizFlow ??
                                      defaultProps.retakeQuizFlow) === true
                                  ) {
                                    (
                                      await XanoBackendApi.tacticRecommendationPOST(
                                        Constants,
                                        { resData: quizAnswers }
                                      )
                                    )?.json;
                                  } else {
                                    await setGlobalVariableValue({
                                      key: 'QUIZ_ANSWERS',
                                      value: quizAnswers,
                                    });
                                    const resAnonymousId = (
                                      await xanoBackendGenerateAnonymousIDPOST.mutateAsync()
                                    )?.json;
                                    await setGlobalVariableValue({
                                      key: 'ANONYMOUS_ID',
                                      value: resAnonymousId?.anonymous_id,
                                    });
                                    if (Constants['AUTH_TOKEN']) {
                                      const res2 = (
                                        await xanoBackendSubmitUserTacticRecommendationV2POST.mutateAsync(
                                          {
                                            anonymous_id:
                                              resAnonymousId?.anonymous_id,
                                            quizAnswers: quizAnswers,
                                          }
                                        )
                                      )?.json;
                                      await waitUtil({ milliseconds: 500 });
                                      (
                                        await xanoBackendUpdateUserTacticRecommendationsPATCH.mutateAsync(
                                          {
                                            anonymous_id:
                                              resAnonymousId?.anonymous_id,
                                          }
                                        )
                                      )?.json;
                                    } else {
                                      const res = (
                                        await xanoBackendSubmitUserTacticRecommendationV2POST.mutateAsync(
                                          {
                                            anonymous_id:
                                              resAnonymousId?.anonymous_id,
                                            quizAnswers: quizAnswers,
                                          }
                                        )
                                      )?.json;
                                    }
                                  }

                                  navigation.navigate('OnboardingStep3Screen', {
                                    retakeQuizFlow:
                                      params?.retakeQuizFlow ??
                                      defaultProps.retakeQuizFlow,
                                    displayStep4:
                                      params?.displayStep4 ??
                                      defaultProps.displayStep4,
                                  });
                                  if (true) {
                                    return;
                                  }
                                } else {
                                }
                              } catch (err) {
                                Sentry.captureException(err);
                                console.error(err);
                              }
                            };
                            handler();
                          }}
                          activeOpacity={0.3}
                          style={StyleSheet.applyWidth(
                            { marginBottom: 20 },
                            dimensions.width
                          )}
                        >
                          <>
                            {isSelectedAnswer(
                              multiAnswerIds,
                              listData?.id
                            ) ? null : (
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    borderColor: palettes.Brand.Surface,
                                    borderRadius: 100,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    paddingBottom: 6,
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                    paddingTop: 6,
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
                                  {...GlobalStyles.ExpoImageStyles(theme)[
                                    'Image 2'
                                  ].props}
                                  resizeMode={'contain'}
                                  source={imageSource(Images['IcBrain'])}
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.ExpoImageStyles(theme)[
                                        'Image 2'
                                      ].style,
                                      { height: 28, width: 28 }
                                    ),
                                    dimensions.width
                                  )}
                                />
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
                                        fontFamily: 'Rasa_600SemiBold',
                                        fontSize: 16,
                                        marginLeft: 15,
                                        paddingTop: 2,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {listData?.answer_text}
                                </Text>
                              </View>
                            )}
                          </>
                          {/* Selected Item */}
                          <>
                            {!isSelectedAnswer(
                              multiAnswerIds,
                              listData?.id
                            ) ? null : (
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    backgroundColor: palettes.App['True Blue'],
                                    borderColor: palettes.Brand.Surface,
                                    borderRadius: 100,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    paddingBottom: 6,
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                    paddingTop: 6,
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
                                  {...GlobalStyles.ExpoImageStyles(theme)[
                                    'Image 3'
                                  ].props}
                                  resizeMode={'contain'}
                                  source={imageSource(Images['IcBrain'])}
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.ExpoImageStyles(theme)[
                                        'Image 3'
                                      ].style,
                                      { height: 28, width: 28 }
                                    ),
                                    dimensions.width
                                  )}
                                />
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
                                        fontFamily: 'Rasa_600SemiBold',
                                        fontSize: 16,
                                        marginLeft: 15,
                                        paddingTop: 2,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {listData?.answer_text}
                                </Text>
                              </View>
                            )}
                          </>
                        </Pressable>
                      );
                    }}
                    snapToAlignment={'start'}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={StyleSheet.applyWidth(
                      {
                        flex: 1,
                        marginTop: 20,
                        paddingLeft: 15,
                        paddingRight: 15,
                      },
                      dimensions.width
                    )}
                  />
                  <>
                    {!(currentQuesionIndex > 0) ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0)',
                            bottom: 0,
                            flexDirection: 'row',
                            height: 75,
                            justifyContent: 'space-between',
                            paddingBottom: 35,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingTop: 15,
                            width: '100%',
                          },
                          dimensions.width
                        )}
                      >
                        {/* Back Button */}
                        <>
                          {!(currentQuesionIndex > 0) ? null : (
                            <Pressable
                              onPress={() => {
                                try {
                                  if (currentQuesionIndex === 1) {
                                    setMultiAnswerIds([]);
                                  } else {
                                  }

                                  setCurrentQuesionIndex(
                                    currentQuesionIndex - 1
                                  );
                                  setStep(step - 1);
                                  logEvent('ob_step2_tap_back', null);
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              }}
                            >
                              <Text
                                accessible={true}
                                selectable={false}
                                style={StyleSheet.applyWidth(
                                  {
                                    color: palettes.Brand.Surface,
                                    fontFamily: 'Rasa_600SemiBold',
                                    fontSize: 18,
                                  },
                                  dimensions.width
                                )}
                              >
                                {'Back'}
                              </Text>
                            </Pressable>
                          )}
                        </>
                        {/* Next button */}
                        <>
                          {!(
                            getQuizQuestion(quizQuestions, currentQuesionIndex)
                              ?.is_multiple_choice === true
                          ) ? null : (
                            <View>
                              <Button
                                accessible={true}
                                iconPosition={'left'}
                                onPress={() => {
                                  try {
                                    setCurrentQuesionIndex(
                                      currentQuesionIndex + 1
                                    );
                                    setStep(step + 1);
                                  } catch (err) {
                                    Sentry.captureException(err);
                                    console.error(err);
                                  }
                                }}
                                {...GlobalStyles.ButtonStyles(theme)['Button']
                                  .props}
                                disabled={Boolean(multiAnswerIds?.length === 0)}
                                disabledOpacity={0.5}
                                icon={'Entypo/arrow-bold-right'}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ButtonStyles(theme)['Button']
                                      .style,
                                    {
                                      backgroundColor: palettes.App.Success,
                                      fontFamily: 'Rasa_700Bold',
                                      fontSize: 18,
                                      paddingTop: 2,
                                    }
                                  ),
                                  dimensions.width
                                )}
                                title={'Next'}
                              />
                            </View>
                          )}
                        </>
                      </View>
                    )}
                  </>
                </>
              );
            }}
          </XanoBackendApi.FetchGetQuizSetsV3GET>
        </View>
      </ImageBackground>
    </ScreenContainer>
  );
};

export default withTheme(OnboardingStep2Screen);
