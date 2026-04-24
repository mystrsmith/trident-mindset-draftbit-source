import React from 'react';
import {
  Icon,
  Pressable,
  ScreenContainer,
  WebView,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = {
  URL: 'https://draftbit.com/',
  screenHeading: 'Trident Mindset',
};

const WebPagesScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const isFocused = useIsFocused();

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
      hasTopSafeArea={true}
    >
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* Header */}
        <View
          {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
              { justifyContent: 'space-between', paddingRight: 48 }
            ),
            dimensions.width
          )}
        >
          {/* Back */}
          <Pressable
            onPress={() => {
              try {
                navigation.goBack();
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
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
              <Icon
                size={24}
                color={palettes.App['Custom Color']}
                name={'Ionicons/chevron-back'}
              />
            </View>
          </Pressable>

          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                {
                  color: Constants['APP_FONT_COLOR'],
                  flex: 1,
                  fontFamily: 'Rasa_500Medium',
                  fontSize: 25,
                  textAlign: 'center',
                }
              ),
              dimensions.width
            )}
          >
            {params?.screenHeading ?? defaultProps.screenHeading}
          </Text>
        </View>
        {/* Main View */}
        <View
          style={StyleSheet.applyWidth(
            { flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <WebView
            allowFileAccessFromFileURLs={false}
            allowUniversalAccessFromFileURLs={false}
            cacheEnabled={true}
            incognito={false}
            javaScriptCanOpenWindowsAutomatically={false}
            javaScriptEnabled={true}
            mediaPlaybackRequiresUserAction={false}
            showsHorizontalScrollIndicator={true}
            startInLoadingState={false}
            {...GlobalStyles.WebViewStyles(theme)['Web View'].props}
            showsVerticalScrollIndicator={false}
            source={imageSource(`${params?.URL ?? defaultProps.URL}`)}
            style={StyleSheet.applyWidth(
              GlobalStyles.WebViewStyles(theme)['Web View'].style,
              dimensions.width
            )}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(WebPagesScreen);
