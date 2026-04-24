import * as Media from '../custom-files/Media';

const Player_TogglePlay = async setGlobalVariableValue => {
  try {
    await Media.togglePlay({
      onPause: () => {
        setGlobalVariableValue({
          key: 'PLAYER_STATE',
          value: 'paused',
        });
      },
      onPlay: () => {
        setGlobalVariableValue({
          key: 'PLAYER_STATE',
          value: 'playing',
        });
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export default Player_TogglePlay;
