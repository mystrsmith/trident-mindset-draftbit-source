const Player_FormatMilliSeconds = milliseconds => {
  // Check if milliseconds is a valid number
  if (typeof milliseconds !== 'number' || isNaN(milliseconds)) {
    return '';
  }
  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Add leading zeros if necessary
  const formattedMinutes = minutes < 1 ? '0' + minutes : minutes;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

  // Return formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
};

export default Player_FormatMilliSeconds;
