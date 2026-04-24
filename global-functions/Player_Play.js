import * as Media from '../custom-files/Media';

const Player_Play = async setGlobalVariableValue => {
  try {
    await Media.play();
    setGlobalVariableValue({
      key: 'PLAYER_STATE',
      value: 'playing',
    });
  } catch (err) {
    console.error(err);
  }
};

export default Player_Play;
