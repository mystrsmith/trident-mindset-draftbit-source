import React from 'react';
import {
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import * as CustomMarquee from '../custom-files/CustomMarquee';
import * as CustomStatusBar from '../custom-files/CustomStatusBar';
import * as OnboardingVideoPlayer from '../custom-files/OnboardingVideoPlayer';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const WelcomeScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingApple, setIsLoadingApple] = React.useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [testimonials, setTestimonials] = React.useState([
    { id: 1, text: 'I guarantee this will change your life.', author: 'Noah' },
    {
      id: 2,
      text: 'This app should come included with every phone so every human on the planet can listen to it.',
      author: 'Tricia',
    },
    {
      id: 3,
      text: 'By far the best app or program I have ever purchased. This app is a Godsend.',
      author: 'Denise',
    },
    {
      id: 4,
      text: 'The most impactful program I have ever come across.',
      author: 'Meyer',
    },
    {
      id: 5,
      text: 'Completely turned me around from a very dark place.',
      author: 'Rose',
    },
    {
      id: 6,
      text: 'I think it’s important to get this in the hands of as many people as possible.',
      author: 'Patch',
    },
    {
      id: 7,
      text: 'An incredible program that every single human should hear.',
      author: 'Meredith',
    },
    {
      id: 8,
      text: 'Straightforward information delivered in succinct daily chunks that can be applied to my life right away.',
      author: 'KP',
    },
    {
      id: 9,
      text: 'Nothing has had the impact on my life that this app has.',
      author: 'James',
    },
  ]);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      /* hidden 'Set Variable' action */
      /* hidden 'Navigate' action */
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
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: theme.colors.background.base },
        dimensions.width
      )}
    >
      <Utils.CustomCodeErrorBoundary>
        <CustomStatusBar.Component theme={theme} />
      </Utils.CustomCodeErrorBoundary>
      <SimpleStyleScrollView
        horizontal={false}
        keyboardShouldPersistTaps={'never'}
        nestedScrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
      >
        <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
          <Utils.CustomCodeErrorBoundary>
            <OnboardingVideoPlayer.Index isFocused={isFocused} />
          </Utils.CustomCodeErrorBoundary>
          {/* Container */}
          <View
            style={StyleSheet.applyWidth(
              {
                flex: 1,
                justifyContent: 'space-between',
                paddingBottom: safeAreaInsets.bottom + 5,
                paddingTop: safeAreaInsets.top + 5,
              },
              dimensions.width
            )}
          >
            {/* Top View */}
            <View
              style={StyleSheet.applyWidth({ marginTop: 40 }, dimensions.width)}
            >
              {/* Heading */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                allowFontScaling={false}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                    {
                      color: Constants['APP_FONT_COLOR'],
                      fontFamily: 'Rasa_500Medium',
                      fontSize: 28,
                      lineHeight: 30,
                      paddingLeft: 20,
                      paddingRight: 20,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'The Quality of Your Mind Determines the Quality of Your Life'}
              </Text>
            </View>
            {/* Marquee Section */}
            <View>
              <Utils.CustomCodeErrorBoundary>
                <CustomMarquee.Marquee items={testimonials} />
              </Utils.CustomCodeErrorBoundary>
              {/* Rating */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    gap: 5,
                    justifyContent: 'center',
                    marginTop: 20,
                  },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 5,
                      justifyContent: 'center',
                    },
                    dimensions.width
                  )}
                >
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'FontAwesome/star'}
                    size={18}
                  />
                  {/* Icon 5 */}
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'FontAwesome/star'}
                    size={18}
                  />
                  {/* Icon 4 */}
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'FontAwesome/star'}
                    size={18}
                  />
                  {/* Icon 3 */}
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'FontAwesome/star'}
                    size={18}
                  />
                  {/* Icon 2 */}
                  <Icon
                    color={palettes.App['Custom Color']}
                    name={'FontAwesome/star'}
                    size={18}
                  />
                </View>

                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.App['Custom Color'],
                        fontFamily: 'Rasa_500Medium',
                        fontSize: 16,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'4.9 Star Rating in the App Store'}
                </Text>
              </View>
            </View>
            {/* Bottom View */}
            <View
              style={StyleSheet.applyWidth(
                {
                  paddingLeft: Constants['CONTENT_PADDING'],
                  paddingRight: Constants['CONTENT_PADDING'],
                },
                dimensions.width
              )}
            >
              {/* Social Options */}
              <View
                style={StyleSheet.applyWidth(
                  { marginTop: 35, padding: 10 },
                  dimensions.width
                )}
              >
                {/* Begin */}
                <Pressable
                  onPress={() => {
                    try {
                      navigation.push('BeginScreen', {});
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  activeOpacity={0.3}
                  style={StyleSheet.applyWidth(
                    { height: 44, marginTop: 25 },
                    dimensions.width
                  )}
                >
                  {/* View 2 */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: palettes.App.Success,
                        borderRadius: 12,
                        height: 48,
                        justifyContent: 'center',
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
                            color: palettes.App.White,
                            fontFamily: 'Rasa_500Medium',
                            fontSize: 20,
                            paddingTop: 2,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Get started'}
                    </Text>

                    <Text
                      accessible={true}
                      selectable={false}
                      style={StyleSheet.applyWidth(
                        {
                          color: palettes.App.White,
                          fontFamily: 'Rasa_300Light',
                          fontSize: 14,
                          marginBottom: 5,
                        },
                        dimensions.width
                      )}
                    >
                      {'No payment or credit card is required.'}
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
                  style={StyleSheet.applyWidth(
                    { marginTop: 2 },
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
              {/* error */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Error Label'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Error Label'].style,
                    {
                      fontFamily: 'Rasa_400Regular',
                      fontSize: 20,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {errorMessage}
              </Text>
            </View>
          </View>
        </View>
      </SimpleStyleScrollView>
    </ScreenContainer>
  );
};

export default withTheme(WelcomeScreen);
