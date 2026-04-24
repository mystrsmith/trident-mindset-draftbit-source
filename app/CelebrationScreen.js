import React from 'react';
import { LinearGradient, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as CelebrationAnimation from '../custom-files/CelebrationAnimation';
import * as CustomCode from '../custom-files/CustomCode';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const CelebrationScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const safeAreaInsets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    const entry = StatusBar.pushStackEntry?.({ barStyle: 'light-content' });
    return () => StatusBar.popStackEntry?.(entry);
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
          <Utils.CustomCodeErrorBoundary>
            <CelebrationAnimation.Index theme={theme} isFocused={isFocused} />
          </Utils.CustomCodeErrorBoundary>
        </LinearGradient>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(CelebrationScreen);
