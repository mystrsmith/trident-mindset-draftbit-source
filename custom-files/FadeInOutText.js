import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const DURATION = 1200;

const Index = ({ label, duration = DURATION, delay = 0 }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const animationCompleted = useSharedValue(false);

  useEffect(() => {
    const startAnimations = () => {
      // Fade in and scale up
      opacity.value = withTiming(1, {
        duration: duration,
        easing: Easing.linear,
      });
      scale.value = withTiming(1.2, {
        duration: duration,
        easing: Easing.linear,
      });

      // Start fade out and scale down after the animation duration
      const timer = setTimeout(() => {
        opacity.value = withTiming(
          0,
          {
            duration: duration,
            easing: Easing.linear,
          },
          () => {
            animationCompleted.value = true;
          }
        );

        scale.value = withTiming(
          1,
          {
            duration: duration,
            easing: Easing.linear,
          },
          () => {
            animationCompleted.value = true;
          }
        );
      }, duration * 2);

      return () => clearTimeout(timer);
    };

    const delayTimer = setTimeout(startAnimations, delay);

    return () => clearTimeout(delayTimer);
  }, [opacity, scale, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    position: 'absolute',
  },
  text: {
    fontFamily: 'Rasa_700Bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 35,
  },
});

export { Index };
