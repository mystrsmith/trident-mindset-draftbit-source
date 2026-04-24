import React from 'react';
import { Pressable, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import * as OnboardingVideoPlayer from '../custom-files/OnboardingVideoPlayer';
import logEvent from '../global-functions/logEvent';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const OnboardingStep1Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [isLoading, setIsLoading] = React.useState(true);
  const onScreenBlur = () => {
    if (videoRef && videoRef.current) {
      videoRef.current?.pause();
    }
  };
  const videoRef = React.useRef(null);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      if (Constants['AUTH_TOKEN']?.length) {
        navigation.navigate('BottomTabNavigator', {});
      } else {
        if (Constants['ANONYMOUS_ID']?.length > 0) {
          if (Constants['ONBOARDING_FIRST_LESSON_COMPLETED'] === true) {
            if (navigation.canGoBack()) {
              navigation.popToTop();
            }
            navigation.replace('BeginScreen', {});
            if (true) {
              return;
            }
          } else {
          }

          if (Constants['ONBOARDING_FIRST_LESSON'] !== null) {
            if (navigation.canGoBack()) {
              navigation.popToTop();
            }
            navigation.replace('OnboardingPlayerScreen', {});
            if (true) {
              return;
            }
          } else {
          }

          if (Constants['QUIZ_ANSWERS']?.length) {
            if (navigation.canGoBack()) {
              navigation.popToTop();
            }
            navigation.replace('OnboardingStep3Screen', {
              retakeQuizFlow: false,
            });
            if (true) {
              return;
            }
          } else {
          }
        } else {
        }
      }

      logEvent('ob_step1', null);
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  }, [isFocused]);
  React.useEffect(() => {
    try {
      if (isFocused) {
        return;
      }
      onScreenBlur();
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
      {/* Loaded */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* Custom Code 2 */}
        <Utils.CustomCodeErrorBoundary>
          <OnboardingVideoPlayer.Index isFocused={isFocused} />
        </Utils.CustomCodeErrorBoundary>
        {/* Container */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flex: 1,
              justifyContent: 'space-between',
              paddingBottom: 30,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 100,
            },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'center', flex: 1, justifyContent: 'center' },
              dimensions.width
            )}
          >
            <Text
              accessible={true}
              selectable={false}
              allowFontScaling={false}
              style={StyleSheet.applyWidth(
                {
                  alignSelf: 'center',
                  color: palettes.Brand.Surface,
                  fontFamily: 'Rasa_700Bold',
                  fontSize: 26,
                  marginTop: 30,
                  textAlign: 'center',
                },
                dimensions.width
              )}
            >
              {
                'Trident Mindset teaches 12 proven tactics to help you be calm, effective, and content in any situation'
              }
            </Text>
            {/* Text 2 */}
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              allowFontScaling={false}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand.Surface,
                    fontFamily: 'Rasa_500Medium',
                    fontSize: 18,
                    marginTop: 50,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {
                'We’ll personalize your journey through the 12 tactics by asking three quick questions about your goals'
              }
            </Text>
            {/* Onward */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('OnboardingStep2Screen', {
                    retakeQuizFlow: false,
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              style={StyleSheet.applyWidth({ marginTop: 30 }, dimensions.width)}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignSelf: 'center',
                    backgroundColor: palettes.App.Success,
                    borderRadius: 100,
                    paddingBottom: 10,
                    paddingLeft: 35,
                    paddingRight: 35,
                    paddingTop: 10,
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
                        fontSize: 18,
                        paddingTop: 2,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Get Started'}
                </Text>
              </View>
            </Pressable>
          </View>
          {/* Footer */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50,
                padding: 20,
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
                    color: Constants['APP_FONT_COLOR'],
                    fontFamily: 'Rasa_400Regular',
                    fontSize: 16,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Already have an account?'}
            </Text>
            {/* Sign In */}
            <Pressable
              onPress={() => {
                try {
                  navigation.navigate('Auth', { screen: '' });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
              style={StyleSheet.applyWidth({ marginTop: 2 }, dimensions.width)}
            >
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: theme.colors.branding.secondary,
                      fontFamily: 'Rasa_500Medium',
                      fontSize: 18,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'SIGN IN'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(OnboardingStep1Screen);
