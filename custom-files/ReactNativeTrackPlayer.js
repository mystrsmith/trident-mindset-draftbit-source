import React, { useEffect } from 'react';
import { View } from 'react-native';
import * as GlobalVariableContext from '../config/GlobalVariableContext';
import * as GlobalVariables from '../config/GlobalVariableContext';
import TrackPlayer, {
  usePlaybackState,
  useProgress,
  State,
  Event,
} from 'react-native-track-player';
import * as CommonPackages from '../custom-files/CommonPackages';
import Player_Play from '../global-functions/Player_Play';
import { setupPlayer, stop } from './RNTPLib';
import shouldPlayMeditationBell from '../global-functions/shouldPlayMeditationBell';
import playMeditationBellSound from '../global-functions/playMeditationBellSound';
import { reset } from './PlayerAnimationValues';

// TrackPlayer.registerPlaybackService(() => require('./services'));

function Player(props) {
  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariableContext.useSetValue();
  const [isPlayerReady, setIsPlayerReady] = React.useState(false);

  const playBackState = usePlaybackState();
  const progress = useProgress();

  const currentlyPlayingLesson = Constants['CURRENTLY_PLAYING_LESSON'];
  const isMeditation = currentlyPlayingLesson?.isMeditation;

  useEffect(() => {
    async function init() {
      if (
        currentlyPlayingLesson === null ||
        currentlyPlayingLesson === undefined
      ) {
        return;
      }
      if (
        isMeditation === null ||
        isMeditation === undefined ||
        isMeditation === false
      ) {
        return;
      }
      if (progress.position === 0) {
        return;
      }
      const selectedMinutes = currentlyPlayingLesson?.selectedMinutes;
      const selectedIntervalBell = currentlyPlayingLesson?.selectedIntervalBell;
      const selectedIntervalBellValue = selectedIntervalBell?.value;
      if (selectedMinutes && selectedMinutes > 0) {
        const selectedSeconds = selectedMinutes * 60;
        const shouldPlayBell = shouldPlayMeditationBell(
          selectedIntervalBellValue,
          progress.position,
          selectedSeconds
        );
        console.log('shouldPlayBell', shouldPlayBell);
        if (shouldPlayBell === true) {
          playMeditationBellSound();
        }
      }
    }
    init();
  }, [progress.position, isMeditation, currentlyPlayingLesson]);

  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();

      setIsPlayerReady(isSetup);
    }

    setup();
  }, []);

  const playerPosition = Constants['PLAYER_POSITON'] / 1000;

  useEffect(() => {
    if (playBackState.state === State.Ready) {
      return;
    }
    if (playBackState.state) {
      if (
        playerPosition &&
        progress.buffered &&
        playerPosition > progress.buffered
      ) {
        setGlobalVariableValue({
          key: 'PLAYER_STATE',
          value: State.Buffering,
        });
      } else {
        setGlobalVariableValue({
          key: 'PLAYER_STATE',
          value: playBackState.state,
        });
      }

      if (playBackState.state === State.Ended) {
        if (isMeditation === true) {
          playMeditationBellSound();
        }
        reset.value = true;
        stop();
        setGlobalVariableValue({
          key: 'CURRENTLY_PLAYING_LESSON',
          value: null,
        });
        setGlobalVariableValue({
          key: 'SHOW_LESSON_PLAYER',
          value: false,
        });
      }
    }
  }, [playBackState.state, isMeditation, playerPosition]);

  useEffect(() => {
    if (
      playBackState.state === State.Paused ||
      playBackState.state === State.Buffering ||
      playBackState.state === State.Ready
    ) {
      return;
    }
    if (progress.position !== null && progress.position !== undefined) {
      const positionMs = progress.position * 1000;
      const onboardingResumeMs = Constants['ONBOARDING_FIRST_LESSON_POSITION'];
      const isOnboardingFirstLesson =
        currentlyPlayingLesson?.id != null &&
        Constants['ONBOARDING_FIRST_LESSON']?.id ===
          currentlyPlayingLesson?.id &&
        typeof onboardingResumeMs === 'number' &&
        Number.isFinite(onboardingResumeMs) &&
        onboardingResumeMs > 0;
      const effectivePositionMs =
        isOnboardingFirstLesson && positionMs < onboardingResumeMs
          ? onboardingResumeMs
          : positionMs;
      const durationMs = currentlyPlayingLesson?.duration;
      const cappedPosition =
        durationMs != null
          ? Math.min(effectivePositionMs, durationMs)
          : effectivePositionMs;
      setGlobalVariableValue({
        key: 'PLAYER_POSITON',
        value: cappedPosition,
      });
    }
  }, [
    playBackState.state,
    progress.position,
    currentlyPlayingLesson?.duration,
    currentlyPlayingLesson?.id,
    Constants['ONBOARDING_FIRST_LESSON_POSITION'],
    Constants['ONBOARDING_FIRST_LESSON']?.id,
  ]);

  return <View></View>;
}

export { Player, TrackPlayer };
