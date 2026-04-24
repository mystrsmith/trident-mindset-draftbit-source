import * as Media from '../custom-files/Media';

const Player_StopPlay = async setGlobalVariableValue => {
  try {
    setGlobalVariableValue({
      key: 'PLAYER_STATE',
      value: '',
    });
    setGlobalVariableValue({
      key: 'CURRENTLY_PLAYING_LESSON',
      value: '',
    });
    await Media.stop();
  } catch (err) {
    console.error(err);
  }
};

export default Player_StopPlay;
