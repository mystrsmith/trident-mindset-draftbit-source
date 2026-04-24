import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated';

function Index() {
  const cards = Array.from({ length: 12 }, (_, index) => {
    return {
      angle: useSharedValue(0),
      radius: 12 * 20, // Adjust the radius of the circle
      delay: index * 100, // Delay each card's animation
      spacingAngle: 30 * index, // Adjust spacing between cards
    };
  });

  useEffect(() => {
    cards.forEach((card, index) => {
      card.angle.value = withTiming(1500, {
        duration: 100000,
        easing: Easing.linear,
        delay: card.delay,
        loop: true,
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            {
              translateX:
                Math.cos(
                  ((card.angle.value + card.spacingAngle) * Math.PI) / 180
                ) * card.radius,
            },
            {
              translateY:
                Math.sin(
                  ((card.angle.value + card.spacingAngle) * Math.PI) / 180
                ) * card.radius,
            },
            // { rotate: `${card.angle.value}deg` },
          ],
        }));

        return (
          <Animated.View key={index} style={[styles.card, animatedStyle]} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  card: {
    width: 80,
    height: 120,
    backgroundColor: 'rgba(124, 172, 211, 0.7)',
    borderRadius: 8,
    position: 'absolute',
  },
});

export { Index };
