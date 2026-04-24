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
import * as CircleShimmer from './CircleShimmer';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

// Shimmer effect constants
const SHIMMER_COLORS = {
  gradientColors: [
    'rgba(255,255,255,0.02)',
    'rgba(255,255,255,0.15)',
    'rgba(255,255,255,0.02)',
  ],
  backgroundColor: 'rgba(255,255,255,0.12)',
  borderColor: 'rgba(255,255,255,0.1)',
};

const ShimmerItem = () => {
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
    <View style={styles.itemContainer}>
      <View style={styles.contentWrapper}>
        {/* Thumbnail placeholder */}
        <View style={styles.thumbnail}>
          <Animated.View style={[StyleSheet.absoluteFill, animatedStyles]}>
            <LinearGradient
              colors={SHIMMER_COLORS.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        {/* Content placeholders */}
        <View style={styles.textContent}>
          {/* Title placeholder */}
          <View style={styles.titlePlaceholder}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyles]}>
              <LinearGradient
                colors={SHIMMER_COLORS.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>

          {/* Subtitle placeholder */}
          <View style={styles.subtitlePlaceholder}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyles]}>
              <LinearGradient
                colors={SHIMMER_COLORS.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>

        {/* Action buttons placeholder */}
        <View style={styles.actionsContainer}>
          <CircleShimmer.Index size={32} style={styles.actionButtonSpacing} />
          <CircleShimmer.Index size={32} style={styles.actionButtonSpacing} />
        </View>
      </View>
    </View>
  );
};

const Index = () => {
  return (
    <View style={styles.container}>
      <ShimmerItem />
      <ShimmerItem />
      <ShimmerItem />
      <ShimmerItem />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  itemContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: SHIMMER_COLORS.borderColor,
    paddingBottom: 12,
  },
  contentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 55,
    height: 55,
    borderRadius: 8,
    backgroundColor: SHIMMER_COLORS.backgroundColor,
    overflow: 'hidden',
  },
  textContent: {
    flex: 1,
    marginLeft: 10,
  },
  titlePlaceholder: {
    height: 24,
    width: '80%',
    backgroundColor: SHIMMER_COLORS.backgroundColor,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  subtitlePlaceholder: {
    height: 18,
    width: '60%',
    backgroundColor: SHIMMER_COLORS.backgroundColor,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonSpacing: {
    marginLeft: 8,
  },
});

export { Index };
