import React from 'react';
import {
  ActionSheet,
  ActionSheetCancel,
  ActionSheetItem,
  Button,
  ExpoImage,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  SimpleStyleScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { BlurView } from 'expo-blur';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  StatusBar,
  Text,
  View,
} from 'react-native';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as CustomCode from '../../../custom-files/CustomCode';
import showToastMessage from '../../../global-functions/showToastMessage';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import openCameraUtil from '../../../utils/openCamera';
import openImagePickerUtil from '../../../utils/openImagePicker';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const UpdateProfileScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [address, setAddress] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [image, setImage] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showPhotoSources, setShowPhotoSources] = React.useState(false);
  const inputValidation = () => {
    let foundError = false;
    if (!name || name.trim().length < 1) {
      setErrorMessage(
        'Name cannot be empty or just spaces. Please enter your name.'
      );
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }
    return foundError;
  };
  const xanoBackendUpdateProfilePATCH = XanoBackendApi.useUpdateProfilePATCH();
  const xanoBackendDeleteUserDELETE = XanoBackendApi.useDeleteUserDELETE();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        const api_Response = (await XanoBackendApi.authMeGET(Constants))?.json;
        if (api_Response?.id) {
          setName(api_Response?.name);
          setAddress(api_Response?.address);
          setPhone(api_Response?.phone_number);
          setEmail(api_Response?.email);
          setImage(api_Response?.avatar?.url);
        } else {
        }
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
    <ScreenContainer scrollable={false} hasSafeArea={true}>
      {/* Header */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
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
          style={StyleSheet.applyWidth(
            { height: 40, width: 40 },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                height: 40,
                justifyContent: 'center',
                width: 40,
              },
              dimensions.width
            )}
          >
            <Icon
              size={24}
              color={palettes.App['Custom Color']}
              name={'Ionicons/chevron-back'}
            />
          </View>
        </Pressable>

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
                fontSize: 26,
                paddingTop: 2,
                textAlign: 'center',
              }
            ),
            dimensions.width
          )}
        >
          {'Update Profile'}
        </Text>
        <View
          style={StyleSheet.applyWidth(
            { height: 40, width: 40 },
            dimensions.width
          )}
        />
      </View>
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        <SimpleStyleKeyboardAwareScrollView
          enableOnAndroid={false}
          enableResetScrollToCoords={false}
          showsVerticalScrollIndicator={true}
          viewIsInsideTabBar={false}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps={'always'}
          style={StyleSheet.applyWidth({ paddingTop: 30 }, dimensions.width)}
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
                  marginBottom: 20,
                  paddingLeft: Constants['CONTENT_PADDING'],
                  paddingRight: Constants['CONTENT_PADDING'],
                },
                dimensions.width
              )}
            >
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
                        <ExpoImage
                          allowDownscaling={true}
                          cachePolicy={'disk'}
                          contentPosition={'center'}
                          resizeMode={'cover'}
                          transitionDuration={300}
                          transitionEffect={'cross-dissolve'}
                          transitionTiming={'ease-in-out'}
                          {...GlobalStyles.ExpoImageStyles(theme)['Image 17']
                            .props}
                          source={imageSource(`${image}`)}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.ExpoImageStyles(theme)['Image 17']
                                .style,
                              {
                                borderColor: theme.colors.border.brand,
                                borderRadius: 50,
                                borderWidth: 1,
                              }
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
                          marginTop: 16,
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
                  { marginBottom: 12, marginTop: 30 },
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
                  {'Name'}
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  autoCorrect={true}
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
                  keyboardType={'default'}
                  placeholder={'Enter your Name'}
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
              {/* Address  */}
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
                  {'Physical Address'}
                </Text>
                <TextInput
                  autoCapitalize={'none'}
                  autoCorrect={true}
                  changeTextDelay={500}
                  onChangeText={newTextInputValue => {
                    try {
                      setAddress(newTextInputValue);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  webShowOutline={true}
                  {...GlobalStyles.TextInputStyles(theme)['Form Inputs'].props}
                  autoComplete={'address-line1'}
                  placeholder={'Enter your address'}
                  placeholderTextColor={theme.colors.text.light}
                  secureTextEntry={false}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextInputStyles(theme)['Form Inputs'].style,
                      { color: Constants['APP_FONT_COLOR'] }
                    ),
                    dimensions.width
                  )}
                  value={address}
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
                    { textAlign: 'center' }
                  ),
                  dimensions.width
                )}
              >
                {errorMessage}
              </Text>
              {/* UPDATE */}
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
                        await xanoBackendUpdateProfilePATCH.mutateAsync({
                          address: address,
                          content: image,
                          name: name,
                          phone_number: phone,
                        })
                      )?.json;
                      if (api_Response?.message?.length) {
                        setErrorMessage(api_Response?.message);
                      }
                      setIsLoading(false);
                      if (
                        api_Response?.status ===
                        Constants['SUCCESS_API_RESPONSE']
                      ) {
                        showToastMessage(
                          'Profile has been updated successfully.',
                          undefined
                        );
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
                title={'UPDATE'}
              />
              {/* CHANGE PASSWORD */}
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  try {
                    navigation.navigate('BottomTabNavigator', {
                      screen: 'MoreStack',
                      params: { screen: 'ChangePasswordScreen' },
                    });
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
                activeOpacity={0.3}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                    {
                      backgroundColor: palettes.App['Custom Color'],
                      borderBottomLeftRadius:
                        Constants['BUTTONS_CORNER_RADIUS'],
                      borderBottomRightRadius:
                        Constants['BUTTONS_CORNER_RADIUS'],
                      borderTopLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                      borderTopRightRadius: Constants['BUTTONS_CORNER_RADIUS'],
                      color: theme.colors.text.strong,
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 18,
                      marginTop: 16,
                      paddingTop: 2,
                    }
                  ),
                  dimensions.width
                )}
                title={'CHANGE PASSWORD'}
              />
              {/* DELETE ACCOUNT */}
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  try {
                    setShowDeleteModal(true);
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
                activeOpacity={0.3}
                loading={Boolean(isDeleting)}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                    {
                      backgroundColor: theme.colors.background.danger,
                      borderBottomLeftRadius:
                        Constants['BUTTONS_CORNER_RADIUS'],
                      borderBottomRightRadius:
                        Constants['BUTTONS_CORNER_RADIUS'],
                      borderTopLeftRadius: Constants['BUTTONS_CORNER_RADIUS'],
                      borderTopRightRadius: Constants['BUTTONS_CORNER_RADIUS'],
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 18,
                      marginTop: 25,
                      paddingTop: 2,
                    }
                  ),
                  dimensions.width
                )}
                title={'DELETE ACCOUNT'}
              />
            </View>
          </SimpleStyleScrollView>
        </SimpleStyleKeyboardAwareScrollView>
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
      {/* Delete Modal */}
      <Modal
        animationType={'none'}
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={Boolean(showDeleteModal)}
      >
        <BlurView
          experimentalBlurMethod={'none'}
          intensity={50}
          tint={'default'}
          {...GlobalStyles.BlurViewStyles(theme)['Blur View'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.BlurViewStyles(theme)['Blur View'].style,
              {
                bottom: 0,
                left: 0,
                opacity: 0.7,
                position: 'absolute',
                right: 0,
                top: 0,
              }
            ),
            dimensions.width
          )}
        />
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: palettes.App['Custom Color'],
                borderRadius: 8,
                overflow: 'hidden',
                padding: 16,
                paddingBottom: 0,
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
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 24,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }
                ),
                dimensions.width
              )}
            >
              {'delete account'}
            </Text>
            {/* Message */}
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    fontFamily: 'Rasa_400Regular',
                    fontSize: 16,
                    marginTop: 12,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {
                'Are you sure you want to delete your account?\nThis can not be reversed and your all information will be deleted from our systems.'
              }
            </Text>
            {/* CTAs */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'stretch',
                  borderBottomWidth: 1,
                  borderTopWidth: 1,
                  flexDirection: 'row',
                  height: 50,
                  justifyContent: 'space-between',
                  marginBottom: -1,
                  marginLeft: -16,
                  marginRight: -16,
                  marginTop: 15,
                },
                dimensions.width
              )}
            >
              {/* Cancel */}
              <Pressable
                onPress={() => {
                  try {
                    setShowDeleteModal(false);
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                activeOpacity={0.3}
                style={StyleSheet.applyWidth(
                  { height: '100%', width: '50%' },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      borderRightWidth: 1,
                      height: '100%',
                      justifyContent: 'center',
                      width: '100%',
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
                        { fontFamily: 'Rasa_500Medium', fontSize: 23 }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Cancel'}
                  </Text>
                </View>
              </Pressable>
              {/* Delete */}
              <Pressable
                onPress={() => {
                  const handler = async () => {
                    try {
                      setIsDeleting(true);
                      const api_Response = (
                        await xanoBackendDeleteUserDELETE.mutateAsync({
                          id: Constants['PROFILE_DETAILS']?.id,
                        })
                      )?.json;
                      await setGlobalVariableValue({
                        key: 'APPLIED_REDEEM_CODE',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'CUSTOMER_INFO',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'QUIZ_ANSWERS',
                        value: [],
                      });
                      await setGlobalVariableValue({
                        key: 'ANONYMOUS_ID',
                        value: '',
                      });
                      if (
                        api_Response?.status ===
                        Constants['SUCCESS_API_RESPONSE']
                      ) {
                        await setGlobalVariableValue({
                          key: 'AUTH_TOKEN',
                          value: '',
                        });
                      }
                      await setGlobalVariableValue({
                        key: 'PROFILE_DETAILS',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'LAST_LEFTOFF_LESSON',
                        value: false,
                      });
                      setIsDeleting(false);
                      setShowDeleteModal(false);
                      await setGlobalVariableValue({
                        key: 'INITIALIZE_HOMESCREEN',
                        value: true,
                      });
                      await setGlobalVariableValue({
                        key: 'ONBOARDING_FIRST_LESSON',
                        value: null,
                      });
                      await setGlobalVariableValue({
                        key: 'ONBOARDING_FIRST_LESSON_COMPLETED',
                        value: false,
                      });
                      if (navigation.canGoBack()) {
                        navigation.popToTop();
                      }
                      navigation.replace('', {});
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  };
                  handler();
                }}
                activeOpacity={0.3}
                style={StyleSheet.applyWidth(
                  { height: '100%', width: '50%' },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      height: '100%',
                      justifyContent: 'center',
                      width: '100%',
                    },
                    dimensions.width
                  )}
                >
                  <>
                    {!isDeleting ? null : (
                      <ActivityIndicator
                        animating={true}
                        hidesWhenStopped={true}
                        size={'small'}
                        {...GlobalStyles.ActivityIndicatorStyles(theme)[
                          'Activity Indicator'
                        ].props}
                        color={theme.colors.background.danger}
                        style={StyleSheet.applyWidth(
                          GlobalStyles.ActivityIndicatorStyles(theme)[
                            'Activity Indicator'
                          ].style,
                          dimensions.width
                        )}
                      />
                    )}
                  </>
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: theme.colors.background.danger,
                          fontFamily: 'Rasa_600SemiBold',
                          fontSize: 23,
                          textTransform: 'uppercase',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'delete'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(UpdateProfileScreen);
