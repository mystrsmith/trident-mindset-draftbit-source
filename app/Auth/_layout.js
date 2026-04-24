import React from 'react';
import { Icon, Touchable, useTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router/stack';
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { systemWeights } from 'react-native-typography';
import * as XanoBackendApi from '../../apis/XanoBackendApi.js';
import * as GlobalVariables from '../../config/GlobalVariableContext';
import restorePurchase from '../../global-functions/restorePurchase';
import palettes from '../../themes/palettes';
import Breakpoints from '../../utils/Breakpoints';
import useNavigation from '../../utils/useNavigation';
import useWindowDimensions from '../../utils/useWindowDimensions';

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

  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  return (
    <Stack
      screenOptions={{
        cardStyle: { flex: 1 },
        gestureEnabled: true,
        headerBackImage:
          Platform.OS === 'android' ? DefaultAndroidBackIcon : null,
        headerShown: false,
      }}
      initialRouteName={'index'}
    >
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{
          title: 'Forgot Password',
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
        }}
      />

      <Stack.Screen
        name="SignUpBackupScreen"
        options={{
          title: 'Sign Up Backup',
        }}
      />

      <Stack.Screen
        name="SignUpScreen"
        options={{
          title: 'Sign Up',
        }}
      />

      <Stack.Screen
        name="UpgradeScreen"
        options={{
          title: 'Upgrade',
        }}
      />

      <Stack.Screen
        name="VerifyOTPScreen"
        options={{
          title: 'Verify OTP',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({});
