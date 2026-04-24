import React from 'react';
import { withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const EmptyListStateBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();

  return (
    <View
      style={StyleSheet.applyWidth(
        { alignItems: 'center', paddingBottom: 30, paddingTop: 30 },
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
            fontFamily: 'Rasa_500Medium',
            fontSize: 22,
          }),
          dimensions.width
        )}
      >
        {'No data'}
      </Text>
    </View>
  );
};

export default withTheme(EmptyListStateBlock);
