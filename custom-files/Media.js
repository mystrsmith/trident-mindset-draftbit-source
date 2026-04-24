import React from 'react';
import { Platform } from 'react-native';

const { Player, TrackPlayer } = Platform.select({
  ios: () => require('./ReactNativeTrackPlayer'),
  android: () => require('./ReactNativeTrackPlayer'),
  web: () => require('./ExpoAvPlayer'),
})();

const {
  setupPlayer,
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
} = Platform.select({
  ios: () => require('./RNTPLib'),
  android: () => require('./RNTPLib'),
  web: () => require('./ExpoAvPlayer'),
})();

if (setupPlayer) setupPlayer('media.js');

const MediaPlayer = props => <Player {...props} />;

export {
  TrackPlayer,
  MediaPlayer,
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
