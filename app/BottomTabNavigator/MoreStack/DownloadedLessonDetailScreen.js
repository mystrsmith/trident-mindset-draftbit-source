import React from 'react';
import {
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { ImageBackground, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as CommonPackages from '../../../custom-files/CommonPackages';
import * as CustomCode from '../../../custom-files/CustomCode';
import * as CustomCollapsible from '../../../custom-files/CustomCollapsible';
import OfflineMode_CheckIfAlreadyDownloaded from '../../../global-functions/OfflineMode_CheckIfAlreadyDownloaded';
import Player_LoadAndPlay from '../../../global-functions/Player_LoadAndPlay';
import palettes from '../../../themes/palettes';
import * as Utils from '../../../utils';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const defaultProps = { lesson: null };

const DownloadedLessonDetailScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [MindsetActivityResponse, setMindsetActivityResponse] =
    React.useState('');
  const [apiResponse, setApiResponse] = React.useState({});
  const [checkboxValue, setCheckboxValue] = React.useState(false);
  const [checkboxValue2, setCheckboxValue2] = React.useState(false);
  const [checkinAnswers, setCheckinAnswers] = React.useState([]);
  const [checkinSetId, setCheckinSetId] = React.useState(0);
  const [currentLesson, setCurrentLesson] = React.useState({});
  const [currentLessonDetails, setCurrentLessonDetails] = React.useState({});
  const [currentQuestion, setCurrentQuestion] = React.useState({});
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [feedbackContent, setFeedbackContent] = React.useState('');
  const [feedbackStarRating, setFeedbackStarRating] = React.useState(0);
  const [heading, setHeading] = React.useState('');
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingPartCheckIn, setIsLoadingPartCheckIn] = React.useState(false);
  const [isLoadingPartLesson, setIsLoadingPartLesson] = React.useState(false);
  const [isLoadingPartPracticeExcercise, setIsLoadingPartPracticeExcercise] =
    React.useState(false);
  const [nextLesson, setNextLesson] = React.useState({});
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
  const [sliderValue, setSliderValue] = React.useState(0);
  const [tactic_image, setTactic_image] = React.useState('');
  const [visibleModalFeedback, setVisibleModalFeedback] = React.useState(false);
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

  const onPressAnimateLesson = async () => {
    const PlayerAnimationValues = CommonPackages?.PlayerAnimationValues;
    // No audio content
    if (props.route?.params?.lesson?.audio_content === null) {
      PlayerAnimationValues.isAllowScrollingContent.value = true;
      await delaySeconds(10);
      PlayerAnimationValues.goUpRead.value = true;
      PlayerAnimationValues.goUpAudio.value = true;
    } else {
      PlayerAnimationValues.goDownRead.value = true;
      PlayerAnimationValues.goUpAudio.value = true;
    }
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

    console.log(updatedList);
    return updatedList;
  };

  const updateQuizAnswers = (list, ques, ans) => {
    var updatedList = list;

    updatedList.push({
      quiz_question_id: ques.id,
      quiz_answer_id: ans.id,
    });

    //console.log(updatedList)
    return updatedList;
  };
  const isFocused = useIsFocused();

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
        source={imageSource(Images['BG'])}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
            {
              bottom: 0,
              left: 0,
              opacity: 0.5,
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
        {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
            {
              height: null,
              justifyContent: 'space-between',
              paddingTop: safeAreaInsets.top + 10,
            }
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
                fontFamily: 'Poppins_500Medium',
                fontSize: 15,
                paddingTop: 5,
              },
              dimensions.width
            )}
          >
            {heading}
          </Text>
        </View>
      </View>

      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        <SimpleStyleScrollView
          bounces={true}
          horizontal={false}
          keyboardShouldPersistTaps={'never'}
          nestedScrollEnabled={false}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}
          style={StyleSheet.applyWidth(
            { flex: 1, paddingBottom: 20 },
            dimensions.width
          )}
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
                  fontSize: 25,
                  marginTop: 10,
                  textAlign: 'center',
                }
              ),
              dimensions.width
            )}
          >
            {(params?.lesson ?? defaultProps.lesson)?.title}
          </Text>
          {/* Description */}
          <>
            {!(
              (params?.lesson ?? defaultProps.lesson)?.sub_title?.length > 0
            ) ? null : (
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
                      fontSize: 19,
                      marginTop: 6,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {(params?.lesson ?? defaultProps.lesson)?.sub_title}
              </Text>
            )}
          </>
          {/* Normal Flow */}
          <View
            style={StyleSheet.applyWidth(
              { flex: 1, paddingTop: 25 },
              dimensions.width
            )}
          >
            {/* Wrapper */}
            <View
              style={StyleSheet.applyWidth(
                { marginLeft: 20, marginRight: 20 },
                dimensions.width
              )}
            >
              {/* New Lesson Row */}
              <>
                {!currentLesson ? null : (
                  <Pressable
                    onPress={() => {
                      const handler = async () => {
                        try {
                          await onPressAnimateLesson();
                          const itemToPlay =
                            OfflineMode_CheckIfAlreadyDownloaded(
                              Variables,
                              params?.lesson ?? defaultProps.lesson
                            );
                          await Player_LoadAndPlay(
                            Variables,
                            setGlobalVariableValue,
                            itemToPlay
                          );
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
                      renderCheckbox={() => null}
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
            </View>
          </View>
        </SimpleStyleScrollView>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(DownloadedLessonDetailScreen);
