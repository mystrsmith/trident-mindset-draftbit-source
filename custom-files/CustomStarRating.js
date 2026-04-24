import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Icon } from '@draftbit/ui';

const STAR_COUNT = 5;
const STAR_SIZE = 36;
const STAR_GAP = 4;

const FILLED_COLOR = '#FFC107';
const EMPTY_COLOR = '#E0E0E0';

export const Index = ({ theme, feedbackStarRating, setFeedbackStarRating }) => {
  const rating = feedbackStarRating ?? 0;

  const handlePress = value => {
    if (typeof setFeedbackStarRating === 'function') {
      setFeedbackStarRating(value);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: STAR_COUNT }, (_, i) => {
        const value = i + 1;
        const isFilled = value <= rating;
        return (
          <Pressable
            key={i}
            onPress={() => handlePress(value)}
            style={styles.starWrapper}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${value} star${value === 1 ? '' : 's'}`}
            accessibilityState={{ selected: isFilled }}
          >
            <Icon
              name={isFilled ? 'Ionicons/star' : 'Ionicons/star-outline'}
              size={STAR_SIZE}
              color={isFilled ? FILLED_COLOR : EMPTY_COLOR}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starWrapper: {
    padding: 4,
    marginHorizontal: STAR_GAP / 2,
  },
});
