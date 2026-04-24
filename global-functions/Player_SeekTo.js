import * as Media from '../custom-files/Media';

const Player_SeekTo = async milliseconds => {
  try {
    const ms = Number(milliseconds);
    if (!Number.isFinite(ms) || ms < 0) return;
    await Media.seekTo(ms / 1000);
  } catch (err) {
    console.error(err);
  }
};

export default Player_SeekTo;
