import React from 'react';
import { Touchable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CommonPackages from '../custom-files/CommonPackages';
import * as CustomCode from '../custom-files/CustomCode';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { item: {}, onPress: () => {} };

const AdvanceHistoryCardBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const getDateRange = (created_at, ended_at) => {
    const moment = CommonPackages?.moment;
    const start = moment.utc(created_at);
    const end = moment.utc(ended_at);

    const sameMonth = start.month() === end.month();
    const formatStr = sameMonth ? 'MMM D' : 'MMM D';

    return `${start.format(formatStr)} – ${end.format('MMM D, YYYY')}`;
  };

  return (
    <View>
      <Touchable
        onPress={() => {
          try {
            props.onPress?.();
          } catch (err) {
            Sentry.captureException(err);
            console.error(err);
          }
        }}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: palettes.App['Advance Card'],
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 15,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 15,
            },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth({ width: '70%' }, dimensions.width)}
          >
            {/* Date */}
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.App.White,
                    fontFamily: 'Rasa_500Medium',
                    fontSize: 20,
                    paddingTop: 2,
                  }
                ),
                dimensions.width
              )}
            >
              {getDateRange(
                (props.item ?? defaultProps.item)?.from,
                (props.item ?? defaultProps.item)?.to
              )}
            </Text>
          </View>
          {/* View 2 */}
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'flex-end', width: '30%' },
              dimensions.width
            )}
          >
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.App.White,
                    fontFamily: 'Rasa_500Medium',
                    fontSize: 16,
                    paddingTop: 2,
                  }
                ),
                dimensions.width
              )}
            >
              {(props.item ?? defaultProps.item)?.week_points}
              {'/'}
              {(props.item ?? defaultProps.item)?.total_week_points}
              {' points'}
            </Text>
          </View>
        </View>
      </Touchable>
    </View>
  );
};

export default withTheme(AdvanceHistoryCardBlock);
