import React from 'react';
import { LoadingIndicator, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { View } from 'react-native';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const CommonLoadingBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();

  return (
    <View
      style={StyleSheet.applyWidth(
        {
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          paddingBottom: 15,
          paddingTop: 15,
        },
        dimensions.width
      )}
    >
      <LoadingIndicator size={30} color={palettes.App.White} type={'swing'} />
    </View>
  );
};

export default withTheme(CommonLoadingBlock);
