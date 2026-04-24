import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as GlobalVariables from '../config/GlobalVariableContext';

const TesterBanner = () => {
  const Constants = GlobalVariables.useValues();
  const profileDetails = Constants?.PROFILE_DETAILS ?? {};

  const isTester = () => {
    return profileDetails?.is_test_user;
  };

  if (!isTester()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.ribbonContainer}>
        <View style={styles.ribbon}>
          <Text style={styles.text}>TESTER</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: -30,
    zIndex: 9999,
  },
  ribbonContainer: {
    position: 'relative',
  },
  ribbon: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 5,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default TesterBanner;
