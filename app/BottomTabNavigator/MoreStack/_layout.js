import React from 'react';
import { Icon, Touchable, useTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router/stack';
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { systemWeights } from 'react-native-typography';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
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

  const Constants = GlobalVariables.useValues();

  return (
    <Stack
      screenOptions={{
        cardStyle: { flex: 1 },
        headerBackImage:
          Platform.OS === 'android' ? DefaultAndroidBackIcon : null,
        headerShown: false,
      }}
      initialRouteName={'index'}
    >
      <Stack.Screen
        name="ChangePasswordScreen"
        options={{
          title: 'Change Password',
        }}
      />

      <Stack.Screen
        name="CheckInNotesScreen"
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: 'transparent' },
          headerTransparent: true,
          title: 'Check In Notes',
        }}
      />

      <Stack.Screen
        name="DownloadedLessonDetailScreen"
        options={{
          title: 'Downloaded Lesson Detail',
        }}
      />

      <Stack.Screen
        name="DownloadedLessonsScreen"
        options={{
          title: 'Downloaded Lessons',
        }}
      />

      <Stack.Screen
        name="FAQsScreen"
        options={{
          title: 'FAQs',
        }}
      />

      <Stack.Screen
        name="LessonNotesLessonsScreen"
        options={{
          title: 'Lesson Notes Lessons',
        }}
      />

      <Stack.Screen
        name="LessonNotesTacticsScreen"
        options={{
          title: 'Lesson Notes Tactics',
        }}
      />

      <Stack.Screen
        name="index"
        options={{
          title: 'More',
        }}
      />

      <Stack.Screen
        name="MyNotesScreen"
        options={{
          title: 'My Notes',
        }}
      />

      <Stack.Screen
        name="NotebookScreen"
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: 'transparent' },
          headerTransparent: true,
          title: 'Notebook',
        }}
      />

      <Stack.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
        }}
      />

      <Stack.Screen
        name="UpdateProfileScreen"
        options={{
          title: 'Update Profile',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({});
