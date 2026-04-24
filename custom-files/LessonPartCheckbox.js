import React from 'react';
import { View, Pressable } from 'react-native';
import { Icon } from '@draftbit/ui';
import * as XanoBackendApi from '../apis/XanoBackendApi';
import palettes from '../themes/palettes';
import useWindowDimensions from '../utils/useWindowDimensions';
import * as StyleSheet from '../utils/StyleSheet';
import triggerHapticFeedback from '../global-functions/triggerHapticFeedback';
import * as GlobalVariables from '../config/GlobalVariableContext';

const Index = ({
  part,
  checkedPart,
  setCheckedPart,
  currentLesson,
  setCurrentLesson,
  setIsLoadingComplete,
}) => {
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  return (
    <View
      style={StyleSheet.applyWidth(
        {
          alignItems: 'center',
          flexDirection: 'row',
          height: 35,
          justifyContent: 'center',
          marginRight: 10,
          width: 35,
        },
        dimensions.width
      )}
    >
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flexDirection: 'row',
            height: 35,
            justifyContent: 'center',
            width: 35,
          },
          dimensions.width
        )}
      >
        {checkedPart ? (
          <Pressable
            onPress={async () => {
              try {
                triggerHapticFeedback();
                setIsLoadingComplete(true);
                setCheckedPart(false);
                await XanoBackendApi.deleteCompletedPartLessonDELETE(
                  Constants,
                  {
                    lesson_id: currentLesson?.id,
                    part: part,
                  }
                );
                const resultLessonDetail = (
                  await XanoBackendApi.getLessonDetailsGET(Constants, {
                    lesson_id: currentLesson?.id,
                  })
                )?.json;
                setCurrentLesson(resultLessonDetail?.current_lesson);
                setIsLoadingComplete(false);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  backgroundColor: palettes.App['Success'],
                  borderColor: palettes.App['Success'],
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 2,
                  borderWidth: 3,
                },
                dimensions.width
              )}
            >
              <Icon
                color={palettes.App['White']}
                name={'Feather/check'}
                size={16}
              />
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={async () => {
              try {
                triggerHapticFeedback();
                setCheckedPart(true);

                await XanoBackendApi.createCompletedPartLessonsPOST(Constants, {
                  lesson_id: currentLesson?.id,
                  part: part,
                });
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  backgroundColor: palettes.App['Dark Cornflower Blue'],
                  borderColor: 'transparent',
                  borderWidth: 3,
                  height: 28,
                  width: 28,
                  borderRadius: 14,
                },
                dimensions.width
              )}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export { Index };
