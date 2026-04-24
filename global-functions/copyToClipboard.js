import * as Clipboard from 'expo-clipboard';
import * as ShowMessage from '../custom-files/ShowMessage';

const copyToClipboard = async text => {
  await Clipboard.setStringAsync(
    text.concat(
      'Download the app to learn more about the tactic. iOS: https://apps.apple.com/in/app/trident-mindset/id1616593368 Android: https://play.google.com/store/apps/details?id=com.pikwxwpq5b1i.plgj6rakapp&hl=en&gl=US'
    )
  );
  ShowMessage.myMessage({
    message: `Copied`,
    description: `Link is copied to your clipboard`,
  });
};

export default copyToClipboard;
