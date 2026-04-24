import React, { useEffect } from 'react';
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
  useFont,
  Text,
  center,
} from '@shopify/react-native-skia';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { area, scaleLinear } from 'd3';

export const Index = ({ size = 40, currentProgress = 0, maxValue = 1000 }) => {
  const radius = size * 0.5;
  const circleThickness = radius * 0.05;
  const circleFillGap = 0.05 * radius;
  const fillCircleMargin = circleThickness + circleFillGap;
  const fillCircleRadius = radius - fillCircleMargin;
  const minValue = 0;
  const fillPercent =
    Math.max(minValue, Math.min(maxValue, currentProgress)) / maxValue;
  const waveCount = 1;
  const waveClipCount = waveCount + 1;
  const waveLength = (fillCircleRadius * 2) / waveCount;
  const waveClipWidth = waveLength * waveClipCount;
  const waveHeight = fillCircleRadius * 0.1;
  const fontSize = radius / 1.1;
  const font = useFont(
    require('../assets/fonts/Rasa_600SemiBold.ttf'),
    fontSize
  );
  const text = `${currentProgress}`;
  const textWidth = font?.getTextWidth(text) ?? 0;
  const textTranslateX = radius - textWidth * 0.5;
  const textTransform = [{ translateY: 50 * 0.4 - fontSize * 0.7 }];

  const data = [];
  for (let i = 0; i <= 40 * waveClipCount; i++) {
    data.push([i / (40 * waveClipCount), i / 40]);
  }

  const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
  const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

  const clipArea = area()
    .x(function (d) {
      return waveScaleX(d[0]);
    })
    .y0(function (d) {
      return waveScaleY(Math.sin(d[1] * 2 * Math.PI));
    })
    .y1(function () {
      return fillCircleRadius * 2 + waveHeight;
    });

  const clipSvgPath = clipArea(data);
  const transformMatrix = Skia.Matrix();
  transformMatrix.translate(
    0,
    fillCircleMargin + (1 - fillPercent) * fillCircleRadius * 2 - waveHeight
  );

  const translateXAnimated = useSharedValue(0);
  useEffect(() => {
    translateXAnimated.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const clipPath = useDerivedValue(() => {
    const clipP = Skia.Path.MakeFromSVGString(clipSvgPath);
    const transformMatrix = Skia.Matrix();
    transformMatrix.translate(
      fillCircleMargin - waveLength * translateXAnimated.value,
      fillCircleMargin + (1 - fillPercent) * fillCircleRadius * 2 - waveHeight
    );
    clipP.transform(transformMatrix);
    return clipP;
  }, [translateXAnimated, currentProgress]);

  const translateYPercent = useSharedValue(0);
  useEffect(() => {
    translateYPercent.value = withTiming(fillPercent, {
      duration: 1000,
    });
  }, [fillPercent]);

  transformMatrix.translate(
    fillCircleMargin - waveLength * translateXAnimated.value,
    fillCircleMargin +
      (1 - translateYPercent.value) * fillCircleRadius * 2 -
      waveHeight
  );

  const textValue = useSharedValue(0);
  useEffect(() => {
    textValue.value = withTiming(currentProgress, {
      duration: 1000,
    });
  }, [currentProgress]);

  const textAnimated = useDerivedValue(() => {
    return `${textValue.value.toFixed(0)}`;
  }, [textValue]);

  return (
    <Canvas
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Circle
        cx={radius}
        cy={radius}
        r={radius - circleThickness * 0.5}
        color="#D21404"
        style="stroke"
        strokeWidth={circleThickness}
      />

      <Text
        x={textTranslateX}
        y={fontSize}
        text={textAnimated}
        font={font}
        color="#FFF"
        transform={textTransform}
      />

      <Group clip={clipPath}>
        <Circle cx={radius} cy={radius} r={fillCircleRadius} color="#D21404" />
        <Text
          x={textTranslateX}
          y={fontSize}
          text={textAnimated}
          font={font}
          color="#FFF"
          transform={textTransform}
        />
      </Group>
    </Canvas>
  );
};
