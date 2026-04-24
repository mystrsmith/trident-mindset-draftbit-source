import React from 'react';
import { AccordionGroup, Button, Icon, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import * as Sharing from 'expo-sharing';
import { ActivityIndicator, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCalender from '../custom-files/CustomCalender';
import * as CustomCode from '../custom-files/CustomCode';
import * as CustomViewShot from '../custom-files/CustomViewShot';
import getCurrentMonth from '../global-functions/getCurrentMonth';
import getCurrentYear from '../global-functions/getCurrentYear';
import getDatesArray from '../global-functions/getDatesArray';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { refreshingIndex: 0, showCollapsible: false };

const DashboardInfoBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [calData, setCalData] = React.useState([]);
  const [currentMonth, setCurrentMonth] = React.useState(getCurrentMonth());
  const [currentYear, setCurrentYear] = React.useState(getCurrentYear());
  const [loadingCalendar, setLoadingCalendar] = React.useState(false);
  const [loadingCapture, setLoadingCapture] = React.useState(false);
  const onMonthChange = async value => {
    setLoadingCalendar(true);
    setCurrentMonth(value?.month);
    setCurrentYear(value?.year);
    const resultCalendarDashboard = (
      await XanoBackendApi.calendarDashboardGET(Constants, {
        month: value?.month,
        year: value?.year,
      })
    )?.json;
    const result = getDatesArray(resultCalendarDashboard);
    setCalData(result);
    setLoadingCalendar(false);
  };

  const onPressShareMyStreaks = async () => {
    if (viewShotRef && viewShotRef?.current) {
      setLoadingCapture(true);
      const uri = await viewShotRef?.current?.capture();
      console.log('do something with ', uri);
      Sharing.shareAsync(`file://${uri}`);
      setLoadingCapture(false);
    }
  };

  const refreshing = async () => {
    try {
      setLoadingCalendar(true);
      const resultCalendarDashboard = (
        await XanoBackendApi.calendarDashboardGET(Constants, {
          month: currentMonth,
          year: currentYear,
        })
      )?.json;
      const result = getDatesArray(resultCalendarDashboard);
      setCalData(result);
      setLoadingCalendar(false);
    } catch (err) {
      console.error(err);
    }
  };
  const viewShotRef = React.useRef();

  React.useEffect(() => {
    if (props?.refreshingIndex === 0 || props?.refreshingIndex === 1) {
      return;
    }
    refreshing();
  }, [props?.refreshingIndex]);
  React.useEffect(() => {
    const handler = async () => {
      try {
        setLoadingCalendar(true);
        const resultCalendar = (
          await XanoBackendApi.calendarDashboardGET(Constants, {
            month: currentMonth,
            year: currentYear,
          })
        )?.json;
        const resultDatesArray = getDatesArray(resultCalendar);
        setCalData(resultDatesArray);
        setLoadingCalendar(false);
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, []);

  return (
    <View style={StyleSheet.applyWidth({ borderRadius: 15 }, dimensions.width)}>
      <Utils.CustomCodeErrorBoundary>
        <CustomViewShot.Component ref={viewShotRef}>
          {/* Card */}
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: palettes.App['Dashboard Background'],
                borderRadius: 15,
                padding: 10,
              },
              dimensions.width
            )}
          >
            <XanoBackendApi.FetchDashboardGET>
              {({ loading, error, data, refetchDashboard }) => {
                const fetchData = data?.json;
                if (loading) {
                  return <ActivityIndicator />;
                }

                if (error || data?.status < 200 || data?.status >= 300) {
                  return <ActivityIndicator />;
                }

                return (
                  <>
                    <View>
                      {/* Row */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'flex-end',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 8,
                          },
                          dimensions.width
                        )}
                      >
                        {/* View 3 */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              backgroundColor: 'rgba(0, 0, 0, 0)',
                              borderRadius: 10,
                              flexDirection: 'column',
                              justifyContent: 'center',
                              padding: 12,
                              width: '50%',
                            },
                            dimensions.width
                          )}
                        >
                          <Icon
                            color={palettes.Brand.Surface}
                            name={'Feather/align-right'}
                            size={30}
                          />
                          {/* title */}
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
                                  fontSize: 15,
                                  marginTop: 10,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'Longest Streak'}
                          </Text>
                          {/* value */}
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
                                  fontSize: 25,
                                  marginTop: 2,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {fetchData?.longest_streak}
                            {' days'}
                          </Text>
                        </View>
                        {/* View 2 */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              backgroundColor: 'rgba(0, 0, 0, 0)',
                              borderRadius: 10,
                              flexDirection: 'column',
                              justifyContent: 'center',
                              padding: 12,
                              width: '50%',
                            },
                            dimensions.width
                          )}
                        >
                          <Icon
                            color={palettes.Brand.Surface}
                            name={'Feather/clock'}
                            size={30}
                          />
                          {/* title */}
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
                                  fontSize: 15,
                                  marginTop: 10,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'Current Streak'}
                          </Text>
                          {/* value */}
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
                                  fontSize: 25,
                                  marginTop: 2,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {fetchData?.current_streak}
                            {' days'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* Divider */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          backgroundColor: palettes.App.Outline,
                          height: 1,
                          marginBottom: 10,
                          marginTop: 10,
                          width: '100%',
                        },
                        dimensions.width
                      )}
                    />
                  </>
                );
              }}
            </XanoBackendApi.FetchDashboardGET>
            <>
              {!(
                (props.showCollapsible ?? defaultProps.showCollapsible) === true
              ) ? null : (
                <AccordionGroup
                  caretSize={24}
                  iconSize={24}
                  {...GlobalStyles.AccordionGroupStyles(theme)['Accordion']
                    .props}
                  caretColor={palettes.Brand.Surface}
                  closedColor={palettes.Brand.Surface}
                  expanded={false}
                  label={'See my calendar'}
                  openColor={palettes.Brand.Surface}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.AccordionGroupStyles(theme)['Accordion']
                        .style,
                      {
                        color: theme.colors.border.brand,
                        fontFamily: 'Rasa_600SemiBold',
                        fontSize: 21,
                        paddingBottom: 4,
                        paddingTop: 4,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {/* Calendar */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        borderRadius: 10,
                        marginBottom: 10,
                        overflow: 'hidden',
                      },
                      dimensions.width
                    )}
                  >
                    <Utils.CustomCodeErrorBoundary>
                      <CustomCalender.Index
                        calData={calData}
                        onMonthChange={onMonthChange}
                        isLoading={loadingCalendar}
                      />
                    </Utils.CustomCodeErrorBoundary>
                  </View>
                  {/* Capture Button */}
                  <Button
                    accessible={true}
                    iconPosition={'left'}
                    onPress={() => {
                      const handler = async () => {
                        try {
                          await onPressShareMyStreaks();
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                    disabled={Boolean(loadingCapture)}
                    disabledOpacity={0.6}
                    icon={'Ionicons/share-outline'}
                    loading={Boolean(loadingCapture)}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ButtonStyles(theme)['Button'].style,
                        {
                          backgroundColor: palettes.Brand.Surface,
                          borderRadius: 100,
                          color: theme.colors.text.strong,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 18,
                          marginBottom: 20,
                          marginTop: 20,
                        }
                      ),
                      dimensions.width
                    )}
                    title={'Share My Streaks'}
                  />
                </AccordionGroup>
              )}
            </>
            <>
              {!(
                (props.showCollapsible ?? defaultProps.showCollapsible) ===
                false
              ) ? null : (
                <View>
                  {/* Calendar */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        borderRadius: 10,
                        marginBottom: 10,
                        overflow: 'hidden',
                      },
                      dimensions.width
                    )}
                  >
                    <Utils.CustomCodeErrorBoundary>
                      <CustomCalender.Index
                        calData={calData}
                        onMonthChange={onMonthChange}
                        isLoading={loadingCalendar}
                      />
                    </Utils.CustomCodeErrorBoundary>
                  </View>
                  {/* Capture Button */}
                  <Button
                    accessible={true}
                    iconPosition={'left'}
                    onPress={() => {
                      const handler = async () => {
                        try {
                          await onPressShareMyStreaks();
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                    disabled={Boolean(loadingCapture)}
                    disabledOpacity={0.6}
                    icon={'Ionicons/share-outline'}
                    loading={Boolean(loadingCapture)}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ButtonStyles(theme)['Button'].style,
                        {
                          backgroundColor: palettes.Brand.Surface,
                          borderRadius: 100,
                          color: theme.colors.text.strong,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 18,
                          marginBottom: 20,
                          marginTop: 20,
                        }
                      ),
                      dimensions.width
                    )}
                    title={'Share My Streaks'}
                  />
                </View>
              )}
            </>
          </View>
        </CustomViewShot.Component>
      </Utils.CustomCodeErrorBoundary>
    </View>
  );
};

export default withTheme(DashboardInfoBlock);
