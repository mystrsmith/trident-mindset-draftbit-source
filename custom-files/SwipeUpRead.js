import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const SwipeUpRead = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.swipeToReadText}>Swipe up to read</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -20,
    alignSelf: 'center',
  },
  swipeToReadText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Rasa_500Medium',
  },
});

export default SwipeUpRead;
