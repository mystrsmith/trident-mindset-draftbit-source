import * as Media from '../custom-files/Media';

const Player_Pause = async setGlobalVariableValue => {
  try {
    await Media.pause();
    setGlobalVariableValue({
      key: 'PLAYER_STATE',
      value: 'paused',
    });
  } catch (err) {
    console.error(err);
  }
};

export default Player_Pause;
