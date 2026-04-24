import React from 'react';
import { Platform } from 'react-native';
import WheelPicker from 'react-native-wheely';

const Index = ({ value, setValue, options = [], onChange = () => {} }) => {
  const indexFound = options?.findIndex(option => option === value) ?? -1;
  const selectedIndex = indexFound !== -1 ? indexFound : 0;

  return (
    <WheelPicker
      selectedIndex={selectedIndex}
      options={options}
      onChange={index => {
        setValue(options[index]);
        if (onChange) onChange();
      }}
      itemTextStyle={{
        paddingTop: 2,
        fontSize: Platform.OS === 'ios' ? 35 : 25,
        fontWeight: 'bold',
        fontFamily: 'Rasa_700Bold',
        color: 'white',
      }}
      selectedIndicatorStyle={{
        borderRadius: 12,
        backgroundColor: 'transparent',
      }}
      containerStyle={{
        left: -50,
      }}
      scaleFunction={x => 0.7}
    />
  );
};

export { Index };
