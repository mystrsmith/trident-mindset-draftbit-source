import { Platform } from 'react-native';
import { getMimeTypeFromFilename } from '@shopify/mime-types';

async function assetToBase64(asset) {
  if (Platform.OS === 'web') {
    return asset.uri;
  } else {
    const FileSystem = await import('expo-file-system');
    const mimeType = asset.mimeType ?? getMimeTypeFromFilename(asset.uri);

    const fileBase64 = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return 'data:' + mimeType + ';base64,' + fileBase64;
  }
}

export default assetToBase64;
