import React from 'react';
import { Icon, Touchable, useTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Tabs } from 'expo-router';
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { systemWeights } from 'react-native-typography';
import * as CustomTabBar from '../../custom-files/CustomTabBar';
import palettes from '../../themes/palettes';
import useNavigation from '../../utils/useNavigation';
import useWindowDimensions from '../../utils/useWindowDimensions';

export default function Layout() {
  const theme = useTheme();

  const tabBarOrDrawerIcons = {
    HomeStack: 'Feather/home',
    UpgradeStack: 'MaterialCommunityIcons/podium-gold',
    MoreStack: 'AntDesign/appstore-o',
    AdvanceNavigator: 'AntDesign/barchart',
    ProgressNavigator: 'Entypo/progress-two',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: { borderBottomColor: theme.colors.branding.secondary },
        tabBarActiveTintColor: palettes.App['Custom Color'],
        tabBarLabelStyle: { fontFamily: 'Inter_400Regular', fontSize: 11 },
        tabBarStyle: {
          backgroundColor: theme.colors.background.brand,
          borderTopColor: 'transparent',
        },
      }}
      tabBar={props => <CustomTabBar.Component {...props} />}
      initialRouteName={'index'}
    >
      <Tabs.Screen
        name="HomeStack"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="Feather/home"
              size={25}
              color={focused ? palettes.App['Custom Color'] : color}
            />
          ),
          tabBarLabel: 'Program',
          title: 'Home Stack',
        }}
      />
      <Tabs.Screen
        name="UpgradeStack"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="MaterialCommunityIcons/podium-gold"
              size={25}
              color={focused ? palettes.App['Custom Color'] : color}
            />
          ),
          tabBarLabel: 'Upgrade',
          title: 'Upgrade Stack',
        }}
      />
      <Tabs.Screen
        name="MoreStack"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="AntDesign/appstore-o"
              size={25}
              color={focused ? palettes.App['Custom Color'] : color}
            />
          ),
          tabBarLabel: 'More',
          title: 'More Stack',
        }}
      />
      <Tabs.Screen
        name="AdvanceNavigator"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="AntDesign/barchart"
              size={25}
              color={focused ? palettes.App['Custom Color'] : color}
            />
          ),
          tabBarLabel: 'Advanced',
          title: 'Advance Navigator',
        }}
      />
      <Tabs.Screen
        name="ProgressNavigator"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="Entypo/progress-two"
              size={25}
              color={focused ? palettes.App['Custom Color'] : color}
            />
          ),
          tabBarLabel: 'Progress',
          title: 'Progress Navigator',
        }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
