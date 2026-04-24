import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import {
  Checkbox,
  CircularProgress,
  ExpoImage,
  Icon,
  Pressable,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import Images from '../config/Images';
import * as CircleShimmer from './CircleShimmer';
import * as ShimmerLessonList from './ShimmerLessonList';
import calculateCategoryProgress from '../global-functions/calculateCategoryProgress';
import calculateTacticProgress from '../global-functions/calculateTacticProgress';
import OfflineMode_downloadLesson from '../global-functions/OfflineMode_downloadLesson';
import OfflineMode_isDownloaded from '../global-functions/OfflineMode_isDownloaded';
import isSubscribed from '../global-functions/isSubscribed';
import showToastMessage from '../global-functions/showToastMessage';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';

const defaultProps = {
  category_id: null,
  tactic_id: null,
  tactic_prop: null,
};

const SCROLL_DELAY_MS = 1000;
const SCROLL_ANIMATION_DURATION_MS = 1200;
const ESTIMATED_ROW_HEIGHT = 95;
const ESTIMATED_HEADER_EXTRA = 150;

// Ease-in-out cubic for smooth start and end
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const Index = React.forwardRef(
  (
    {
      params,
      defaultProps: defaultPropsProp = defaultProps,
      navigation,
      Variables,
      Constants,
      setGlobalVariableValue,
      theme,
      dimensions,
      setShowWaitDownloading,
      setVisibleModalDownloadInfo,
      isOnline,
      xanoBackendUpdateFavoriteLessonsPOST,
      isCompleted,
      isFavorited,
    },
    ref
  ) => {
    const scrollViewRef = React.useRef(null);
    const scrollOffsetYRef = React.useRef(0);
    const dataLengthRef = React.useRef(0);
    const scrollToIndexRef = React.useRef(-1);
    const hasScrolledTacticListRef = React.useRef(false);
    const hasScrolledCategoryListRef = React.useRef(false);
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

      const estimatedHeaderHeight = dimensions.width + ESTIMATED_HEADER_EXTRA;
      const itemTopY =
        estimatedHeaderHeight + targetIndex * ESTIMATED_ROW_HEIGHT;
      const item10CenterY = itemTopY + ESTIMATED_ROW_HEIGHT / 2;
      const viewportHeight = dimensions.height ?? 400;
      const endY = Math.max(0, item10CenterY - viewportHeight / 2);
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

    const handleContentSizeChangeTactic = React.useCallback(() => {
      if (hasScrolledTacticListRef.current) return;
      if (scrollToIndexRef.current < 0) return;
      hasScrolledTacticListRef.current = true;
      scheduleScrollAfterDelay();
    }, [scheduleScrollAfterDelay]);

    const handleContentSizeChangeCategory = React.useCallback(() => {
      if (hasScrolledCategoryListRef.current) return;
      if (scrollToIndexRef.current < 0) return;
      hasScrolledCategoryListRef.current = true;
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
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={StyleSheet.applyWidth({ paddingBottom: 60 }, dimensions.width)}
      >
        {/* Tactic */}
        <View>
          {/* Image Wrapper */}
          <View
            style={StyleSheet.applyWidth(
              { height: dimensions.width, overflow: 'hidden', width: '100%' },
              dimensions.width
            )}
          >
            <ExpoImage
              allowDownscaling={true}
              cachePolicy={'disk'}
              contentPosition={'center'}
              resizeMode={'cover'}
              transitionEffect={'cross-dissolve'}
              {...GlobalStyles.ExpoImageStyles(theme)['Image 2'].props}
              blurhash={
                (params?.tactic_prop ?? defaultPropsProp.tactic_prop)?.blurhash
              }
              source={imageSource(
                `${
                  (params?.tactic_prop ?? defaultPropsProp.tactic_prop)?.photo
                    ?.url
                }`
              )}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.ExpoImageStyles(theme)['Image 2'].style,
                  { height: '100%', width: '100%' }
                ),
                dimensions.width
              )}
              transitionDuration={1000}
              transitionTiming={'ease-in-out'}
            />
          </View>
          {/* Name */}
          <>
            {!(params?.tactic_prop ?? defaultPropsProp.tactic_prop)
              ?.title ? null : (
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                numberOfLines={1}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                    {
                      color: Constants['APP_FONT_COLOR'],
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 26,
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 20,
                    }
                  ),
                  dimensions.width
                )}
              >
                {(params?.tactic_prop ?? defaultPropsProp.tactic_prop)?.title}
              </Text>
            )}
          </>
          {/* Description */}
          <>
            {!(params?.tactic_prop ?? defaultPropsProp.tactic_prop)
              ?.sub_title ? null : (
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
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 3,
                    }
                  ),
                  dimensions.width
                )}
              >
                {
                  (params?.tactic_prop ?? defaultPropsProp.tactic_prop)
                    ?.sub_title
                }
              </Text>
            )}
          </>
          <View
            style={StyleSheet.applyWidth(
              {
                height: 55,
                left: 15,
                position: 'absolute',
                top: 15,
                width: 55,
              },
              dimensions.width
            )}
          >
            {/* Fetch Tactic */}
            <>
              {!(
                (params?.category_id ?? defaultPropsProp.category_id) === null
              ) ? null : (
                <XanoBackendApi.FetchGetTacticDetailGET
                  tactic_id={params?.tactic_id ?? defaultPropsProp.tactic_id}
                >
                  {({ loading, error, data, refetchGetTacticDetail }) => {
                    const fetchTacticData = data?.json;
                    if (loading) {
                      return (
                        <>
                          {/* Loading */}
                          <View>
                            <Utils.CustomCodeErrorBoundary>
                              <CircleShimmer.Index size={55} />
                            </Utils.CustomCodeErrorBoundary>
                          </View>
                        </>
                      );
                    }

                    if (error || data?.status < 200 || data?.status >= 300) {
                      return <ActivityIndicator />;
                    }

                    return (
                      <>
                        {/* Loaded */}
                        <View>
                          {/* Loaded Tactic */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                height: 55,
                                justifyContent: 'center',
                                left: 0,
                                position: 'absolute',
                                top: 0,
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
                                  height: 55,
                                  left: 0,
                                  opacity: 0.4,
                                  position: 'absolute',
                                  top: 0,
                                  width: 55,
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
                              {fetchTacticData?.completed_count}
                              {'/'}
                              {fetchTacticData?.total_tactics_count}
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
                                {
                                  height: 55,
                                  left: 0,
                                  position: 'absolute',
                                  top: 0,
                                  width: 55,
                                },
                                dimensions.width
                              )}
                              thickness={4}
                              trackThickness={2}
                              value={calculateTacticProgress(fetchTacticData)}
                            />
                          </View>
                        </View>
                      </>
                    );
                  }}
                </XanoBackendApi.FetchGetTacticDetailGET>
              )}
            </>
            {/* Fetch Category */}
            <>
              {!(
                (params?.category_id ?? defaultPropsProp.category_id) !== null
              ) ? null : (
                <XanoBackendApi.FetchGetCategoryDetailGET
                  category_id={
                    params?.category_id ?? defaultPropsProp.category_id
                  }
                >
                  {({ loading, error, data, refetchGetCategoryDetail }) => {
                    const fetchCategoryData = data?.json;
                    if (loading) {
                      return (
                        <>
                          {/* Loading */}
                          <View>
                            <Utils.CustomCodeErrorBoundary>
                              <CircleShimmer.Index size={55} />
                            </Utils.CustomCodeErrorBoundary>
                          </View>
                        </>
                      );
                    }

                    if (error || data?.status < 200 || data?.status >= 300) {
                      return <ActivityIndicator />;
                    }

                    return (
                      <>
                        {/* Loaded */}
                        <View>
                          {/* Loaded Category */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                height: 55,
                                justifyContent: 'center',
                                left: 0,
                                position: 'absolute',
                                top: 0,
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
                                  height: 55,
                                  left: 0,
                                  opacity: 0.4,
                                  position: 'absolute',
                                  top: 0,
                                  width: 55,
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
                              {fetchCategoryData?.completed_count}
                              {'/'}
                              {fetchCategoryData?.total_categories_count}
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
                                {
                                  height: 55,
                                  left: 0,
                                  position: 'absolute',
                                  top: 0,
                                  width: 55,
                                },
                                dimensions.width
                              )}
                              thickness={4}
                              trackThickness={2}
                              value={calculateCategoryProgress(
                                fetchCategoryData
                              )}
                            />
                          </View>
                        </View>
                      </>
                    );
                  }}
                </XanoBackendApi.FetchGetCategoryDetailGET>
              )}
            </>
          </View>
        </View>

        <View>
          {/* Fetch Lessons */}
          <>
            {!(
              (params?.category_id ?? defaultPropsProp.category_id) === null
            ) ? null : (
              <XanoBackendApi.FetchGetLessonsGET
                tactic_id={params?.tactic_id ?? defaultPropsProp.tactic_id}
              >
                {({ loading, error, data, refetchGetLessons }) => {
                  const fetchLessonsData = data?.json;
                  if (loading) {
                    return (
                      <View>
                        <Utils.CustomCodeErrorBoundary>
                          <ShimmerLessonList.Index />
                        </Utils.CustomCodeErrorBoundary>
                      </View>
                    );
                  }

                  if (error || data?.status < 200 || data?.status >= 300) {
                    return <ActivityIndicator />;
                  }

                  dataLengthRef.current = fetchLessonsData?.length ?? 0;
                  const nextLessonId = Constants['NEXT_LESSON_ID'];
                  scrollToIndexRef.current =
                    nextLessonId != null
                      ? fetchLessonsData?.findIndex(
                          l => l?.id === nextLessonId
                        ) ?? -1
                      : -1;

                  return (
                    <SimpleStyleFlatList
                      data={fetchLessonsData}
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
                        'Container->Scroll View->View->Fetch Lessons->List'
                      }
                      nestedScrollEnabled={false}
                      numColumns={1}
                      onContentSizeChange={handleContentSizeChangeTactic}
                      onEndReachedThreshold={0.5}
                      pagingEnabled={false}
                      renderItem={({ item, index }) => {
                        const listData = item;
                        return (
                          <Pressable
                            onPress={() => {
                              const handler = async () => {
                                try {
                                  if (isSubscribed(Variables) === true) {
                                    navigation.navigate(
                                      'LessonDetailsScreen',
                                      { lesson_id: listData?.id },
                                      { pop: true }
                                    );
                                  } else {
                                    if (!listData?.subscription_required) {
                                      navigation.navigate(
                                        'LessonDetailsScreen',
                                        { lesson_id: listData?.id },
                                        { pop: true }
                                      );
                                    } else {
                                      if (navigation.canGoBack()) {
                                        navigation.popToTop();
                                      }
                                      navigation.replace('BottomTabNavigator', {
                                        screen: 'HomeStack',
                                        params: { screen: 'HomeScreen' },
                                      });
                                      await setGlobalVariableValue({
                                        key: 'VISIBLE_MODAL_PAYWALL',
                                        value: true,
                                      });
                                    }
                                  }
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              };
                              handler();
                            }}
                            activeOpacity={0.8}
                          >
                            {/* View 2 */}
                            <View>
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'stretch',
                                    borderBottomWidth: 1,
                                    borderColor: palettes.App.Outline,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    margin: 20,
                                    marginBottom: 0,
                                    paddingBottom: 12,
                                  },
                                  dimensions.width
                                )}
                              >
                                <View
                                  style={StyleSheet.applyWidth(
                                    { flex: 1 },
                                    dimensions.width
                                  )}
                                >
                                  {/* Details */}
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        flex: 1,
                                        flexDirection: 'row',
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          height: 55,
                                          width: 55,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {/* Image 2 */}
                                      <>
                                        {listData?.subscription_required ===
                                          true &&
                                        isSubscribed(Variables) ===
                                          false ? null : (
                                          <ExpoImage
                                            allowDownscaling={true}
                                            cachePolicy={'disk'}
                                            contentPosition={'center'}
                                            resizeMode={'cover'}
                                            transitionDuration={300}
                                            transitionEffect={'cross-dissolve'}
                                            transitionTiming={'ease-in-out'}
                                            {...GlobalStyles.ExpoImageStyles(
                                              theme
                                            )['Image 18'].props}
                                            source={imageSource(
                                              Images['NavyAppLogo']
                                            )}
                                            style={StyleSheet.applyWidth(
                                              StyleSheet.compose(
                                                GlobalStyles.ExpoImageStyles(
                                                  theme
                                                )['Image 18'].style,
                                                {
                                                  borderColor:
                                                    palettes.App[
                                                      'App Buttons Color'
                                                    ],
                                                  borderRadius: 8,
                                                  borderWidth: 1,
                                                  height: 55,
                                                  width: 55,
                                                }
                                              ),
                                              dimensions.width
                                            )}
                                          />
                                        )}
                                      </>
                                      {/* Checked */}
                                      <>
                                        {!isCompleted(listData?.id) ? null : (
                                          <View
                                            style={StyleSheet.applyWidth(
                                              {
                                                alignItems: 'center',
                                                backgroundColor:
                                                  palettes.App.Success,
                                                borderRadius: 6,
                                                justifyContent: 'center',
                                                left: 0,
                                                overflow: 'hidden',
                                                padding: 3,
                                                position: 'absolute',
                                                top: 0,
                                              },
                                              dimensions.width
                                            )}
                                          >
                                            <>
                                              {!isCompleted(
                                                listData?.id
                                              ) ? null : (
                                                <Icon
                                                  color={palettes.App.White}
                                                  name={'FontAwesome/check'}
                                                  size={15}
                                                  style={StyleSheet.applyWidth(
                                                    { height: 15, width: 15 },
                                                    dimensions.width
                                                  )}
                                                />
                                              )}
                                            </>
                                          </View>
                                        )}
                                      </>
                                    </View>
                                    {/* Details */}
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          flex: 1,
                                          justifyContent: 'center',
                                          marginLeft: 10,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {/* Title */}
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
                                              color:
                                                Constants['APP_FONT_COLOR'],
                                              fontFamily: 'Rasa_600SemiBold',
                                              fontSize: 20,
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {listData?.title}
                                      </Text>
                                      {/* Sub-title */}
                                      <>
                                        {!listData?.sub_title ? null : (
                                          <Text
                                            accessible={true}
                                            selectable={false}
                                            {...GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].props}
                                            numberOfLines={1}
                                            style={StyleSheet.applyWidth(
                                              StyleSheet.compose(
                                                GlobalStyles.TextStyles(theme)[
                                                  'Text'
                                                ].style,
                                                {
                                                  color:
                                                    Constants['APP_FONT_COLOR'],
                                                  fontFamily: 'Rasa_300Light',
                                                  fontSize: 17,
                                                  marginTop: 4,
                                                }
                                              ),
                                              dimensions.width
                                            )}
                                          >
                                            {listData?.sub_title}
                                          </Text>
                                        )}
                                      </>
                                    </View>
                                  </View>
                                </View>
                                {/* Actions */}
                                <>
                                  {isSubscribed(Variables) === false &&
                                  listData?.subscription_required ===
                                    true ? null : (
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'flex-end',
                                          marginLeft: 10,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {/* DownloadButton */}
                                      <>
                                        {OfflineMode_isDownloaded(
                                          Variables,
                                          listData?.id
                                        ) ? null : (
                                          <Pressable
                                            onPress={() => {
                                              const handler = async () => {
                                                try {
                                                  setShowWaitDownloading(true);
                                                  setVisibleModalDownloadInfo(
                                                    true
                                                  );
                                                  await OfflineMode_downloadLesson(
                                                    Variables,
                                                    setGlobalVariableValue,
                                                    listData
                                                  );
                                                } catch (err) {
                                                  Sentry.captureException(err);
                                                  console.error(err);
                                                }
                                              };
                                              handler();
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
                                              <>
                                                {!(
                                                  listData?.id !==
                                                  Constants[
                                                    'CURRENT_DOWNLOAD_ID'
                                                  ]
                                                ) ? null : (
                                                  <Icon
                                                    size={24}
                                                    color={
                                                      palettes.App[
                                                        'App Buttons Color'
                                                      ]
                                                    }
                                                    name={
                                                      'Feather/download-cloud'
                                                    }
                                                  />
                                                )}
                                              </>
                                              {/* DownloadView */}
                                              <>
                                                {!(
                                                  listData?.id ===
                                                  Constants[
                                                    'CURRENT_DOWNLOAD_ID'
                                                  ]
                                                ) ? null : (
                                                  <View
                                                    style={StyleSheet.applyWidth(
                                                      {
                                                        alignItems: 'center',
                                                        justifyContent:
                                                          'center',
                                                      },
                                                      dimensions.width
                                                    )}
                                                  >
                                                    <CircularProgress
                                                      animationDuration={500}
                                                      color={
                                                        theme.colors.branding
                                                          .primary
                                                      }
                                                      indeterminate={false}
                                                      isAnimated={true}
                                                      lineCap={'round'}
                                                      showTrack={true}
                                                      startPosition={'top'}
                                                      trackColor={
                                                        theme.colors.border.base
                                                      }
                                                      trackLineCap={'round'}
                                                      maximumValue={10}
                                                      style={StyleSheet.applyWidth(
                                                        {
                                                          height: 35,
                                                          position: 'absolute',
                                                          width: 35,
                                                        },
                                                        dimensions.width
                                                      )}
                                                      thickness={2}
                                                      value={
                                                        Constants[
                                                          'CURRENT_DOWNLOAD_PERCENT'
                                                        ]
                                                      }
                                                    />
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Text'].props}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Text'].style,
                                                          {
                                                            color:
                                                              palettes.Brand
                                                                .Surface,
                                                            fontFamily:
                                                              'Rasa_500Medium',
                                                            fontSize: 16,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {
                                                        Constants[
                                                          'CURRENT_DOWNLOAD_PERCENT'
                                                        ]
                                                      }
                                                    </Text>
                                                  </View>
                                                )}
                                              </>
                                            </View>
                                          </Pressable>
                                        )}
                                      </>
                                      {/* Downloaded */}
                                      <>
                                        {!OfflineMode_isDownloaded(
                                          Variables,
                                          listData?.id
                                        ) ? null : (
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
                                              color={
                                                palettes.App[
                                                  'App Buttons Color'
                                                ]
                                              }
                                              name={'Ionicons/cloud-done'}
                                              size={26}
                                            />
                                          </View>
                                        )}
                                      </>
                                      <Checkbox
                                        onCheck={() => {
                                          const checkboxValue = undefined;
                                          try {
                                            if (isOnline) {
                                              showToastMessage(
                                                'Lesson added!',
                                                'Lesson added to your Notebook'
                                              );
                                            }
                                          } catch (err) {
                                            Sentry.captureException(err);
                                            console.error(err);
                                          }
                                        }}
                                        onPress={newCheckboxValue => {
                                          const handler = async () => {
                                            const checkboxValue =
                                              newCheckboxValue;
                                            try {
                                              const api_Response = (
                                                await xanoBackendUpdateFavoriteLessonsPOST.mutateAsync(
                                                  {
                                                    favorite:
                                                      !listData?.favorited,
                                                    lesson_id: listData?.id,
                                                  }
                                                )
                                              )?.json;
                                              if (
                                                api_Response?.status ===
                                                Constants[
                                                  'SUCCESS_API_RESPONSE'
                                                ]
                                              ) {
                                                await refetchGetLessons();
                                              }
                                            } catch (err) {
                                              Sentry.captureException(err);
                                              console.error(err);
                                            }
                                          };
                                          handler();
                                        }}
                                        onUncheck={() => {
                                          const checkboxValue = undefined;
                                          try {
                                            if (isOnline) {
                                              showToastMessage(
                                                'Lesson removed!',
                                                'Lesson removed from your Notebook'
                                              );
                                            }
                                          } catch (err) {
                                            Sentry.captureException(err);
                                            console.error(err);
                                          }
                                        }}
                                        checkedIcon={'AntDesign/star'}
                                        color={palettes.App['Custom Color_9']}
                                        defaultValue={isFavorited(listData?.id)}
                                        disabled={Boolean(!isOnline)}
                                        style={StyleSheet.applyWidth(
                                          { marginLeft: 10 },
                                          dimensions.width
                                        )}
                                        uncheckedColor={
                                          palettes.App['Custom Color']
                                        }
                                        uncheckedIcon={'AntDesign/staro'}
                                      />
                                    </View>
                                  )}
                                </>
                              </View>
                              {/* Locked */}
                              <>
                                {!(
                                  isSubscribed(Variables) === false &&
                                  listData?.subscription_required === true
                                ) ? null : (
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'stretch',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        height: '100%',
                                        justifyContent: 'space-between',
                                        left: 0,
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          alignItems: 'center',
                                          height: 55,
                                          marginTop: 20,
                                          paddingLeft:
                                            Constants['CONTENT_PADDING'],
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      <ExpoImage
                                        allowDownscaling={true}
                                        cachePolicy={'disk'}
                                        contentPosition={'center'}
                                        resizeMode={'cover'}
                                        transitionDuration={300}
                                        transitionEffect={'cross-dissolve'}
                                        transitionTiming={'ease-in-out'}
                                        {...GlobalStyles.ExpoImageStyles(theme)[
                                          'Image 21'
                                        ].props}
                                        source={imageSource(Images['Frame'])}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.ExpoImageStyles(theme)[
                                              'Image 21'
                                            ].style,
                                            { height: 32, width: 32 }
                                          ),
                                          dimensions.width
                                        )}
                                      />
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
                                              color:
                                                palettes.App['Custom Color_9'],
                                              fontFamily: 'Rasa_500Medium',
                                              fontSize: 15,
                                              textAlign: 'center',
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {'Upgrade'}
                                      </Text>
                                    </View>
                                  </View>
                                )}
                              </>
                            </View>
                          </Pressable>
                        );
                      }}
                      snapToAlignment={'start'}
                      scrollEnabled={false}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      style={StyleSheet.applyWidth(
                        { paddingBottom: 48 },
                        dimensions.width
                      )}
                    />
                  );
                }}
              </XanoBackendApi.FetchGetLessonsGET>
            )}
          </>
          {/* Fetch Lessons By Category */}
          <>
            {!(
              (params?.category_id ?? defaultPropsProp.category_id) !== null
            ) ? null : (
              <XanoBackendApi.FetchGetLessonsByCategoryGET
                category_id={
                  params?.category_id ?? defaultPropsProp.category_id
                }
              >
                {({ loading, error, data, refetchGetLessonsByCategory }) => {
                  const fetchLessonsByCategoryData = data?.json;
                  if (loading) {
                    return (
                      <View>
                        <Utils.CustomCodeErrorBoundary>
                          <ShimmerLessonList.Index />
                        </Utils.CustomCodeErrorBoundary>
                      </View>
                    );
                  }

                  if (error || data?.status < 200 || data?.status >= 300) {
                    return <ActivityIndicator />;
                  }

                  dataLengthRef.current =
                    fetchLessonsByCategoryData?.length ?? 0;
                  const nextLessonIdCategory = Constants['NEXT_LESSON_ID'];
                  scrollToIndexRef.current =
                    nextLessonIdCategory != null
                      ? fetchLessonsByCategoryData?.findIndex(
                          l => l?.id === nextLessonIdCategory
                        ) ?? -1
                      : -1;

                  return (
                    <SimpleStyleFlatList
                      data={fetchLessonsByCategoryData}
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
                        'Container->Scroll View->View->Fetch Lessons By Category->List'
                      }
                      nestedScrollEnabled={false}
                      numColumns={1}
                      onContentSizeChange={handleContentSizeChangeCategory}
                      onEndReachedThreshold={0.5}
                      pagingEnabled={false}
                      renderItem={({ item, index }) => {
                        const listData = item;
                        return (
                          <Pressable
                            onPress={() => {
                              const handler = async () => {
                                try {
                                  if (isSubscribed(Variables) === true) {
                                    navigation.navigate(
                                      'LessonDetailsScreen',
                                      { lesson_id: listData?.id },
                                      { pop: true }
                                    );
                                  } else {
                                    if (!listData?.subscription_required) {
                                      navigation.navigate(
                                        'LessonDetailsScreen',
                                        { lesson_id: listData?.id },
                                        { pop: true }
                                      );
                                    } else {
                                      if (navigation.canGoBack()) {
                                        navigation.popToTop();
                                      }
                                      navigation.replace('BottomTabNavigator', {
                                        screen: 'HomeStack',
                                        params: { screen: 'HomeScreen' },
                                      });
                                      await setGlobalVariableValue({
                                        key: 'VISIBLE_MODAL_PAYWALL',
                                        value: true,
                                      });
                                    }
                                  }
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              };
                              handler();
                            }}
                            activeOpacity={0.8}
                          >
                            {/* View 2 */}
                            <View>
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'stretch',
                                    borderBottomWidth: 1,
                                    borderColor: palettes.App.Outline,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    margin: 20,
                                    marginBottom: 0,
                                    paddingBottom: 12,
                                  },
                                  dimensions.width
                                )}
                              >
                                <View
                                  style={StyleSheet.applyWidth(
                                    { flex: 1 },
                                    dimensions.width
                                  )}
                                >
                                  {/* Details */}
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        flex: 1,
                                        flexDirection: 'row',
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          height: 55,
                                          width: 55,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {/* Image 2 */}
                                      <>
                                        {listData?.subscription_required ===
                                          true &&
                                        isSubscribed(Variables) ===
                                          false ? null : (
                                          <ExpoImage
                                            allowDownscaling={true}
                                            cachePolicy={'disk'}
                                            contentPosition={'center'}
                                            resizeMode={'cover'}
                                            transitionDuration={300}
                                            transitionEffect={'cross-dissolve'}
                                            transitionTiming={'ease-in-out'}
                                            {...GlobalStyles.ExpoImageStyles(
                                              theme
                                            )['Image 18'].props}
                                            source={imageSource(
                                              Images['NavyAppLogo']
                                            )}
                                            style={StyleSheet.applyWidth(
                                              StyleSheet.compose(
                                                GlobalStyles.ExpoImageStyles(
                                                  theme
                                                )['Image 18'].style,
                                                {
                                                  borderColor:
                                                    palettes.App[
                                                      'App Buttons Color'
                                                    ],
                                                  borderRadius: 8,
                                                  borderWidth: 1,
                                                  height: 55,
                                                  width: 55,
                                                }
                                              ),
                                              dimensions.width
                                            )}
                                          />
                                        )}
                                      </>
                                      {/* Checked */}
                                      <>
                                        {!listData?.completed ? null : (
                                          <View
                                            style={StyleSheet.applyWidth(
                                              {
                                                alignItems: 'center',
                                                backgroundColor:
                                                  palettes.App.Success,
                                                borderRadius: 6,
                                                justifyContent: 'center',
                                                left: 0,
                                                overflow: 'hidden',
                                                padding: 3,
                                                position: 'absolute',
                                                top: 0,
                                              },
                                              dimensions.width
                                            )}
                                          >
                                            <>
                                              {!listData?.completed ? null : (
                                                <Icon
                                                  color={palettes.App.White}
                                                  name={'FontAwesome/check'}
                                                  size={15}
                                                  style={StyleSheet.applyWidth(
                                                    { height: 15, width: 15 },
                                                    dimensions.width
                                                  )}
                                                />
                                              )}
                                            </>
                                          </View>
                                        )}
                                      </>
                                    </View>
                                    {/* Details */}
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          flex: 1,
                                          justifyContent: 'center',
                                          marginLeft: 10,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {/* Title */}
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
                                              color:
                                                Constants['APP_FONT_COLOR'],
                                              fontFamily: 'Rasa_600SemiBold',
                                              fontSize: 20,
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {listData?.title}
                                      </Text>
                                      {/* Sub-title */}
                                      <>
                                        {!listData?.sub_title ? null : (
                                          <Text
                                            accessible={true}
                                            selectable={false}
                                            {...GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].props}
                                            numberOfLines={1}
                                            style={StyleSheet.applyWidth(
                                              StyleSheet.compose(
                                                GlobalStyles.TextStyles(theme)[
                                                  'Text'
                                                ].style,
                                                {
                                                  color:
                                                    Constants['APP_FONT_COLOR'],
                                                  fontFamily: 'Rasa_300Light',
                                                  fontSize: 17,
                                                  marginTop: 4,
                                                }
                                              ),
                                              dimensions.width
                                            )}
                                          >
                                            {listData?.sub_title}
                                          </Text>
                                        )}
                                      </>
                                    </View>
                                  </View>
                                </View>
                                {/* Actions */}
                                <>
                                  {!(
                                    isSubscribed(Variables) === true
                                  ) ? null : (
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'flex-end',
                                          marginLeft: 10,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {/* DownloadButton */}
                                      <>
                                        {OfflineMode_isDownloaded(
                                          Variables,
                                          listData?.id
                                        ) ? null : (
                                          <Pressable
                                            onPress={() => {
                                              const handler = async () => {
                                                try {
                                                  setShowWaitDownloading(true);
                                                  setVisibleModalDownloadInfo(
                                                    true
                                                  );
                                                  await OfflineMode_downloadLesson(
                                                    Variables,
                                                    setGlobalVariableValue,
                                                    listData
                                                  );
                                                } catch (err) {
                                                  Sentry.captureException(err);
                                                  console.error(err);
                                                }
                                              };
                                              handler();
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
                                              <>
                                                {!(
                                                  listData?.id !==
                                                  Constants[
                                                    'CURRENT_DOWNLOAD_ID'
                                                  ]
                                                ) ? null : (
                                                  <Icon
                                                    size={24}
                                                    color={
                                                      palettes.App[
                                                        'App Buttons Color'
                                                      ]
                                                    }
                                                    name={
                                                      'Feather/download-cloud'
                                                    }
                                                  />
                                                )}
                                              </>
                                              {/* DownloadView */}
                                              <>
                                                {!(
                                                  listData?.id ===
                                                  Constants[
                                                    'CURRENT_DOWNLOAD_ID'
                                                  ]
                                                ) ? null : (
                                                  <View
                                                    style={StyleSheet.applyWidth(
                                                      {
                                                        alignItems: 'center',
                                                        justifyContent:
                                                          'center',
                                                      },
                                                      dimensions.width
                                                    )}
                                                  >
                                                    <CircularProgress
                                                      animationDuration={500}
                                                      color={
                                                        theme.colors.branding
                                                          .primary
                                                      }
                                                      indeterminate={false}
                                                      isAnimated={true}
                                                      lineCap={'round'}
                                                      showTrack={true}
                                                      startPosition={'top'}
                                                      trackColor={
                                                        theme.colors.border.base
                                                      }
                                                      trackLineCap={'round'}
                                                      maximumValue={10}
                                                      style={StyleSheet.applyWidth(
                                                        {
                                                          height: 35,
                                                          position: 'absolute',
                                                          width: 35,
                                                        },
                                                        dimensions.width
                                                      )}
                                                      thickness={2}
                                                      value={
                                                        Constants[
                                                          'CURRENT_DOWNLOAD_PERCENT'
                                                        ]
                                                      }
                                                    />
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Text'].props}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Text'].style,
                                                          {
                                                            color:
                                                              palettes.Brand
                                                                .Surface,
                                                            fontFamily:
                                                              'Rasa_500Medium',
                                                            fontSize: 16,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {
                                                        Constants[
                                                          'CURRENT_DOWNLOAD_PERCENT'
                                                        ]
                                                      }
                                                    </Text>
                                                  </View>
                                                )}
                                              </>
                                            </View>
                                          </Pressable>
                                        )}
                                      </>
                                      {/* Downloaded */}
                                      <>
                                        {!OfflineMode_isDownloaded(
                                          Variables,
                                          listData?.id
                                        ) ? null : (
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
                                              color={
                                                palettes.App[
                                                  'App Buttons Color'
                                                ]
                                              }
                                              name={'Ionicons/cloud-done'}
                                              size={26}
                                            />
                                          </View>
                                        )}
                                      </>
                                      <Checkbox
                                        onCheck={() => {
                                          const checkboxValue = undefined;
                                          try {
                                            if (isOnline) {
                                              showToastMessage(
                                                'Lesson added!',
                                                'Lesson added to your Notebook'
                                              );
                                            }
                                          } catch (err) {
                                            Sentry.captureException(err);
                                            console.error(err);
                                          }
                                        }}
                                        onPress={newCheckboxValue => {
                                          const handler = async () => {
                                            const checkboxValue =
                                              newCheckboxValue;
                                            try {
                                              const api_Response = (
                                                await xanoBackendUpdateFavoriteLessonsPOST.mutateAsync(
                                                  {
                                                    favorite:
                                                      !listData?.favorited,
                                                    lesson_id: listData?.id,
                                                  }
                                                )
                                              )?.json;
                                              if (
                                                api_Response?.status ===
                                                Constants[
                                                  'SUCCESS_API_RESPONSE'
                                                ]
                                              ) {
                                                await refetchGetLessonsByCategory();
                                              }
                                            } catch (err) {
                                              Sentry.captureException(err);
                                              console.error(err);
                                            }
                                          };
                                          handler();
                                        }}
                                        onUncheck={() => {
                                          const checkboxValue = undefined;
                                          try {
                                            if (isOnline) {
                                              showToastMessage(
                                                'Lesson removed!',
                                                'Lesson removed from your Notebook'
                                              );
                                            }
                                          } catch (err) {
                                            Sentry.captureException(err);
                                            console.error(err);
                                          }
                                        }}
                                        checkedIcon={'AntDesign/star'}
                                        color={palettes.App['Custom Color_9']}
                                        defaultValue={isFavorited(listData?.id)}
                                        disabled={Boolean(!isOnline)}
                                        style={StyleSheet.applyWidth(
                                          { marginLeft: 10 },
                                          dimensions.width
                                        )}
                                        uncheckedColor={
                                          palettes.App['Custom Color']
                                        }
                                        uncheckedIcon={'AntDesign/staro'}
                                      />
                                    </View>
                                  )}
                                </>
                              </View>
                              {/* Locked */}
                              <>
                                {!(
                                  isSubscribed(Variables) === false &&
                                  listData?.subscription_required === true
                                ) ? null : (
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'stretch',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        height: '100%',
                                        justifyContent: 'space-between',
                                        left: 0,
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          alignItems: 'center',
                                          height: 55,
                                          marginTop: 20,
                                          paddingLeft:
                                            Constants['CONTENT_PADDING'],
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      <ExpoImage
                                        allowDownscaling={true}
                                        cachePolicy={'disk'}
                                        contentPosition={'center'}
                                        resizeMode={'cover'}
                                        transitionDuration={300}
                                        transitionEffect={'cross-dissolve'}
                                        transitionTiming={'ease-in-out'}
                                        {...GlobalStyles.ExpoImageStyles(theme)[
                                          'Image 21'
                                        ].props}
                                        source={imageSource(Images['Frame'])}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.ExpoImageStyles(theme)[
                                              'Image 21'
                                            ].style,
                                            { height: 32, width: 32 }
                                          ),
                                          dimensions.width
                                        )}
                                      />
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
                                              color:
                                                palettes.App['Custom Color_9'],
                                              fontFamily: 'Rasa_500Medium',
                                              fontSize: 15,
                                              textAlign: 'center',
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {'Upgrade'}
                                      </Text>
                                    </View>
                                  </View>
                                )}
                              </>
                            </View>
                          </Pressable>
                        );
                      }}
                      snapToAlignment={'start'}
                      scrollEnabled={false}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      style={StyleSheet.applyWidth(
                        { paddingBottom: 48 },
                        dimensions.width
                      )}
                    />
                  );
                }}
              </XanoBackendApi.FetchGetLessonsByCategoryGET>
            )}
          </>
        </View>
      </SimpleStyleScrollView>
    );
  }
);

Index.displayName = 'CustomLessonsList';

export { Index };
