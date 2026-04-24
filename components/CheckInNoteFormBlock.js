import React from 'react';
import { SimpleStyleFlatList, TextInput, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { lessonDetailResponseParam: null };

const CheckInNoteFormBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [checkInAnswers, setCheckInAnswers] = React.useState([]);
  const checkInAnswersAtIndex = (checkInAnswers, index) => {
    return checkInAnswers[index];
  };

  const forceSmallestCoinPercentage = percentage => {
    if (percentage === 0) {
      return 0.01;
    }
    return percentage;
  };

  const onChangeCheckInAnswer = (checkInAnswers, newTextAreaValue, index) => {
    const updatedAnswers = [...checkInAnswers];
    updatedAnswers[index] = newTextAreaValue;
    setCheckInAnswers(updatedAnswers);
  };

  return (
    <SimpleStyleFlatList
      data={Constants['APP_CONFIG']?.checkin_questions}
      decelerationRate={'normal'}
      horizontal={false}
      inverted={false}
      keyExtractor={(listData, index) =>
        listData?.id ??
        listData?.uuid ??
        index?.toString() ??
        JSON.stringify(listData)
      }
      keyboardShouldPersistTaps={'never'}
      listKey={'List'}
      nestedScrollEnabled={false}
      numColumns={1}
      onEndReachedThreshold={0.5}
      pagingEnabled={false}
      renderItem={({ item, index }) => {
        const listData = item;
        return (
          <>
            {/* Question */}
            <View
              style={StyleSheet.applyWidth({ marginTop: 25 }, dimensions.width)}
            >
              {/* Row */}
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'flex-start', flexDirection: 'row' },
                  dimensions.width
                )}
              >
                <Image
                  {...GlobalStyles.ImageStyles(theme)['Image'].props}
                  resizeMode={'contain'}
                  source={imageSource(Images['IcBrain'])}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.ImageStyles(theme)['Image'].style,
                      { height: 25, width: 25 }
                    ),
                    dimensions.width
                  )}
                />
                {/* Text 2 */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand.Surface,
                        flex: 1,
                        fontFamily: 'Rasa_500Medium',
                        fontSize: 18,
                        paddingLeft: 10,
                        textAlign: 'left',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {listData}
                </Text>
              </View>
              <TextInput
                autoCorrect={true}
                changeTextDelay={500}
                multiline={true}
                onChangeText={newTextAreaValue => {
                  try {
                    onChangeCheckInAnswer(
                      checkInAnswers,
                      newTextAreaValue,
                      index
                    );
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                textAlignVertical={'top'}
                webShowOutline={true}
                {...GlobalStyles.TextInputStyles(theme)['Text Area'].props}
                defaultValue={checkInAnswersAtIndex(checkInAnswers, index)}
                numberOfLines={5}
                placeholder={'Answer here'}
                placeholderTextColor={palettes.App.Overlay}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextInputStyles(theme)['Text Area'].style,
                    {
                      backgroundColor: palettes.Brand.Surface,
                      color: theme.colors.background.brand,
                      fontFamily: 'Rasa_400Regular',
                      fontSize: 14,
                      height: 65,
                      marginLeft: 30,
                      marginTop: 20,
                    }
                  ),
                  dimensions.width
                )}
              />
            </View>
          </>
        );
      }}
      showsHorizontalScrollIndicator={true}
      showsVerticalScrollIndicator={true}
      snapToAlignment={'start'}
    />
  );
};

export default withTheme(CheckInNoteFormBlock);
