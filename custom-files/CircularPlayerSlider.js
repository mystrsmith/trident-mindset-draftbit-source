import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Player_FormatMilliSeconds from '../global-functions/Player_FormatMilliSeconds';
import Player_SeekTo from '../global-functions/Player_SeekTo';
import CircleSlider from './CircleSlider';
import Player_Play from '../global-functions/Player_Play';
import Player_Pause from '../global-functions/Player_Pause';
import waitMilliseconds from '../utils/wait';

const Index = () => {
  const [duration, setDuration] = useState(0);
  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  useEffect(() => {
    setDuration(Constants['PLAYER_POSITON']);
  }, [Constants['PLAYER_POSITON']]);

  const secondValue = duration;
  return (
    <View style={styles.container}>
      <CircleSlider
        duration={duration}
        setDuration={setDuration}
        onValueChange={newValue => {
          setDuration(newValue);
        }}
        onStart={async () => {
          await Player_Pause(setGlobalVariableValue);
        }}
        onRelease={async newValue => {
          setDuration(newValue);
          await Player_SeekTo(newValue);
          await waitMilliseconds(100);
          await Player_Play(setGlobalVariableValue);
        }}
        min={0}
        max={Constants['CURRENTLY_PLAYING_LESSON']?.duration}
      />
      <Text style={styles.textValue}>
        {Player_FormatMilliSeconds(secondValue)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textValue: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 90,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Rasa_700Bold',
  },
});

export { Index };
