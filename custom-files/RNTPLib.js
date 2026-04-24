import { Platform } from 'react-native';
import TrackPlayer, {
  Event,
  State,
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import { ReactNativeForegroundService } from './CommonPackages';

const _setupPlayer = async options => {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options);
    } catch (error) {
      return error.code;
    }
  };
  while ((await setup()) === 'android_cannot_setup_player_in_background') {
    // A timeout will mostly only execute when the app is in the foreground,
    // and even if we were in the background still, it will reject the promise
    // and we'll try again:
    await new Promise(resolve => setTimeout(resolve, 1));
  }
};

const initialAddTaskForForegroundService = () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    ReactNativeForegroundService.add_task(() => console.log('Playing media'), {
      delay: 1000,
      onLoop: true,
      taskId: 'media',
      onError: e => console.log(`Error logging:`, e),
    });
  }
};

export async function setupPlayer() {
  try {
    await _setupPlayer({
      autoHandleInterruptions: false,
    });
    initialAddTaskForForegroundService();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });
  } catch (error) {
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.JumpForward,
        Capability.JumpBackward,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });
  }
}

// export async function setupPlayer() {
//   let isSetup = false;
//   try {
//     await TrackPlayer.getCurrentTrack();
//     isSetup = true;
//   } catch {
//     await TrackPlayer.setupPlayer();
//     await TrackPlayer.updateOptions({
//       android: {
//         appKilledPlaybackBehavior:
//           AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
//       },
//       capabilities: [
//         Capability.Play,
//         Capability.Pause,
//         Capability.SkipToNext,
//         Capability.SkipToPrevious,
//         Capability.SeekTo,
//       ],
//       compactCapabilities: [
//         Capability.Play,
//         Capability.Pause,
//         Capability.SkipToNext,
//       ],
//       progressUpdateEventInterval: 2,
//     });

//     isSetup = true;
//   } finally {
//     return isSetup;
//   }
// }

export async function loadTrack({ id, url, title, artist, artwork, ...rest }) {
  await TrackPlayer.load({
    id: id,
    url,
    title,
    artist,
    artwork,
    ...rest,
  });

  // await TrackPlayer.play()
}

export async function addTrack({ id, url, title, artist, artwork, ...rest }) {
  await TrackPlayer.add({
    id: id,
    url,
    title,
    artist,
    artwork,
    ...rest,
  });
}

export async function removeTrack(id) {
  const queue = await TrackPlayer.getQueue();
  const index = queue.findIndex(q => q.id === id);
  if (index > -1) {
    await TrackPlayer.remove(index);
  }
}

export async function getQueue() {
  let queue = await TrackPlayer.getQueue();
  return queue;
}

export async function setQueue(tracks) {
  await TrackPlayer.setQueue(tracks);
}

export async function clearQueue() {
  await TrackPlayer.removeUpcomingTracks();
}

export async function getActiveTrack() {
  return await TrackPlayer.getActiveTrack();
}

export async function skipTo(id) {
  const queue = await TrackPlayer.getQueue();
  const index = queue.findIndex(q => q.id === id);
  if (index > -1) {
    await TrackPlayer.skip(index);
    await TrackPlayer.play();
  }
}

export async function nextTrack() {
  await TrackPlayer.skipToNext();
}

export async function previousTrack() {
  await TrackPlayer.skipToPrevious();
}

export async function play() {
  await TrackPlayer.play();
}

export async function pause() {
  await TrackPlayer.pause();
}

export async function stop() {
  await TrackPlayer.stop();
}

export async function togglePlay({ onPlay, onPause }) {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  const playBackState = await TrackPlayer.getPlaybackState();

  if (currentTrack != null) {
    if (
      (playBackState.state === State.Paused) |
      (playBackState.state === State.Ready)
    ) {
      await TrackPlayer.play();
      onPlay && onPlay();
    } else {
      await TrackPlayer.pause();

      onPause && onPause();
    }
  }
}

const SEEK_RESUME_DELAY_MS = 400;

async function resumePlayIfWasPaused(wasPausedOrReady) {
  if (!wasPausedOrReady) return;
  await new Promise(resolve => setTimeout(resolve, SEEK_RESUME_DELAY_MS));
  try {
    await TrackPlayer.play();
  } catch (e) {
    // no-op if play fails (e.g. no track)
  }
}

export async function seekTo(val) {
  const playBackState = await TrackPlayer.getPlaybackState();
  const wasPausedOrReady =
    playBackState?.state === State.Paused ||
    playBackState?.state === State.Ready;
  await TrackPlayer.seekTo(val);
  resumePlayIfWasPaused(wasPausedOrReady);
}

export async function seekBy(val) {
  const playBackState = await TrackPlayer.getPlaybackState();
  const wasPausedOrReady =
    playBackState?.state === State.Paused ||
    playBackState?.state === State.Ready;
  await TrackPlayer.seekBy(val);
  resumePlayIfWasPaused(wasPausedOrReady);
}

export async function playbackServices() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext()
  );
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious()
  );
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
    if (position) TrackPlayer.seekTo(position);
  });
}
