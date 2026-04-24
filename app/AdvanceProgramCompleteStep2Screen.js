import React from 'react';
import { Pressable, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Platform, StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as AdvanceVideoPlayer from '../custom-files/AdvanceVideoPlayer';
import * as CustomCode from '../custom-files/CustomCode';
import * as SlotNumberAnimation from '../custom-files/SlotNumberAnimation';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { pointsItem: null };

const AdvanceProgramCompleteStep2Screen = props => {
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
              {'Keep Going'}
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
              { flex: 1, justifyContent: 'space-between', marginTop: 10 },
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
              {'Genius is often just persistence in disguise'}
            </Text>

            <View
              style={StyleSheet.applyWidth(
                {
                  flexDirection: 'column',
                  gap: 25,
                  marginLeft: 60,
                  marginRight: 60,
                  padding: 25,
                  paddingBottom: 35,
                },
                dimensions.width
              )}
            >
              <Utils.CustomCodeErrorBoundary>
                <SlotNumberAnimation.Index
                  oldPoints={
                    (props.route?.params?.pointsItem ?? defaultProps.pointsItem)
                      ?.before_week_points
                  }
                  newPoints={
                    (props.route?.params?.pointsItem ?? defaultProps.pointsItem)
                      ?.after_week_points
                  }
                />
              </Utils.CustomCodeErrorBoundary>
              {/* Points This Week */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.App.White,
                      fontFamily: 'Rasa_500Medium',
                      fontSize: 18,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Points this week'}
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
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Even the sharpest blade gets dull\nEarn your trident everyday'}
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
                    navigation.replace('BottomTabNavigator', {
                      screen: 'AdvanceNavigator',
                      params: { screen: '' },
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
                      paddingLeft: 40,
                      paddingRight: 40,
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
                    {'Onward'}
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

export default withTheme(AdvanceProgramCompleteStep2Screen);
