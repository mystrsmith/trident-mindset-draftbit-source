import React from 'react';
import { Icon, Pressable, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Platform, StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as AdvanceVideoPlayer from '../custom-files/AdvanceVideoPlayer';
import * as CustomCode from '../custom-files/CustomCode';
import * as LiquidGaugeBubblesProgress from '../custom-files/LiquidGaugeBubblesProgress';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { item: {} };

const AdvanceProgramCompleteStep1Screen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      setIsLoading(false);
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  }, [isFocused]);

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
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        <Utils.CustomCodeErrorBoundary>
          <AdvanceVideoPlayer.Index isFocused={isFocused} />
        </Utils.CustomCodeErrorBoundary>
        {/* Container */}
        <View
          style={StyleSheet.applyWidth(
            { flex: 1, paddingBottom: 50, paddingTop: 20 },
            dimensions.width
          )}
        >
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
                  height: null,
                  justifyContent: 'space-between',
                  paddingLeft: 15,
                  paddingRight: 15,
                }
              ),
              dimensions.width
            )}
          >
            {/* Blank View */}
            <View
              style={StyleSheet.applyWidth(
                { height: 20, width: 20 },
                dimensions.width
              )}
            />
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
              {'Onward'}
            </Text>
            {/* Blank View 2 */}
            <View
              style={StyleSheet.applyWidth(
                { height: 20, width: 20 },
                dimensions.width
              )}
            />
          </View>

          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between',
                marginTop: 10,
              },
              dimensions.width
            )}
          >
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
              {"Mastery isn't achieved. It is maintained."}
            </Text>
            {/* Progress Bar */}
            <View style={StyleSheet.applyWidth({ gap: 20 }, dimensions.width)}>
              <Utils.CustomCodeErrorBoundary>
                <LiquidGaugeBubblesProgress.Index
                  height={380}
                  width={80}
                  currentProgress={
                    (props.route?.params?.item ?? defaultProps.item)
                      ?.completed_day_points || 0
                  }
                  maxValue={
                    (props.route?.params?.item ?? defaultProps.item)
                      ?.total_day_points || 100
                  }
                />
              </Utils.CustomCodeErrorBoundary>
              {/* Number of Points */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.App.White,
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 24,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {(params?.item ?? defaultProps.item)?.completed_day_points}
                {' points'}
              </Text>
            </View>
            {/* Bottom Description */}
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
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {
                'Something is always better than nothing.\n Being consistently good is better than being occasionally great.'
              }
            </Text>
            {/* Bottom */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  gap: 30,
                  justifyContent: 'center',
                  paddingLeft: 20,
                  paddingRight: 20,
                },
                dimensions.width
              )}
            >
              <Pressable
                onPress={() => {
                  try {
                    if (navigation.canGoBack()) {
                      navigation.popToTop();
                    }
                    navigation.replace('AdvanceProgramCompleteStep2Screen', {
                      pointsItem: params?.item ?? defaultProps.item,
                    });
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      backgroundColor: palettes.Brand['Red 1'],
                      borderRadius: 100,
                      height: 44,
                      justifyContent: 'center',
                      paddingBottom: 8,
                      paddingLeft: 32,
                      paddingRight: 32,
                      paddingTop: 8,
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
                          color: palettes.App.White,
                          fontFamily: 'Rasa_600SemiBold',
                          fontSize: 20,
                          paddingTop: 2,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Next'}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(AdvanceProgramCompleteStep1Screen);
