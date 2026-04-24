import React from 'react';
import {
  Button,
  Icon,
  LinearGradient,
  Pressable,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  SimpleStyleScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import ModalRedeemCodeSuccessfullyBlock from '../components/ModalRedeemCodeSuccessfullyBlock';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import * as DismissKeyboardView from '../custom-files/DismissKeyboardView';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const TridentForTeamsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [code, setCode] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [visibleModalAppliedCodeSuccess, setVisibleModalAppliedCodeSuccess] =
    React.useState(false);
  const [visibleModalRedeemSuccess, setVisibleModalRedeemSuccess] =
    React.useState(false);
  const inputValidation = () => {
    let foundError = false;

    if (currentPassword.length < 1) {
      setErrorMessage('Please enter your current Password');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

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

    return foundError;
  };
  const xanoBackendRedeemCodePOST = XanoBackendApi.useRedeemCodePOST();
  const xanoBackendCheckRedeemCodePOST =
    XanoBackendApi.useCheckRedeemCodePOST();

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      hasBottomSafeArea={false}
      hasTopSafeArea={false}
      style={StyleSheet.applyWidth({ height: 50 }, dimensions.width)}
    >
      <Utils.CustomCodeErrorBoundary>
        <DismissKeyboardView.Index style={{ flex: 1 }}>
          <LinearGradient
            endX={100}
            endY={100}
            startX={0}
            startY={0}
            {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
              .props}
            color1={palettes.App.Black_Alpha_80}
            color2={palettes.App['Background 90 Opacity']}
            color3={palettes.App.Black_Alpha_80}
            style={StyleSheet.applyWidth(
              GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
              dimensions.width
            )}
          >
            {/* Container */}
            <View
              style={StyleSheet.applyWidth(
                { flex: 1, paddingTop: safeAreaInsets.top },
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
                          height: 48,
                          justifyContent: 'center',
                          width: 48,
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
                            fontSize: 30,
                            textAlign: 'left',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Trident For Teams'}
                    </Text>
                    <TextInput
                      changeTextDelay={500}
                      onChangeText={newTextInputValue => {
                        try {
                          setCode(newTextInputValue);
                          setErrorMessage('');
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      webShowOutline={true}
                      {...GlobalStyles.TextInputStyles(theme)['Form Inputs']
                        .props}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      placeholder={'Enter your code here'}
                      placeholderTextColor={theme.colors.text.light}
                      returnKeyType={'done'}
                      secureTextEntry={false}
                      spellcheck={true}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextInputStyles(theme)['Form Inputs']
                            .style,
                          {
                            color: Constants['APP_FONT_COLOR'],
                            fontSize: 20,
                            height: 60,
                            marginTop: 15,
                            paddingTop: 2,
                          }
                        ),
                        dimensions.width
                      )}
                      value={code}
                    />
                  </View>
                </SimpleStyleScrollView>
                {/* Footter */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      paddingBottom: safeAreaInsets.bottom + 15,
                      paddingLeft: Constants['CONTENT_PADDING'],
                      paddingRight: Constants['CONTENT_PADDING'],
                      paddingTop: Constants['CONTENT_PADDING'],
                    },
                    dimensions.width
                  )}
                >
                  {/* error */}
                  <>
                    {!errorMessage ? null : (
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
                    )}
                  </>
                  {/* SUBMIT */}
                  <Button
                    accessible={true}
                    iconPosition={'left'}
                    onPress={() => {
                      const handler = async () => {
                        try {
                          setErrorMessage('');
                          setIsLoading(true);
                          const codeResponse = (
                            await xanoBackendCheckRedeemCodePOST.mutateAsync({
                              code: code,
                            })
                          )?.json;
                          if (codeResponse?.message?.length) {
                            setErrorMessage(codeResponse?.message);
                          }
                          setIsLoading(false);
                          if (
                            codeResponse?.status ===
                            Constants['SUCCESS_API_RESPONSE']
                          ) {
                            if (!Constants['AUTH_TOKEN']) {
                              await setGlobalVariableValue({
                                key: 'APPLIED_REDEEM_CODE',
                                value: codeResponse?.data,
                              });
                              setVisibleModalAppliedCodeSuccess(true);
                            } else {
                              setIsLoading(true);
                              const redeemCodeResult = (
                                await xanoBackendRedeemCodePOST.mutateAsync({
                                  code_id: codeResponse?.data?.id,
                                })
                              )?.json;
                              setIsLoading(false);
                              if (
                                redeemCodeResult?.status ===
                                Constants['SUCCESS_API_RESPONSE']
                              ) {
                                setVisibleModalRedeemSuccess(true);
                              } else {
                              }
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
                    disabled={Boolean(isLoading || !code)}
                    disabledOpacity={0.6}
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
                          borderTopLeftRadius:
                            Constants['BUTTONS_CORNER_RADIUS'],
                          borderTopRightRadius:
                            Constants['BUTTONS_CORNER_RADIUS'],
                        }
                      ),
                      dimensions.width
                    )}
                    title={'REDEEM CODE'}
                  />
                </View>
              </SimpleStyleKeyboardAwareScrollView>
            </View>
          </LinearGradient>
        </DismissKeyboardView.Index>
      </Utils.CustomCodeErrorBoundary>
      {/* Modal Applied Code Successfully */}
      <ModalRedeemCodeSuccessfullyBlock
        onClose={() => {
          try {
            setVisibleModalAppliedCodeSuccess(false);
            navigation.goBack();
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
        description={'Create your account to get started'}
        title={'Success!'}
        visible={visibleModalAppliedCodeSuccess}
      />
      <ModalRedeemCodeSuccessfullyBlock
        onClose={() => {
          try {
            setVisibleModalRedeemSuccess(false);
            navigation.goBack();
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
        description={'Full access is unlocked'}
        title={'Success!'}
        visible={visibleModalRedeemSuccess}
      />
    </ScreenContainer>
  );
};

export default withTheme(TridentForTeamsScreen);
