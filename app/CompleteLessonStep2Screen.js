import React from 'react';
import {
  Button,
  Circle,
  Icon,
  LinearGradient,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import getCurrentDayIndex from '../global-functions/getCurrentDayIndex';
import toNumber from '../global-functions/toNumber';
import transformDailyTrackersData from '../global-functions/transformDailyTrackersData';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const defaultProps = { dailyTrackers: [], lessonDetailResponse: null };

const CompleteLessonStep2Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [localDailyTrackers, setLocalDailyTrackers] = React.useState(
    params?.dailyTrackers ?? defaultProps.dailyTrackers
  );
  const countSelectedDailyTrackers = localDailyTrackers => {
    return localDailyTrackers.reduce(
      (count, tracker) => (tracker.selected ? count + 1 : count),
      0
    );
  };
  const xanoBackendCreateDailyTrackerPOST =
    XanoBackendApi.useCreateDailyTrackerPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        (await xanoBackendCreateDailyTrackerPOST.mutateAsync())?.json;
        const resultDailyTrackers = (
          await XanoBackendApi.getDailyTrackerGET(Constants)
        )?.json;
        setLocalDailyTrackers(resultDailyTrackers);
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, [isFocused]);

  return (
    <ScreenContainer hasSafeArea={false} scrollable={false}>
      {/* Container */}
      <View
        style={StyleSheet.applyWidth(
          {
            backgroundColor: palettes.App.Black,
            flex: 1,
            paddingBottom: safeAreaInsets.bottom,
            paddingTop: safeAreaInsets.top,
          },
          dimensions.width
        )}
      >
        <LinearGradient
          startX={0}
          startY={0}
          {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].props}
          color1={palettes.App.Black_Alpha_80}
          color2={palettes.App['Background 90 Opacity']}
          color3={palettes.App.Black_Alpha_80}
          endX={0}
          endY={90}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
              { height: '100%', opacity: 1, width: '100%' }
            ),
            dimensions.width
          )}
        >
          {/* Flex1 */}
          <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
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
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 36,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Streaks'}
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
                      fontFamily: 'Rasa_400Regular',
                      fontSize: 17,
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
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 20,
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
                      fontFamily: 'Rasa_700Bold',
                      fontSize: 60,
                      lineHeight: 60,
                      marginTop: 20,
                    }
                  ),
                  dimensions.width
                )}
              >
                {countSelectedDailyTrackers(
                  transformDailyTrackersData(localDailyTrackers)
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
                      fontFamily: 'Rasa_300Light',
                      fontSize: 16,
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
                  data={transformDailyTrackersData(localDailyTrackers)}
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
                    'Container->Linear Gradient->Flex1->Content->View->List'
                  }
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
                                      borderWidth: 1,
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
                                      backgroundColor: palettes.App.Success,
                                      borderColor: palettes.Brand.Surface,
                                      borderWidth: 1,
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
                                  color={palettes.Brand.Surface}
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
                                      borderStyle: 'solid',
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
                    { flexDirection: 'row', height: 70 },
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
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 16,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    '“Greatness is not owned. It is rented. And rent is due every day.”'
                  }
                </Text>
              </View>
            </View>
          </View>
          {/* Bottom */}
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'center', flex: 0.2, justifyContent: 'center' },
              dimensions.width
            )}
          >
            <Button
              accessible={true}
              iconPosition={'left'}
              onPress={() => {
                const handler = async () => {
                  try {
                    const currentLesson = (
                      params?.lessonDetailResponse ??
                      defaultProps.lessonDetailResponse
                    )?.current_lesson;
                    const nextLessonId = (
                      params?.lessonDetailResponse ??
                      defaultProps.lessonDetailResponse
                    )?.next_lesson_id;
                    const nextTacticId = (
                      params?.lessonDetailResponse ??
                      defaultProps.lessonDetailResponse
                    )?.next_tactic_id;
                    await setGlobalVariableValue({
                      key: 'NEXT_LESSON_ID',
                      value: nextLessonId,
                    });
                    await setGlobalVariableValue({
                      key: 'NEXT_TACTIC_ID',
                      value: nextTacticId,
                    });
                    if (toNumber(currentLesson?.category_id) !== 0) {
                      if (navigation.canGoBack()) {
                        navigation.popToTop();
                      }
                      navigation.replace('BottomTabNavigator', {});
                      await waitUtil({ milliseconds: 450 });
                      navigation.navigate('LessonsScreen', {
                        category_id: currentLesson?.category_id,
                        tactic_prop: currentLesson?.category,
                        tactic_id: null,
                        screen_title: currentLesson?.category?.title,
                      });
                    } else {
                      if (
                        nextTacticId !== null &&
                        currentLesson?.tactic_id === nextTacticId
                      ) {
                        if (navigation.canGoBack()) {
                          navigation.popToTop();
                        }
                        navigation.replace('BottomTabNavigator', {
                          screen: 'HomeStack',
                          params: { screen: '' },
                        });
                        await waitUtil({ milliseconds: 500 });
                        navigation.navigate('LessonsScreen', {
                          category_id: null,
                          tactic_prop: currentLesson?.tactic,
                          tactic_id: currentLesson?.tactic_id,
                          screen_title: 'Lessons',
                        });
                      } else {
                        if (nextLessonId === null && nextTacticId !== null) {
                          if (navigation.canGoBack()) {
                            navigation.popToTop();
                          }
                          navigation.replace('BottomTabNavigator', {
                            screen: 'HomeStack',
                            params: { screen: '' },
                          });
                        } else {
                        }
                      }
                    }
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
              title={'Continue'}
            />
          </View>
        </LinearGradient>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(CompleteLessonStep2Screen);
