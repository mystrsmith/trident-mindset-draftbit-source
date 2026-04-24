import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: wWidth, height: wHeight } = Dimensions.get('window');

const snapPoint = (value, velocity, width) => {
  'worklet';
  const points = [-width, 0, width];
  const point = value + 0.2 * velocity;
  const deltas = points.map(p => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter(p => Math.abs(point - p) === minDelta)[0];
};

const ASPECT_RATIO = 722 / 368;
const CARD_WIDTH = Math.round(wWidth * 0.58);
const CARD_HEIGHT = Math.round(CARD_WIDTH * ASPECT_RATIO);
const BORDER_RADIUS = Math.round(CARD_WIDTH * 0.09);
const BORDER_WIDTH = Math.round(CARD_WIDTH * 0.028);
const TITLE_FONT_SIZE = Math.round(CARD_WIDTH * 0.07);
const DURATION = 160;
const DROP_DISTANCE = -(wHeight + CARD_HEIGHT);

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
  mass: 0.8,
  reduceMotion: ReduceMotion.Never,
};

const ROTATE_X_STATIC = '30deg';

const Card = React.memo(
  ({ tactic, shuffleBack, index, totalCount, zIndex: zIndexProp = 0 }) => {
    const title = tactic?.title ?? '';
    const photoUrl = tactic?.portrait_image?.url;
    const offset = useSharedValue({ x: 0, y: 0 });
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(DROP_DISTANCE);
    const opacity = useSharedValue(0);
    const scale = useSharedValue(1);
    const rotateZ = useSharedValue(0);
    const theta = useMemo(() => -12 + (index % 5) * 6, [index]);
    const delay = (totalCount - 1 - index) * DURATION;

    useEffect(() => {
      opacity.value = withDelay(delay, withTiming(1, { duration: 0 }));
      translateY.value = withDelay(
        delay,
        withTiming(0, { duration: DURATION, easing: Easing.inOut(Easing.ease) })
      );
      rotateZ.value = withDelay(delay, withSpring(theta, SPRING_CONFIG));
    }, [delay, theta]);

    useAnimatedReaction(
      () => shuffleBack.value,
      v => {
        if (v) {
          const duration = 150 * (totalCount - 1 - index);
          translateX.value = withDelay(
            duration,
            withSpring(0, SPRING_CONFIG, finished => {
              if (finished) {
                shuffleBack.value = false;
              }
            })
          );
          rotateZ.value = withDelay(duration, withSpring(theta, SPRING_CONFIG));
        }
      }
    );

    const gesture = useMemo(
      () =>
        Gesture.Pan()
          .onBegin(() => {
            offset.value = { x: translateX.value, y: translateY.value };
            rotateZ.value = withTiming(0);
            scale.value = withTiming(1.1);
          })
          .onUpdate(({ translationX, translationY }) => {
            translateX.value = offset.value.x + translationX;
            translateY.value = offset.value.y + translationY;
          })
          .onEnd(({ velocityX, velocityY }) => {
            const dest = snapPoint(translateX.value, velocityX, wWidth);
            translateX.value = withSpring(dest, {
              velocity: velocityX,
              ...SPRING_CONFIG,
            });
            translateY.value = withSpring(0, {
              velocity: velocityY,
              ...SPRING_CONFIG,
            });
            scale.value = withTiming(1, {}, finished => {
              if (finished) {
                const isLastCardInDeck = index === totalCount - 1;
                const isSwipedLeftOrRight = dest !== 0;
                if (isLastCardInDeck && isSwipedLeftOrRight) {
                  shuffleBack.value = true;
                }
              }
            });
          }),
      [index, totalCount]
    );

    const style = useAnimatedStyle(() => {
      'worklet';
      const rz = rotateZ.value;
      return {
        opacity: opacity.value,
        transform: [
          { perspective: 1500 },
          { rotateX: ROTATE_X_STATIC },
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotateY: rz / 10 + 'deg' },
          { rotateZ: rz + 'deg' },
          { scale: scale.value },
        ],
      };
    });

    const containerStyle = useMemo(
      () => [styles.container, { zIndex: zIndexProp }],
      [zIndexProp]
    );

    return (
      <View style={containerStyle} pointerEvents="box-none">
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.cardWrapper, style]}
            renderToHardwareTextureAndroid
          >
            <View style={styles.card}>
              {photoUrl ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.cardImage}
                  contentFit="cover"
                  recyclingKey={photoUrl}
                />
              ) : null}
              <View style={styles.titleWrapper}>
                <Text style={styles.titleText} numberOfLines={2}>
                  {(title || '').toUpperCase()}
                </Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  stackContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    overflow: 'hidden',
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
        borderWidth: BORDER_WIDTH + 1,
      },
    }),
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  titleWrapper: {
    paddingVertical: Math.round(CARD_WIDTH * 0.028),
    paddingHorizontal: Math.round(CARD_WIDTH * 0.042),
    borderWidth: 2,
    borderColor: 'black',
    position: 'absolute',
    bottom: Math.round(CARD_WIDTH * 0.07),
    left: Math.round(CARD_WIDTH * 0.035),
    right: Math.round(CARD_WIDTH * 0.035),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: TITLE_FONT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const Index = ({ tactics }) => {
  if (!tactics || tactics.length === 0) {
    return null;
  }
  const shuffleBack = useSharedValue(false);
  const totalCount = tactics.length;
  const cardsToRender = useMemo(
    () =>
      tactics.map((tactic, index) => ({
        tactic,
        index,
        zIndex: totalCount - index,
      })),
    [tactics, totalCount]
  );

  return (
    <View style={styles.stackContainer} pointerEvents="box-none">
      {cardsToRender.map(({ tactic, index, zIndex }) => (
        <Card
          tactic={tactic}
          key={tactic?.id ?? index}
          index={index}
          totalCount={totalCount}
          shuffleBack={shuffleBack}
          zIndex={zIndex}
        />
      ))}
    </View>
  );
};

export { Card, Index };
