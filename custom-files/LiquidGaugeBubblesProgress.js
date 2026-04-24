import React, { useEffect } from 'react';
import {
  Canvas,
  Rect,
  Circle,
  Group,
  Skia,
  useFont,
  Text,
  vec,
  Path,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const Index = ({
  width = 80,
  height = 380,
  currentProgress = 0,
  maxValue = 100,
}) => {
  const radius = width * 0.5;
  const fontSize = radius / 1.5;
  const font = useFont(
    require('../assets/fonts/Rasa_600SemiBold.ttf'),
    fontSize
  );

  const textValue = useSharedValue(0);
  useEffect(() => {
    textValue.value = withTiming(currentProgress, { duration: 4000 });
  }, [currentProgress]);

  const textAnimated = useDerivedValue(() => {
    return `${textValue.value.toFixed(0)}`;
  }, [textValue]);

  const fillPercent = useDerivedValue(
    () => textValue.value / maxValue,
    [textValue]
  );

  // Dynamic bubble count (min: 5, max: 30)
  const bubbleCount = Math.max(
    5,
    Math.min(30, Math.floor((currentProgress / maxValue) * 30))
  );

  const backgroundPath = Skia.Path.Make();
  backgroundPath.addRRect(
    Skia.RRectXY(Skia.XYWHRect(0, 0, width, height), 40, 40)
  );

  const waveOffset = useSharedValue(0);
  useEffect(() => {
    waveOffset.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedWave = useDerivedValue(() => {
    return `M 0 ${
      height -
      height * fillPercent.value +
      Math.sin(waveOffset.value * Math.PI * 2) * 10
    }
            Q ${width * 0.25} ${
      height -
      height * fillPercent.value +
      Math.cos(waveOffset.value * Math.PI * 2) * 10
    },
              ${width * 0.5} ${height - height * fillPercent.value}
            T ${width} ${
      height -
      height * fillPercent.value +
      Math.sin(waveOffset.value * Math.PI * 2) * 10
    }
            V ${height}
            H 0 Z`;
  });

  return (
    <Canvas style={{ width, height }}>
      {/* Cylindrical Background */}
      <Group>
        <Path path={backgroundPath} color="#1D1F1EFF" />
      </Group>

      {/* Water Level */}
      <Group clip={backgroundPath}>
        <Rect
          x={0}
          y={height - height * fillPercent.value}
          width={width}
          height={height * fillPercent.value}
          color="#D21404B5"
        />
        <Path path={animatedWave} color="#D21404" />
      </Group>

      {/* Bubbles Moving in an Infinite Loop */}
      <Group clip={backgroundPath}>
        {[...Array(bubbleCount)].map((_, i) => {
          const minValue = height * 0.1; // Bubbles start at 10% of height
          const bubbleY = useSharedValue(
            height - minValue - Math.random() * (height * 0.4)
          ); // Start between minValue and mid-height
          const bubbleX = useSharedValue(Math.random() * width);
          const bubbleSize = Math.random() * 2 + 1; // Size between 1-3

          // Gradually fade bubbles as they approach the currentProgress level
          const bubbleOpacity = useDerivedValue(() => {
            const progressY = height - height * fillPercent.value;
            const fadeFactor = Math.max(
              0,
              (bubbleY.value - progressY) / (height - progressY)
            ); // Opacity reduces as it nears water level
            return fadeFactor * 0.6;
          });

          useEffect(() => {
            bubbleY.value = withRepeat(
              withTiming(minValue, {
                duration: 3000 + Math.random() * 2000,
                easing: Easing.linear,
              }),
              -1,
              false
            );
            bubbleX.value = withRepeat(
              withTiming(Math.random() * width, {
                duration: 2000,
                easing: Easing.linear,
              }),
              -1,
              true
            );
          }, []);

          return (
            <Circle
              key={i}
              cx={useDerivedValue(() => bubbleX.value)}
              cy={useDerivedValue(() => bubbleY.value)}
              r={bubbleSize}
              color="#F8F8F8"
              opacity={bubbleOpacity}
            />
          );
        })}
      </Group>

      {/* Progress Text */}
      {/* <Text
        x={radius - fontSize * 0.6}
        y={height - height * fillPercent.value - 40}
        text={textAnimated}
        font={font}
        color="#FFF"
      /> */}
    </Canvas>
  );
};
