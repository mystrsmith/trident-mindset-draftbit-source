import React from 'react';
import { Button, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { ImageBackground, Platform, StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as AnimationTacticsCard from '../custom-files/AnimationTacticsCard';
import * as CommonPackages from '../custom-files/CommonPackages';
import * as CustomCode from '../custom-files/CustomCode';
import * as FadeInOutText from '../custom-files/FadeInOutText';
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

const defaultProps = { displayStep4: false, retakeQuizFlow: false };

const OnboardingStep3Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [currentQuesionIndex, setCurrentQuesionIndex] = React.useState(0);
  const [isReadyToRunAnimation, setIsReadyToRunAnimation] =
    React.useState(false);
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [step, setStep] = React.useState(0);
  const [tactics, setTactics] = React.useState([]);
  const [visibleCustomizeYourPath, setVisibleCustomizeYourPath] =
    React.useState(true);
  const [visibleDescriptionText1, setVisibleDescriptionText1] =
    React.useState(false);
  const [visibleDescriptionText2, setVisibleDescriptionText2] =
    React.useState(false);
  const preloadImages = async tactics => {
    const Image = CommonPackages.Image;
    const urlOfImages = tactics.map(tactic => tactic?.portrait_image?.url);
    try {
      const preFetchTasks = urlOfImages.map(url => Image.prefetch(url));
      await Promise.all(preFetchTasks);
    } catch (error) {
      console.error('Error prefetching images:', error);
    }
  };
  // React.useEffect(() => {
  //     setTimeout(() => {
  //       setIsReadyToRunAnimation(true)
  //     }, 18200);
  // },[])

  React.useEffect(() => {
    setTimeout(() => {
      setIsReadyToRunAnimation(true);
    }, 4000);
  }, []);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        if ((params?.retakeQuizFlow ?? defaultProps.retakeQuizFlow) === true) {
          const resTacticsAuth = (
            await XanoBackendApi.getTacticsRecommendationGET(Constants)
          )?.json;
          setTactics(resTacticsAuth);
          await preloadImages(resTacticsAuth);
        } else {
          const resultTactics = (
            await XanoBackendApi.getTacticRecommendationsV2GET(Constants, {
              anonymous_id: Constants['ANONYMOUS_ID'],
            })
          )?.json;
          setTactics(resultTactics);
          await preloadImages(resultTactics);
        }

        logEvent('ob_step3_view', null);
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
        <>
          {!isReadyToRunAnimation ? null : (
            <View
              style={StyleSheet.applyWidth(
                { gap: 5, top: 50 },
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
                      fontSize: 22,
                      paddingLeft: 25,
                      paddingRight: 25,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {"We've customized your path."}
              </Text>
              {/* Sub title */}
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
                      fontSize: 22,
                      paddingLeft: 25,
                      paddingRight: 25,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {
                  "Swipe to see the order in which you'll learn the 12 Trident Mindset strategies."
                }
              </Text>
            </View>
          )}
        </>
        {/* Content */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              flex: 1,
              justifyContent: 'center',
            },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flex: 1,
                height: '100%',
                justifyContent: 'center',
                position: 'absolute',
                width: '100%',
              },
              dimensions.width
            )}
          >
            {/* Customize Your Path Text */}
            <Utils.CustomCodeErrorBoundary>
              <FadeInOutText.Index
                label="Customizing your path"
                onCompleted={() => {
                  setIsReadyToRunAnimation(true);
                }}
              />
            </Utils.CustomCodeErrorBoundary>
          </View>
          {/* AnimationTacticsCard */}
          <>
            {!isReadyToRunAnimation ? null : (
              <Utils.CustomCodeErrorBoundary>
                <AnimationTacticsCard.Index tactics={tactics} />
              </Utils.CustomCodeErrorBoundary>
            )}
          </>
        </View>
        {/* Next button */}
        <View
          style={StyleSheet.applyWidth(
            { margin: 20, padding: 20 },
            dimensions.width
          )}
        >
          <>
            {!isReadyToRunAnimation ? null : (
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  try {
                    if (
                      (params?.retakeQuizFlow ??
                        defaultProps.retakeQuizFlow) === true
                    ) {
                      if (
                        (params?.displayStep4 ?? defaultProps.displayStep4) ===
                        true
                      ) {
                        navigation.push('OnboardingStep4Screen', {});
                      } else {
                        if (navigation.canGoBack()) {
                          navigation.popToTop();
                        }
                        navigation.replace('BottomTabNavigator', {
                          screen: 'HomeStack',
                          params: { screen: '' },
                        });
                      }
                    } else {
                      navigation.navigate('OnboardingStep4Screen', {});
                      logEvent('ob_step3_tap_next', null);
                    }
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ButtonStyles(theme)['Button'].style,
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
            )}
          </>
        </View>
      </ImageBackground>
    </ScreenContainer>
  );
};

export default withTheme(OnboardingStep3Screen);
