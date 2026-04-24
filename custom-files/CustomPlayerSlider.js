import Slider from '@react-native-community/slider';
import * as GlobalStyles from '../GlobalStyles.js';
import * as StyleSheet from '../utils/StyleSheet';
import * as GlobalVariables from '../config/GlobalVariableContext';
import palettes from '../themes/palettes';
import { View } from 'react-native';
import Player_SeekTo from '../global-functions/Player_SeekTo';
import Player_Play from '../global-functions/Player_Play';
import Player_Pause from '../global-functions/Player_Pause';
import useWindowDimensions from '../utils/useWindowDimensions';

const Index = ({ theme }) => {
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const isPlayingAdvanceProgram =
    Constants['CURRENTLY_PLAYING_LESSON']?.isAdvanceProgramLesson;

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Slider
        value={Constants['PLAYER_POSITON']}
        onSlidingComplete={async newSliderValue => {
          setGlobalVariableValue({
            key: 'PLAYER_POSITON',
            value: newSliderValue,
          });
          await Player_SeekTo(newSliderValue);
        }}
        {...GlobalStyles.SliderStyles(theme)['Slider'].props}
        maximumTrackTintColor={theme.colors.text.light}
        maximumValue={Constants['CURRENTLY_PLAYING_LESSON']?.duration}
        minimumTrackTintColor={
          isPlayingAdvanceProgram
            ? palettes.Brand['Red 1']
            : palettes.App['App Buttons Color']
        }
        style={StyleSheet.applyWidth(
          GlobalStyles.SliderStyles(theme)['Slider'].style,
          dimensions.width
        )}
        thumbTintColor={
          isPlayingAdvanceProgram
            ? palettes.Brand['Red 1']
            : palettes.App['App Buttons Color']
        }
      />
    </View>
  );
};

export { Index };
