import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  // TrackPlayer.addEventListener(Event.RemoteNext, () => {
  //   TrackPlayer.skipToNext()
  // });
  // TrackPlayer.addEventListener(Event.RemotePrevious, () => {
  //   TrackPlayer.skipToPrevious()
  // });
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    if (position) TrackPlayer.seekTo(position);
  });
  TrackPlayer.addEventListener(Event.RemoteJumpForward, ({ interval }) => {
    TrackPlayer.seekBy(interval || 15);
  });
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, ({ interval }) => {
    TrackPlayer.seekBy(interval * -1 || -15);
  });
};
