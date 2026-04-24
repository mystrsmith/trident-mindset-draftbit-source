import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import {
  CircularProgress,
  Icon,
  Pressable,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
  Touchable,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import DashboardInfoBlock from '../components/DashboardInfoBlock';
import calculateTacticProgress from '../global-functions/calculateTacticProgress';
import delaySeconds from '../global-functions/delaySeconds';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import * as ExpoImage from '../custom-files/ExpoImage';

const defaultProps = {
  getNormalProgramTactics: data =>
    (data ?? []).filter(item => item?.type !== 'core_program'),
};

const SCROLL_DELAY_MS = 1000;
const SCROLL_ANIMATION_DURATION_MS = 1200;
const ESTIMATED_HEADER_HEIGHT = 320;
const ESTIMATED_ROW_HEIGHT = 470;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const Index = React.forwardRef(
  (
    {
      navigation,
      Constants,
      setGlobalVariableValue,
      theme,
      dimensions,
      refreshingIndex,
      setVisibleModalGiftSubscription,
      getNormalProgramTactics = defaultProps.getNormalProgramTactics,
    },
    ref
  ) => {
    const scrollViewRef = React.useRef(null);
    const scrollOffsetYRef = React.useRef(0);
    const dataLengthRef = React.useRef(0);
    const scrollToIndexRef = React.useRef(-1);
    const hasScrolledTacticsListRef = React.useRef(false);
    const scrollTimeoutRef = React.useRef(null);
    const scrollRafRef = React.useRef(null);

    const setScrollViewRef = React.useCallback(
      el => {
        scrollViewRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      },
      [ref]
    );

    const scrollScrollViewToIndex = React.useCallback(() => {
      const targetIndex = scrollToIndexRef.current;
      const length = dataLengthRef.current;
      if (
        targetIndex < 0 ||
        length <= targetIndex ||
        !scrollViewRef.current?.scrollTo
      )
        return;

      // Content above list: DashboardInfoBlock + 2 buttons + margins (no full-width image)
      // FlatList has paddingTop: 5, then each row is ESTIMATED_ROW_HEIGHT
      const listPaddingTop = 5;
      const itemTopY =
        ESTIMATED_HEADER_HEIGHT +
        listPaddingTop +
        targetIndex * ESTIMATED_ROW_HEIGHT;
      const itemCenterY = itemTopY + ESTIMATED_ROW_HEIGHT / 2;
      const viewportHeight = dimensions.height ?? 400;
      const endY = Math.max(0, itemCenterY - viewportHeight / 2);
      const startY = scrollOffsetYRef.current;
      const duration = SCROLL_ANIMATION_DURATION_MS;
      const startTime = Date.now();

      const cancelRaf = () => {
        if (scrollRafRef.current != null) {
          cancelAnimationFrame(scrollRafRef.current);
          scrollRafRef.current = null;
        }
      };

      const step = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        const currentY = startY + (endY - startY) * eased;
        scrollViewRef.current?.scrollTo({ y: currentY, animated: false });
        scrollOffsetYRef.current = currentY;

        if (progress < 1) {
          scrollRafRef.current = requestAnimationFrame(step);
        } else {
          scrollRafRef.current = null;
        }
      };

      cancelRaf();
      scrollRafRef.current = requestAnimationFrame(step);
    }, [dimensions.width, dimensions.height]);

    const scheduleScrollAfterDelay = React.useCallback(() => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
        scrollScrollViewToIndex();
      }, SCROLL_DELAY_MS);
    }, [scrollScrollViewToIndex]);

    React.useEffect(() => {
      return () => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        if (scrollRafRef.current != null)
          cancelAnimationFrame(scrollRafRef.current);
      };
    }, []);

    const handleContentSizeChangeTactics = React.useCallback(() => {
      if (hasScrolledTacticsListRef.current) return;
      if (scrollToIndexRef.current < 0) return;
      hasScrolledTacticsListRef.current = true;
      scheduleScrollAfterDelay();
    }, [scheduleScrollAfterDelay]);

    return (
      <SimpleStyleScrollView
        ref={setScrollViewRef}
        bounces={true}
        horizontal={false}
        keyboardShouldPersistTaps={'never'}
        nestedScrollEnabled={false}
        onScroll={e => {
          scrollOffsetYRef.current = e.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        style={StyleSheet.applyWidth({ paddingBottom: 100 }, dimensions.width)}
      >
        <View
          style={StyleSheet.applyWidth(
            { gap: 18, marginBottom: 10, marginLeft: 15, marginRight: 15 },
            dimensions.width
          )}
        >
          <DashboardInfoBlock
            refreshingIndex={refreshingIndex}
            showCollapsible={true}
          />
          <View
            style={StyleSheet.applyWidth(
              { gap: 15, marginBottom: 20, marginTop: 15 },
              dimensions.width
            )}
          >
            {/* Continue Where you Left Off */}
            <>
              {!Constants['LAST_LEFTOFF_LESSON']?.next_lesson ? null : (
                <Touchable
                  onPress={() => {
                    const handler = async () => {
                      try {
                        await setGlobalVariableValue({
                          key: 'SHOW_LEFTOFF_MODAL',
                          value: false,
                        });
                        navigation.navigate(
                          'LessonsScreen',
                          {
                            tactic_prop:
                              Constants['LAST_LEFTOFF_LESSON'].next_lesson
                                .tactic,
                            tactic_id:
                              Constants['LAST_LEFTOFF_LESSON']?.next_lesson
                                ?.tactic_id,
                          },
                          { pop: true }
                        );
                        navigation.navigate(
                          'LessonDetailsScreen',
                          {
                            lesson_id:
                              Constants['LAST_LEFTOFF_LESSON']?.next_lesson?.id,
                          },
                          { pop: true }
                        );
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
                        alignItems: 'center',
                        backgroundColor: palettes.App.Success,
                        borderRadius: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                        paddingLeft: 18,
                        paddingRight: 18,
                      },
                      dimensions.width
                    )}
                  >
                    {/* View 2 */}
                    <View
                      style={StyleSheet.applyWidth(
                        { width: 30 },
                        dimensions.width
                      )}
                    />
                    <View
                      style={StyleSheet.applyWidth(
                        { flex: 1 },
                        dimensions.width
                      )}
                    >
                      {/* Title */}
                      <Text
                        accessible={true}
                        selectable={false}
                        numberOfLines={1}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: 'rgb(234, 237, 242)',
                              fontFamily: 'Rasa_600SemiBold',
                              fontSize: 18,
                              paddingBottom: 2,
                              paddingTop: 2,
                              textAlign: 'center',
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Continue Your Training'}
                      </Text>
                      {/* Subtitle */}
                      <Text
                        accessible={true}
                        selectable={false}
                        numberOfLines={3}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: 'rgb(234, 237, 242)',
                              fontFamily: 'Rasa_300Light',
                              fontSize: 16,
                              textAlign: 'center',
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Next Lesson: '}
                        {Constants['LAST_LEFTOFF_LESSON']?.next_lesson?.title}
                      </Text>
                    </View>
                    {/* Play */}
                    <View>
                      <Icon
                        size={24}
                        color={palettes.App.White}
                        name={'Entypo/controller-play'}
                      />
                    </View>
                  </View>
                </Touchable>
              )}
            </>
            {/* Share Trident Mindset 2 */}
            <>
              {!Constants['GUEST_PASS_URL'] ? null : (
                <Touchable
                  onPress={() => {
                    try {
                      setVisibleModalGiftSubscription(true);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                >
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        backgroundColor: palettes.Brand['Base Blue'],
                        borderRadius: 15,
                        padding: 10,
                        paddingLeft: 18,
                        paddingRight: 18,
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
                            color: 'rgb(234, 237, 242)',
                            fontFamily: 'Rasa_600SemiBold',
                            fontSize: 18,
                            paddingBottom: 2,
                            paddingTop: 2,
                            textAlign: 'center',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Share Trident Mindset'}
                    </Text>
                    {/* Subtitle */}
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: 'rgb(234, 237, 242)',
                            fontFamily: 'Rasa_300Light',
                            fontSize: 16,
                            textAlign: 'center',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Give a free month to anyone'}
                    </Text>
                  </View>
                </Touchable>
              )}
            </>
          </View>
        </View>

        <XanoBackendApi.FetchGetTacticsGET
          favorited={false}
          handlers={{
            onData: fetchData => {
              const handler = async () => {
                try {
                  await setGlobalVariableValue({
                    key: 'all_tactics',
                    value: fetchData,
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              };
              handler();
            },
          }}
          noted={false}
        >
          {({ loading, error, data, refetchGetTactics }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            const tacticsList = getNormalProgramTactics(fetchData);
            dataLengthRef.current = tacticsList?.length ?? 0;
            const nextTacticId = Constants['NEXT_TACTIC_ID'];
            scrollToIndexRef.current =
              nextTacticId != null
                ? tacticsList?.findIndex(t => t?.id === nextTacticId) - 1 ?? -1
                : -1;

            return (
              <SimpleStyleFlatList
                data={tacticsList}
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
                listKey={'Container->Scroll View->Fetch->List'}
                nestedScrollEnabled={false}
                numColumns={1}
                onContentSizeChange={handleContentSizeChangeTactics}
                onEndReachedThreshold={0.5}
                pagingEnabled={false}
                renderItem={({ item, index }) => {
                  const listData = item;
                  return (
                    <Pressable
                      onPress={() => {
                        try {
                          navigation.navigate(
                            'LessonsScreen',
                            {
                              tactic_prop: listData,
                              tactic_id: listData?.id,
                            },
                            { pop: true }
                          );
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      activeOpacity={0.8}
                      style={StyleSheet.applyWidth(
                        { marginBottom: 35 },
                        dimensions.width
                      )}
                    >
                      <View>
                        {/* Image Wrapper */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              borderColor: palettes.App['App Buttons Color'],
                              borderRadius: 15,
                              borderWidth: 1,
                              height: 350,
                              overflow: 'hidden',
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          <Utils.CustomCodeErrorBoundary>
                            <ExpoImage.Index
                              source={imageSource(`${item?.photo?.url}`)}
                              blurhash={'L87VTFRS8wMdILtSxsW?8wbwysx^'}
                              contentFit="cover"
                              transition={1000}
                              borderRadius={15}
                            />
                          </Utils.CustomCodeErrorBoundary>
                        </View>
                        {/* Name */}
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Screen_Title']
                            .props}
                          numberOfLines={1}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Screen_Title']
                                .style,
                              {
                                color: Constants['APP_FONT_COLOR'],
                                fontFamily: 'Rasa_700Bold',
                                fontSize: 26,
                                marginTop: 13,
                                textAlign: 'center',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {listData?.title}
                        </Text>
                        {/* Description */}
                        <>
                          {!listData?.sub_title ? null : (
                            <Text
                              accessible={true}
                              selectable={false}
                              {...GlobalStyles.TextStyles(theme)['Text'].props}
                              numberOfLines={2}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.TextStyles(theme)['Text'].style,
                                  {
                                    color: Constants['APP_FONT_COLOR'],
                                    fontFamily: 'Rasa_400Regular',
                                    fontSize: 18,
                                    marginTop: 3,
                                    textAlign: 'center',
                                  }
                                ),
                                dimensions.width
                              )}
                            >
                              {listData?.sub_title}
                            </Text>
                          )}
                        </>
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              height: 55,
                              justifyContent: 'center',
                              left: 15,
                              position: 'absolute',
                              top: 15,
                              width: 55,
                            },
                            dimensions.width
                          )}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                backgroundColor: theme.colors.text.strong,
                                borderRadius: 27,
                                height: 54,
                                left: 0,
                                opacity: 0.4,
                                position: 'absolute',
                                top: 0,
                                width: 54,
                              },
                              dimensions.width
                            )}
                          />
                          <Text
                            accessible={true}
                            selectable={false}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: palettes.App['Custom Color'],
                                  fontFamily: 'Rasa_600SemiBold',
                                  fontSize: 18,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {listData?.completed_count}
                            {'/'}
                            {listData?.total_tactics_count}
                          </Text>
                          <CircularProgress
                            animationDuration={500}
                            indeterminate={false}
                            isAnimated={true}
                            lineCap={'round'}
                            showTrack={true}
                            startPosition={'top'}
                            trackColor={theme.colors.border.base}
                            trackLineCap={'round'}
                            color={palettes.App['App Buttons Color']}
                            style={StyleSheet.applyWidth(
                              { height: 55, position: 'absolute', width: 55 },
                              dimensions.width
                            )}
                            thickness={4}
                            trackThickness={2}
                            value={calculateTacticProgress(listData)}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
                snapToAlignment={'start'}
                scrollEnabled={false}
                style={StyleSheet.applyWidth(
                  { padding: 15, paddingTop: 5 },
                  dimensions.width
                )}
              />
            );
          }}
        </XanoBackendApi.FetchGetTacticsGET>
      </SimpleStyleScrollView>
    );
  }
);

Index.displayName = 'CustomTacticsList';

export { Index };
