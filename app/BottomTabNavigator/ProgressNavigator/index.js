import React from 'react';
import {
  LinearGradient,
  Link,
  ScreenContainer,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, Modal, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import DashboardInfoBlock from '../../../components/DashboardInfoBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as AdvanceProgramChart from '../../../custom-files/AdvanceProgramChart';
import * as CustomBlurView from '../../../custom-files/CustomBlurView';
import * as CustomCode from '../../../custom-files/CustomCode';
import * as LineChart from '../../../custom-files/LineChart';
import * as Pyramid from '../../../custom-files/Pyramid';
import palettes from '../../../themes/palettes';
import * as Utils from '../../../utils';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const ProgressScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
  const [advanceProgramsMetric, setAdvanceProgramsMetric] =
    React.useState(null);
  const [emotionalMetrics, setEmotionalMetrics] = React.useState(null);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        const resultEmotionalMetrics = (
          await XanoBackendApi.getEmotionalMetricsGET(Constants)
        )?.json;
        setEmotionalMetrics(resultEmotionalMetrics);
        const resultAdvanceProgramsMetric = (
          await XanoBackendApi.getAdvanceProgramsMetricGET(Constants)
        )?.json;
        setAdvanceProgramsMetric(resultAdvanceProgramsMetric);
        console.log(resultEmotionalMetrics);
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
    <ScreenContainer hasSafeArea={false} scrollable={false}>
      <LinearGradient
        endX={100}
        endY={100}
        startX={0}
        startY={0}
        {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].props}
        color1={palettes.App.Black_Alpha_80}
        color2={palettes.App['Background 90 Opacity']}
        color3={palettes.App.Black_Alpha_80}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
            { height: '100%', width: '100%' }
          ),
          dimensions.width
        )}
      >
        {/* Container */}
        <View
          style={StyleSheet.applyWidth(
            {
              flex: 1,
              paddingBottom: safeAreaInsets.bottom,
              paddingTop: safeAreaInsets.top,
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
                justifyContent: 'center',
                paddingBottom: 10,
                paddingTop: 10,
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
                    fontSize: 30,
                    paddingTop: 5,
                  }
                ),
                dimensions.width
              )}
            >
              {'Trident'}
            </Text>
            <Image
              {...GlobalStyles.ImageStyles(theme)['Image'].props}
              resizeMode={'contain'}
              source={imageSource(Images['IcBrain'])}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.ImageStyles(theme)['Image'].style,
                  { height: 45, marginLeft: 12, marginRight: 12, width: 45 }
                ),
                dimensions.width
              )}
            />
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
                    fontFamily: 'Rasa_500Medium',
                    fontSize: 30,
                    paddingTop: 5,
                  }
                ),
                dimensions.width
              )}
            >
              {'Mindset'}
            </Text>
          </View>

          <SimpleStyleScrollView
            bounces={true}
            horizontal={false}
            keyboardShouldPersistTaps={'never'}
            nestedScrollEnabled={false}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            style={StyleSheet.applyWidth(
              { flex: 1, paddingBottom: 120 },
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
              color1={palettes.App['Progress Card Gradient 1']}
              color2={palettes.App['Progress Card Gradient 2']}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                    .style,
                  {
                    borderRadius: 20,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 10,
                  }
                ),
                dimensions.width
              )}
            >
              {/* Card */}
              <View
                style={StyleSheet.applyWidth(
                  { borderRadius: 20, paddingTop: 20 },
                  dimensions.width
                )}
              >
                <Utils.CustomCodeErrorBoundary>
                  <Pyramid.Index />
                </Utils.CustomCodeErrorBoundary>
              </View>
            </LinearGradient>
            {/* Dashboard Section */}
            <View
              style={StyleSheet.applyWidth(
                { marginLeft: 20, marginRight: 20, marginTop: 20 },
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
                color1={palettes.App['Progress Card Gradient 1']}
                color2={palettes.App['Progress Card Gradient 2']}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                      .style,
                    { borderRadius: 20, marginTop: 10 }
                  ),
                  dimensions.width
                )}
              >
                {/* Card */}
                <View
                  style={StyleSheet.applyWidth(
                    { borderRadius: 20 },
                    dimensions.width
                  )}
                >
                  <DashboardInfoBlock />
                </View>
              </LinearGradient>
            </View>
            {/* Happiness Section */}
            <View
              style={StyleSheet.applyWidth(
                { marginLeft: 20, marginRight: 20, marginTop: 20 },
                dimensions.width
              )}
            >
              {/* Happiness */}
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
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Happiness'}
              </Text>

              <LinearGradient
                endX={100}
                endY={100}
                startX={0}
                startY={0}
                {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                  .props}
                color1={palettes.App['Progress Card Gradient 1']}
                color2={palettes.App['Progress Card Gradient 2']}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                      .style,
                    { borderRadius: 20, marginTop: 10 }
                  ),
                  dimensions.width
                )}
              >
                {/* Card */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      borderRadius: 20,
                      paddingBottom: 20,
                      paddingLeft: 20,
                      paddingRight: 20,
                      position: 'relative',
                    },
                    dimensions.width
                  )}
                >
                  <Utils.CustomCodeErrorBoundary>
                    <LineChart.Index
                      inputData={emotionalMetrics?.map(item => ({
                        created_at: item?.created_at,
                        rating: item?.happiness_rating,
                      }))}
                    />
                  </Utils.CustomCodeErrorBoundary>
                  {/* BlurView */}
                  <>
                    {!(emotionalMetrics?.length === 0) ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            borderRadius: 20,
                            bottom: 0,
                            left: 0,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                          },
                          dimensions.width
                        )}
                      >
                        <Utils.CustomCodeErrorBoundary>
                          <CustomBlurView.Index>
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  flex: 1,
                                  justifyContent: 'center',
                                  paddingLeft: 16,
                                  paddingRight: 16,
                                },
                                dimensions.width
                              )}
                            >
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
                                      fontFamily: 'Rasa_400Regular',
                                      fontSize: 18,
                                      textAlign: 'center',
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {
                                  'These charts use the data from your Nightly Intentionality Check-Ins (accessible on the More page). Click '
                                }
                                <Link
                                  accessible={true}
                                  onPress={() => {
                                    try {
                                      navigation.navigate(
                                        'NightlyIntentionalityCheckInScreen',
                                        {}
                                      );
                                    } catch (err) {
                                      Sentry.captureException(err);
                                      console.error(err);
                                    }
                                  }}
                                  selectable={false}
                                  {...GlobalStyles.LinkStyles(theme)['Link']
                                    .props}
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.LinkStyles(theme)['Link']
                                        .style,
                                      {
                                        color: theme.colors.branding.secondary,
                                        fontFamily: 'Rasa_400Regular_Italic',
                                        fontSize: 18,
                                        textAlign: 'center',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                  title={'here '}
                                />
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
                                        fontFamily: 'Rasa_400Regular',
                                        fontSize: 18,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {'to complete your check-in.'}
                                </Text>
                              </Text>
                            </View>
                          </CustomBlurView.Index>
                        </Utils.CustomCodeErrorBoundary>
                      </View>
                    )}
                  </>
                </View>
              </LinearGradient>
            </View>
            {/* Stress Section */}
            <View
              style={StyleSheet.applyWidth(
                { marginLeft: 20, marginRight: 20, marginTop: 50 },
                dimensions.width
              )}
            >
              {/* Stress */}
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
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Stress'}
              </Text>

              <LinearGradient
                endX={100}
                endY={100}
                startX={0}
                startY={0}
                {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                  .props}
                color1={palettes.App['Progress Card Gradient 1']}
                color2={palettes.App['Progress Card Gradient 2']}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
                      .style,
                    { borderRadius: 20, marginTop: 10 }
                  ),
                  dimensions.width
                )}
              >
                {/* Card */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      borderRadius: 20,
                      paddingBottom: 20,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 20,
                    },
                    dimensions.width
                  )}
                >
                  <Utils.CustomCodeErrorBoundary>
                    <LineChart.Index
                      inputData={emotionalMetrics?.map(item => ({
                        created_at: item?.created_at,
                        rating: item?.stress_rating,
                      }))}
                    />
                  </Utils.CustomCodeErrorBoundary>
                  {/* BlurView */}
                  <>
                    {!(emotionalMetrics?.length === 0) ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            borderRadius: 20,
                            bottom: 0,
                            left: 0,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                          },
                          dimensions.width
                        )}
                      >
                        <Utils.CustomCodeErrorBoundary>
                          <CustomBlurView.Index>
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  flex: 1,
                                  justifyContent: 'center',
                                  paddingLeft: 16,
                                  paddingRight: 16,
                                },
                                dimensions.width
                              )}
                            >
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
                                      fontFamily: 'Rasa_400Regular',
                                      fontSize: 18,
                                      textAlign: 'center',
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {
                                  'These charts use the data from your Nightly Intentionality Check-Ins (accessible on the More page). Click '
                                }
                                <Link
                                  accessible={true}
                                  onPress={() => {
                                    try {
                                      navigation.navigate(
                                        'NightlyIntentionalityCheckInScreen',
                                        {}
                                      );
                                    } catch (err) {
                                      Sentry.captureException(err);
                                      console.error(err);
                                    }
                                  }}
                                  selectable={false}
                                  {...GlobalStyles.LinkStyles(theme)['Link']
                                    .props}
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.LinkStyles(theme)['Link']
                                        .style,
                                      {
                                        color: theme.colors.branding.secondary,
                                        fontFamily: 'Rasa_400Regular_Italic',
                                        fontSize: 18,
                                        textAlign: 'center',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                  title={'here '}
                                />
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
                                        fontFamily: 'Rasa_400Regular',
                                        fontSize: 18,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {'to complete your check-in.'}
                                </Text>
                              </Text>
                            </View>
                          </CustomBlurView.Index>
                        </Utils.CustomCodeErrorBoundary>
                      </View>
                    )}
                  </>
                </View>
              </LinearGradient>
            </View>
          </SimpleStyleScrollView>
        </View>
      </LinearGradient>
    </ScreenContainer>
  );
};

export default withTheme(ProgressScreen);
