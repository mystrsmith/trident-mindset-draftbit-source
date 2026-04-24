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
import { ImageBackground, Platform, StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import loginRevenueCat from '../global-functions/loginRevenueCat';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import showAlertUtil from '../utils/showAlert';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const ResetPasswordScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const inputValidation = () => {
    let foundError = false;

    if (newPassword.length < 1) {
      setErrorMessage('Please enter new Password');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

    if (confirmPassword.length < 1) {
      setErrorMessage('Please re-enter new Password');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Password not matched');
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
      hasSafeArea={false}
      scrollable={false}
      hasBottomSafeArea={false}
      hasTopSafeArea={false}
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
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        <>
          {!(Platform.OS === 'ios') ? null : (
            <View
              style={StyleSheet.applyWidth({ height: 50 }, dimensions.width)}
            />
          )}
        </>
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
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                height: 48,
                justifyContent: 'space-between',
                paddingLeft: 5,
                paddingRight: 53,
              },
              dimensions.width
            )}
          ></View>

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
                      textAlign: 'left',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Reset Password'}
              </Text>
              {/* New Password  */}
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
                        fontSize: 20,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'New Password '}
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  autoCorrect={true}
                  changeTextDelay={500}
                  onChangeText={newTextInputValue => {
                    try {
                      setNewPassword(newTextInputValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  webShowOutline={true}
                  {...GlobalStyles.TextInputStyles(theme)['Form Inputs'].props}
                  placeholder={'Enter new password'}
                  placeholderTextColor={theme.colors.text.light}
                  secureTextEntry={true}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextInputStyles(theme)['Form Inputs'].style,
                      { color: Constants['APP_FONT_COLOR'] }
                    ),
                    dimensions.width
                  )}
                  value={newPassword}
                />
              </View>
              {/* Confirm Password  */}
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
                        fontSize: 20,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Confirm Password'}
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  autoCorrect={true}
                  changeTextDelay={500}
                  onChangeText={newTextInputValue => {
                    try {
                      setConfirmPassword(newTextInputValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  webShowOutline={true}
                  {...GlobalStyles.TextInputStyles(theme)['Form Inputs'].props}
                  placeholder={'Confirm new password'}
                  placeholderTextColor={theme.colors.text.light}
                  secureTextEntry={true}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextInputStyles(theme)['Form Inputs'].style,
                      { color: Constants['APP_FONT_COLOR'] }
                    ),
                    dimensions.width
                  )}
                  value={confirmPassword}
                />
              </View>
            </View>
          </SimpleStyleScrollView>
          {/* Footer */}
          <View
            style={StyleSheet.applyWidth(
              { marginBottom: 15, padding: Constants['CONTENT_PADDING'] },
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
                  { textAlign: 'center' }
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
                    const foundError = inputValidation();
                    if (foundError) {
                      return;
                    }
                    setIsLoading(true);
                    const api_Response = (
                      await XanoBackendApi.resetPasswordPOST(Constants, {
                        password: newPassword,
                      })
                    )?.json;
                    if (api_Response?.message?.length) {
                      setErrorMessage(api_Response?.message);
                    }
                    setIsLoading(false);
                    if (
                      api_Response?.status === Constants['SUCCESS_API_RESPONSE']
                    ) {
                      showAlertUtil({
                        title: 'Password Updated',
                        message: 'Your password has been updated successfully',
                        buttonText: 'Okay',
                      });
                    }
                    await setGlobalVariableValue({
                      key: 'PROFILE_DETAILS',
                      value: api_Response?.user,
                    });
                    await loginRevenueCat(
                      setGlobalVariableValue,
                      api_Response?.user?.id
                    );
                    if (
                      api_Response?.status === Constants['SUCCESS_API_RESPONSE']
                    ) {
                      if (navigation.canGoBack()) {
                        navigation.popToTop();
                      }
                      navigation.replace('BottomTabNavigator', {
                        screen: 'HomeStack',
                        params: { screen: '' },
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

export default withTheme(ResetPasswordScreen);
