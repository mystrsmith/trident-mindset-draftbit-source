import React from 'react';
import { Divider, Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Modal, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = {
  description: null,
  onClose: () => {},
  title: null,
  visible: false,
};

const ModalRedeemCodeSuccessfullyBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const inputValidation = () => {
    let foundError = false;

    if (name.length < 1) {
      setErrorMessage('Please enter your Name');
      foundError = true;
      return foundError;
    } else {
      setErrorMessage('');
    }

    // if (lastName.length < 1) {
    //     setErrorMessage("Please enter Last Name")
    //     foundError = true;
    //     return foundError;

    // } else {
    //     setErrorMessage("")
    // }

    return foundError;
  };

  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      animationType={'fade'}
      transparent={true}
      visible={Boolean(props.visible ?? defaultProps.visible)}
    >
      {/* Overlay */}
      <View
        style={StyleSheet.applyWidth(
          {
            backgroundColor: palettes.App.Overlay,
            height: '100%',
            position: 'absolute',
            width: '100%',
          },
          dimensions.width
        )}
      />
      <View
        style={StyleSheet.applyWidth(
          { alignItems: 'center', flex: 1, justifyContent: 'center' },
          dimensions.width
        )}
      >
        {/* Card */}
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: palettes.App['Custom Color'],
              borderRadius: 8,
              overflow: 'hidden',
              paddingTop: 16,
              width: '70%',
            },
            dimensions.width
          )}
        >
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                fontFamily: 'Rasa_600SemiBold',
                fontSize: 23,
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {props.title ?? defaultProps.title}
          </Text>
          {/* Message */}
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                fontFamily: 'Rasa_400Regular',
                fontSize: 22,
                marginTop: 6,
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {props.description ?? defaultProps.description}
          </Text>
          <Divider
            color={theme.colors.border.base}
            {...GlobalStyles.DividerStyles(theme)['Divider'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.DividerStyles(theme)['Divider'].style,
                { marginTop: 16 }
              ),
              dimensions.width
            )}
          />
          {/* CTAs */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                height: 50,
                justifyContent: 'center',
                paddingBottom: 7,
                paddingTop: 7,
                width: '100%',
              },
              dimensions.width
            )}
          >
            {/* Close */}
            <Pressable
              onPress={() => {
                try {
                  props.onClose?.();
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
              style={StyleSheet.applyWidth(
                { height: '100%', width: '100%' },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      { fontFamily: 'Rasa_500Medium', fontSize: 20 }
                    ),
                    dimensions.width
                  )}
                >
                  {'Close'}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default withTheme(ModalRedeemCodeSuccessfullyBlock);
