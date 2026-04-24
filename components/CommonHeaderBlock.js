import React from 'react';
import { Icon, Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { title: null };

const CommonHeaderBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation(props.navigation);
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;

  return (
    <View
      {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
      style={StyleSheet.applyWidth(
        StyleSheet.compose(
          GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
          {
            borderBottomWidth: 1,
            borderColor: palettes.App.Outline,
            justifyContent: 'space-between',
            paddingLeft: 15,
            paddingRight: 15,
          }
        ),
        dimensions.width
      )}
    >
      {/* Back */}
      <Pressable
        onPress={() => {
          try {
            navigation.goBack();
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
        activeOpacity={0.3}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'flex-start',
              height: 40,
              justifyContent: 'center',
              width: 40,
            },
            dimensions.width
          )}
        >
          <Icon
            size={24}
            color={palettes.App['Custom Color']}
            name={'Ionicons/chevron-back'}
          />
        </View>
      </Pressable>

      <Text
        accessible={true}
        selectable={false}
        {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.TextStyles(theme)['Screen_Title'].style,
            {
              color: Constants['APP_FONT_COLOR'],
              fontFamily: 'Rasa_500Medium',
              fontSize: 26,
            }
          ),
          dimensions.width
        )}
      >
        {props.title ?? defaultProps.title}
      </Text>
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            height: 40,
            justifyContent: 'center',
            width: 40,
          },
          dimensions.width
        )}
      />
    </View>
  );
};

export default withTheme(CommonHeaderBlock);
