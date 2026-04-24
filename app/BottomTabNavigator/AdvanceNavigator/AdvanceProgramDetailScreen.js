import React from 'react';
import {
  Button,
  Icon,
  LoadingIndicator,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import AdvanceProgramLessonItemBlock from '../../../components/AdvanceProgramLessonItemBlock';
import CommonLoadingBlock from '../../../components/CommonLoadingBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import * as CustomCode from '../../../custom-files/CustomCode';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import hapticFeedbackUtil from '../../../utils/hapticFeedback';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const defaultProps = {
  advance_program_id: null,
  from_history: false,
  label: 'Advance Detail',
};

const AdvanceProgramDetailScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [advanceProgramDay, setAdvanceProgramDay] = React.useState([]);
  const [isCompletingAnyway, setIsCompletingAnyway] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingAdvanceProgram, setIsLoadingAdvanceProgram] =
    React.useState(false);
  const [
    visibleWarningCompleteLessonPart,
    setVisibleWarningCompleteLessonPart,
  ] = React.useState(false);
  const getIsCompleted = (from_history, is_completed) => {
    if (from_history) {
      return true;
    }
    return is_completed;
    // return item?.is_completed ?? false
  };

  const isAllLessonPartsNotCompleted = data => {
    return data?.every(item => item?.is_completed === false);
  };
  const xanoBackendResetAdvanceProgramDayDataPOST =
    XanoBackendApi.useResetAdvanceProgramDayDataPOST();
  const xanoBackendCompleteAdvanceProgramUserLessonPartsPOST =
    XanoBackendApi.useCompleteAdvanceProgramUserLessonPartsPOST();
  const xanoBackendCompleteAdvanceProgramDayPOST =
    XanoBackendApi.useCompleteAdvanceProgramDayPOST();
  const xanoBackendCreateDailyTrackerPOST =
    XanoBackendApi.useCreateDailyTrackerPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setIsLoadingAdvanceProgram(true);
        const advanceProgramResponse = (
          await XanoBackendApi.advanceProgramDaysGET(Constants, {
            advance_program_day_id:
              params?.advance_program_id ?? defaultProps.advance_program_id,
          })
        )?.json;
        setAdvanceProgramDay(advanceProgramResponse);
        setIsLoadingAdvanceProgram(false);
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
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: palettes.App.Black, flex: 1 },
        dimensions.width
      )}
    >
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* iOS Safe Area View */}
        <>
          {!(Platform.OS === 'ios') ? null : (
            <View
              {...GlobalStyles.ViewStyles(theme)['iOS Margin View'].props}
              style={StyleSheet.applyWidth(
                GlobalStyles.ViewStyles(theme)['iOS Margin View'].style,
                dimensions.width
              )}
            />
          )}
        </>
        {/* Header */}
        <View>
          {/* Header */}
          <View
            {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
                {
                  justifyContent: 'space-between',
                  paddingLeft: 15,
                  paddingRight: 15,
                }
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
              style={StyleSheet.applyWidth({ width: 50 }, dimensions.width)}
            >
              <View>
                {/* Back Icon */}
                <Icon
                  size={24}
                  color={palettes.App['Custom Color']}
                  name={'Ionicons/chevron-back'}
                />
              </View>
            </Pressable>
            {/* Header Text */}
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                  {
                    color: Constants['APP_FONT_COLOR'],
                    flex: 1,
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 25,
                    paddingTop: 2,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {params?.label ?? defaultProps.label}
            </Text>
            {/* Blank View */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'flex-end', width: 50 },
                dimensions.width
              )}
            >
              {/* Reset button */}
              <>
                {!(
                  !(params?.from_history ?? defaultProps.from_history) &&
                  Constants['PROFILE_DETAILS']?.is_test_user === true
                ) ? null : (
                  <Button
                    accessible={true}
                    iconPosition={'left'}
                    onPress={() => {
                      const handler = async () => {
                        try {
                          (
                            await xanoBackendResetAdvanceProgramDayDataPOST.mutateAsync(
                              { advance_program_day_id: advanceProgramDay?.id }
                            )
                          )?.json;
                          navigation.goBack();
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ButtonStyles(theme)['Button'].style,
                        theme.typography.button,
                        {
                          backgroundColor: 'rgba(0, 0, 0, 0)',
                          color: theme.colors.text.danger,
                          fontFamily: 'Rasa_700Bold',
                          fontSize: 22,
                          lineHeight: 32,
                        }
                      ),
                      dimensions.width
                    )}
                    title={'X'}
                  />
                )}
              </>
            </View>
          </View>
        </View>

        <View
          style={StyleSheet.applyWidth(
            { flex: 1, paddingBottom: 100 },
            dimensions.width
          )}
        >
          <>
            {isLoadingAdvanceProgram ? null : (
              <XanoBackendApi.FetchAdvanceProgramLessonPartsGET
                advance_program_day_id={
                  params?.advance_program_id ?? defaultProps.advance_program_id
                }
                is_test_user={Constants['PROFILE_DETAILS']?.is_test_user}
              >
                {({
                  loading,
                  error,
                  data,
                  refetchAdvanceProgramLessonParts,
                }) => {
                  const fetchData = data?.json;
                  if (loading) {
                    return <ActivityIndicator />;
                  }

                  if (error || data?.status < 200 || data?.status >= 300) {
                    return <ActivityIndicator />;
                  }

                  return (
                    <>
                      {/* Description */}
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.App.White,
                              fontFamily: 'Rasa_400Regular',
                              fontSize: 18,
                              paddingTop: 5,
                              textAlign: 'center',
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {
                          'Tap the circle to earn points for each \nactivity you complete'
                        }
                      </Text>

                      <View
                        style={StyleSheet.applyWidth(
                          {
                            flex: 1,
                            justifyContent: 'space-between',
                            marginTop: 20,
                          },
                          dimensions.width
                        )}
                      >
                        {/* Programs Wrapper */}
                        <View
                          style={StyleSheet.applyWidth(
                            { flex: 1 },
                            dimensions.width
                          )}
                        >
                          {/* Program List */}
                          <>
                            {!(fetchData?.length > 0) ? null : (
                              <SimpleStyleFlatList
                                data={fetchData}
                                decelerationRate={'normal'}
                                horizontal={false}
                                inverted={false}
                                keyExtractor={(programListData, index) =>
                                  programListData?.id ??
                                  programListData?.uuid ??
                                  index?.toString() ??
                                  JSON.stringify(programListData)
                                }
                                keyboardShouldPersistTaps={'never'}
                                listKey={
                                  'Container->View->Fetch->View->Programs Wrapper->Program List'
                                }
                                nestedScrollEnabled={false}
                                numColumns={1}
                                onEndReachedThreshold={0.5}
                                pagingEnabled={false}
                                renderItem={({ item, index }) => {
                                  const programListData = item;
                                  return (
                                    <AdvanceProgramLessonItemBlock
                                      onPressCircleComplete={() => {
                                        const handler = async () => {
                                          try {
                                            const completeAdvanceProgramPartResponse =
                                              (
                                                await xanoBackendCompleteAdvanceProgramUserLessonPartsPOST.mutateAsync(
                                                  {
                                                    advance_program_lesson_part_id:
                                                      programListData?.id,
                                                  }
                                                )
                                              )?.json;
                                          } catch (err) {
                                            Sentry.captureException(err);
                                            console.error(err);
                                          }
                                        };
                                        handler();
                                      }}
                                      isDayCompleted={getIsCompleted(
                                        params?.from_history ??
                                          defaultProps.from_history,
                                        advanceProgramDay?.is_completed
                                      )}
                                      item={programListData}
                                    />
                                  );
                                }}
                                showsHorizontalScrollIndicator={true}
                                showsVerticalScrollIndicator={true}
                                snapToAlignment={'start'}
                                style={StyleSheet.applyWidth(
                                  {
                                    flex: 1,
                                    gap: 10,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                  },
                                  dimensions.width
                                )}
                              />
                            )}
                          </>
                          {/* No data */}
                          <>
                            {!(fetchData?.length === 0) ? null : (
                              <View>
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
                                        color: palettes.App.White,
                                        fontFamily: 'Rasa_500Medium',
                                        fontSize: 18,
                                        textAlign: 'center',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {'No Activity Today'}
                                </Text>
                              </View>
                            )}
                          </>
                        </View>
                        {/* Bottom Buttons */}
                        <>
                          {!(
                            fetchData?.length > 0 &&
                            !(params?.from_history ?? defaultProps.from_history)
                          ) ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                },
                                dimensions.width
                              )}
                            >
                              {/* View 2 */}
                              <>
                                {params?.from_history ??
                                defaultProps.from_history ? null : (
                                  <View
                                    style={StyleSheet.applyWidth(
                                      { marginTop: 10 },
                                      dimensions.width
                                    )}
                                  >
                                    {/* Complete Day */}
                                    <>
                                      {advanceProgramDay?.is_completed ? null : (
                                        <Button
                                          accessible={true}
                                          iconPosition={'left'}
                                          onPress={() => {
                                            const handler = async () => {
                                              try {
                                                await hapticFeedbackUtil({
                                                  feedbackIntensity: 'medium',
                                                });

                                                const isAllLessonPartsFalse =
                                                  isAllLessonPartsNotCompleted(
                                                    fetchData
                                                  );
                                                if (isAllLessonPartsFalse) {
                                                  setVisibleWarningCompleteLessonPart(
                                                    true
                                                  );
                                                }
                                                if (isAllLessonPartsFalse) {
                                                  return;
                                                }
                                                setIsLoading(true);
                                                const completeAdvanceProgramDayResponse =
                                                  (
                                                    await xanoBackendCompleteAdvanceProgramDayPOST.mutateAsync(
                                                      {
                                                        advance_program_day_id:
                                                          params?.advance_program_id ??
                                                          defaultProps.advance_program_id,
                                                      }
                                                    )
                                                  )?.json;
                                                if (navigation.canGoBack()) {
                                                  navigation.popToTop();
                                                }
                                                navigation.replace(
                                                  'AdvanceProgramCompleteStep1Screen',
                                                  {
                                                    item: completeAdvanceProgramDayResponse,
                                                  }
                                                );
                                                const advanceProgramDayResponse =
                                                  (
                                                    await XanoBackendApi.advanceProgramDaysGET(
                                                      Constants,
                                                      {
                                                        advance_program_day_id:
                                                          params?.advance_program_id ??
                                                          defaultProps.advance_program_id,
                                                      }
                                                    )
                                                  )?.json;
                                                setAdvanceProgramDay(
                                                  advanceProgramDayResponse
                                                );
                                                await refetchAdvanceProgramLessonParts();
                                                (
                                                  await xanoBackendCreateDailyTrackerPOST.mutateAsync()
                                                )?.json;
                                                setIsLoading(false);
                                              } catch (err) {
                                                Sentry.captureException(err);
                                                console.error(err);
                                              }
                                            };
                                            handler();
                                          }}
                                          {...GlobalStyles.ButtonStyles(theme)[
                                            'Action Button'
                                          ].props}
                                          activeOpacity={1}
                                          disabled={Boolean(isLoading)}
                                          disabledOpacity={0.7}
                                          loading={Boolean(isLoading)}
                                          style={[
                                            StyleSheet.applyWidth(
                                              StyleSheet.compose(
                                                GlobalStyles.ButtonStyles(
                                                  theme
                                                )['Action Button'].style,
                                                {
                                                  backgroundColor:
                                                    'rgba(0, 0, 0, 0)',
                                                  borderColor:
                                                    palettes.App.White,
                                                  borderRadius: 100,
                                                  borderWidth: 1,
                                                  color: palettes.App.White,
                                                  fontFamily:
                                                    'Rasa_600SemiBold',
                                                  fontSize: 20,
                                                  paddingLeft: 25,
                                                  paddingRight: 25,
                                                  paddingTop: 4,
                                                }
                                              ),
                                              dimensions.width
                                            ),
                                            { alignSelf: 'center' },
                                          ]}
                                          contentContainerStyle={StyleSheet.applyWidth(
                                            GlobalStyles.ButtonStyles(theme)[
                                              'Action Button'
                                            ].style,
                                            dimensions.width
                                          )}
                                          title={'Complete Day'}
                                        />
                                      )}
                                    </>
                                    <>
                                      {!advanceProgramDay?.is_completed ? null : (
                                        <View
                                          style={StyleSheet.applyWidth(
                                            {
                                              alignItems: 'center',
                                              height: 44,
                                              justifyContent: 'center',
                                            },
                                            dimensions.width
                                          )}
                                        >
                                          <Text
                                            accessible={true}
                                            selectable={false}
                                            {...GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].props}
                                            style={StyleSheet.applyWidth(
                                              StyleSheet.compose(
                                                GlobalStyles.TextStyles(theme)[
                                                  'Text'
                                                ].style,
                                                {
                                                  color: palettes.App.White,
                                                  fontFamily:
                                                    'Rasa_600SemiBold',
                                                  fontSize: 20,
                                                }
                                              ),
                                              dimensions.width
                                            )}
                                          >
                                            {'Completed'}
                                          </Text>
                                        </View>
                                      )}
                                    </>
                                  </View>
                                )}
                              </>
                            </View>
                          )}
                        </>
                      </View>
                    </>
                  );
                }}
              </XanoBackendApi.FetchAdvanceProgramLessonPartsGET>
            )}
          </>
          <>{!isLoadingAdvanceProgram ? null : <CommonLoadingBlock />}</>
        </View>
      </View>
      {/* Modal Complete Lesson Part */}
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'fade'}
        transparent={true}
        visible={Boolean(visibleWarningCompleteLessonPart)}
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
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: palettes.App['Advance Card'],
                borderColor: theme.colors.text.medium,
                borderRadius: 8,
                borderWidth: 1,
                overflow: 'hidden',
                padding: 16,
                paddingBottom: 0,
                width: 330,
              },
              dimensions.width
            )}
          >
            {/* Title */}
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
                    fontSize: 20,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'You haven’t completed \nany training'}
            </Text>

            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand.Surface,
                    fontFamily: 'Rasa_400Regular',
                    fontSize: 17,
                    marginTop: 10,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {
                'Please click the circle next to the training you completed to earn your points.'
              }
            </Text>
            {/* CTAs */}
            <View
              style={StyleSheet.applyWidth(
                {
                  borderColor: theme.colors.text.medium,
                  borderTopWidth: 1,
                  flexDirection: 'row',
                  height: 50,
                  justifyContent: 'space-between',
                  marginLeft: -16,
                  marginRight: -16,
                  marginTop: 20,
                },
                dimensions.width
              )}
            >
              {/* Go back */}
              <Pressable
                onPress={() => {
                  try {
                    setVisibleWarningCompleteLessonPart(false);
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
                      borderColor: theme.colors.text.medium,
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
                        {
                          color: palettes.Brand.Surface,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 17,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Go back'}
                  </Text>
                </View>
              </Pressable>
              {/* Complete */}
              <Pressable
                onPress={() => {
                  const handler = async () => {
                    try {
                      await hapticFeedbackUtil({
                        feedbackIntensity: 'medium',
                      });

                      setIsCompletingAnyway(true);
                      const completeDayResponse = (
                        await xanoBackendCompleteAdvanceProgramDayPOST.mutateAsync(
                          {
                            advance_program_day_id:
                              params?.advance_program_id ??
                              defaultProps.advance_program_id,
                          }
                        )
                      )?.json;
                      setVisibleWarningCompleteLessonPart(false);
                      if (navigation.canGoBack()) {
                        navigation.popToTop();
                      }
                      navigation.replace('AdvanceProgramCompleteStep1Screen', {
                        item: completeDayResponse,
                      });
                      const advanceDayResponse = (
                        await XanoBackendApi.advanceProgramDaysGET(Constants, {
                          advance_program_day_id:
                            params?.advance_program_id ??
                            defaultProps.advance_program_id,
                        })
                      )?.json;
                      setAdvanceProgramDay(advanceDayResponse);
                      (await xanoBackendCreateDailyTrackerPOST.mutateAsync())
                        ?.json;
                      setIsCompletingAnyway(false);
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
                      borderColor: theme.colors.text.medium,
                      flexDirection: 'row',
                      gap: 8,
                      height: '100%',
                      justifyContent: 'center',
                      width: '100%',
                    },
                    dimensions.width
                  )}
                >
                  <>
                    {!isCompletingAnyway ? null : (
                      <LoadingIndicator
                        type={'circleFade'}
                        color={palettes.Brand.Surface}
                        size={14}
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
                          color: palettes.Brand.Surface,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 17,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Complete anyway'}
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

export default withTheme(AdvanceProgramDetailScreen);
