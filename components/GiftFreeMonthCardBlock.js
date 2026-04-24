import React from 'react';
import { LinearGradient, Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { onPress: () => {} };

const GiftFreeMonthCardBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();

  return (
    <View style={StyleSheet.applyWidth({ opacity: 0.8 }, dimensions.width)}>
      <Pressable>
        <LinearGradient
          endX={100}
          endY={100}
          startX={0}
          startY={0}
          {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].props}
          color1={palettes.App.Studily_Light_Navy_Secondary}
          color2={theme.colors.background.brand}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
              {
                borderRadius: 14,
                height: '100%',
                opacity: 1,
                position: 'absolute',
                width: '100%',
              }
            ),
            dimensions.width
          )}
        />
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              borderColor: palettes.Brand.Surface,
              borderRadius: 10,
              borderWidth: 1,
              flexDirection: 'row',
              gap: 1,
              justifyContent: 'flex-start',
              opacity: 1,
              paddingBottom: 10,
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
            },
            dimensions.width
          )}
        >
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand.Surface,
                fontFamily: 'Rasa_600SemiBold',
                fontSize: 18,
              }),
              dimensions.width
            )}
          >
            {'Share Trident Mindset'}
          </Text>
          {/* Text 2 */}
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand.Surface,
                fontFamily: 'Rasa_500Medium',
                fontSize: 18,
                paddingLeft: 15,
              }),
              dimensions.width
            )}
          >
            {'Give 30 Free Days'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default withTheme(GiftFreeMonthCardBlock);
