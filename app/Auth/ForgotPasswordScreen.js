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
import { Keyboard, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../../GlobalStyles.js';
import * as XanoBackendApi from '../../apis/XanoBackendApi.js';
import * as GlobalVariables from '../../config/GlobalVariableContext';
import * as BackgroundVideoPlayer from '../../custom-files/BackgroundVideoPlayer';
import * as CustomCode from '../../custom-files/CustomCode';
import palettes from '../../themes/palettes';
import * as Utils from '../../utils';
import Breakpoints from '../../utils/Breakpoints';
import * as StyleSheet from '../../utils/StyleSheet';
import useIsFocused from '../../utils/useIsFocused';
import useNavigation from '../../utils/useNavigation';
import useParams from '../../utils/useParams';
import useWindowDimensions from '../../utils/useWindowDimensions';

const ForgotPasswordScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState('');
  const inputValidations = () => {
    const expr =
      /^([\w-\.]+)@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/;

    let foundError = false;

    if (email.length < 1) {
      setErrorMessage('Please enter your email');
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

    return foundError;
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
      scrollable={false}
      hasBottomSafeArea={false}
      hasSafeArea={false}
    >
      <Utils.CustomCodeErrorBoundary>
        <BackgroundVideoPlayer.Component />
      </Utils.CustomCodeErrorBoundary>
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
        <SimpleStyleKeyboardAwareScrollView
          enableAutomaticScroll={false}
          enableOnAndroid={false}
          enableResetScrollToCoords={false}
          showsVerticalScrollIndicator={true}
          viewIsInsideTabBar={false}
          keyboardShouldPersistTaps={'always'}
          style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
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
                  marginTop: 25,
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
                {'Forgot Password'}
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
                  {...GlobalStyles.TextInputStyles(theme)['Form Inputs'].props}
                  autoCorrect={false}
                  placeholder={'Enter your email'}
                  placeholderTextColor={theme.colors.text.light}
                  returnKeyType={'done'}
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
            </View>
          </SimpleStyleScrollView>
          {/* Footer */}
          <View
            style={StyleSheet.applyWidth(
              { paddingLeft: 20, paddingRight: 20 },
              dimensions.width
            )}
          >
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
            {/* SUBMIT */}
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
                    const api_response = (
                      await XanoBackendApi.initiateResetPasswordPOST(
                        Constants,
                        { email: email }
                      )
                    )?.json;
                    setIsLoading(false);
                    if (api_response?.message?.length > 0) {
                      setErrorMessage(api_response?.message);
                    }
                    if (
                      api_response?.status === Constants['SUCCESS_API_RESPONSE']
                    ) {
                      navigation.navigate('Auth', {
                        screen: 'VerifyOTPScreen',
                        params: { email: email },
                      });
                    }
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
                    borderBottomLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    borderBottomRightRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    borderTopLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    borderTopRightRadius: Constants['BUTTONS_CORNER_RADIUS'],
                    color: palettes.Brand.Surface,
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 20,
                    paddingTop: 2,
                  }
                ),
                dimensions.width
              )}
              title={'SUBMIT'}
            />
          </View>
        </SimpleStyleKeyboardAwareScrollView>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(ForgotPasswordScreen);
