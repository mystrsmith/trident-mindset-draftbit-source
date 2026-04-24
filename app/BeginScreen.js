import React from 'react';
import { Icon, Pressable, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Keyboard,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as AuthComponents from '../custom-files/AuthComponents';
import * as CustomCode from '../custom-files/CustomCode';
import * as DismissKeyboardView from '../custom-files/DismissKeyboardView';
import Player_StopPlay from '../global-functions/Player_StopPlay';
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

const BeginScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [image, setImage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingApple, setIsLoadingApple] = React.useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        await Player_StopPlay(setGlobalVariableValue);
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
      <ImageBackground
        resizeMode={'cover'}
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        source={imageSource(Images['OceanFinisherStory'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
          dimensions.width
        )}
      >
        <Utils.CustomCodeErrorBoundary>
          <DismissKeyboardView.Index style={{ flex: 1 }}>
            {/* Container */}
            <View
              style={StyleSheet.applyWidth(
                {
                  flex: 1,
                  paddingBottom: safeAreaInsets.bottom + 5,
                  paddingTop: safeAreaInsets.top + 5,
                },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    flex: 1,
                    paddingLeft: Constants['CONTENT_PADDING'],
                    paddingRight: Constants['CONTENT_PADDING'],
                  },
                  dimensions.width
                )}
              >
                {/* View 2 */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      flex: 1,
                      justifyContent: 'space-between',
                      paddingTop: 20,
                    },
                    dimensions.width
                  )}
                >
                  {/* Top */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 30,
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
                            color: palettes.App['Custom Color'],
                            fontFamily: 'Rasa_500Medium',
                            fontSize: 28,
                            textAlign: 'center',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Continue Your Training'}
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
                            color: palettes.App['Custom Color'],
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 14,
                            marginTop: 10,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Create a free account to save your progress'}
                    </Text>
                  </View>
                  {/* Bottom View */}
                  <View
                    style={StyleSheet.applyWidth(
                      { marginTop: 100 },
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
                      {/* Apple Custom Code */}
                      <AuthComponents.AppleWrapper
                        {...{
                          isLoading: isLoadingApple,
                          setIsLoading: setIsLoadingApple,
                          setErrorMessage,
                          navigation,
                        }}
                      >
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              backgroundColor: palettes.App['Custom Color'],
                              borderBottomLeftRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderBottomRightRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderTopLeftRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderTopRightRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              flexDirection: 'row',
                              height: 44,
                              justifyContent: 'center',
                              marginTop: 10,
                            },
                            dimensions.width
                          )}
                        >
                          <>
                            {isLoadingApple ? null : (
                              <Icon
                                size={24}
                                color={theme.colors.text.strong}
                                name={'FontAwesome/apple'}
                              />
                            )}
                          </>
                          <>
                            {isLoadingApple ? null : (
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
                                      color: theme.colors.text.strong,
                                      fontFamily: 'Rasa_500Medium',
                                      fontSize: 18,
                                      marginLeft: 10,
                                      marginTop: 2,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {'Create with Apple'}
                              </Text>
                            )}
                          </>
                          <>
                            {!isLoadingApple ? null : (
                              <ActivityIndicator
                                animating={true}
                                hidesWhenStopped={true}
                                size={'small'}
                                {...GlobalStyles.ActivityIndicatorStyles(theme)[
                                  'Activity Indicator'
                                ].props}
                                color={theme.colors.text.strong}
                                style={StyleSheet.applyWidth(
                                  GlobalStyles.ActivityIndicatorStyles(theme)[
                                    'Activity Indicator'
                                  ].style,
                                  dimensions.width
                                )}
                              />
                            )}
                          </>
                        </View>
                      </AuthComponents.AppleWrapper>
                      {/* Google Custom Code */}
                      <AuthComponents.GoogleWrapper
                        {...{
                          isLoading: isLoadingGoogle,
                          setIsLoading: setIsLoadingGoogle,
                          setErrorMessage,
                          navigation,
                        }}
                      >
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              backgroundColor: palettes.App['Custom Color'],
                              borderBottomLeftRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderBottomRightRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderTopLeftRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderTopRightRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              flexDirection: 'row',
                              height: 44,
                              justifyContent: 'center',
                              marginTop: 25,
                            },
                            dimensions.width
                          )}
                        >
                          <>
                            {isLoadingGoogle ? null : (
                              <Image
                                resizeMode={'cover'}
                                {...GlobalStyles.ImageStyles(theme)['Image']
                                  .props}
                                source={imageSource(Images['Google'])}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ImageStyles(theme)['Image']
                                      .style,
                                    { height: 24, width: 24 }
                                  ),
                                  dimensions.width
                                )}
                              />
                            )}
                          </>
                          <>
                            {isLoadingGoogle ? null : (
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
                                      color: theme.colors.text.strong,
                                      fontFamily: 'Rasa_500Medium',
                                      fontSize: 18,
                                      marginLeft: 10,
                                      marginTop: 2,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {'Create with Google'}
                              </Text>
                            )}
                          </>
                          <>
                            {!isLoadingGoogle ? null : (
                              <ActivityIndicator
                                animating={true}
                                hidesWhenStopped={true}
                                size={'small'}
                                {...GlobalStyles.ActivityIndicatorStyles(theme)[
                                  'Activity Indicator'
                                ].props}
                                color={theme.colors.text.strong}
                                style={StyleSheet.applyWidth(
                                  GlobalStyles.ActivityIndicatorStyles(theme)[
                                    'Activity Indicator'
                                  ].style,
                                  dimensions.width
                                )}
                              />
                            )}
                          </>
                        </View>
                      </AuthComponents.GoogleWrapper>
                      {/* Create With Email */}
                      <Pressable
                        onPress={() => {
                          const handler = async () => {
                            try {
                              Keyboard.dismiss();
                              await waitUtil({ milliseconds: 150 });
                              navigation.push('Auth', {
                                screen: 'SignUpScreen',
                              });
                            } catch (err) {
                              Sentry.captureException(err);
                              console.error(err);
                            }
                          };
                          handler();
                        }}
                        activeOpacity={0.3}
                        style={StyleSheet.applyWidth(
                          { marginTop: 25 },
                          dimensions.width
                        )}
                      >
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              backgroundColor: palettes.App['Custom Color'],
                              borderBottomLeftRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderBottomRightRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderTopLeftRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              borderTopRightRadius:
                                Constants['BUTTONS_CORNER_RADIUS'],
                              flexDirection: 'row',
                              height: 44,
                              justifyContent: 'center',
                            },
                            dimensions.width
                          )}
                        >
                          <Icon
                            size={24}
                            color={theme.colors.text.strong}
                            name={'MaterialCommunityIcons/email-outline'}
                          />
                          <Text
                            accessible={true}
                            selectable={false}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: theme.colors.text.strong,
                                  fontFamily: 'Rasa_500Medium',
                                  fontSize: 18,
                                  marginLeft: 10,
                                  marginTop: 2,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'Create with Email'}
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
                            navigation.push('Auth', { screen: '' });
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
            </View>
          </DismissKeyboardView.Index>
        </Utils.CustomCodeErrorBoundary>
      </ImageBackground>
    </ScreenContainer>
  );
};

export default withTheme(BeginScreen);
