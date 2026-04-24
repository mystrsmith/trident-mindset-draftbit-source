import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CARD_DISPLAY_DURATION = 4000; // 4s
const SLIDE_DURATION = 600;
const FADE_OUT_DURATION = 600;

const Marquee = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(screenWidth)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateCard = () => {
    translateX.setValue(screenWidth);
    opacity.setValue(0);

    Animated.sequence([
      // Slide in from right & fade in
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: SLIDE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: SLIDE_DURATION,
          useNativeDriver: true,
        }),
      ]),
      // Display duration
      Animated.delay(CARD_DISPLAY_DURATION),
      // Slide out to left & fade out
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -screenWidth,
          duration: SLIDE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: FADE_OUT_DURATION,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    });
  };

  useEffect(() => {
    animateCard();
  }, [currentIndex]);

  const currentItem = items[currentIndex];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX }],
            opacity,
          },
        ]}
      >
        <View style={{ alignItems: 'flex-end' }}>
          {/* <Image
            source={require("../assets/images/double-quotes.png")}
            style={styles.quoteIcon}
          /> */}
        </View>
        <Text style={styles.text} numberOfLines={5}>
          "{currentItem.text}"
        </Text>
        <Text style={styles.author}>{currentItem.author}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    height: 200,
  },
  card: {
    width: screenWidth - 40,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  quoteIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  text: {
    color: '#FFF',
    fontFamily: 'Rasa_600SemiBold',
    textAlign: 'center',
    fontSize: 24,
    paddingTop: 5,
    lineHeight: 38,
  },
  author: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    fontSize: 16,
  },
});

export { Marquee };
