import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutAnimation,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const Index = ({
  label,
  renderCheckbox,
  children,
  renderRightComponent = null,
  disabled = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const animation = useSharedValue(0);

  const onItemPress = () => {
    setIsCollapsed(!isCollapsed);
    animation.value = withTiming(isCollapsed ? 1 : 0, {
      duration: 320,
    });
  };

  const containerStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(animation.value, [0, 1], [30, 15]);

    return {
      borderRadius,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(animation.value, [0, 1], [0, 100000]),
      opacity: interpolate(animation.value, [0, 0.5, 1], [0, 0.7, 1]),
    };
  });

  return (
    <Animated.View style={[styles.wrap, containerStyle]}>
      <TouchableWithoutFeedback onPress={onItemPress} disabled={disabled}>
        <View style={styles.row}>
          {renderCheckbox()}
          <Text style={styles.label}>{label}</Text>
          {renderRightComponent}
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.content, contentStyle]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 23,
    paddingVertical: 10,
    backgroundColor: '#000F52',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    overflow: 'hidden',
  },
  label: {
    top: 1,
    color: 'white',
    fontSize: 20,
    flex: 1,
    fontFamily: 'Rasa_600SemiBold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    overflow: 'hidden',
  },
});

export { Index };
