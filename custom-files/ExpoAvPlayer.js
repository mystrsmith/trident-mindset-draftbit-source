import * as React from 'react';
import { View, Button } from 'react-native';
import { Audio } from 'expo-av';

function Player() {
  const [sound, setSound] = React.useState();

  const initAudioMode = async () => {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      interruptionModeIOS: 2,
      interruptionModeAndroid: 2,
      playsInSilentModeIOS: true,
    });
  };

  React.useEffect(() => {
    initAudioMode();
  }, []);

  async function playSound() {
    //http://www.kiea.jp/hosenji.mp3
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'http://www.kiea.jp/hosenji.mp3' },
      { shouldPlay: true }
    );
    setSound(sound);
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return null;
}

const TrackPlayer = null;

const setupPlayer = null;
const loadTrack = null;
const addTrack = null;
const removeTrack = null;
const getQueue = null;
const setQueue = null;
const skipTo = null;
const clearQueue = null;
const getActiveTrack = null;
const nextTrack = null;
const previousTrack = null;
const play = null;
const pause = null;
const stop = null;
const togglePlay = null;
const seekTo = null;
const seekBy = null;

export {
  Player,
  TrackPlayer,
  loadTrack,
  addTrack,
  removeTrack,
  getQueue,
  setQueue,
  skipTo,
  clearQueue,
  getActiveTrack,
  nextTrack,
  previousTrack,
  play,
  pause,
  stop,
  togglePlay,
  seekTo,
  seekBy,
};
