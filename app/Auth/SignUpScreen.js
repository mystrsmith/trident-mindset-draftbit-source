import React from 'react';
import {
  Button,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../../GlobalStyles.js';
import * as XanoBackendApi from '../../apis/XanoBackendApi.js';
import * as GlobalVariables from '../../config/GlobalVariableContext';
import Images from '../../config/Images';
import * as AuthComponents from '../../custom-files/AuthComponents';
import * as CustomCode from '../../custom-files/CustomCode';
import logEventSignUp from '../../global-functions/logEventSignUp';
import loginRevenueCat from '../../global-functions/loginRevenueCat';
import palettes from '../../themes/palettes';
import * as Utils from '../../utils';
import Breakpoints from '../../utils/Breakpoints';
import * as StyleSheet from '../../utils/StyleSheet';
import imageSource from '../../utils/imageSource';
import useIsFocused from '../../utils/useIsFocused';
import useNavigation from '../../utils/useNavigation';
import useParams from '../../utils/useParams';
import useWindowDimensions from '../../utils/useWindowDimensions';
import waitUtil from '../../utils/wait';

const SignUpScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [image, setImage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingApple, setIsLoadingApple] = React.useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [showPhotoSources, setShowPhotoSources] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState('');
  const inputValidation = () => {
    const expr = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let foundError = false;

    if (email.length < 1) {
      setErrorMessage('Please enter Email');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

    if (!expr.test(email)) {
      setErrorMessage('Please enter a valid email');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

    if (password.length < 1) {
      setErrorMessage('Please enter a Password');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

    // if (confirmPassword.length < 1) {
    //     setErrorMessage("Please re-enter your Password")
    //     foundError = true;
    //     return foundError;

    // } else {
    //     setErrorMessage("")
    // }

    // if (confirmPassword != password) {
    //     setErrorMessage("Passwords do not match")
    //     foundError = true;
    //     return foundError;

    // } else {
    //     setErrorMessage("")
    // }

    return foundError;
  };
  const xanoBackendUpdateUserTacticRecommendationsPATCH =
    XanoBackendApi.useUpdateUserTacticRecommendationsPATCH();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      console.log(Constants['QUIZ_ANSWERS']);
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
      style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
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
          {/* Header */}
          <View
            {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
                { justifyContent: 'flex-start', marginLeft: 12 }
              ),
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
                  {
                    alignItems: 'center',
                    borderRadius: 24,
                    height: 40,
                    justifyContent: 'center',
                    width: 40,
                  },
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes.App['Custom Color']}
                  name={'MaterialCommunityIcons/keyboard-backspace'}
                  size={25}
                />
              </View>
            </Pressable>
          </View>

          <SimpleStyleKeyboardAwareScrollView
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps={'never'}
            showsVerticalScrollIndicator={true}
            viewIsInsideTabBar={false}
            enableAutomaticScroll={true}
            enableOnAndroid={true}
            extraScrollHeight={25}
            style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
          >
            {/* Main View */}
            <View
              style={StyleSheet.applyWidth(
                {
                  justifyContent: 'center',
                  paddingLeft: Constants['CONTENT_PADDING'],
                  paddingRight: Constants['CONTENT_PADDING'],
                },
                dimensions.width
              )}
            >
              {/* Email */}
              <View
                style={StyleSheet.applyWidth(
                  { marginTop: 100 },
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Data Label'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Data Label'].style,
                      {
                        color: Constants['APP_FONT_COLOR'],
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 21,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Email'}
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  changeTextDelay={500}
                  onChangeText={newTextInputValue => {
                    const textInputValue = newTextInputValue;
                    try {
                      setEmail(newTextInputValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  webShowOutline={true}
                  {...GlobalStyles.TextInputStyles(theme)['Form Inputs'].props}
                  autoComplete={'email'}
                  autoCorrect={false}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : 'email-address'
                  }
                  placeholder={'Enter your email'}
                  placeholderTextColor={theme.colors.text.light}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextInputStyles(theme)['Form Inputs'].style,
                      { color: Constants['APP_FONT_COLOR'] }
                    ),
                    dimensions.width
                  )}
                  value={email}
                />
              </View>
              {/* Password */}
              <View
                style={StyleSheet.applyWidth(
                  { marginBottom: 12 },
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Data Label'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Data Label'].style,
                      {
                        color: Constants['APP_FONT_COLOR'],
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 21,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Password'}
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  autoCorrect={true}
                  changeTextDelay={500}
                  onChangeText={newTextInputValue => {
                    try {
                      setPassword(newTextInputValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  webShowOutline={true}
                  {...GlobalStyles.TextInputStyles(theme)['Form Inputs'].props}
                  placeholder={'Enter your password'}
                  placeholderTextColor={theme.colors.text.light}
                  secureTextEntry={true}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextInputStyles(theme)['Form Inputs'].style,
                      { color: Constants['APP_FONT_COLOR'] }
                    ),
                    dimensions.width
                  )}
                  value={password}
                />
              </View>

              <View
                style={StyleSheet.applyWidth(
                  { marginTop: 15 },
                  dimensions.width
                )}
              >
                {/* Applied Code View */}
                <>
                  {!Constants['APPLIED_REDEEM_CODE'] ? null : (
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          borderBottomLeftRadius:
                            Constants['BUTTONS_CORNER_RADIUS'],
                          borderBottomRightRadius:
                            Constants['BUTTONS_CORNER_RADIUS'],
                          borderTopLeftRadius:
                            Constants['BUTTONS_CORNER_RADIUS'],
                          borderTopRightRadius:
                            Constants['BUTTONS_CORNER_RADIUS'],
                          flexDirection: 'row',
                          justifyContent: 'center',
                        },
                        dimensions.width
                      )}
                    >
                      <Icon
                        color={palettes.App.Success}
                        name={'MaterialCommunityIcons/check-decagram'}
                        size={32}
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
                              fontSize: 15,
                              marginLeft: 10,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Applied Code: '}
                        {Constants['APPLIED_REDEEM_CODE']?.code}
                      </Text>
                    </View>
                  )}
                </>
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
              {/* View 3 */}
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center' },
                  dimensions.width
                )}
              >
                {/* SIGN UP */}
                <Button
                  accessible={true}
                  iconPosition={'left'}
                  onPress={() => {
                    const handler = async () => {
                      try {
                        Keyboard.dismiss();
                        const foundError = inputValidation();
                        if (foundError) {
                          return;
                        }
                        setIsLoading(true);
                        const api_Response = (
                          await XanoBackendApi.signUpPOST(Constants, {
                            avatar: image,
                            code_id: Constants['APPLIED_REDEEM_CODE']?.id,
                            email: email,
                            name: name,
                            password: password,
                            phone_number: phone,
                          })
                        )?.json;
                        if (api_Response?.message?.length) {
                          setErrorMessage(api_Response?.message);
                        }
                        logEventSignUp('email');
                        if (api_Response?.authToken) {
                          await setGlobalVariableValue({
                            key: 'AUTH_TOKEN',
                            value: 'Bearer ' + api_Response?.authToken,
                          });
                          await waitUtil({ milliseconds: 1000 });
                          await loginRevenueCat(
                            setGlobalVariableValue,
                            api_Response?.user?.id
                          );
                          await setGlobalVariableValue({
                            key: 'PROFILE_DETAILS',
                            value: api_Response?.user,
                          });
                          await setGlobalVariableValue({
                            key: 'QUIZ_ANSWERS',
                            value: [],
                          });
                          if (Constants['ANONYMOUS_ID']?.length > 0) {
                            const resTactics = (
                              await xanoBackendUpdateUserTacticRecommendationsPATCH.mutateAsync(
                                { anonymous_id: Constants['ANONYMOUS_ID'] }
                              )
                            )?.json;
                          } else {
                          }

                          if (navigation.canGoBack()) {
                            navigation.popToTop();
                          }
                          navigation.replace('BottomTabNavigator', {
                            screen: 'HomeStack',
                            params: { screen: '' },
                          });
                        } else {
                        }

                        setIsLoading(false);
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    };
                    handler();
                  }}
                  {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
                  activeOpacity={0.3}
                  disabled={Boolean(isLoading)}
                  disabledOpacity={0.5}
                  loading={Boolean(isLoading)}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                      {
                        backgroundColor: palettes.App.Success,
                        borderRadius: 12,
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 18,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 2,
                        width: dimensions.width / 1.3,
                      }
                    ),
                    dimensions.width
                  )}
                  title={'Start Training'}
                />
              </View>
              {/* Social Options */}
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', gap: 25 },
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
                        fontFamily: 'Rasa_500Medium',
                        fontSize: 17,
                        marginTop: 35,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'OR'}
                </Text>
                {/* Google */}
                <Utils.CustomCodeErrorBoundary>
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
                          borderRadius: 12,
                          flexDirection: 'row',
                          height: 44,
                          justifyContent: 'center',
                          width: dimensions.width / 1.6,
                        },
                        dimensions.width
                      )}
                    >
                      <>
                        {isLoadingGoogle ? null : (
                          <Image
                            resizeMode={'cover'}
                            {...GlobalStyles.ImageStyles(theme)['Image'].props}
                            source={imageSource(Images['Google'])}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.ImageStyles(theme)['Image'].style,
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
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: theme.colors.text.strong,
                                  fontFamily: 'Rasa_500Medium',
                                  fontSize: 18,
                                  marginLeft: 10,
                                  paddingTop: 2,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'Continue with Google'}
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
                </Utils.CustomCodeErrorBoundary>
                {/* Apple */}
                <Utils.CustomCodeErrorBoundary>
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
                          borderRadius: 12,
                          flexDirection: 'row',
                          height: 44,
                          justifyContent: 'center',
                          width: dimensions.width / 1.6,
                        },
                        dimensions.width
                      )}
                    >
                      <>
                        {isLoadingApple ? null : (
                          <Icon size={24} name={'FontAwesome/apple'} />
                        )}
                      </>
                      <>
                        {isLoadingApple ? null : (
                          <Text
                            accessible={true}
                            selectable={false}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  fontFamily: 'Rasa_500Medium',
                                  fontSize: 18,
                                  marginLeft: 10,
                                  paddingTop: 2,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'Continue with Apple'}
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
                </Utils.CustomCodeErrorBoundary>
              </View>
            </View>
          </SimpleStyleKeyboardAwareScrollView>
        </View>
      </ImageBackground>
    </ScreenContainer>
  );
};

export default withTheme(SignUpScreen);
