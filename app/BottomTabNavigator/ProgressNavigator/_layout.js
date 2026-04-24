import React from 'react';
import { Icon, Touchable, useTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router/stack';
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { systemWeights } from 'react-native-typography';
import palettes from '../../../themes/palettes';
import useNavigation from '../../../utils/useNavigation';
import useWindowDimensions from '../../../utils/useWindowDimensions';

function DefaultAndroidBackIcon({ tintColor }) {
  return (
    <View style={[styles.headerContainer, styles.headerContainerLeft]}>
      <Icon
        name="AntDesign/arrowleft"
        size={24}
        color={tintColor}
        style={[styles.headerIcon, styles.headerIconLeft]}
      />
    </View>
  );
}

export default function Layout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        cardStyle: { flex: 1 },
        headerBackImage:
          Platform.OS === 'android' ? DefaultAndroidBackIcon : null,
        headerShown: false,
        headerStyle: { backgroundColor: 'transparent' },
        headerTransparent: true,
      }}
      initialRouteName={'index'}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Progress',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({});
