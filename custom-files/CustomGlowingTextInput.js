import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { TextInput, withTheme } from '@draftbit/ui';
import palettes from '../themes/palettes';
import * as GlobalStyles from '../GlobalStyles.js';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';

const IndexComponent = props => {
  const {
    theme,
    style,
    onFocus,
    onBlur,
    onChangeText,
    value,
    ...textInputProps
  } = props;
  const dimensions = useWindowDimensions();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = e => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = e => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderRadius = style?.borderRadius || 8;

  const wrapperStyle = {
    borderWidth: 1,
    borderColor: isFocused ? palettes.App.Studily_Primary : palettes.App.White,
    borderRadius,
    ...(isFocused && {
      ...(Platform.OS === 'ios' && {
        shadowColor: palettes.App.Studily_Primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      }),
      ...(Platform.OS === 'android' && {
        elevation: 8,
        shadowColor: palettes.App.Studily_Primary,
      }),
    }),
  };

  const defaultTextAreaStyle = StyleSheet.applyWidth(
    StyleSheet.compose(GlobalStyles.TextInputStyles(theme)['Text Area'].style, {
      backgroundColor: palettes.Brand.Dark_Blue,
      color: palettes.App.White,
      fontFamily: 'Rasa_400Regular',
      fontSize: 14,
      height: 48,
      marginTop: 0,
    }),
    dimensions.width
  );

  const defaultProps = {
    autoCorrect: true,
    changeTextDelay: 500,
    multiline: true,
    textAlignVertical: 'top',
    webShowOutline: true,
    numberOfLines: 5,
    placeholder: 'Optional',
    placeholderTextColor: palettes.App.Studily_Secondary_UI,
    ...GlobalStyles.TextInputStyles(theme)['Text Area'].props,
  };

  // Safely handle value prop and remove defaultValue to avoid conflicts
  const safeTextInputProps = textInputProps || {};
  const { defaultValue, ...restTextInputProps } = safeTextInputProps;

  const mergedProps = {
    ...defaultProps,
    ...restTextInputProps,
    onChangeText,
  };

  // Only add value if it's defined (controlled component)
  if (value !== undefined) {
    mergedProps.value = value;
    mergedProps.defaultValue = undefined;
  }

  const mergedStyle = [
    defaultTextAreaStyle,
    style,
    {
      borderWidth: 0,
      borderColor: 'transparent',
      ...(Platform.OS === 'ios' && {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
      }),
      ...(Platform.OS === 'android' && {
        elevation: 0,
      }),
    },
  ];

  return (
    <View style={wrapperStyle} collapsable={false}>
      <TextInput
        {...mergedProps}
        style={mergedStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </View>
  );
};

export const Index = withTheme(IndexComponent);
