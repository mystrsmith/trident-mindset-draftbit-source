import * as Media from '../custom-files/Media';

// Increments the current track by given seconds
const Player_SeekBy = async seconds => {
  try {
    await Media.seekBy(seconds);
  } catch (err) {
    console.error(err);
  }
};

export default Player_SeekBy;
