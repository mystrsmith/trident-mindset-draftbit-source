import React from 'react';
import { Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import * as LiquidGaugeProgress from '../custom-files/LiquidGaugeProgress';
import isValidAccessAdvanceDay from '../global-functions/isValidAccessAdvanceDay';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import hapticFeedbackUtil from '../utils/hapticFeedback';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { from_history: false, item: null, onPress: () => {} };

const AdvanceProgramCardBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;

  return (
    <View
      style={StyleSheet.applyWidth(
        {
          height:
            Constants['PROFILE_DETAILS']?.is_test_user === true
              ? dimensions.height / 11
              : dimensions.height / 10,
          maxHeight: 50,
        },
        dimensions.width
      )}
    >
      <Pressable
        onPress={() => {
          const handler = async () => {
            try {
              await hapticFeedbackUtil({
                feedbackIntensity: 'medium',
              });

              props.onPress?.();
            } catch (err) {
              Sentry.captureException(err);
              console.error(err);
            }
          };
          handler();
        }}
        disabled={Boolean(
          !isValidAccessAdvanceDay(
            Variables,
            (props.item ?? defaultProps.item)?.weekday_number,
            props.from_history ?? defaultProps.from_history
          )
        )}
        disabledOpacity={0.5}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: palettes.App['Advance Card'],
              borderRadius: 20,
              flexDirection: 'row',
              gap: 30,
              paddingBottom: 10,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
            },
            dimensions.width
          )}
        >
          <Utils.CustomCodeErrorBoundary>
            <LiquidGaugeProgress.Index
              size={40}
              currentProgress={props.item?.current_points || 0}
              maxValue={props.item?.total_points || 100}
            />
          </Utils.CustomCodeErrorBoundary>
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand.Surface,
                fontFamily: 'Rasa_500Medium',
                fontSize: 18,
              }),
              dimensions.width
            )}
          >
            {(props.item ?? defaultProps.item)?.name}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default withTheme(AdvanceProgramCardBlock);
