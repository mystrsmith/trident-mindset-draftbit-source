import palettes from '../themes/palettes';
import React, { forwardRef } from 'react';
import * as GlobalStyles from '../GlobalStyles.js';
import Images from '../config/Images';
import * as StyleSheet from '../utils/StyleSheet';
import { Button, ScreenContainer, SwiperItem } from '@draftbit/ui';
import Swiper from 'react-native-swiper';
import { Image, Text, View } from 'react-native';
import useWindowDimensions from '../utils/useWindowDimensions';

const Index = forwardRef((props, ref) => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  return (
    <Swiper
      ref={ref}
      dotColor={theme.colors.text.light}
      // dotsTouchable={true}
      // timeout={0}
      // {...GlobalStyles.SwiperStyles(theme)['Swiper'].props}
      // dotActiveColor={palettes.App['App Buttons Color']}
      // loop={false}
      // minDistanceForAction={0.2}
      // minDistanceToCapture={5}
      // style={StyleSheet.applyWidth(
      //     StyleSheet.compose(
      //     GlobalStyles.SwiperStyles(theme)['Swiper'].style,
      //     { flex: 1 }
      //     ),
      //     dimensions.width
      // )}
      vertical={false}
    >
      {/* Slide 1 */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
            padding: 32,
          },
          dimensions.width
        )}
      >
        {/* Content View */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flex: 1,
              gap: 24,
              justifyContent: 'center',
            },
            dimensions.width
          )}
        >
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 1 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {
              'Trident Mindset teaches 12 proven strategies for improving your mental toughness and mental health.'
            }
          </Text>
          {/* Image 2 */}
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 2 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {'All 12 strategies will help you achieve your goals.'}
          </Text>
          {/* Image 3 */}
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 3 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {
              'Based on your goals, we’ve customized the order in which you will learn the 12 strategies.'
            }
          </Text>
        </View>
      </View>
      {/* Slide 2 */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
            padding: 32,
          },
          dimensions.width
        )}
      >
        {/* Content View */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flex: 1,
              gap: 24,
              justifyContent: 'center',
            },
            dimensions.width
          )}
        >
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              GlobalStyles.ImageStyles(theme)['Image'].style,
              dimensions.width
            )}
          />
          {/* Paragraph 1 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {
              'Each strategy is taught through daily lessons, practice exercises, and check-ins.'
            }
          </Text>
        </View>
      </View>
      {/* Slide 3 */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
            padding: 32,
          },
          dimensions.width
        )}
      >
        {/* Content View */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flex: 1,
              gap: 40,
              justifyContent: 'center',
            },
            dimensions.width
          )}
        >
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 1 */}
          <View style={StyleSheet.applyWidth({ gap: 6 }, dimensions.width)}>
            {/* Paragraph 1.1 */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand['Surface'],
                    fontFamily: 'DMSans_700Bold',
                    fontSize: 20,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Step 1: Complete the Mindset 101 Course'}
            </Text>
            {/* Paragraph 1.2 */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand['Surface'],
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Each lesson introduces you to 1 of the 12 strategies.'}
            </Text>
          </View>
          {/* Image 2 */}
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 2 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {
              'We introduce you to all 12 strategies right away so you can immediately begin applying all of them to your life and experience their benefits.'
            }
          </Text>
        </View>
      </View>
      {/* Slide 4 */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
            padding: 32,
          },
          dimensions.width
        )}
      >
        {/* Content View */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flex: 1,
              gap: 24,
              justifyContent: 'center',
            },
            dimensions.width
          )}
        >
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 1 */}
          <View style={StyleSheet.applyWidth({ gap: 6 }, dimensions.width)}>
            {/* Paragraph 1.1 */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand['Surface'],
                    fontFamily: 'DMSans_700Bold',
                    fontSize: 20,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Step 2: Master each strategy'}
            </Text>
            {/* Paragraph 1.2 */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand['Surface'],
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Spend about a month learning each strategy in detail.'}
            </Text>
          </View>
          {/* Image 2 */}
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 2 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {'Each day’s lesson teaches you something new about the strategy.'}
          </Text>
          {/* Image 3 */}
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ImageStyles(theme)['Image'].style,
                { height: 80, width: 80 }
              ),
              dimensions.width
            )}
          />
          {/* Paragraph 3 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {
              'Practicing each strategy for a month allows your brain to turn the strategy into a lasting habit.'
            }
          </Text>
        </View>
      </View>
      {/* Slide 5 */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
            padding: 32,
          },
          dimensions.width
        )}
      >
        {/* Content View */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flex: 1,
              gap: 24,
              justifyContent: 'center',
            },
            dimensions.width
          )}
        >
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              GlobalStyles.ImageStyles(theme)['Image'].style,
              dimensions.width
            )}
          />
          {/* Paragraph 1 */}
          <View style={StyleSheet.applyWidth({ gap: 6 }, dimensions.width)}>
            {/* Paragraph 1.1 */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand['Surface'],
                    fontSize: 14,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Try to complete one lesson per day.'}
            </Text>
            {/* Paragraph 1.2 */}
            <Text
              accessible={true}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand['Surface'],
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {
                'The key to optimal improvement is consistent daily practice rather than sporadic bursts of practice.'
              }
            </Text>
          </View>
          {/* Image 2 */}
          <Image
            {...GlobalStyles.ImageStyles(theme)['Image'].props}
            resizeMode={'contain'}
            source={Images.IcBrain}
            style={StyleSheet.applyWidth(
              GlobalStyles.ImageStyles(theme)['Image'].style,
              dimensions.width
            )}
          />
          {/* Paragraph 2 */}
          <Text
            accessible={true}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand['Surface'],
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {'Enter the Mindset 101 course to begin your journey.'}
          </Text>
        </View>
      </View>
    </Swiper>
  );
});

export { Index };
