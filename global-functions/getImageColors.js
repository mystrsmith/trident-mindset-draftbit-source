import * as CommonPackages from '../custom-files/CommonPackages';

const getImageColors = async url => {
  const getColors = CommonPackages?.getColors;
  if (!url) {
    return;
  }
  const result = await getColors(yunaUrl, {
    fallback: '#000000',
    pixelSpacing: 5,
  });
  switch (result.platform) {
    case 'android':
    case 'web':
      return {
        colorOne: result.lightVibrant,
        colorTwo: result.dominant,
        colorThree: result.vibrant,
        colorFour: result.darkVibrant,
      };
    case 'ios':
      return {
        colorOne: result.background,
        colorTwo: result.detail,
        colorThree: result.primary,
        colorFour: result.secondary,
      };
    default:
      throw new Error('Unexpected platform');
  }
};

export default getImageColors;
