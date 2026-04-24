import React from 'react';
import {
  Button,
  LinearGradient,
  LinearProgress,
  ScreenContainer,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CoinReveal from '../custom-files/CoinReveal';
import * as CustomCode from '../custom-files/CustomCode';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { dailyTrackers: null, lessonDetailResponse: null };

const CompleteLessonStep1Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
  const forceSmallestCoinPercentage = percentage => {
    if (isNaN(percentage)) {
      return 0.01;
    }
    if (percentage === 0) {
      return 0.01;
    }
    return percentage;
  };
  const [linearProgressPercentage, setLinearProgressPercentage] =
    React.useState(0);
  const [percentage, setPercentage] = React.useState(
    forceSmallestCoinPercentage(
      ((params?.lessonDetailResponse ?? defaultProps.lessonDetailResponse)
        ?.completed_count *
        100) /
        (params?.lessonDetailResponse ?? defaultProps.lessonDetailResponse)
          ?.total_tactics_count
    )
  );
  React.useEffect(() => {
    setTimeout(() => {
      setLinearProgressPercentage(percentage);
    }, 2000);
  }, [percentage]);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        const resultLessonDetail = (
          await XanoBackendApi.getLessonDetailsGET(Constants, {
            lesson_id: null?.current_lesson?.id,
          })
        )?.json;
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
          {/* Completed State */}
          <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
            {/* Header */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', flex: 0.2, justifyContent: 'center' },
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
                {'Onward!'}
              </Text>
            </View>
            {/* Center */}
            <View
              style={StyleSheet.applyWidth(
                { flex: 1, justifyContent: 'space-evenly' },
                dimensions.width
              )}
            >
              {/* Coin Wrapper */}
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center' },
                  dimensions.width
                )}
              >
                <Utils.CustomCodeErrorBoundary>
                  <CoinReveal.Index
                    {...{
                      initialPercentage: forceSmallestCoinPercentage(
                        (Math.max(
                          0,
                          (
                            props.route?.params?.lessonDetailResponse ??
                            defaultProps.lessonDetailResponse
                          )?.completed_count - 1
                        ) *
                          100) /
                          (
                            props.route?.params?.lessonDetailResponse ??
                            defaultProps.lessonDetailResponse
                          )?.total_tactics_count ?? 0
                      ),
                      percentage,
                      size: 250,
                      imageUrl:
                        props.route?.params?.lessonDetailResponse
                          ?.current_lesson?.tactic?.portrait_image?.url ?? '',
                    }}
                  />
                </Utils.CustomCodeErrorBoundary>
              </View>
              {/* Horizontal Progress Wrapper */}
              <View
                style={StyleSheet.applyWidth(
                  { flexDirection: 'column' },
                  dimensions.width
                )}
              >
                {/* Row */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    },
                    dimensions.width
                  )}
                >
                  {/* Col */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: 2,
                        justifyContent: 'center',
                      },
                      dimensions.width
                    )}
                  >
                    {/* Completed Count Text */}
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
                            fontSize: 25,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        (
                          params?.lessonDetailResponse ??
                          defaultProps.lessonDetailResponse
                        )?.completed_count
                      }
                      {'/'}
                      {
                        (
                          params?.lessonDetailResponse ??
                          defaultProps.lessonDetailResponse
                        )?.total_tactics_count
                      }
                    </Text>
                    {/* Total Text */}
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
                            fontSize: 15,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'lessons completed'}
                    </Text>
                  </View>
                  <LinearProgress
                    trackColor={theme.colors.border.base}
                    animationDuration={1000}
                    color={palettes.App['True Blue']}
                    indeterminate={false}
                    isAnimated={true}
                    lineCap={'round'}
                    maximumValue={100}
                    minimumValue={0}
                    showTrack={true}
                    style={StyleSheet.applyWidth(
                      { width: '60%' },
                      dimensions.width
                    )}
                    thickness={25}
                    trackLineCap={'round'}
                    trackThickness={25}
                    value={linearProgressPercentage}
                  />
                </View>
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
                      fontFamily: 'Rasa_500Medium',
                      fontSize: 18,
                      lineHeight: 25,
                      marginTop: 25,
                      paddingLeft: 25,
                      paddingRight: 25,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Finish all the lessons to earn your '}
                {
                  (
                    params?.lessonDetailResponse ??
                    defaultProps.lessonDetailResponse
                  )?.current_lesson?.tactic?.title
                }
                {' challenge coin!'}
              </Text>
            </View>
            {/* Bottom */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', flex: 0.2, justifyContent: 'center' },
                dimensions.width
              )}
            >
              {/* Continue */}
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  try {
                    navigation.navigate('CompleteLessonStep2Screen', {
                      dailyTrackers:
                        params?.dailyTrackers ?? defaultProps.dailyTrackers,
                      lessonDetailResponse:
                        params?.lessonDetailResponse ??
                        defaultProps.lessonDetailResponse,
                    });
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
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
          </View>
        </LinearGradient>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(CompleteLessonStep1Screen);
