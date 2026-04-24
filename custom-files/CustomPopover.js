import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Popover from 'react-native-popover-view';
import { Icon } from '@draftbit/ui';

function Index({ theme, label }) {
  return (
    <Popover
      from={
        <TouchableOpacity activeOpacity={1}>
          <Icon
            color={'white'}
            name={'Ionicons/information-circle'}
            size={18}
          />
        </TouchableOpacity>
      }
    >
      <Text style={styles.label}>{label}</Text>
    </Popover>
  );
}

const styles = StyleSheet.create({
  label: {
    padding: 9,
    fontSize: 16,
    fontFamily: 'Rasa_500Medium',
  },
});

export { Index };
