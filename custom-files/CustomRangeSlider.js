import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { PanResponder, Text, View } from 'react-native';
import palettes from '../themes/palettes';

const THUMB_SIZE = 28;
const TRACK_HEIGHT = 6;
const VALUE_BADGE_ROW_HEIGHT = 24;

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function snapValue(raw, min, max, step) {
  const stepped = Math.round((raw - min) / step) * step + min;
  return clamp(stepped, min, max);
}

function valueFromX(x, width, min, max, step) {
  if (width <= 0) {
    return min;
  }
  const ratio = clamp(x / width, 0, 1);
  const raw = min + ratio * (max - min);
  return snapValue(raw, min, max, step);
}

const Index = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 10,
  trackColor = palettes.Brand.Surface,
  minimumTrackColor = palettes.App['True Blue'],
  thumbColor = palettes.App['True Blue'],
  labelColor = palettes.Brand.Surface,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const ratio =
    maximumValue === minimumValue
      ? 0
      : (value - minimumValue) / (maximumValue - minimumValue);

  const applyX = useCallback(
    nativeEvent => {
      const x = nativeEvent.locationX;
      const next = valueFromX(x, trackWidth, minimumValue, maximumValue, step);
      if (next !== valueRef.current) {
        onValueChange(next);
      }
    },
    [trackWidth, minimumValue, maximumValue, step, onValueChange]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: e => applyX(e.nativeEvent),
        onPanResponderMove: e => applyX(e.nativeEvent),
      }),
    [applyX]
  );

  const lastWidthRef = useRef(0);
  const onTrackLayout = e => {
    const w = e.nativeEvent.layout.width;
    if (w !== lastWidthRef.current) {
      lastWidthRef.current = w;
      setTrackWidth(w);
    }
  };

  return (
    <View
      style={{
        paddingTop: 14,
        // paddingBottom: 4,
        paddingHorizontal: 4,
      }}
    >
      <View
        {...panResponder.panHandlers}
        onLayout={onTrackLayout}
        style={{ position: 'relative', height: TRACK_HEIGHT }}
      >
        <View
          style={{
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: trackColor,
            opacity: 0.4,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: TRACK_HEIGHT,
            width: `${ratio * 100}%`,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: minimumTrackColor,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: `${ratio * 100}%`,
            top: (TRACK_HEIGHT - THUMB_SIZE) / 2,
            marginLeft: -THUMB_SIZE / 2,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: thumbColor,
            // borderWidth: 2,
            // borderColor: palettes.App.White,
          }}
        />
      </View>

      <View
        style={{
          position: 'relative',
          height: VALUE_BADGE_ROW_HEIGHT,
          marginTop: (THUMB_SIZE - TRACK_HEIGHT) / 2 + 6,
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: `${ratio * 100}%`,
            transform: [{ translateX: -20 }],
            top: 0,
            width: 40,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              // backgroundColor: minimumTrackColor,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 4,
              minWidth: 40,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: palettes.App.White,
                fontFamily: 'Rasa_600SemiBold',
                fontSize: 15,
              }}
            >
              {Math.round(value)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export { Index };
