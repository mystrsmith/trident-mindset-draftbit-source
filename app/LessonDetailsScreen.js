import React from 'react';
import {
  Button,
  Checkbox,
  CircularProgress,
  Icon,
  IconButton,
  LinearGradient,
  Pressable,
  RadioButtonGroup,
  RadioButtonRow,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  SimpleStyleScrollView,
  TextInput,
  VideoPlayer,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Modal,
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
import * as CustomCollapsible from '../custom-files/CustomCollapsible';
import * as CustomMarkdown from '../custom-files/CustomMarkdown';
import * as CustomStarRating from '../custom-files/CustomStarRating';
import * as LessonPartCheckbox from '../custom-files/LessonPartCheckbox';
import * as UpgradeSnapCarousel from '../custom-files/UpgradeSnapCarousel';
import OfflineMode_CheckIfAlreadyDownloaded from '../global-functions/OfflineMode_CheckIfAlreadyDownloaded';
import Player_LoadAndPlay from '../global-functions/Player_LoadAndPlay';
import calculateTacticProgress from '../global-functions/calculateTacticProgress';
import checkPostNotifications from '../global-functions/checkPostNotifications';
import copyToClipboard from '../global-functions/copyToClipboard';
import delaySeconds from '../global-functions/delaySeconds';
import getCompletedPart from '../global-functions/getCompletedPart';
import isNullOrUndefined from '../global-functions/isNullOrUndefined';
import isSubscribed from '../global-functions/isSubscribed';
import onAnimateFullScreenPlayer from '../global-functions/onAnimateFullScreenPlayer';
import showToastMessage from '../global-functions/showToastMessage';
import startMediaForegroundServiceTask from '../global-functions/startMediaForegroundServiceTask';
import triggerHapticFeedback from '../global-functions/triggerHapticFeedback';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import showAlertUtil from '../utils/showAlert';
import useIsFocused from '../utils/useIsFocused';
import useIsOnline from '../utils/useIsOnline';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { lesson_id: null };

const LessonDetailsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const isOnline = useIsOnline();
  const [MindsetActivityResponse, setMindsetActivityResponse] =
    React.useState('');
  const [apiResponse, setApiResponse] = React.useState({});
  const [checkedCheckIn, setCheckedCheckIn] = React.useState(false);
  const [checkedLesson, setCheckedLesson] = React.useState(false);
  const [checkedPracticeExercise, setCheckedPracticeExercise] =
    React.useState(false);
  const [checkinAnswers, setCheckinAnswers] = React.useState([]);
  const [checkinSetId, setCheckinSetId] = React.useState(0);
  const [completedParts, setCompletedParts] = React.useState([]);
  const [currentLesson, setCurrentLesson] = React.useState({});
  const [currentQuestion, setCurrentQuestion] = React.useState({});
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [feedbackContent, setFeedbackContent] = React.useState('');
  const [feedbackStarRating, setFeedbackStarRating] = React.useState(0);
  const [heading, setHeading] = React.useState('');
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingComplete, setIsLoadingComplete] = React.useState(false);
  const [isLoadingPartCheckIn, setIsLoadingPartCheckIn] = React.useState(false);
  const [isLoadingPartLesson, setIsLoadingPartLesson] = React.useState(false);
  const [isLoadingPartPracticeExcercise, setIsLoadingPartPracticeExcercise] =
    React.useState(false);
  const [nextLesson, setNextLesson] = React.useState({});
  const [no_audio_notice, setNo_audio_notice] = React.useState([]);
  const [password, setPassword] = React.useState('');
  const [quizAnswers, setQuizAnswers] = React.useState([]);
  const [quiz_set_id, setQuiz_set_id] = React.useState(0);
  const [radioButtonGroup, setRadioButtonGroup] = React.useState('');
  const [recommendationQuestionNumber, setRecommendationQuestionNumber] =
    React.useState(1);
  const [showCheckinModal, setShowCheckinModal] = React.useState(false);
  const [showCompletionModal, setShowCompletionModal] = React.useState(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const [showMindsetActiviteView, setShowMindsetActiviteView] =
    React.useState(true);
  const [showTacticsRecommendationModal, setShowTacticsRecommendationModal] =
    React.useState(false);
  const [showWaitDownloading, setShowWaitDownloading] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [tactic_image, setTactic_image] = React.useState('');
  const [upgradeInfo, setUpgradeInfo] = React.useState([]);
  const [visibelAudioNotice, setVisibelAudioNotice] = React.useState(false);
  const [visibleModalFeedback, setVisibleModalFeedback] = React.useState(false);
  const [visibleModalThankYouQuiz, setVisibleModalThankYouQuiz] =
    React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState('');
  const customHeight = total => {
    return total - 100;
  };

  const getCheckinQuesAnswer = (list, item) => {
    var ans = 3;

    list.forEach(record => {
      if (record.question_id == item.id) {
        ans = record.answer_id;
      }
    });

    return 3;
  };

  const renderCheckbox = (part, checkedPart, setCheckedPart) => {
    return (
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flexDirection: 'row',
            height: 35,
            justifyContent: 'center',
            marginRight: 10,
            width: 35,
          },
          dimensions.width
        )}
      >
        {/* Checkbox */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flexDirection: 'row',
              height: 35,
              justifyContent: 'center',
              width: 35,
            },
            dimensions.width
          )}
        >
          <>
            {!(checkedPart === true) ? null : (
              <Pressable
                onPress={() => {
                  const handler = async () => {
                    try {
                      triggerHapticFeedback();
                      setCheckedPart(false);
                      (
                        await xanoBackendDeleteCompletedPartLessonDELETE.mutateAsync(
                          {
                            lesson_id: currentLesson?.id,
                            part: part,
                          }
                        )
                      )?.json;
                      setIsLoadingComplete(true);
                      const resultLessonDetail = (
                        await XanoBackendApi.getLessonDetailsGET(Constants, {
                          lesson_id: currentLesson?.id,
                        })
                      )?.json;
                      setCurrentLesson(resultLessonDetail?.current_lesson);
                      setIsLoadingComplete(false);
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
                      backgroundColor: palettes.App['Success'],
                      borderColor: palettes.App['Success'],
                      height: 24,
                      width: 24,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 2,
                      borderWidth: 3,
                    },
                    dimensions.width
                  )}
                >
                  <Icon
                    color={palettes.App['White']}
                    name={'Feather/check'}
                    size={16}
                  />
                </View>
              </Pressable>
            )}
          </>
          <>
            {!(checkedPart === false) ? null : (
              <Pressable
                onPress={() => {
                  const handler = async () => {
                    try {
                      triggerHapticFeedback();
                      setCheckedPart(true);
                      const resultCreatedCompletedPart = (
                        await xanoBackendCreateCompletedPartLessonsPOST.mutateAsync(
                          {
                            lesson_id: props.route?.params?.lesson_id ?? 254,
                            part: part,
                          }
                        )
                      )?.json;
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
                      backgroundColor: palettes.App['Dark Cornflower Blue'],
                      borderColor: 'transparent',
                      borderWidth: 3,
                      height: 28,
                      width: 28,
                      borderRadius: 14,
                    },
                    dimensions.width
                  )}
                />
              </Pressable>
            )}
          </>
        </View>
      </View>
    );
  };

  const setCurrentQuestionObj = (list, index) => {
    return list[index.next_quiz_question_id - 1];
  };

  const updateCheckinAnswers = (list, item, answer) => {
    var updatedList = list;

    if (updatedList.length > 0) {
      let indexToRemove = updatedList.findIndex(
        element => element['question_id'] === item.id
      );
      if (indexToRemove !== -1) {
        updatedList.splice(indexToRemove, 1);
      }
    }

    updatedList.push({
      question_id: item.id,
      answer_value: answer,
    });

    return updatedList;
  };

  const updateQuizAnswers = (list, ques, ans) => {
    var updatedList = list;

    updatedList.push({
      quiz_question_id: ques.id,
      quiz_answer_id: ans.id,
    });

    return updatedList;
  };
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!props.route?.params?.lesson_id || !currentLesson?.id) {
          return;
        }
        if (props.route?.params?.lesson_id == currentLesson?.id) {
          return;
        }
        if (
          currentLesson === null ||
          currentLesson === undefined ||
          Object.keys(currentLesson)?.length === 0
        ) {
          return;
        }
        setCurrentLesson(null);
        setCheckedLesson(false);
        setCheckedPracticeExercise(false);
        setCheckedCheckIn(false);
        setIsLoading(true);
        const resultLessonDetail = (
          await XanoBackendApi.getLessonDetailsGET(Constants, {
            lesson_id: props.route?.params?.lesson_id,
          })
        )?.json;
        setCurrentLesson(resultLessonDetail?.current_lesson);
        setUpgradeInfo(resultLessonDetail?.upgrade_info);
        setNextLesson(resultLessonDetail?.next_lesson);
        setApiResponse(resultLessonDetail);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    handler();
  }, [props.route?.params?.lesson_id, currentLesson]);

  // Do the magic auto complete lesson
  React.useEffect(() => {
    async function init() {
      if (
        currentLesson === null ||
        currentLesson === undefined ||
        Object.keys(currentLesson)?.length === 0
      ) {
        return;
      }
      // Don't handle if already completed
      if (currentLesson?.completed === true) {
        return;
      }
      if (currentLesson?.length === 0) {
        return;
      }

      const requiredParts = [];
      if (currentLesson?.audio_content || currentLesson?.text_content) {
        requiredParts.push('lesson');
      }
      if (currentLesson?.practice_lesson_content?.length > 0) {
        requiredParts.push('practice_exercise');
      }

      const completedParts = [];
      if (checkedLesson === true) {
        completedParts.push('lesson');
      }
      if (checkedPracticeExercise === true) {
        completedParts.push('practice_exercise');
      }
      const uniquePartsSet = new Set([...completedParts]);
      const uniquePartsArray = [...uniquePartsSet];
      const shouldAutoCompleteLesson =
        requiredParts?.length > 0 &&
        requiredParts.every(part => uniquePartsArray?.includes(part));

      // Just auto complete when contain these parts)
      if (shouldAutoCompleteLesson === true) {
        setIsLoadingComplete(true);
        const resultCompleteLesson = (
          await xanoBackendCompleteALessonPOST.mutateAsync({
            lesson_id: currentLesson?.id,
          })
        )?.json;
        if (
          resultCompleteLesson?.status === Variables['SUCCESS_API_RESPONSE']
        ) {
          const resultLessonDetail = (
            await XanoBackendApi.getLessonDetailsGET(Constants, {
              lesson_id: currentLesson?.id,
            })
          )?.json;
          const resultDailyTrackers = (
            await XanoBackendApi.getDailyTrackerGET(Constants)
          )?.json;

          // If not subscribed & should show paywall
          if (
            resultCompleteLesson?.should_show_paywall &&
            isSubscribed(Variables) === false
          ) {
            const newTitlePaywall = resultCompleteLesson?.title_paywall;
            const newSubTitlePaywall = resultCompleteLesson?.subtitle_paywall;
            const purchasedAfterLessonTitle =
              resultCompleteLesson?.purchased_after_lesson_title;
            setGlobalVariableValue({
              key: 'VISIBLE_MODAL_PAYWALL',
              value: true,
            });
            setGlobalVariableValue({
              key: 'PURCHASED_AFTER_LESSON_TITLE',
              value: purchasedAfterLessonTitle,
            });
            setGlobalVariableValue({
              key: 'TITLE_PAYWALL',
              value: newTitlePaywall,
            });
            setGlobalVariableValue({
              key: 'SUBTITLE_PAYWALL',
              value: newSubTitlePaywall,
            });
          }
          navigation.navigate('CompleteLessonStep1Screen', {
            dailyTrackers: resultDailyTrackers,
            lessonDetailResponse: resultLessonDetail,
          });
        }

        // setCurrentLesson(resultLessonDetail?.current_lesson);
        // setUpgradeInfo(resultLessonDetail?.upgrade_info);
        // setNextLesson(resultLessonDetail?.next_lesson);
        // setApiResponse(resultLessonDetail);
        setIsLoadingComplete(false);
      }
    }
    init();
  }, [currentLesson, checkedLesson, checkedPracticeExercise, checkedCheckIn]);
  const xanoBackendUpdateFavoriteLessonsPOST =
    XanoBackendApi.useUpdateFavoriteLessonsPOST();
  const xanoBackendPlayLessonLogsPOST = XanoBackendApi.usePlayLessonLogsPOST();
  const xanoBackendCompleteALessonPOST =
    XanoBackendApi.useCompleteALessonPOST();
  const xanoBackendCreateCompletedPartLessonsPOST =
    XanoBackendApi.useCreateCompletedPartLessonsPOST();
  const xanoBackendDeleteCompleteLessonDELETE =
    XanoBackendApi.useDeleteCompleteLessonDELETE();
  const xanoBackendCreateFeedbackPOST = XanoBackendApi.useCreateFeedbackPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setIsLoading(true);
        const resultLessonDetail = (
          await XanoBackendApi.getLessonDetailsGET(Constants, {
            lesson_id: params?.lesson_id ?? defaultProps.lesson_id,
          })
        )?.json;
        setCurrentLesson(resultLessonDetail?.current_lesson);
        setIsFavorite(resultLessonDetail?.current_lesson?.favorited);
        setUpgradeInfo(resultLessonDetail?.upgrade_info);
        setNo_audio_notice(resultLessonDetail?.no_audio_notice);
        setNextLesson(resultLessonDetail?.next_lesson);
        setApiResponse(resultLessonDetail);
        const noCheckedLesson = isNullOrUndefined(
          getCompletedPart(
            resultLessonDetail?.current_lesson?.completed_parts,
            'lesson'
          )
        );
        const noCheckedPracticeExcercise = isNullOrUndefined(
          getCompletedPart(
            resultLessonDetail?.current_lesson?.completed_parts,
            'practice_exercise'
          )
        );
        const noCheckedCheckIn = isNullOrUndefined(
          getCompletedPart(
            resultLessonDetail?.current_lesson?.completed_parts,
            'check_in'
          )
        );
        setCheckedLesson(!noCheckedLesson);
        setCheckedPracticeExercise(!noCheckedPracticeExcercise);
        setCheckedCheckIn(!noCheckedCheckIn);
        setIsLoading(false);
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
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      hasBottomSafeArea={false}
      hasTopSafeArea={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: theme.colors.background.brand },
        dimensions.width
      )}
    >
      <ImageBackground
        resizeMode={'cover'}
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        source={imageSource(Images['OceanFinisherStory'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
          dimensions.width
        )}
      >
        {/* iOS Safe Area View */}
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
          {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
              { justifyContent: 'space-between' }
            ),
            dimensions.width
          )}
        >
          {/* Left View */}
          <View
            style={StyleSheet.applyWidth(
              { marginLeft: 10, marginRight: 10 },
              dimensions.width
            )}
          >
            {/* Back */}
            <Pressable
              onPress={() => {
                try {
                  navigation.goBack();
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
            >
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', flexDirection: 'row' },
                  dimensions.width
                )}
              >
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Ionicons/chevron-back'}
                  style={StyleSheet.applyWidth(
                    { marginRight: 6 },
                    dimensions.width
                  )}
                />
              </View>
            </Pressable>
          </View>
          {/* Center View */}
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'flex-start', flex: 1, justifyContent: 'center' },
              dimensions.width
            )}
          >
            <Text
              accessible={true}
              selectable={false}
              style={StyleSheet.applyWidth(
                {
                  color: Constants['APP_FONT_COLOR'],
                  fontFamily: 'Rasa_600SemiBold',
                  fontSize: 20,
                  paddingTop: 5,
                },
                dimensions.width
              )}
            >
              {heading}
            </Text>
          </View>
          {/* Right View */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 10,
              },
              dimensions.width
            )}
          >
            {/* Favorite */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'flex-end',
                  height: 48,
                  justifyContent: 'center',
                  paddingRight: 8,
                  width: 48,
                },
                dimensions.width
              )}
            >
              <Checkbox
                onCheck={() => {
                  try {
                    if (isOnline) {
                      showToastMessage(
                        'Added',
                        'Lesson added to your Notebook'
                      );
                    }
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                onPress={newCheckboxValue => {
                  const handler = async () => {
                    try {
                      const api_Response = (
                        await xanoBackendUpdateFavoriteLessonsPOST.mutateAsync({
                          favorite: !isFavorite,
                          lesson_id:
                            params?.lesson_id ?? defaultProps.lesson_id,
                        })
                      )?.json;
                      setIsFavorite(newCheckboxValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  };
                  handler();
                }}
                onUncheck={() => {
                  try {
                    if (isOnline) {
                      showToastMessage(
                        'Removed',
                        'Lesson removed your Notebook'
                      );
                    }
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                checkedIcon={'AntDesign/star'}
                color={palettes.App['Custom Color_9']}
                status={isFavorite}
                uncheckedColor={palettes.App['Custom Color']}
                uncheckedIcon={'AntDesign/staro'}
              />
            </View>
            {/* Copy Link */}
            <Pressable
              onPress={() => {
                const handler = async () => {
                  try {
                    await copyToClipboard(heading);
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
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'MaterialCommunityIcons/link-variant'}
                />
              </View>
            </Pressable>
          </View>
        </View>
        {/* Loading View */}
        <>
          {!isLoading ? null : (
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center' },
                dimensions.width
              )}
            >
              <ActivityIndicator
                animating={true}
                hidesWhenStopped={true}
                size={'small'}
                {...GlobalStyles.ActivityIndicatorStyles(theme)[
                  'Activity Indicator'
                ].props}
                color={palettes.Brand.Surface}
                style={StyleSheet.applyWidth(
                  GlobalStyles.ActivityIndicatorStyles(theme)[
                    'Activity Indicator'
                  ].style,
                  dimensions.width
                )}
              />
            </View>
          )}
        </>
        {/* Loaded View */}
        <>
          {isLoading ? null : (
            <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
              <SimpleStyleScrollView
                bounces={true}
                horizontal={false}
                keyboardShouldPersistTaps={'never'}
                nestedScrollEnabled={false}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
                style={StyleSheet.applyWidth(
                  { flex: 1, paddingBottom: 80, paddingTop: 20 },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
                >
                  {/* Name */}
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                        {
                          color: Constants['APP_FONT_COLOR'],
                          fontFamily: 'Rasa_600SemiBold',
                          fontSize: 27,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {currentLesson?.title}
                  </Text>
                  {/* Description */}
                  <>
                    {!currentLesson?.sub_title ? null : (
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
                              fontSize: 20,
                              marginTop: 6,
                              textAlign: 'center',
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {currentLesson?.sub_title}
                      </Text>
                    )}
                  </>
                  {/* Normal Flow */}
                  <>
                    {currentLesson?.quiz_set_id ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          { flex: 1 },
                          dimensions.width
                        )}
                      >
                        <>
                          {!upgradeInfo ? null : (
                            <Utils.CustomCodeErrorBoundary>
                              <UpgradeSnapCarousel.Index
                                upgradeInfo={upgradeInfo}
                              />
                            </Utils.CustomCodeErrorBoundary>
                          )}
                        </>
                        {/* Wrapper */}
                        <View
                          style={StyleSheet.applyWidth(
                            { marginLeft: 20, marginRight: 20 },
                            dimensions.width
                          )}
                        >
                          <>
                            {!currentLesson?.show_upgrade_info ? null : (
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  },
                                  dimensions.width
                                )}
                              >
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
                                        fontFamily: 'Rasa_700Bold',
                                        fontSize: 27,
                                        textAlign: 'center',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {
                                    'If you’d like more info, watch this 5-minute video'
                                  }
                                </Text>
                              </View>
                            )}
                          </>
                          {/* Video Content */}
                          <>
                            {!currentLesson?.video_content ? null : (
                              <View
                                style={StyleSheet.applyWidth(
                                  { marginBottom: 20 },
                                  dimensions.width
                                )}
                              >
                                <VideoPlayer
                                  isLooping={false}
                                  isMuted={false}
                                  playsInSilentModeIOS={false}
                                  rate={1}
                                  shouldPlay={false}
                                  useNativeControls={true}
                                  volume={0.5}
                                  {...GlobalStyles.VideoPlayerStyles(theme)[
                                    'Video'
                                  ].props}
                                  positionMillis={1}
                                  posterResizeMode={'contain'}
                                  posterSource={imageSource(
                                    `${currentLesson?.video_content?.url}`
                                  )}
                                  resizeMode={'contain'}
                                  source={imageSource(
                                    `${currentLesson?.video_content?.url}`
                                  )}
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.VideoPlayerStyles(theme)[
                                        'Video'
                                      ].style,
                                      { height: 300 }
                                    ),
                                    dimensions.width
                                  )}
                                  usePoster={true}
                                />
                              </View>
                            )}
                          </>
                          {/* Spacing 2 */}
                          <View
                            style={StyleSheet.applyWidth(
                              { height: 35 },
                              dimensions.width
                            )}
                          />
                          {/* New Lesson Row */}
                          <>
                            {!currentLesson ? null : (
                              <Pressable
                                onPress={() => {
                                  const handler = async () => {
                                    try {
                                      if (
                                        currentLesson?.show_audio_notice ===
                                        true
                                      ) {
                                        setVisibelAudioNotice(true);
                                      } else {
                                        await checkPostNotifications();
                                        await onAnimateFullScreenPlayer(
                                          currentLesson
                                        );
                                        const itemToPlay =
                                          OfflineMode_CheckIfAlreadyDownloaded(
                                            Variables,
                                            currentLesson
                                          );
                                        await Player_LoadAndPlay(
                                          Variables,
                                          setGlobalVariableValue,
                                          itemToPlay
                                        );
                                        startMediaForegroundServiceTask();
                                        (
                                          await xanoBackendPlayLessonLogsPOST.mutateAsync(
                                            {
                                              lesson_id:
                                                params?.lesson_id ??
                                                defaultProps.lesson_id,
                                            }
                                          )
                                        )?.json;
                                      }
                                    } catch (err) {
                                      Sentry.captureException(err);
                                      console.error(err);
                                    }
                                  };
                                  handler();
                                }}
                              >
                                {/* New Lesson Row */}
                                <CustomCollapsible.Index
                                  label="Lesson"
                                  renderCheckbox={() => (
                                    <LessonPartCheckbox.Index
                                      part="lesson"
                                      checkedPart={checkedLesson}
                                      setCheckedPart={setCheckedLesson}
                                      currentLesson={currentLesson}
                                      setCurrentLesson={setCurrentLesson}
                                      isLoadingComplete={isLoadingComplete}
                                      setIsLoadingComplete={
                                        setIsLoadingComplete
                                      }
                                    />
                                  )}
                                  renderRightComponent={
                                    <Icon
                                      size={24}
                                      color={palettes.Brand.Surface}
                                      name={'Ionicons/play'}
                                    />
                                  }
                                  disabled={true}
                                ></CustomCollapsible.Index>
                              </Pressable>
                            )}
                          </>
                          {/* Spacing */}
                          <View
                            style={StyleSheet.applyWidth(
                              { height: 20 },
                              dimensions.width
                            )}
                          />
                          {/* New Practice Exercise Row */}
                          <>
                            {!currentLesson?.practice_lesson_content ? null : (
                              <Utils.CustomCodeErrorBoundary>
                                <CustomCollapsible.Index
                                  label="Practice Exercise"
                                  renderCheckbox={() => (
                                    <LessonPartCheckbox.Index
                                      part="practice_exercise"
                                      checkedPart={checkedPracticeExercise}
                                      setCheckedPart={
                                        setCheckedPracticeExercise
                                      }
                                      currentLesson={currentLesson}
                                      setCurrentLesson={setCurrentLesson}
                                      isLoadingComplete={isLoadingComplete}
                                      setIsLoadingComplete={
                                        setIsLoadingComplete
                                      }
                                    />
                                  )}
                                  renderRightComponent={
                                    <Icon
                                      size={22}
                                      color={palettes.Brand.Surface}
                                      name={'Ionicons/book'}
                                    />
                                  }
                                >
                                  {/* Practice exercise */}
                                  <>
                                    {!currentLesson?.practice_lesson_content ? null : (
                                      <View
                                        style={StyleSheet.applyWidth(
                                          { marginTop: 15 },
                                          dimensions.width
                                        )}
                                      >
                                        {/* Markdown */}
                                        <Utils.CustomCodeErrorBoundary>
                                          <CustomMarkdown.Component
                                            content={
                                              currentLesson?.practice_lesson_content
                                            }
                                            selectable={false}
                                          />
                                        </Utils.CustomCodeErrorBoundary>
                                      </View>
                                    )}
                                  </>
                                </CustomCollapsible.Index>
                              </Utils.CustomCodeErrorBoundary>
                            )}
                          </>
                        </View>
                      </View>
                    )}
                  </>
                  {/* Tactics Recommendation Flow View */}
                  <>
                    {!currentLesson?.quiz_set_id ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            flex: 1,
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 20,
                          },
                          dimensions.width
                        )}
                      >
                        <View>
                          <LinearGradient
                            color1={theme.colors.branding.primary}
                            color2={theme.colors.branding.secondary}
                            endX={100}
                            endY={100}
                            startX={0}
                            startY={0}
                            {...GlobalStyles.LinearGradientStyles(theme)[
                              'Linear Gradient'
                            ].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.LinearGradientStyles(theme)[
                                  'Linear Gradient'
                                ].style,
                                {
                                  alignItems: 'center',
                                  borderRadius: 8,
                                  justifyContent: 'space-between',
                                  minHeight: 240,
                                  overflow: 'hidden',
                                  padding: 20,
                                  paddingTop: 35,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {/* Response */}
                            <>
                              {!MindsetActivityResponse?.length ? null : (
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      flex: 1,
                                      justifyContent: 'space-between',
                                    },
                                    dimensions.width
                                  )}
                                >
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
                                          color: Constants['APP_FONT_COLOR'],
                                          fontFamily: 'Rasa_400Regular',
                                          fontSize: 25,
                                          margin: 25,
                                          marginTop: 10,
                                          textAlign: 'center',
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                  >
                                    {
                                      'Hey, we all have off-days. Onward! Pick at least one tactic you think would be useful and consider how you can implement it tomorrow.'
                                    }
                                  </Text>
                                </View>
                              )}
                            </>
                            {/* Request View */}
                            <>
                              {MindsetActivityResponse?.length ? null : (
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignItems: 'center',
                                      flex: 1,
                                      justifyContent: 'space-between',
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {/* Heading */}
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
                                          fontFamily: 'Poppins_400Regular',
                                          fontSize: 21,
                                          padding: 20,
                                          paddingBottom: 0,
                                          paddingTop: 0,
                                          textAlign: 'center',
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                  >
                                    {
                                      'Take this 1-minute quiz to learn which tactics you should start with.'
                                    }
                                  </Text>
                                  {/* Start Now */}
                                  <Button
                                    accessible={true}
                                    iconPosition={'left'}
                                    onPress={() => {
                                      try {
                                        setShowTacticsRecommendationModal(true);
                                      } catch (err) {
                                        Sentry.captureException(err);
                                        console.error(err);
                                      }
                                    }}
                                    {...GlobalStyles.ButtonStyles(theme)[
                                      'Button'
                                    ].props}
                                    activeOpacity={0.3}
                                    style={StyleSheet.applyWidth(
                                      StyleSheet.compose(
                                        GlobalStyles.ButtonStyles(theme)[
                                          'Button'
                                        ].style,
                                        {
                                          backgroundColor:
                                            palettes.Brand['Light Inverse'],
                                          color: theme.colors.text.strong,
                                          fontFamily: 'Rasa_500Medium',
                                          fontSize: 21,
                                          marginTop: 22,
                                          textAlign: 'auto',
                                          width: 250,
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                    title={'Start Now'}
                                  />
                                </View>
                              )}
                            </>
                          </LinearGradient>
                        </View>
                      </View>
                    )}
                  </>
                </View>
                {/* Mark As Completed */}
                <>
                  {currentLesson?.completed ? null : (
                    <Button
                      accessible={true}
                      iconPosition={'left'}
                      onPress={() => {
                        const handler = async () => {
                          try {
                            triggerHapticFeedback();
                            setIsLoadingComplete(true);
                            const resultComplete = (
                              await xanoBackendCompleteALessonPOST.mutateAsync({
                                lesson_id: currentLesson?.id,
                              })
                            )?.json;
                            const resultLessonDetail = (
                              await XanoBackendApi.getLessonDetailsGET(
                                Constants,
                                { lesson_id: currentLesson?.id }
                              )
                            )?.json;
                            setApiResponse(resultLessonDetail);
                            setCurrentLesson(
                              resultLessonDetail?.current_lesson
                            );
                            const resultDailyTrackers = (
                              await XanoBackendApi.getDailyTrackerGET(Constants)
                            )?.json;
                            if (
                              resultComplete?.should_show_paywall === true &&
                              isSubscribed(Variables) === false
                            ) {
                              const newPurchasedAfterLessonTitle =
                                resultComplete?.purchased_after_lesson_title;
                              const titlePaywall =
                                resultComplete?.title_paywall;
                              await setGlobalVariableValue({
                                key: 'PURCHASED_AFTER_LESSON_TITLE',
                                value: newPurchasedAfterLessonTitle,
                              });
                              const subtitlePaywall =
                                resultComplete?.subtitle_paywall;
                              await setGlobalVariableValue({
                                key: 'VISIBLE_MODAL_PAYWALL',
                                value: true,
                              });
                              await setGlobalVariableValue({
                                key: 'TITLE_PAYWALL',
                                value: titlePaywall,
                              });
                              await setGlobalVariableValue({
                                key: 'SUBTITLE_PAYWALL',
                                value: subtitlePaywall,
                              });
                            } else {
                            }

                            navigation.navigate('CompleteLessonStep1Screen', {
                              dailyTrackers: resultDailyTrackers,
                              lessonDetailResponse: resultLessonDetail,
                            });
                            setCheckedLesson(true);
                            setIsLoadingComplete(false);
                            setCheckedCheckIn(true);
                            setCheckedPracticeExercise(true);
                            (
                              await xanoBackendCreateCompletedPartLessonsPOST.mutateAsync(
                                {
                                  lesson_id: currentLesson?.id,
                                  part: 'check_in',
                                }
                              )
                            )?.json;
                            (
                              await xanoBackendCreateCompletedPartLessonsPOST.mutateAsync(
                                {
                                  lesson_id: currentLesson?.id,
                                  part: 'practice_exercise',
                                }
                              )
                            )?.json;
                            (
                              await xanoBackendCreateCompletedPartLessonsPOST.mutateAsync(
                                { lesson_id: currentLesson?.id, part: 'lesson' }
                              )
                            )?.json;
                            setIsFavorite(
                              resultLessonDetail?.current_lesson?.favorited
                            );
                            setNextLesson(resultLessonDetail?.next_lesson);
                          } catch (err) {
                            Sentry.captureException(err);
                            console.error(err);
                          }
                        };
                        handler();
                      }}
                      {...GlobalStyles.ButtonStyles(theme)['Action Button']
                        .props}
                      activeOpacity={1}
                      disabled={Boolean(isLoadingComplete)}
                      disabledOpacity={0.7}
                      loading={Boolean(isLoadingComplete)}
                      style={[
                        StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ButtonStyles(theme)['Action Button']
                              .style,
                            {
                              backgroundColor:
                                palettes.App['App Buttons Color'],
                              borderRadius: 100,
                              color: Constants['APP_FONT_COLOR'],
                              fontFamily: 'Rasa_600SemiBold',
                              fontSize: 20,
                              marginBottom: 20,
                              marginLeft: 20,
                              marginRight: 20,
                              marginTop: 20,
                              paddingTop: 4,
                              width: '55%',
                            }
                          ),
                          dimensions.width
                        ),
                        { alignSelf: 'center' },
                      ]}
                      contentContainerStyle={StyleSheet.applyWidth(
                        GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                        dimensions.width
                      )}
                      title={'Mark as Completed'}
                    />
                  )}
                </>
                {/* Completed */}
                <>
                  {!currentLesson?.completed ? null : (
                    <Button
                      accessible={true}
                      iconPosition={'left'}
                      onPress={() => {
                        const handler = async () => {
                          try {
                            triggerHapticFeedback();
                            setIsLoadingComplete(true);
                            (
                              await xanoBackendDeleteCompleteLessonDELETE.mutateAsync(
                                { lesson_id: currentLesson?.id }
                              )
                            )?.json;
                            setCheckedCheckIn(false);
                            setCheckedLesson(false);
                            setCheckedPracticeExercise(false);
                            const resultLessonDetail = (
                              await XanoBackendApi.getLessonDetailsGET(
                                Constants,
                                { lesson_id: currentLesson?.id }
                              )
                            )?.json;
                            setApiResponse(resultLessonDetail);
                            setCurrentLesson(
                              resultLessonDetail?.current_lesson
                            );
                            setNextLesson(resultLessonDetail?.next_lesson);
                            setIsLoadingComplete(false);
                          } catch (err) {
                            Sentry.captureException(err);
                            console.error(err);
                          }
                        };
                        handler();
                      }}
                      {...GlobalStyles.ButtonStyles(theme)['Action Button']
                        .props}
                      activeOpacity={1}
                      disabled={Boolean(isLoadingComplete)}
                      disabledOpacity={0.7}
                      loading={Boolean(isLoadingComplete)}
                      style={[
                        StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ButtonStyles(theme)['Action Button']
                              .style,
                            {
                              backgroundColor: palettes.App['Custom Color_8'],
                              borderRadius: 100,
                              color: Constants['APP_FONT_COLOR'],
                              fontFamily: 'Rasa_600SemiBold',
                              fontSize: 20,
                              marginBottom: 20,
                              marginLeft: 20,
                              marginRight: 20,
                              marginTop: 20,
                              paddingTop: 4,
                              width: '55%',
                            }
                          ),
                          dimensions.width
                        ),
                        { alignSelf: 'center' },
                      ]}
                      contentContainerStyle={StyleSheet.applyWidth(
                        GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                        dimensions.width
                      )}
                      title={'Completed'}
                    />
                  )}
                </>
              </SimpleStyleScrollView>
            </View>
          )}
        </>
      </ImageBackground>
      {/* Modal Thank You Quiz */}
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'fade'}
        transparent={true}
        visible={Boolean(visibleModalThankYouQuiz)}
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
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: theme.colors.background.brand,
                borderColor: palettes.App['App Buttons Color'],
                borderRadius: 8,
                borderWidth: 1,
                overflow: 'hidden',
                padding: 16,
                paddingBottom: 0,
                width: 300,
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
                    fontFamily: 'Rasa_700Bold',
                    fontSize: 25,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Thank you'}
            </Text>
            {/* Desscrpition */}
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
                    marginTop: 10,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {
                'We have customized your path. Start with Mindset 101 and then learn the 12 tactics in the order they appear in your app.'
              }
            </Text>
            {/* CTAs */}
            <>
              {showWaitDownloading ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      borderColor: palettes.App['App Buttons Color'],
                      borderTopWidth: 1,
                      flexDirection: 'row',
                      height: 50,
                      justifyContent: 'center',
                      marginLeft: -16,
                      marginRight: -16,
                      marginTop: 15,
                    },
                    dimensions.width
                  )}
                >
                  {/* Ok */}
                  <Pressable
                    onPress={() => {
                      try {
                        setVisibleModalThankYouQuiz(false);
                        if (navigation.canGoBack()) {
                          navigation.popToTop();
                        }
                        navigation.replace('BottomTabNavigator', {
                          screen: 'HomeStack',
                          params: { screen: '' },
                        });
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                    activeOpacity={0.3}
                    style={StyleSheet.applyWidth(
                      { height: '100%', width: '50%' },
                      dimensions.width
                    )}
                  >
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'center',
                          width: '100%',
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
                              fontSize: 21,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Ok'}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )}
            </>
          </View>
        </View>
      </Modal>
      {/* Modal No Audio Notice */}
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'slide'}
        transparent={true}
        visible={Boolean(visibelAudioNotice)}
      >
        <ImageBackground
          resizeMode={'cover'}
          {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background']
            .props}
          source={imageSource(Images['OceanFinisherStory'])}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ImageBackgroundStyles(theme)['Image Background']
                .style,
              { paddingBottom: 50, paddingTop: 80 }
            ),
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between',
                paddingLeft: 20,
                paddingRight: 20,
              },
              dimensions.width
            )}
          >
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', justifyContent: 'center' },
                dimensions.width
              )}
            >
              {/* Header */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    height: 40,
                    justifyContent: 'flex-end',
                    paddingBottom: 50,
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                <IconButton
                  onPress={() => {
                    try {
                      setVisibelAudioNotice(false);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  size={32}
                  color={palettes.Brand.Surface}
                  icon={'Ionicons/close'}
                />
              </View>

              <View
                style={StyleSheet.applyWidth(
                  { marginTop: 30 },
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
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 32,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {currentLesson?.no_audio_notice?.header}
                </Text>
                {/* View 2 */}
                <View
                  style={StyleSheet.applyWidth(
                    { gap: 10, paddingBottom: 40, paddingTop: 20 },
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
                          fontFamily: 'Rasa_400Regular',
                          fontSize: 18,
                          lineHeight: 20,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {currentLesson?.no_audio_notice?.paragraph1}
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
                          color: palettes.App.White,
                          fontFamily: 'Rasa_400Regular',
                          fontSize: 18,
                          lineHeight: 20,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {currentLesson?.no_audio_notice?.paragraph2}
                  </Text>
                </View>
              </View>
            </View>
            <Button
              accessible={true}
              iconPosition={'left'}
              onPress={() => {
                const handler = async () => {
                  try {
                    setVisibelAudioNotice(false);
                    await checkPostNotifications();
                    await onAnimateFullScreenPlayer(currentLesson);
                    const itemToPlay = OfflineMode_CheckIfAlreadyDownloaded(
                      Variables,
                      currentLesson
                    );
                    await Player_LoadAndPlay(
                      Variables,
                      setGlobalVariableValue,
                      itemToPlay
                    );
                    startMediaForegroundServiceTask();
                    (
                      await xanoBackendPlayLessonLogsPOST.mutateAsync({
                        lesson_id: params?.lesson_id ?? defaultProps.lesson_id,
                      })
                    )?.json;
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                };
                handler();
              }}
              {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                  theme.typography.button,
                  {
                    backgroundColor: palettes.App.Success,
                    borderRadius: 100,
                    color: palettes.App.White,
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 18,
                    paddingTop: 4,
                    width: '55%',
                  }
                ),
                dimensions.width
              )}
              title={`${currentLesson?.no_audio_notice?.action_label}`}
            />
          </View>
        </ImageBackground>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(LessonDetailsScreen);
