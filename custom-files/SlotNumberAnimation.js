import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export const Index = ({ oldPoints = 30, newPoints = 40 }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      progress.value = withTiming(1, { duration: 1000 }); // Animation starts after 2s delay
    }, 1000);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [0, 80]), // Old number slides out further downward
        },
      ],
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    };
  });

  const newPointsStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [-80, 0]), // New number slides in from a higher position
        },
      ],
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.number, animatedStyle]}>
        {oldPoints}
      </Animated.Text>
      <Animated.Text style={[styles.number, newPointsStyle]}>
        {newPoints}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 72,
    fontWeight: 'bold',
    position: 'absolute',
    color: '#D21404FF',
  },
});
