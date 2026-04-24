import React from 'react';
import {
  Circle,
  Icon,
  IconButton,
  LinearGradient,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Modal, Platform, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CommonPackages from '../custom-files/CommonPackages';
import * as CustomCode from '../custom-files/CustomCode';
import getCurrentDayIndex from '../global-functions/getCurrentDayIndex';
import isNullOrUndefined from '../global-functions/isNullOrUndefined';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = {
  dailyTrackers: null,
  isVisible: false,
  onPressClose: () => {},
};

const ModalDailyStreakTrackerBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const countSelectedDailyTrackers = localDailyTrackers => {
    return localDailyTrackers.reduce(
      (count, tracker) => (tracker.selected ? count + 1 : count),
      0
    );
  };

  const delayMiliseconds = async miliseconds => {
    return new Promise(res => setTimeout(res, miliseconds));
  };

  const transformDailyTrackersData = dailyTrackers => {
    const moment = CommonPackages?.moment;

    if (
      dailyTrackers === null ||
      dailyTrackers === undefined ||
      dailyTrackers?.length === 0
    ) {
      return [
        { label: 'M', selected: false },
        { label: 'T', selected: false },
        { label: 'W', selected: false },
        { label: 'T', selected: false },
        { label: 'F', selected: false },
        { label: 'S', selected: false },
        { label: 'S', selected: false },
      ];
    }

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const output = daysOfWeek.map(day => ({
      label: day.charAt(0),
      selected: false,
    }));

    if (dailyTrackers?.length > 0) {
      dailyTrackers?.forEach(item => {
        const createdDate = moment(item.created_at);
        const localDayOfWeek = createdDate.format('ddd');
        const index = daysOfWeek.indexOf(localDayOfWeek);
        if (index !== -1) {
          output[index].selected = true;
        }
      });
    }

    return output;
  };
  React.useEffect(() => {
    async function init() {
      if (props?.isVisible === true) {
        await delayMiliseconds(6500);
        props?.onPressClose();
      }
    }
    init();
  }, [props.isVisible]);

  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      animationType={'slide'}
      transparent={true}
      visible={Boolean(props.isVisible ?? defaultProps.isVisible)}
    >
      <>
        {isNullOrUndefined(
          props.dailyTrackers ?? defaultProps.dailyTrackers
        ) ? null : (
          <View
            style={StyleSheet.applyWidth(
              { backgroundColor: theme.colors.background.brand, flex: 1 },
              dimensions.width
            )}
          >
            <LinearGradient
              endX={100}
              endY={100}
              startX={0}
              startY={0}
              {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                .props}
              color1={theme.colors.background.brand}
              color2={palettes.App['Lawrencium 2']}
              color3={theme.colors.background.brand}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                    .style,
                  {
                    bottom: 0,
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '100%',
                  }
                ),
                dimensions.width
              )}
            />
            {/* iOS Safe Area */}
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
              style={StyleSheet.applyWidth(
                { paddingLeft: 15, paddingRight: 15, paddingTop: 30 },
                dimensions.width
              )}
            >
              <IconButton
                onPress={() => {
                  try {
                    props.onPressClose?.();
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                size={32}
                color={palettes.Brand.Surface}
                icon={'AntDesign/close'}
                style={StyleSheet.applyWidth({ opacity: 1 }, dimensions.width)}
              />
            </View>
            {/* Content */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', paddingTop: 30 },
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
                      fontSize: 21,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Welcome Back'}
              </Text>
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
                      marginTop: 15,
                      paddingLeft: 40,
                      paddingRight: 40,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Complete a lesson to grow your streak.'}
              </Text>
              {/* Text 3 */}
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
                      marginTop: 50,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'This week'}
              </Text>
              {/* Text 4 */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.Brand.Surface,
                      fontFamily: 'Poppins_900Black',
                      fontSize: 40,
                      lineHeight: 45,
                      marginTop: 20,
                    }
                  ),
                  dimensions.width
                )}
              >
                {countSelectedDailyTrackers(
                  transformDailyTrackersData(
                    props.dailyTrackers ?? defaultProps.dailyTrackers
                  )
                )}
              </Text>
              {/* Text 5 */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.Brand.Surface,
                      fontFamily: 'Poppins_300Light',
                      fontSize: 12,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Days'}
              </Text>

              <View
                style={StyleSheet.applyWidth(
                  { marginTop: 30 },
                  dimensions.width
                )}
              >
                <SimpleStyleFlatList
                  data={transformDailyTrackersData(
                    props.dailyTrackers ?? defaultProps.dailyTrackers
                  )}
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
                  listKey={'View->Content->View->List'}
                  nestedScrollEnabled={false}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  pagingEnabled={false}
                  renderItem={({ item, index }) => {
                    const listData = item;
                    return (
                      <View
                        style={StyleSheet.applyWidth(
                          { alignItems: 'center', justifyContent: 'center' },
                          dimensions.width
                        )}
                      >
                        <View>
                          <>
                            {!(listData?.selected === false) ? null : (
                              <Circle
                                {...GlobalStyles.CircleStyles(theme)['Circle']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.CircleStyles(theme)['Circle']
                                      .style,
                                    {
                                      backgroundColor: theme.colors.text.light,
                                      borderColor: palettes.Brand.Surface,
                                      borderWidth: 2,
                                      height: 36,
                                      marginLeft: 6,
                                      marginRight: 6,
                                      opacity: 0.2,
                                      width: 36,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              />
                            )}
                          </>
                          {/* Selected */}
                          <>
                            {!(listData?.selected === true) ? null : (
                              <Circle
                                {...GlobalStyles.CircleStyles(theme)['Circle']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.CircleStyles(theme)['Circle']
                                      .style,
                                    {
                                      backgroundColor: palettes.Brand.Surface,
                                      borderColor: palettes.Brand.Surface,
                                      borderWidth: 2,
                                      height: 36,
                                      marginLeft: 6,
                                      marginRight: 6,
                                      opacity: 1,
                                      width: 36,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                <Icon
                                  size={24}
                                  color={theme.colors.background.brand}
                                  name={'Entypo/check'}
                                />
                              </Circle>
                            )}
                          </>
                          {/* Current Day Circle */}
                          <>
                            {!(getCurrentDayIndex() === index) ? null : (
                              <Circle
                                {...GlobalStyles.CircleStyles(theme)['Circle']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.CircleStyles(theme)['Circle']
                                      .style,
                                    {
                                      backgroundColor: 'rgba(0, 0, 0, 0)',
                                      borderColor:
                                        theme.colors.background.danger,
                                      borderStyle: 'solid',
                                      borderWidth: 3,
                                      height: 36,
                                      marginLeft: 6,
                                      marginRight: 6,
                                      opacity: 1,
                                      position: 'absolute',
                                      width: 36,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              />
                            )}
                          </>
                        </View>

                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.Brand.Surface,
                                fontSize: 12,
                                marginTop: 6,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {listData?.label}
                        </Text>
                      </View>
                    );
                  }}
                  showsHorizontalScrollIndicator={true}
                  showsVerticalScrollIndicator={true}
                  snapToAlignment={'start'}
                  scrollEnabled={false}
                  style={StyleSheet.applyWidth(
                    { flexDirection: 'row' },
                    dimensions.width
                  )}
                />
              </View>
              {/* Quote */}
              <View
                style={StyleSheet.applyWidth(
                  { marginTop: 35, paddingLeft: 25, paddingRight: 25 },
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
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    '"It\'s not what we do once in a while that shapes our lives. It\'s what we do consistently"'
                  }
                </Text>
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
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        marginTop: 5,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'- Tony Robbins'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </>
    </Modal>
  );
};

export default withTheme(ModalDailyStreakTrackerBlock);
