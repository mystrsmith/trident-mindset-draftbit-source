import React from 'react';
import { ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import * as CustomOnboardingPlayer from '../custom-files/CustomOnboardingPlayer';
import Player_LoadAndPlay from '../global-functions/Player_LoadAndPlay';
import Player_SeekTo from '../global-functions/Player_SeekTo';
import Player_StopPlay from '../global-functions/Player_StopPlay';
import checkPostNotifications from '../global-functions/checkPostNotifications';
import stopAllForegroundTasks from '../global-functions/stopAllForegroundTasks';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const OnboardingPlayerScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        if (Constants['ONBOARDING_FIRST_LESSON']) {
          await checkPostNotifications();
          await Player_LoadAndPlay(
            Variables,
            setGlobalVariableValue,
            Constants['ONBOARDING_FIRST_LESSON']
          );
          if (Constants['ONBOARDING_FIRST_LESSON_POSITION'] > 0) {
            await Player_SeekTo(Constants['ONBOARDING_FIRST_LESSON_POSITION']);
            await setGlobalVariableValue({
              key: 'PLAYER_POSITON',
              value: Constants['ONBOARDING_FIRST_LESSON_POSITION'],
            });
          } else {
          }
        } else {
        }
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, [isFocused]);
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (isFocused) {
          return;
        }
        await setGlobalVariableValue({
          key: 'CURRENTLY_PLAYING_LESSON',
          value: null,
        });
        await setGlobalVariableValue({
          key: 'SHOW_LESSON_PLAYER',
          value: false,
        });
        await Player_StopPlay(setGlobalVariableValue);
        stopAllForegroundTasks();
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, [isFocused]);

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
    >
      <Utils.CustomCodeErrorBoundary>
        <CustomOnboardingPlayer.Index />
      </Utils.CustomCodeErrorBoundary>
    </ScreenContainer>
  );
};

export default withTheme(OnboardingPlayerScreen);
