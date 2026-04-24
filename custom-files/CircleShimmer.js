import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

// Shimmer effect constants
const SHIMMER_COLORS = {
  gradientColors: [
    'rgba(255,255,255,0.02)',
    'rgba(255,255,255,0.15)',
    'rgba(255,255,255,0.02)',
  ],
  backgroundColor: 'rgba(255,255,255,0.12)',
};

const Index = ({ size = 32, style }) => {
  const shimmerValue = useSharedValue(-1);

  React.useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(shimmerValue.value, [-1, 1], [-350, 350]),
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyles]}>
        <LinearGradient
          colors={SHIMMER_COLORS.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: SHIMMER_COLORS.backgroundColor,
    overflow: 'hidden',
  },
});

export { Index };
