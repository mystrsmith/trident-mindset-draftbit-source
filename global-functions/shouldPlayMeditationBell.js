const shouldPlayMeditationBell = (
  intervalBellValue,
  currentPlaybackTime,
  totalPlaybackTime
) => {
  switch (
    isNaN(parseInt(intervalBellValue))
      ? intervalBellValue
      : parseInt(intervalBellValue)
  ) {
    case 0:
      return false; // 'No interval bell'
    case 1:
      return Math.floor(currentPlaybackTime) % 60 === 0; // 'Every minute'
    case 2:
      return Math.floor(currentPlaybackTime) % 120 === 0; // 'Every 2 minutes'
    case 5:
      return Math.floor(currentPlaybackTime) % 300 === 0; // 'Every 5 minutes'
    case 10:
      return Math.floor(currentPlaybackTime) % 600 === 0; // 'Every 10 minutes'
    case 'halfway':
      return (
        Math.floor(currentPlaybackTime) === Math.floor(totalPlaybackTime / 2)
      ); // 'Halfway'
    default:
      return false;
  }
};

export default shouldPlayMeditationBell;
