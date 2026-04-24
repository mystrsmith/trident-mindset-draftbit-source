import React from 'react';
import {
  Button,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import generateCheckinNotesQuestionAnswer from '../global-functions/generateCheckinNotesQuestionAnswer';
import showToastMessage from '../global-functions/showToastMessage';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { check_in_note: null };

const CheckInNoteDetailScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
  const [checkInAnswers, setCheckInAnswers] = React.useState([]);
  const [isLoadingButton, setIsLoadingButton] = React.useState(false);
  const onChangeCheckInAnswers = (checkInAnswers, newTextAreaValue, index) => {
    const updatedAnswers = [...checkInAnswers];
    updatedAnswers[index] = newTextAreaValue;
    setCheckInAnswers(updatedAnswers);
  };
  const xanoBackendUpdateCheckInNotePATCH =
    XanoBackendApi.useUpdateCheckInNotePATCH();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      setCheckInAnswers(
        (params?.check_in_note ?? defaultProps.check_in_note)?.answers
      );
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
    >
      {/* Container */}
      <View
        style={StyleSheet.applyWidth(
          {
            flex: 1,
            paddingBottom: safeAreaInsets.bottom + 25,
            paddingTop: safeAreaInsets.top,
          },
          dimensions.width
        )}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: palettes.App.Outline,
              flexDirection: 'row',
              height: 48,
              justifyContent: 'space-between',
              paddingLeft: 15,
              paddingRight: 15,
            },
            dimensions.width
          )}
        >
          {/* Back  */}
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
                  alignItems: 'flex-start',
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
          {/* Text 2 */}
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                {
                  color: [
                    {
                      minWidth: Breakpoints.Mobile,
                      value: palettes.App['Custom Color'],
                    },
                    {
                      minWidth: Breakpoints.Mobile,
                      value: Constants['APP_FONT_COLOR'],
                    },
                  ],
                  fontFamily: 'Rasa_500Medium',
                  fontSize: 20,
                }
              ),
              dimensions.width
            )}
          >
            {'Nightly Intentionality Check-In Notes'}
          </Text>
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
          />
        </View>

        <SimpleStyleKeyboardAwareScrollView
          enableOnAndroid={false}
          enableResetScrollToCoords={false}
          keyboardShouldPersistTaps={'never'}
          showsVerticalScrollIndicator={true}
          viewIsInsideTabBar={false}
          enableAutomaticScroll={true}
          style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
        >
          {/* CheckIn Note Form */}
          <SimpleStyleFlatList
            data={generateCheckinNotesQuestionAnswer(
              params?.check_in_note ?? defaultProps.check_in_note
            )}
            decelerationRate={'normal'}
            horizontal={false}
            inverted={false}
            keyExtractor={(checkInNoteFormData, index) =>
              checkInNoteFormData?.id ??
              checkInNoteFormData?.uuid ??
              index?.toString() ??
              JSON.stringify(checkInNoteFormData)
            }
            keyboardShouldPersistTaps={'never'}
            listKey={'Container->Keyboard Aware Scroll View->CheckIn Note Form'}
            nestedScrollEnabled={false}
            numColumns={1}
            onEndReachedThreshold={0.5}
            pagingEnabled={false}
            renderItem={({ item, index }) => {
              const checkInNoteFormData = item;
              return (
                <>
                  {/* Question */}
                  <View
                    style={StyleSheet.applyWidth(
                      { marginTop: 25 },
                      dimensions.width
                    )}
                  >
                    {/* Row */}
                    <View
                      style={StyleSheet.applyWidth(
                        { alignItems: 'flex-start', flexDirection: 'row' },
                        dimensions.width
                      )}
                    >
                      <Image
                        {...GlobalStyles.ImageStyles(theme)['Image'].props}
                        resizeMode={'contain'}
                        source={imageSource(Images['IcBrain'])}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ImageStyles(theme)['Image'].style,
                            { height: 25, width: 25 }
                          ),
                          dimensions.width
                        )}
                      />
                      {/* Text 2 */}
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
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
                        {checkInNoteFormData?.question}
                      </Text>
                    </View>
                    <TextInput
                      autoCorrect={true}
                      changeTextDelay={500}
                      multiline={true}
                      onChangeText={newTextAreaValue => {
                        try {
                          onChangeCheckInAnswers(
                            checkInAnswers,
                            newTextAreaValue,
                            index
                          );
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      textAlignVertical={'top'}
                      webShowOutline={true}
                      {...GlobalStyles.TextInputStyles(theme)['Text Area']
                        .props}
                      defaultValue={checkInNoteFormData?.answer}
                      numberOfLines={5}
                      placeholder={'Answer here'}
                      placeholderTextColor={palettes.App.Overlay}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextInputStyles(theme)['Text Area']
                            .style,
                          {
                            backgroundColor: palettes.Brand.Surface,
                            color: theme.colors.background.brand,
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 14,
                            height: 65,
                            marginLeft: 30,
                            marginTop: 15,
                          }
                        ),
                        dimensions.width
                      )}
                    />
                  </View>
                </>
              );
            }}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            snapToAlignment={'start'}
            style={StyleSheet.applyWidth(
              { flex: 1, paddingLeft: 20, paddingRight: 20 },
              dimensions.width
            )}
          />
          {/* Bottom */}
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'center', justifyContent: 'center', marginTop: 25 },
              dimensions.width
            )}
          >
            {/* Update */}
            <Button
              accessible={true}
              iconPosition={'left'}
              onPress={() => {
                const handler = async () => {
                  try {
                    setIsLoadingButton(true);
                    (
                      await xanoBackendUpdateCheckInNotePATCH.mutateAsync({
                        answers: checkInAnswers,
                        id: (
                          params?.check_in_note ?? defaultProps.check_in_note
                        )?.id,
                      })
                    )?.json;
                    setIsLoadingButton(false);
                    showToastMessage(
                      'Success',
                      'Update checkin note successfully'
                    );
                    navigation.goBack();
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                };
                handler();
              }}
              {...GlobalStyles.ButtonStyles(theme)['Button'].props}
              disabled={Boolean(isLoadingButton)}
              loading={Boolean(isLoadingButton)}
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
              title={'Update'}
            />
          </View>
        </SimpleStyleKeyboardAwareScrollView>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(CheckInNoteDetailScreen);
