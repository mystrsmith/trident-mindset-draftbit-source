import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Platform,
} from 'react-native';

const DismissKeyboardHOC = Comp => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        if (Platform.OS !== 'web') Keyboard.dismiss();
      }}
      accessible={false}
    >
      <Comp {...props}>{children}</Comp>
    </TouchableWithoutFeedback>
  );
};
const Index = DismissKeyboardHOC(View);

export { Index };
