import React from 'react';
import {
  Icon,
  IconButton,
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
import AdvanceProgramCardBlock from '../../../components/AdvanceProgramCardBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import * as CustomCode from '../../../custom-files/CustomCode';
import Player_LoadAndPlay from '../../../global-functions/Player_LoadAndPlay';
import checkPostNotifications from '../../../global-functions/checkPostNotifications';
import isSubscribed from '../../../global-functions/isSubscribed';
import onAnimateFullScreenPlayer from '../../../global-functions/onAnimateFullScreenPlayer';
import startMediaForegroundServiceTask from '../../../global-functions/startMediaForegroundServiceTask';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const defaultProps = { advance_program_id: null };

const AdvanceScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [visibleUpcoming, setVisibleUpcoming] = React.useState(false);
  const createInformationAdvanceProgramLessonObject = Variables => {
    const appConfig = Variables?.APP_CONFIG;
    const informationAdvanceProgramAudio =
      appConfig?.information_advance_program_audio;
    const advanceProgramPortraitUrl = appConfig?.advance_program_portrait_url;
    const informationAdvanceProgramAudioDuration =
      informationAdvanceProgramAudio?.meta?.duration;

    return {
      type: 'INFORMATION_ADVANCE_PROGRAM_AUDIO',
      audio_content: informationAdvanceProgramAudio,
      title: 'Advanced Program Introduction',
      sub_title: '',
      artwork: advanceProgramPortraitUrl ?? '',
      duration: informationAdvanceProgramAudioDuration * 1000,
    };
  };

  const formatDateRange = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const fromMonth = fromDate.toLocaleString('default', { month: 'short' });
    const fromDay = fromDate.getDate();
    const toMonth = toDate.toLocaleString('default', { month: 'short' });
    const toDay = toDate.getDate();
    const year = toDate.getFullYear(); // assume both dates are in same year

    if (fromMonth === toMonth) {
      return `${fromMonth} ${fromDay} - ${toDay} ${year}`;
    } else {
      return `${fromMonth} ${fromDay} - ${toMonth} ${toDay} ${year}`;
    }
  };
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        const resultAppConfig = (
          await XanoBackendApi.getAppConfigGET(Constants, {})
        )?.json;
        await setGlobalVariableValue({
          key: 'APP_CONFIG',
          value: resultAppConfig,
        });
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
      <>
        {!isSubscribed(Variables) ? null : (
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
            <View
              {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
                  {
                    alignItems: null,
                    flexDirection: null,
                    gap: 8,
                    height: null,
                    justifyContent: null,
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingTop: 10,
                  }
                ),
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                <IconButton
                  onPress={() => {
                    const handler = async () => {
                      try {
                        const specialLesson =
                          createInformationAdvanceProgramLessonObject(
                            Variables
                          );
                        if (Platform.OS === 'android') {
                          await checkPostNotifications();
                        }
                        await onAnimateFullScreenPlayer(specialLesson);
                        await Player_LoadAndPlay(
                          Variables,
                          setGlobalVariableValue,
                          specialLesson
                        );
                        if (Platform.OS === 'android') {
                          startMediaForegroundServiceTask();
                        }
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    };
                    handler();
                  }}
                  color={palettes.Brand.Surface}
                  icon={'Entypo/info-with-circle'}
                  size={25}
                />
                {/* Header Text */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                      {
                        color: palettes.App.White,
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 25,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Advanced Program'}
                </Text>
                {/* History */}
                <IconButton
                  onPress={() => {
                    try {
                      navigation.navigate('BottomTabNavigator', {
                        screen: 'AdvanceNavigator',
                        params: { screen: 'AdvanceHistoryScreen' },
                      });
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  color={palettes.App.White}
                  icon={'MaterialCommunityIcons/history'}
                  size={30}
                />
              </View>
              {/* View 2 */}
              <>
                {!(
                  Constants['PROFILE_DETAILS']?.is_test_user === true
                ) ? null : (
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
                    <Pressable
                      onPress={() => {
                        try {
                          setVisibleUpcoming(true);
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                    >
                      <Icon
                        size={24}
                        color={palettes.App.White}
                        name={'AntDesign/folderopen'}
                      />
                    </Pressable>
                  </View>
                )}
              </>
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
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {
                  'Greatness is not owned. It is rented.\nAnd rent is due every day'
                }
              </Text>
            </View>

            <View
              style={StyleSheet.applyWidth(
                { paddingBottom: 20, paddingTop: 20 },
                dimensions.width
              )}
            >
              {/* Fetch Current Week */}
              <XanoBackendApi.FetchAdvanceProgramsAvailableGET
                advance_program_id={Constants['UPCOMING_ADVANCE_ID']}
                is_test_user={Constants['PROFILE_DETAILS']?.is_test_user}
              >
                {({
                  loading,
                  error,
                  data,
                  refetchAdvanceProgramsAvailable,
                }) => {
                  const fetchCurrentWeekData = data?.json;
                  if (loading) {
                    return <ActivityIndicator />;
                  }

                  if (error || data?.status < 200 || data?.status >= 300) {
                    return <ActivityIndicator />;
                  }

                  return (
                    <>
                      {/* Advance Program list */}
                      <SimpleStyleFlatList
                        data={fetchCurrentWeekData?.advance_program_days}
                        decelerationRate={'normal'}
                        horizontal={false}
                        inverted={false}
                        keyExtractor={(advanceProgramListData, index) =>
                          advanceProgramListData?.id ??
                          advanceProgramListData?.uuid ??
                          index?.toString() ??
                          JSON.stringify(advanceProgramListData)
                        }
                        keyboardShouldPersistTaps={'never'}
                        listKey={
                          'View->View->Fetch Current Week->Advance Program list'
                        }
                        nestedScrollEnabled={false}
                        numColumns={1}
                        onEndReachedThreshold={0.5}
                        pagingEnabled={false}
                        renderItem={({ item, index }) => {
                          const advanceProgramListData = item;
                          return (
                            <AdvanceProgramCardBlock
                              onPress={() => {
                                try {
                                  navigation.navigate('BottomTabNavigator', {
                                    screen: 'AdvanceNavigator',
                                    params: {
                                      screen: 'AdvanceProgramDetailScreen',
                                      params: {
                                        advance_program_id:
                                          advanceProgramListData?.id,
                                        label: advanceProgramListData?.name,
                                        from_history: false,
                                      },
                                    },
                                  });
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              }}
                              from_history={false}
                              item={advanceProgramListData}
                            />
                          );
                        }}
                        showsHorizontalScrollIndicator={true}
                        showsVerticalScrollIndicator={true}
                        snapToAlignment={'start'}
                        scrollEnabled={false}
                        style={StyleSheet.applyWidth(
                          { paddingLeft: 20, paddingRight: 20 },
                          dimensions.width
                        )}
                      />
                      {/* No Data */}
                      <>
                        {!(
                          fetchCurrentWeekData?.advance_program_days?.length ===
                          0
                        ) ? null : (
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                height: '70%',
                                justifyContent: 'center',
                                marginTop: 20,
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
                                    color: theme.colors.foreground.base,
                                    fontFamily: 'Rasa_500Medium',
                                    fontSize: 18,
                                    textAlign: 'center',
                                  }
                                ),
                                dimensions.width
                              )}
                            >
                              {'No Advance Programs Yet'}
                            </Text>
                          </View>
                        )}
                      </>
                    </>
                  );
                }}
              </XanoBackendApi.FetchAdvanceProgramsAvailableGET>
            </View>
          </View>
        )}
      </>
      {/* Locked state */}
      <>
        {isSubscribed(Variables) ? null : (
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'center', flex: 1, justifyContent: 'center' },
              dimensions.width
            )}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: 100,
                  paddingLeft: 20,
                  paddingRight: 20,
                },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', gap: 40 },
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes.Brand.White_Opacity}
                  name={'MaterialCommunityIcons/lock-alert'}
                  size={80}
                  style={StyleSheet.applyWidth(
                    { marginLeft: 12 },
                    dimensions.width
                  )}
                />
                <View
                  style={StyleSheet.applyWidth({ gap: 15 }, dimensions.width)}
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
                          color: palettes.App.Studily_White_Shade_3,
                          fontFamily: 'Rasa_600SemiBold',
                          fontSize: 32,
                          paddingLeft: 40,
                          paddingRight: 40,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Limited Access'}
                  </Text>

                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: theme.colors.foreground.brand,
                          fontFamily: 'Rasa_400Regular',
                          fontSize: 20,
                          lineHeight: 32,
                          paddingLeft: 20,
                          paddingRight: 20,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {
                      'This feature is only available for premium users. Upgrade to unlock access.'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </>
      {/* Admin Upcoming Programs */}
      <Modal
        animationType={'none'}
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={Boolean(visibleUpcoming)}
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
        {/* View 2 */}
        <View
          style={StyleSheet.applyWidth(
            {
              flex: 1,
              justifyContent: 'center',
              paddingLeft: 20,
              paddingRight: 20,
            },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: palettes.App.Black,
                borderColor: palettes.App.White,
                borderRadius: 10,
                borderWidth: 1,
                overflow: 'hidden',
                paddingBottom: 20,
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 20,
              },
              dimensions.width
            )}
          >
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
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.App.Studily_White,
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 24,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Upcoming Programs'}
              </Text>

              <Pressable
                onPress={() => {
                  try {
                    setVisibleUpcoming(false);
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
              >
                <Icon
                  size={24}
                  color={palettes.App.White}
                  name={'Ionicons/close'}
                />
              </Pressable>
            </View>

            <XanoBackendApi.FetchUpcomingAdvanceProgramsGET>
              {({ loading, error, data, refetchUpcomingAdvancePrograms }) => {
                const fetchData = data?.json;
                if (loading) {
                  return <ActivityIndicator />;
                }

                if (error || data?.status < 200 || data?.status >= 300) {
                  return <ActivityIndicator />;
                }

                return (
                  <>
                    <SimpleStyleFlatList
                      data={fetchData}
                      decelerationRate={'normal'}
                      horizontal={false}
                      inverted={false}
                      keyExtractor={(listData, index) =>
                        listData?.id ??
                        listData?.uuid ??
                        index?.toString() ??
                        JSON.stringify(listData)
                      }
                      keyboardShouldPersistTaps={'never'}
                      listKey={
                        'Admin Upcoming Programs->View 2->View->Fetch->List'
                      }
                      nestedScrollEnabled={false}
                      numColumns={1}
                      onEndReachedThreshold={0.5}
                      pagingEnabled={false}
                      renderItem={({ item, index }) => {
                        const listData = item;
                        return (
                          <>
                            {!(fetchData?.length > 0) ? null : (
                              <Pressable
                                onPress={() => {
                                  const handler = async () => {
                                    try {
                                      setVisibleUpcoming(false);
                                      await setGlobalVariableValue({
                                        key: 'UPCOMING_ADVANCE_ID',
                                        value: listData?.id,
                                      });
                                    } catch (err) {
                                      Sentry.captureException(err);
                                      console.error(err);
                                    }
                                  };
                                  handler();
                                }}
                              >
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      backgroundColor: [
                                        {
                                          minWidth: Breakpoints.Mobile,
                                          value: palettes.App['Advance Card'],
                                        },
                                        {
                                          minWidth: Breakpoints.Mobile,
                                          value:
                                            Constants['UPCOMING_ADVANCE_ID'] ===
                                            listData?.id
                                              ? palettes.Brand['Red 1']
                                              : undefined,
                                        },
                                      ],
                                      borderRadius: 10,
                                      gap: 5,
                                      paddingBottom: 10,
                                      paddingLeft: 15,
                                      paddingRight: 15,
                                      paddingTop: 10,
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {/* Title */}
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
                                          color: palettes.App.Studily_White,
                                          fontFamily: 'Rasa_500Medium',
                                          fontSize: 24,
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                  >
                                    {listData?.name}
                                  </Text>
                                  {/* Date Range */}
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
                                          color:
                                            palettes.App
                                              .Studily_Washed_Lavender_White,
                                          fontFamily: 'Rasa_400Regular',
                                          fontSize: 16,
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                  >
                                    {formatDateRange(
                                      listData?.from,
                                      listData?.to
                                    )}
                                  </Text>
                                </View>
                              </Pressable>
                            )}
                          </>
                        );
                      }}
                      showsHorizontalScrollIndicator={true}
                      showsVerticalScrollIndicator={true}
                      snapToAlignment={'start'}
                      style={StyleSheet.applyWidth(
                        {
                          gap: 10,
                          marginTop: 30,
                          maxHeight: dimensions.width * 0.8,
                        },
                        dimensions.width
                      )}
                    />
                    {/* Empty state */}
                    <>
                      {!(fetchData?.length === 0) ? null : (
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: theme.colors.text.light,
                                fontFamily: 'Rasa_500Medium',
                                fontSize: 16,
                                marginBottom: 20,
                                marginTop: 40,
                                textAlign: 'center',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'There are no upcoming programs'}
                        </Text>
                      )}
                    </>
                  </>
                );
              }}
            </XanoBackendApi.FetchUpcomingAdvanceProgramsGET>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(AdvanceScreen);
