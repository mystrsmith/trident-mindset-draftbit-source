import React from 'react';
import {
  ActionSheet,
  ActionSheetCancel,
  ActionSheetItem,
  Button,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../../GlobalStyles.js';
import * as XanoBackendApi from '../../apis/XanoBackendApi.js';
import * as GlobalVariables from '../../config/GlobalVariableContext';
import Images from '../../config/Images';
import * as CustomCode from '../../custom-files/CustomCode';
import * as OnboardingVideoPlayer from '../../custom-files/OnboardingVideoPlayer';
import logEventSignUp from '../../global-functions/logEventSignUp';
import loginRevenueCat from '../../global-functions/loginRevenueCat';
import palettes from '../../themes/palettes';
import * as Utils from '../../utils';
import Breakpoints from '../../utils/Breakpoints';
import * as StyleSheet from '../../utils/StyleSheet';
import imageSource from '../../utils/imageSource';
import openCameraUtil from '../../utils/openCamera';
import openImagePickerUtil from '../../utils/openImagePicker';
import useNavigation from '../../utils/useNavigation';
import useParams from '../../utils/useParams';
import useWindowDimensions from '../../utils/useWindowDimensions';
import waitUtil from '../../utils/wait';

const SignUpBackupScreen = props => {
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
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [showPhotoSources, setShowPhotoSources] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState('');
  const inputValidation = () => {
    const expr =
      /^([\w-\.]+)@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/;

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

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
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
            enableOnAndroid={false}
            enableResetScrollToCoords={false}
            showsVerticalScrollIndicator={true}
            viewIsInsideTabBar={false}
            enableAutomaticScroll={true}
            extraScrollHeight={25}
            keyboardShouldPersistTaps={'always'}
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
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Sign up'}
              </Text>
              {/* Profile Picture */}
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center' },
                  dimensions.width
                )}
              >
                <Pressable
                  onPress={() => {
                    try {
                      setShowPhotoSources(true);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  activeOpacity={0.3}
                >
                  <View>
                    {/* placeholder */}
                    <>
                      {image ? null : (
                        <Image
                          resizeMode={'cover'}
                          {...GlobalStyles.ImageStyles(theme)['Image'].props}
                          source={imageSource(Images['Placeholder'])}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.ImageStyles(theme)['Image'].style,
                              { borderRadius: 50 }
                            ),
                            dimensions.width
                          )}
                        />
                      )}
                    </>
                    <>
                      {!image ? null : (
                        <Image
                          resizeMode={'cover'}
                          {...GlobalStyles.ImageStyles(theme)['Image'].props}
                          source={imageSource(`${image}`)}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.ImageStyles(theme)['Image'].style,
                              { borderRadius: 50 }
                            ),
                            dimensions.width
                          )}
                        />
                      )}
                    </>
                  </View>
                  {/* label */}
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Data Label'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Data Label'].style,
                        {
                          color: Constants['APP_FONT_COLOR'],
                          fontFamily: 'Rasa_300Light',
                          marginTop: 10,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Update photo'}
                  </Text>
                </Pressable>
              </View>
              {/* Name */}
              <View
                style={StyleSheet.applyWidth(
                  { marginBottom: 12, marginTop: 20 },
                  dimensions.width
                )}
              >
                <TextInput
                  autoCapitalize={'none'}
                  changeTextDelay={500}
                  onChangeText={newTextInputValue => {
                    try {
                      setName(newTextInputValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  webShowOutline={true}
                  {...GlobalStyles.TextInputStyles(theme)['Form Inputs'].props}
                  autoComplete={'name'}
                  autoCorrect={false}
                  keyboardType={'default'}
                  placeholder={'Enter your name'}
                  placeholderTextColor={theme.colors.text.light}
                  secureTextEntry={false}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextInputStyles(theme)['Form Inputs'].style,
                      { color: Constants['APP_FONT_COLOR'] }
                    ),
                    dimensions.width
                  )}
                  value={name}
                />
              </View>
              {/* Email */}
              <View
                style={StyleSheet.applyWidth(
                  { marginBottom: 12 },
                  dimensions.width
                )}
              >
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
              {/* SIGN UP */}
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
                        await XanoBackendApi.signUpPOST(Constants, {
                          avatar: image,
                          code_id: Constants['APPLIED_REDEEM_CODE']?.id,
                          email: email,
                          name: name,
                          password: password,
                          phone_number: phone,
                        })
                      )?.json;
                      setIsLoading(false);
                      if (api_Response?.message?.length) {
                        setErrorMessage(api_Response?.message);
                      }
                      logEventSignUp('email');
                      await waitUtil({ milliseconds: 1000 });
                      if (api_Response?.authToken) {
                        const resTactics = (
                          await XanoBackendApi.tacticRecommendationPOST(
                            Constants,
                            { resData: Constants['QUIZ_ANSWERS'] }
                          )
                        )?.json;
                        console.log(resTactics);
                        await loginRevenueCat(
                          setGlobalVariableValue,
                          api_Response?.user?.id
                        );
                        await setGlobalVariableValue({
                          key: 'PROFILE_DETAILS',
                          value: api_Response?.user,
                        });
                        await setGlobalVariableValue({
                          key: 'AUTH_TOKEN',
                          value: 'Bearer ' + api_Response?.authToken,
                        });
                        if (api_Response?.authToken?.length) {
                          if (navigation.canGoBack()) {
                            navigation.popToTop();
                          }
                          navigation.replace('', {});
                        }
                      } else {
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
                      borderBottomLeftRadius:
                        Constants['BUTTONS_CORNER_RADIUS'],
                      borderBottomRightRadius:
                        Constants['BUTTONS_CORNER_RADIUS'],
                      borderTopLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                      borderTopRightRadius: Constants['BUTTONS_CORNER_RADIUS'],
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 18,
                      paddingTop: 2,
                    }
                  ),
                  dimensions.width
                )}
                title={'SIGN UP'}
              />
              {/* Disclaimer */}
              <View
                style={StyleSheet.applyWidth(
                  { marginTop: 25 },
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
                        fontFamily: 'Rasa_300Light',
                        fontSize: 16,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'By creating an account, you agree to our'}
                </Text>

                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginTop: 4,
                    },
                    dimensions.width
                  )}
                >
                  {/* privacy policy */}
                  <Pressable
                    onPress={() => {
                      try {
                        navigation.push('WebPagesScreen', {
                          URL: Constants['PRIVACY_POLICY'],
                          screenHeading: 'Privacy Policy',
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
                            color: palettes.App['App Buttons Color'],
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 16,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Privacy Policy'}
                    </Text>
                  </Pressable>
                  {/* and */}
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: Constants['APP_FONT_COLOR'],
                          fontFamily: 'Rasa_300Light',
                          fontSize: 16,
                          paddingLeft: 7,
                          paddingRight: 7,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'and'}
                  </Text>
                  {/* Terms of use */}
                  <Pressable
                    onPress={() => {
                      try {
                        navigation.push('WebPagesScreen', {
                          URL: Constants['TERMS_OF_USE'],
                          screenHeading: 'Terms of use',
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
                            color: palettes.App['App Buttons Color'],
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 16,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Terms of use'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            {/* Footer */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', justifyContent: 'center', padding: 20 },
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
                {'Already a member?'}
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
                        color: palettes.App['App Buttons Color'],
                        fontFamily: 'Rasa_500Medium',
                        fontSize: 16,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'SIGN IN'}
                </Text>
              </Pressable>
            </View>
          </SimpleStyleKeyboardAwareScrollView>
        </View>
      </View>
      {/* Change Image Options */}
      <ActionSheet visible={Boolean(showPhotoSources)}>
        {/* Gallery */}
        <ActionSheetItem
          color={theme.colors.text.strong}
          onPress={() => {
            const handler = async () => {
              try {
                setShowPhotoSources(false);
                const result = await openImagePickerUtil({
                  mediaTypes: 'Images',
                  allowsEditing: false,
                  quality: 0.2,
                  allowsMultipleSelection: false,
                  selectionLimit: 0,
                  outputBase64: true,
                });

                if (result?.length) {
                  setImage(result);
                }
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            };
            handler();
          }}
          {...GlobalStyles.ActionSheetItemStyles(theme)['Action Sheet Item']
            .props}
          label={'Gallery'}
          style={StyleSheet.applyWidth(
            GlobalStyles.ActionSheetItemStyles(theme)['Action Sheet Item']
              .style,
            dimensions.width
          )}
        />
        {/* Camera */}
        <ActionSheetItem
          color={theme.colors.text.strong}
          onPress={() => {
            const handler = async () => {
              try {
                setShowPhotoSources(false);
                const result = await openCameraUtil({
                  mediaTypes: 'Images',
                  allowsEditing: false,
                  cameraType: 'back',
                  videoMaxDuration: undefined,
                  quality: 0.2,
                  permissionErrorMessage:
                    'Sorry, we need camera permissions to make this work.',
                  showAlertOnPermissionError: true,
                  outputBase64: true,
                });

                if (result?.length) {
                  setImage(result);
                }
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            };
            handler();
          }}
          {...GlobalStyles.ActionSheetItemStyles(theme)['Action Sheet Item']
            .props}
          label={'Camera'}
          style={StyleSheet.applyWidth(
            GlobalStyles.ActionSheetItemStyles(theme)['Action Sheet Item']
              .style,
            dimensions.width
          )}
        />
        {/* Cancel */}
        <ActionSheetCancel
          label={'Cancel'}
          onPress={() => {
            try {
              setShowPhotoSources(false);
            } catch (err) {
              Sentry.captureException(err);
              console.error(err);
            }
          }}
        />
      </ActionSheet>
    </ScreenContainer>
  );
};

export default withTheme(SignUpBackupScreen);
