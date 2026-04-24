import palettes from '../themes/palettes';
import React from 'react';
import { Image } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import SubscriptionPricingSectionBlock from '../components/SubscriptionPricingSectionBlock';
import * as UpgradeSnapCarousel from '../custom-files/UpgradeSnapCarousel';
import isSubscribed from '../global-functions/isSubscribed';
import * as Utils from '../utils';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';
import {
  AccordionGroup,
  StarRating,
  Swiper,
  SwiperItem,
  withTheme,
} from '@draftbit/ui';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
  Dimensions,
} from 'react-native';
import * as GlobalVariables from '../config/GlobalVariableContext';
// import { Stagger } from '@animatereactnative/stagger';
import {
  FadeIn,
  FadeInDown,
  FadeOutDown,
  ZoomInEasyDown,
  ZoomInRight,
} from 'react-native-reanimated';
import Images from '../config/Images';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

export const Index = ({
  isFetchingOfferings,
  availablePackages,
  selectedPackage,
  theme,
  isLoadingSubscription,
  onPressPackageItem,
  onPressPurchase,
}) => {
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  // const [showAnimation, setShowAnimation] = React.useState(false);

  const items = [
    'Control your emotions and responses',
    'Forge discipline',
    'Reduce stress and anxiousness',
    'Cultivate lasting happiness',
    'Improve concentration',
    'Be more present',
    'Quiet racing thoughts',
    'Thrive during challenges',
    'Conquer negative thinking',
    'Live more intentionally',
    'Be calm under pressure',
  ];

  // const onMomentumScrollEnd = event => {
  //   const currentIndex = parseInt(
  //     event.nativeEvent.contentOffset.y /
  //       (Dimensions.get('window').height - 300)
  //   );
  //   if (currentIndex === 1 && showAnimation === false) {
  //     setShowAnimation(true);
  //   }
  // };

  return (
    <ScrollView
      // bounces={true}
      horizontal={false}
      keyboardShouldPersistTaps={'never'}
      nestedScrollEnabled={false}
      showsHorizontalScrollIndicator={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      // snapToInterval={SCREEN_HEIGHT - 100}
      // snapToAlignment={'start'}
      // onMomentumScrollEnd={e => onMomentumScrollEnd(e)}
      // scrollEventThrottle={5}
    >
      {/* Testimonial 1 */}
      <View
        style={
          {
            // height: SCREEN_HEIGHT - 100,
          }
        }
      >
        {/* Testimonials */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              overflow: 'hidden',
            },
            dimensions.width
          )}
        >
          <XanoBackendApi.FetchReviewsGET>
            {({ loading, error, data, refetchReviews }) => {
              const fetchData = data?.json;
              if (loading) {
                return <ActivityIndicator />;
              }

              if (error || data?.status < 200 || data?.status >= 300) {
                return <ActivityIndicator />;
              }

              return (
                <Swiper
                  data={fetchData}
                  keyExtractor={(swiperData, index) =>
                    swiperData?.id ?? swiperData?.uuid ?? index.toString()
                  }
                  listKey={'njLHTwvk'}
                  minDistanceForAction={0.2}
                  minDistanceToCapture={5}
                  renderItem={({ item, index }) => {
                    const swiperData = item;
                    return (
                      <SwiperItem
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            backgroundColor: theme.colors.background.brand,
                            borderRadius: 16,
                            height: 350,
                            justifyContent: 'center',
                            marginLeft: 20,
                            marginRight: 20,
                            padding: 30,
                          },
                          dimensions.width
                        )}
                      >
                        {/* View 2 */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                            dimensions.width
                          )}
                        >
                          <StarRating
                            isEditable={false}
                            maxStars={5}
                            activeColor={palettes.App['Custom Color_9']}
                            inactiveColor={palettes.App['Custom Color_9']}
                            rating={isLoadingSubscription}
                            starSize={40}
                          />
                          <Text
                            accessible={true}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: palettes.App['Custom Color'],
                                  fontFamily: 'Poppins_400Regular',
                                  fontSize: 17,
                                  marginTop: 25,
                                  textAlign: 'center',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {swiperData?.content}
                          </Text>
                          {/* Text 2 */}
                          <Text
                            accessible={true}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: palettes.App['Custom Color'],
                                  fontFamily: 'Poppins_700Bold',
                                  fontSize: 20,
                                  marginTop: 10,
                                  textAlign: 'center',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {swiperData?.author}
                          </Text>
                        </View>
                      </SwiperItem>
                    );
                  }}
                  vertical={false}
                  {...GlobalStyles.SwiperStyles(theme)['Swiper'].props}
                  dotActiveColor={theme.colors.branding.secondary}
                  dotColor={theme.colors.text.medium}
                  dotsTouchable={false}
                  loop={true}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.SwiperStyles(theme)['Swiper'].style,
                      { alignSelf: 'center', height: 350 }
                    ),
                    dimensions.width
                  )}
                  timeout={5}
                />
              );
            }}
          </XanoBackendApi.FetchReviewsGET>
        </View>
        {/* Loading */}
        <>
          {!isFetchingOfferings ? null : (
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', justifyContent: 'center' },
                dimensions.width
              )}
            >
              <ActivityIndicator
                animating={true}
                hidesWhenStopped={true}
                size={'small'}
                {...GlobalStyles.ActivityIndicatorStyles(theme)[
                  'Activity Indicator'
                ].props}
                color={palettes.Brand['Surface']}
                style={StyleSheet.applyWidth(
                  GlobalStyles.ActivityIndicatorStyles(theme)[
                    'Activity Indicator'
                  ].style,
                  dimensions.width
                )}
              />
            </View>
          )}
        </>
        <>
          {!(
            isFetchingOfferings === false && isSubscribed(Variables) === false
          ) ? null : (
            <SubscriptionPricingSectionBlock
              availablePackages={availablePackages}
              onPressPackage={targetPackage =>
                onPressPackageItem(targetPackage)
              }
              onPressPurchase={() => onPressPurchase()}
              selectedPackage={selectedPackage}
            />
          )}
        </>
      </View>
      {/* New Section */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 35,
        }}
      >
        <Text
          accessible={true}
          {...GlobalStyles.TextStyles(theme)['Text'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
              color: Constants['APP_FONT_COLOR'],
              fontSize: 20,
              marginBottom: 12,
              textAlign: 'center',
            }),
            dimensions.width
          )}
        >
          {'Trident Mindset can help you'}
        </Text>
        {items.map((item, index) => (
          <RoundedCard key={index} text={item} theme={theme} />
        ))}
      </View>
      {/* Upgrade Info */}
      <View
        style={
          {
            // height: SCREEN_HEIGHT - 100,
          }
        }
      >
        <XanoBackendApi.FetchGetUpgradeInfoGET>
          {({ loading, error, data, refetchGetUpgradeInfo }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
              <Utils.CustomCodeErrorBoundary>
                <UpgradeSnapCarousel.Index upgradeInfo={fetchData} />
              </Utils.CustomCodeErrorBoundary>
            );
          }}
        </XanoBackendApi.FetchGetUpgradeInfoGET>
      </View>
      {/* Testimonial 2 */}
      <View
        style={{
          marginTop: 35,
          // height: SCREEN_HEIGHT - 100,
        }}
      >
        {/* Testimonials */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              overflow: 'hidden',
            },
            dimensions.width
          )}
        >
          <XanoBackendApi.FetchReviewsGET>
            {({ loading, error, data, refetchReviews }) => {
              const fetchData = data?.json;
              if (loading) {
                return <ActivityIndicator />;
              }

              if (error || data?.status < 200 || data?.status >= 300) {
                return <ActivityIndicator />;
              }

              return (
                <Swiper
                  data={fetchData}
                  keyExtractor={(swiperData, index) =>
                    swiperData?.id ?? swiperData?.uuid ?? index.toString()
                  }
                  listKey={'9vu7PpeT'}
                  minDistanceForAction={0.2}
                  minDistanceToCapture={5}
                  renderItem={({ item, index }) => {
                    const swiperData = item;
                    return (
                      <SwiperItem
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            backgroundColor: theme.colors.background.brand,
                            borderRadius: 16,
                            height: 350,
                            justifyContent: 'center',
                            marginLeft: 20,
                            marginRight: 20,
                            padding: 30,
                          },
                          dimensions.width
                        )}
                      >
                        {/* View 2 */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                            dimensions.width
                          )}
                        >
                          <StarRating
                            isEditable={false}
                            maxStars={5}
                            activeColor={palettes.App['Custom Color_9']}
                            inactiveColor={palettes.App['Custom Color_9']}
                            rating={isLoadingSubscription}
                            starSize={40}
                          />
                          <Text
                            accessible={true}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: palettes.App['Custom Color'],
                                  fontFamily: 'Poppins_400Regular',
                                  fontSize: 17,
                                  marginTop: 25,
                                  textAlign: 'center',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {swiperData?.content}
                          </Text>
                          {/* Text 2 */}
                          <Text
                            accessible={true}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: palettes.App['Custom Color'],
                                  fontFamily: 'Poppins_700Bold',
                                  fontSize: 20,
                                  marginTop: 10,
                                  textAlign: 'center',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {swiperData?.author}
                          </Text>
                        </View>
                      </SwiperItem>
                    );
                  }}
                  vertical={false}
                  {...GlobalStyles.SwiperStyles(theme)['Swiper'].props}
                  dotActiveColor={theme.colors.branding.secondary}
                  dotColor={theme.colors.text.medium}
                  dotsTouchable={false}
                  loop={true}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.SwiperStyles(theme)['Swiper'].style,
                      { alignSelf: 'center', height: 350 }
                    ),
                    dimensions.width
                  )}
                  timeout={5}
                />
              );
            }}
          </XanoBackendApi.FetchReviewsGET>
        </View>
        {/* Loading */}
        <>
          {!isFetchingOfferings ? null : (
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', justifyContent: 'center' },
                dimensions.width
              )}
            >
              <ActivityIndicator
                animating={true}
                hidesWhenStopped={true}
                size={'small'}
                {...GlobalStyles.ActivityIndicatorStyles(theme)[
                  'Activity Indicator'
                ].props}
                color={palettes.Brand['Surface']}
                style={StyleSheet.applyWidth(
                  GlobalStyles.ActivityIndicatorStyles(theme)[
                    'Activity Indicator'
                  ].style,
                  dimensions.width
                )}
              />
            </View>
          )}
        </>
        <>
          {!(
            isFetchingOfferings === false && isSubscribed(Variables) === false
          ) ? null : (
            <SubscriptionPricingSectionBlock
              availablePackages={availablePackages}
              onPressPackage={targetPackage =>
                onPressPackageItem(targetPackage)
              }
              onPressPurchase={() => onPressPurchase()}
              selectedPackage={selectedPackage}
            />
          )}
        </>
      </View>
      {/* FAQ */}
      <View
        style={{
          marginTop: 35,
          // height: SCREEN_HEIGHT - 100,
        }}
      >
        <Text
          accessible={true}
          {...GlobalStyles.TextStyles(theme)['Text'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
              color: Constants['APP_FONT_COLOR'],
              fontSize: 20,
              marginBottom: 12,
              textAlign: 'center',
            }),
            dimensions.width
          )}
        >
          {'Frequently Asked Questions'}
        </Text>

        <XanoBackendApi.FetchFAQsGET>
          {({ loading, error, data, refetchFAQs }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
              <FlatList
                data={fetchData}
                horizontal={false}
                inverted={false}
                keyExtractor={(listData, index) =>
                  listData?.id ?? listData?.uuid ?? index.toString()
                }
                keyboardShouldPersistTaps={'never'}
                listKey={'d5l1F0vy'}
                nestedScrollEnabled={false}
                numColumns={1}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{
                  paddingHorizontal: 20,
                }}
                renderItem={({ item, index }) => {
                  const listData = item;
                  return (
                    <AccordionGroup
                      caretSize={24}
                      expanded={false}
                      iconSize={24}
                      label={'Beautiful West Coast Villa'}
                      {...GlobalStyles.AccordionGroupStyles(theme)['Accordion']
                        .props}
                      caretColor={palettes.App['Custom Color']}
                      closedColor={palettes.App['Custom Color']}
                      icon={''}
                      label={listData?.title}
                      openColor={palettes.App['Custom Color']}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.AccordionGroupStyles(theme)['Accordion']
                            .style,
                          {
                            backgroundColor: palettes.App['App Buttons Color'],
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRadius: 6,
                            color: palettes.App['Custom Color'],
                            fontFamily: 'Inter_600SemiBold',
                            marginTop: 10,
                            paddingLeft: 12,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            backgroundColor: palettes.App['App Buttons Color'],
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                            marginBottom: 10,
                            padding: 12,
                          },
                          dimensions.width
                        )}
                      >
                        <Text
                          accessible={true}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.App['Custom Color'],
                                fontFamily: 'Poppins_400Regular',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {listData?.description}
                        </Text>
                      </View>
                    </AccordionGroup>
                  );
                }}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
              />
            );
          }}
        </XanoBackendApi.FetchFAQsGET>
      </View>
    </ScrollView>
  );
};

const RoundedCard = ({ text, theme }) => {
  const dimensions = useWindowDimensions();
  return (
    <View
      style={StyleSheet.applyWidth(
        {
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: 30,
        },
        dimensions.width
      )}
    >
      <View
        style={{
          width: 35,
          height: 35,
        }}
      >
        <Image
          resizeMode={'contain'}
          source={Images.IcBrain}
          style={{
            width: 35,
            height: 35,
          }}
        />
      </View>
      <Text
        style={{
          fontFamily: 'Poppins_600SemiBold',
          color: 'white',
          marginTop: 5,
          marginHorizontal: 7,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
