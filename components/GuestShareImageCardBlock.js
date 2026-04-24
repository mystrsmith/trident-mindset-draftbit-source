import React from 'react';
import { ExpoImage, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import Images from '../config/Images';
import getCardHeight from '../global-functions/getCardHeight';
import getCardWidth from '../global-functions/getCardWidth';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const GuestShareImageCardBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();

  return (
    <View>
      <View
        style={StyleSheet.applyWidth(
          {
            borderRadius: 15,
            height: getCardHeight(20, dimensions.width),
            overflow: 'hidden',
            width: getCardWidth(20, dimensions.width),
          },
          dimensions.width
        )}
      >
        <ExpoImage
          allowDownscaling={true}
          cachePolicy={'disk'}
          contentPosition={'center'}
          transitionDuration={300}
          transitionEffect={'cross-dissolve'}
          transitionTiming={'ease-in-out'}
          {...GlobalStyles.ExpoImageStyles(theme)['Image 2'].props}
          resizeMode={'cover'}
          source={imageSource(Images['guestpassimg'])}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ExpoImageStyles(theme)['Image 2'].style,
              { height: '100%', width: '100%' }
            ),
            dimensions.width
          )}
        />
      </View>
    </View>
  );
};

export default withTheme(GuestShareImageCardBlock);
