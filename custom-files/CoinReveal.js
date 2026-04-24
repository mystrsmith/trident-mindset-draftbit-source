import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, ClipPath } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Index = ({ initialPercentage, percentage, size, imageUrl }) => {
  const [currentPercentage, setCurrentPercentage] = useState(initialPercentage);
  const circleRadius = size / 2;
  const animatedPercentage = useSharedValue(initialPercentage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPercentage(percentage);
    }, 1800);

    return () => clearTimeout(timer);
  }, [percentage]);

  useEffect(() => {
    animatedPercentage.value = withTiming(currentPercentage, {
      duration: 1500,
    });
  }, [currentPercentage]);

  const animatedProps = useAnimatedProps(() => {
    const angle = ((100 - animatedPercentage.value) / 100) * 360;
    const largeArcFlag = angle > 180 ? 1 : 0;
    const x = circleRadius - circleRadius * Math.sin(angle * (Math.PI / 180));
    const y = circleRadius - circleRadius * Math.cos(angle * (Math.PI / 180));
    const path = `M ${circleRadius},${circleRadius} L ${circleRadius},0 A ${circleRadius},${circleRadius} 0 ${largeArcFlag},0 ${x},${y} Z`;
    return { d: path };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: circleRadius },
        ]}
        transition={1000}
        borderRadius={circleRadius}
      />
      <Svg height={size} width={size} style={styles.svg}>
        <Defs>
          <ClipPath id="clip">
            <AnimatedPath animatedProps={animatedProps} />
          </ClipPath>
        </Defs>
        <Circle
          cx={circleRadius}
          cy={circleRadius}
          r={circleRadius}
          fill="black"
          stroke="white"
          strokeWidth={2}
          clipPath="url(#clip)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'white',
  },
  svg: {
    position: 'absolute',
  },
});

export { Index };
