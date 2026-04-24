import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const Index = ({ source, blurhash, contentFit, transition, borderRadius }) => {
  return (
    <Image
      style={[
        styles.image,
        {
          borderRadius: borderRadius,
        },
      ]}
      source={source}
      placeholder={{ blurhash }}
      contentFit={contentFit}
      transition={transition}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});

export { Index };
