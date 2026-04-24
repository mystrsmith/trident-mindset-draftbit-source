import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from '@draftbit/ui';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Images from '../config/Images';
import imageSource from '../utils/imageSource';
import palettes from '../themes/palettes';
import * as StyleSheet from '../utils/StyleSheet';
import * as GlobalStyles from '../GlobalStyles.js';
import useWindowDimensions from '../utils/useWindowDimensions';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import * as GlobalVariables from '../config/GlobalVariableContext';

const getCurrentQuote = Constants => {
  const celebrationQuotes = Constants['APP_CONFIG']?.celebration_quotes || [];

  if (!celebrationQuotes || celebrationQuotes.length === 0) {
    return {
      text: 'Direction is more important than speed',
      author: null,
      position: 1,
    };
  }
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0-6
  const currentPosition = dayOfWeek + 1; // 1-7
  const quote = celebrationQuotes.find(q => q.position === currentPosition);
  return (
    quote ||
    celebrationQuotes[0] || {
      text: 'Direction is more important than speed',
      author: null,
      position: 1,
    }
  );
};

const useCelebrationAnimations = ({ isFocused }) => {
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    if (!isFocused) return;

    backgroundOpacity.value = withTiming(0.3, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  }, [isFocused]);

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  return { backgroundAnimatedStyle };
};

const Index = ({ theme, isFocused }) => {
  const Constants = GlobalVariables.useValues();
  const currentQuote = getCurrentQuote(Constants);
  const dimensions = useWindowDimensions();

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const pulseScale = useSharedValue(0);
  const pulseOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    if (!isFocused) return;

    logoOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 1200,
        easing: Easing.out(Easing.ease),
      })
    );
    logoScale.value = withDelay(
      200,
      withTiming(1, {
        duration: 1200,
        easing: Easing.out(Easing.ease),
      })
    );

    pulseScale.value = withDelay(
      700,
      withSequence(
        withTiming(3, {
          duration: 1000,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(0, { duration: 0 })
      )
    );
    pulseOpacity.value = withDelay(
      700,
      withSequence(
        withTiming(0.6, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        }),
        withTiming(0, {
          duration: 700,
          easing: Easing.in(Easing.ease),
        })
      )
    );

    textOpacity.value = withDelay(
      1600,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    );
    textTranslateY.value = withDelay(
      1600,
      withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    );

    buttonOpacity.value = withDelay(
      3400,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    );
    buttonTranslateY.value = withDelay(
      3400,
      withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.ease),
      })
    );
  }, [isFocused]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
      transform: [{ scale: pulseScale.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ translateY: buttonTranslateY.value }],
    };
  });

  const navigation = useNavigation();

  return (
    <View
      style={StyleSheet.applyWidth(
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        dimensions.width
      )}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#56B8F42B',
            alignSelf: 'center',
          },
          pulseAnimatedStyle,
        ]}
      />

      {/* Logo */}
      <Animated.View style={logoAnimatedStyle}>
        <Image
          source={imageSource(
            Images['IcBrain'] || Images['NavyAppLogo'] || Images['IcBrain']
          )}
          resizeMode="contain"
          style={StyleSheet.applyWidth(
            { width: 120, height: 120 },
            dimensions.width
          )}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            paddingHorizontal: 40,
          },
          textAnimatedStyle,
        ]}
      >
        <Text
          style={{
            fontSize: 32,
            fontFamily: 'Rasa_600SemiBold',
            color:
              palettes.App['Custom Color'] || palettes.App.White || '#FFFFFF',
            textAlign: 'center',
            marginBottom: 15,
          }}
        >
          Good Work
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Rasa_400Regular',
            color:
              palettes.App['Custom Color'] || palettes.App.White || '#FFFFFF',
            textAlign: 'center',
            lineHeight: 20,
            opacity: 0.9,
          }}
        >
          {currentQuote.text}
        </Text>
        {currentQuote.author && (
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Rasa_300Light',
              color:
                palettes.App['Custom Color'] || palettes.App.White || '#FFFFFF',
              textAlign: 'center',
              marginTop: 16,
              opacity: 0.7,
              fontStyle: 'italic',
            }}
          >
            — {currentQuote.author}
          </Text>
        )}
      </Animated.View>

      <Animated.View
        style={[
          {
            marginTop: 40,
            paddingHorizontal: 40,
            width: '100%',
            alignItems: 'center',
          },
          buttonAnimatedStyle,
        ]}
      >
        <Button
          accessible={true}
          onPress={() => {
            try {
              navigation.replace('BottomTabNavigator', {
                screen: 'HomeStack',
                params: { screen: 'HomeScreen' },
              });
            } catch (err) {
              console.error(err);
            }
          }}
          {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
          activeOpacity={0.3}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ButtonStyles(theme)['Action Button'].style,
              {
                backgroundColor: palettes.App['Base Blue'] || '#0177D9',
                fontFamily: 'Rasa_500Medium',
                fontSize: 18,
                paddingVertical: 14,
                paddingHorizontal: 40,
                minWidth: 150,
              }
            ),
            dimensions.width
          )}
          title="Finish"
        />
      </Animated.View>
    </View>
  );
};

export { Index };
