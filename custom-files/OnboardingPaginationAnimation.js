import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Images from '../config/Images';
import palettes from '../themes/palettes';
import useNavigation from '../utils/useNavigation';
import * as GlobalVariables from '../config/GlobalVariableContext';
import logEvent from '../global-functions/logEvent';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';

const GLOW_LAYERS = [
  { opacityFactor: 0.12, scaleFactor: 0.9 },
  { opacityFactor: 0.08, scaleFactor: 1.1 },
  { opacityFactor: 0.05, scaleFactor: 1.3 },
  { opacityFactor: 0.025, scaleFactor: 1.5 },
  { opacityFactor: 0.01, scaleFactor: 1.7 },
];

const AndroidGlowLayer = React.memo(
  ({ shadowOpacity, logoScale, opacityFactor, scaleFactor }) => {
    const style = useAnimatedStyle(() => {
      'worklet';
      return {
        opacity: shadowOpacity.value * opacityFactor,
        transform: [{ scale: logoScale.value * scaleFactor }],
      };
    });
    return <Animated.View style={[styles.androidGlowLayer, style]} />;
  }
);

const Index = () => {
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const cardScale = useSharedValue(0.8);
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const itemWidth = SCREEN_WIDTH - 40;
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const subtextOpacity = useSharedValue(0);
  const subtextTranslateY = useSharedValue(20);
  const clockImageOpacity = useSharedValue(0);
  const clockImageTranslateY = useSharedValue(0);
  const tildeImageOpacity = useSharedValue(0);
  const tildeImageTranslateY = useSharedValue(0);
  const logoScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(1.0);

  const handleStartFirstLesson = async () => {
    setIsLoading(true);
    try {
      const firstLesson = await XanoBackendApi.getFirstLessonOfMindset101GET(
        Constants,
        {
          anonymous_id: Constants['ANONYMOUS_ID'],
        }
      );
      const firstLessonItem = firstLesson?.json;
      setGlobalVariableValue({
        key: 'ONBOARDING_FIRST_LESSON',
        value: firstLessonItem,
      });
      navigation.navigate('OnboardingPlayerScreen');
    } finally {
      setIsLoading(false);
    }
    return;
  };

  useEffect(() => {
    rotation.value = 0;
    rotation.value = withTiming(2 * Math.PI, { duration: 2000 });

    logoScale.value = 0.4;
    shadowOpacity.value = 1.0;
    titleOpacity.value = 0;
    titleTranslateY.value = -20;
    contentOpacity.value = 0;
    contentTranslateY.value = -20;
    subtextOpacity.value = 0;
    subtextTranslateY.value = -20;
    clockImageOpacity.value = 0;
    clockImageTranslateY.value = -20;
    tildeImageOpacity.value = 0;
    tildeImageTranslateY.value = -20;

    logoScale.value = withTiming(0.4, { duration: 300 });
    setTimeout(() => {
      logoScale.value = withTiming(1.2, { duration: 400 });
    }, 300);
    setTimeout(() => {
      logoScale.value = withTiming(1.0, { duration: 300 });
    }, 700);
    setTimeout(() => {
      shadowOpacity.value = withTiming(0.2, { duration: 400 });
    }, 700);

    titleOpacity.value = withTiming(1, { duration: 850, delay: 800 });
    titleTranslateY.value = withTiming(0, { duration: 850, delay: 800 });

    contentOpacity.value = withTiming(1, { duration: 850, delay: 1200 });
    contentTranslateY.value = withTiming(0, { duration: 850, delay: 1200 });

    subtextOpacity.value = withTiming(1, { duration: 850, delay: 1600 });
    subtextTranslateY.value = withTiming(0, { duration: 850, delay: 1600 });

    clockImageOpacity.value = withTiming(1, { duration: 850, delay: 1200 });
    clockImageTranslateY.value = withTiming(0, { duration: 850, delay: 1200 });

    tildeImageOpacity.value = withTiming(1, { duration: 850, delay: 1600 });
    tildeImageTranslateY.value = withTiming(0, { duration: 850, delay: 1600 });
  }, [currentIndex]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    cardScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    cardOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    titleOpacity.value = withTiming(1, { duration: 3000, delay: 5000 });
    contentOpacity.value = withTiming(1, { duration: 3000, delay: 6000 });
    subtextOpacity.value = withTiming(1, { duration: 3000, delay: 7000 });
    clockImageOpacity.value = withTiming(1, { duration: 3000, delay: 6000 });
    tildeImageOpacity.value = withTiming(1, { duration: 3000, delay: 7000 });
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: logoScale.value }],
      opacity: opacity.value,
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTranslateY.value }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: contentOpacity.value,
      transform: [{ translateY: contentTranslateY.value }],
    };
  });

  const animatedSubtextStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: subtextOpacity.value,
      transform: [{ translateY: subtextTranslateY.value }],
    };
  });

  const animatedClockImageStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: clockImageOpacity.value,
      transform: [{ translateY: clockImageTranslateY.value }],
    };
  });

  const animatedTildeImageStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: tildeImageOpacity.value,
      transform: [{ translateY: tildeImageTranslateY.value }],
    };
  });

  const slideData = [
    {
      title: 'Step One',
      content:
        'Complete the Mindset 101 Course - an introduction to the 12 tactics',
    },
    {
      title: 'Step Two',
      content:
        'Spend about a month mastering each tactic through daily lessons and practice exercises',
      subContent: '',
    },
    {
      title: 'Tips for Optimal Results',
      content:
        'Do one lesson per day: Consistent daily practice - not binging - leads to lasting results.',
      subContent:
        'Follow your personalized order: Complete the lessons in the order they appear in the app.',
    },
  ];

  const renderSlide = ({ item, index }) => {
    return (
      <View style={[styles.slideContainer, { width: SCREEN_WIDTH }]}>
        <View style={styles.cardGradient}>
          {!IS_IOS ? (
            <View style={styles.androidGlowContainer}>
              {GLOW_LAYERS.map((layer, i) => (
                <AndroidGlowLayer
                  key={i}
                  shadowOpacity={shadowOpacity}
                  logoScale={logoScale}
                  opacityFactor={layer.opacityFactor}
                  scaleFactor={layer.scaleFactor}
                />
              ))}
              <Animated.View style={[styles.logoShadowIos, animatedImageStyle]}>
                <Image
                  source={Images.IcBrain}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>
          ) : (
            <Animated.View style={[styles.logoShadowIos, animatedImageStyle]}>
              <Image
                source={Images.IcBrain}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </Animated.View>
          )}

          <Animated.Text style={[styles.titleText, animatedTitleStyle]}>
            {item.title}
          </Animated.Text>

          <View style={styles.rowContainer}>
            {index === 2 && (
              <Animated.Image
                source={Images['clockicon']}
                style={[styles.additionalImage, animatedClockImageStyle]}
                resizeMode="contain"
              />
            )}
            <Animated.Text
              style={[
                styles.contentText,
                index === 2 ? styles.contentTextLeft : styles.contentTextCenter,
                animatedContentStyle,
              ]}
            >
              {item.content}
            </Animated.Text>
          </View>
          <View style={styles.rowContainer}>
            {index === 2 && (
              <Animated.Image
                source={Images['tilde']}
                style={[styles.additionalImage, animatedTildeImageStyle]}
                resizeMode="contain"
              />
            )}
            {item.subContent ? (
              <Animated.Text
                style={[
                  styles.contentText,
                  index === 2
                    ? styles.contentTextLeft
                    : styles.contentTextCenter,
                  animatedSubtextStyle,
                ]}
              >
                {item.subContent}
              </Animated.Text>
            ) : null}
          </View>

          {index === 2 && (
            <Pressable
              onPress={() => {
                try {
                  handleStartFirstLesson();
                } catch (err) {}
              }}
              style={[styles.ctaButton, isLoading && styles.ctaButtonDisabled]}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.ctaButtonText}>
                    Start Your First Mindset 101 Lesson
                  </Text>
                </View>
              ) : (
                <Text style={styles.ctaButtonText}>
                  Start Your First Mindset 101 Lesson
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);
      logEvent(`post_onboarding_slide_${newIndex + 1}`, null);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const getItemLayout = useCallback(
    (_, index) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slideData}
        renderItem={renderSlide}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
      />

      <View style={styles.paginationContainer}>
        {slideData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardGradient: {
    width: '100%',
    marginBottom: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logoShadowIos: {
    ...Platform.select({
      ios: {
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1.0,
        shadowRadius: 35,
      },
      android: {},
    }),
  },
  logoImage: {
    height: 120,
    width: 120,
    marginBottom: 20,
  },
  additionalImage: {
    height: 30,
    width: 30,
  },
  titleText: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Rasa_700Bold',
    textAlign: 'center',
    width: '100%',
  },
  contentText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Rasa_400Regular',
    width: '100%',
    lineHeight: 24,
  },
  contentTextCenter: {
    textAlign: 'center',
  },
  contentTextLeft: {
    textAlign: 'left',
  },
  rowContainer: {
    gap: 15,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'center',
    width: '100%',
  },
  ctaButton: {
    backgroundColor: palettes.App['True Blue'],
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
  },
  ctaButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Rasa_700Bold',
  },
  ctaButtonDisabled: {
    backgroundColor: palettes.App['True Blue'] + '80',
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    gap: 8,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
  androidGlowContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
  },
  androidGlowLayer: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 1.0)',
    top: 10,
    left: 10,
  },
});

export { Index };
