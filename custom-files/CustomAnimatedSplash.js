import * as React from 'react';
import {
  View,
  Animated,
  StatusBar,
  StyleSheet,
  Easing,
  Dimensions,
} from 'react-native';

const Index = ({
  isLoaded = false,
  children,
  preload,
  logoImage,
  logoWidth,
  logoHeight,
  backgroundColor,
  imageBackgroundSource,
  imageBackgroundResizeMode,
  translucent,
  customComponent,
}) => {
  const [animationDone, setAnimationDone] = React.useState(false);
  const loadingProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isLoaded) {
      Animated.sequence([
        Animated.timing(loadingProgress, {
          toValue: 50,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(loadingProgress, {
          toValue: 100,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]).start(() => {
        setAnimationDone(true);
      });
    }
  }, [isLoaded, loadingProgress]);

  const renderChildren = () => {
    if (preload || preload == null) {
      return children;
    } else {
      if (isLoaded) {
        return children;
      }
    }
    return null;
  };

  const opacityClearToVisible = {
    opacity: loadingProgress.interpolate({
      inputRange: [0, 15, 30],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    }),
  };

  const imageScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 10, 100],
          outputRange: [1, 1, 65],
        }),
      },
    ],
  };

  const logoScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 25, 50, 100],
          outputRange: [1, 1.25, 1, 2.6],
        }),
      },
    ],
  };

  const logoOpacity = {
    opacity: loadingProgress.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    }),
  };

  const appScale = {
    transform: [
      {
        scale: loadingProgress.interpolate({
          inputRange: [0, 7, 100],
          outputRange: [1, 1, 1],
        }),
      },
    ],
  };

  return (
    <View style={[styles.container]}>
      <StatusBar
        backgroundColor={backgroundColor || null}
        animated
        translucent={translucent}
      />
      {!animationDone && <View style={StyleSheet.absoluteFill} />}
      <View style={styles.containerGlue}>
        {!animationDone && (
          <Animated.View
            style={_solidBackground(logoOpacity, backgroundColor)}
          />
        )}
        <Animated.View style={[appScale, opacityClearToVisible, styles.flex]}>
          {renderChildren()}
        </Animated.View>
        {!animationDone && (
          <Animated.Image
            resizeMode={imageBackgroundResizeMode || 'cover'}
            source={imageBackgroundSource}
            style={_dynamicImageBackground(
              imageScale,
              logoOpacity,
              backgroundColor
            )}
          />
        )}
        {!animationDone && (
          <View style={[StyleSheet.absoluteFill, styles.logoStyle]}>
            {customComponent ? (
              <Animated.View
                style={_dynamicCustomComponentStyle(
                  logoScale,
                  logoOpacity,
                  logoWidth,
                  logoHeight
                )}
              >
                {customComponent}
              </Animated.View>
            ) : (
              <Animated.Image
                source={require('../assets/images/IcBrain.png')}
                resizeMode={'contain'}
                style={_dynamicLogoStyle(
                  logoScale,
                  logoOpacity,
                  logoWidth,
                  logoHeight
                )}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('screen');

const _solidBackground = (logoOpacity, backgroundColor) => [
  logoOpacity,
  StyleSheet.absoluteFill,
  { backgroundColor: backgroundColor || null },
];

const _dynamicImageBackground = (imageScale, logoOpacity, backgroundColor) => [
  imageScale,
  logoOpacity,
  {
    ...StyleSheet.absoluteFill,
    width,
    height,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: backgroundColor || null,
  },
];

const _dynamicLogoStyle = (logoScale, logoOpacity, logoWidth, logoHeight) => [
  logoScale,
  logoOpacity,
  {
    width: logoWidth || 150,
    height: logoHeight || 150,
  },
];

const _dynamicCustomComponentStyle = (
  logoScale,
  logoOpacity,
  logoWidth,
  logoHeight
) => [
  logoScale,
  logoOpacity,
  {
    width: logoWidth || 150,
    height: logoHeight || 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerGlue: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  logoStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Index };
