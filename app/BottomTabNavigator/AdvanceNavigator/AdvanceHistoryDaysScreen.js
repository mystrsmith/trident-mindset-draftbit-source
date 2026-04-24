import React from 'react';
import {
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
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
import isInWeekRangeAdvanceProgram from '../../../global-functions/isInWeekRangeAdvanceProgram';
import isSubscribed from '../../../global-functions/isSubscribed';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const defaultProps = {
  advance_program: null,
  advance_program_id: null,
  week_title: null,
};

const AdvanceHistoryDaysScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
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
                    flexDirection: null,
                    gap: 8,
                    height: null,
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
                        color: palettes.App.White,
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 25,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {params?.week_title ?? defaultProps.week_title}
                </Text>
                {/* Blank View */}
                <View
                  style={StyleSheet.applyWidth(
                    { height: 20, width: 20 },
                    dimensions.width
                  )}
                />
              </View>
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
              {/* Fetch History Week */}
              <XanoBackendApi.FetchHistoryAdvanceProgramsGET
                advance_program_id={
                  params?.advance_program_id ?? defaultProps.advance_program_id
                }
              >
                {({ loading, error, data, refetchHistoryAdvancePrograms }) => {
                  const fetchHistoryWeekData = data?.json;
                  if (loading) {
                    return <ActivityIndicator />;
                  }

                  if (error || data?.status < 200 || data?.status >= 300) {
                    return <ActivityIndicator />;
                  }

                  return (
                    <>
                      {/* Advance Program Days */}
                      <SimpleStyleFlatList
                        data={fetchHistoryWeekData?.advance_program_days}
                        decelerationRate={'normal'}
                        horizontal={false}
                        inverted={false}
                        keyExtractor={(advanceProgramDaysData, index) =>
                          advanceProgramDaysData?.id ??
                          advanceProgramDaysData?.uuid ??
                          index?.toString() ??
                          JSON.stringify(advanceProgramDaysData)
                        }
                        keyboardShouldPersistTaps={'never'}
                        listKey={
                          'View->View->Fetch History Week->Advance Program Days'
                        }
                        nestedScrollEnabled={false}
                        numColumns={1}
                        onEndReachedThreshold={0.5}
                        pagingEnabled={false}
                        renderItem={({ item, index }) => {
                          const advanceProgramDaysData = item;
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
                                          advanceProgramDaysData?.id,
                                        label: advanceProgramDaysData?.name,
                                        from_history: true,
                                      },
                                    },
                                  });
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              }}
                              from_history={
                                isInWeekRangeAdvanceProgram(
                                  params?.advance_program ??
                                    defaultProps.advance_program
                                )
                                  ? false
                                  : true
                              }
                              item={advanceProgramDaysData}
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
                          fetchHistoryWeekData?.advance_program_days?.length ===
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
              </XanoBackendApi.FetchHistoryAdvanceProgramsGET>
            </View>
          </View>
        )}
      </>
    </ScreenContainer>
  );
};

export default withTheme(AdvanceHistoryDaysScreen);
