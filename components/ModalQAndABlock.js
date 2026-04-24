import React from 'react';
import {
  Button,
  IconButton,
  LinearGradient,
  Pressable,
  SimpleStyleKeyboardAwareScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, Keyboard, Modal, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import * as DismissKeyboardView from '../custom-files/DismissKeyboardView';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const defaultProps = { onClose: () => {}, visible: false };

const ModalQAndABlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = React.useState(false);
  const [question, setQuestion] = React.useState('');
  const [showInputs, setShowInputs] = React.useState(true);
  const [visibleModalThankYou, setVisibleModalThankYou] = React.useState(false);
  const xanoBackendSkipQ$APOST = XanoBackendApi.useSkipQ$APOST();
  const xanoBackendCreateQ$APOST = XanoBackendApi.useCreateQ$APOST();

  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      animationType={'slide'}
      transparent={true}
      visible={Boolean(props.visible ?? defaultProps.visible)}
    >
      {/* Overlay */}
      <View
        style={StyleSheet.applyWidth(
          {
            backgroundColor: palettes.App.Overlay,
            height: '100%',
            position: 'absolute',
            width: '100%',
          },
          dimensions.width
        )}
      />
      <>
        {visibleModalThankYou ? null : (
          <View
            style={StyleSheet.applyWidth(
              { justifyContent: 'flex-start' },
              dimensions.width
            )}
          >
            {/* Card */}
            <View
              style={StyleSheet.applyWidth(
                {
                  backgroundColor: palettes.App.Black,
                  borderRadius: 15,
                  height: 450,
                  margin: 15,
                  marginTop: safeAreaInsets.top + 25,
                  paddingBottom: 25,
                },
                dimensions.width
              )}
            >
              <LinearGradient
                startX={0}
                startY={0}
                {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                  .props}
                color1={palettes.App.Black_Alpha_80}
                color2={palettes.App['Background 90 Opacity']}
                color3={palettes.App.Black_Alpha_80}
                endX={0}
                endY={90}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                      .style,
                    { borderRadius: 15, flex: null, height: '100%', opacity: 1 }
                  ),
                  dimensions.width
                )}
              >
                {/* Completed State */}
                <View
                  style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
                >
                  {/* Header */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: 30,
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
                            color: palettes.Brand.Surface,
                            fontFamily: 'Rasa_600SemiBold',
                            fontSize: 36,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Q & A'}
                    </Text>
                    <IconButton
                      onPress={() => {
                        const handler = async () => {
                          try {
                            props.onClose?.();
                            (await xanoBackendSkipQ$APOST.mutateAsync())?.json;
                          } catch (err) {
                            Sentry.captureException(err);
                            console.error(err);
                          }
                        };
                        handler();
                      }}
                      color={palettes.Brand.Surface}
                      icon={'MaterialCommunityIcons/window-close'}
                      size={28}
                      style={StyleSheet.applyWidth(
                        { position: 'absolute', right: 15, top: 15 },
                        dimensions.width
                      )}
                    />
                  </View>

                  <SimpleStyleKeyboardAwareScrollView
                    enableOnAndroid={false}
                    keyboardShouldPersistTaps={'never'}
                    showsVerticalScrollIndicator={true}
                    viewIsInsideTabBar={false}
                    enableAutomaticScroll={true}
                    enableResetScrollToCoords={true}
                    style={StyleSheet.applyWidth(
                      {
                        flex: 1,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 10,
                      },
                      dimensions.width
                    )}
                  >
                    <Utils.CustomCodeErrorBoundary>
                      <DismissKeyboardView.Index style={{ flex: 1 }}>
                        {/* Container */}
                        <View
                          style={StyleSheet.applyWidth(
                            { flex: 1 },
                            dimensions.width
                          )}
                        >
                          {/* Question */}
                          <View>
                            {/* Row */}
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'flex-start',
                                  flexDirection: 'row',
                                },
                                dimensions.width
                              )}
                            >
                              <Image
                                {...GlobalStyles.ImageStyles(theme)['Image']
                                  .props}
                                resizeMode={'contain'}
                                source={imageSource(Images['IcBrain'])}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ImageStyles(theme)['Image']
                                      .style,
                                    { height: 30, width: 30 }
                                  ),
                                  dimensions.width
                                )}
                              />
                              {/* Text 2 */}
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
                                      color: palettes.Brand.Surface,
                                      flex: 1,
                                      fontFamily: 'Rasa_500Medium',
                                      fontSize: 18,
                                      paddingLeft: 10,
                                      textAlign: 'left',
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {
                                  "Trident's founders will be answering your questions in a new Trident Talk.\n\nSubmit your question below!"
                                }
                              </Text>
                            </View>
                            <TextInput
                              changeTextDelay={500}
                              multiline={true}
                              onChangeText={newTextAreaValue => {
                                try {
                                  setQuestion(newTextAreaValue);
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              }}
                              textAlignVertical={'top'}
                              {...GlobalStyles.TextInputStyles(theme)[
                                'Text Area'
                              ].props}
                              autoCapitalize={'none'}
                              autoComplete={'off'}
                              autoCorrect={false}
                              blurOnSubmit={true}
                              numberOfLines={5}
                              placeholder={'Put your question here'}
                              placeholderTextColor={palettes.App.Overlay}
                              returnKeyType={'done'}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.TextInputStyles(theme)[
                                    'Text Area'
                                  ].style,
                                  {
                                    backgroundColor: palettes.Brand.Surface,
                                    color: theme.colors.background.brand,
                                    fontFamily: 'Rasa_400Regular',
                                    fontSize: 16,
                                    height: 140,
                                    marginLeft: 35,
                                    marginTop: 15,
                                  }
                                ),
                                dimensions.width
                              )}
                              value={question}
                              webShowOutline={false}
                            />
                          </View>
                        </View>
                      </DismissKeyboardView.Index>
                    </Utils.CustomCodeErrorBoundary>
                  </SimpleStyleKeyboardAwareScrollView>
                  {/* Bottom */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 25,
                      },
                      dimensions.width
                    )}
                  >
                    {/* Submit */}
                    <Button
                      accessible={true}
                      iconPosition={'left'}
                      onPress={() => {
                        const handler = async () => {
                          try {
                            Keyboard.dismiss();
                            setIsLoading(true);
                            const res = (
                              await xanoBackendCreateQ$APOST.mutateAsync({
                                question: question,
                              })
                            )?.json;
                            setIsLoading(false);
                            await waitUtil({ milliseconds: 150 });
                            setVisibleModalThankYou(true);
                            setShowInputs(false);
                          } catch (err) {
                            Sentry.captureException(err);
                            console.error(err);
                          }
                        };
                        handler();
                      }}
                      {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                      disabled={Boolean(isLoading || question?.length === 0)}
                      disabledOpacity={0.5}
                      loading={Boolean(isLoading)}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.ButtonStyles(theme)['Button'].style,
                          {
                            backgroundColor: palettes.App['True Blue'],
                            borderRadius: 100,
                            fontFamily: 'Rasa_600SemiBold',
                            fontSize: 16,
                            paddingTop: 2,
                            width: 130,
                          }
                        ),
                        dimensions.width
                      )}
                      title={'Submit'}
                    />
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>
        )}
      </>
      {/* Modal Thank You */}
      <>
        {!visibleModalThankYou ? null : (
          <View
            style={StyleSheet.applyWidth(
              { height: '100%', position: 'absolute', width: '100%' },
              dimensions.width
            )}
          >
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', flex: 1, justifyContent: 'center' },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    backgroundColor: theme.colors.background.brand,
                    borderColor: palettes.App['App Buttons Color'],
                    borderRadius: 8,
                    borderWidth: 1,
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
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_700Bold',
                        fontSize: 24,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Thank you'}
                </Text>
                {/* Desscrpition */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_500Medium',
                        fontSize: 20,
                        marginTop: 7,
                        paddingLeft: 10,
                        paddingRight: 10,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    "Your question has been submitted. Trident's founders will review the submissions and choose questions to answer in the next Q&A Trident Talk."
                  }
                </Text>
                {/* CTAs */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      borderColor: palettes.App['App Buttons Color'],
                      borderTopWidth: 1,
                      flexDirection: 'row',
                      height: 50,
                      justifyContent: 'center',
                      marginLeft: -16,
                      marginRight: -16,
                      marginTop: 15,
                    },
                    dimensions.width
                  )}
                >
                  {/* Ok */}
                  <Pressable
                    onPress={() => {
                      const handler = async () => {
                        try {
                          setQuestion('');
                          await waitUtil({ milliseconds: 150 });
                          props.onClose?.();
                          setVisibleModalThankYou(false);
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
                            {
                              color: palettes.Brand.Surface,
                              fontFamily: 'Poppins_600SemiBold',
                              fontSize: 16,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Ok'}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      </>
    </Modal>
  );
};

export default withTheme(ModalQAndABlock);
