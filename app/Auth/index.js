import React from 'react';
import {
  Button,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  SimpleStyleScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Image,
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
import * as OnboardingVideoPlayer from '../../custom-files/OnboardingVideoPlayer';
import getRevCatCustomerInfo from '../../global-functions/getRevCatCustomerInfo';
import logEvent from '../../global-functions/logEvent';
import loginOneSignal from '../../global-functions/loginOneSignal';
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

const defaultProps = { handleFromLogout: false };

const LoginScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingApple, setIsLoadingApple] = React.useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [textInput2Value, setTextInput2Value] = React.useState('');
  const [textInput2Value2, setTextInput2Value2] = React.useState('');
  const [textInputValue, setTextInputValue] = React.useState('');
  const inputValidations = () => {
    const expr =
      /^([\w-\.]+)@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/;

    let foundError = false;

    if (email.length < 1) {
      setErrorMessage('Please enter the email');
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
      setErrorMessage('Please enter your Password');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

    return foundError;
  };
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      setIsLoadingGoogle(false);
      setIsLoadingApple(false);
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
      hasTopSafeArea={false}
      style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
    >
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        <Utils.CustomCodeErrorBoundary>
          <OnboardingVideoPlayer.Index isFocused={isFocused} />
        </Utils.CustomCodeErrorBoundary>
        {/* Container  */}
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
            enableAutomaticScroll={false}
            enableOnAndroid={false}
            enableResetScrollToCoords={false}
            showsVerticalScrollIndicator={true}
            viewIsInsideTabBar={false}
            keyboardShouldPersistTaps={'always'}
            style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
          >
            <SimpleStyleScrollView
              bounces={true}
              horizontal={false}
              keyboardShouldPersistTaps={'never'}
              nestedScrollEnabled={false}
              showsHorizontalScrollIndicator={true}
              showsVerticalScrollIndicator={true}
              style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
            >
              {/* Main View */}
              <View
                style={StyleSheet.applyWidth(
                  {
                    flex: 1,
                    justifyContent: 'center',
                    paddingLeft: Constants['CONTENT_PADDING'],
                    paddingRight: Constants['CONTENT_PADDING'],
                  },
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                      {
                        color: Constants['APP_FONT_COLOR'],
                        fontFamily: 'Rasa_500Medium',
                        fontSize: 32,
                        marginBottom: 35,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Log In'}
                </Text>
                {/* Email */}
                <View>
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
                    {...GlobalStyles.TextInputStyles(theme)['Form Inputs']
                      .props}
                    autoCorrect={false}
                    keyboardType={
                      Platform.OS === 'ios' ? 'ascii-capable' : 'email-address'
                    }
                    placeholder={'Enter your email'}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextInputStyles(theme)['Form Inputs']
                          .style,
                        { color: Constants['APP_FONT_COLOR'] }
                      ),
                      dimensions.width
                    )}
                    value={email}
                  />
                </View>
                {/* Password */}
                <View>
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
                    {...GlobalStyles.TextInputStyles(theme)['Form Inputs']
                      .props}
                    placeholder={'Enter your password'}
                    placeholderTextColor={theme.colors.text.light}
                    secureTextEntry={true}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextInputStyles(theme)['Form Inputs']
                          .style,
                        { color: Constants['APP_FONT_COLOR'] }
                      ),
                      dimensions.width
                    )}
                    value={password}
                  />
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
                {/* LOGIN */}
                <Button
                  accessible={true}
                  iconPosition={'left'}
                  onPress={() => {
                    const handler = async () => {
                      try {
                        Keyboard.dismiss();
                        const foundError = inputValidations();
                        if (foundError) {
                          return;
                        }
                        setIsLoading(true);
                        const api_Response = (
                          await XanoBackendApi.loginPOST(Constants, {
                            email: email,
                            password: password,
                          })
                        )?.json;
                        if (api_Response?.message?.length > 0) {
                          setIsLoading(false);
                          setErrorMessage(api_Response?.message);
                          if (true) {
                            return;
                          }
                        } else {
                        }

                        if (api_Response?.status === 'set_new_password') {
                          setIsLoading(false);
                          navigation.navigate('Auth', {
                            screen: 'VerifyOTPScreen',
                            params: { email: email },
                          });
                        } else {
                          await setGlobalVariableValue({
                            key: 'PROFILE_DETAILS',
                            value: api_Response?.user,
                          });
                          await setGlobalVariableValue({
                            key: 'AUTH_TOKEN',
                            value: 'Bearer ' + api_Response?.authToken,
                          });
                          setIsLoading(false);
                          if (navigation.canGoBack()) {
                            navigation.popToTop();
                          }
                          navigation.replace('BottomTabNavigator', {
                            screen: 'HomeStack',
                            params: { screen: '' },
                          });
                          await loginRevenueCat(
                            setGlobalVariableValue,
                            api_Response?.user?.id
                          );
                          await getRevCatCustomerInfo(setGlobalVariableValue);
                          loginOneSignal(api_Response?.user?.id);
                        }

                        logEvent('af_login', null);
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    };
                    handler();
                  }}
                  {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
                  activeOpacity={0.3}
                  loading={Boolean(isLoading)}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                      {
                        backgroundColor: palettes.App['App Buttons Color'],
                        borderBottomLeftRadius:
                          Constants['BUTTONS_CORNER_RADIUS'],
                        borderBottomRightRadius:
                          Constants['BUTTONS_CORNER_RADIUS'],
                        borderTopLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                        borderTopRightRadius:
                          Constants['BUTTONS_CORNER_RADIUS'],
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 20,
                      }
                    ),
                    dimensions.width
                  )}
                  title={'LOG IN'}
                />
                {/* Forgot Password */}
                <View
                  style={StyleSheet.applyWidth(
                    { alignItems: 'flex-end', marginTop: 16 },
                    dimensions.width
                  )}
                >
                  <Pressable
                    onPress={() => {
                      try {
                        navigation.navigate('Auth', {
                          screen: 'ForgotPasswordScreen',
                        });
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                    activeOpacity={0.3}
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
                            fontSize: 18,
                            marginLeft: 16,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Forgot Password ?'}
                    </Text>
                  </Pressable>
                </View>
                {/* Social Options */}
                <View
                  style={StyleSheet.applyWidth({ gap: 25 }, dimensions.width)}
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
                            borderRadius: Constants['BUTTONS_CORNER_RADIUS'],
                            flexDirection: 'row',
                            height: 44,
                            justifyContent: 'center',
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
                              {' Login with Google'}
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
                              {'Login with Apple'}
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
                  <View>
                    {/* Trident With Teams */}
                    <>
                      {Constants['APPLIED_REDEEM_CODE'] ? null : (
                        <Pressable
                          onPress={() => {
                            try {
                              navigation.push('TridentForTeamsScreen', {});
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
                                backgroundColor: palettes.App['Gold Box'],
                                borderBottomLeftRadius:
                                  Constants['BUTTONS_CORNER_RADIUS'],
                                borderBottomRightRadius:
                                  Constants['BUTTONS_CORNER_RADIUS'],
                                borderTopLeftRadius:
                                  Constants['BUTTONS_CORNER_RADIUS'],
                                borderTopRightRadius:
                                  Constants['BUTTONS_CORNER_RADIUS'],
                                flexDirection: 'row',
                                gap: 5,
                                height: 44,
                                justifyContent: 'center',
                              },
                              dimensions.width
                            )}
                          >
                            <Icon
                              size={24}
                              color={theme.colors.text.strong}
                              name={'MaterialIcons/groups'}
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
                                    fontSize: 20,
                                    marginTop: 2,
                                  }
                                ),
                                dimensions.width
                              )}
                            >
                              {'Trident For Teams'}
                            </Text>
                          </View>
                        </Pressable>
                      )}
                    </>
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
                              gap: 10,
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
                                  fontFamily: 'Rasa_500Medium',
                                  fontSize: 20,
                                  marginTop: 2,
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
                </View>
              </View>
            </SimpleStyleScrollView>
          </SimpleStyleKeyboardAwareScrollView>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(LoginScreen);
